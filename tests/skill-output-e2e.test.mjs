import test from 'node:test';
import assert from 'node:assert/strict';
import {presentPilotArtifact} from '../scripts/pilot-skill-output.mjs';
import {createGitHubCommentAdapter} from '../scripts/github-skill-comment-adapter.mjs';
import {publishSkillOutput} from '../scripts/publish-skill-output.mjs';
import {createFilesystemPublicationCoordinator} from '../scripts/filesystem-publication-coordinator.mjs';
import {mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';

test('issue-to-PR output lifecycle stays read-only until explicitly approved',async()=>{
  const issue={artifactType:'requirements-artifact',artifactId:'req-9',operationId:'op-9',status:'completed',producer:'to-spec',sourceArtifacts:['issue:9'],evidence:['reviewed spec'],payload:{acceptanceCriteria:['verified']}};
  const spec=presentPilotArtifact('to-spec',issue,{title:'Requirements',summary:'Scoped',surface:'issue',validation:[{check:'spec',status:'passed'}]});
  assert.equal(spec.presentation.status,'success');
  const review={artifactType:'verification-artifact',artifactId:'review-8',operationId:'op-9',status:'completed',producer:'review-pr',sourceArtifacts:['issue:9','pr:8'],evidence:['test run'],payload:{findings:[]}};
  const rendered=presentPilotArtifact('review-pr',review,{title:'PR review',summary:'Verified',surface:'pr',validation:[{check:'tests',status:'passed'}]});
  const record={...rendered.presentation,publication:{target:'pr:8',idempotencyKey:'review:8:head-sha'}};
  let creates=0;
  const comments=[];
  const adapter=createGitHubCommentAdapter({
    listComments:async()=>comments,
    createComment:async(_target,body)=>{creates++;const item={id:17,body,owned:true};comments.push(item);return item;},
    updateComment:async(_target,id,body)=>{const item=comments.find(x=>x.id===id);item.body=body;return item;},
  });
  const directory=await mkdtemp(join(tmpdir(),'quirk-e2e-'));
  try {
    const coordinator=createFilesystemPublicationCoordinator({directory});
    assert.equal((await publishSkillOutput(record,adapter,{coordinator})).status,'preview');
    assert.equal(creates,0);
    await assert.rejects(publishSkillOutput(record,adapter,{approved:false,dryRun:false,coordinator}),/approval/);
    assert.equal(creates,0);
    assert.equal((await publishSkillOutput(record,adapter,{approved:true,dryRun:false,coordinator})).status,'created');
    assert.equal((await publishSkillOutput(record,adapter,{approved:true,dryRun:false,coordinator})).status,'unchanged');
    assert.equal(creates,1);
    assert.ok(comments[0].body.includes('quirk-skill-output:'));
  } finally {await rm(directory,{recursive:true,force:true});}
});
