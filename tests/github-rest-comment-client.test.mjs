import test from 'node:test';
import assert from 'node:assert/strict';
import {createGitHubRestCommentClient} from '../scripts/github-rest-comment-client.mjs';
import {createGitHubCommentAdapter} from '../scripts/github-skill-comment-adapter.mjs';
import {publishSkillOutput} from '../scripts/publish-skill-output.mjs';

const fixture = () => ({schemaVersion:'1.0',artifactType:'review',artifactId:'r1',operationId:'o1',status:'partial',title:'Review',summary:'Checked',sourceRefs:[],evidence:[],validation:[],nextActions:[],payload:{standards:[],spec:[]},publication:{target:'pr:8',idempotencyKey:'r1:sha'}});
test('REST client authenticates, verifies ownership, and publishes via GitHub issue comment endpoints', async () => {
  const calls=[], comments=[];
  const fetchImpl=async(url,opts)=>{
    calls.push({url,method:opts.method,auth:opts.headers.Authorization});
    const path=new URL(url).pathname;
    let data;
    if (path==='/user') data={login:'quantumquirkxyz'};
    else if (opts.method==='GET') data=comments;
    else if (opts.method==='POST') {
      data={id:42,body:JSON.parse(opts.body).body,user:{login:'quantumquirkxyz'}};
      comments.push(data);
    } else if (opts.method==='PATCH') {
      data=comments[0];
      data.body=JSON.parse(opts.body).body;
    }
    return {ok:true,json:async()=>data};
  };
  const client=createGitHubRestCommentClient({token:'mock-token',owner:'quantumquirkxyz',repo:'skills-quirk',actor:'quantumquirkxyz',fetchImpl});
  const adapter=createGitHubCommentAdapter(client);
  const record=fixture();
  assert.equal((await publishSkillOutput(record,adapter,{approved:true,dryRun:false})).status,'created');
  assert.equal((await publishSkillOutput(record,adapter,{approved:true,dryRun:false})).status,'unchanged');
  record.summary='Updated';
  assert.equal((await publishSkillOutput(record,adapter,{approved:true,dryRun:false})).status,'updated');
  assert.equal(calls.filter(c=>c.method==='POST').length,1);
  assert.equal(calls.filter(c=>c.method==='PATCH').length,1);
  assert.ok(calls.every(c=>c.auth==='Bearer mock-token'));
  assert.ok(calls.some(c=>c.url.includes('/issues/8/comments')));
});
test('REST client fails closed on authorization errors without disclosing token', async () => {
  const client=createGitHubRestCommentClient({token:'secret-token',owner:'org',repo:'repo',actor:'actor',fetchImpl:async()=>({ok:false,status:403})});
  await assert.rejects(client.listComments({kind:'issue',number:1}),e=>e.status===403 && !e.message.includes('secret-token'));
});
test('REST client marks foreign comments as unowned', async () => {
  const client=createGitHubRestCommentClient({token:'token',owner:'org',repo:'repo',actor:'actor',fetchImpl:async(url)=>({ok:true,json:async()=>new URL(url).pathname==='/user'?{login:'actor'}:[{id:1,body:'x',user:{login:'other'}}]})});
  assert.equal((await client.listComments({kind:'issue',number:1}))[0].owned,false);
});

test('REST client rejects a mismatched token identity before listing or writing comments', async () => {
  const calls=[];
  const client=createGitHubRestCommentClient({
    token:'token',owner:'org',repo:'repo',actor:'claimed-actor',
    fetchImpl:async(url)=>{
      calls.push(new URL(url).pathname);
      return {ok:true,json:async()=>({login:'different-actor'})};
    },
  });
  await assert.rejects(client.listComments({kind:'issue',number:1}),/identity does not match/);
  await assert.rejects(client.createComment({kind:'issue',number:1},'body'),/identity does not match/);
  assert.deepEqual(calls,['/user'],'mismatched identity must block repository API calls');
});
