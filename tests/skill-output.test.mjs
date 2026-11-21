import test from 'node:test';
import assert from 'node:assert/strict';
import { renderSkillOutput, validateSkillOutput } from '../scripts/render-skill-output.mjs';

const fixture = () => ({schemaVersion:'1.0',artifactType:'review',artifactId:'review-1',operationId:'op-1',status:'partial',title:'Review result',summary:'Two findings',sourceRefs:['PR #8'],evidence:['tests/test.mjs:12'],validation:[{check:'integration',status:'skipped',reason:'No credentials'}],nextActions:['Run CI'],payload:{standards:[],spec:[]}});
test('renders stable human-readable output across surfaces', () => {
  const r = fixture();
  const a = renderSkillOutput(r, 'file');
  assert.notEqual(a, renderSkillOutput(r, 'issue'));
  assert.match(renderSkillOutput(r, 'issue'), /Requirements and acceptance/);
  assert.match(renderSkillOutput(r, 'pr'), /Changes and implementation/);
  assert.match(a, /standards/);
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

test('rejects unknown fields and malformed optional arrays', () => {
  assert.throws(() => validateSkillOutput({...fixture(), surprise:true}), /Unexpected field/);
  assert.throws(() => validateSkillOutput({...fixture(), risks:'not-an-array'}), /Invalid array/);
});
test('high-risk success requires evidence of verification', () => {
  assert.throws(() => validateSkillOutput({...fixture(),artifactType:'deployment',status:'success',validation:[]}), /requires validation evidence/);
});
test('preserves structured payload details in published text', () => {
  const r = fixture();
  r.payload = {findings:[{severity:'high',path:'src/index.ts',line:14}]};
  const output = renderSkillOutput(r, 'pr');
  assert.match(output, /src/);
  assert.match(output, /severity/);
});

test('rejects invalid optional metadata and publication fields', () => {
  assert.throws(() => validateSkillOutput({...fixture(),generatedAt:'not-a-date'}), /Invalid generatedAt/);
  assert.throws(() => validateSkillOutput({...fixture(),publication:{target:'pr:0',idempotencyKey:'x'}}), /Invalid publication target/);
  assert.throws(() => validateSkillOutput({...fixture(),publication:{target:'pr:8',idempotencyKey:''}}), /Invalid publication idempotencyKey/);
  assert.throws(() => validateSkillOutput({...fixture(),publication:{target:'pr:8',idempotencyKey:'x',unexpected:true}}), /Unexpected publication field/);
  assert.throws(() => validateSkillOutput({...fixture(),validation:[{check:'unit',status:'passed',extra:1}]}), /Unexpected validation field/);
  assert.throws(() => validateSkillOutput({...fixture(),validation:[{check:'unit',status:'passed',reason:3}]}), /Invalid validation reason/);
});

test('envelope required fields must be own properties',()=>{
  const original=fixture();
  const inherited=Object.create({artifactId:original.artifactId});
  Object.assign(inherited,original);
  delete inherited.artifactId;
  assert.throws(()=>validateSkillOutput(inherited),/Missing field: artifactId/);
});
