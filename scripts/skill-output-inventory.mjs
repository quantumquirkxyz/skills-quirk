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
async function scan(directory, entries, base) {
  for (const entry of await readdir(directory,{withFileTypes:true})) {
    const path=join(directory,entry.name);
    if (entry.isDirectory()) await scan(path,entries,base);
    else if (entry.name==='SKILL.md') {
      const content=await readFile(path,'utf8');
      const frontmatter=content.match(/^---\s*\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? '';
      const schemaRefs=[...new Set(content.match(patterns.canonicalSchema) ?? [])];
      const risk=/^risk:\s*(.+)$/m.exec(frontmatter)?.[1]?.trim() ?? 'unclassified';
      const sideEffects=patterns.sideEffects.test(frontmatter);
      const approval=patterns.approval.exec(frontmatter)?.[1] ?? 'unspecified';
      entries.push({
        path:relative(base,path).replaceAll('\\','/'),
        artifactType:patterns.artifactType.exec(frontmatter)?.[1]?.trim() ?? null,
        risk, sideEffects, approvalRequired:approval,
        fixture:patterns.fixtures.exec(frontmatter)?.[1]?.trim() ?? null,
        schemaRefs, hasOutputDeclaration:patterns.output.test(frontmatter),
        migrationStatus: !frontmatter.trim() || !/^name:\s*\S+/m.test(frontmatter)
          ? 'not-assessed'
          : !patterns.output.test(frontmatter) ? 'missing-output-declaration'
          : schemaRefs.length ? 'schema-referenced-needs-verification'
          : 'declared-needs-contract-mapping',
      });
    }
  }
}
export async function inventorySkills(directory=root,{base='.'}={}) {
  const entries=[];
  await scan(directory,entries,base);
  entries.sort((a,b)=>a.path.localeCompare(b.path,'en'));
  return {schemaVersion:'1.0',generatedBy:'scripts/skill-output-inventory.mjs',
    total:entries.length,
    priorities:{high:entries.filter(x=>x.sideEffects || ['high','critical'].includes(x.risk)).length},
    coverage:{classified:entries.filter(x=>x.migrationStatus!=='not-assessed').length,unmapped:entries.filter(x=>x.migrationStatus!=='mapped-and-verified').length},
    migrationCounts:Object.fromEntries([...new Set(entries.map(x=>x.migrationStatus))].sort().map(status=>[status,entries.filter(x=>x.migrationStatus===status).length])),
    skills:entries};
}
if (process.argv[1]?.endsWith('skill-output-inventory.mjs')) {
  const result=await inventorySkills(process.argv[2] ?? root);
  process.stdout.write(JSON.stringify(result,null,2)+'\n');
}
