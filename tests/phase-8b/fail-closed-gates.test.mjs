import test from 'node:test';
import assert from 'node:assert/strict';

// Local adapter for Phase 8B. It deliberately owns no production scorecard code.
function evaluateGate({ evidence, baseline, candidate, mutations }) {
  const failures = [];
  if (!Array.isArray(evidence) || evidence.length === 0) failures.push('missing-evidence');
  if (evidence?.some((entry) => !entry || entry.status === 'NOT-RUN')) failures.push('not-run');
  if (!baseline || !candidate || baseline.schemaVersion !== candidate.schemaVersion || baseline.revision !== candidate.baselineRevision) {
    failures.push('incompatible-baseline');
  }
  const ids = candidate?.checks?.map((check) => check.id) ?? [];
  if (new Set(ids).size !== ids.length) failures.push('duplicate-id');
  if (candidate?.checks?.some((check) => check.critical && check.status !== 'PASS')) failures.push('critical-regression');
  if (!Array.isArray(mutations) || mutations.some((mutation) => mutation.status === 'survived')) failures.push('surviving-mutant');
  return { ok: failures.length === 0, failures };
}

const baseline = { schemaVersion: 1, revision: 'r1' };
const passingCandidate = {
  schemaVersion: 1,
  baselineRevision: 'r1',
  checks: [{ id: 'contract', status: 'PASS', critical: true }],
};
const passingInput = { evidence: [{ id: 'run-1', status: 'PASS' }], baseline, candidate: passingCandidate, mutations: [{ name: 'deny', status: 'killed' }] };

test('missing evidence fails closed', () => {
  const result = evaluateGate({ ...passingInput, evidence: [] });
  assert.deepEqual(result, { ok: false, failures: ['missing-evidence'] });
});

test('NOT-RUN evidence fails closed instead of passing by omission', () => {
  const result = evaluateGate({ ...passingInput, evidence: [{ id: 'run-1', status: 'NOT-RUN' }] });
  assert.deepEqual(result, { ok: false, failures: ['not-run'] });
});

test('incompatible baseline fails closed', () => {
  const result = evaluateGate({ ...passingInput, baseline: { schemaVersion: 2, revision: 'old' } });
  assert.deepEqual(result, { ok: false, failures: ['incompatible-baseline'] });
});

test('critical regression fails closed even when non-critical checks pass', () => {
  const candidate = { ...passingCandidate, checks: [
    { id: 'contract', status: 'FAIL', critical: true },
    { id: 'style', status: 'PASS', critical: false },
  ] };
  const result = evaluateGate({ ...passingInput, candidate });
  assert.deepEqual(result, { ok: false, failures: ['critical-regression'] });
});

test('duplicate IDs fail closed', () => {
  const candidate = { ...passingCandidate, checks: [
    { id: 'contract', status: 'PASS', critical: true },
    { id: 'contract', status: 'PASS', critical: false },
  ] };
  const result = evaluateGate({ ...passingInput, candidate });
  assert.deepEqual(result, { ok: false, failures: ['duplicate-id'] });
});

test('surviving mutants fail closed', () => {
  const result = evaluateGate({ ...passingInput, mutations: [{ name: 'noop', status: 'survived' }] });
  assert.deepEqual(result, { ok: false, failures: ['surviving-mutant'] });
});

test('all required evidence gates pass only with complete compatible inputs', () => {
  assert.deepEqual(evaluateGate(passingInput), { ok: true, failures: [] });
});

test('multiple failures remain fail-closed and are all reported', () => {
  const result = evaluateGate({
    evidence: [{ id: 'run-1', status: 'NOT-RUN' }],
    baseline: { schemaVersion: 9, revision: 'old' },
    candidate: { schemaVersion: 1, baselineRevision: 'r1', checks: [
      { id: 'contract', status: 'FAIL', critical: true },
      { id: 'contract', status: 'PASS', critical: false },
    ] },
    mutations: [{ name: 'noop', status: 'survived' }],
  });
  assert.equal(result.ok, false);
  assert.deepEqual(result.failures, ['not-run', 'incompatible-baseline', 'duplicate-id', 'critical-regression', 'surviving-mutant']);
});
