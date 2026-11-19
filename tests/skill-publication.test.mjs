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

test('reconciles a create timeout when the matching remote comment exists', async () => {
  let saved, writes=0;
  const adapter={
    findByKey:async()=>saved??null,
    create:async(_target,body)=>{writes++;saved={id:51,body};throw new Error('connection reset');},
    update:async()=>{throw new Error('must not update');},
  };
  const result=await publishSkillOutput(record(),adapter,{approved:true,dryRun:false});
  assert.equal(result.status,'reconciled');
  assert.equal(result.id,51);
  assert.equal(writes,1);
});
test('does not retry ambiguous creation when reconciliation cannot find an owned match', async () => {
  let writes=0;
  const adapter={
    findByKey:async()=>null,
    create:async()=>{writes++;throw new Error('connection reset');},
    update:async()=>{throw new Error('must not update');},
  };
  await assert.rejects(publishSkillOutput(record(),adapter,{approved:true,dryRun:false}),/outcome unknown/);
  assert.equal(writes,1);
});
test('does not reconcile authorization failures as ambiguous writes', async () => {
  let reads=0;
  const adapter={
    findByKey:async()=>{reads++;return null;},
    create:async()=>{const error=new Error('forbidden');error.status=403;throw error;},
    update:async()=>null,
  };
  await assert.rejects(publishSkillOutput(record(),adapter,{approved:true,dryRun:false}),/forbidden/);
  assert.equal(reads,1,'only the initial lookup is allowed');
});

test('reconciles a successful update after an ambiguous transport failure', async () => {
  let body='previous',writes=0;
  const adapter={
    findByKey:async()=>({id:12,body}),
    create:async()=>{throw new Error('must not create');},
    update:async(_target,_id,next)=>{writes++;body=next;throw new Error('connection reset');},
  };
  const result=await publishSkillOutput(record(),adapter,{approved:true,dryRun:false});
  assert.equal(result.status,'reconciled');
  assert.equal(writes,1);
});
test('does not retry an update when the remote body remains unchanged', async () => {
  let writes=0;
  const adapter={
    findByKey:async()=>({id:12,body:'previous'}),
    create:async()=>{throw new Error('must not create');},
    update:async()=>{writes++;throw new Error('timeout');},
  };
  await assert.rejects(publishSkillOutput(record(),adapter,{approved:true,dryRun:false}),/update outcome unknown/);
  assert.equal(writes,1);
});

test('wraps the full publication transaction in an injected coordinator',async()=>{
  const order=[];
  const coordinator={withLock:async(target,key,fn)=>{
    order.push('acquire:'+target+':'+key);
    const result=await fn();
    order.push('release');
    return result;
  }};
  const adapter={
    findByKey:async()=>{order.push('read');return null;},
    create:async()=>{order.push('write');return {id:7};},
    update:async()=>{throw new Error('unexpected update');},
  };
  const result=await publishSkillOutput(record(),adapter,{approved:true,dryRun:false,coordinator});
  assert.equal(result.status,'created');
  assert.deepEqual(order,['acquire:pr:8:review:8','read','write','release']);
});
test('rejects invalid publication coordinator without remote calls',async()=>{
  const adapter={
    findByKey:async()=>{throw new Error('unexpected read');},
    create:async()=>{throw new Error('unexpected write');},
    update:async()=>{throw new Error('unexpected update');},
  };
  await assert.rejects(publishSkillOutput(record(),adapter,{approved:true,dryRun:false,coordinator:{}}),/coordinator/);
});
