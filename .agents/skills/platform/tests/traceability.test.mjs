import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { parseClauses, parseCheckRef, citedIds, criticalSkills } from '../validate-traceability.mjs';

function run(args) {
  return spawnSync('node', ['.agents/skills/platform/validate-traceability.mjs', ...args], { encoding: 'utf8' });
}

const CRITICAL_SKILLS = [
  'work-item-router',
  'ask-to',
  'ship-subissue',
  'publish-open-pr',
  'to-spec',
  'to-tickets',
  'implement',
  'tdd',
  'code-review',
  'review-pr',
  'review-fix-loop',
  'evaluate-skill',
  'skill-audit',
  'skill-promoter',
  'side-effect-auditor',
  'subagent-swarm',
];

test('traceability validator passes on the repository bundle', () => {
  const result = run([]);
  assert.equal(result.status, 0, result.stderr || result.stdout);
  const payload = JSON.parse(spawnSync('node', ['.agents/skills/platform/validate-traceability.mjs', '--json'], { encoding: 'utf8' }).stdout);
  assert.equal(payload.status, 'pass');
  assert.deepEqual(payload.errors, []);
  assert.ok(payload.clauses >= CRITICAL_SKILLS.length * 2);
  const { resolved, manual, pending } = payload.coverage;
  assert.equal(resolved + manual + pending, payload.clauses);
});

test('every critical skill declares at least two clauses with unique ids', () => {
  const result = run(['--json']);
  assert.equal(result.status, 0, result.stderr || result.stdout);
  const payload = JSON.parse(result.stdout);
  const byName = new Map(payload.perSkill.map((entry) => [entry.name, entry]));
  for (const name of CRITICAL_SKILLS) {
    const entry = byName.get(name);
    assert.ok(entry, `${name} declares no clauses`);
    assert.equal(entry.critical, true, `${name} must be in the critical set`);
    assert.ok(entry.clauses.length >= 2, `${name} must declare at least two clauses`);
    const ids = entry.clauses.map((clause) => clause.id);
    assert.equal(new Set(ids).size, ids.length, `${name} has duplicate clause ids`);
  }
  const allIds = payload.perSkill.flatMap((entry) => entry.clauses.map((clause) => clause.id));
  assert.equal(new Set(allIds).size, allIds.length, 'clause ids must be globally unique');
});

test('governance skills carry an always reload policy', () => {
  const result = run(['--json']);
  assert.equal(result.status, 0, result.stderr || result.stdout);
  const payload = JSON.parse(result.stdout);
  const always = payload.perSkill.filter((entry) => entry.reloadPolicy === 'always').map((entry) => entry.name).sort();
  assert.deepEqual(always, ['ask-to', 'publish-open-pr', 'ship-subissue', 'work-item-router']);
});

test('fix-hint mode prints remediation for pending evals citations', () => {
  const result = run(['--fix-hint']);
  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.match(result.stdout, /check-pending: land the evals\/behavioral fixture/);
  assert.match(result.stdout, /Remediation by class:/);
});

test('parseClauses reads the block-sequence dialect', () => {
  const clauses = parseClauses(`clauses:
  - id: TO-SPEC-1
    text: "Prefer one seam, and make any seam choice explicit before publishing."
    check: evals/behavioral/to-spec.json#TO-SPEC-1
  - id: TO-SPEC-2
    text: Stop when the spec cannot be handed off.
    check: manual
risk: medium`);
  assert.equal(clauses.length, 2);
  assert.deepEqual(clauses[0], {
    id: 'TO-SPEC-1',
    text: 'Prefer one seam, and make any seam choice explicit before publishing.',
    check: 'evals/behavioral/to-spec.json#TO-SPEC-1',
  });
  assert.equal(clauses[1].check, 'manual');
});

test('parseClauses reads the inline JSON dialect and ignores absent declarations', () => {
  assert.deepEqual(parseClauses('clauses: [{"id":"TDD-1","text":"Write the failing test first.","check":"manual"}]'), [
    { id: 'TDD-1', text: 'Write the failing test first.', check: 'manual' },
  ]);
  assert.deepEqual(parseClauses('clauses: []'), []);
  assert.deepEqual(parseClauses('name: to-spec\nrisk: medium'), []);
});

test('parseCheckRef splits the optional fragment', () => {
  assert.deepEqual(parseCheckRef('evals/behavioral/tdd.json#TDD-1'), { path: 'evals/behavioral/tdd.json', fragment: 'TDD-1' });
  assert.deepEqual(parseCheckRef('manual'), { path: 'manual', fragment: '' });
  assert.deepEqual(parseCheckRef('.agents/skills/platform/validate-skills.mjs'), { path: '.agents/skills/platform/validate-skills.mjs', fragment: '' });
});

test('citedIds extracts clause ids without false positives', () => {
  assert.deepEqual(citedIds('assertion TO-SPEC-1 holds and CODE-REVIEW-2 holds'), ['TO-SPEC-1', 'CODE-REVIEW-2']);
  assert.deepEqual(citedIds('uses UTF-8 encoding and an RFC-4122 identifier'), []);
  assert.deepEqual(citedIds('no clause citation here'), []);
});

test('the critical set contains exactly the sixteen wave-1 skills', () => {
  assert.equal(criticalSkills.size, 16);
  for (const name of CRITICAL_SKILLS) assert.ok(criticalSkills.has(name), `${name} missing from critical set`);
});
