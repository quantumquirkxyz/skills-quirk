import { spawnSync } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const OUTCOMES = new Set(['killed', 'survived', 'equivalent', 'error']);

function assertCommand(command) {
  if (!Array.isArray(command) || command.length === 0 || command.some((part) => typeof part !== 'string' || part.length === 0)) {
    throw new TypeError('command must be a non-empty argv array');
  }
}

function assertRelativePath(file) {
  if (typeof file !== 'string' || !file || path.isAbsolute(file) || file.split(/[\\/]/).includes('..')) {
    throw new TypeError('mutator file must be a safe relative path');
  }
}

function readJson(workspace, file) {
  assertRelativePath(file);
  const target = path.join(workspace, file);
  const value = JSON.parse(fs.readFileSync(target, 'utf8'));
  return { target, value };
}

function writeJson(target, value) {
  fs.writeFileSync(target, `${JSON.stringify(value, null, 2)}\n`);
}

function setField(value, field, next) {
  if (typeof field !== 'string' || !field || field.split('.').some((part) => !part || part === '__proto__' || part === 'constructor' || part === 'prototype')) {
    throw new TypeError('mutator field must be a safe dotted path');
  }
  const parts = field.split('.');
  let cursor = value;
  for (const part of parts.slice(0, -1)) {
    if (!cursor || typeof cursor !== 'object' || !(part in cursor)) throw new Error(`field not found: ${field}`);
    cursor = cursor[part];
  }
  if (!cursor || typeof cursor !== 'object' || !(parts.at(-1) in cursor)) throw new Error(`field not found: ${field}`);
  cursor[parts.at(-1)] = next;
}

function jsonMutation(name, defaultField, transform) {
  return Object.freeze({
    name,
    apply(workspace, options = {}) {
      const { target, value } = readJson(workspace, options.file ?? 'policy.json');
      const field = options.field ?? defaultField;
      const before = JSON.stringify(value);
      transform(value, field);
      writeJson(target, value);
      return { changed: before !== JSON.stringify(value) };
    },
  });
}

export const mutators = Object.freeze({
  allowToDeny: jsonMutation('allow-to-deny', 'decision', (value, field) => setField(value, field, 'deny')),
  approvalRequired: jsonMutation('approval-required', 'approvalRequired', (value, field) => {
    const parts = field.split('.');
    let cursor = value;
    for (const part of parts.slice(0, -1)) {
      if (!cursor || typeof cursor !== 'object' || !(part in cursor)) throw new Error(`field not found: ${field}`);
      cursor = cursor[part];
    }
    const key = parts.at(-1);
    if (!cursor || typeof cursor !== 'object' || !(key in cursor) || typeof cursor[key] !== 'boolean') throw new Error(`boolean field not found: ${field}`);
    cursor[key] = !cursor[key];
  }),
  outcomeUnknown: jsonMutation('outcome-unknown', 'outcome', (value, field) => setField(value, field, 'outcome-unknown')),
});

function runCommand(command, cwd, timeoutMs) {
  const result = spawnSync(command[0], command.slice(1), { cwd, shell: false, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], timeout: timeoutMs });
  if (result.error) throw result.error;
  return { exitCode: result.status, signal: result.signal, stdout: result.stdout ?? '', stderr: result.stderr ?? '' };
}

function fingerprint(result) {
  return crypto.createHash('sha256').update(JSON.stringify(result)).digest('hex');
}

export function runMutationSuite({ source, command, mutatorCases, timeoutMs = 30_000, keepWorkspace = false } = {}) {
  if (typeof source !== 'string' || !source || !fs.statSync(source).isDirectory()) throw new TypeError('source must be a directory');
  assertCommand(command);
  if (!Array.isArray(mutatorCases) || mutatorCases.length === 0) throw new TypeError('mutatorCases must be a non-empty array');
  if (!Number.isSafeInteger(timeoutMs) || timeoutMs <= 0) throw new TypeError('timeoutMs must be a positive integer');
  const baseline = runCommand(command, source, timeoutMs);
  const suite = { schemaVersion: 1, baseline: { ...baseline, fingerprint: fingerprint(baseline) }, results: [] };
  for (const [index, testCase] of mutatorCases.entries()) {
    const name = testCase?.name ?? `mutation-${index + 1}`;
    const apply = testCase?.apply;
    if (typeof apply !== 'function') throw new TypeError(`${name} must provide apply(workspace)`);
    const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'quirk-mutant-'));
    const result = { name, status: 'error', changed: false, error: null };
    try {
      fs.cpSync(source, workspace, { recursive: true });
      const mutation = apply(workspace);
      result.changed = mutation?.changed !== false;
      if (!result.changed) result.status = 'equivalent';
      else {
        const observed = runCommand(command, workspace, timeoutMs);
        result.observed = { ...observed, fingerprint: fingerprint(observed) };
        result.status = observed.exitCode === baseline.exitCode && observed.signal === baseline.signal && observed.stdout === baseline.stdout && observed.stderr === baseline.stderr ? 'survived' : 'killed';
      }
    } catch (error) {
      result.error = { name: error.name, message: error.message };
    } finally {
      if (!keepWorkspace) fs.rmSync(workspace, { recursive: true, force: true });
      else result.workspace = workspace;
    }
    if (!OUTCOMES.has(result.status)) throw new Error('invalid mutation outcome');
    suite.results.push(result);
  }
  return suite;
}

export function casesFromMutators(cases = []) {
  if (!Array.isArray(cases)) throw new TypeError('cases must be an array');
  return cases.map(({ mutator, options, name }) => {
    if (!mutator || typeof mutator.apply !== 'function') throw new TypeError('mutator must expose apply');
    return { name: name ?? mutator.name, apply: (workspace) => mutator.apply(workspace, options) };
  });
}
