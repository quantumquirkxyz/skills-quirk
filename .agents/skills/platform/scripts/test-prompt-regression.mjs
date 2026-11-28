#!/usr/bin/env node
/** Compare a versioned prompt with its canonical golden text, offline. */
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_ROOT = path.resolve(SCRIPT_DIR, '../../../../');
const VERSION_RE = /^v[0-9]+$/;
const NAME_RE = /^[a-z0-9][a-z0-9-]*$/;

function validatePart(value, label, pattern) {
  if (typeof value !== 'string' || !pattern.test(value)) throw new Error(`Invalid ${label}`);
}
function normalize(text) { return text.replace(/\r\n?/g, '\n'); }
function hash(text) { return crypto.createHash('sha256').update(text).digest('hex'); }

export function pathsFor(root, skill, version = 'v2') {
  validatePart(skill, 'skill name', NAME_RE);
  validatePart(version, 'version', VERSION_RE);
  return {
    prompt: path.join(root, '.agents', 'skills', 'prompts', skill, `${version}.md`),
    golden: path.join(root, '.agents', 'skills', 'platform', 'golden', `${skill}-${version}.md`),
  };
}

export async function comparePrompt({ root = DEFAULT_ROOT, skill, version = 'v2' }) {
  const paths = pathsFor(path.resolve(root), skill, version);
  let golden;
  try { golden = normalize(await fs.readFile(paths.golden, 'utf8')); }
  catch (error) { if (error.code === 'ENOENT') return { skill, version, status: 'no-golden', message: 'No golden prompt file found' }; throw error; }
  let current;
  try { current = normalize(await fs.readFile(paths.prompt, 'utf8')); }
  catch (error) { if (error.code === 'ENOENT') return { skill, version, status: 'no-prompt', message: 'No prompt file found' }; throw error; }
  return {
    skill, version, status: current === golden ? 'pass' : 'fail',
    expectedBytes: Buffer.byteLength(golden), actualBytes: Buffer.byteLength(current),
    expectedSha256: hash(golden), actualSha256: hash(current),
  };
}

export async function main(argv = process.argv.slice(2), io = console) {
  const json = argv.includes('--json');
  const args = argv.filter((arg) => arg !== '--json');
  if (args.length < 1 || args.length > 2 || args.includes('--help')) {
    io.error('Usage: node test-prompt-regression.mjs <skill-name> [version] [--json]');
    return 2;
  }
  try {
    const result = await comparePrompt({ skill: args[0], version: args[1] || 'v2' });
    if (json) io.log(JSON.stringify(result));
    else io.log(`Prompt Regression Test: ${result.skill}/${result.version}\nStatus: ${result.status.toUpperCase()}`);
    return result.status === 'pass' ? 0 : 1;
  } catch (error) {
    if (json) io.log(JSON.stringify({ status: 'error', message: error.message }));
    else io.error(`Error: ${error.message}`);
    return 2;
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main().then((code) => { process.exitCode = code; });
