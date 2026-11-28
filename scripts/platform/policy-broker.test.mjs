import test from 'node:test';
import assert from 'node:assert/strict';
import { PolicyBroker } from './policy-broker.mjs';

const request = { identity: 'agent-1', tool: 'files', destination: 'workspace/a.txt', action: 'read' };
function broker(overrides = {}, now = new Date('2026-01-01T00:00:00.000Z')) {
  return new PolicyBroker({ now: () => now, id: (() => { let n = 0; return () => `id-${++n}`; })(), policy: { files: { destinations: ['workspace/a.txt'], actions: ['read', 'write'], ...overrides } } });
}

test('undeclared tool is denied fail-closed', () => {
  const result = broker().authorize({ ...request, tool: 'shell' });
  assert.equal(result.decision, 'deny');
  assert.equal(result.reason, 'tool-not-declared');
});

test('destination outside allowlist is denied', () => {
  const result = broker().authorize({ ...request, destination: 'outside/secret.txt' });
  assert.equal(result.decision, 'deny');
  assert.equal(result.reason, 'destination-not-allowed');
});

test('missing approval asks at decision stage and denies authorization', () => {
  const policy = broker({ approvalRequired: true });
  assert.equal(policy.decide(request).decision, 'ask');
  assert.equal(policy.authorize(request).decision, 'deny');
});

test('expired approval is denied', () => {
  const now = new Date('2026-01-01T00:20:00.000Z');
  const policy = broker({ approvalRequired: true }, now);
  const approval = policy.issueApproval({ ...request, approvalId: 'a-1', issuedAt: '2026-01-01T00:00:00.000Z', expiresAt: '2026-01-01T00:10:00.000Z' });
  const result = policy.authorize({ ...request, approvalId: approval.approvalId });
  assert.equal(result.decision, 'deny');
  assert.equal(result.reason, 'approval-expired');
});

test('mismatched approval is denied', () => {
  const policy = broker({ approvalRequired: true });
  const approval = policy.issueApproval({ ...request, approvalId: 'a-2' });
  const result = policy.authorize({ ...request, action: 'write', approvalId: approval.approvalId });
  assert.equal(result.decision, 'deny');
  assert.equal(result.reason, 'approval-mismatched');
});

test('read-only policy denies writes', () => {
  const result = broker({ readOnly: true }).authorize({ ...request, action: 'write' });
  assert.equal(result.decision, 'deny');
  assert.equal(result.reason, 'read-only-write');
});

test('allowed decisions emit schema-compatible side-effect records', () => {
  const policy = broker();
  const result = policy.authorize(request);
  assert.equal(result.decision, 'allow');
  assert.equal(result.record.schemaVersion, '1.0');
  assert.equal(result.record.kind, 'policy');
  assert.equal(policy.records().length, 1);
});
