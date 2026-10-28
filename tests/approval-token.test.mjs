import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { issueApproval, verifyApproval } from '../.agents/skills/platform/approval-token.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const guard = fileURLToPath(new URL('../.agents/skills/platform/hooks/tool-risk-guard.mjs', import.meta.url));
const secret = '0123456789abcdef0123456789abcdef';

function hook(payload, env = {}) {
  const result = spawnSync(process.execPath, [guard], {
    cwd: root, input: JSON.stringify(payload) + '\n', encoding: 'utf8',
    env: { ...process.env, ...env }, timeout: 5000,
  });
  assert.equal(result.status, 0, result.stderr);
  return JSON.parse(result.stdout).hookSpecificOutput;
}

test('signed approvals are exact-tool, exact-resource and time bounded', () => {
  const token = issueApproval({ approvalId: 'ticket-42', tool: 'Bash', resource: 'repo:a', expiresAt: Date.now() + 60000 }, secret);
  assert.equal(verifyApproval(token, { tool: 'Bash', resource: 'repo:a' }, secret).ok, true);
  assert.equal(verifyApproval(token, { tool: 'Bash', resource: 'repo:b' }, secret).reason, 'resource-mismatch');
  assert.equal(verifyApproval(token, { tool: 'Write', resource: 'repo:a' }, secret).reason, 'tool-mismatch');
  assert.equal(verifyApproval(token, { tool: 'Bash', resource: 'repo:a', now: Date.now() + 120000 }, secret).reason, 'expired');
});

test('PreToolUse allows a policy-gated tool only with a valid signed grant', () => {
  const token = issueApproval({ approvalId: 'approval-7', tool: 'Bash', resource: 'repo:a', expiresAt: Date.now() + 60000 }, secret);
  const allowed = hook({ tool_name: 'Bash', resource: 'repo:a', approval_token: token }, { QUIRK_APPROVAL_SECRET: secret });
  assert.equal(allowed.permissionDecision, 'allow');
  assert.match(allowed.permissionDecisionReason, /approval-7/);
});

test('invalid automated approval fails closed rather than falling back to ask', () => {
  const token = issueApproval({ approvalId: 'approval-8', tool: 'Bash', resource: 'repo:a', expiresAt: Date.now() + 60000 }, secret);
  const denied = hook({ tool_name: 'Bash', resource: 'repo:b', approval_token: token }, { QUIRK_APPROVAL_SECRET: secret });
  assert.equal(denied.permissionDecision, 'deny');
  assert.match(denied.permissionDecisionReason, /resource-mismatch/);
});

test('manual approval path remains ask when no signed grant is supplied', () => {
  assert.equal(hook({ tool_name: 'Bash' }).permissionDecision, 'ask');
});
