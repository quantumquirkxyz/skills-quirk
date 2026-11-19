import test from 'node:test';
import assert from 'node:assert/strict';
import { renderSkillOutput, validateSkillOutput } from '../scripts/render-skill-output.mjs';

const fixture = () => ({schemaVersion:'1.0',artifactType:'review',artifactId:'review-1',operationId:'op-1',status:'partial',title:'Review result',summary:'Two findings',sourceRefs:['PR #8'],evidence:['tests/test.mjs:12'],validation:[{check:'integration',status:'skipped',reason:'No credentials'}],nextActions:['Run CI'],payload:{standards:[],spec:[]}});
test('renders stable human-readable output across surfaces', () => {
  const r = fixture();
  const a = renderSkillOutput(r, 'file');
  assert.equal(a, renderSkillOutput(r, 'issue'));
  assert.match(a, /No credentials/);
  assert.match(renderSkillOutput(r, 'comment'), /^### Review result/);
  assert.doesNotMatch(a, /## Risks/);
});
test('rejects missing metadata and invalid statuses', () => {
  assert.throws(() => validateSkillOutput({...fixture(), operationId:undefined}), /Invalid field/);
  assert.throws(() => validateSkillOutput({...fixture(), status:'done'}), /Invalid status/);
});
test('never reports a skipped or failed check as success', () => {
  assert.throws(() => validateSkillOutput({...fixture(),status:'success'}), /Skipped validation/);
  const r = fixture(); r.validation = [{check:'unit',status:'failed'}]; r.status = 'success';
  assert.throws(() => validateSkillOutput(r), /Failed validation/);
});
test('requires a reason for skipped checks', () => {
  const r = fixture(); r.validation[0].reason = '';
  assert.throws(() => validateSkillOutput(r), /requires reason/);
});
test('escapes untrusted markdown and strips line breaks', () => {
  const r = fixture(); r.summary = '<script>\n**spoof**';
  const rendered = renderSkillOutput(r);
  assert.doesNotMatch(rendered, /<script>/);
  assert.match(rendered, /\\<script\\>/);
});
