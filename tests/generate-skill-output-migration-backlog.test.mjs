import test from 'node:test';
import assert from 'node:assert/strict';
import {buildMigrationBacklog} from '../scripts/generate-skill-output-migration-backlog.mjs';
const inventory={total:3,skills:[
  {path:'z/SKILL.md',sideEffects:false,risk:'low',hasOutputDeclaration:true,schemaRefs:['schema/skill-output.schema.json'],approvalRequired:'false'},
  {path:'b/SKILL.md',sideEffects:true,risk:'high',hasOutputDeclaration:true,schemaRefs:['schemas/software-engineering/verification-artifact.schema.json'],approvalRequired:'true'},
  {path:'a/SKILL.md',sideEffects:false,risk:'low',hasOutputDeclaration:false,schemaRefs:[],approvalRequired:'unspecified'},
]};
test('backlog covers every canonical skill and prioritizes side effects',()=>{
  const backlog=buildMigrationBacklog(inventory);
  assert.equal(backlog.total,3);
  assert.deepEqual(backlog.tasks.map(x=>x.skill),['b/SKILL.md','a/SKILL.md','z/SKILL.md']);
  assert.deepEqual(backlog.tasks.map(x=>x.priority),['P1','P2','P3']);
});
test('candidate schema references are never misrepresented as verified',()=>{
  const backlog=buildMigrationBacklog(inventory);
  assert.ok(backlog.tasks.every(x=>!x.contractVerified&&!x.fixtureVerified&&x.migrationStatus==='pending'));
  assert.ok(backlog.tasks[0].requiredEvidence.some(x=>x.includes('rollback')));
});
test('rejects incomplete inventory',()=>{
  assert.throws(()=>buildMigrationBacklog({total:5,skills:[]}),/Invalid inventory/);
});
