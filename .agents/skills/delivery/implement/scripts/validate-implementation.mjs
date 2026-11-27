#!/usr/bin/env node
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import schema from '../../../platform/schemas/implement-schema.json' with { type: 'json' };
import { validateJson } from '../../../platform/json-schema-validator.mjs';

const [artifactFile, expectedBranch] = process.argv.slice(2);
if (!artifactFile || !expectedBranch) {
  console.error('Usage: validate-implementation.mjs <artifact.json> <branch>');
  process.exit(2);
}

let artifact;
try { artifact = JSON.parse(fs.readFileSync(artifactFile, 'utf8')); }
catch (error) { console.error(`FAIL: artifact is not valid JSON: ${error.message}`); process.exit(1); }

const errors = validateJson(schema, artifact);
if (errors.length) { console.error(`FAIL: canonical schema validation failed: ${errors.join('; ')}`); process.exit(1); }

try { execFileSync('git', ['cat-file', '-e', `${artifact.commitSha}^{commit}`], { stdio: 'ignore' }); }
catch { console.error(`FAIL: commitSha does not identify an existing commit: ${artifact.commitSha}`); process.exit(1); }

const branch = execFileSync('git', ['branch', '--show-current'], { encoding: 'utf8' }).trim();
if (branch !== expectedBranch || artifact.branch !== expectedBranch) {
  console.error(`FAIL: branch mismatch (current=${branch}, expected=${expectedBranch}, artifact=${artifact.branch})`);
  process.exit(1);
}

console.log('PASS: artifact is schema-valid, references a real commit, and has consistent gate and branch state');
