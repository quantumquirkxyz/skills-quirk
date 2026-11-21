import test from 'node:test';
import assert from 'node:assert/strict';
import {presentReviewArtifact} from '../scripts/review-pr-output-pilot.mjs';

const canonical=()=>({
  schemaVersion:'1.0',artifactType:'verification-artifact',artifactId:'review-8',
  operationId:'op-8',producer:'review-pr',status:'completed',
  sourceArtifacts:['pr:8'],evidence:[{check:'unit',result:'passed'}],
  payload:{standards:{findings:[]},spec:{findings:[]}},
});
const opts=()=>({title:'Review PR 8',summary:'Checked',target:'pr:8',
  idempotencyKey:'review:8:commit',validation:[{check:'unit',status:'passed'}]});
test('review-pr pilot previews without remote calls and preserves canonical data',async()=>{
  const source=canonical(),before=JSON.stringify(source);
  const result=await presentReviewArtifact(source,{...opts(),adapter:{
    findByKey:()=>{throw new Error('remote read');},
    create:()=>{throw new Error('remote write');},
    update:()=>{throw new Error('remote write');},
  }});
  assert.equal(result.status,'preview');
  assert.equal(JSON.stringify(source),before);
  assert.match(result.body,/standards/);
  assert.match(result.body,/spec/);
});
test('review-pr pilot requires explicit approval before any write',async()=>{
  const adapter={findByKey:async()=>null,create:async()=>({id:1}),update:async()=>({id:1})};
  await assert.rejects(presentReviewArtifact(canonical(),{...opts(),adapter,dryRun:false}),/approval/);
});
test('review-pr pilot rejects unsupported producer and unverified success',async()=>{
  const source=canonical();source.producer='other';
  await assert.rejects(presentReviewArtifact(source,{...opts(),adapter:{}}),/review-pr/);
  await assert.rejects(presentReviewArtifact(canonical(),{...opts(),validation:[],adapter:{}}),/validation evidence/);
});
test('review-pr pilot can publish through injected adapter after approval',async()=>{
  let saved;
  const adapter={
    findByKey:async()=>saved??null,
    create:async(_target,body)=>{saved={id:9,body};return saved;},
    update:async()=>{throw new Error('unexpected update');},
  };
  const result=await presentReviewArtifact(canonical(),{...opts(),adapter,dryRun:false,approved:true});
  assert.equal(result.status,'created');
  assert.match(saved.body,/standards/);
});

test('review-pr pilot rejects malformed PR identifiers before publication',async()=>{
  const fail=()=>{throw new Error('unexpected remote operation');};
  const adapter={findByKey:fail,create:fail,update:fail};
  for (const target of ['issue:8','pr:0','pr:8-extra','pr:-1']) {
    await assert.rejects(
      presentReviewArtifact(canonical(),{...opts(),target,adapter}),
      /explicit PR target/,
    );
  }
});

test('review-pr pilot passes a coordinator through to publication',async()=>{
  const events=[];
  const coordinator={withLock:async(target,key,fn)=>{
    events.push('lock:'+target+':'+key);
    return fn();
  }};
  const adapter={
    findByKey:async()=>{events.push('read');return null;},
    create:async()=>{events.push('create');return {id:19};},
    update:async()=>{throw new Error('unexpected update');},
  };
  const result=await presentReviewArtifact(canonical(),{...opts(),adapter,dryRun:false,approved:true,coordinator});
  assert.equal(result.status,'created');
  assert.deepEqual(events,['lock:pr:8:review:8:commit','read','create']);
});
