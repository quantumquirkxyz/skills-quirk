import test from 'node:test';
import assert from 'node:assert/strict';
import { buildReplayManifest, isAllowedVariation, validateReplayManifest, REDACTED_VALUE } from './replay-manifest.mjs';

const input = () => ({
  fixedPoint: 'commit:abc123', fixture: 'replay/basic', schemaVersions: { execution: '1' },
  redactedInputs: [{ name: 'token', value: REDACTED_VALUE, sensitivity: 'secret' }],
  permissions: ['read:fixture'], approvals: [{ action: 'replay', actor: 'reviewer' }], seed: 42,
  eventOrder: [{ eventId: 'start' }, { id: 'finish' }], allowedVariations: [{ duration_ms: 10 }],
});

test('buildReplayManifest normalizes execution v1 aliases and preserves replay controls', () => {
  const manifest = buildReplayManifest(input());
  assert.equal(manifest.schema_version, 'execution.v1');
  assert.equal(manifest.fixed_point, 'commit:abc123');
  assert.deepEqual(manifest.event_order.map((event) => event.id ?? event.eventId), ['start', 'finish']);
  assert.equal(manifest.redacted_inputs[0].value, REDACTED_VALUE);
});

test('validation rejects unredacted values and duplicate event order', () => {
  assert.throws(() => buildReplayManifest({ ...input(), redactedInputs: [{ name: 'token', value: 'secret' }] }), /REDACTED/);
  assert.throws(() => buildReplayManifest({ ...input(), eventOrder: [{ id: 'start' }, { id: 'start' }] }), /duplicate event id/);
});

test('allowed variations compare structurally without accepting undeclared values', () => {
  const manifest = buildReplayManifest(input());
  assert.equal(isAllowedVariation(manifest, { duration_ms: 10 }), true);
  assert.equal(isAllowedVariation(manifest, { duration_ms: 11 }), false);
  assert.deepEqual(validateReplayManifest(manifest), manifest);
});
