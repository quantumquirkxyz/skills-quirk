import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { validateLifecycleContract } from '../lifecycle-contract-gate.mjs';

const fixture = JSON.parse(fs.readFileSync(path.join(path.dirname(new URL(import.meta.url).pathname), '..', 'fixtures', 'lifecycle-contract.json'), 'utf8'));

test('valid lifecycle fixture passes every handoff and evidence gate', () => {
  assert.equal(validateLifecycleContract(fixture).status, 'pass');
});

test('missing journal is audit-incomplete, not a pass', () => {
  const candidate = structuredClone(fixture);
  delete candidate.execution.journal;
  const result = validateLifecycleContract(candidate);
  assert.equal(result.status, 'audit-incomplete');
  assert.equal(result.auditIncomplete, true);
});

test('release without rollback evidence fails closed', () => {
  const candidate = structuredClone(fixture);
  delete candidate.stages.find((stage) => stage.id === 'release').rollbackEvidence;
  assert.equal(validateLifecycleContract(candidate).status, 'fail');
});

test('maintenance must feed corrective requirements or approved risk', () => {
  const candidate = structuredClone(fixture);
  delete candidate.stages.find((stage) => stage.id === 'maintenance').correctiveRequirement;
  assert.ok(validateLifecycleContract(candidate).errors.some((error) => error.includes('maintenance must feed')));
});
