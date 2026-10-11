#!/usr/bin/env node
/**
 * run-ab.mjs - Layer 1 real-runner: paired with-skill vs baseline provider sessions.
 *
 * `evals/run-behavioral.mjs` scores transcripts that some other harness already
 * recorded. This runner is the bridge that actually launches the sessions, so a
 * with/without delta can be measured instead of assumed, and then hands the two
 * recorded arms to `run-behavioral.mjs` for scoring. Scoring is never
 * reimplemented here: every number in the report comes from the imported scorer.
 *
 * Usage:
 *   node evals/harness/run-ab.mjs --fixture evals/behavioral/<skill>.json \
 *     [--trials <n>] [--provider <id>] [--model <id>] [--endpoint <url>] \
 *     [--api-key-env <VAR>] [--price-in <usd/1k>] [--price-out <usd/1k>] \
 *     [--with-cmd "<cmd>"] [--baseline-cmd "<cmd>"] [--out <dir>] \
 *     [--judge | --mock-judge] [--json] [--dry-run] [--keep-workspaces]
 *
 *   node evals/harness/run-ab.mjs --arm-plan <plan.json>   # internal: one arm child
 *
 * Protocol enforced (evals/README.md, "Protocol: with skill vs without skill"):
 *   1. two arms per trial, `with-skill` and `baseline`;
 *   2. a fresh isolated session per arm and per trial: one child process per
 *      session, its own temporary workspace, no carried-over messages or
 *      artifacts;
 *   3. the same model snapshot in both arms - a mismatch between what the two
 *      arms recorded aborts the run instead of publishing a cross-model delta;
 *   4. at least 3 trials per arm before a delta is reported;
 *   5. pass^k and cost (tokens / duration / $) recorded per arm.
 *
 * The provider key is read from the environment variable named by the resolved
 * `apiKeyEnv` and is never printed, logged, or written to disk. `--dry-run`
 * validates the fixture and prints the plan without touching the network, and is
 * the mode CI runs.
 *
 * Exit codes: 0 = run (or dry run) completed, 1 = validation / key / arm failure,
 * 2 = usage or I/O error.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import { spawn, execFile } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, '..', '..');
const skillsRoot = path.join(repoRoot, '.agents', 'skills');
const judgeConfigPath = path.join(repoRoot, 'evals', 'judge', 'judge.config.json');
const DEFAULT_OUT_DIR = path.join('evals', 'results', 'harness');
const SCORER_PATH = path.join(repoRoot, 'evals', 'run-behavioral.mjs');

export const ARMS = ['with-skill', 'baseline'];
const MIN_TRIALS = 3;
export const MAX_TURNS = 5;
const MAX_OUTPUT_TOKENS = 4096;
const ARM_TIMEOUT_MS = 600000;
const TOOL_OUTPUT_LIMIT = 4000;
const MAX_READ_BYTES = 20000;
const MAX_LIST_ENTRIES = 200;
const MAX_GREP_MATCHES = 50;
const ANTHROPIC_VERSION = '2023-06-01';
const ANTHROPIC_ENDPOINT = 'https://api.anthropic.com/v1/messages';

/* --------------------------------------------------------------- utilities */

const args = parseArgv(process.argv.slice(2));

function parseArgv(argv) {
  const parsed = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const token = argv[i];
    if (!token.startsWith('--')) { parsed._.push(token); continue; }
    const key = token.slice(2);
    const next = argv[i + 1];
    if (next === undefined || next.startsWith('--')) parsed[key] = true;
    else { parsed[key] = next; i += 1; }
  }
  return parsed;
}

function fail(message) {
  console.error(`error: ${message}`);
  process.exit(1);
}

function usageError(message) {
  console.error(`error: ${message}`);
  process.exit(2);
}

function warn(message) {
  console.error(`warn: ${message}`);
}

function asString(value) {
  return typeof value === 'string' && value.trim() !== '' ? value : null;
}

function asNumber(value) {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim() !== '' && Number.isFinite(Number(value))) return Number(value);
  return null;
}

function numberOr(value, fallback = null) {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function truncate(text, limit) {
  const value = typeof text === 'string' ? text : String(text ?? '');
  if (value.length <= limit) return value;
  return `${value.slice(0, limit)}\n[truncated at ${limit} characters]`;
}

function sha256(text) {
  return crypto.createHash('sha256').update(text, 'utf8').digest('hex');
}

function timestamp() {
  return new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+Z$/, 'Z');
}

async function exists(filePath) {
  try { await fs.access(filePath); return true; } catch { return false; }
}

async function readJson(filePath) {
  try {
    return JSON.parse(await fs.readFile(filePath, 'utf8'));
  } catch {
    return null;
  }
}

// A repo-relative reference so `loadTranscript` can resolve the artifact against
// the repository root; anything outside the checkout keeps its absolute path,
// which `path.resolve(repoRoot, absolute)` still resolves to.
function repoRef(absolutePath) {
  const relative = path.relative(repoRoot, absolutePath).split(path.sep).join('/');
  return relative.startsWith('..') ? absolutePath : relative;
}

// The scorer is imported lazily: this module's own exports are pure helpers that
// tests use without touching the runner, and importing the scorer at module load
// time would run its argv dispatch against every importer.
let scorerPromise = null;
export function loadScorer() {
  scorerPromise ??= import(pathToFileURL(SCORER_PATH).href);
  return scorerPromise;
}

// Same walk as the scorer's own bundle-skill listing, re-stated here because it
// is not part of the scorer's public surface.
async function listBundleSkills() {
  const out = [];
  async function walk(dir) {
    for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const child = path.join(dir, entry.name);
      if (await exists(path.join(child, 'SKILL.md'))) {
        out.push(path.relative(skillsRoot, child).split(path.sep).join('/'));
      } else {
        await walk(child);
      }
    }
  }
  await walk(skillsRoot);
  return new Set(out);
}

/* ----------------------------------------------------- arms (pure builders) */

// Neutral for both arms: it says nothing about skills, so the only difference
// between the arms is the injected skill block. Any steering that appeared here
// would be confounded with the skill effect being measured.
const ARM_SYSTEM = [
  'You are a careful software engineering agent.',
  'You work inside a throwaway workspace. Inspect it with the read, list and grep tools,',
  'run allowlisted commands with the shell tool, and deliver your result as your final answer.',
  'Follow the task instructions exactly, stay concrete, and stop once the deliverable is complete.',
].join(' ');

export function buildArms(fixture, skillBody) {
  const scenario = asString(fixture?.scenario);
  const prompt = asString(fixture?.prompt) ?? scenario ?? '';
  const context = (Array.isArray(fixture?.context) ? fixture.context : [])
    .filter((entry) => typeof entry === 'string' && entry.trim() !== '');

  const lines = [prompt];
  if (context.length > 0) {
    lines.push('', 'Context for this run:', ...context.map((entry) => `- ${entry}`));
  }
  lines.push('', 'Deliver the result as your final answer.');
  const user = lines.join('\n');

  const body = typeof skillBody === 'string' ? skillBody : '';
  const withSystem = [
    ARM_SYSTEM,
    '',
    '## Skill instructions - load them and follow them',
    '',
    body,
  ].join('\n');

  const arm = (mode, system, skillInjected) => ({
    mode,
    skill: fixture?.skill ?? null,
    skillInjected,
    system,
    user,
    systemChars: system.length,
    userChars: user.length,
  });

  return {
    'with-skill': arm('with-skill', withSystem, body.trim() !== ''),
    baseline: arm('baseline', ARM_SYSTEM, false),
  };
}

/**
 * Starter material for one arm workspace. The fixture context is materialised so
 * the read/list/grep tools have something real to work on, and the with-skill
 * arm also gets a copy of the canonical `SKILL.md` to inspect.
 */
export async function seedWorkspace(workspace, { fixture, arm, skillBody }) {
  await fs.mkdir(path.join(workspace, 'context'), { recursive: true });
  await fs.writeFile(path.join(workspace, 'prompt.txt'), `${arm.user}\n`, 'utf8');
  const context = (Array.isArray(fixture?.context) ? fixture.context : [])
    .filter((entry) => typeof entry === 'string' && entry.trim() !== '');
  await fs.writeFile(
    path.join(workspace, 'context', 'notes.md'),
    `# Fixture context\n\n${context.map((entry) => `- ${entry}`).join('\n')}\n`,
    'utf8',
  );
  if (arm.mode === 'with-skill' && typeof skillBody === 'string' && skillBody.trim() !== '') {
    await fs.mkdir(path.join(workspace, 'skill'), { recursive: true });
    await fs.writeFile(path.join(workspace, 'skill', 'SKILL.md'), `${skillBody}\n`, 'utf8');
  }
}

/* ----------------------------------------------------- transcript (pure) */

/**
 * Compose the JSONL events one recorded arm session contributes. Only the six
 * event types the scorer's `loadTranscript` understands are emitted, so a
 * transcript written by this runner is indistinguishable from a hand-recorded
 * one.
 *
 * @param {object} record  arm record from `runTrial` (or a failed-session stub)
 * @param {{path?: string, text?: string}} artifact  final deliverable
 * @returns {object[]} ordered transcript events for a single trial
 */
export function transcriptEventsFor(record, artifact = {}) {
  const events = [];
  const startedAt = numberOr(record?.startedAt, null);
  const ts = startedAt ? new Date(startedAt).toISOString() : new Date().toISOString();

  events.push({
    type: 'session',
    skill: record?.skill ?? null,
    mode: record?.mode ?? null,
    trial: numberOr(record?.trial, null),
    model: record?.model ?? null,
    ts,
  });
  events.push({ type: 'message', role: 'user', content: record?.user ?? '' });

  for (const turn of record?.turns ?? []) {
    if (typeof turn?.text === 'string' && turn.text.trim() !== '') {
      events.push({ type: 'message', role: 'assistant', content: turn.text, turn: turn.index ?? null });
    }
    for (const call of turn?.toolCalls ?? []) {
      events.push({
        type: 'tool_call',
        name: call.name ?? null,
        input: call.input ?? {},
        id: call.id ?? null,
        turn: turn.index ?? null,
        rejected: call.rejected === true,
      });
      events.push({
        type: 'tool_result',
        name: call.name ?? null,
        toolUseId: call.id ?? null,
        ok: call.ok === true,
        rejected: call.rejected === true,
        reason: call.reason ?? null,
        content: typeof call.output === 'string' ? call.output : JSON.stringify(call.output ?? null),
        turn: turn.index ?? null,
      });
    }
  }

  const text = typeof artifact.text === 'string'
    ? artifact.text
    : (typeof record?.finalText === 'string' ? record.finalText : '');
  events.push({
    type: 'artifact',
    path: artifact.path ?? null,
    sha256: sha256(text),
    bytes: Buffer.byteLength(text, 'utf8'),
    text,
  });
  const end = {
    type: 'end',
    status: record?.status ?? 'completed',
    tokens: {
      input: numberOr(record?.usage?.input, null),
      output: numberOr(record?.usage?.output, null),
    },
    costUsd: numberOr(record?.costUsd, null),
    costEstimated: record?.costEstimated === true,
    durationMs: numberOr(record?.durationMs, null),
    turns: numberOr(record?.turnCount, null),
    harness: 'evals/harness/run-ab.mjs',
  };
  if (record?.budgetExhausted) end.budgetExhausted = true;
  if (record?.error) end.error = record.error;
  events.push(end);
  return events;
}

/** Serialise one arm's records into the JSONL the scorer reads. */
export function composeTranscript(records, artifactRefFor) {
  const events = [];
  records.forEach((record, index) => {
    if (index > 0) events.push({ type: 'trial', index: numberOr(record?.trial, index + 1) });
    events.push(...transcriptEventsFor(record, artifactRefFor ? artifactRefFor(record) : {}));
  });
  return `${events.map((event) => JSON.stringify(event)).join('\n')}\n`;
}

/* ------------------------------------------------------------------- cost */

/**
 * Cost in USD for one session's token usage. Prices are USD per 1k tokens, as
 * `{input, output}` or a single number applied to both directions. Returns null
 * rather than guessing whenever a price or a token count is missing, so a
 * missing price never turns into a fabricated number in the report.
 */
export function estimateCost(tokens, pricePer1k) {
  const input = numberOr(tokens?.input, null);
  const output = numberOr(tokens?.output, null);
  if (input === null && output === null) return null;
  const price = typeof pricePer1k === 'number'
    ? { input: pricePer1k, output: pricePer1k }
    : (pricePer1k ?? null);
  const inputPrice = numberOr(price?.input, null);
  const outputPrice = numberOr(price?.output, null);
  if (inputPrice === null && outputPrice === null) return null;
  const inputUsd = input === null || inputPrice === null ? 0 : (input * inputPrice) / 1000;
  const outputUsd = output === null || outputPrice === null ? 0 : (output * outputPrice) / 1000;
  return Math.round((inputUsd + outputUsd) * 1e6) / 1e6;
}

// Approximate list prices (USD per 1k tokens) for the snapshots this repo pins.
// They exist so a run without explicit pricing still reports a cost order of
// magnitude; pass --price-in/--price-out for exact accounting, and treat an
// unknown model as unpriced rather than silently applying the wrong table.
export const DEFAULT_PRICE_PER_1K = {
  'claude-sonnet-4-5': { input: 0.003, output: 0.015 },
  'claude-opus-4-1': { input: 0.015, output: 0.075 },
  'claude-haiku-4-5': { input: 0.001, output: 0.005 },
  'gpt-4o': { input: 0.0025, output: 0.01 },
  'gpt-4o-mini': { input: 0.00015, output: 0.0006 },
};

export function resolvePricing({ model, priceIn, priceOut }) {
  const explicitIn = asNumber(priceIn);
  const explicitOut = asNumber(priceOut);
  if (explicitIn !== null || explicitOut !== null) {
    return {
      pricePer1k: { input: explicitIn ?? explicitOut ?? null, output: explicitOut ?? explicitIn ?? null },
      source: 'flags',
    };
  }
  const known = DEFAULT_PRICE_PER_1K[model];
  if (known) return { pricePer1k: known, source: 'default-table' };
  return { pricePer1k: null, source: 'unpriced' };
}

/* ------------------------------------------------- confined local toolbelt */

export const DEFAULT_TOOLS = [
  {
    name: 'read',
    description: 'Read a UTF-8 text file inside the arm workspace.',
    input_schema: {
      type: 'object',
      properties: { path: { type: 'string', description: 'workspace-relative file path' } },
      required: ['path'],
    },
  },
  {
    name: 'list',
    description: 'List the entries of a directory inside the arm workspace.',
    input_schema: {
      type: 'object',
      properties: { path: { type: 'string', description: 'workspace-relative directory, defaults to the workspace root' } },
    },
  },
  {
    name: 'grep',
    description: 'Search workspace files for a pattern (regular expression) and return matching lines.',
    input_schema: {
      type: 'object',
      properties: {
        pattern: { type: 'string', description: 'regular expression, or a plain substring' },
        path: { type: 'string', description: 'workspace-relative file or directory, defaults to the workspace root' },
      },
      required: ['pattern'],
    },
  },
  {
    name: 'shell',
    description: 'Run one allowlisted command (node --check, ls, cat, grep) inside the arm workspace.',
    input_schema: {
      type: 'object',
      properties: { command: { type: 'string', description: 'single command, no pipes, no redirection, no expansion' } },
      required: ['command'],
    },
  },
];

export const DEFAULT_TOOL_NAMES = DEFAULT_TOOLS.map((tool) => tool.name);

// The shell tool never runs a shell. A command must tokenise into one of these
// binaries with its fixed leading arguments, and every file operand must stay
// inside the arm workspace, so an arm cannot read or touch anything else.
export const SHELL_ALLOWLIST = [
  { bin: 'node', requiredArgs: ['--check'], minOperands: 1 },
  { bin: 'ls', requiredArgs: [], minOperands: 0 },
  { bin: 'cat', requiredArgs: [], minOperands: 1 },
  { bin: 'grep', requiredArgs: [], minOperands: 2 },
];

const SHELL_METACHARACTERS = /[;|&`><\n\r$(){}[\]!*?~\\]/;

/**
 * Split a command into argv without a shell. Quoted runs stay in one token;
 * any metacharacter or expansion is refused rather than interpreted.
 */
export function tokenizeCommand(command) {
  const raw = typeof command === 'string' ? command : '';
  if (raw.trim() === '') return { argv: [], error: 'the shell tool needs a command' };
  const metacharacter = raw.match(SHELL_METACHARACTERS);
  if (metacharacter) {
    return { argv: [], error: `refused: "${metacharacter[0]}" is a shell metacharacter or expansion, and this tool never starts a shell` };
  }
  const argv = [];
  let current = '';
  let quoted = false;
  let quote = null;
  for (const char of raw) {
    if (quote) {
      if (char === quote) { quote = null; continue; }
      current += char;
      continue;
    }
    if (char === '"' || char === "'") { quote = char; quoted = true; continue; }
    if (/\s/.test(char)) {
      if (quoted || current !== '') { argv.push(current); current = ''; quoted = false; }
      continue;
    }
    current += char;
    quoted = true;
  }
  if (quote) return { argv: [], error: 'refused: unbalanced quote in the command' };
  if (quoted || current !== '') argv.push(current);
  return { argv, error: null };
}

/** Decide whether a command may run, before any process is started. */
export function isShellCommandAllowed(command) {
  const { argv, error } = tokenizeCommand(command);
  if (error) return { allowed: false, argv: null, reason: error };
  if (argv.length === 0) return { allowed: false, argv: null, reason: 'the shell tool needs a command' };
  const [bin, ...rest] = argv;
  const rule = SHELL_ALLOWLIST.find((entry) => entry.bin === bin);
  if (!rule) {
    return {
      allowed: false,
      argv: null,
      reason: `refused: "${bin}" is not in the shell allowlist (${SHELL_ALLOWLIST.map((entry) => entry.bin).join(', ')})`,
    };
  }
  for (const required of rule.requiredArgs) {
    if (rest[0] !== required) {
      return {
        allowed: false,
        argv: null,
        reason: `refused: "${bin}" only runs as "${[rule.bin, ...rule.requiredArgs].join(' ')} <file>"`,
      };
    }
  }
  const operands = rest.slice(rule.requiredArgs.length);
  if (operands.length < rule.minOperands) {
    return {
      allowed: false,
      argv: null,
      reason: `refused: "${bin}" needs at least ${rule.minOperands} file operand(s)`,
    };
  }
  return { allowed: true, argv, reason: `allowlisted: ${argv.join(' ')}` };
}

/** Raised when a tool operand points outside the arm workspace. */
export class WorkspaceEscapeError extends Error {}

function resolveInsideWorkspace(workspace, target) {
  const root = path.resolve(workspace);
  const resolved = path.resolve(root, typeof target === 'string' && target.trim() !== '' ? target : '.');
  if (resolved !== root && !resolved.startsWith(`${root}${path.sep}`)) {
    throw new WorkspaceEscapeError(`path escapes the arm workspace: ${JSON.stringify(target)}`);
  }
  return resolved;
}

async function walkFiles(dir, out = []) {
  let entries;
  try { entries = await fs.readdir(dir, { withFileTypes: true }); } catch { return out; }
  for (const entry of entries) {
    const child = path.join(dir, entry.name);
    if (entry.isDirectory()) await walkFiles(child, out);
    else if (entry.isFile()) out.push(child);
  }
  return out;
}

/**
 * The deterministic local toolbelt for one arm. Every tool is confined to the
 * arm's temporary workspace, output is truncated, and a refusal is returned as
 * data (`rejected: true`) so the transcript records the refusal instead of
 * hiding it.
 */
export function createToolbox({ workspace, names = DEFAULT_TOOL_NAMES, limits = {} } = {}) {
  const root = path.resolve(workspace ?? process.cwd());
  const maxReadBytes = limits.maxReadBytes ?? MAX_READ_BYTES;
  const maxOutputChars = limits.maxOutputChars ?? TOOL_OUTPUT_LIMIT;
  const maxListEntries = limits.maxListEntries ?? MAX_LIST_ENTRIES;
  const maxGrepMatches = limits.maxGrepMatches ?? MAX_GREP_MATCHES;
  const definitions = DEFAULT_TOOLS.filter((tool) => names.includes(tool.name));

  const ok = (output) => ({ ok: true, rejected: false, reason: null, output: truncate(output, maxOutputChars) });
  const refused = (reason) => ({ ok: false, rejected: true, reason, output: '' });
  const broken = (reason) => ({ ok: false, rejected: false, reason, output: '' });

  async function toolRead(input) {
    const target = resolveInsideWorkspace(root, input?.path ?? '.');
    const stat = await fs.stat(target).catch(() => null);
    if (!stat?.isFile()) return broken(`read failed: no file at ${String(input?.path ?? '')}`);
    const buffer = await fs.readFile(target);
    if (buffer.includes(0)) return broken(`read failed: ${String(input?.path)} looks binary`);
    const text = buffer.subarray(0, maxReadBytes).toString('utf8');
    const note = buffer.length > maxReadBytes ? `\n[truncated at ${maxReadBytes} bytes]` : '';
    return ok(`${text}${note}`);
  }

  async function toolList(input) {
    const target = resolveInsideWorkspace(root, input?.path ?? '.');
    const stat = await fs.stat(target).catch(() => null);
    if (!stat?.isDirectory()) return broken(`list failed: no directory at ${String(input?.path ?? '')}`);
    const entries = await fs.readdir(target, { withFileTypes: true });
    const shown = entries.slice(0, maxListEntries);
    const lines = shown.map((entry) => (entry.isDirectory() ? `${entry.name}/` : entry.name));
    if (entries.length > shown.length) lines.push(`[${entries.length - shown.length} more entries]`);
    return ok(lines.join('\n'));
  }

  async function toolGrep(input) {
    const pattern = asString(input?.pattern);
    if (!pattern) return broken('grep failed: a pattern is required');
    const target = resolveInsideWorkspace(root, input?.path ?? '.');
    const stat = await fs.stat(target).catch(() => null);
    if (!stat) return broken(`grep failed: nothing at ${String(input?.path ?? '')}`);
    const files = stat.isDirectory() ? await walkFiles(target) : [target];
    let regex;
    try { regex = new RegExp(pattern); } catch { regex = null; }
    const matches = [];
    for (const file of files) {
      const buffer = await fs.readFile(file).catch(() => null);
      if (!buffer || buffer.includes(0)) continue;
      const lines = buffer.toString('utf8').split(/\r?\n/);
      lines.forEach((line, index) => {
        const hit = regex ? regex.test(line) : line.includes(pattern);
        if (hit && matches.length < maxGrepMatches) {
          matches.push(`${path.relative(root, file).split(path.sep).join('/')}:${index + 1}: ${line}`);
        }
      });
      if (matches.length >= maxGrepMatches) break;
    }
    if (matches.length === 0) return ok('(no matches)');
    return ok(`${matches.join('\n')}${matches.length >= maxGrepMatches ? '\n[match limit reached]' : ''}`);
  }

  async function toolShell(input) {
    const command = asString(input?.command);
    if (!command) return refused('the shell tool needs a command');
    const decision = isShellCommandAllowed(command);
    if (!decision.allowed) return refused(decision.reason);
    const [bin, ...rest] = decision.argv;
    const rule = SHELL_ALLOWLIST.find((entry) => entry.bin === bin);
    const operands = rest.slice(rule.requiredArgs.length);
    for (const operand of operands) {
      try { resolveInsideWorkspace(root, operand); }
      catch (error) { return refused(`refused: ${error.message}`); }
    }
    const result = await new Promise((resolve) => {
      execFile(bin, decision.argv.slice(1), { cwd: root, timeout: 5000, maxBuffer: 1024 * 1024 }, (error, stdout, stderr) => {
        resolve({
          code: error && typeof error.code === 'number' ? error.code : (error ? 1 : 0),
          stdout: stdout ?? '',
          stderr: stderr ?? '',
          spawnError: error && error.code === undefined ? error.message : null,
        });
      });
    });
    if (result.spawnError) return broken(`shell failed: ${result.spawnError}`);
    const body = [result.stdout, result.stderr].filter((part) => part.trim() !== '').join('\n');
    const output = `${body}${body === '' ? '' : '\n'}[exit ${result.code}]`;
    return result.code === 0 ? ok(output) : broken(`command exited ${result.code}: ${output}`);
  }

  async function execute(name, input) {
    try {
      switch (name) {
        case 'read': return await toolRead(input);
        case 'list': return await toolList(input);
        case 'grep': return await toolGrep(input);
        case 'shell': return await toolShell(input);
        default: return broken(`unknown tool ${JSON.stringify(name)}`);
      }
    } catch (error) {
      // A containment breach is a refusal, not a crash: the transcript shows the
      // arm tried to leave its workspace and was stopped.
      if (error instanceof WorkspaceEscapeError) return refused(`refused: ${error.message}`);
      return broken(`tool ${JSON.stringify(name)} failed: ${error?.message ?? error}`);
    }
  }

  return { workspace: root, definitions, execute };
}

/* --------------------------------------------------------- provider client */

/**
 * Minimal provider client. One `complete` call posts one request to the
 * provider's messages endpoint and normalises the reply to
 * `{text, toolCalls, usage, stopReason, responseModel, rawContent, rawToolCalls}`.
 *
 * The key is read from the environment on every call and is kept out of the
 * returned object, so no record, plan, or transcript can carry it.
 */
export function createModelClient(config = {}) {
  const provider = asString(config.provider) ?? 'anthropic';
  const model = asString(config.model);
  const apiKeyEnv = asString(config.apiKeyEnv) ?? 'JUDGE_API_KEY';
  const endpoint = asString(config.endpoint)
    ?? (provider === 'anthropic' ? ANTHROPIC_ENDPOINT : null);
  const temperature = asNumber(config.temperature) ?? 0.1;
  const maxTokens = Math.max(1, Math.trunc(asNumber(config.maxTokens) ?? MAX_OUTPUT_TOKENS));

  function readKey() {
    const value = process.env[apiKeyEnv];
    if (typeof value !== 'string' || value.trim() === '') {
      throw new Error(`${apiKeyEnv} is not set in the environment, so no provider session can run (use --dry-run to inspect the plan without a key)`);
    }
    return value;
  }

  async function complete({ system, messages, tools }) {
    const key = readKey();
    if (!model) throw new Error('no model configured: pass --model <id> or set judgeModel in the judge config');
    if (!endpoint) throw new Error(`no endpoint configured for provider "${provider}"`);

    if (provider === 'anthropic') {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-api-key': key,
          'anthropic-version': ANTHROPIC_VERSION,
        },
        body: JSON.stringify({
          model,
          system,
          max_tokens: maxTokens,
          temperature,
          tools: (tools ?? []).map((tool) => ({
            name: tool.name,
            description: tool.description,
            input_schema: tool.input_schema ?? { type: 'object', properties: {} },
          })),
          messages,
        }),
      });
      if (!response.ok) throw new Error(`provider returned HTTP ${response.status}`);
      const payload = await response.json();
      const blocks = Array.isArray(payload.content) ? payload.content : [];
      return {
        text: blocks.filter((block) => block?.type === 'text').map((block) => block.text ?? '').join('\n'),
        toolCalls: blocks
          .filter((block) => block?.type === 'tool_use')
          .map((block) => ({ id: block.id ?? null, name: block.name, input: block.input ?? {} })),
        usage: {
          input: numberOr(payload.usage?.input_tokens, null),
          output: numberOr(payload.usage?.output_tokens, null),
        },
        stopReason: payload.stop_reason ?? null,
        responseModel: asString(payload.model),
        rawContent: blocks,
        rawToolCalls: null,
      };
    }

    // OpenAI-compatible chat completions shape.
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model,
        temperature,
        max_tokens: maxTokens,
        messages: [{ role: 'system', content: system }, ...messages],
        tools: (tools ?? []).map((tool) => ({
          type: 'function',
          function: {
            name: tool.name,
            description: tool.description,
            parameters: tool.input_schema ?? { type: 'object', properties: {} },
          },
        })),
      }),
    });
    if (!response.ok) throw new Error(`provider returned HTTP ${response.status}`);
    const payload = await response.json();
    const message = payload.choices?.[0]?.message ?? {};
    const rawToolCalls = Array.isArray(message.tool_calls) ? message.tool_calls : [];
    return {
      text: typeof message.content === 'string' ? message.content : '',
      toolCalls: rawToolCalls.map((call) => ({
        id: call.id ?? null,
        name: call.function?.name ?? null,
        input: parseToolArguments(call.function?.arguments),
      })),
      usage: {
        input: numberOr(payload.usage?.prompt_tokens, null),
        output: numberOr(payload.usage?.completion_tokens, null),
      },
      stopReason: payload.choices?.[0]?.finish_reason ?? null,
      responseModel: asString(payload.model),
      rawContent: null,
      rawToolCalls,
    };
  }

  return { provider, model, endpoint, apiKeyEnv, complete };
}

function parseToolArguments(raw) {
  if (raw && typeof raw === 'object') return raw;
  try { return JSON.parse(String(raw ?? '{}')); } catch { return {}; }
}

function appendTurnToMessages(messages, provider, { text, rawContent, rawToolCalls, toolCalls }) {
  if (toolCalls.length === 0) return;
  if (provider === 'anthropic') {
    messages.push({
      role: 'assistant',
      content: Array.isArray(rawContent) && rawContent.length > 0
        ? rawContent
        : (text ? [{ type: 'text', text }] : []),
    });
    messages.push({
      role: 'user',
      content: toolCalls.map((call) => ({
        type: 'tool_result',
        tool_use_id: call.id,
        content: typeof call.output === 'string' ? call.output : JSON.stringify(call.output ?? null),
      })),
    });
    return;
  }
  messages.push({
    role: 'assistant',
    content: text === '' ? null : text,
    tool_calls: Array.isArray(rawToolCalls) && rawToolCalls.length > 0
      ? rawToolCalls
      : toolCalls.map((call) => ({
          id: call.id,
          type: 'function',
          function: { name: call.name, arguments: JSON.stringify(call.input ?? {}) },
        })),
  });
  for (const call of toolCalls) {
    messages.push({
      role: 'tool',
      tool_call_id: call.id,
      content: typeof call.output === 'string' ? call.output : JSON.stringify(call.output ?? null),
    });
  }
}

/* ------------------------------------------------------------- agent loop */

/**
 * Run one arm session: at most `maxTurns` provider round trips, with local
 * deterministic tool calls in between. Returns the raw record the transcript is
 * composed from. No transcript or artifact file is written here, so this stays
 * usable as a pure-ish unit under a stubbed client.
 */
export async function runTrial({
  arm, trial, workspace, client, toolbox, maxTurns = MAX_TURNS, now = () => Date.now(),
}) {
  const startedAt = now();
  const messages = [{ role: 'user', content: arm.user }];
  const turns = [];
  const usage = { input: 0, output: 0 };
  let finalText = '';
  let status = 'completed';
  let error = null;
  let responseModel = null;
  let budgetExhausted = false;
  let turnIndex = 0;

  while (turnIndex < maxTurns) {
    turnIndex += 1;
    let response;
    try {
      response = await client.complete({ system: arm.system, messages, tools: toolbox.definitions });
    } catch (callError) {
      status = 'failed';
      error = callError?.message ?? String(callError);
      break;
    }
    responseModel ??= response.responseModel ?? null;
    usage.input += numberOr(response.usage?.input, 0);
    usage.output += numberOr(response.usage?.output, 0);

    const requested = Array.isArray(response.toolCalls) ? response.toolCalls : [];
    const executed = [];
    for (const call of requested) {
      if (!call?.name) continue;
      const result = await toolbox.execute(call.name, call.input ?? {});
      executed.push({
        id: call.id ?? null,
        name: call.name,
        input: call.input ?? {},
        ok: result.ok === true,
        rejected: result.rejected === true,
        reason: result.reason ?? null,
        output: result.output ?? '',
      });
    }

    const text = typeof response.text === 'string' ? response.text : '';
    turns.push({ index: turnIndex, text, stopReason: response.stopReason ?? null, toolCalls: executed });
    appendTurnToMessages(messages, client.provider, {
      text, rawContent: response.rawContent, rawToolCalls: response.rawToolCalls, toolCalls: executed,
    });

    if (executed.length === 0) {
      finalText = text;
      break;
    }
    if (turnIndex === maxTurns) budgetExhausted = true;
  }

  const endedAt = now();
  return {
    schema: 'quirk-ab-arm-record',
    version: 1,
    skill: arm.skill ?? null,
    mode: arm.mode ?? null,
    trial: numberOr(trial, null),
    model: responseModel ?? client.model ?? null,
    requestedModel: client.model ?? null,
    status,
    error,
    startedAt,
    endedAt,
    durationMs: endedAt - startedAt,
    usage,
    turnCount: turns.length,
    budgetExhausted,
    user: arm.user,
    turns,
    finalText,
  };
}

export function failedArmRecord({ mode, trial, model, error, user = '', turns = [] }) {
  return {
    schema: 'quirk-ab-arm-record',
    version: 1,
    mode: mode ?? null,
    trial: numberOr(trial, null),
    model: model ?? null,
    status: 'failed',
    error: error?.message ?? String(error ?? 'unknown failure'),
    startedAt: Date.now(),
    endedAt: Date.now(),
    durationMs: 0,
    usage: { input: null, output: null },
    turnCount: turns.length,
    budgetExhausted: false,
    user,
    turns,
    finalText: '',
  };
}

/* --------------------------------------------------- one arm, one process */

function stripFrontmatter(text) {
  if (typeof text !== 'string' || !text.startsWith('---')) return text ?? '';
  const end = text.indexOf('\n---', 3);
  if (end === -1) return text;
  return text.slice(end + 4).replace(/^\s+/, '');
}

/**
 * Read the canonical `SKILL.md` for a bundle skill. Only the skill file itself is
 * injected (progressive disclosure): a skill's `references/` tree stays unloaded
 * until the skill asks for it, exactly as in a real agent harness.
 */
export async function readSkillBody(skill) {
  const skillFile = path.join(skillsRoot, String(skill ?? ''), 'SKILL.md');
  if (!(await exists(skillFile))) {
    throw new Error(`skill "${skill}" has no canonical SKILL.md at ${path.relative(repoRoot, skillFile)}`);
  }
  const text = await fs.readFile(skillFile, 'utf8');
  return { file: skillFile, text, body: stripFrontmatter(text) };
}

function childEnvironment(modelConfig, workspace, plan) {
  // Deliberately small: the arm inherits no session state, and only the paths it
  // needs plus the provider key travel across the process boundary.
  const env = {
    PATH: asString(process.env.PATH) ?? '/usr/local/bin:/usr/bin:/bin',
    HOME: asString(process.env.HOME) ?? os.homedir(),
    TMPDIR: asString(process.env.TMPDIR) ?? os.tmpdir(),
    LANG: 'C.UTF-8',
    AB_WORKSPACE: workspace,
    AB_PLAN: plan.planPath,
    AB_RECORD: plan.recordPath,
    AB_ARM: plan.mode,
    AB_TRIAL: String(plan.trial),
    AB_SKILL: String(plan.skill ?? ''),
    AB_TOOLS: (plan.tools ?? DEFAULT_TOOL_NAMES).join(','),
    AB_MAX_TURNS: String(plan.maxTurns ?? MAX_TURNS),
    AB_MODEL: String(plan.model?.model ?? ''),
    AB_PROVIDER: String(plan.model?.provider ?? ''),
    AB_ENDPOINT: String(plan.model?.endpoint ?? ''),
  };
  const envName = modelConfig.apiKeyEnv;
  const key = process.env[envName];
  if (typeof key === 'string' && key !== '') env[envName] = key;
  return env;
}

function runProcess(command, commandArgs, { cwd, env, timeout = ARM_TIMEOUT_MS }) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, commandArgs, { cwd, env, stdio: ['ignore', 'pipe', 'pipe'] });
    let stdout = '';
    let stderr = '';
    let settled = false;
    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      child.kill('SIGKILL');
      reject(new Error(`arm process timed out after ${timeout}ms`));
    }, timeout);
    child.stdout.on('data', (chunk) => { stdout += chunk; });
    child.stderr.on('data', (chunk) => { stderr += chunk; });
    child.on('error', (error) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      reject(new Error(`arm process could not start: ${error.message}`));
    });
    child.on('close', (code) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve({ code, stdout, stderr });
    });
  });
}

/** Internal entry point: the child process that runs exactly one arm session. */
export async function runArmFromPlan(planPath) {
  const plan = await readJson(planPath);
  if (!plan || typeof plan !== 'object') usageError(`arm plan not readable: ${planPath}`);
  const workspace = path.resolve(plan.workspace ?? process.cwd());
  const toolbox = createToolbox({ workspace, names: plan.tools ?? DEFAULT_TOOL_NAMES });
  const client = createModelClient(plan.model ?? {});
  const arm = plan.arm ?? {};
  let record;
  try {
    record = await runTrial({
      arm, trial: plan.trial, workspace, client, toolbox, maxTurns: plan.maxTurns ?? MAX_TURNS,
    });
  } catch (error) {
    record = failedArmRecord({ mode: plan.mode, trial: plan.trial, model: plan.model?.model, error, user: arm.user ?? '' });
  }
  await fs.mkdir(path.dirname(plan.recordPath), { recursive: true });
  await fs.writeFile(plan.recordPath, `${JSON.stringify(record, null, 2)}\n`, 'utf8');
  return record.status === 'failed' ? 1 : 0;
}

/**
 * Launch one arm session in its own child process with its own workspace. The
 * child records its session to `record.json` inside that workspace, so nothing
 * about a session survives into the next one.
 */
async function launchArm({ fixture, file, mode, trial, skillBody, modelConfig, tools, maxTurns, workspace, command, armTimeout }) {
  const arms = buildArms(fixture, skillBody);
  const arm = arms[mode];
  await seedWorkspace(workspace, { fixture, arm, skillBody });

  const plan = {
    schema: 'quirk-ab-arm-plan',
    version: 1,
    skill: fixture.skill ?? null,
    mode,
    trial,
    fixturePath: file ? repoRef(path.resolve(file)) : null,
    workspace,
    planPath: path.join(workspace, 'plan.json'),
    recordPath: path.join(workspace, 'record.json'),
    arm,
    tools: tools ?? DEFAULT_TOOL_NAMES,
    maxTurns: maxTurns ?? MAX_TURNS,
    model: {
      provider: modelConfig.provider,
      model: modelConfig.model,
      endpoint: modelConfig.endpoint,
      apiKeyEnv: modelConfig.apiKeyEnv,
      temperature: modelConfig.temperature,
      maxTokens: modelConfig.maxTokens,
    },
  };
  await fs.writeFile(plan.planPath, `${JSON.stringify(plan, null, 2)}\n`, 'utf8');

  const env = childEnvironment(modelConfig, workspace, plan);
  const useCustom = typeof command === 'string' && command.trim() !== '';
  const [commandName, commandArgs] = useCustom
    ? [(process.platform === 'win32' ? 'cmd' : '/bin/sh'), ['-c', command]]
    : [process.execPath, [fileURLToPath(import.meta.url), '--arm-plan', plan.planPath]];
  const result = await runProcess(commandName, commandArgs, { cwd: workspace, env, timeout: armTimeout });

  const record = await readJson(plan.recordPath);
  if (!record) {
    throw new Error(`arm ${mode} trial ${trial} produced no record (exit ${result.code})${result.stderr.trim() ? `: ${truncate(result.stderr.trim(), 400)}` : ''}`);
  }
  return record;
}

/* ----------------------------------------------------------- configuration */

async function loadJudgeConfig() {
  const config = await readJson(judgeConfigPath);
  if (!config) {
    warn(`judge config ${path.relative(repoRoot, judgeConfigPath)} is unreadable; using CLI overrides only`);
    return null;
  }
  return config;
}

function resolveModelConfig(judgeConfig) {
  const provider = asString(args.provider) ?? asString(judgeConfig?.judgeProvider) ?? 'anthropic';
  const model = asString(args.model) ?? asString(judgeConfig?.judgeModel);
  const endpoint = asString(args.endpoint) ?? asString(judgeConfig?.endpoint)
    ?? (provider === 'anthropic' ? ANTHROPIC_ENDPOINT : null);
  const apiKeyEnv = asString(args['api-key-env']) ?? asString(judgeConfig?.apiKeyEnv) ?? 'JUDGE_API_KEY';
  const temperature = asNumber(args.temperature) ?? asNumber(judgeConfig?.temperature) ?? 0.1;
  const maxTokens = Math.max(1, Math.trunc(asNumber(args['max-tokens']) ?? MAX_OUTPUT_TOKENS));
  return { provider, model, endpoint, apiKeyEnv, temperature, maxTokens };
}

function keyDefined(envName) {
  const value = process.env[envName];
  return typeof value === 'string' && value.trim() !== '';
}

// Same fallback ladder as the scorer: an explicit --mock-judge wins, then a
// missing key degrades to a loudly-labelled mock judge, and only a present key
// grades for real.
function resolveJudgeConfig(judgeConfig) {
  const envName = asString(args['api-key-env']) ?? asString(judgeConfig?.apiKeyEnv) ?? 'JUDGE_API_KEY';
  const requestedMock = Boolean(args['mock-judge']);
  const judge = { mock: true, real: false, model: judgeConfig?.judgeModel ?? null, snapshot: judgeConfig?.snapshot ?? null };
  if (requestedMock) {
    return { ...judge, mode: 'mock', reason: '--mock-judge requested', config: judgeConfig ?? {} };
  }
  if (!keyDefined(envName)) {
    return {
      ...judge,
      mode: 'mock',
      reason: `${envName} is not set in the environment, so judge assertions are echoed instead of graded`,
      config: judgeConfig ?? {},
    };
  }
  if (judgeConfig && judgeConfig.pinnedSnapshot === false) {
    warn('judge config is not pinned to a snapshot; calibration numbers are void');
  }
  return {
    mock: false,
    real: true,
    mode: 'live',
    reason: `judge ${judgeConfig?.judgeProvider ?? 'unknown'}/${judgeConfig?.judgeModel ?? 'unknown'}`,
    config: judgeConfig ?? {},
    model: judgeConfig?.judgeModel ?? null,
    snapshot: judgeConfig?.snapshot ?? null,
  };
}

/** Trials per arm: never below the protocol floor, and never below the fixture. */
export function resolveTrials(fixture) {
  const declared = Number.isInteger(fixture?.trials) && fixture.trials >= 1 ? fixture.trials : MIN_TRIALS;
  if (args.trials === undefined || args.trials === true) return Math.max(MIN_TRIALS, declared);
  const requested = asNumber(args.trials);
  if (requested === null || !Number.isInteger(requested) || requested < 1) {
    usageError('--trials must be a positive integer');
  }
  if (requested < MIN_TRIALS) {
    fail(`--trials ${requested} is below the protocol floor of ${MIN_TRIALS} trials per arm (evals/README.md, "at least 3 trials per arm before believing a delta")`);
  }
  return requested;
}

async function resolveFixtureFile() {
  const raw = asString(args.fixture);
  if (!raw) usageError('--fixture <file.json> is required');
  const candidates = [path.resolve(process.cwd(), raw), path.resolve(repoRoot, raw)];
  for (const candidate of candidates) {
    if (await exists(candidate)) return candidate;
  }
  fail(`fixture not found: ${raw}`);
  return null;
}

async function loadValidatedFixture() {
  const file = await resolveFixtureFile();
  const fixture = await readJson(file);
  if (!fixture || typeof fixture !== 'object') fail(`${path.relative(repoRoot, file)}: not valid JSON`);
  const scorer = await loadScorer();
  const errors = await scorer.validateFixture(fixture, file, await listBundleSkills());
  if (errors.length > 0) {
    for (const error of errors) console.error(`ERROR ${error}`);
    fail(`${errors.length} fixture schema error(s) in ${path.relative(repoRoot, file)}`);
  }
  return { fixture, file };
}

/* ---------------------------------------------------------------- dry run */

async function modeDryRun() {
  const { fixture, file } = await loadValidatedFixture();
  const judgeConfig = await loadJudgeConfig();
  const modelConfig = resolveModelConfig(judgeConfig);
  const judge = resolveJudgeConfig(judgeConfig);
  const trials = resolveTrials(fixture);
  const pricing = resolvePricing({ model: modelConfig.model, priceIn: args['price-in'], priceOut: args['price-out'] });
  const skill = await readSkillBody(fixture.skill).catch((error) => {
    fail(error.message);
    return null;
  });
  const arms = buildArms(fixture, skill?.body ?? '');
  const outDir = path.resolve(repoRoot, asString(args.out) ?? DEFAULT_OUT_DIR);
  const assertions = Array.isArray(fixture.assertions) ? fixture.assertions : [];
  const plan = {
    runner: 'evals/harness/run-ab.mjs',
    dryRun: true,
    networkCalls: 0,
    status: 'plan-ok',
    fixture: {
      file: path.relative(repoRoot, file),
      id: fixture.id ?? null,
      skill: fixture.skill,
      scenario: fixture.scenario,
      declaredTrials: fixture.trials ?? null,
      assertions: {
        total: assertions.length,
        deterministic: assertions.filter((entry) => entry.type === 'deterministic').length,
        judge: assertions.filter((entry) => entry.type === 'judge').length,
      },
    },
    protocol: {
      arms: ARMS,
      trialsPerArm: trials,
      sessions: trials * ARMS.length,
      freshWorkspacePerArmAndTrial: true,
      oneChildProcessPerSession: true,
      maxTurnsPerSession: MAX_TURNS,
      sameModelSnapshotInBothArms: true,
      minTrialsEnforced: MIN_TRIALS,
    },
    arms: ARMS.map((mode) => ({
      mode,
      skillInjected: arms[mode].skillInjected,
      systemChars: arms[mode].systemChars,
      userChars: arms[mode].userChars,
      skillFile: mode === 'with-skill' ? path.relative(repoRoot, skill?.file ?? '') : null,
    })),
    model: {
      provider: modelConfig.provider,
      model: modelConfig.model,
      endpoint: modelConfig.endpoint,
      temperature: modelConfig.temperature,
      maxTokens: modelConfig.maxTokens,
      apiKeyEnv: modelConfig.apiKeyEnv,
      apiKeyPresent: keyDefined(modelConfig.apiKeyEnv),
      pricing,
    },
    judge: { mode: judge.mode, reason: judge.reason, model: judge.model, snapshot: judge.snapshot },
    tools: DEFAULT_TOOL_NAMES,
    shellAllowlist: SHELL_ALLOWLIST.map((entry) => [entry.bin, ...entry.requiredArgs].join(' ').trim()),
    toolConfinement: 'every tool resolves inside the per-arm temporary workspace',
    outputs: {
      directory: path.relative(repoRoot, outDir),
      transcripts: ARMS.length,
      artifacts: trials * ARMS.length,
      report: `${String(fixture.skill).split('/').pop()}-<timestamp>.report.json`,
    },
    note: 'dry run validates the fixture and prints this plan; no provider session was started and no report was written',
  };

  if (args.json) {
    console.log(JSON.stringify(plan, null, 2));
  } else {
    const lines = [
      'run-ab dry run - Layer 1 A/B plan (no provider session started, no report written)',
      '',
      `fixture: ${plan.fixture.file} (skill ${fixture.skill}, declared ${fixture.trials ?? '?'} trials, ${plan.fixture.assertions.total} assertions: ${plan.fixture.assertions.deterministic} deterministic / ${plan.fixture.assertions.judge} judge)`,
      `protocol: ${ARMS.length} arms x ${trials} trials = ${plan.protocol.sessions} fresh provider sessions (one child process and one temporary workspace each)`,
      `arms: with-skill (skill body injected: ${arms['with-skill'].systemChars} system chars) and baseline (no skill: ${arms.baseline.systemChars} system chars)`,
      `skill file: ${path.relative(repoRoot, skill?.file ?? '')} (body only; references/ stay unloaded)`,
      `model snapshot: ${modelConfig.provider}/${modelConfig.model ?? 'unset'} at ${modelConfig.endpoint ?? 'no endpoint'} (temperature ${modelConfig.temperature}, max ${modelConfig.maxTokens} output tokens)`,
      `provider key: read from ${modelConfig.apiKeyEnv} at session time (${keyDefined(modelConfig.apiKeyEnv) ? 'defined in this environment' : 'not defined here'}) and never printed, logged, or written to disk`,
      `judge: ${judge.mode} - ${judge.reason}`,
      `tools: ${DEFAULT_TOOL_NAMES.join(', ')}; shell allowlist ${plan.shellAllowlist.join(' | ')}; every tool confined to the arm workspace`,
      `cost pricing: ${pricing.source}${pricing.pricePer1k ? ` (${JSON.stringify(pricing.pricePer1k)} per 1k tokens)` : ' (no price configured: costUsd stays null rather than guessed)'}`,
      `output directory: ${path.relative(repoRoot, outDir)}`,
      'network calls: 0',
      'status: plan ok',
    ];
    console.log(lines.join('\n'));
  }
  return 0;
}

/* -------------------------------------------------------------- real runs */

/**
 * True when the two arms were served the same snapshot. A delta measured across
 * two different models is a model comparison, not a skill effect, so a mismatch
 * aborts the run instead of being published.
 */
export function modelParityError(withTrials, baselineTrials) {
  const modelsOf = (trials) => new Set(trials.map((entry) => entry?.model).filter((value) => typeof value === 'string' && value !== ''));
  const withModels = modelsOf(withTrials);
  const baseModels = modelsOf(baselineTrials);
  if (withModels.size === 0 || baseModels.size === 0) {
    return 'no model snapshot was recorded by one of the arms, so snapshot parity cannot be established';
  }
  const shared = [...withModels].filter((model) => baseModels.has(model));
  if (shared.length === 0) {
    return `model snapshots differ between arms: with-skill recorded [${[...withModels].join(', ')}] and baseline recorded [${[...baseModels].join(', ')}]`;
  }
  return null;
}

function harnessModeMetadata(judge, sessionCount) {
  // The scorer's own banner says "no model was invoked by this runner", which is
  // true for it and false here: this harness launched real provider sessions.
  return {
    layer: 'Layer 1',
    mode: 'ab-harness',
    judge: judge.mode,
    modelInvocation: `provider sessions (${sessionCount} child processes, one per arm and trial)`,
    banner: `Layer 1 A/B harness; judge: ${judge.mode}; ${sessionCount} real provider sessions were recorded by the arm children`,
    note: 'Sessions are real: the runner spawns one child process per arm and per trial in a fresh workspace, then scores the recordings with evals/run-behavioral.mjs.',
  };
}

async function modeRun() {
  const scorer = await loadScorer();
  const { fixture, file } = await loadValidatedFixture();
  const judgeConfig = await loadJudgeConfig();
  const modelConfig = resolveModelConfig(judgeConfig);
  const judge = resolveJudgeConfig(judgeConfig);

  const customCommands = {
    'with-skill': asString(args['with-cmd']),
    baseline: asString(args['baseline-cmd']),
  };

  if (!modelConfig.model) fail('no model configured: pass --model <id> or set judgeModel in evals/judge/judge.config.json');
  // An operator-supplied arm command replaces the built-in provider loop, so the
  // key is only required when at least one arm still uses that loop.
  const usesBuiltInClient = customCommands['with-skill'] === null || customCommands.baseline === null;
  if (usesBuiltInClient && !keyDefined(modelConfig.apiKeyEnv)) {
    fail(`${modelConfig.apiKeyEnv} is not set in the environment, so no provider session can run (export it, or use --dry-run to inspect the plan without a key)`);
  }
  if (!usesBuiltInClient) {
    warn('both arms are operator-supplied commands; the provider key is not used by this run');
  }

  const trials = resolveTrials(fixture);
  const skillTail = String(fixture.skill).split('/').pop();
  const outDir = path.resolve(repoRoot, asString(args.out) ?? DEFAULT_OUT_DIR);
  const stamp = timestamp();
  const pricing = resolvePricing({ model: modelConfig.model, priceIn: args['price-in'], priceOut: args['price-out'] });
  const tools = DEFAULT_TOOL_NAMES;
  const maxTurns = MAX_TURNS;
  const armTimeout = Math.max(1000, Math.trunc(asNumber(args['arm-timeout']) ?? ARM_TIMEOUT_MS));
  const skill = await readSkillBody(fixture.skill).catch((error) => {
    fail(error.message);
    return null;
  });
  const skillBody = skill?.body ?? '';

  await fs.mkdir(path.join(outDir, 'artifacts'), { recursive: true });
  if (!args.quiet) {
    console.error(`run-ab: ${trials} trials x ${ARMS.length} arms = ${trials * ARMS.length} provider sessions for ${fixture.skill} (${modelConfig.provider}/${modelConfig.model})`);
  }

  const records = [];
  const workspaces = [];
  for (let trial = 1; trial <= trials; trial++) {
    for (const mode of ARMS) {
      const workspace = await fs.mkdtemp(path.join(os.tmpdir(), `quirk-ab-${skillTail}-${mode}-t${trial}-`));
      workspaces.push(workspace);
      try {
        const record = await launchArm({
          fixture, file, mode, trial, skillBody, modelConfig, tools, maxTurns, workspace,
          command: customCommands[mode], armTimeout,
        });
        records.push(record);
        if (!args.quiet) {
          console.error(`run-ab: ${mode} trial ${trial} ${record.status} in ${record.durationMs}ms (${record.turnCount} turns, ${record.usage?.input ?? '?'} in / ${record.usage?.output ?? '?'} out tokens)`);
        }
      } catch (error) {
        const failed = failedArmRecord({ mode, trial, model: modelConfig.model, error, user: buildArms(fixture, skillBody)[mode].user });
        records.push(failed);
        console.error(`run-ab: ${mode} trial ${trial} failed - ${error.message}`);
      }
    }
  }

  // Compose and persist one transcript per arm, with the final answer of each
  // session written next to it as the recorded artifact.
  const transcripts = {};
  const armsSummary = {};
  for (const mode of ARMS) {
    const armRecords = records.filter((record) => record.mode === mode).sort((a, b) => (a.trial ?? 0) - (b.trial ?? 0));
    const events = [];
    let index = 0;
    for (const record of armRecords) {
      index += 1;
      const text = typeof record.finalText === 'string' ? record.finalText : '';
      const artifactPath = path.join(outDir, 'artifacts', `${skillTail}-${stamp}-${mode}-trial-${record.trial ?? index}.md`);
      await fs.writeFile(artifactPath, text, 'utf8');
      record.costUsd = estimateCost(record.usage, pricing.pricePer1k);
      record.costEstimated = pricing.pricePer1k !== null;
      if (index > 1) events.push({ type: 'trial', index: record.trial ?? index });
      events.push(...transcriptEventsFor(record, { path: repoRef(artifactPath), text }));
    }
    const transcriptPath = path.join(outDir, `${skillTail}-${stamp}.${mode}.jsonl`);
    await fs.writeFile(transcriptPath, `${events.map((event) => JSON.stringify(event)).join('\n')}\n`, 'utf8');
    transcripts[mode] = await scorer.loadTranscript(transcriptPath);
    armsSummary[mode] = {
      transcript: repoRef(transcriptPath),
      trialsRecorded: armRecords.length,
      trialsFailed: armRecords.filter((record) => record.status === 'failed').length,
    };
  }

  const parityError = modelParityError(transcripts['with-skill'].trials, transcripts.baseline.trials);
  if (parityError) fail(`protocol violation: ${parityError}`);

  const report = await scorer.runFixture({
    fixture, file,
    withTranscript: transcripts['with-skill'],
    baselineTranscript: transcripts.baseline,
    artifactOverride: null,
    judge,
    mode: 'live',
  });

  const sessionCount = records.length;
  report.modeMetadata = harnessModeMetadata(judge, sessionCount);
  report.harness = {
    runner: 'evals/harness/run-ab.mjs',
    arms: armsSummary,
    trialsRequested: trials,
    trialsPerArm: {
      'with-skill': armsSummary['with-skill'].trialsRecorded,
      baseline: armsSummary.baseline.trialsRecorded,
    },
    model: { ...modelConfig, requestedModel: modelConfig.model, pricing },
    judgeMode: judge.mode,
    judgeCaveat: judge.mode === 'mock'
      ? 'judge assertions were echoed, not graded; the verdict below rests on the deterministic assertions only'
      : null,
    costSource: pricing.pricePer1k === null ? 'unpriced (costUsd is null, never guessed)' : `${pricing.source} estimate`,
    failedSessions: records
      .filter((record) => record.status === 'failed')
      .map((record) => ({ mode: record.mode, trial: record.trial, error: record.error })),
    protocol: {
      freshWorkspacePerArmAndTrial: true,
      oneChildProcessPerSession: true,
      sameModelSnapshotInBothArms: true,
      maxTurnsPerSession: maxTurns,
    },
  };

  const markdown = scorer.renderMarkdown(report);
  const reportPath = path.join(outDir, `${skillTail}-${stamp}.report.json`);
  const markdownPath = reportPath.replace(/\.json$/, '.md');
  await fs.writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  await fs.writeFile(markdownPath, `${markdown}\n`, 'utf8');

  if (args.json) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    console.log(markdown);
    console.log('');
    console.log(`verdict: ${report.verdict.verdict} - ${report.verdict.reason}`);
    console.log(`report: ${repoRef(reportPath)} (+ ${repoRef(markdownPath)})`);
    if (report.harness.judgeCaveat) console.log(`note: ${report.harness.judgeCaveat}`);
    if (report.harness.costSource.startsWith('unpriced')) console.log(`note: ${report.harness.costSource}`);
  }

  if (!args['keep-workspaces']) {
    for (const workspace of workspaces) {
      await fs.rm(workspace, { recursive: true, force: true }).catch(() => {});
    }
  }

  const recordedAny = records.some((record) => (record.turns ?? []).length > 0);
  if (!recordedAny) {
    console.error('error: no arm recorded a single provider turn; the transcripts carry no evidence');
    return 1;
  }
  return 0;
}

/* -------------------------------------------------------------------- main */

function printUsage() {
  console.log('usage: node evals/harness/run-ab.mjs --fixture evals/behavioral/<skill>.json [options]');
  console.log('  --trials <n>            trials per arm (default max(3, fixture.trials); floor 3)');
  console.log('  --provider <id>         provider id (default from evals/judge/judge.config.json)');
  console.log('  --model <id>            model snapshot id (default from the judge config)');
  console.log('  --endpoint <url>        provider messages endpoint (default from the judge config)');
  console.log('  --api-key-env <VAR>     environment variable holding the provider key');
  console.log('  --price-in <usd/1k>     input token price used by estimateCost');
  console.log('  --price-out <usd/1k>    output token price used by estimateCost');
  console.log('  --with-cmd "<cmd>"      run the with-skill arm with this command instead of the built-in loop');
  console.log('  --baseline-cmd "<cmd>"  run the baseline arm with this command instead of the built-in loop');
  console.log('  --out <dir>             report directory (default evals/results/harness)');
  console.log('  --judge | --mock-judge  judge mode (live when the configured key is set)');
  console.log('  --json                  machine-readable stdout');
  console.log('  --quiet                 suppress the per-session progress lines on stderr');
  console.log('  --dry-run               validate the fixture and print the plan; no network, exit 0');
  console.log('  --keep-workspaces       keep the per-arm temporary workspaces after the run');
  console.log('  --arm-plan <plan.json>  internal: run one arm inside its workspace child process');
}

async function main() {
  if (args.help || args.h) {
    printUsage();
    return 0;
  }
  if (asString(args['arm-plan'])) return runArmFromPlan(String(args['arm-plan']));
  if (asString(args.fixture) === null && args['dry-run'] !== true) {
    printUsage();
    return 2;
  }
  if (args['dry-run'] === true) return modeDryRun();
  return modeRun();
}

const invokedDirectly = (() => {
  try { return process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url); }
  catch { return false; }
})();

if (invokedDirectly) {
  main().then((code) => process.exit(code)).catch((error) => {
    console.error(`run-ab error: ${error?.message ?? error}`);
    process.exit(2);
  });
}
