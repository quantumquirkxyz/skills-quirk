#!/usr/bin/env node
// Reproducible, non-mutating command runner for engineering modernization.
// Usage: node scripts/baseline-report.mjs [--out path] [--only id]
// Records failures independently; never asserts a gate passed without execution.
import { spawnSync } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const definitions = [
  ['tests', 'npm', ['test']],
  ['full-gate', 'node', ['.agents/skills/platform/check-all.mjs']],
  ['routing', 'npm', ['run', 'evals:routing:check']],
  ['behavioral', 'npm', ['run', 'evals:behavioral:mock']],
  ['security', 'npm', ['run', 'scan:skills']],
  ['traceability', 'npm', ['run', 'traceability']],
  ['context', 'npm', ['run', 'audit:context']],
  ['memory', 'npm', ['run', 'memory:check']],
];
// Do not persist execution output: arbitrary test logs can contain secrets.
const args = process.argv.slice(2);
function option(name) {
  const index = args.indexOf(name);
  if (index < 0) return null;
  if (!args[index + 1] || args[index + 1].startsWith('--')) throw new Error(name + ' requires a value');
  return args[index + 1];
}
try {
  const outPath = path.resolve(root, option('--out') || '.skill-sandbox/baseline/baseline-report.json');
  const only = option('--only');
  if (only && !definitions.some(([id]) => id === only)) throw new Error('Unknown check: ' + only);
  const records = [];
  for (const [id, executable, commandArgs] of definitions) {
    if (only && id !== only) continue;
    const start = performance.now();
    const run = spawnSync(executable, commandArgs, {
      cwd: root, encoding: 'utf8', timeout: 180000, maxBuffer: 3 * 1024 * 1024,
      env: { ...process.env, CI: 'true' },
    });
    const status = run.error?.code === 'ETIMEDOUT' ? 'BLOCKED' : run.error ? 'BLOCKED' : run.status === 0 ? 'PASS' : 'FAIL';
    records.push({
      id, command: [executable, ...commandArgs],
      status, exit_code: run.status, signal: run.signal || null,
      duration_ms: Math.round(performance.now() - start),
      error_code: run.error?.code || null,
      // Store status and failure category only. Detailed logs remain in CI's access-controlled run.
    });
  }
  const git = spawnSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8', timeout: 5000 });
  const report = {
    schema_version: 1, revision: git.status === 0 ? git.stdout.trim() : null,
    node: process.version, platform: process.platform, architecture: process.arch,
    captured_at: new Date().toISOString(),
    checks: records,
    summary: Object.fromEntries(['PASS', 'FAIL', 'BLOCKED', 'NOT RUN'].map(s => [s, records.filter(r => r.status === s).length])),
  };
  await fs.mkdir(path.dirname(outPath), { recursive: true });
  await fs.writeFile(outPath, JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify({ report: outPath, summary: report.summary }, null, 2));
  if (records.some(r => r.status !== 'PASS')) process.exitCode = 1;
} catch (error) {
  console.error(error.message);
  process.exitCode = 2;
}
