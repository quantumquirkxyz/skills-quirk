import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,mkdir,writeFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {inventorySkills} from '../scripts/skill-output-inventory.mjs';

test('classifies canonical skills without changing their source files', async () => {
  const root=await mkdtemp(join(tmpdir(),'skill-output-inventory-'));
  try {
    const folder=join(root,'delivery','review-pr');
    await mkdir(folder,{recursive:true});
    const source='---\nartifactType: review\nrisk: high\napprovalRequired: true\nsideEffects:\n  - post-pr-comment\nfixturesPath: evals/review.json\noutputs:\n  - type: object\n---\n\nUses schemas/software-engineering/verification-artifact.schema.json\n';
    await writeFile(join(folder,'SKILL.md'),source);
    const result=await inventorySkills(root);
    assert.equal(result.total,1);
    assert.equal(result.priorities.high,1);
    assert.equal(result.skills[0].artifactType,'review');
    assert.equal(result.skills[0].approvalRequired,'true');
    assert.deepEqual(result.skills[0].schemaRefs,['schemas/software-engineering/verification-artifact.schema.json']);
    assert.equal(result.skills[0].migrationStatus,'not-assessed');
  } finally {await rm(root,{recursive:true,force:true});}
});
