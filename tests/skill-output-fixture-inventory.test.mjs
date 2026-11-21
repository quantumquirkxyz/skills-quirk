import test from 'node:test';
import assert from 'node:assert/strict';
import {inventoryOutputFixtures} from '../scripts/skill-output-fixture-inventory.mjs';

test('catalog fixture inventory is deterministic and fail-closed',async()=>{
  const first=await inventoryOutputFixtures();
  const second=await inventoryOutputFixtures();
  assert.deepEqual(first,second);
  assert.equal(first.total,first.mapped.length+first.missing.length);
  assert.ok(first.mapped.length>0);
  for (const entry of first.mapped) {
    assert.match(entry.fixture,/^(evals\/behavioral|\.agents\/skills\/platform\/fixtures\/behavioral)\//);
    assert.ok(entry.fixtureSkill===null || typeof entry.fixtureSkill==='string');
  }
});
