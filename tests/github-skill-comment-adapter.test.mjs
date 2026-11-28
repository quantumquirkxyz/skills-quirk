import test from 'node:test';
import assert from 'node:assert/strict';
import {createGitHubCommentAdapter} from '../scripts/github-skill-comment-adapter.mjs';
import {publishSkillOutput} from '../scripts/publish-skill-output.mjs';

const fixture = () => ({schemaVersion:'1.0',artifactType:'review',artifactId:'review-1',operationId:'op-1',status:'partial',title:'Review',summary:'Evidence pending',sourceRefs:[],evidence:[],validation:[],nextActions:[],payload:{standards:[],spec:[]},publication:{target:'pr:8',idempotencyKey:'review:8:fixed-point'}});
test('GitHub adapter preserves identity across create, repeat, and update', async () => {
  const comments = [];
  let creates = 0, updates = 0;
  const client = {
    listComments:async()=>comments,
    createComment:async(_target,body)=>{creates++; const comment={id:1,body,owned:true};comments.push(comment);return comment;},
    updateComment:async(_target,id,body)=>{updates++;const comment=comments.find(x=>x.id===id);comment.body=body;return comment;}
  };
  const adapter = createGitHubCommentAdapter(client);
  const record = fixture();
  assert.equal((await publishSkillOutput(record,adapter,{approved:true,dryRun:false})).status,'created');
  assert.equal((await publishSkillOutput(record,adapter,{approved:true,dryRun:false})).status,'unchanged');
  record.summary='Changed';
  assert.equal((await publishSkillOutput(record,adapter,{approved:true,dryRun:false})).status,'updated');
  assert.equal((await publishSkillOutput(record,adapter,{approved:true,dryRun:false})).status,'unchanged');
  assert.equal(creates,1);
  assert.equal(updates,1);
  assert.match(comments[0].body,/quirk-skill-output:/);
});
test('does not adopt comments without verified ownership', async () => {
  const client={listComments:async()=>[{id:1,body:'untrusted',owned:false}],createComment:async()=>({id:2}),updateComment:async()=>({id:1})};
  assert.equal(await createGitHubCommentAdapter(client).findByKey('issue:1','k'),null);
});
test('fails closed on incomplete pagination and invalid targets', async () => {
  const page=Array.from({length:100},(_,i)=>({id:i+1,body:'unrelated',owned:false}));
  const client={listComments:async()=>page,createComment:async()=>({id:1}),updateComment:async()=>({id:1})};
  const adapter=createGitHubCommentAdapter(client,{maxPages:1});
  await assert.rejects(adapter.findByKey('pr:8','k'),/incomplete/);
  await assert.rejects(adapter.findByKey('pr:0','k'),/Expected issue/);
});

test('rejects a foreign comment containing the same idempotency marker',async()=>{
  const key='review:collision';
  const marker=Buffer.from(key).toString('base64url');
  const client={
    listComments:async()=>[{id:9,body:'foreign\\n\\n<!-- quirk-skill-output:'+marker+' -->',owned:false}],
    createComment:async()=>{throw new Error('must not create');},
    updateComment:async()=>{throw new Error('must not update');},
  };
  await assert.rejects(createGitHubCommentAdapter(client).findByKey('pr:8',key),/collision/);
});
test('rejects duplicate owned markers across paginated pages',async()=>{
  const key='review:duplicate',suffix='<!-- quirk-skill-output:'+Buffer.from(key).toString('base64url')+' -->';
  const page1=Array.from({length:100},(_,i)=>({id:i+1,body:i===0?'a\\n\\n'+suffix:'unrelated',owned:true}));
  const page2=[{id:101,body:'b\\n\\n'+suffix,owned:true}];
  const client={
    listComments:async(_target,{page})=>page===1?page1:page2,
    createComment:async()=>{throw new Error('must not create');},
    updateComment:async()=>{throw new Error('must not update');},
  };
  await assert.rejects(createGitHubCommentAdapter(client).findByKey('pr:8',key),/Duplicate/);
});
