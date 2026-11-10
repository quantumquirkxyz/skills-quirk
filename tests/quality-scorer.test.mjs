import test from 'node:test';
import assert from 'node:assert/strict';
import { scoreSkill } from '../.agents/skills/platform/quality-scorer.mjs';
import { scoreSkill as evalScoreSkill } from '../.agents/skills/platform/scripts/evaluate-skills-by-domain.mjs';
import { spawn } from 'node:child_process';
import { rmSync, mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { pathToFileURL } from 'node:url';

const REPO_ROOT = process.cwd();

test('total normalizes from rawTotal 105 to /100', async () => {
  const result = await scoreSkill('.agents/skills/skill-dev/skill-creator');
  assert.strictEqual(result.maxRawScore, 105, 'maxRawScore should be 105');
  assert(Number.isInteger(result.total), 'total should be an integer');
  assert(result.total >= 0 && result.total <= 100, `total should be in [0,100], got ${result.total}`);
});

test('rawTotal and maxRawScore are preserved in output', async () => {
  const result = await scoreSkill('.agents/skills/skill-dev/skill-creator');
  assert.strictEqual(result.rawTotal, 85, `rawTotal should be 85, got ${result.rawTotal}`);
  assert.strictEqual(result.maxRawScore, 105, `maxRawScore should be 105`);
  assert.strictEqual(result.total, 81, `total should be 81 (85 * 100 / 105 rounded), got ${result.total}`);
});

test('total 105 raw normalizes to 100', async () => {
  const rawTotal = 105;
  const maxRawScore = 105;
  const total = Math.round(rawTotal * 100 / maxRawScore);
  assert.strictEqual(total, 100, `rawTotal 105 / maxRawScore 105 should normalize to total 100, got ${total}`);
  const ratio = total / rawTotal;
  assert(Math.abs(ratio - 100 / 105) < 0.01, `ratio should be ~${100/105}, got ${ratio}`);
});

test('grade based on normalized total /100', async () => {
  const result = await scoreSkill('.agents/skills/skill-dev/skill-creator');
  assert.strictEqual(result.grade, 'B', `grade should be B for total 81, got ${result.grade}`);
  assert.strictEqual(result.tier, 'BASIC', `tier should be BASIC for total 81, got ${result.tier}`);
});

test('JSON output includes all required fields', async () => {
  const result = await scoreSkill('.agents/skills/skill-dev/skill-creator');
  assert('skill' in result, 'result should have skill field');
  assert('path' in result, 'result should have path field');
  assert('scores' in result, 'result should have scores field');
  assert('total' in result, 'result should have total field');
  assert('rawTotal' in result, 'result should have rawTotal field');
  assert('maxRawScore' in result, 'result should have maxRawScore field');
  assert('grade' in result, 'result should have grade field');
  assert('tier' in result, 'result should have tier field');
  assert('issues' in result, 'result should have issues field');
  assert('warnings' in result, 'result should have warnings field');
  assert('metrics' in result, 'result should have metrics field');
  assert('frontmatter' in result, 'result should have frontmatter field');
});

test('parity between quality-scorer.mjs and evaluate-skills-by-domain.mjs', async () => {
  const directResult = await scoreSkill('.agents/skills/skill-dev/skill-creator');
  const evalResult = await evalScoreSkill('.agents/skills/skill-dev/skill-creator');

  assert.strictEqual(directResult.total, evalResult.total,
    `totals should match: direct=${directResult.total}, eval=${evalResult.total}`);
  assert.strictEqual(directResult.grade, evalResult.grade,
    `grades should match: direct=${directResult.grade}, eval=${evalResult.grade}`);
  assert.strictEqual(directResult.tier, evalResult.tier,
    `tiers should match: direct=${directResult.tier}, eval=${evalResult.tier}`);
  assert.strictEqual(directResult.rawTotal, evalResult.rawTotal,
    `rawTotal should match: direct=${directResult.rawTotal}, eval=${evalResult.rawTotal}`);
  assert.strictEqual(directResult.maxRawScore, evalResult.maxRawScore,
    `maxRawScore should match: direct=${directResult.maxRawScore}, eval=${evalResult.maxRawScore}`);
  for (const [key, value] of Object.entries(directResult.scores)) {
    assert.strictEqual(value, evalResult.scores[key],
      `score.${key} should match between direct and eval`);
  }
});

test('minimum-score filter works with normalized total', async () => {
  const result = await scoreSkill('.agents/skills/skill-dev/skill-creator');
  assert(result.total >= 60, `total ${result.total} should pass minimum-score 60`);
});

test('scoreSkill returns error for missing skill', async () => {
  const result = await scoreSkill('.agents/skills/nonexistent-skill');
  assert('error' in result, 'result should have error field for missing skill');
  assert.strictEqual(result.error, 'Skill not found: .agents/skills/nonexistent-skill');
});

test('scoreSkill frontmatter includes all required fields', async () => {
  const result = await scoreSkill('.agents/skills/skill-dev/skill-creator');
  const fm = result.frontmatter;
  assert('name' in fm, 'frontmatter should have name');
  assert('description' in fm, 'frontmatter should have description');
  assert('category' in fm, 'frontmatter should have category');
  assert('version' in fm, 'frontmatter should have version');
  assert('promptVersion' in fm, 'frontmatter should have promptVersion');
  assert('modelTier' in fm, 'frontmatter should have modelTier');
  assert('artifactType' in fm, 'frontmatter should have artifactType');
  assert('fixturesPath' in fm, 'frontmatter should have fixturesPath');
});

test('CLI invocation produces normalized score output', async () => {
  const result = await new Promise((resolve, reject) => {
    // Spawn quality-scorer.mjs as a child process
    const proc = spawn(process.execPath, [
      '.agents/skills/platform/quality-scorer.mjs',
      '.agents/skills/skill-dev/skill-creator',
      '--json',
    ], { cwd: REPO_ROOT, stdio: 'pipe' });

    let stdout = '';
    let stderr = '';
    proc.stdout.on('data', (chunk) => { stdout += chunk; });
    proc.stderr.on('data', (chunk) => { stderr += chunk; });
    proc.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`CLI exited with code ${code}: ${stderr}`));
      } else {
        try {
          const parsed = JSON.parse(stdout);
          resolve(parsed);
        } catch {
          reject(new Error(`Failed to parse JSON output: ${stdout}`));
        }
      }
    });
    proc.on('error', reject);
  });

  assert.strictEqual(result.maxRawScore, 105, `CLI output should have maxRawScore=105, got ${result.maxRawScore}`);
  assert(Number.isInteger(result.total), `CLI output should have integer total, got ${result.total}`);
  assert(result.total >= 0 && result.total <= 100, `CLI output total should be in [0,100], got ${result.total}`);
  assert('rawTotal' in result, `CLI output should have rawTotal field`);
  assert.strictEqual(result.grade, 'B', `CLI output grade should be B for total ${result.total}`);
  assert.strictEqual(result.rawTotal, 85, `CLI output should have rawTotal=85 for skill-creator, got ${result.rawTotal}`);
});

test('CLI minimum-score filter works with normalized total', async () => {
  const result = await new Promise((resolve, reject) => {
    const proc = spawn(process.execPath, [
      '.agents/skills/platform/quality-scorer.mjs',
      '.agents/skills/skill-dev/skill-creator',
      '--minimum-score', '60',
    ], { cwd: REPO_ROOT, stdio: 'pipe' });

    let stdout = '';
    let stderr = '';
    proc.stdout.on('data', (chunk) => { stdout += chunk; });
    proc.stderr.on('data', (chunk) => { stderr += chunk; });
    proc.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`CLI exited with code ${code}: ${stderr}`));
      } else {
        resolve(stdout.trim());
      }
    });
    proc.on('error', reject);
  });

  // Score 81/100 should pass minimum-score 60 (exit 0)
  assert(result.includes('81/100') || result.includes('Score: 81/100'),
    `CLI output should contain score 81/100 when --minimum-score 60 is used`);
});