#!/usr/bin/env node
import { spawnSync, execFileSync } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const STATUSES = new Set(['PASS', 'FAIL', 'BLOCKED', 'NOT-RUN']);

function gitRevision(cwd) {
  try { return execFileSync('git', ['rev-parse', 'HEAD'], { cwd, encoding: 'utf8' }).trim(); }
  catch { return null; }
}

function packageVersion(cwd) {
  try { return JSON.parse(fs.readFileSync(path.join(cwd, 'package.json'), 'utf8')).version ?? null; }
  catch { return null; }
}

function artifactReference(input, cwd) {
  const absolute = path.resolve(cwd, input);
  const relative = path.relative(cwd, absolute) || path.basename(absolute);
  try {
    const stat = fs.statSync(absolute);
    if (!stat.isFile()) return { path: relative, status: 'UNAVAILABLE', reason: 'not a regular file' };
    const digest = crypto.createHash('sha256').update(fs.readFileSync(absolute)).digest('hex');
    return { path: relative, sha256: digest, bytes: stat.size, status: 'PRESENT' };
  } catch (error) {
    return { path: relative, status: 'UNAVAILABLE', reason: error.code || 'read-error' };
  }
}

export function buildManifest({ cwd = ROOT, command = [], status, exitCode = null, durationMs = 0, artifacts = [], reason = null }) {
  const resolvedCwd = path.resolve(cwd);
  const finalStatus = status || (exitCode === 0 ? 'PASS' : 'FAIL');
  if (!STATUSES.has(finalStatus)) throw new Error(`Invalid status: ${finalStatus}`);
  if (finalStatus === 'NOT-RUN' && command.length > 0) throw new Error('NOT-RUN manifests cannot include a command');
  return {
    schema_version: 1,
    captured_at: new Date().toISOString(),
    commit: gitRevision(resolvedCwd),
    versions: { node: process.version, package: packageVersion(resolvedCwd) },
    platform: { os: process.platform, release: os.release(), architecture: process.arch },
    execution: {
      command,
      cwd: resolvedCwd,
      duration_ms: Math.max(0, Math.round(durationMs)),
      exit_code: exitCode,
      status: finalStatus,
      reason,
    },
    artifacts: artifacts.map((artifact) => artifactReference(artifact, resolvedCwd)),
  };
}

function valueAfter(args, flag) {
  const index = args.indexOf(flag);
  if (index < 0) return null;
  const value = args[index + 1];
  if (!value || value.startsWith('--')) throw new Error(`${flag} requires a value`);
  return value;
}

export function parseArgs(args) {
  const separator = args.indexOf('--');
  const options = separator < 0 ? args : args.slice(0, separator);
  const command = separator < 0 ? [] : args.slice(separator + 1);
  const out = valueAfter(options, '--out');
  const status = valueAfter(options, '--status');
  const reason = valueAfter(options, '--reason');
  const artifacts = options.flatMap((arg, index) => arg === '--artifact' ? [options[index + 1]] : []).filter(Boolean);
  if (!out) throw new Error('--out requires a path');
  if (status && !STATUSES.has(status)) throw new Error(`Invalid status: ${status}`);
  if (!status && command.length === 0) throw new Error('provide a command after -- or use --status NOT-RUN');
  return { out, status, reason, artifacts, command };
}

export function run(args, now = () => performance.now()) {
  const options = parseArgs(args);
  const cwd = process.cwd();
  let exitCode = null;
  let status = options.status;
  let durationMs = 0;
  if (!status) {
    const started = now();
    const result = spawnSync(options.command[0], options.command.slice(1), { cwd, stdio: 'ignore', encoding: 'utf8' });
    durationMs = now() - started;
    exitCode = result.status;
    status = result.error ? 'BLOCKED' : result.status === 0 ? 'PASS' : 'FAIL';
  }
  const manifest = buildManifest({ cwd, command: options.command, status, exitCode, durationMs, artifacts: options.artifacts, reason: options.reason });
  const output = path.resolve(cwd, options.out);
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, `${JSON.stringify(manifest, null, 2)}\n`);
  return { manifest, output };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const result = run(process.argv.slice(2));
    console.log(JSON.stringify({ manifest: result.output, status: result.manifest.execution.status }, null, 2));
    process.exitCode = result.manifest.execution.status === 'PASS' || result.manifest.execution.status === 'NOT-RUN' ? 0 : 1;
  } catch (error) {
    console.error(error.message);
    process.exitCode = 2;
  }
}
