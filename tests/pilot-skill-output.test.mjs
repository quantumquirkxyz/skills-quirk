import test from 'node:test';
import assert from 'node:assert/strict';
import {listOutputPilots,presentPilotArtifact} from '../scripts/pilot-skill-output.mjs';

const artifact=(producer,status='completed')=>({
  artifactType:'workflow-artifact',artifactId:'artifact-1',operationId:'operation-1',
  producer,status,sourceArtifacts:['issue:9'],evidence:['test result'],payload:{example:true},
});
test('all eight pilot skills have explicit presentation surfaces',()=>{
  const pilots=listOutputPilots();
  assert.equal(pilots.length,8);
  assert.equal(new Set(pilots.map(x=>x.name)).size,8);
  assert.ok(pilots.every(x=>x.surfaces.includes('json')));
});
test('renders eight canonical pilot artifacts without changing their source',()=>{
  for(const {name,surfaces} of listOutputPilots()) {
    const input=artifact(name);
    const original=JSON.stringify(input);
    const result=presentPilotArtifact(name,input,{title:'Test',summary:'Evidence',surface:surfaces[0]});
    assert.equal(result.presentation.provenance.producer,name);
    assert.equal(result.presentation.status,'success');
    assert.equal(JSON.stringify(input),original);
    assert.ok(result.markdown.includes('Test'));
  }
});
test('supports blocked and unknown routing lifecycle statuses without false success',()=>{
  const blocked=presentPilotArtifact('publish-open-pr',artifact('publish-open-pr','needs-approval'),{title:'PR',summary:'Approval missing'});
  assert.equal(blocked.presentation.status,'blocked');
  const unknown=presentPilotArtifact('ship-subissue',artifact('ship-subissue','outcome-unknown'),{title:'Ship',summary:'Reconcile'});
  assert.equal(unknown.presentation.status,'unknown');
});
test('rejects cross-skill producer and forbidden publication surfaces',()=>{
  assert.throws(()=>presentPilotArtifact('to-spec',artifact('to-tickets'),{title:'Spec',summary:'Mismatch'}),/producer mismatch/);
  assert.throws(()=>presentPilotArtifact('github-project-analysis',artifact('github-project-analysis'),{title:'Research',summary:'Read-only',surface:'pr'}),/not allowed/);
  assert.throws(()=>presentPilotArtifact('unknown',artifact('unknown'),{title:'X',summary:'Y'}),/approved/);
});
test('produces deterministic machine-readable JSON',()=>{
  const result=presentPilotArtifact('to-spec',artifact('to-spec'),{title:'Spec',summary:'Evidence',surface:'json'});
  assert.equal(JSON.parse(result.json).provenance.producer,'to-spec');
  assert.equal(result.markdown,undefined);
});
