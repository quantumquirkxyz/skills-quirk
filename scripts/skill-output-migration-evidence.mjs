import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {resolve} from 'node:path';

// Evidence is bound to the exact canonical skill bytes and a fixture's bytes.
// Never treat a declaration or schema reference as proof of migration.
export function verifyMigrationEvidence(inventory,manifest) {
  if (!inventory || !Array.isArray(inventory.skills)) throw new Error('Invalid inventory');
  if (!manifest || manifest.schemaVersion!=='1.0' || !Array.isArray(manifest.entries)) throw new Error('Invalid evidence manifest');
  const expected=new Set(inventory.skills.map(s=>s.path));
  const seen=new Set();
  const verified=new Set();
  const problems=[];
  for(const entry of manifest.entries) {
    if(!entry || typeof entry.path!=='string' || !expected.has(entry.path)) {
      problems.push('Unknown skill evidence path: '+String(entry?.path));continue;
    }
    if(seen.has(entry.path)){problems.push('Duplicate skill evidence: '+entry.path);continue;}
    seen.add(entry.path);
    if(!/^[a-f0-9]{64}$/.test(entry.skillSha256??'')) problems.push('Invalid skill digest: '+entry.path);
    if(!/^[a-f0-9]{64}$/.test(entry.fixtureSha256??'')) problems.push('Invalid fixture digest: '+entry.path);
    if(typeof entry.fixturePath!=='string' || !entry.fixturePath.startsWith('tests/')) problems.push('Missing tracked test fixture: '+entry.path);
    if(typeof entry.contract!=='string' || !entry.contract.trim()) problems.push('Missing contract: '+entry.path);
    if(entry.result!=='passed') problems.push('Fixture not passed: '+entry.path);
    if(!problems.some(x=>x.endsWith(': '+entry.path))) verified.add(entry.path);
  }
  return {verified,problems,missing:inventory.skills.filter(x=>!verified.has(x.path)).map(x=>x.path)};
}
const digest=buffer=>createHash('sha256').update(buffer).digest('hex');
export async function verifyMigrationEvidenceFiles(inventory,manifest,{root='.'}={}) {
  const report=verifyMigrationEvidence(inventory,manifest);
  for(const entry of manifest.entries) {
    if(!report.verified.has(entry.path)) continue;
    try {
      for(const [path,expected] of [[entry.path,entry.skillSha256],[entry.fixturePath,entry.fixtureSha256]]) {
        const full=resolve(root,path);
        if(!full.startsWith(resolve(root)+'/')) throw new Error('Path escapes repository');
        const actual=digest(await readFile(full));
        if(actual!==expected) throw new Error('Digest mismatch: '+path);
      }
    } catch(error) {
      report.verified.delete(entry.path);
      report.problems.push(entry.path+': '+error.message);
    }
  }
  report.missing=inventory.skills.filter(x=>!report.verified.has(x.path)).map(x=>x.path);
  return {verified:[...report.verified].sort(),problems:report.problems,missing:report.missing};
}
