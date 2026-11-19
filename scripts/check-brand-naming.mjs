#!/usr/bin/env node
// Enforce current public branding in tracked text sources. Historical Git
// commit messages are deliberately out of scope.
import {execFileSync} from 'node:child_process';
import {readFileSync} from 'node:fs';

const forbidden = /\bqquirk\b/i;
const tracked = execFileSync('git',['ls-files','-z'],{encoding:'buffer'})
  .toString('utf8').split('\0').filter(Boolean);
const matches=[];
for (const path of tracked) {
  let data;
  try {data=readFileSync(path);} catch (error) {
    if (error.code==='ENOENT') continue;
    throw error;
  }
  if (data.includes(0)) continue; // Binary assets are not public-facing copy.
  const text=data.toString('utf8');
  if (text.includes('\uFFFD')) continue;
  for (const [i,line] of text.split(/\r?\n/).entries()) {
    if (forbidden.test(line)) matches.push(path+':'+(i+1));
  }
}
if (matches.length) {
  process.stderr.write('Legacy brand references found:\n'+matches.join('\n')+'\n');
  process.exitCode=1;
} else {
  process.stdout.write('Brand naming check passed across '+tracked.length+' tracked files.\n');
}
