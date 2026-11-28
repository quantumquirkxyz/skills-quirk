import {inventorySkills} from './skill-output-inventory.mjs';
import {readFile} from 'node:fs/promises';
import {runMigrationFixtures} from './run-skill-output-migration-fixtures.mjs';

// Read-only release gate. Do not equate a schema reference with a verified migration.
export function evaluateCoverage(inventory,{requireMapped=false,verifiedPaths=[]}={}) {
  if (!inventory || !Array.isArray(inventory.skills) || inventory.total!==inventory.skills.length) {
    throw new Error('Invalid skill inventory');
  }
  const unclassified=inventory.skills.filter(skill=>!skill.migrationStatus || skill.migrationStatus==='not-assessed');
  if(inventory.total===0) throw new Error('Empty canonical skill inventory');
  const known=new Set(inventory.skills.map(x=>x.path));
  if(known.size!==inventory.total) throw new Error('Duplicate canonical skill paths');
  const verified=new Set(verifiedPaths);
  for(const path of verified) if(!known.has(path)) throw new Error('Unknown verified skill: '+path);
  const unmapped=inventory.skills.filter(skill=>!verified.has(skill.path));
  return {
    total:inventory.total,
    classified:inventory.total-unclassified.length,
    verified:inventory.total-unmapped.length,
    unclassified:unclassified.map(x=>x.path),
    unmapped:unmapped.map(x=>x.path),
    passed:unclassified.length===0 && (!requireMapped || unmapped.length===0),
  };
}
export function evaluateReleaseCoverage(inventory,{requireMapped=false,verifiedPaths=[],evidenceProblems=[],evidencePassed=true}={}) {
  const result={...evaluateCoverage(inventory,{requireMapped,verifiedPaths}),
    remaining:inventory.skills.filter(skill=>!verifiedPaths.includes(skill.path)).map(skill=>skill.path),
    evidenceProblems};
  if (evidenceProblems.length || !evidencePassed) result.passed=false;
  return result;
}
if (process.argv[1]?.endsWith('check-skill-output-coverage.mjs')) {
  const requireMapped=process.argv.includes('--require-mapped');
  const inventory=await inventorySkills();
  const manifestArg=process.argv.indexOf('--evidence');
  if (manifestArg!==-1 && (!process.argv[manifestArg+1] || process.argv[manifestArg+1].startsWith('--'))) throw new Error('Missing --evidence path');
  const manifest=manifestArg===-1 ? null : JSON.parse(await readFile(process.argv[manifestArg+1],'utf8'));
  // Strict evidence gates must execute every digest-pinned fixture. The runner
  // performs manifest integrity, repository-boundary, and bounded-time checks.
  const evidence=manifestArg===-1 ? {verified:[],problems:[]} :
    await runMigrationFixtures(manifest);
  const verifiedPaths=evidence.verifiedPaths ?? [];
  // A release manifest may organize execution into tranches, but it must never
  // redefine the canonical inventory. Evaluate evidence against every skill.
  const result=evaluateReleaseCoverage(inventory,{
    requireMapped,verifiedPaths,evidenceProblems:evidence.problems,
    evidencePassed:evidence.passed !== false && !evidence.missing?.length,
  });
  result.fixtureResults=evidence.results;
  process.stdout.write(JSON.stringify(result,null,2)+'\n');
  if (!result.passed) process.exitCode=1;
}
