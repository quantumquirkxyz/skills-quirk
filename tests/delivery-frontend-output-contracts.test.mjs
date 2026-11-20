import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';

const root=resolve('.');
const fixture=JSON.parse(await readFile(resolve(root,'evals/behavioral/delivery-frontend-output-contracts.json'),'utf8'));
const readSkill=skill=>readFile(resolve(root,'.agents/skills',`${skill}/SKILL.md`),'utf8');

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
