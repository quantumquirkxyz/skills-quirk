import {inventorySkills} from './skill-output-inventory.mjs';

// Read-only release gate. Do not equate a schema reference with a verified migration.
export function evaluateCoverage(inventory,{requireMapped=false}={}) {
  if (!inventory || !Array.isArray(inventory.skills) || inventory.total!==inventory.skills.length) {
    throw new Error('Invalid skill inventory');
  }
  const unclassified=inventory.skills.filter(skill=>!skill.migrationStatus || skill.migrationStatus==='not-assessed');
  const unmapped=inventory.skills.filter(skill=>skill.migrationStatus!=='mapped-and-verified');
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
  const result=evaluateCoverage(inventory,{requireMapped});
  process.stdout.write(JSON.stringify(result,null,2)+'\n');
  if (!result.passed) process.exitCode=1;
}
