import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,mkdir,writeFile,rm} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import {verifyMigrationEvidence,verifyMigrationEvidenceFiles} from '../scripts/skill-output-migration-evidence.mjs';

const hash=x=>createHash('sha256').update(x).digest('hex');
const inventory={skills:[{path:'.agents/skills/research/example/SKILL.md'}]};
const valid={schemaVersion:'1.0',entries:[{
  path:inventory.skills[0].path,skillSha256:hash('skill'),fixturePath:'tests/example.json',
  fixtureSha256:hash('fixture'),contract:'schema/skill-output.schema.json',result:'passed',
}]};
test('missing evidence never counts as verified migration',()=>{
  const result=verifyMigrationEvidence(inventory,{schemaVersion:'1.0',entries:[]});
  assert.equal(result.verified.size,0);
  assert.equal(result.missing.length,1);
});
test('rejects duplicate entries and unverified results',()=>{
  const duplicated=verifyMigrationEvidence(inventory,{...valid,entries:[valid.entries[0],valid.entries[0]]});
  assert.ok(duplicated.problems.some(x=>x.includes('Duplicate')));
  const failed=verifyMigrationEvidence(inventory,{...valid,entries:[{...valid.entries[0],result:'failed'}]});
  assert.equal(failed.verified.size,0);
});
test('verifies canonical and fixture bytes and detects stale evidence',async()=>{
  const root=await mkdtemp(join(tmpdir(),'quirk-evidence-'));
  try {
    const path=join(root,'.agents/skills/research/example');
    await mkdir(path,{recursive:true});
    await mkdir(join(root,'tests'),{recursive:true});
    await writeFile(join(path,'SKILL.md'),'skill');
    await writeFile(join(root,'tests/example.json'),'fixture');
    assert.equal((await verifyMigrationEvidenceFiles(inventory,valid,{root})).verified.length,1);
    await writeFile(join(path,'SKILL.md'),'changed');
    const stale=await verifyMigrationEvidenceFiles(inventory,valid,{root});
    assert.equal(stale.verified.length,0);
    assert.match(stale.problems[0],/Digest mismatch/);
  } finally {await rm(root,{recursive:true,force:true});}
});
test('refuses untrusted fixture paths outside tracked test directory',()=>{
  const report=verifyMigrationEvidence(inventory,{...valid,entries:[{...valid.entries[0],fixturePath:'../../secret'}]});
  assert.equal(report.verified.size,0);
});
