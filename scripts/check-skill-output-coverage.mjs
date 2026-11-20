import {inventorySkills} from './skill-output-inventory.mjs';
import {verifyMigrationEvidenceFiles} from './skill-output-migration-evidence.mjs';
import {readFile} from 'node:fs/promises';

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
if (process.argv[1]?.endsWith('check-skill-output-coverage.mjs')) {
  const requireMapped=process.argv.includes('--require-mapped');
  const inventory=await inventorySkills();
  const manifestArg=process.argv.indexOf('--evidence');
  if (manifestArg!==-1 && (!process.argv[manifestArg+1] || process.argv[manifestArg+1].startsWith('--'))) throw new Error('Missing --evidence path');
  const manifest=manifestArg===-1 ? null : JSON.parse(await readFile(process.argv[manifestArg+1],'utf8'));
  const evidence=manifestArg===-1 ? {verified:[],problems:[]} :
    await verifyMigrationEvidenceFiles(inventory,manifest);
  const scopedInventory=manifest?.scope?.paths
    ? {...inventory,skills:inventory.skills.filter(skill=>manifest.scope.paths.includes(skill.path)),total:manifest.scope.paths.length}
    : manifest?.scope?.tranches
      ? {...inventory,skills:inventory.skills.filter(skill=>manifest.entries.some(entry=>entry.path===skill.path)),total:manifest.entries.length}
      : inventory;
  const result={...evaluateCoverage(scopedInventory,{requireMapped,verifiedPaths:evidence.verified}),remaining:inventory.skills.filter(skill=>!evidence.verified.includes(skill.path)).map(skill=>skill.path),evidenceProblems:evidence.problems};
  if (evidence.problems.length) result.passed=false;
  process.stdout.write(JSON.stringify(result,null,2)+'\n');
  if (!result.passed) process.exitCode=1;
}
