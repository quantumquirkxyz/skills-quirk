import assert from 'node:assert/strict';

const SCHEMA = 'execution.v1';
const REDACTED = '[REDACTED]';

const own = (value, key) => Object.prototype.hasOwnProperty.call(value, key);
const pick = (value, snake, camel = snake) => value?.[snake] ?? value?.[camel];
const object = (value, name) => {
  assert.ok(value && typeof value === 'object' && !Array.isArray(value), `${name} must be an object`);
  return value;
};
const array = (value, name) => {
  assert.ok(Array.isArray(value), `${name} must be an array`);
  return value;
};
const nonEmpty = (value, name) => {
  assert.equal(typeof value, 'string', `${name} must be a string`);
  assert.ok(value.trim(), `${name} must not be empty`);
  return value;
};

function clone(value) {
  return structuredClone(value);
}

function validateRedactedInputs(value) {
  const inputs = array(value, 'redacted_inputs');
  for (const input of inputs) {
    object(input, 'redacted input');
    nonEmpty(pick(input, 'name'), 'redacted input.name');
    assert.equal(pick(input, 'value'), REDACTED, 'redacted input.value must be [REDACTED]');
    if (own(input, 'sensitivity')) nonEmpty(input.sensitivity, 'redacted input.sensitivity');
  }
  return inputs;
}

export function validateReplayManifest(input) {
  const manifest = object(input, 'manifest');
  assert.equal(manifest.schema_version, SCHEMA, `schema_version must be ${SCHEMA}`);
  nonEmpty(manifest.fixed_point, 'fixed_point');
  nonEmpty(manifest.fixture, 'fixture');
  const schemaVersions = object(manifest.schema_versions, 'schema_versions');
  assert.ok(Object.keys(schemaVersions).length > 0, 'schema_versions must not be empty');
  validateRedactedInputs(manifest.redacted_inputs);
  array(manifest.permissions, 'permissions');
  array(manifest.approvals, 'approvals');
  assert.ok(manifest.seed !== undefined && manifest.seed !== null, 'seed is required');
  const events = array(manifest.event_order, 'event_order');
  assert.ok(events.length > 0, 'event_order must not be empty');
  const ids = new Set();
  for (const event of events) {
    object(event, 'event_order entry');
    const id = pick(event, 'id', 'eventId');
    nonEmpty(id, 'event_order entry.id');
    assert.ok(!ids.has(id), `duplicate event id: ${id}`);
    ids.add(id);
  }
  array(manifest.allowed_variations, 'allowed_variations');
  return clone(manifest);
}

export function buildReplayManifest(input) {
  const source = object(input, 'replay manifest input');
  const manifest = {
    schema_version: source.schema_version ?? SCHEMA,
    fixed_point: source.fixed_point ?? source.fixedPoint,
    fixture: source.fixture,
    schema_versions: source.schema_versions ?? source.schemaVersions,
    redacted_inputs: source.redacted_inputs ?? source.redactedInputs,
    permissions: source.permissions,
    approvals: source.approvals,
    seed: source.seed,
    event_order: source.event_order ?? source.eventOrder,
    allowed_variations: source.allowed_variations ?? source.allowedVariations,
  };
  return validateReplayManifest(manifest);
}

export function isAllowedVariation(manifest, variation) {
  const valid = validateReplayManifest(manifest);
  return valid.allowed_variations.some((allowed) => JSON.stringify(allowed) === JSON.stringify(variation));
}

export { SCHEMA as EXECUTION_SCHEMA_VERSION, REDACTED as REDACTED_VALUE };
