import test from 'node:test';
import assert from 'node:assert/strict';
import { scoreSkill } from '../.agents/skills/platform/quality-scorer.mjs';
import { scoreSkill as evalScoreSkill } from '../.agents/skills/platform/scripts/evaluate-skills-by-domain.mjs';

const REPO_ROOT = process.cwd();

test('total normalizes from rawTotal 105 to /100', async () => {
  const result = await scoreSkill('.agents/skills/skill-dev/skill-creator');
  // rawTotal of 105 should normalize to total of 100
  assert.strictEqual(result.maxRawScore, 105, 'maxRawScore should be 105');
  // When rawTotal equals maxRawScore (105), total should be 100
  // With the skill-creator scoring 85 raw, total should be round(85 * 100 / 105) = 81
  assert(Number.isInteger(result.total), 'total should be an integer');
  assert(result.total >= 0 && result.total <= 100, `total should be in [0,100], got ${result.total}`);
});

test('rawTotal and maxRawScore are preserved in output', async () => {
  const result = await scoreSkill('.agents/skills/skill-dev/skill-creator');
  assert.strictEqual(result.rawTotal, 85, `rawTotal should be 85, got ${result.rawTotal}`);
  assert.strictEqual(result.maxRawScore, 105, `maxRawScore should be 105`);
  // Verify normalization: 85 * 100 / 105 = 80.95... -> 81
  assert.strictEqual(result.total, 81, `total should be 81 (85 * 100 / 105 rounded), got ${result.total}`);
});

test('total 105 raw normalizes to 100', async () => {
  // Create a skill with maximal scores across all 13 dimensions
  // We'll verify the normalization factor by checking the ratio
  const result = await scoreSkill('.agents/skills/skill-dev/skill-creator');
  // rawTotal max is 105, total should be <= 100
  assert(result.total <= 100, `total should never exceed 100, got ${result.total}`);
  assert(result.rawTotal <= 105, `rawTotal should never exceed 105, got ${result.rawTotal}`);
  // Verify the scaling: total / rawTotal ≈ 100 / 105
  const ratio = result.total / result.rawTotal;
  assert(Math.abs(ratio - 100 / 105) < 0.01, `ratio should be ~${100/105}, got ${ratio}`);
});

test('grade based on normalized total /100', async () => {
  const result = await scoreSkill('.agents/skills/skill-dev/skill-creator');
  // score 81 should give grade B (>= 80)
  assert.strictEqual(result.grade, 'B', `grade should be B for total 81, got ${result.grade}`);
  assert.strictEqual(result.tier, 'BASIC', `tier should be BASIC for total 81, got ${result.tier}`);
});

test('JSON output includes all required fields', async () => {
  const result = await scoreSkill('.agents/skills/skill-dev/skill-creator', { json: true });
  // Note: the --json flag is handled by the CLI, but the scoreSkill function
  // always returns a plain object. Test the object shape directly.
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

  // Both should produce the same total (normalized /100)
  assert.strictEqual(directResult.total, evalResult.total,
    `totals should match: direct=${directResult.total}, eval=${evalResult.total}`);

  // Both should produce the same grade
  assert.strictEqual(directResult.grade, evalResult.grade,
    `grades should match: direct=${directResult.grade}, eval=${evalResult.grade}`);

  // Both should produce the same tier
  assert.strictEqual(directResult.tier, evalResult.tier,
    `tiers should match: direct=${directResult.tier}, eval=${evalResult.tier}`);

  // Both should have the same rawTotal and maxRawScore
  assert.strictEqual(directResult.rawTotal, evalResult.rawTotal,
    `rawTotal should match: direct=${directResult.rawTotal}, eval=${evalResult.rawTotal}`);
  assert.strictEqual(directResult.maxRawScore, evalResult.maxRawScore,
    `maxRawScore should match: direct=${directResult.maxRawScore}, eval=${evalResult.maxRawScore}`);

  // Scores should be identical
  for (const [key, value] of Object.entries(directResult.scores)) {
    assert.strictEqual(value, evalResult.scores[key],
      `score.${key} should match between direct and eval`);
  }
});

test('minimum-score filter works with normalized total', async () => {
  const result = await scoreSkill('.agents/skills/skill-dev/skill-creator');
  // total of 81 should pass a minimum-score of 60
  assert(result.total >= 60, `total ${result.total} should pass minimum-score 60`);
  // total of 50 would fail minimum-score 60
  // We can verify the minScore logic by checking the scoreSkill return
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