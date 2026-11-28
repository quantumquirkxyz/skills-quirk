import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const root = process.cwd();
const script = path.join(root, 'scripts/check-release-metadata.mjs');
const run = (cwd = root, env = {}) => {
  try { return { status: 0, output: execFileSync(process.execPath, [script], { cwd, env: { ...process.env, ...env }, encoding: 'utf8' }) }; }
  catch (error) { return { status: error.status ?? 1, output: `${error.stdout ?? ''}${error.stderr ?? ''}` }; }
};

function fixture() {
  const cwd = fs.mkdtempSync(path.join(os.tmpdir(), 'quirk-release-gate-'));
  const git = (...args) => execFileSync('git', args, { cwd, stdio: 'ignore' });
  git('init', '-b', 'main');
  git('config', 'user.email', 'test@example.com');
  git('config', 'user.name', 'Release Test');
  fs.writeFileSync(path.join(cwd, 'VERSION'), '1.0.0\n');
  fs.writeFileSync(path.join(cwd, 'CHANGELOG.md'), '# Changelog\n\n## [Unreleased]\n- test\n\n## [1.0.0]\n');
  fs.writeFileSync(path.join(cwd, 'README.md'), 'initial\n');
  git('add', '.'); git('commit', '-m', 'test: initialize release fixture');
  fs.writeFileSync(path.join(cwd, 'README.md'), 'changed\n');
  git('add', 'README.md'); git('commit', '-m', 'test: add shipping change');
  fs.writeFileSync(path.join(cwd, 'VERSION'), '1.0.1\n');
  fs.writeFileSync(path.join(cwd, 'CHANGELOG.md'), '# Changelog\n\n## [Unreleased]\n- shipping change\n\n## [1.0.0]\n');
  git('add', 'VERSION', 'CHANGELOG.md'); git('commit', '-m', 'test: add release metadata');
  return cwd;
}

test('release metadata gate evaluates the current merge-base diff safely', () => {
  const cwd = fixture();
  const result = run(cwd, { RELEASE_METADATA_BASE: 'HEAD^' });
  fs.rmSync(cwd, { recursive: true, force: true });
  assert.equal(result.status, 0);
  assert.match(result.output, /required update present/);
});

test('release metadata exemptions are explicit and bounded', () => {
  const cwd = fixture();
  const env = { RELEASE_METADATA_BASE: 'HEAD^' };
  assert.equal(run(cwd, { ...env, RELEASE_METADATA_EXEMPTION: 'generated-only' }).status, 1);
  assert.equal(run(cwd, { ...env, RELEASE_METADATA_EXEMPTION: 'emergency-maintenance' }).status, 1);
  assert.equal(run(cwd, { ...env, RELEASE_METADATA_EXEMPTION: 'emergency-maintenance', RELEASE_METADATA_EXEMPTION_REASON: 'incident fix' }).status, 0);
  assert.equal(run(cwd, { ...env, RELEASE_METADATA_EXEMPTION: 'nope' }).status, 1);
  fs.rmSync(cwd, { recursive: true, force: true });
});
