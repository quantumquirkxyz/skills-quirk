import {readFile,realpath} from 'node:fs/promises';
import {resolve} from 'node:path';
import {inventorySkills} from './skill-output-inventory.mjs';

const allowed = path => path === 'evals/behavioral' ||
  path.startsWith('evals/behavioral/') ||
  path === '.agents/skills/platform/fixtures/behavioral' ||
  path.startsWith('.agents/skills/platform/fixtures/behavioral/');

export async function inventoryOutputFixtures({root='.'}={}) {
  const inventory=await inventorySkills(resolve(root,'.agents/skills'),{base:root});
  const realRoot=await realpath(root);
  const mapped=[];
  const missing=[];
  for (const skill of inventory.skills) {
    if (!skill.fixture) {
      missing.push({path:skill.path,reason:'No fixture declared'});
      continue;
    }
    const fixture=skill.fixture.replaceAll('\\','/');
    if (!allowed(fixture) || fixture.split('/').includes('..')) {
      missing.push({path:skill.path,fixture,reason:'Fixture is outside the behavioral fixture roots'});
      continue;
    }
    try {
      const realFixture=await realpath(resolve(root,fixture));
      if (!realFixture.startsWith(realRoot+'/')) throw new Error('Fixture symlink escapes repository');
      const parsed=JSON.parse(await readFile(realFixture,'utf8'));
      if (!parsed || typeof parsed!=='object') throw new Error('Fixture is not a JSON object');
      mapped.push({path:skill.path,fixture,fixtureSkill:parsed.skill ?? null});
    } catch (error) {
      missing.push({path:skill.path,fixture,reason:error.message});
    }
  }
  return {
    schemaVersion:'1.0',
    generatedBy:'scripts/skill-output-fixture-inventory.mjs',
    total:inventory.total,
    mapped,
    missing,
    coverage:{mapped:mapped.length,missing:missing.length},
  };
}

if (process.argv[1]?.endsWith('skill-output-fixture-inventory.mjs')) {
  process.stdout.write(JSON.stringify(await inventoryOutputFixtures({root:process.argv[2] ?? '.'}),null,2)+'\n');
}
