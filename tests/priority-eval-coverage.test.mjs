import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const behavioral = path.join(root, 'evals', 'behavioral');
const priority = [
  'routing/ask-to',
  'routing/work-item-router',
  'project/to-spec',
  'project/to-tickets',
  'delivery/implement',
  'delivery/review-pr',
  'delivery/review-fix-loop',
  'skill-dev/evaluate-skill',
  'skill-dev/skill-quality-gate',
];

test('priority workflow skills all have versioned behavioral contracts', () => {
  const fixtures = readdirSync(behavioral)
    .filter(name => name.endsWith('.json'))
    .map(name => JSON.parse(readFileSync(path.join(behavioral, name), 'utf8')));
  for (const skill of priority) {
    const matching = fixtures.filter(item => item.skill === skill);
    assert.ok(matching.length > 0, 'missing behavioral fixture for ' + skill);
    for (const fixture of matching) {
      assert.equal(typeof fixture.fixtureVersion, 'string', fixture.id + ' needs fixtureVersion');
      assert.ok(Array.isArray(fixture.assertions) && fixture.assertions.length > 0, fixture.id + ' needs assertions');
      assert.ok(fixture.assertions.some(a => a.type === 'deterministic'), fixture.id + ' needs deterministic evidence');
    }
  }
});
