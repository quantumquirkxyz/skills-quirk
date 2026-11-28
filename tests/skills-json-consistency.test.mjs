import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

const REPO_ROOT = process.cwd();
const GENERATE_SCRIPT = path.join(REPO_ROOT, 'scripts', 'generate-site-data.mjs');
const SKILLS_JSON = path.join(REPO_ROOT, 'site', 'src', 'skills.json');

async function runGenerate(args = [], cwd = REPO_ROOT) {
  return new Promise((resolve) => {
    const child = spawn(process.execPath, [GENERATE_SCRIPT, ...args], {
      cwd,
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

async function withTemporarySiteData(mutator, args = ['--check']) {
  const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'skills-json-consistency-'));
  try {
    await fs.mkdir(path.join(tempRoot, 'site', 'src'), { recursive: true });
    await fs.symlink(path.join(REPO_ROOT, '.agents'), path.join(tempRoot, '.agents'), 'dir');
    const data = JSON.parse(await fs.readFile(SKILLS_JSON, 'utf8'));
    await mutator(data);
    await fs.writeFile(
      path.join(tempRoot, 'site', 'src', 'skills.json'),
      JSON.stringify(data, null, 2) + '\n',
    );
    return await runGenerate(args, tempRoot);
  } finally {
    await fs.rm(tempRoot, { recursive: true, force: true });
  }
}

test('drift check passes when site/src/skills.json is up to date', async () => {
  const { code, stdout, stderr } = await runGenerate(['--check']);
  assert.equal(code, 0, `Drift check should pass when data is up to date, got code ${code}\n${stdout}\n${stderr}`);
});

test('drift check fails when site/src/skills.json has totalSkills mismatch', async () => {
  const { code } = await withTemporarySiteData((d) => { d.totalSkills = 99; });
  assert.equal(code, 1, `Drift check should fail on totalSkills mismatch, got code ${code}`);
});

test('drift check fails when site/src/skills.json has category mismatch', async () => {
  const { code } = await withTemporarySiteData((d) => {
    d.skills.find(s => s.name === 'accessibility').category = 'modified-category';
  });
  assert.equal(code, 1, `Drift check should fail on category mismatch, got code ${code}`);
});

test('drift check fails when site/src/skills.json has skill name mismatch', async () => {
  const { code } = await withTemporarySiteData((d) => {
    d.skills.find(s => s.name === 'accessibility').name = 'modified-skill';
  });
  assert.equal(code, 1, `Drift check should fail on skill name mismatch, got code ${code}`);
});

test('drift check fails when site/src/skills.json has description mismatch', async () => {
  const { code } = await withTemporarySiteData((d) => {
    d.skills.find(s => s.name === 'accessibility').description = 'modified description';
  });
  assert.equal(code, 1, `Drift check should fail on description mismatch, got code ${code}`);
});

test('drift check fails when site/src/skills.json has version mismatch', async () => {
  const { code } = await withTemporarySiteData((d) => {
    d.skills.find(s => s.name === 'accessibility').version = '99.99.99';
  });
  assert.equal(code, 1, `Drift check should fail on version mismatch, got code ${code}`);
});

test('drift check fails when site/src/skills.json has maturity mismatch', async () => {
  const { code } = await withTemporarySiteData((d) => {
    d.skills.find(s => s.name === 'accessibility').maturity = 'experimental';
  });
  assert.equal(code, 1, `Drift check should fail on maturity mismatch, got code ${code}`);
});

test('drift check fails when site/src/skills.json has risk mismatch', async () => {
  const { code } = await withTemporarySiteData((d) => {
    d.skills.find(s => s.name === 'accessibility').risk = 'high';
  });
  assert.equal(code, 1, `Drift check should fail on risk mismatch, got code ${code}`);
});

test('drift check fails when site/src/skills.json has trustTier mismatch', async () => {
  const { code } = await withTemporarySiteData((d) => {
    d.skills.find(s => s.name === 'accessibility').trustTier = '5';
  });
  assert.equal(code, 1, `Drift check should fail on trustTier mismatch, got code ${code}`);
});

test('drift check fails when site/src/skills.json has sideEffects mismatch', async () => {
  const { code } = await withTemporarySiteData((d) => {
    d.skills.find(s => s.name === 'accessibility').sideEffects = ['different-effect'];
  });
  assert.equal(code, 1, `Drift check should fail on sideEffects mismatch, got code ${code}`);
});

test('drift check fails when site/src/skills.json has capabilities mismatch', async () => {
  const { code } = await withTemporarySiteData((d) => {
    d.skills.find(s => s.name === 'accessibility').capabilities = ['different-capability'];
  });
  assert.equal(code, 1, `Drift check should fail on capabilities mismatch, got code ${code}`);
});

test('drift check fails when site/src/skills.json has path mismatch', async () => {
  const { code } = await withTemporarySiteData((d) => {
    d.skills.find(s => s.name === 'accessibility').path = '/modified/path';
  });
  assert.equal(code, 1, `Drift check should fail on path mismatch, got code ${code}`);
});

test('drift check fails when site/src/skills.json has extra skills', async () => {
  const { code } = await withTemporarySiteData((d) => {
    d.skills.push({
      name: 'fake-skill', category: 'test', description: 'a fake skill',
      version: '1.0.0', maturity: 'stable', risk: 'low', trustTier: '1',
      capabilities: [], sideEffects: [], path: 'fake/path',
    });
  });
  assert.equal(code, 1, `Drift check should fail on extra skills, got code ${code}`);
});

test('drift check passes when only --write is used (no drift)', async () => {
  const { code } = await withTemporarySiteData(() => {}, ['--write']);
  assert.equal(code, 0, `--write should succeed, got code ${code}`);
});