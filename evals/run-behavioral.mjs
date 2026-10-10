#!/usr/bin/env node
/**
 * run-behavioral.mjs - Layer 1 paired behavioural scorer for the quirk Skills bundle.
 *
 * Usage:
 *   node evals/run-behavioral.mjs --fixture evals/behavioral/<skill>.json \
 *     --with <transcript.jsonl> [--baseline <transcript.jsonl>] [--artifact <path>] \
 *     [--judge | --mock-judge] [--out <report.json>] [--quiet]
 *
 *   node evals/run-behavioral.mjs --all [--mock-judge]     # every fixture, mock mode, CI smoke test
 *   node evals/run-behavioral.mjs --list
 *
 * A transcript is recorded by an agent harness (this runner never calls a model):
 *   {"type":"session","skill":"to-spec","mode":"with-skill","trial":1,"model":"<snapshot>","ts":"..."}
 *   {"type":"message","role":"user","content":"..."}
 *   {"type":"tool_call","name":"read","input":{"path":"docs/reference/agents/work-item-format.md"}}
 *   {"type":"artifact","path":"evals/results/artifacts/to-spec-1.md","sha256":"...","bytes":2410}
 *   {"type":"end","status":"completed","tokens":{"input":18200,"output":3100},"costUsd":0.0412,"durationMs":214000}
 *   {"type":"trial","index":2}             // optional: starts a new trial inside one file
 *
 * Deterministic assertions run locally. Judge assertions go through the pluggable judge
 * interface (evals/judge/grader.md + evals/judge/judge.config.json); with no API key present
 * the runner falls back to --mock-judge and says so.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, '..');
const behavioralDir = path.join(here, 'behavioral');
const judgeDir = path.join(here, 'judge');
const resultsDir = path.join(here, 'results');
const skillsRoot = path.join(repoRoot, '.agents', 'skills');

const AXES = ['instructionFollowing', 'goalCompletion'];
const CATEGORIES = new Set(['outcome', 'process', 'style', 'efficiency']);
const DETERMINISTIC_KINDS = new Set([
  'artifact_contains_all', 'artifact_contains_any', 'artifact_not_contains',
  'artifact_sections', 'artifact_regex', 'artifact_min_words', 'artifact_min_lines',
  'artifact_min_table_rows', 'artifact_json_has_fields', 'transcript_contains_all',
  'transcript_contains_any', 'transcript_tool_called', 'transcript_tool_not_called',
]);

/* ------------------------------------------------------------------ args */

function parseArgs(argv) {
  const args = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const token = argv[i];
    if (!token.startsWith('--')) { args._.push(token); continue; }
    const key = token.slice(2);
    const next = argv[i + 1];
    if (next === undefined || next.startsWith('--')) args[key] = true;
    else { args[key] = next; i += 1; }
  }
  return args;
}
const args = parseArgs(process.argv.slice(2));
const fail = (message) => { console.error(`error: ${message}`); process.exit(1); };

async function exists(filePath) {
  try { await fs.access(filePath); return true; } catch { return false; }
}

async function listBundleSkills() {
  const out = [];
  async function walk(dir) {
    for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const child = path.join(dir, entry.name);
      if (await exists(path.join(child, 'SKILL.md'))) out.push(path.relative(skillsRoot, child).split(path.sep).join('/'));
      else await walk(child);
    }
  }
  await walk(skillsRoot);
  return new Set(out);
}

/* ------------------------------------------------------- fixture schema */

function validateFixture(fixture, file, bundleSkills) {
  const errors = [];
  const label = path.basename(file);

  const isObject = (value) => typeof value === 'object' && value !== null && !Array.isArray(value);

  for (const key of ['skill', 'scenario', 'baseline', 'rubric', 'trials', 'assertions']) {
    if (fixture[key] === undefined) errors.push(`${label}: missing required key "${key}"`);
  }
  if (fixture.baseline !== 'without-skill') {
    errors.push(`${label}: baseline must be "without-skill" (found ${JSON.stringify(fixture.baseline)})`);
  }
  if (typeof fixture.trials !== 'number' || !Number.isInteger(fixture.trials) || fixture.trials < 1) {
    errors.push(`${label}: trials must be a positive integer`);
  }
  if (typeof fixture.scenario !== 'string' || fixture.scenario.trim().length < 20) {
    errors.push(`${label}: scenario must describe the task in at least 20 characters`);
  }
  if (fixture.skill !== undefined && !bundleSkills.has(fixture.skill)) {
    errors.push(`${label}: skill "${fixture.skill}" is not a canonical bundle skill`);
  }

  if (isObject(fixture.rubric)) {
    for (const axis of AXES) {
      const items = fixture.rubric[axis];
      if (!Array.isArray(items) || items.length < 3) {
        errors.push(`${label}: rubric.${axis} needs at least 3 items`);
        continue;
      }
      for (const item of items) {
        if (!isObject(item)) { errors.push(`${label}: rubric.${axis} items must be objects`); continue; }
        if (!item.id || !item.criterion) errors.push(`${label}: rubric.${axis} item needs id and criterion`);
        if (item.id) {
          const seen = (fixture.rubric[axis].filter((other) => other.id === item.id)).length;
          if (seen > 1) errors.push(`${label}: rubric.${axis} id ${item.id} is duplicated`);
        }
        if (typeof item.criterion === 'string' && /^\s*(\d\s*=\s*)?(excellent|good|bad|poor|strong|weak)\b/i.test(item.criterion)) {
          errors.push(`${label}: rubric.${axis}.${item.id} uses an adjective instead of an observable level`);
        }
        const levels = isObject(item.levels) ? item.levels : null;
        if (!levels || Object.keys(levels).length < 3) {
          errors.push(`${label}: rubric.${axis}.${item.id} needs at least 3 levels`);
        } else {
          for (const [level, description] of Object.entries(levels)) {
            if (typeof description !== 'string' || description.trim().length < 10) {
              errors.push(`${label}: rubric.${axis}.${item.id} level ${level} is not an observable description`);
            }
          }
        }
      }
    }
  } else if (fixture.rubric !== undefined) {
    errors.push(`${label}: rubric must be an object with instructionFollowing and goalCompletion`);
  }

  const rubricIds = isObject(fixture.rubric)
    ? AXES.flatMap((axis) => (fixture.rubric[axis] ?? []).map((item) => item.id))
    : [];
  if (Array.isArray(fixture.assertions)) {
    if (fixture.assertions.length < 1) errors.push(`${label}: at least one assertion is required`);
    const ids = new Set();
    for (const assertion of fixture.assertions) {
      if (!isObject(assertion)) { errors.push(`${label}: assertions must be objects`); continue; }
      if (!assertion.id) errors.push(`${label}: assertion without id`);
      if (ids.has(assertion.id)) errors.push(`${label}: duplicate assertion id ${assertion.id}`);
      ids.add(assertion.id);
      if (assertion.type !== 'deterministic' && assertion.type !== 'judge') {
        errors.push(`${label}: assertion ${assertion.id} type must be deterministic|judge`);
        continue;
      }
      if (assertion.category !== undefined && !CATEGORIES.has(assertion.category)) {
        errors.push(`${label}: assertion ${assertion.id} category must be outcome|process|style|efficiency`);
      }
      if (!isObject(assertion.check)) { errors.push(`${label}: assertion ${assertion.id} needs a check object`); continue; }
      if (assertion.type === 'deterministic' && !DETERMINISTIC_KINDS.has(assertion.check.kind)) {
        errors.push(`${label}: assertion ${assertion.id} uses unknown deterministic kind ${assertion.check.kind}`);
      }
      if (assertion.type === 'judge' && (typeof assertion.check.criterion !== 'string' || assertion.check.criterion.trim().length < 10)) {
        errors.push(`${label}: assertion ${assertion.id} judge criterion must be a sentence`);
      }
      if (assertion.rubricId !== undefined && rubricIds.length > 0 && !rubricIds.includes(assertion.rubricId)) {
        errors.push(`${label}: assertion ${assertion.id} references unknown rubricId ${assertion.rubricId}`);
      }
    }
  } else if (fixture.assertions !== undefined) {
    errors.push(`${label}: assertions must be an array`);
  }

  return errors;
}

/* ------------------------------------------------------------- judge interface */

async function loadJudgeConfig(file) {
  const fallback = {
    judgeModel: 'unknown', judgeProvider: 'unknown', apiKeyEnv: 'JUDGE_API_KEY',
    temperature: 0.1, pinnedSnapshot: true,
  };
  const configPath = path.resolve(file ?? path.join(judgeDir, 'judge.config.json'));
  if (!(await exists(configPath))) return { ...fallback, configPath, missing: true };
  try {
    const parsed = JSON.parse(await fs.readFile(configPath, 'utf8'));
    return { ...fallback, ...parsed, configPath };
  } catch (error) {
    console.error(`warn: judge config ${path.relative(repoRoot, configPath)} is not valid JSON (${error.message}); using defaults`);
    return { ...fallback, configPath, broken: true };
  }
}

function resolveJudgeMode(config, requestedMock) {
  if (requestedMock) return { mode: 'mock', reason: '--mock-judge requested', config };
  const envName = config.apiKeyEnv ?? 'JUDGE_API_KEY';
  const key = process.env[envName];
  if (!key || key.trim() === '') return { mode: 'mock', reason: `$${envName} is not set in the environment, falling back to the mock judge`, config };
  if (!config.pinnedSnapshot) console.error(`warn: judge config is not pinned to a snapshot; calibration numbers are void`);
  return { mode: 'live', reason: `judge ${config.judgeProvider}/${config.judgeModel}`, config };
}

function mockJudge(criterion, evidenceText) {
  const excerpt = evidenceText.slice(0, 400).replace(/\s+/g, ' ').trim();
  return {
    text: `MOCK JUDGE (no API key, no grading): rubric item echoed for a scorer smoke test. Criterion: ${criterion}`,
    passed: true,
    evidence: `echoed rubric item; first evidence span: ${excerpt}${evidenceText.length > 400 ? ' ...' : ''}`,
    mock: true,
  };
}

/** Live judge: one criterion per call, JSON in, {text, passed, evidence} out. */
async function liveJudge(config, criterion, evidenceText, strict) {
  const system = [
    'You are a grading instrument for an agent-skill evaluation harness.',
    'You receive ONE criterion and the evidence. Score the criterion only.',
    'Never compare two candidate outputs. Never comment on prose quality unless the criterion asks for it.',
    'Return a JSON object with exactly: {"text": "<reasoning>", "passed": <true|false>, "evidence": "<quoted span that decided it>"}.',
    'If the evidence is ambiguous, pass unless the criterion declares itself strict.',
  ].join(' ');

  const user = [
    `CRITERION: ${criterion}`,
    `STRICT: ${strict ? 'yes - an ambiguous verdict must fail' : 'no - an ambiguous verdict must pass'}`,
    '',
    'EVIDENCE:',
    evidenceText.slice(0, config.maxEvidenceChars ?? 12000),
  ].join('\n');

  const body = {
    model: config.judgeModel,
    temperature: typeof config.temperature === 'number' ? config.temperature : 0.1,
    max_tokens: 800,
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: user },
    ],
  };

  const headers = { 'content-type': 'application/json' };
  const envName = config.apiKeyEnv ?? 'JUDGE_API_KEY';
  const key = process.env[envName];
  if (config.judgeProvider === 'anthropic') {
    headers['x-api-key'] = key;
    headers['anthropic-version'] = '2023-06-01';
  } else {
    headers.authorization = `Bearer ${key}`;
  }

  const response = await fetch(config.endpoint ?? 'https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers,
    body: JSON.stringify(config.judgeProvider === 'anthropic'
      ? { ...body, system, max_tokens: body.max_tokens, messages: body.messages.filter((m) => m.role !== 'system') }
      : { ...body, response_format: { type: 'json_object' } }),
  });

  if (!response.ok) {
    throw new Error(`judge endpoint returned HTTP ${response.status}`);
  }
  const payload = await response.json();
  const content = config.judgeProvider === 'anthropic'
    ? (payload.content ?? []).filter((block) => block.type === 'text').map((block) => block.text).join('\n')
    : (payload.choices?.[0]?.message?.content ?? '');
  const parsed = JSON.parse(content);
  if (typeof parsed.passed !== 'boolean' || typeof parsed.text !== 'string') {
    throw new Error('judge response is missing text/passed');
  }
  return {
    text: parsed.text,
    passed: parsed.passed,
    evidence: typeof parsed.evidence === 'string' && parsed.evidence.trim() !== '' ? parsed.evidence : '(judge gave no quotable span)',
  };
}

/* ------------------------------------------------------------- transcripts */

async function loadTranscript(file, fallbackTrial) {
  const text = await fs.readFile(file, 'utf8');
  const lines = text.split(/\r?\n/).filter((line) => line.trim().length > 0);
  const events = [];
  const errors = [];
  lines.forEach((line, index) => {
    try { events.push(JSON.parse(line)); }
    catch (error) { errors.push(`${path.relative(repoRoot, file)}:${index + 1} not valid JSON (${error.message})`); }
  });

  const trials = [];
  let current = newTrial(trials.length + 1);
  for (const event of events) {
    if (!event || typeof event !== 'object') continue;
    if (event.type === 'trial') {
      if (current.events.length > 0) trials.push(current);
      const index = Number.isInteger(event.index) ? event.index : trials.length + 1;
      current = newTrial(index);
      continue;
    }
    current.events.push(event);
    if (event.type === 'session') {
      current.skill = event.skill ?? current.skill;
      current.model = event.model ?? current.model;
      current.mode = event.mode ?? current.mode;
      if (Number.isInteger(event.trial)) current.index = event.trial;
    }
    if (event.type === 'message') current.messages.push(event);
    if (event.type === 'tool_call') current.toolCalls.push(event);
    if (event.type === 'artifact') {
      current.artifacts.push(event);
      current.finalArtifact = event;
    }
    if (event.type === 'end') {
      current.end = event;
      if (event.tokens) current.tokens = event.tokens;
      if (typeof event.costUsd === 'number') current.costUsd = event.costUsd;
      if (typeof event.durationMs === 'number') current.durationMs = event.durationMs;
    }
  }
  trials.push(current);
  if (fallbackTrial && trials.length === 1) trials[0].index = fallbackTrial;

  return { file, rel: path.relative(repoRoot, file), trials, errors, eventCount: events.length };
}

function newTrial(index) {
  return {
    index,
    skill: null,
    model: null,
    mode: null,
    events: [],
    messages: [],
    toolCalls: [],
    artifacts: [],
    finalArtifact: null,
    end: null,
    tokens: null,
    costUsd: null,
    durationMs: null,
  };
}

function trialText(trial) {
  return [
    ...trial.messages.map((message) => `[${message.role ?? 'message'}] ${message.content ?? ''}`),
    ...trial.toolCalls.map((call) => `[tool:${call.name}] ${safeStringify(call.input)}`),
  ].join('\n');
}

function safeStringify(value) {
  try { return JSON.stringify(value); } catch { return String(value); }
}

/* ------------------------------------------------------- deterministic checks */

async function readArtifact(trial, artifactOverride) {
  if (artifactOverride) {
    const absolute = path.resolve(repoRoot, artifactOverride);
    if (!(await exists(absolute))) return { text: null, path: artifactOverride, error: `artifact file not found: ${artifactOverride}` };
    return { text: await fs.readFile(absolute, 'utf8'), path: artifactOverride };
  }
  const event = trial.finalArtifact;
  if (!event) return { text: null, path: null, error: 'no artifact event in the transcript and no --artifact given' };
  if (typeof event.text === 'string' && event.text.trim() !== '') return { text: event.text, path: event.path ?? null };
  if (event.path) {
    const absolute = path.resolve(repoRoot, event.path);
    if (!(await exists(absolute))) return { text: null, path: event.path, error: `artifact file not found: ${event.path}` };
    return { text: await fs.readFile(absolute, 'utf8'), path: event.path };
  }
  return { text: null, path: null, error: 'artifact event has neither text nor path' };
}

function countWords(text) { return (text.match(/[A-Za-z0-9_'’-]+/g) ?? []).length; }

function runDeterministic(check, artifact, trial) {
  const text = artifact.text ?? '';
  switch (check.kind) {
    case 'artifact_contains_all': {
      const missing = (check.values ?? []).filter((value) => !text.includes(value));
      return missing.length === 0
        ? { passed: true, evidence: `all ${check.values.length} required strings present` }
        : { passed: false, evidence: `missing: ${missing.map((value) => JSON.stringify(value)).join(', ')}` };
    }
    case 'artifact_contains_any': {
      const found = (check.values ?? []).filter((value) => text.includes(value));
      return found.length > 0
        ? { passed: true, evidence: `found: ${found.map((value) => JSON.stringify(value)).join(', ')}` }
        : { passed: false, evidence: `none of ${(check.values ?? []).length} alternatives present` };
    }
    case 'artifact_not_contains': {
      const found = (check.values ?? []).filter((value) => text.includes(value));
      return found.length === 0
        ? { passed: true, evidence: 'no forbidden string present' }
        : { passed: false, evidence: `forbidden content present: ${found.join(', ')}` };
    }
    case 'artifact_sections': {
      const missing = (check.values ?? []).filter((value) => !text.includes(value));
      return missing.length === 0
        ? { passed: true, evidence: `all sections present (${check.values.join(' | ')})` }
        : { passed: false, evidence: `missing sections: ${missing.join(' | ')}` };
    }
    case 'artifact_regex': {
      const regex = new RegExp(check.pattern, check.flags ?? 'm');
      return regex.test(text)
        ? { passed: true, evidence: `pattern /${check.pattern}/${check.flags ?? 'm'} matched` }
        : { passed: false, evidence: `pattern /${check.pattern}/${check.flags ?? 'm'} did not match` };
    }
    case 'artifact_min_words': {
      const words = countWords(text);
      return words >= check.min
        ? { passed: true, evidence: `${words} words >= ${check.min}` }
        : { passed: false, evidence: `${words} words < ${check.min}` };
    }
    case 'artifact_min_lines': {
      const lines = text.split('\n').filter((line) => line.trim() !== '').length;
      return lines >= check.min
        ? { passed: true, evidence: `${lines} non-empty lines >= ${check.min}` }
        : { passed: false, evidence: `${lines} non-empty lines < ${check.min}` };
    }
    case 'artifact_min_table_rows': {
      const lines = text.split('\n');
      const start = check.section ? lines.findIndex((line) => line.includes(check.section)) : 0;
      const slice = start === -1 ? [] : lines.slice(start + 1);
      const rows = slice.filter((line) => /^\s*\|.*\|\s*$/.test(line) && !/^\s*\|[\s:|-]+\|\s*$/.test(line)).length;
      return rows >= check.min
        ? { passed: true, evidence: `${rows} table rows >= ${check.min} after "${check.section ?? 'start'}"` }
        : { passed: false, evidence: `${rows} table rows < ${check.min} after "${check.section ?? 'start'}"` };
    }
    case 'artifact_json_has_fields': {
      let parsed = null;
      try { parsed = JSON.parse(text); }
      catch (error) { return { passed: false, evidence: `artifact is not valid JSON (${error.message})` }; }
      const missing = (check.fields ?? []).filter((field) => parsed[field] === undefined);
      return missing.length === 0
        ? { passed: true, evidence: `JSON artifact carries ${check.fields.join(', ')}` }
        : { passed: false, evidence: `JSON artifact missing fields: ${missing.join(', ')}` };
    }
    case 'transcript_contains_all': {
      const haystack = trialText(trial);
      const missing = (check.values ?? []).filter((value) => !haystack.includes(value));
      return missing.length === 0
        ? { passed: true, evidence: `transcript contains ${check.values.join(', ')}` }
        : { passed: false, evidence: `transcript missing: ${missing.join(', ')}` };
    }
    case 'transcript_contains_any': {
      const haystack = trialText(trial);
      const found = (check.values ?? []).filter((value) => haystack.includes(value));
      return found.length > 0
        ? { passed: true, evidence: `transcript contains ${found.join(', ')}` }
        : { passed: false, evidence: `transcript contains none of ${check.values.join(', ')}` };
    }
    case 'transcript_tool_called': {
      const haystack = trialText(trial);
      const found = (check.values ?? []).filter((value) => haystack.includes(value));
      return found.length > 0
        ? { passed: true, evidence: `tool activity includes ${found.join(', ')}` }
        : { passed: false, evidence: `no tool activity matching ${check.values.join(', ')}` };
    }
    case 'transcript_tool_not_called': {
      const haystack = trialText(trial);
      const found = (check.values ?? []).filter((value) => haystack.includes(value));
      return found.length === 0
        ? { passed: true, evidence: `no forbidden tool activity (${check.values.join(', ')})` }
        : { passed: false, evidence: `forbidden tool activity found: ${found.join(', ')}` };
    }
    default:
      return { passed: false, evidence: `unknown deterministic kind ${check.kind}` };
  }
}

/* ----------------------------------------------------------------- scoring */

function subsetsOfSize(values, k) {
  const out = [];
  const walk = (start, chosen) => {
    if (chosen.length === k) { out.push(chosen.map((index) => values[index])); return; }
    for (let i = start; i < values.length; i++) walk(i + 1, [...chosen, i]);
  };
  walk(0, []);
  return out;
}

/**
 * pass^k = fraction of size-k subsets in which every trial passed (tau-bench definition).
 * k runs from 1 to the number of trials actually recorded, so a short recording degrades to a
 * shorter curve instead of silently reporting a k the data cannot support.
 */
function passHatK(outcomes, maxK) {
  const kMax = Math.min(Math.max(maxK, outcomes.length), outcomes.length);
  const result = [];
  for (let k = 1; k <= kMax; k++) {
    const subsets = subsetsOfSize(outcomes, k);
    const allPassed = subsets.filter((subset) => subset.every(Boolean)).length;
    result.push({ k, passHatK: Math.round((allPassed / subsets.length) * 1000) / 1000, subsets: subsets.length });
  }
  return result;
}

async function scoreArm(fixture, transcript, artifactOverride, judge) {
  const results = [];
  for (const trial of transcript.trials) {
    const artifact = await readArtifact(trial, artifactOverride);
    const assertions = [];
    for (const assertion of fixture.assertions) {
      let outcome;
      if (assertion.type === 'deterministic') {
        if (artifact.text === null) {
          outcome = { id: assertion.id, type: assertion.type, category: assertion.category ?? null, passed: false, evidence: `no artifact available (${artifact.error})` };
        } else {
          const check = runDeterministic(assertion.check, artifact, trial);
          outcome = { id: assertion.id, type: assertion.type, category: assertion.category ?? null, passed: check.passed, evidence: check.evidence };
        }
      } else {
        const evidenceText = artifact.text ?? trialText(trial);
        try {
          const verdict = judge.mode === 'live'
            ? await liveJudge(judge.config, assertion.check.criterion, evidenceText, assertion.check.strict === true)
            : mockJudge(assertion.check.criterion, evidenceText);
          outcome = {
            id: assertion.id, type: assertion.type, category: assertion.category ?? null,
            passed: verdict.passed, evidence: verdict.evidence, text: verdict.text, mock: verdict.mock === true,
          };
        } catch (error) {
          const strict = assertion.check.strict === true;
          outcome = {
            id: assertion.id, type: assertion.type, category: assertion.category ?? null,
            passed: !strict,
            evidence: `judge call failed (${error.message}); ${strict ? 'failed because the criterion is strict' : 'passed by the ambiguity policy'}`,
          };
        }
      }
      assertions.push(outcome);
    }
    results.push({
      trial: trial.index,
      passed: assertions.every((assertion) => assertion.passed),
      assertions,
      artifactPath: artifact.path,
      artifactError: artifact.error ?? null,
      tokens: trial.tokens,
      costUsd: trial.costUsd,
      durationMs: trial.durationMs,
      model: trial.model,
      mode: trial.mode,
    });
  }
  return results;
}

function aggregateArm(trials) {
  const totals = { trials: trials.length, passed: trials.filter((trial) => trial.passed).length };
  const assertions = new Map();
  for (const trial of trials) {
    for (const assertion of trial.assertions) {
      if (!assertions.has(assertion.id)) {
        assertions.set(assertion.id, { id: assertion.id, type: assertion.type, category: assertion.category, passed: 0, failed: 0, evidence: [], notes: [] });
      }
      const entry = assertions.get(assertion.id);
      if (assertion.passed) entry.passed += 1;
      else entry.evidence.push(`trial ${trial.trial}: ${assertion.evidence}`);
      if (assertion.type === 'judge' && typeof assertion.evidence === 'string' && assertion.evidence.startsWith('judge call failed')) {
        entry.notes.push(`trial ${trial.trial}: ${assertion.evidence}`);
      }
    }
  }
  const byCategory = {};
  const byType = {};
  for (const entry of assertions.values()) {
    if (entry.category) {
      byCategory[entry.category] ??= { passed: 0, failed: 0 };
      byCategory[entry.category].passed += entry.passed;
      byCategory[entry.category].failed += entry.failed;
    }
    byType[entry.type] ??= { passed: 0, failed: 0 };
    byType[entry.type].passed += entry.passed;
    byType[entry.type].failed += entry.failed;
  }
  const costs = trials.map((trial) => ({
    inputTokens: trial.tokens?.input ?? null,
    outputTokens: trial.tokens?.output ?? null,
    costUsd: trial.costUsd,
    durationMs: trial.durationMs,
  }));
  const sum = (key) => {
    const values = costs.map((cost) => cost[key]).filter((value) => typeof value === 'number');
    return values.length === 0 ? null : values.reduce((a, b) => a + b, 0);
  };
  return {
    trials: totals.trials,
    trialsPassed: totals.passed,
    passRate: totals.trials === 0 ? null : Math.round((totals.passed / totals.trials) * 1000) / 1000,
    assertions: [...assertions.values()].sort((a, b) => a.id.localeCompare(b.id)),
    byCategory,
    byType,
    tokens: { input: sum('inputTokens'), output: sum('outputTokens') },
    costUsd: sum('costUsd'),
    durationMs: sum('durationMs'),
  };
}

function buildDelta(withArm, baselineArm) {
  const delta = { assertions: [], categories: {}, axes: {} };
  const baseById = new Map(baselineArm.assertions.map((entry) => [entry.id, entry]));
  for (const entry of withArm.assertions) {
    const base = baseById.get(entry.id);
    delta.assertions.push({
      id: entry.id,
      type: entry.type,
      category: entry.category ?? null,
      baseline: base ? base.passed / Math.max(1, baselineArm.trials) : null,
      withSkill: entry.passed / Math.max(1, withArm.trials),
      delta: base ? Math.round((entry.passed / Math.max(1, withArm.trials) - base.passed / Math.max(1, baselineArm.trials)) * 1000) / 1000 : null,
    });
  }
  for (const category of new Set([...Object.keys(withArm.byCategory), ...Object.keys(baselineArm.byCategory)])) {
    const withRate = rateOf(withArm.byCategory[category]);
    const baseRate = rateOf(baselineArm.byCategory[category]);
    delta.categories[category] = { baseline: baseRate, withSkill: withRate, delta: baseRate === null || withRate === null ? null : Math.round((withRate - baseRate) * 1000) / 1000 };
  }
  const costDelta = {
    baseline: baselineArm.costUsd,
    withSkill: withArm.costUsd,
    delta: baselineArm.costUsd === null || withArm.costUsd === null ? null : Math.round((withArm.costUsd - baselineArm.costUsd) * 10000) / 10000,
  };
  const tokenDelta = {
    baseline: baselineArm.tokens,
    withSkill: withArm.tokens,
    inputDelta: deltaOf(baselineArm.tokens.input, withArm.tokens.input),
    outputDelta: deltaOf(baselineArm.tokens.output, withArm.tokens.output),
    totalDelta: deltaOf(
      sumOrNull(baselineArm.tokens.input, baselineArm.tokens.output),
      sumOrNull(withArm.tokens.input, withArm.tokens.output),
    ),
  };
  return { ...delta, cost: costDelta, tokens: tokenDelta };
}

function rateOf(bucket) {
  if (!bucket) return null;
  const total = bucket.passed + bucket.failed;
  return total === 0 ? null : Math.round((bucket.passed / total) * 1000) / 1000;
}

function deltaOf(base, withValue) {
  if (typeof base !== 'number' || typeof withValue !== 'number') return null;
  return Math.round(withValue - base);
}

function sumOrNull(a, b) {
  if (typeof a !== 'number' && typeof b !== 'number') return null;
  return (a ?? 0) + (b ?? 0);
}

function verdictFor(delta, fixture, mode) {
  if (mode === 'mock') {
    return { verdict: 'not-applicable', reason: 'mock run: the scorer was smoke-tested, no model or skill was measured' };
  }
  const outcomeDelta = delta.categories.outcome?.delta;
  const processDelta = delta.categories.process?.delta;
  const costDelta = delta.cost.delta;
  const costKnown = costDelta !== null;
  if (costKnown && costDelta === 0 && (outcomeDelta === 0 && processDelta === 0)) {
    return { verdict: 'no-effect', reason: 'no measurable change and no cost difference recorded' };
  }
  if (costKnown && costDelta > 0 && outcomeDelta === 0 && processDelta === 0) {
    return { verdict: 'regression-zero-delta-at-positive-cost', reason: 'the skill was paid for and changed nothing observable' };
  }
  if (outcomeDelta !== null && outcomeDelta < 0) {
    return { verdict: 'regression-negative-delta', reason: 'the outcome axis got worse with the skill' };
  }
  const budget = fixture.costBudget ?? {};
  const overspend = [];
  if (budget.costUsd !== undefined && costKnown && delta.cost.withSkill > budget.costUsd) overspend.push(`cost $${delta.cost.withSkill} > $${budget.costUsd}`);
  if (budget.inputTokens !== undefined && delta.tokens.withSkill?.input !== null && delta.tokens.withSkill?.input > budget.inputTokens) {
    overspend.push(`input tokens ${delta.tokens.withSkill.input} > ${budget.inputTokens}`);
  }
  if (budget.durationMs !== undefined && (delta.durationMs ?? 0) > budget.durationMs) overspend.push(`duration > ${budget.durationMs}ms`);
  if (overspend.length > 0) {
    return { verdict: 'keep-with-justification', reason: `positive delta but over budget: ${overspend.join('; ')}` };
  }
  return { verdict: 'keep', reason: 'positive or neutral delta within budget' };
}

/* --------------------------------------------------------------- reporting */

function renderMarkdown(report) {
  const lines = [];
  const delta = report.delta;
  const baselineTrials = report.baseline ? report.baseline.trials : 0;

  lines.push(`# Behavioral eval report - ${report.fixture.skill}`);
  lines.push('');
  lines.push(`- fixture: \`${report.fixture.file}\``);
  lines.push(`- scenario: ${report.fixture.scenario}`);
  lines.push(`- trials: ${report.fixture.trials} (recorded ${report.with.trials} with-skill${baselineTrials === 0 ? ', no baseline transcript supplied' : `, ${baselineTrials} baseline`})`);
  lines.push(`- judge: ${report.judge.mode}${report.judge.mock ? ' (mock - not evidence)' : ''} ${report.judge.reason}`);
  lines.push(`- model snapshot: ${report.modelSnapshot ?? 'not recorded'}`);
  lines.push('');

  lines.push('## Assertions');
  lines.push('');
  lines.push('| assertion | category | type | baseline | with skill | delta |');
  lines.push('|---|---|---|---|---|---|');
  const assertionRows = delta
    ? delta.assertions
    : report.with.assertions.map((entry) => ({
        id: entry.id,
        category: entry.category ?? null,
        type: entry.type,
        baseline: null,
        withSkill: entry.passed / Math.max(1, report.with.trials),
        delta: null,
      }));
  for (const entry of assertionRows) {
    lines.push(`| ${entry.id} | ${entry.category ?? '-'} | ${entry.type} | ${entry.baseline === null ? 'n/a' : entry.baseline.toFixed(2)} | ${entry.withSkill === null ? 'n/a' : entry.withSkill.toFixed(2)} | ${entry.delta === null ? 'n/a' : entry.delta.toFixed(2)} |`);
  }
  lines.push('');

  lines.push('## Success categories');
  lines.push('');
  lines.push('| category | baseline | with skill | delta |');
  lines.push('|---|---|---|---|');
  const categories = delta
    ? Object.entries(delta.categories)
    : Object.entries(report.with.byCategory).map(([name, bucket]) => [name, { baseline: null, withSkill: rateOf(bucket), delta: null }]);
  for (const [category, entry] of categories) {
    lines.push(`| ${category} | ${entry.baseline === null ? 'n/a' : entry.baseline.toFixed(2)} | ${entry.withSkill === null ? 'n/a' : entry.withSkill.toFixed(2)} | ${entry.delta === null ? 'n/a' : entry.delta.toFixed(2)} |`);
  }
  lines.push('');

  lines.push('## Cost');
  lines.push('');
  lines.push('| metric | baseline | with skill | delta |');
  lines.push('|---|---|---|---|');
  const baseTokens = delta ? delta.tokens.baseline : report.baseline?.tokens ?? { input: null, output: null };
  const withTokens = delta ? delta.tokens.withSkill : report.with.tokens;
  const baseCost = delta ? delta.cost.baseline : report.baseline?.costUsd ?? null;
  const withCost = delta ? delta.cost.withSkill : report.with.costUsd;
  lines.push(`| input tokens | ${fmtNumber(baseTokens?.input)} | ${fmtNumber(withTokens?.input)} | ${fmtDelta(delta?.tokens?.inputDelta ?? null)} |`);
  lines.push(`| output tokens | ${fmtNumber(baseTokens?.output)} | ${fmtNumber(withTokens?.output)} | ${fmtDelta(delta?.tokens?.outputDelta ?? null)} |`);
  lines.push(`| total tokens | ${fmtNumber(sumOrNull(baseTokens?.input, baseTokens?.output))} | ${fmtNumber(sumOrNull(withTokens?.input, withTokens?.output))} | ${fmtDelta(delta?.tokens?.totalDelta ?? null)} |`);
  lines.push(`| cost (USD) | ${fmtUsd(baseCost)} | ${fmtUsd(withCost)} | ${delta && delta.cost.delta !== null ? fmtUsd(delta.cost.delta) : 'not recorded'} |`);
  if (report.costBudget) {
    lines.push('');
    lines.push(`cost budget declared by the fixture: ${JSON.stringify(report.costBudget)}`);
  }
  lines.push('');

  lines.push('## pass^k');
  lines.push('');
  lines.push('| k | pass^k (with skill) | pass^k (baseline) |');
  lines.push('|---|---|---|');
  for (let i = 0; i < report.passHatK.with.length; i++) {
    const withEntry = report.passHatK.with[i];
    const baseEntry = report.passHatK.baseline[i];
    lines.push(`| ${withEntry.k} | ${withEntry.passHatK.toFixed(3)} | ${baseEntry ? baseEntry.passHatK.toFixed(3) : 'n/a'} |`);
  }
  lines.push('');

  lines.push('## Verdict');
  lines.push('');
  lines.push(`**${report.verdict.verdict}** - ${report.verdict.reason}`);
  lines.push('');
  lines.push('Zero delta at positive cost is a regression: the skill loads, consumes context and tokens, and changes nothing observable.');
  lines.push('');
  lines.push(`Report generated ${report.generatedAt}. Recorded triple: (${report.fixture.skill}, ${report.fixture.skillVersion ?? 'unknown version'}, ${path.basename(report.fixture.file)}).`);
  return lines.join('\n');
}

function fmtNumber(value) { return typeof value === 'number' ? value.toLocaleString('en-US') : 'not recorded'; }
function fmtUsd(value) { return typeof value === 'number' ? `$${value.toFixed(4)}` : 'not recorded'; }
function fmtDelta(value) { return value === null ? 'not recorded' : (value > 0 ? `+${value}` : String(value)); }

/* ------------------------------------------------------------------ modes */

async function fixtureFiles() {
  const entries = await fs.readdir(behavioralDir, { withFileTypes: true });
  return entries.filter((entry) => entry.isFile() && entry.name.endsWith('.json')).map((entry) => path.join(behavioralDir, entry.name)).sort();
}

async function loadFixture(file) {
  const text = await fs.readFile(file, 'utf8');
  let parsed;
  try { parsed = JSON.parse(text); }
  catch (error) { return { file, fixture: null, errors: [`${path.basename(file)}: not valid JSON (${error.message})`] }; }
  return { file, fixture: parsed, errors: [] };
}

async function runFixture({ fixture, file, withTranscript, baselineTranscript, artifactOverride, judge, mode }) {
  const withArm = await scoreArm(fixture, withTranscript, artifactOverride, judge);
  const withAggregate = aggregateArm(withArm);
  const hasBaseline = baselineTranscript !== null && baselineTranscript !== undefined;
  const baselineArm = hasBaseline ? await scoreArm(fixture, baselineTranscript, artifactOverride, judge) : [];
  const baselineAggregate = hasBaseline ? aggregateArm(baselineArm) : null;
  const delta = baselineAggregate ? buildDelta(withAggregate, baselineAggregate) : null;

  const report = {
    generatedAt: new Date().toISOString(),
    fixture: {
      file: path.relative(repoRoot, file),
      id: fixture.id ?? null,
      skill: fixture.skill,
      skillVersion: fixture.skillVersion ?? null,
      scenario: fixture.scenario,
      trials: fixture.trials,
    },
    judge: { mode: judge.mode, mock: judge.mode === 'mock', reason: judge.reason, model: judge.config.judgeModel, snapshot: judge.config.snapshot ?? null },
    modelSnapshot: withTranscript.trials.find((trial) => trial.model)?.model ?? null,
    with: withAggregate,
    baseline: baselineAggregate,
    delta,
    passHatK: {
      with: passHatK(withArm.map((trial) => trial.passed), fixture.trials),
      baseline: hasBaseline ? passHatK(baselineArm.map((trial) => trial.passed), fixture.trials) : [],
    },
    costBudget: fixture.costBudget ?? null,
    verdict: delta ? verdictFor(delta, fixture, mode) : { verdict: 'no-baseline', reason: 'no baseline transcript supplied; a delta cannot be computed' },
    failures: withAggregate.assertions.filter((entry) => entry.failed > 0),
  };
  return report;
}

async function modeSingle() {
  if (!args.fixture) fail('--fixture <file.json> is required');
  if (!args.with) fail('--with <transcript.jsonl> is required (the with-skill arm)');

  const bundleSkills = await listBundleSkills();
  const { fixture, file, errors } = await loadFixture(path.resolve(repoRoot, String(args.fixture)));
  if (errors.length > 0 || fixture === null) { for (const error of errors) console.error(`ERROR ${error}`); process.exit(1); }
  const schemaErrors = validateFixture(fixture, file, bundleSkills);
  if (schemaErrors.length > 0) {
    for (const error of schemaErrors) console.error(`ERROR ${error}`);
    console.error('status: fail (fixture schema)');
    process.exit(1);
  }

  const judgeConfig = await loadJudgeConfig(args['judge-config']);
  const judge = resolveJudgeMode(judgeConfig, Boolean(args['mock-judge']));
  const withTranscript = await loadTranscript(path.resolve(repoRoot, String(args.with)));
  const baselineTranscript = args.baseline ? await loadTranscript(path.resolve(repoRoot, String(args.baseline))) : null;
  const transferErrors = [...withTranscript.errors, ...(baselineTranscript?.errors ?? [])];
  if (transferErrors.length > 0) { for (const error of transferErrors) console.error(`ERROR ${error}`); process.exit(1); }
  if (withTranscript.trials.length === 0 || (withTranscript.trials[0]?.events.length ?? 0) === 0) {
    fail(`no events found in ${args.with}`);
  }

  const report = await runFixture({
    fixture, file, withTranscript, baselineTranscript,
    artifactOverride: args.artifact ? String(args.artifact) : null, judge, mode: 'live',
  });

  const markdown = renderMarkdown(report);
  const json = `${JSON.stringify(report, null, 2)}\n`;
  if (args.out) {
    await fs.mkdir(path.dirname(path.resolve(repoRoot, String(args.out))), { recursive: true });
    await fs.writeFile(path.resolve(repoRoot, String(args.out)), json, 'utf8');
    const markdownPath = path.resolve(repoRoot, String(args.out)).replace(/\.json$/, '.md');
    await fs.writeFile(markdownPath, `${markdown}\n`, 'utf8');
    if (!args.quiet) console.error(`wrote ${path.relative(repoRoot, path.resolve(repoRoot, String(args.out)))} and ${path.relative(repoRoot, markdownPath)}`);
  }
  if (!args.quiet || !args.out) process.stdout.write(`${markdown}\n`);
  process.exit(0);
}

/* ------------------------------------------------------- synthetic material */

/** Build a transcript that satisfies the fixture's literal deterministic assertions. */
function syntheticTranscript(fixture, mode, trialIndex) {
  const events = [{
    type: 'session',
    skill: fixture.skill,
    mode,
    trial: trialIndex,
    model: `mock/model-snapshot-${mode}`,
    ts: new Date(Date.parse('2026-10-10T20:00:00.000Z') + trialIndex * 60000).toISOString(),
  }];
  events.push({ type: 'message', role: 'user', content: fixture.prompt ?? fixture.scenario });

  const haystack = [];
  const headings = [];
  for (const assertion of fixture.assertions ?? []) {
    if (assertion.type !== 'deterministic') continue;
    const check = assertion.check ?? {};
    switch (check.kind) {
      case 'artifact_sections': headings.push(...(check.values ?? [])); break;
      case 'artifact_contains_all': haystack.push(...(check.values ?? [])); break;
      case 'artifact_contains_any': haystack.push(check.values?.[0] ?? ''); break;
      case 'artifact_json_has_fields': haystack.push(...(check.fields ?? [])); break;
      case 'transcript_contains_all':
      case 'transcript_contains_any':
        for (const value of check.values ?? []) {
          events.push({ type: 'tool_call', name: value, input: { mock: true } });
        }
        break;
      case 'transcript_tool_called':
        events.push({ type: 'tool_call', name: String((check.values ?? ['node'])[0]), input: { mock: true } });
        break;
      default: break;
    }
  }

  const usedJson = (fixture.assertions ?? []).some((assertion) => assertion.check?.kind === 'artifact_json_has_fields');
  let artifactText;
  if (usedJson) {
    const fields = {};
    for (const assertion of fixture.assertions) {
      if (assertion.check?.kind === 'artifact_json_has_fields') {
        for (const field of assertion.check.fields ?? []) {
          fields[field] = field === 'qualityGateResults'
            ? { 'gate-ide': 'pass', 'gate-pre-commit': 'pass', 'gate-ci': 'pass' }
            : `mock ${field}`;
        }
      }
    }
    for (const assertion of fixture.assertions) {
      if (assertion.check?.kind === 'artifact_contains_all') {
        for (const value of assertion.check.values ?? []) fields[value] = `mock ${value}`;
      }
    }
    for (const assertion of fixture.assertions) {
      if (assertion.check?.kind === 'artifact_contains_any') fields[assertion.check.values?.[0] ?? 'note'] = 'mock value';
    }
    artifactText = JSON.stringify(fields, null, 2);
  } else {
    const lines = [];
    for (const heading of new Set(headings)) lines.push(heading, '', 'mock body for the scorer smoke test');
    const body = [...lines.join('\n').split('\n')];
    if (body.length === 0) body.push('mock artifact');
    body.push('', ...new Set(haystack.filter((value) => value !== '' && !body.includes(value))));
    const needsWords = Math.max(0, ...((fixture.assertions ?? [])
      .filter((assertion) => assertion.check?.kind === 'artifact_min_words')
      .map((assertion) => assertion.check.min ?? 0)));
    while (countWords(body.join('\n')) < needsWords) body.push('filler content for the word-count assertion.');
    artifactText = `${body.join('\n')}\n`;
  }

  const artifactPath = path.join(here, 'results', 'mock', `${fixture.skill.split('/').pop()}-${mode}-trial-${trialIndex}${usedJson ? '.json' : '.md'}`);
  events.push({ type: 'artifact', path: path.relative(repoRoot, artifactPath), mock: true });
  events.push({
    type: 'end',
    status: 'completed',
    tokens: { input: 1000 * trialIndex, output: 250 * trialIndex },
    costUsd: 0.01,
    durationMs: 1000 * trialIndex,
    mock: true,
  });
  return { events, artifactPath, artifactText };
}

async function modeAll() {
  const files = await fixtureFiles();
  if (files.length === 0) fail(`no behavioural fixtures in ${path.relative(repoRoot, behavioralDir)}`);
  const bundleSkills = await listBundleSkills();
  const judgeConfig = await loadJudgeConfig(args['judge-config']);
  const requestedMock = !args.judge;
  const judge = resolveJudgeMode(judgeConfig, requestedMock);

  const rows = [];
  let schemaBroken = 0;
  let crashed = 0;

  for (const file of files) {
    const { fixture, errors } = await loadFixture(file);
    if (errors.length > 0 || fixture === null) {
      for (const error of errors) console.error(`ERROR ${error}`);
      schemaBroken += 1;
      continue;
    }
    const schemaErrors = validateFixture(fixture, file, bundleSkills);
    if (schemaErrors.length > 0) {
      for (const error of schemaErrors) console.error(`ERROR ${error}`);
      schemaBroken += 1;
      rows.push({ file: path.basename(file), status: 'broken', detail: schemaErrors[0] });
      continue;
    }

    try {
      await fs.mkdir(path.join(here, 'results', 'mock'), { recursive: true });
      const transcripts = {};
      for (const mode of ['with-skill', 'baseline']) {
        const trialCount = Math.max(1, fixture.trials);
        const events = [];
        for (let trialIndex = 1; trialIndex <= trialCount; trialIndex++) {
          const synthetic = syntheticTranscript(fixture, mode, trialIndex);
          await fs.writeFile(synthetic.artifactPath, synthetic.artifactText, 'utf8');
          if (trialIndex > 1) events.push({ type: 'trial', index: trialIndex, mock: true });
          events.push(...synthetic.events);
        }
        const transcriptPath = path.join(here, 'results', 'mock', `${fixture.skill.split('/').pop()}-${mode}.jsonl`);
        await fs.writeFile(transcriptPath, `${events.map((event) => JSON.stringify(event)).join('\n')}\n`, 'utf8');
        transcripts[mode] = await loadTranscript(transcriptPath);
      }

      const report = await runFixture({
        fixture, file,
        withTranscript: transcripts['with-skill'],
        baselineTranscript: transcripts.baseline,
        artifactOverride: null,
        judge,
        mode: 'mock',
      });

      const failed = report.with.assertions.reduce((sum, entry) => sum + entry.failed, 0);
      rows.push({
        file: path.basename(file),
        status: 'ok',
        detail: `${report.with.trials} trials, ${report.with.assertions.length} assertions (${failed} failed), verdict ${report.verdict.verdict}`,
      });

      if (args.out) {
        const target = path.resolve(repoRoot, String(args.out), path.basename(file).replace(/\.json$/, '.report.json'));
        await fs.mkdir(path.dirname(target), { recursive: true });
        await fs.writeFile(target, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
        const markdownPath = target.replace(/\.json$/, '.md');
        await fs.writeFile(markdownPath, `${renderMarkdown(report)}\n`, 'utf8');
      }
    } catch (error) {
      crashed += 1;
      rows.push({ file: path.basename(file), status: 'crashed', detail: error.message });
    }
  }

  for (const row of rows) {
    const label = row.status === 'ok' ? 'ok  ' : row.status === 'broken' ? 'FAIL' : 'FAIL';
    console.log(`${label} ${row.file}  ${row.detail}`);
  }
  console.log('');
  console.log(`behavioural fixtures: ${rows.length} file(s), ${schemaBroken} broken schema, ${crashed} crashed`);
  console.log(`judge mode: ${judge.mode} (${judge.reason}) — mock output is a scorer smoke test, never evidence about a model or a skill`);
  console.log(schemaBroken + crashed === 0 ? 'status: pass' : 'status: fail');
  process.exit(schemaBroken + crashed === 0 ? 0 : 1);
}

async function modeList() {
  const files = await fixtureFiles();
  for (const file of files) {
    const { fixture } = await loadFixture(file);
    console.log(`${path.basename(file).padEnd(28)} ${String(fixture?.skill ?? '?').padEnd(28)} assertions=${(fixture?.assertions ?? []).length} trials=${fixture?.trials ?? '?'}`);
  }
  console.log(`${files.length} fixture(s)`);
  process.exit(0);
}

/* ------------------------------------------------------------------ main */

if (args.list) await modeList();
else if (args.all) await modeAll();
else if (args.fixture || args.with) await modeSingle();
else {
  console.log('usage: node evals/run-behavioral.mjs <mode>');
  console.log('  --fixture <file.json> --with <transcript.jsonl> [--baseline <transcript.jsonl>]');
  console.log('                 [--artifact <path>] [--judge | --mock-judge] [--judge-config <file>]');
  console.log('                 [--out <report.json>] [--quiet]');
  console.log('  --all          run every fixture in mock mode; non-zero exit only on a broken fixture schema');
  console.log('  --list         list the fixtures');
  process.exit(1);
}
