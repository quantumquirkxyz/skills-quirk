#!/usr/bin/env node
// evaluate-skills-by-domain.mjs
// Evaluates all skills in a given category (or --all) against quality criteria
// and writes a domain report JSON.
// Usage: node evaluate-skills-by-domain.mjs --category <name> | --all

import fs from 'node:fs/promises';
import path from 'node:path';

import { scoreSkill } from '../quality-scorer.mjs';

const root = process.cwd();
const skillsRoot = path.join(root, '.agents', 'skills');
const reportDir = path.join(root, '.agents', 'skills', 'platform', 'artifacts', 'evaluation');

// ── Frontmatter parser (same as quality-scorer) ──────────────────────────────

function parseFrontmatter(text) {
  if (!text.startsWith('---')) return {};
  const end = text.indexOf('\n---', 3);
  if (end === -1) return {};
  const out = {};
  let active = null;
  for (const line of text.slice(4, end).split(/\r?\n/)) {
    const key = line.match(/^([A-Za-z][A-Za-z0-9-]*):\s*(.*)$/);
    if (key) {
      active = key[1];
      out[active] = key[2] === '' || key[2] === '[]' ? [] : key[2].replace(/^["']|["']$/g, '');
      continue;
    }
    const item = line.match(/^\s+-\s+(.+)$/);
    if (item && active) {
      if (!Array.isArray(out[active])) out[active] = [];
      out[active].push(item[1].replace(/^["']|["']$/g, ''));
    }
  }
  return out;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function wordCount(text) {
  return (text.match(/[A-Za-z0-9_'-]+/g) ?? []).length;
}

function countHeaders(text) {
  return (text.match(/^#{1,6}\s+.+$/gm) ?? []).length;
}

const VALID_MODEL_TIERS = ['reasoning', 'code', 'fast', 'router'];

async function countScriptLoc(skillDir) {
  let total = 0;
  try {
    const entries = await fs.readdir(skillDir, { withFileTypes: true });
    for (const e of entries) {
      if (e.isDirectory()) {
        const sub = await countScriptLoc(path.join(skillDir, e.name));
        total += sub;
      } else if (e.name.endsWith('.mjs') || e.name.endsWith('.js') || e.name.endsWith('.ts')) {
        try {
          const content = await fs.readFile(path.join(skillDir, e.name), 'utf8');
          total += content.split(/\r?\n/).length;
        } catch {}
      }
    }
  } catch {}
  return total;
}

// ── Domain evaluation ─────────────────────────────────────────────────────────

function buildRecommendations(skillResults) {
  const recommendations = [];
  let missingContract = 0;
  let missingProvenance = 0;
  let missingArtifact = 0;
  let missingCompletion = 0;
  let missingPromptVersion = 0;
  let missingModelTier = 0;
  let missingArtifactType = 0;
  let missingFixturesPath = 0;
  let lowScoreCount = 0;

  for (const r of skillResults) {
    if (r.error) continue;
    if (r.total < 60) lowScoreCount++;
    for (const issue of r.issues) {
      if (issue.includes('Contract')) missingContract++;
      if (issue.includes('Provenance')) missingProvenance++;
      if (issue.includes('Artifact') && !issue.includes('artifactType')) missingArtifact++;
      if (issue.includes('Completion')) missingCompletion++;
    }
    if (!r.frontmatter.promptVersion) missingPromptVersion++;
    if (!r.frontmatter.modelTier) missingModelTier++;
    if (!r.frontmatter.artifactType) missingArtifactType++;
    if (!r.frontmatter.fixturesPath) missingFixturesPath++;
  }

  if (missingContract > 0) {
    recommendations.push({
      priority: 'HIGH',
      dimension: 'Contract section',
      finding: `${missingContract} skill(s) missing Contract section`,
      action: 'Add "## Contract" section to SKILL.md describing caller obligations and guarantees.',
    });
  }
  if (missingProvenance > 0) {
    recommendations.push({
      priority: 'HIGH',
      dimension: 'Provenance section',
      finding: `${missingProvenance} skill(s) missing Provenance section`,
      action: 'Add "## Provenance" section documenting authorship, influences, and redesign status.',
    });
  }
  if (missingArtifact > 0) {
    recommendations.push({
      priority: 'HIGH',
      dimension: 'Artifact section',
      finding: `${missingArtifact} skill(s) missing Artifact section`,
      action: 'Add "## Artifact" section describing outputs, schemas, and handoff contracts.',
    });
  }
  if (missingCompletion > 0) {
    recommendations.push({
      priority: 'HIGH',
      dimension: 'Completion section',
      finding: `${missingCompletion} skill(s) missing Completion section`,
      action: 'Add "## Completion" section with explicit completion criteria and stop conditions.',
    });
  }
  if (missingPromptVersion > 0) {
    recommendations.push({
      priority: 'MEDIUM',
      dimension: 'promptVersion',
      finding: `${missingPromptVersion} skill(s) without promptVersion frontmatter`,
      action: 'Add promptVersion to frontmatter (e.g., promptVersion: 2) to enable regression tracking.',
    });
  }
  if (missingModelTier > 0) {
    recommendations.push({
      priority: 'MEDIUM',
      dimension: 'modelTier',
      finding: `${missingModelTier} skill(s) without modelTier frontmatter`,
      action: 'Add modelTier to frontmatter (reasoning|code|fast|router) aligned with trustTier.',
    });
  }
  if (missingArtifactType > 0) {
    recommendations.push({
      priority: 'MEDIUM',
      dimension: 'artifactType',
      finding: `${missingArtifactType} skill(s) without artifactType frontmatter`,
      action: 'Add artifactType to frontmatter to declare the primary output artifact shape.',
    });
  }
  if (missingFixturesPath > 0) {
    recommendations.push({
      priority: 'MEDIUM',
      dimension: 'fixturesPath',
      finding: `${missingFixturesPath} skill(s) without fixturesPath frontmatter`,
      action: 'Add fixturesPath pointing to behavioral fixtures for regression testing.',
    });
  }
  if (lowScoreCount > 0) {
    recommendations.push({
      priority: 'HIGH',
      dimension: 'overall quality',
      finding: `${lowScoreCount} skill(s) scored below 60/100`,
      action: 'Review low-scoring skills and address issues in body depth, sections, and frontmatter completeness.',
    });
  }

  return recommendations;
}

// ── Category discovery ────────────────────────────────────────────────────────

async function discoverSkillsForCategory(targetCategory) {
  const entries = await fs.readdir(skillsRoot, { withFileTypes: true });
  const skills = [];
  for (const e of entries) {
    if (!e.isDirectory()) continue;
    const categoryDir = path.join(skillsRoot, e.name);
    // Check if this directory itself is a skill (has SKILL.md directly)
    const directSkillMd = path.join(categoryDir, 'SKILL.md');
    try {
      await fs.access(directSkillMd);
      const text = await fs.readFile(directSkillMd, 'utf8');
      const fm = parseFrontmatter(text);
      if (targetCategory === 'all' || fm.category === targetCategory) {
        skills.push({ name: e.name, path: path.join('.agents', 'skills', e.name) });
      }
    } catch {
      // It's a category directory — enumerate sub-skills
      const subEntries = await fs.readdir(categoryDir, { withFileTypes: true });
      for (const sub of subEntries) {
        if (!sub.isDirectory()) continue;
        const subSkillMd = path.join(categoryDir, sub.name, 'SKILL.md');
        try {
          await fs.access(subSkillMd);
          const text = await fs.readFile(subSkillMd, 'utf8');
          const fm = parseFrontmatter(text);
          if (targetCategory === 'all' || fm.category === targetCategory) {
            skills.push({ name: `${e.name}/${sub.name}`, path: path.join('.agents', 'skills', e.name, sub.name) });
          }
        } catch {}
      }
    }
  }
  return skills;
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  const categoryArg = args.find(a => a.startsWith('--category='))?.split('=')[1]
    || args[args.indexOf('--category') + 1];
  const allFlag = args.includes('--all');

  if (!categoryArg && !allFlag) {
    console.error('Usage: node evaluate-skills-by-domain.mjs --category <name> | --all');
    process.exit(1);
  }

  const targetCategory = allFlag ? 'all' : categoryArg;
  console.error(`Evaluating skills in category: ${targetCategory}`);

  const discovered = await discoverSkillsForCategory(targetCategory);
  console.error(`Found ${discovered.length} skill(s)`);

  if (discovered.length === 0) {
    console.error('No skills found for the given category.');
    process.exit(1);
  }

  const skillResults = [];
  for (const s of discovered) {
    const result = await scoreSkill(s.path);
    skillResults.push(result);
  }

  const validResults = skillResults.filter(r => !r.error);
  const totalSkills = validResults.length;
  const avgScore = totalSkills > 0
    ? Math.round(validResults.reduce((a, r) => a + r.total, 0) / totalSkills)
    : 0;

  const gradeDistribution = {};
  for (const g of ['A', 'B', 'C', 'D', 'F']) {
    gradeDistribution[g] = validResults.filter(r => r.grade === g).length;
  }

  const skillsByScore = validResults
    .map(r => ({ skill: r.skill, path: r.path, score: r.total, grade: r.grade, tier: r.tier }))
    .sort((a, b) => a.score - b.score);

  const recommendations = buildRecommendations(skillResults);

  const report = {
    category: targetCategory,
    generatedAt: new Date().toISOString(),
    totalSkills,
    avgScore,
    gradeDistribution,
    skillsByScore,
    recommendations,
    details: validResults,
    errors: skillResults.filter(r => r.error).map(r => ({ skill: r.skill, error: r.error })),
  };

  await fs.mkdir(reportDir, { recursive: true });
  const reportFileName = `${targetCategory}-report.json`;
  const reportPath = path.join(reportDir, reportFileName);
  await fs.writeFile(reportPath, JSON.stringify(report, null, 2));

  console.log(`\nDomain report written to: ${reportPath}`);
  console.log(JSON.stringify({
    category: report.category,
    totalSkills: report.totalSkills,
    avgScore: report.avgScore,
    gradeDistribution: report.gradeDistribution,
    skillsByScore: report.skillsByScore,
    recommendations: report.recommendations,
  }, null, 2));
}

/** Only run CLI main() when this script is executed directly, not when imported. */
const isMain = import.meta?.url === `file://${process.argv[1]}`;
if (isMain) {
  main().catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
}

export { scoreSkill };
