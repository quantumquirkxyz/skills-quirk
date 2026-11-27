import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import path from 'node:path';

const root = process.cwd();
const script = path.join(root, 'scripts/check-release-metadata.mjs');
const run = (env = {}) => {
  try { return { status: 0, output: execFileSync(process.execPath, [script], { cwd: root, env: { ...process.env, ...env }, encoding: 'utf8' }) }; }
  catch (error) { return { status: error.status ?? 1, output: `${error.stdout ?? ''}${error.stderr ?? ''}` }; }
};

test('release metadata gate evaluates the current merge-base diff safely', () => {
  const result = run({ RELEASE_METADATA_BASE: 'origin/main' });
  assert.equal(result.status, 0);
  assert.match(result.output, /required update present/);
});

test('release metadata exemptions are explicit and bounded', () => {
  assert.equal(run({ RELEASE_METADATA_BASE: 'origin/main', RELEASE_METADATA_EXEMPTION: 'generated-only' }).status, 1);
  assert.equal(run({ RELEASE_METADATA_BASE: 'origin/main', RELEASE_METADATA_EXEMPTION: 'emergency-maintenance' }).status, 1);
  assert.equal(run({ RELEASE_METADATA_BASE: 'origin/main', RELEASE_METADATA_EXEMPTION: 'emergency-maintenance', RELEASE_METADATA_EXEMPTION_REASON: 'incident fix' }).status, 0);
  assert.equal(run({ RELEASE_METADATA_BASE: 'origin/main', RELEASE_METADATA_EXEMPTION: 'nope' }).status, 1);
});
