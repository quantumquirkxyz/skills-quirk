import test from 'node:test';
import assert from 'node:assert/strict';
import { describeWorkflowStatus, isTerminalWorkflowStatus, normalizeWorkflowStatus } from './normalized-states.mjs';

test('normalizes documented legacy aliases and classifies domains', () => {
  assert.equal(normalizeWorkflowStatus('needs_approval'), 'awaiting-approval');
  assert.deepEqual(describeWorkflowStatus('review'), { status: 'verifying', domain: 'validation', terminal: false, legacy: true });
});

test('distinguishes work, validation, effects, and terminal states', () => {
  assert.equal(describeWorkflowStatus('running').domain, 'work');
  assert.equal(describeWorkflowStatus('verifying').domain, 'validation');
  assert.equal(describeWorkflowStatus('outcome-unknown').domain, 'effects');
  assert.equal(describeWorkflowStatus('succeeded').domain, 'terminal');
  assert.equal(isTerminalWorkflowStatus('outcome-unknown'), true);
  assert.equal(isTerminalWorkflowStatus('awaiting-approval'), false);
});

test('rejects unknown and malformed states', () => {
  assert.throws(() => normalizeWorkflowStatus('unknown'), /Unknown workflow status/);
  assert.throws(() => normalizeWorkflowStatus(undefined), /non-empty string/);
});
