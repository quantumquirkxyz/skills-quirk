import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,writeFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {renderLifecycleArtifact,runCli,parseArgs} from '../scripts/render-lifecycle-artifact.mjs';

const canonical = () => ({
  schemaVersion:'1.0',artifactType:'verification-artifact',
  artifactId:'review-42',traceId:'trace-42',operationId:'review-op-42',
  status:'completed',sourceArtifacts:['pr:42'],sourceDigests:{'pr:42':'sha256:abc'},
  fixedPoint:{commit:'abc'},producer:'review-pr',owner:'reviewer',
  nextConsumer:'plan-review-fixes',evidence:[{check:'unit',result:'passed'}],
  approvals:[],blockers:[],risks:[],createdAt:'2026-11-19T12:00:00Z',
  expiresAt:null,payload:{standards:{findings:[]},spec:{findings:[]}}
});
test('renders both review axes without mutating the canonical verification artifact',()=>{
  const source=canonical(),original=JSON.stringify(source);
  const {presentation,markdown}=renderLifecycleArtifact(source,{title:'PR review',summary:'Review completed',surface:'pr',validation:[{check:'unit',status:'passed'}]});
  assert.equal(JSON.stringify(source),original);
  assert.equal(presentation.provenance.traceId,'trace-42');
  assert.equal(presentation.provenance.lifecycleStatus,'completed');
  assert.deepEqual(presentation.payload,source.payload);
  assert.match(markdown,/standards/);
  assert.match(markdown,/spec/);
  assert.match(markdown,/Changes and implementation/);
});
test('CLI reads canonical input and preserves it on disk',async()=>{
  const root=await mkdtemp(join(tmpdir(),'lifecycle-render-'));
  try {
    const path=join(root,'artifact.json');
    const source=JSON.stringify(canonical());
    await writeFile(path,source);
    const markdown=await runCli([path,'--title','Review','--summary','Completed','--surface','comment']);
    assert.match(markdown,/### Review/);
    assert.match(markdown,/trace-42|review-42/);
    assert.equal((await import('node:fs/promises')).readFile!==undefined,true);
    assert.equal(await (await import('node:fs/promises')).readFile(path,'utf8'),source);
  }finally{await rm(root,{recursive:true,force:true});}
});
test('CLI rejects missing arguments and unsupported surfaces',()=>{
  assert.throws(()=>parseArgs([]),/Usage/);
  assert.throws(()=>renderLifecycleArtifact(canonical(),{title:'Review',summary:'Completed',surface:'unknown'}),/Unsupported surface/);
});

test('completed verification artifact cannot claim success without executed checks',()=>{
  assert.throws(()=>renderLifecycleArtifact(canonical(),{title:'Review',summary:'Complete'}),/High-risk success requires validation evidence/);
  assert.throws(()=>renderLifecycleArtifact(canonical(),{title:'Review',summary:'Complete',validation:[{check:'security',status:'skipped',reason:'Unavailable'}]}),/Skipped validation cannot yield unqualified success/);
});
