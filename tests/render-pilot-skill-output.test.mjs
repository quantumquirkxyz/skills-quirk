import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,writeFile,rm} from 'node:fs/promises';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import {parsePilotArgs,runPilotCli} from '../scripts/render-pilot-skill-output.mjs';

test('CLI rejects missing options, unknown options, and duplicates',()=>{
  assert.throws(()=>parsePilotArgs([]),/Expected/);
  assert.throws(()=>parsePilotArgs(['to-spec','artifact.json','--title','T']),/summary/);
  assert.throws(()=>parsePilotArgs(['to-spec','artifact.json','--title','T','--summary','S','--danger','yes']),/Invalid/);
  assert.throws(()=>parsePilotArgs(['to-spec','artifact.json','--title','T','--title','X','--summary','S']),/Duplicate/);
});
test('CLI renders a canonical pilot artifact without remote side effects',async()=>{
  const directory=await mkdtemp(join(tmpdir(),'quirk-pilot-'));
  try {
    const file=join(directory,'artifact.json');
    await writeFile(file,JSON.stringify({
      artifactType:'requirements-artifact',artifactId:'req-1',operationId:'op-1',
      status:'completed',producer:'to-spec',sourceArtifacts:['issue:9'],evidence:['approved'],
      payload:{acceptanceCriteria:['test']},
    }));
    const output=await runPilotCli(['to-spec',file,'--title','Requirements','--summary','Validated','--surface','json']);
    const parsed=JSON.parse(output);
    assert.equal(parsed.provenance.producer,'to-spec');
    assert.equal(parsed.status,'success');
  } finally {await rm(directory,{recursive:true,force:true});}
});
