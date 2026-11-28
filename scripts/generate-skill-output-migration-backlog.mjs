#!/usr/bin/env node
import {inventorySkills} from './skill-output-inventory.mjs';

// Deterministic migration backlog for all canonical skills. This does not
// claim that an output contract or behavioral fixture has been verified.
export function buildMigrationBacklog(inventory) {
  if(!inventory||!Array.isArray(inventory.skills)||inventory.total!==inventory.skills.length) throw new Error('Invalid inventory');
  return {
    schemaVersion:'1.0',
    total:inventory.total,
    tasks:inventory.skills.map(skill=>{
      const highRisk=skill.sideEffects||['high','critical'].includes(skill.risk);
      const missingOutput=!skill.hasOutputDeclaration;
      const candidateContracts=skill.schemaRefs.length?skill.schemaRefs:['schema/skill-output.schema.json'];
      return {
        skill:skill.path,
        priority:highRisk?'P1':missingOutput?'P2':'P3',
        sideEffects:skill.sideEffects,
        approvalRequired:skill.approvalRequired,
        candidateContracts,
        contractVerified:false,
        fixtureVerified:false,
        migrationStatus:'pending',
        requiredEvidence:[
          'Record canonical SHA-256 and exact typed output contract',
          'Add positive, negative, and adversarial behavioral fixtures',
          ...(highRisk?['Verify permissions, retries, idempotency, cancellation, and rollback']:[]),
          'Run fixture and pin SHA-256 of tracked test file',
          'Confirm no semantic regression and regenerate lockfile if skill changed',
        ],
      };
    }).sort((a,b)=>a.priority.localeCompare(b.priority)||a.skill.localeCompare(b.skill)),
  };
}
if(process.argv[1]?.endsWith('generate-skill-output-migration-backlog.mjs')) {
  const inventory=await inventorySkills();
  process.stdout.write(JSON.stringify(buildMigrationBacklog(inventory),null,2)+'\n');
}
