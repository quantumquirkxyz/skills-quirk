import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,mkdir,writeFile,rm} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import {runMigrationFixtures} from '../scripts/run-skill-output-migration-fixtures.mjs';

const hash=x=>createHash('sha256').update(x).digest('hex');
async function setup() {
  const root=await mkdtemp(join(tmpdir(),'quirk-fixture-runner-'));
  const skill='.agents/skills/research/example/SKILL.md';
  const fixture='tests/example.test.mjs';
  const source='---\nname: example\noutputs:\n  - type: object\n---\n';
  const passing="import test from 'node:test';test('works',()=>{});\n";
  await mkdir(join(root,'.agents/skills/research/example'),{recursive:true});
  await mkdir(join(root,'tests'),{recursive:true});
  await writeFile(join(root,skill),source);
  await writeFile(join(root,fixture),passing);
  const manifest={schemaVersion:'1.0',entries:[{path:skill,skillSha256:hash(source),fixturePath:fixture,fixtureSha256:hash(passing),contract:'schema/skill-output.schema.json',result:'passed'}]};
  return {root,manifest,fixture};
}
test('runs a verified pinned test file and reports success',async()=>{
  const {root,manifest}=await setup();
  try {
    const result=await runMigrationFixtures(manifest,{root});
    assert.equal(result.passed,true);
    assert.equal(result.verified,1);
    assert.equal(result.results.length,1);
  } finally {await rm(root,{recursive:true,force:true});}
});
test('does not run a stale fixture and rejects a failed test',async()=>{
  const {root,manifest,fixture}=await setup();
  try {
    await writeFile(join(root,fixture),"throw new Error('bad fixture');\n");
    const stale=await runMigrationFixtures(manifest,{root});
    assert.equal(stale.passed,false);
    assert.equal(stale.results.length,0);
    manifest.entries[0].fixtureSha256=hash(await (await import('node:fs/promises')).readFile(join(root,fixture)));
    const failed=await runMigrationFixtures(manifest,{root});
    assert.equal(failed.passed,false,JSON.stringify(failed));
    assert.equal(failed.results[0].passed,false,JSON.stringify(failed));
  } finally {await rm(root,{recursive:true,force:true});}
});
