import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';

const REPO_ROOT = process.cwd();
const GENERATE_SCRIPT = path.join(REPO_ROOT, 'scripts', 'generate-site-data.mjs');
const SKILLS_JSON = path.join(REPO_ROOT, 'site', 'src', 'skills.json');

async function runGenerate(args = []) {
  return new Promise((resolve) => {
    const child = spawn(process.execPath, [GENERATE_SCRIPT, ...args], {
      cwd: REPO_ROOT,
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (chunk) => { stdout += chunk; });
    child.stderr.on('data', (chunk) => { stderr += chunk; });
    child.on('close', (code) => {
      resolve({ code, stdout, stderr });
    });
  });
}

test('drift check passes when site/src/skills.json is up to date', async () => {
  const { code, stdout, stderr } = await runGenerate(['--check']);
  assert.equal(code, 0, `Drift check should pass when data is up to date, got code ${code}\n${stdout}\n${stderr}`);
});

test('drift check fails when site/src/skills.json is stale (totalSkills mismatch)', async () => {
  // Backup the current skills.json
  const original = await fs.readFile(SKILLS_JSON, 'utf8');

  // Write a stale version
  const d = JSON.parse(original);
  d.totalSkills = 99;
  await fs.writeFile(SKILLS_JSON, JSON.stringify(d, null, 2) + '\n');

  try {
    const { code } = await runGenerate(['--check']);
    assert.equal(code, 1, `Drift check should fail when data is stale, got code ${code}`);
  } finally {
    // Restore the original
    await fs.writeFile(SKILLS_JSON, original, 'utf8');
  }
});

test('drift check fails when site/src/skills.json has extra skills', async () => {
  const original = await fs.readFile(SKILLS_JSON, 'utf8');

  try {
    // Add a fake extra skill to the existing data
    const d = JSON.parse(original);
    d.skills.push({
      name: 'fake-skill',
      category: 'test',
      description: 'a fake skill',
      version: '1.0.0',
      maturity: 'stable',
      risk: 'low',
      trustTier: '1',
      capabilities: [],
      sideEffects: [],
      path: 'fake/path',
    });
    await fs.writeFile(SKILLS_JSON, JSON.stringify(d, null, 2) + '\n');

    const { code } = await runGenerate(['--check']);
    assert.equal(code, 1, `Drift check should fail when there are extra skills, got code ${code}`);
  } finally {
    await fs.writeFile(SKILLS_JSON, original, 'utf8');
  }
});

test('drift check passes when only --write is used (no drift)', async () => {
  const { code } = await runGenerate(['--write']);
  assert.equal(code, 0, `--write should succeed, got code ${code}`);
});