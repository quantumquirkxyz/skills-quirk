import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { casesFromMutators, mutators, runMutationSuite } from './mutation-runner.mjs';

function fixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'quirk-mutation-test-'));
  fs.writeFileSync(path.join(root, 'policy.json'), JSON.stringify({ decision: 'allow', approvalRequired: false, outcome: 'success' }));
  return root;
}

const command = [process.execPath, '-e', "const p=require('./policy.json'); process.stdout.write(p.decision === 'allow' && !p.approvalRequired && p.outcome === 'success' ? 'pass' : 'fail'); process.exit(p.decision === 'allow' && !p.approvalRequired && p.outcome === 'success' ? 0 : 1)"];

test('built-in policy mutators produce deterministic killed results and clean up copies', () => {
  const source = fixture();
  const suite = runMutationSuite({ source, command, mutatorCases: casesFromMutators([
    { mutator: mutators.allowToDeny },
    { mutator: mutators.approvalRequired },
    { mutator: mutators.outcomeUnknown },
  ]) });
  assert.equal(suite.baseline.exitCode, 0);
  assert.deepEqual(suite.results.map((result) => result.status), ['killed', 'killed', 'killed']);
  assert.deepEqual(JSON.parse(fs.readFileSync(path.join(source, 'policy.json'))), { decision: 'allow', approvalRequired: false, outcome: 'success' });
  fs.rmSync(source, { recursive: true, force: true });
});

test('unchanged mutator is equivalent and passing mutation survives', () => {
  const source = fixture();
  const suite = runMutationSuite({ source, command, mutatorCases: [
    { name: 'no-op', apply: () => ({ changed: false }) },
    { name: 'irrelevant', apply: (workspace) => { fs.writeFileSync(path.join(workspace, 'note.txt'), 'ignored'); } },
  ] });
  assert.deepEqual(suite.results.map((result) => result.status), ['equivalent', 'survived']);
  fs.rmSync(source, { recursive: true, force: true });
});

test('mutator failures are reported as error without stopping later cases', () => {
  const source = fixture();
  const suite = runMutationSuite({ source, command, mutatorCases: [
    { name: 'bad', apply: () => { throw new Error('controlled failure'); } },
    { name: 'good', apply: () => ({ changed: false }) },
  ] });
  assert.equal(suite.results[0].status, 'error');
  assert.equal(suite.results[0].error.message, 'controlled failure');
  assert.equal(suite.results[1].status, 'equivalent');
  fs.rmSync(source, { recursive: true, force: true });
});

test('rejects shell-like command input and unsafe mutator paths', () => {
  const source = fixture();
  assert.throws(() => runMutationSuite({ source, command: 'node', mutatorCases: [{ apply() {} }] }), /argv array/);
  assert.throws(() => mutators.allowToDeny.apply(source, { file: '../policy.json' }), /safe relative path/);
  fs.rmSync(source, { recursive: true, force: true });
});
