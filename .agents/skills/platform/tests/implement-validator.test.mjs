import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const root = process.cwd();
const validator = path.join(root, '.agents/skills/delivery/implement/scripts/validate-implementation.mjs');
const sha = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim();
const artifact = () => ({
  status: 'completed', commitSha: sha, branch: 'main', nextConsumer: 'publish-open-pr',
  validation: { acceptanceCriteriaMet: true },
  qualityGateResults: { gateIde: 'pass', gatePreCommit: 'pass', gateCi: 'pass' },
});

function run(value) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'quirk-implement-validator-'));
  const file = path.join(dir, 'artifact.json');
  fs.writeFileSync(file, JSON.stringify(value));
  try {
    return { status: 0, output: execFileSync(process.execPath, [validator, file, 'main'], { cwd: root, encoding: 'utf8' }) };
  } catch (error) {
    return { status: error.status ?? 1, output: `${error.stdout ?? ''}${error.stderr ?? ''}` };
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
}

test('implementation validator accepts a real completed artifact', () => {
  assert.equal(run(artifact()).status, 0);
});

test('implementation validator rejects legacy gate names and false success', () => {
  const invalid = artifact();
  invalid.qualityGateResults = { gateIde: 'pass', gatePreCommit: 'pass', gateCI: 'passed' };
  const result = run(invalid);
  assert.notEqual(result.status, 0);
  assert.match(result.output, /schema validation|gateCi/);
});
