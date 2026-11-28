import { test } from 'node:test';
import assert from 'node:assert/strict';
import { compareBaselines } from '../scripts/baseline-scorecard.mjs';

const report = checks => ({ revision: 'a', checks });

test('pass-to-fail is a regression', () => {
  const x = compareBaselines(report([{ id: 'security', status: 'PASS' }]), report([{ id: 'security', status: 'FAIL' }]));
  assert.equal(x.ok, false);
  assert.equal(x.findings[0].type, 'regression');
});

test('missing checks fail closed', () => {
  const x = compareBaselines(report([{ id: 'security', status: 'PASS' }]), report([]));
  assert.equal(x.ok, false);
  assert.equal(x.findings[0].type, 'missing-check');
});

test('strict blocks unresolved previous failures', () => {
  const a = report([{ id: 'routing', status: 'FAIL' }]);
  assert.equal(compareBaselines(a, a).ok, true);
  assert.equal(compareBaselines(a, a, { strict: true }).ok, false);
});

test('invalid and duplicate identifiers are rejected', () => {
  assert.throws(() => compareBaselines(report([{ id: 'a', status: 'PASS' }, { id: 'a', status: 'PASS' }]), report([])), TypeError);
});
