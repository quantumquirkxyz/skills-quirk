#!/usr/bin/env node
// Read-only bridge for canonical workflow artifacts. Never publishes or edits
// canonical files. Usage: node scripts/render-lifecycle-artifact.mjs input.json
// --title "Review" --summary "Review complete" --surface pr
import {readFile} from 'node:fs/promises';
import {normalizeLifecycleArtifact} from './normalize-skill-artifact.mjs';
import {validateSkillOutput,renderSkillOutput} from './render-skill-output.mjs';

export function renderLifecycleArtifact(artifact, {title,summary,surface='file',validation=[],nextActions=[]}={}) {
  const presentation=normalizeLifecycleArtifact(artifact,{title,summary,validation,nextActions});
  validateSkillOutput(presentation);
  return {presentation,markdown:renderSkillOutput(presentation,surface)};
}
export function parseArgs(argv) {
  const opts={};
  let input;
  for (let i=0;i<argv.length;i++) {
    const arg=argv[i];
    if (!arg.startsWith('--') && !input) {input=arg;continue;}
    if (!['--title','--summary','--surface','--validation','--next-actions'].includes(arg) || i+1>=argv.length) throw new Error('Invalid CLI argument: '+arg);
    const key=arg.slice(2);
    if (key in opts) throw new Error('Duplicate argument: '+arg);
    opts[key]=argv[++i];
  }
  if (!input || !opts.title || !opts.summary) throw new Error('Usage: render-lifecycle-artifact.mjs input.json --title TITLE --summary SUMMARY [--surface file|issue|pr|comment] [--validation checks.json] [--next-actions actions.json]');
  return {input,opts};
}
export async function runCli(argv) {
  const {input,opts}=parseArgs(argv);
  const artifact=JSON.parse(await readFile(input,'utf8'));
  const validation=opts.validation ? JSON.parse(await readFile(opts.validation,'utf8')) : [];
  const nextActions=opts['next-actions'] ? JSON.parse(await readFile(opts['next-actions'],'utf8')) : [];
  return renderLifecycleArtifact(artifact,{title:opts.title,summary:opts.summary,surface:opts.surface??'file',validation,nextActions}).markdown;
}
if (process.argv[1]?.endsWith('render-lifecycle-artifact.mjs')) {
  try {process.stdout.write(await runCli(process.argv.slice(2)));}
  catch (error) {process.stderr.write('Artifact rendering failed: '+error.message+'\n');process.exitCode=1;}
}
