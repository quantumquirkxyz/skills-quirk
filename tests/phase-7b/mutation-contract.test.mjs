import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PolicyBroker } from '../../scripts/platform/policy-broker.mjs';
import { buildReplayManifest, isAllowedVariation, REDACTED_VALUE } from '../../scripts/platform/replay-manifest.mjs';
import { createSideEffectRecord, detectUndeclaredEffects } from '../../scripts/platform/side-effect-ledger.mjs';
import { validateLifecycleContract } from '../../.agents/skills/platform/lifecycle-contract-gate.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const catalog = JSON.parse(fs.readFileSync(path.join(HERE, 'mutation-catalog.json'), 'utf8'));
const request = { identity: 'agent-1', tool: 'files', destination: 'workspace/a.txt', action: 'read' };

function broker(policy = {}) {
  return new PolicyBroker({
    now: () => new Date('2026-01-01T00:00:00.000Z'),
    id: (() => { let n = 0; return () => `phase-7b-${++n}`; })(),
    policy: { files: { destinations: ['workspace/a.txt'], actions: ['read', 'write'], ...policy } },
  });
}

function replayInput() {
  return {
    fixedPoint: 'commit:phase-7b', fixture: 'phase-7b/replay', schemaVersions: { execution: '1' },
    redactedInputs: [{ name: 'token', value: REDACTED_VALUE }], permissions: ['read:fixture'],
    approvals: [{ action: 'replay', actor: 'reviewer' }], seed: 7,
    eventOrder: [{ id: 'start' }, { id: 'finish' }], allowedVariations: [{ duration_ms: 10 }],
  };
}

function lifecycle() {
  return JSON.parse(fs.readFileSync(path.join(HERE, '../../.agents/skills/platform/fixtures/lifecycle-contract.json'), 'utf8'));
}

const assertions = {
  'policy-ignore-destination': () => {
    const result = broker().authorize({ ...request, destination: 'outside/secret' });
    assert.equal(result.decision, 'deny');
    assert.equal(result.reason, 'destination-not-allowed');
  },
  'policy-accept-mismatched-approval': () => {
    const policy = broker({ approvalRequired: true });
    const approval = policy.issueApproval({ ...request, approvalId: 'approval-1' });
    const result = policy.authorize({ ...request, action: 'write', approvalId: approval.approvalId });
    assert.equal(result.reason, 'approval-mismatched');
  },
  'replay-allow-duplicate-event': () => assert.throws(() => {
    const input = replayInput();
    input.eventOrder = [{ id: 'start' }, { id: 'start' }];
    return buildReplayManifest(input);
  }, /duplicate event id/),
  'replay-allow-undeclared-variation': () => {
    const manifest = buildReplayManifest(replayInput());
    assert.equal(isAllowedVariation(manifest, { duration_ms: 11 }), false);
  },
  'side-effect-ignore-undeclared-resource': () => {
    const observed = [{ operation: 'delete', target: 'unlisted.db', effectId: 'effect-1' }];
    assert.deepEqual(detectUndeclaredEffects({ observed, declared: [] }), [{ action: 'delete', resource: 'unlisted.db', effectId: 'effect-1' }]);
  },
  'side-effect-leak-sensitive-argument': () => {
    const record = createSideEffectRecord({ operationId: 'op', runId: 'run', toolCallId: 'call', action: 'write', resource: 'db', arguments: { authorization: 'secret' } });
    assert.notEqual(record.details.argumentDigest, 'secret');
  },
  'gate-ignore-fixed-point-drift': () => {
    const contract = lifecycle();
    contract.edges[0].fixedPoint = 'drifted-fixed-point';
    const result = validateLifecycleContract(contract);
    assert.equal(result.status, 'fail');
    assert.match(result.issues.join('\n'), /fixedPoint is incompatible/);
  },
  'gate-treat-audit-incomplete-as-pass': () => {
    const contract = lifecycle();
    delete contract.execution.snapshot;
    const result = validateLifecycleContract(contract);
    assert.equal(result.status, 'audit-incomplete');
    assert.equal(result.pass, false);
  },
};

test('Phase 7B catalog is explicit and bounded', () => {
  assert.deepEqual(catalog.mutants, Object.keys(assertions));
  assert.ok(catalog.survivingGaps.every((gap) => gap.id && gap.reason));
});

for (const [mutant, assertion] of Object.entries(assertions)) {
  test(`Phase 7B kills ${mutant}`, () => {
    assert.doesNotThrow(assertion);
  });
}

test('Phase 7B reports uncovered boundaries as explicit gaps', () => {
  assert.deepEqual(catalog.survivingGaps.map((gap) => gap.id), [
    'policy-approval-revocation',
    'replay-concurrent-claim-race',
  ]);
});
