import {readFile, readdir} from 'node:fs/promises';
import {join, relative} from 'node:path';

// Read-only classification. This does not rewrite SKILL.md or generated views.
const root = '.agents/skills';
const patterns = {
  canonicalSchema: /schemas\/software-engineering\/[a-z0-9-]+\.schema\.json|schema\/[a-z0-9-]+\.schema\.json/g,
  sideEffects: /^sideEffects:\s*$/m,
  approval: /^approvalRequired:\s*(true|false)/m,
  artifactType: /^artifactType:\s*(.+)$/m,
  fixtures: /^fixturesPath:\s*(.+)$/m,
  output: /^outputs:\s*$/m,
};
async function scan(directory, entries) {
  for (const entry of await readdir(directory,{withFileTypes:true})) {
    const path=join(directory,entry.name);
    if (entry.isDirectory()) await scan(path,entries);
    else if (entry.name==='SKILL.md') {
      const content=await readFile(path,'utf8');
      const schemaRefs=[...new Set(content.match(patterns.canonicalSchema) ?? [])];
      const risk=/^risk:\s*(.+)$/m.exec(content)?.[1]?.trim() ?? 'unclassified';
      const sideEffects=patterns.sideEffects.test(content);
      const approval=patterns.approval.exec(content)?.[1] ?? 'unspecified';
      entries.push({
        path:relative('.',path).replaceAll('\\','/'),
        artifactType:patterns.artifactType.exec(content)?.[1]?.trim() ?? null,
        risk, sideEffects, approvalRequired:approval,
        fixture:patterns.fixtures.exec(content)?.[1]?.trim() ?? null,
        schemaRefs, hasOutputDeclaration:patterns.output.test(content),
        migrationStatus:'not-assessed',
      });
    }
  }
}
export async function inventorySkills(directory=root) {
  const entries=[];
  await scan(directory,entries);
  entries.sort((a,b)=>a.path.localeCompare(b.path,'en'));
  return {schemaVersion:'1.0',generatedBy:'scripts/skill-output-inventory.mjs',
    total:entries.length,
    priorities:{high:entries.filter(x=>x.sideEffects || ['high','critical'].includes(x.risk)).length},
    skills:entries};
}
if (process.argv[1]?.endsWith('skill-output-inventory.mjs')) {
  const result=await inventorySkills(process.argv[2] ?? root);
  process.stdout.write(JSON.stringify(result,null,2)+'\n');
}
