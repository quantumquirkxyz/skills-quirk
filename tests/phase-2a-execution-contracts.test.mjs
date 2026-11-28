import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const skills = {
  'to-spec': '.agents/skills/project/to-spec/SKILL.md',
  implement: '.agents/skills/delivery/implement/SKILL.md',
  'to-tickets': '.agents/skills/project/to-tickets/SKILL.md'
};
const envelope = JSON.parse(fs.readFileSync(path.join(root, 'schemas/execution/v1/execution-envelope.schema.json'), 'utf8'));
const sideEffect = JSON.parse(fs.readFileSync(path.join(root, 'schemas/execution/v1/execution-side-effect-record.schema.json'), 'utf8'));
const replay = JSON.parse(fs.readFileSync(path.join(root, 'schemas/execution/v1/execution-replay-record.schema.json'), 'utf8'));

for (const [name, file] of Object.entries(skills)) {
  test(`${name} declares the Phase 2A execution envelope and handoff controls`, () => {
    const text = fs.readFileSync(path.join(root, file), 'utf8');
    assert.match(text, /## Phase 2A Execution Contract/);
    assert.match(text, /schemas\/execution\/v1\/execution-envelope\.schema\.json/);
    assert.match(text, /schemaVersion: "1\.0"/);
    for (const token of ['executionId', 'traceId', 'input digest', 'timestamps', 'evidence', 'side effects', 'replay', 'scorecard', 'dryRun', 'operationId', 'idempotencyKey', 'fixed point', 'timeout', 'crash', 'reconcile', 'Retry', 'Handoff']) {
      assert.match(text, new RegExp(token, 'i'), `missing ${token}`);
    }
  });
}

test('Phase 2A uses schema-owned envelope, side-effect, and replay state vocabularies', () => {
  assert.deepEqual(envelope.properties.status.enum, ['draft', 'in-progress', 'completed', 'failed', 'blocked', 'cancelled']);
  assert.deepEqual(sideEffect.properties.outcome.enum, ['planned', 'attempted', 'succeeded', 'failed', 'blocked', 'unknown']);
  assert.deepEqual(replay.properties.verdict.enum, ['pass', 'fail', 'blocked', 'not-run', 'audit-incomplete']);
});

test('Phase 2A keeps domain artifact states distinct from execution envelope states', () => {
  const texts = Object.values(skills).map(file => fs.readFileSync(path.join(root, file), 'utf8')).join('\n');
  assert.match(texts, /status separate from the envelope status/i);
  assert.match(texts, /outcome-unknown/);
  assert.match(texts, /audit-incomplete/);
});
