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

test('drift check fails when site/src/skills.json has totalSkills mismatch', async () => {
  const original = await fs.readFile(SKILLS_JSON, 'utf8');
  try {
    const d = JSON.parse(original);
    d.totalSkills = 99;
    await fs.writeFile(SKILLS_JSON, JSON.stringify(d, null, 2) + '\n');
    const { code } = await runGenerate(['--check']);
    assert.equal(code, 1, `Drift check should fail on totalSkills mismatch, got code ${code}`);
  } finally {
    await fs.writeFile(SKILLS_JSON, original, 'utf8');
  }
});

test('drift check fails when site/src/skills.json has category mismatch', async () => {
  const original = await fs.readFile(SKILLS_JSON, 'utf8');
  try {
    const d = JSON.parse(original);
    // Mutate a category
    const skill = d.skills.find(s => s.name === 'accessibility');
    if (skill) skill.category = 'modified-category';
    await fs.writeFile(SKILLS_JSON, JSON.stringify(d, null, 2) + '\n');
    const { code } = await runGenerate(['--check']);
    assert.equal(code, 1, `Drift check should fail on category mismatch, got code ${code}`);
  } finally {
    await fs.writeFile(SKILLS_JSON, original, 'utf8');
  }
});

test('drift check fails when site/src/skills.json has skill name mismatch', async () => {
  const original = await fs.readFile(SKILLS_JSON, 'utf8');
  try {
    const d = JSON.parse(original);
    const skill = d.skills.find(s => s.name === 'accessibility');
    if (skill) skill.name = 'modified-skill';
    await fs.writeFile(SKILLS_JSON, JSON.stringify(d, null, 2) + '\n');
    const { code } = await runGenerate(['--check']);
    assert.equal(code, 1, `Drift check should fail on skill name mismatch, got code ${code}`);
  } finally {
    await fs.writeFile(SKILLS_JSON, original, 'utf8');
  }
});

test('drift check fails when site/src/skills.json has description mismatch', async () => {
  const original = await fs.readFile(SKILLS_JSON, 'utf8');
  try {
    const d = JSON.parse(original);
    const skill = d.skills.find(s => s.name === 'accessibility');
    if (skill) skill.description = 'modified description';
    await fs.writeFile(SKILLS_JSON, JSON.stringify(d, null, 2) + '\n');
    const { code } = await runGenerate(['--check']);
    assert.equal(code, 1, `Drift check should fail on description mismatch, got code ${code}`);
  } finally {
    await fs.writeFile(SKILLS_JSON, original, 'utf8');
  }
});

test('drift check fails when site/src/skills.json has version mismatch', async () => {
  const original = await fs.readFile(SKILLS_JSON, 'utf8');
  try {
    const d = JSON.parse(original);
    const skill = d.skills.find(s => s.name === 'accessibility');
    if (skill) skill.version = '99.99.99';
    await fs.writeFile(SKILLS_JSON, JSON.stringify(d, null, 2) + '\n');
    const { code } = await runGenerate(['--check']);
    assert.equal(code, 1, `Drift check should fail on version mismatch, got code ${code}`);
  } finally {
    await fs.writeFile(SKILLS_JSON, original, 'utf8');
  }
});

test('drift check fails when site/src/skills.json has maturity mismatch', async () => {
  const original = await fs.readFile(SKILLS_JSON, 'utf8');
  try {
    const d = JSON.parse(original);
    const skill = d.skills.find(s => s.name === 'accessibility');
    if (skill) skill.maturity = 'experimental';
    await fs.writeFile(SKILLS_JSON, JSON.stringify(d, null, 2) + '\n');
    const { code } = await runGenerate(['--check']);
    assert.equal(code, 1, `Drift check should fail on maturity mismatch, got code ${code}`);
  } finally {
    await fs.writeFile(SKILLS_JSON, original, 'utf8');
  }
});

test('drift check fails when site/src/skills.json has risk mismatch', async () => {
  const original = await fs.readFile(SKILLS_JSON, 'utf8');
  try {
    const d = JSON.parse(original);
    const skill = d.skills.find(s => s.name === 'accessibility');
    if (skill) skill.risk = 'high';
    await fs.writeFile(SKILLS_JSON, JSON.stringify(d, null, 2) + '\n');
    const { code } = await runGenerate(['--check']);
    assert.equal(code, 1, `Drift check should fail on risk mismatch, got code ${code}`);
  } finally {
    await fs.writeFile(SKILLS_JSON, original, 'utf8');
  }
});

test('drift check fails when site/src/skills.json has trustTier mismatch', async () => {
  const original = await fs.readFile(SKILLS_JSON, 'utf8');
  try {
    const d = JSON.parse(original);
    const skill = d.skills.find(s => s.name === 'accessibility');
    if (skill) skill.trustTier = '5';
    await fs.writeFile(SKILLS_JSON, JSON.stringify(d, null, 2) + '\n');
    const { code } = await runGenerate(['--check']);
    assert.equal(code, 1, `Drift check should fail on trustTier mismatch, got code ${code}`);
  } finally {
    await fs.writeFile(SKILLS_JSON, original, 'utf8');
  }
});

test('drift check fails when site/src/skills.json has sideEffects mismatch', async () => {
  const original = await fs.readFile(SKILLS_JSON, 'utf8');
  try {
    const d = JSON.parse(original);
    const skill = d.skills.find(s => s.name === 'accessibility');
    if (skill) {
      // Replace sideEffects with different array
      skill.sideEffects = ['different-effect'];
    }
    await fs.writeFile(SKILLS_JSON, JSON.stringify(d, null, 2) + '\n');
    const { code } = await runGenerate(['--check']);
    assert.equal(code, 1, `Drift check should fail on sideEffects mismatch, got code ${code}`);
  } finally {
    await fs.writeFile(SKILLS_JSON, original, 'utf8');
  }
});

test('drift check fails when site/src/skills.json has capabilities mismatch', async () => {
  const original = await fs.readFile(SKILLS_JSON, 'utf8');
  try {
    const d = JSON.parse(original);
    const skill = d.skills.find(s => s.name === 'accessibility');
    if (skill) {
      skill.capabilities = ['different-capability'];
    }
    await fs.writeFile(SKILLS_JSON, JSON.stringify(d, null, 2) + '\n');
    const { code } = await runGenerate(['--check']);
    assert.equal(code, 1, `Drift check should fail on capabilities mismatch, got code ${code}`);
  } finally {
    await fs.writeFile(SKILLS_JSON, original, 'utf8');
  }
});

test('drift check fails when site/src/skills.json has path mismatch', async () => {
  const original = await fs.readFile(SKILLS_JSON, 'utf8');
  try {
    const d = JSON.parse(original);
    const skill = d.skills.find(s => s.name === 'accessibility');
    if (skill) skill.path = '/modified/path';
    await fs.writeFile(SKILLS_JSON, JSON.stringify(d, null, 2) + '\n');
    const { code } = await runGenerate(['--check']);
    assert.equal(code, 1, `Drift check should fail on path mismatch, got code ${code}`);
  } finally {
    await fs.writeFile(SKILLS_JSON, original, 'utf8');
  }
});

test('drift check fails when site/src/skills.json has extra skills', async () => {
  const original = await fs.readFile(SKILLS_JSON, 'utf8');
  try {
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
    assert.equal(code, 1, `Drift check should fail on extra skills, got code ${code}`);
  } finally {
    await fs.writeFile(SKILLS_JSON, original, 'utf8');
  }
});

test('drift check passes when only --write is used (no drift)', async () => {
  const { code } = await runGenerate(['--write']);
  assert.equal(code, 0, `--write should succeed, got code ${code}`);
});