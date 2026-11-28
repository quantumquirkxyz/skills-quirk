import test from 'node:test';
import assert from 'node:assert/strict';
import { SideEffectLedger, createSideEffectRecord, detectUndeclaredEffects, reconcileEffect, sideEffectLedgerLimits } from './side-effect-ledger.mjs';

test('creates bounded schema-v1-compatible records with digests and redaction', () => {
  const record = createSideEffectRecord({
    operationId: 'op-1', runId: 'run-1', toolCallId: 'tool-1', action: 'write-file', resource: '/tmp/example',
    kind: 'filesystem', policyDecision: 'allow', approvalRef: 'approval-1', arguments: { token: 'do-not-store', path: '/tmp/example' },
    before: 'old', after: 'new', attempt: 2, result: { status: 'ok' },
  }, { now: () => '2026-01-01T00:00:00.000Z', id: () => 'effect-1' });
  assert.equal(record.schemaVersion, '1.0');
  assert.equal(record.operation, 'write-file');
  assert.match(record.details.argumentDigest, /^[a-f0-9]{64}$/);
  assert.equal(record.details.approvalRef, 'approval-1');
  assert.equal(record.details.attempt, 2);
  assert.equal(record.details.metadata, undefined);
  assert.deepEqual(record.details.error, {});
});

test('ledger is append-only and capacity bounded', () => {
  const ledger = new SideEffectLedger({ maxEntries: 1 });
  ledger.append({ operationId: 'op', runId: 'run', toolCallId: 'call', action: 'read', resource: 'db' });
  assert.equal(ledger.records().length, 1);
  assert.throws(() => ledger.append({ operationId: 'op2', runId: 'run', toolCallId: 'call2', action: 'read', resource: 'db' }), /capacity/);
  const records = ledger.records();
  records.push('mutated-copy');
  assert.equal(ledger.records().length, 1);
});

test('pure undeclared-effect detection compares action and resource only', () => {
  const observed = [{ effectId: '1', action: 'write', resource: 'file-a' }, { effectId: '2', operation: 'delete', target: 'file-b' }];
  const declared = [{ action: 'write', resource: 'file-a' }];
  assert.deepEqual(detectUndeclaredEffects({ observed, declared }), [{ action: 'delete', resource: 'file-b', effectId: '2' }]);
  assert.deepEqual(observed, [{ effectId: '1', action: 'write', resource: 'file-a' }, { effectId: '2', operation: 'delete', target: 'file-b' }]);
});

test('reconciliation returns digest-only before/after evidence', () => {
  const reconciliation = reconcileEffect({ before: { count: 1 }, after: { count: 2 }, result: { ok: true } });
  assert.equal(reconciliation.status, 'reconciled');
  assert.match(reconciliation.beforeDigest, /^[a-f0-9]{64}$/);
  assert.match(reconciliation.afterDigest, /^[a-f0-9]{64}$/);
  assert.deepEqual(reconciliation.result, { ok: true });
});

test('limits are explicit for bounded consumers', () => {
  assert.equal(sideEffectLedgerLimits.maxDetailsBytes, 4096);
  assert.equal(sideEffectLedgerLimits.maxEntries, 1000);
});
