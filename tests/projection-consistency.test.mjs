import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const REPO_ROOT = process.cwd();

// ── Invariant 1: consumer-facing bundle projection has 251 skills ──────────
test('bundle projection contains 251 skills', () => {
  const result = spawnSync('node', ['.agents/skills/platform/validate-skills.mjs'], {
    encoding: 'utf8',
  });
  assert.equal(result.status, 0, `validate-skills failed: ${result.stderr || result.stdout}`);
  const payload = JSON.parse(result.stdout);
  assert.equal(payload.skills, 251, `Expected 251 bundle skills, got ${payload.skills}`);
  assert.strictEqual(payload.errors.length, 0, `Unexpected errors: ${JSON.stringify(payload.errors)}`);
  // Wave-0 contract (see skill-promoter): validator warnings are advisory — they block
  // promotion of a skill, never the general gate. Only known advisory categories pass here.
  const advisoryWarningPatterns = [
    /^[^:]+: (?:medium|high) risk skill has no behavioral-fixtures directory$/,
    /^[^:]+: write-code skill marked low risk$/,
    /^[^:]+\/[^:]+: duplicate capability overlap [\d.]+ over shared capabilities \[[^\]]*\]$/,
  ];
  const unexpectedWarnings = payload.warnings.filter((w) => !advisoryWarningPatterns.some((p) => p.test(w)));
  assert.deepStrictEqual(unexpectedWarnings, [], `Unexpected warning categories: ${JSON.stringify(unexpectedWarnings)}`);
});

// ── Invariant 2: repo-facing discovery count is 263 repo / 251 bundle ──────
test('repo-facing discovery count semantics', () => {
  const result = spawnSync('node', ['.agents/skills/platform/audit-semantics.mjs'], {
    encoding: 'utf8',
    cwd: REPO_ROOT,
  });
  assert.equal(result.status, 0, `audit-semantics failed: ${result.stderr || result.stdout}`);
  const payload = JSON.parse(result.stdout);
  assert.equal(payload.skills, 263, `Expected 263 repo skills, got ${payload.skills}`);
  assert.strictEqual(payload.errors.length, 0, `Unexpected errors: ${JSON.stringify(payload.errors)}`);
});

// ── Invariant 3: generated artifacts agree on skill identities/counts ───────
test('generated artifacts agree on projected skill counts', () => {
  // Check CATALOG.md skill count
  const catalogPath = path.join(REPO_ROOT, 'CATALOG.md');
  const catalogContent = fs.readFileSync(catalogPath, 'utf8');
  const catalogSkillCount = (catalogContent.match(/\| \[.*\]\(.*\) \|/g) || []).length;
  assert.ok(
    catalogSkillCount > 0,
    'CATALOG.md should contain skill entries'
  );

  // Check llms.txt skill count
  const llmsPath = path.join(REPO_ROOT, 'llms.txt');
  const llmsContent = fs.readFileSync(llmsPath, 'utf8');
  const llmsSkillCount = (llmsContent.match(/^- \[.*\]\(.*\) — /gm) || []).length;
  assert.ok(
    llmsSkillCount > 0,
    'llms.txt should contain skill entries'
  );

  // Check .claude-plugin/marketplace.json skill count
  const marketplacePath = path.join(REPO_ROOT, '.claude-plugin', 'marketplace.json');
  const marketplaceContent = fs.readFileSync(marketplacePath, 'utf8');
  const marketplace = JSON.parse(marketplaceContent);
  const totalMarketplaceSkills = Object.values(marketplace.plugins || {}).reduce(
    (sum, plugin) => sum + (plugin.skills ? plugin.skills.length : 0),
    0
  );
  assert.ok(
    totalMarketplaceSkills > 0,
    '.claude-plugin/marketplace.json should contain plugin skills'
  );

  // Check site/src/skills.json skill count
  const siteSkillsPath = path.join(REPO_ROOT, 'site', 'src', 'skills.json');
  let siteSkillCount = 0;
  if (fs.existsSync(siteSkillsPath)) {
    const siteSkillsContent = fs.readFileSync(siteSkillsPath, 'utf8');
    const siteSkills = JSON.parse(siteSkillsContent);
    siteSkillCount = siteSkills.totalSkills || 0;
  }
  assert.ok(
    siteSkillCount > 0,
    'site/src/skills.json should contain totalSkills'
  );

  // All counts should be consistent: 251 bundle skills (excluding platform)
  const counts = [catalogSkillCount, llmsSkillCount, totalMarketplaceSkills, siteSkillCount];
  const allBundle = counts.every(c => c === 251);
  assert.ok(
    allBundle,
    `All artifact counts should be 251 bundle skills. Got: catalog=${catalogSkillCount}, llms=${llmsSkillCount}, marketplace=${totalMarketplaceSkills}, site=${siteSkillCount}`
  );
});

// ── Invariant 4: delivery agent cards trustTier aligned to source ("3") ────
test('delivery agent cards have trustTier aligned to source', () => {
  const cardsDir = path.join(REPO_ROOT, '.agents/skills/platform/agent-cards');
  const cardFiles = [
    'delivery-code-review.json',
    'delivery-review-pr.json',
  ];

  for (const cardFile of cardFiles) {
    const cardPath = path.join(cardsDir, cardFile);
    assert.ok(
      fs.existsSync(cardPath),
      `${cardFile} should exist in agent-cards directory`
    );
    const card = JSON.parse(fs.readFileSync(cardPath, 'utf8'));
    const trustTier = card.skills[0]?.parameters?.trustTier;
    assert.strictEqual(
      trustTier,
      '3',
      `${cardFile} should have trustTier "3" (aligned to source), got "${trustTier}"`
    );
  }
});

// ── Invariant 5: bundle content excludes .agents/skills/platform/** ─────────
test('bundle projection excludes platform infrastructure as skill content', () => {
  const result = spawnSync('node', ['.agents/skills/platform/validate-skills.mjs'], {
    encoding: 'utf8',
  });
  assert.equal(result.status, 0, `validate-skills failed: ${result.stderr || result.stdout}`);
  const payload = JSON.parse(result.stdout);
  // The validated skills should not include any from .agents/skills/platform/**
  // This is implicitly validated by the count being 251 (bundle) vs 263 (repo)
  // where the 12-skill difference is platform/infra
  assert.equal(payload.skills, 251, 'Bundle projection must be 251 skills excluding platform');
});