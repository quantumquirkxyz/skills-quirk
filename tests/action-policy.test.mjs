import { test } from 'node:test';
import assert from 'node:assert/strict';
import { authorizeAction } from '../.agents/skills/platform/action-policy.mjs';
const grant = { actions: ['read', 'remote-write', 'merge'], resources: ['repo/a'] };

test('fails closed for invalid actions and no resource', () => {
  assert.equal(authorizeAction({ action: 'exec', resource: 'repo/a' }, grant).reason, 'unknown-action');
  assert.equal(authorizeAction({ action: 'read' }, grant).reason, 'missing-resource');
});
test('read requires explicit permission and resource', () => {
  assert.equal(authorizeAction({ action: 'read', resource: 'repo/a' }, grant).allowed, true);
  assert.equal(authorizeAction({ action: 'read', resource: 'repo/b' }, grant).allowed, false);
});
test('remote writes deny untrusted source and missing approval', () => {
  assert.equal(authorizeAction({ action: 'remote-write', resource: 'repo/a' }, grant).reason, 'untrusted-write');
  assert.equal(authorizeAction({ action: 'remote-write', resource: 'repo/a', origin: 'trusted' }, grant).reason, 'approval-required');
});
test('approval must bind exact action and resource', () => {
  const approved = { ...grant, approved: true, approvalId: 'ticket-42', approvedAction: 'remote-write', approvedResource: 'repo/a' };
  assert.equal(authorizeAction({ action: 'remote-write', resource: 'repo/a', origin: 'trusted' }, approved).allowed, true);
  assert.equal(authorizeAction({ action: 'merge', resource: 'repo/a', origin: 'trusted' }, approved).reason, 'approval-mismatch');
});
