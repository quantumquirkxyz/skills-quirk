import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';

const root=resolve('.');
const fixture=JSON.parse(await readFile(resolve(root,'.agents/skills/platform/fixtures/migration/delivery-frontend-output-contracts.json'),'utf8'));
const readSkill=skill=>readFile(resolve(root,'.agents/skills',`${skill}/SKILL.md`),'utf8');
const coveredSkills = [
  '.agents/skills/delivery/code-review/SKILL.md',
  '.agents/skills/delivery/contribution-workflow-optimizer/SKILL.md',
  '.agents/skills/delivery/diagnosing-bugs/SKILL.md',
  '.agents/skills/delivery/implement/SKILL.md',
  '.agents/skills/delivery/implement-review-fixes/SKILL.md',
  '.agents/skills/delivery/loop-budget/SKILL.md',
  '.agents/skills/delivery/plan-review-fixes/SKILL.md',
  '.agents/skills/delivery/prototype/SKILL.md',
  '.agents/skills/delivery/research/SKILL.md',
  '.agents/skills/delivery/resolving-merge-conflicts/SKILL.md',
  '.agents/skills/delivery/review-fix-loop/SKILL.md',
  '.agents/skills/delivery/review-pr/SKILL.md',
  '.agents/skills/delivery/tdd/SKILL.md',
  '.agents/skills/delivery/testing/SKILL.md',
  '.agents/skills/delivery/webapp-testing/SKILL.md',
  '.agents/skills/frontend/astro/SKILL.md',
  '.agents/skills/frontend/design-system/SKILL.md',
  '.agents/skills/frontend/frontend-design/SKILL.md',
  '.agents/skills/frontend/frontend-testing/SKILL.md',
  '.agents/skills/frontend/mobile/SKILL.md',
  '.agents/skills/frontend/nextjs/SKILL.md',
  '.agents/skills/frontend/react/SKILL.md',
  '.agents/skills/frontend/remix/SKILL.md',
  '.agents/skills/frontend/state-management/SKILL.md',
  '.agents/skills/frontend/styling/SKILL.md',
];

function checkEntry(entry,contents) {
  const normalized=contents.replaceAll('**','');
  const required=[...entry.required,entry.artifact];
  const folded=normalized.toLowerCase();
  const missing=required.filter(clause=>!(clause.endsWith('Artifact')||clause==='LoopBudgetVerdict' ? normalized.includes(clause) : folded.includes(clause.toLowerCase())));
  const forbidden=entry.negative.filter(clause=>normalized.includes(clause));
  return {ok:missing.length===0&&forbidden.length===0,missing,forbidden};
}
function validateFixture(data,skills) {
  if(data?.schemaVersion!=='1.0'||data?.fixtureVersion!=='1'||!Array.isArray(data.entries)) return false;
  const seen=new Set();
  return data.entries.length===skills.length && data.entries.every(entry=>{
    if(typeof entry.skill!=='string'||seen.has(entry.skill)||!skills.includes(entry.skill)) return false;
    seen.add(entry.skill);
    return typeof entry.artifact==='string'&&Array.isArray(entry.required)&&Array.isArray(entry.negative)&&entry.required.length>0;
  });
}

test('delivery/frontend migration fixture covers every selected canonical skill',async()=>{
  assert.equal(coveredSkills.length,25);
  assert.equal(new Set(coveredSkills).size,coveredSkills.length);
  const skills=fixture.entries.map(entry=>entry.skill);
  assert.equal(new Set(skills).size,skills.length);
  assert.equal(skills.filter(skill=>skill.startsWith('delivery/')).length,15);
  assert.equal(skills.filter(skill=>skill.startsWith('frontend/')).length,10);
  assert.equal(validateFixture(fixture,skills),true);
  for(const entry of fixture.entries) {
    const contents=await readSkill(entry.skill);
    const result=checkEntry(entry,contents);
    assert.deepEqual(result,{ok:true,missing:[],forbidden:[]},entry.skill);
  }
});

test('migration fixture rejects a missing contract clause and wrong artifact type',async()=>{
  const entry=fixture.entries.find(item=>item.skill==='frontend/react');
  const contents=await readSkill(entry.skill);
  const missingClause='Output';
  assert.equal(checkEntry(entry,contents.replace(new RegExp(missingClause,'gi'),'')).ok,false);
  assert.equal(checkEntry({...entry,artifact:'NotAnArtifact'},contents).ok,false);
});

test('migration fixture is not evidence and cannot claim execution',()=>{
  assert.equal(fixture.purpose.includes('not migration evidence'),true);
  assert.deepEqual(fixture.entries.some(entry=>entry.result||entry.skillSha256||entry.fixtureSha256),false);
  assert.deepEqual(fixture.negativeControls.map(control=>control.expected),['fail','fail','fail']);
});
