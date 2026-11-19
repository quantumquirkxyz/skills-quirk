import test from 'node:test';
import assert from 'node:assert/strict';
import {publishSkillOutput} from '../scripts/publish-skill-output.mjs';
import {normalizeLifecycleArtifact} from '../scripts/normalize-skill-artifact.mjs';

const record = () => ({schemaVersion:'1.0',artifactType:'review',artifactId:'a1',operationId:'o1',status:'partial',title:'Review',summary:'Result',sourceRefs:[],evidence:[],validation:[],nextActions:[],payload:{findings:[{severity:'high'}]},publication:{target:'pr:8',idempotencyKey:'review:8'}});
test('normalizes lifecycle status without mutating canonical artifact', () => {
  const source = {schemaVersion:'1.0',artifactType:'verification-artifact',artifactId:'v1',operationId:'o1',status:'completed',sourceArtifacts:['spec:1'],evidence:[{check:'unit'}],payload:{checks:[]}};
  const result = normalizeLifecycleArtifact(source,{title:'Verification',summary:'Completed',validation:[{check:'unit',status:'passed'}]});
  assert.equal(result.status,'success');
  assert.equal(result.provenance.lifecycleStatus,'completed');
  assert.equal(source.status,'completed');
  assert.match(result.evidence[0], /unit/);
});
test('dry run performs no remote reads or writes', async () => {
  const fail = () => {throw new Error('unexpected API call');};
  const result = await publishSkillOutput(record(),{findByKey:fail,create:fail,update:fail});
  assert.equal(result.status,'preview');
});
test('requires explicit approval before remote mutation', async () => {
  const adapter = {findByKey:async()=>null,create:async()=>({id:1}),update:async()=>({id:1})};
  await assert.rejects(publishSkillOutput(record(),adapter,{dryRun:false}), /approval/);
});
test('reuses matching publication and updates changed content', async () => {
  let body;
  let writes = 0;
  const adapter = {
    findByKey:async()=>body===undefined?null:{id:12,body},
    create:async(_target,next)=>{body=next;writes++;return {id:12};},
    update:async(_target,_id,next)=>{body=next;writes++;return {id:12};}
  };
  const r = record();
  assert.equal((await publishSkillOutput(r,adapter,{approved:true,dryRun:false})).status,'created');
  assert.equal((await publishSkillOutput(r,adapter,{approved:true,dryRun:false})).status,'unchanged');
  r.summary='Updated';
  assert.equal((await publishSkillOutput(r,adapter,{approved:true,dryRun:false})).status,'updated');
  assert.equal(writes,2);
});
test('unknown remote outcomes are surfaced, not silently retried', async () => {
  const adapter={findByKey:async()=>null,create:async()=>null,update:async()=>null};
  await assert.rejects(publishSkillOutput(record(),adapter,{approved:true,dryRun:false}), /outcome unknown/);
});

test('serializes concurrent publications in the same process', async () => {
  let created = 0, saved;
  const adapter = {
    findByKey:async()=>saved ?? null,
    create:async(_target,body)=>{await new Promise(resolve=>setTimeout(resolve,10));created++;saved={id:9,body};return saved;},
    update:async(_target,id,body)=>{saved={id,body};return saved;}
  };
  const r=record();
  const outcomes=await Promise.all(Array.from({length:8},()=>publishSkillOutput(r,adapter,{approved:true,dryRun:false})));
  assert.equal(created,1);
  assert.equal(outcomes.filter(x=>x.status==='created').length,1);
  assert.equal(outcomes.filter(x=>x.status==='unchanged').length,7);
});
