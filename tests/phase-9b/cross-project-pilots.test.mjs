import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = path.dirname(path.dirname(path.dirname(fileURLToPath(import.meta.url))));
const fixturePath = path.join(root, 'fixtures/phase-9b/cross-project-pilots.json');
const fixture = JSON.parse(fs.readFileSync(fixturePath, 'utf8'));
const ids = new Set(fixture.pilots.flatMap(pilot => pilot.evidenceIds));

test('Fase 9B fixture covers exactly the five isolated pilot projects', () => {
  assert.deepEqual(fixture.pilots.map(pilot => pilot.id), [
    'typescript-fullstack', 'python-api', 'ml-research', 'iot-embedded', 'solidity-contracts',
  ]);
  assert.equal(fixture.remoteProviders, 'forbidden');
  assert.equal(ids.size, 10);
});

for (const pilot of fixture.pilots) {
  test(`${pilot.id}: portable workflow, real local tool, blocked and not-run evidence`, () => {
    assert.equal(pilot.workflow.portable, true);
    assert.deepEqual(pilot.workflow.states, ['planned', 'running', 'validating', 'completed']);
    assert.equal(pilot.tool.status, 'pass');
    assert.equal(pilot.tool.observed, true);
    assert.match(pilot.tool.command, /^(node|python) --version$/);
    assert.equal(pilot.blocked.status, 'blocked');
    assert.ok(pilot.blocked.reason.length > 10);
    assert.equal(pilot.notRun.status, 'not-run');
    assert.ok(pilot.notRun.reason.length > 10);
    assert.equal(pilot.evidenceIds.length, 2);
    for (const evidenceId of pilot.evidenceIds) assert.match(evidenceId, /^[0-9a-f-]{36}$/);
  });
}

test('scorecard minimum evidence distinguishes blocked and not-run without remote execution', () => {
  const scorecards = fixture.pilots.map(pilot => ({
    schemaVersion: '1.0',
    verdict: 'blocked',
    criteria: [
      { id: 'portable-workflow', result: pilot.workflow.portable ? 'pass' : 'fail', evidenceIds: pilot.evidenceIds },
      { id: 'real-tool', result: pilot.tool.observed ? 'pass' : 'not-run', evidenceIds: pilot.evidenceIds },
      { id: 'blocked-condition', result: pilot.blocked.status, evidenceIds: pilot.evidenceIds },
      { id: 'not-run-condition', result: pilot.notRun.status, evidenceIds: pilot.evidenceIds },
    ],
  }));
  for (const scorecard of scorecards) {
    assert.equal(scorecard.schemaVersion, '1.0');
    assert.equal(scorecard.criteria.length, 4);
    assert.ok(scorecard.criteria.every(criteria => criteria.evidenceIds.length >= 1));
  }
  const statuses = fixture.pilots.flatMap(pilot => [pilot.tool.status, pilot.blocked.status, pilot.notRun.status]);
  assert.equal(statuses.filter(status => status === 'pass').length, 5);
  assert.equal(statuses.filter(status => status === 'blocked').length, 5);
  assert.equal(statuses.filter(status => status === 'not-run').length, 5);
  assert.equal(fixture.pilots.some(pilot => pilot.tool.command.includes('npm ') || pilot.tool.command.includes('pip ')), false);
});

test('fixture is isolated from providers and existing projections', () => {
  const before = new Set(fs.readdirSync(path.join(root, 'fixtures/phase-9b')));
  const result = spawnSync(process.execPath, ['-e', 'process.exit(0)'], { cwd: root, encoding: 'utf8' });
  assert.equal(result.status, 0);
  assert.deepEqual([...before], ['cross-project-pilots.json']);
  assert.equal(fs.existsSync(path.join(root, 'package.json')), true);
});
