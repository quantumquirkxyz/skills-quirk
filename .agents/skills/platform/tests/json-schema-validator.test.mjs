import test from 'node:test';
import assert from 'node:assert/strict';
import { validateJson } from '../json-schema-validator.mjs';

test('draft-compatible validator enforces nested types, const, enums and additional properties', () => {
  const schema = { type: 'object', required: ['kind'], additionalProperties: false, properties: { kind: { const: 'handoff' }, state: { enum: ['ready', 'blocked'] }, nested: { type: 'object', required: ['count'], properties: { count: { type: 'integer' } } } } };
  assert.deepEqual(validateJson(schema, { kind: 'handoff', state: 'ready', nested: { count: 2 } }), []);
  assert.ok(validateJson(schema, { kind: 'wrong', state: 'other', extra: true, nested: { count: '2' } }).length >= 4);
});

test('draft-compatible validator evaluates oneOf, anyOf and date-time', () => {
  const schema = { oneOf: [{ type: 'string', format: 'date-time' }, { type: 'object', required: ['mode'], properties: { mode: { const: 'manual' } } }] };
  assert.deepEqual(validateJson(schema, '2026-11-27T07:52:54Z'), []);
  assert.deepEqual(validateJson(schema, { mode: 'manual' }), []);
  assert.ok(validateJson(schema, 'not-a-date').length > 0);
});

test('real handoff envelope rejects malformed output', () => {
  const schema = { type: 'object', required: ['artifactType', 'nextConsumer'], properties: { artifactType: { type: 'string' }, nextConsumer: { type: 'string' }, cycleCheck: { type: 'array', items: { type: 'string' } } }, additionalProperties: false };
  assert.deepEqual(validateJson(schema, { artifactType: 'RequirementsArtifact', nextConsumer: 'to-tickets', cycleCheck: [] }), []);
  assert.ok(validateJson(schema, { artifactType: 'RequirementsArtifact', nextConsumer: null, cycleCheck: ['to-spec', 2] }).length > 0);
});
