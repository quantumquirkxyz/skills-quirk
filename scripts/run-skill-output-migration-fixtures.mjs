#!/usr/bin/env node
import {readFile,realpath} from 'node:fs/promises';
import {resolve} from 'node:path';
import {spawn} from 'node:child_process';
import {inventorySkills} from './skill-output-inventory.mjs';
import {verifyMigrationEvidenceFiles} from './skill-output-migration-evidence.mjs';

// Executes only digest-pinned .test.mjs fixtures, never arbitrary manifest commands.
// This is a separate execution gate from evidence-file integrity checks.
export async function runMigrationFixtures(manifest,{root='.',timeoutMs=30000,runner=process.execPath}={}) {
  if(!Number.isSafeInteger(timeoutMs)||timeoutMs<1||timeoutMs>300000) throw new Error('Invalid fixture timeout');
  const inventory=await inventorySkills(root+'/.agents/skills',{base:root});
  const report=await verifyMigrationEvidenceFiles(inventory,manifest,{root});
  if(report.problems.length || report.missing.length) {
    return {passed:false,verified:report.verified.length,problems:report.problems,missing:report.missing,results:[]};
  }
  const fixtures=[...new Set(manifest.entries.map(e=>e.fixturePath))].sort();
  const results=[];
  for(const path of fixtures) {
    if(!/^tests\/[A-Za-z0-9_./-]+\.test\.mjs$/.test(path)||path.split('/').includes('..')) {
      results.push({path,passed:false,reason:'Fixture must be a tracked .test.mjs file'});continue;
    }
    try {
      const realRoot=await realpath(root);
      const realFixture=await realpath(resolve(root,path));
      if(!realFixture.startsWith(realRoot+'/')) throw new Error('Fixture symlink escapes repository');
    } catch(error) {
      results.push({path,passed:false,reason:error.message});continue;
    }
    const result=await new Promise(resolve=>{
      const child=spawn(runner,['--test',path],{cwd:root,stdio:'ignore',shell:false});
      let settled=false;
      const timer=setTimeout(()=>{child.kill('SIGKILL');},timeoutMs);
      child.once('error',error=>{if(!settled){settled=true;clearTimeout(timer);resolve({path,passed:false,reason:error.message});}});
      child.once('close',(code,signal)=>{if(!settled){settled=true;clearTimeout(timer);resolve({path,passed:code===0&&!signal,exitCode:code,signal});}});
    });
    results.push(result);
  }
  return {passed:results.every(x=>x.passed),verified:report.verified.length,problems:[],missing:[],results};
}
if(process.argv[1]?.endsWith('run-skill-output-migration-fixtures.mjs')) {
  try {
    const file=process.argv[2];
    if(!file) throw new Error('Usage: run-skill-output-migration-fixtures.mjs evidence.json');
    const report=await runMigrationFixtures(JSON.parse(await readFile(file,'utf8')));
    process.stdout.write(JSON.stringify(report,null,2)+'\n');
    if(!report.passed) process.exitCode=1;
  } catch(error) {process.stderr.write(error.message+'\n');process.exitCode=1;}
}
