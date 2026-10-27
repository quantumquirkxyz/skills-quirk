#!/usr/bin/env node
// Offline smoke test of the published npm archive shape and managed adoption.
// This tests the package payload, not availability on the public npm registry.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = fileURLToPath(new URL('../', import.meta.url));
const npmCli = process.env.npm_execpath;
const runNpm = (args, cwd) => npmCli
  ? run(process.execPath, [npmCli, ...args], cwd)
  : run(process.platform === 'win32' ? 'npm.cmd' : 'npm', args, cwd, { shell: process.platform === 'win32' });
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'quirk-distribution-'));
const run = (executable, args, cwd, extra = {}) => {
  const result = spawnSync(executable, args, { cwd, encoding: 'utf8', timeout: 90000, maxBuffer: 5 * 1024 * 1024, ...extra });
  if (result.status !== 0) throw new Error(`${executable} ${args[0]} failed: ${result.stderr || result.stdout || result.error?.message}`);
  return result.stdout.trim();
};

try {
  const pkgName = runNpm(['pack', '--offline', '--silent', '--ignore-scripts', '--pack-destination', tmp], root).split('\n').at(-1);
  const archive = path.join(tmp, pkgName);
  if (!fs.statSync(archive).isFile()) throw new Error('npm did not produce an archive');
  const prefix = path.join(tmp, 'prefix');
  runNpm(['install', '--offline', '--no-audit', '--no-fund', '--ignore-scripts', '--prefix', prefix, archive], root);
  const packageRoot = path.join(prefix, 'node_modules', 'skills-quirk');
  for (const required of ['.agents/AGENTS.md', '.agents/skills/platform/sync-bundle.mjs', 'skills.json', 'skills-lock.json', 'AUTHORSHIP.md', '.env.template', 'hooks/hooks.json']) {
    if (!fs.existsSync(path.join(packageRoot, required))) throw new Error('Missing packaged file: ' + required);
  }
  const consumer = path.join(tmp, 'consumer');
  fs.mkdirSync(consumer);
  fs.writeFileSync(path.join(consumer, 'README.md'), 'My application\n');
  fs.writeFileSync(path.join(consumer, 'CONTEXT.md'), 'My application context\n');
  const cli = path.join(packageRoot, 'bin', 'skills-quirk.js');
  const preview = JSON.parse(run(process.execPath, [cli, 'adopt'], consumer));
  if (preview.mode !== 'dry-run') throw new Error('CLI adopt did not default to dry-run');
  if (fs.existsSync(path.join(consumer, '.agents', 'skills'))) throw new Error('Dry-run mutated consumer');
  const applied = JSON.parse(run(process.execPath, [cli, 'adopt', '--write'], consumer));
  if (applied.mode !== 'write') throw new Error('CLI did not write bundle');
  run(process.execPath, [cli, 'adopt', '--write'], consumer);
  if (fs.readFileSync(path.join(consumer, 'README.md'), 'utf8') !== 'My application\n' ||
      fs.readFileSync(path.join(consumer, 'CONTEXT.md'), 'utf8') !== 'My application context\n') {
    throw new Error('Managed adoption overwrote project identity');
  }
  if (!fs.existsSync(path.join(consumer, '.agents', 'AGENTS.md'))) throw new Error('Missing installed governance file');
  if (!fs.existsSync(path.join(consumer, 'skills.json'))) throw new Error('Missing installed skills manifest');
  const compat = path.join(consumer, '.claude', 'skills', 'ask-to');
  if (!fs.lstatSync(compat).isSymbolicLink() || !fs.statSync(compat).isDirectory()) {
    throw new Error('Native compatibility symlink is absent or broken');
  }
  console.log(JSON.stringify({ status: 'PASS', installedSkills: fs.readdirSync(path.join(consumer, '.claude', 'skills')).length, archive: pkgName }));
} catch (error) {
  console.error('Distribution verification failed:', error.message);
  process.exitCode = 1;
} finally {
  fs.rmSync(tmp, { recursive: true, force: true });
}
