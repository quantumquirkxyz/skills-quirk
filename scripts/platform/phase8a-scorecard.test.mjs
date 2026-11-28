import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluatePhase8A, isPhase8APassing, PHASE8A_DIMENSIONS } from './phase8a-scorecard.mjs';

const complete = (status = 'PASS', overrides = {}) => PHASE8A_DIMENSIONS.map((id) => ({
  id, status, evidenceIds: status === 'NOT-RUN' ? [] : [`evidence-${id}`], ...overrides[id],
}));

test('returns PASS only when every dimension passes with evidence', () => {
  const result = evaluatePhase8A({ dimensions: complete(), evaluatedAt: '2026-11-28T00:00:00.000Z' }, { id: () => 'score-1' });
  assert.equal(result.verdict, 'PASS');
  assert.equal(result.scorecardId, 'score-1');
  assert.deepEqual(result.counts, { PASS: 9, FAIL: 0, BLOCKED: 0, 'NOT-RUN': 0 });
  assert.equal(isPhase8APassing(result), true);
});

test('critical failure blocks regardless of other dimension results', () => {
  const dimensions = complete('PASS');
  dimensions[1] = { id: 'security', status: 'FAIL', critical: true, evidenceIds: ['security-failure'] };
  const result = evaluatePhase8A({ dimensions });
  assert.equal(result.verdict, 'BLOCKED');
  assert.equal(result.counts.FAIL, 1);
});

test('non-critical failure is FAIL and is not hidden by a count summary', () => {
  const dimensions = complete('PASS');
  dimensions[6] = { id: 'mutation', status: 'FAIL', evidenceIds: ['mutation-failure'] };
  const result = evaluatePhase8A({ dimensions });
  assert.equal(result.verdict, 'FAIL');
  assert.equal(result.counts.PASS, 8);
  assert.equal(result.counts.FAIL, 1);
});

test('NOT-RUN is explicit and partial execution blocks the scorecard', () => {
  const dimensions = complete('PASS');
  dimensions[4] = { id: 'replay', status: 'NOT-RUN', reason: 'fixture unavailable', evidenceIds: [] };
  const result = evaluatePhase8A({ dimensions });
  assert.equal(result.verdict, 'BLOCKED');
  assert.equal(result.counts['NOT-RUN'], 1);
  assert.equal(result.dimensions[4].reason, 'fixture unavailable');
});

test('missing evidence fails closed as a critical BLOCKED dimension', () => {
  const dimensions = complete('PASS');
  dimensions[0] = { id: 'contract', status: 'PASS', evidenceIds: [] };
  const result = evaluatePhase8A({ dimensions });
  assert.equal(result.verdict, 'BLOCKED');
  assert.equal(result.dimensions[0].status, 'BLOCKED');
  assert.equal(result.dimensions[0].critical, true);
});

test('requires all nine dimensions and rejects duplicates', () => {
  assert.throws(() => evaluatePhase8A({ dimensions: complete().slice(1) }), /missing Phase 8A dimensions/);
  const dimensions = complete();
  dimensions[1] = { ...dimensions[0], id: dimensions[0].id };
  assert.throws(() => evaluatePhase8A({ dimensions }), /duplicate dimension/);
});

test('all NOT-RUN dimensions produce NOT-RUN, not PASS', () => {
  const dimensions = complete('NOT-RUN').map((item) => ({ ...item, reason: 'not applicable in this environment' }));
  const result = evaluatePhase8A({ dimensions });
  assert.equal(result.verdict, 'NOT-RUN');
});
