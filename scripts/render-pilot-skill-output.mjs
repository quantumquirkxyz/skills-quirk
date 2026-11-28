#!/usr/bin/env node
// Read-only CLI: node scripts/render-pilot-skill-output.mjs SKILL artifact.json
// --title "..." --summary "..." [--surface file|issue|pr|comment|json]
// --validation validation.json [--next-actions actions.json]
import {readFile} from 'node:fs/promises';
import {presentPilotArtifact} from './pilot-skill-output.mjs';

export function parsePilotArgs(argv) {
  if(argv.length<2) throw new Error('Expected skill name and canonical artifact JSON path');
  const [skill,input,...rest]=argv;
  if(!skill||!input||skill.startsWith('--')||input.startsWith('--')) throw new Error('Expected skill and input');
  const options={};
  const allowed=new Set(['title','summary','surface','validation','next-actions']);
  for(let i=0;i<rest.length;i+=2) {
    const flag=rest[i];
    if(!flag?.startsWith('--')||!allowed.has(flag.slice(2))||!rest[i+1]||rest[i+1].startsWith('--')) throw new Error('Invalid CLI option: '+flag);
    const key=flag.slice(2);
    if(key in options) throw new Error('Duplicate CLI option: '+flag);
    options[key]=rest[i+1];
  }
  if(!options.title?.trim()||!options.summary?.trim()) throw new Error('Title and summary required');
  return {skill,input,options};
}
export async function runPilotCli(argv) {
  const {skill,input,options}=parsePilotArgs(argv);
  const artifact=JSON.parse(await readFile(input,'utf8'));
  const validation=options.validation?JSON.parse(await readFile(options.validation,'utf8')):[];
  const nextActions=options['next-actions']?JSON.parse(await readFile(options['next-actions'],'utf8')):[];
  const result=presentPilotArtifact(skill,artifact,{
    title:options.title,summary:options.summary,surface:options.surface??'file',
    validation,nextActions,
  });
  return result.json??result.markdown;
}
if(process.argv[1]?.endsWith('render-pilot-skill-output.mjs')) {
  try {process.stdout.write(await runPilotCli(process.argv.slice(2)));}
  catch(error){process.stderr.write('Pilot rendering failed: '+error.message+'\n');process.exitCode=1;}
}
