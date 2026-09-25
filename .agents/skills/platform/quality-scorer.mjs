#!/usr/bin/env node
// quality-scorer.mjs - Scores a skill 0-100 with tier classification
// Usage: node quality-scorer.mjs <skill-path> [--json] [--minimum-score N]

import fs from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const agentsSkillsDir = path.join(root, '.agents', 'skills');

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

function wordCount(text) {
  return (text.match(/[A-Za-z0-9_'-]+/g) ?? []).length;
}

function countHeaders(text) {
  return (text.match(/^#{1,6}\s+.+$/gm) ?? []).length;
}

const TIERS = [
  { name: 'BASIC', minScore: 0, minLines: 100, minScripts: 1, maxScriptLoc: 300 },
  { name: 'STANDARD', minScore: 60, minLines: 200, minScripts: 1, maxScriptLoc: 500 },
  { name: 'POWERFUL', minScore: 80, minLines: 300, minScripts: 2, maxScriptLoc: 800 },
];

function tierFor(score, lines, scripts, scriptLoc) {
  if (score >= 80 && lines >= 300 && scripts >= 2 && scriptLoc >= 500) return 'POWERFUL';
  if (score >= 60 && lines >= 200 && scripts >= 1) return 'STANDARD';
  return 'BASIC';
}

async function scoreSkill(skillPath) {
  const skillFile = path.join(root, skillPath, 'SKILL.md');
  if (!await fs.access(skillFile).then(() => true).catch(() => false)) {
    return { error: `Skill not found: ${skillPath}` };
  }

  const text = await fs.readFile(skillFile, 'utf8');
  const fm = parseFrontmatter(text);
  const body = text.replace(/^---[\s\S]*?---\s*/, '');
  const lines = body.split(/\r?\n/).length;
  const tokens = wordCount(body);
  const headers = countHeaders(body);

  const scores = {
    frontmatterCompleteness: 0,
    bodyDepth: 0,
    sections: 0,
    assets: 0,
    behavioralSpec: 0,
    safety: 0,
  };
  const issues = [];
  const warnings = [];

  // 1. Frontmatter completeness (max 20)
  const requiredFields = ['name', 'description', 'category'];
  const recommendedFields = ['version', 'maturity', 'capabilities', 'inputs', 'outputs', 'sideEffects', 'dependencies', 'stopCondition', 'risk', 'trustTier', 'maxIterations'];
  let fmScore = 0;
  for (const f of requiredFields) {
    if (fm[f] !== undefined && fm[f] !== '' && fm[f] !== []) fmScore += 8;
    else issues.push(`missing required frontmatter field: ${f}`);
  }
  for (const f of recommendedFields) {
    if (fm[f] !== undefined && fm[f] !== '' && fm[f] !== []) fmScore += 2;
  }
  scores.frontmatterCompleteness = Math.min(20, fmScore);

  // 2. Body depth (max 20)
  let bodyScore = 0;
  if (tokens >= 500) bodyScore += 8;
  else if (tokens >= 300) bodyScore += 5;
  else if (tokens >= 180) bodyScore += 2;
  else warnings.push(`short body (${tokens} tokens)`);

  if (headers >= 10) bodyScore += 8;
  else if (headers >= 5) bodyScore += 5;
  else if (headers >= 3) bodyScore += 2;

  if (lines >= 100) bodyScore += 4;
  scores.bodyDepth = Math.min(20, bodyScore);

  // 3. Required sections (max 20)
  const requiredSections = ['Contract', 'Process', 'Guardrails', 'Completion'];
  let secScore = 0;
  for (const sec of requiredSections) {
    if (body.includes(`## ${sec}`) || body.includes(`## ${sec} Criteria`)) secScore += 5;
    else issues.push(`missing ## ${sec} section`);
  }
  scores.sections = Math.min(20, secScore);

  // 4. Assets presence (max 15)
  const skillDir = path.join(root, skillPath);
  let assetScore = 0;
  const dirs = ['scripts', 'references', 'assets', 'behavioral-fixtures', 'evals'];
  for (const dir of dirs) {
    if (await fs.access(path.join(skillDir, dir)).then(() => true).catch(() => false)) {
      assetScore += 3;
    }
  }
  const skillMdExists = await fs.access(skillFile).then(() => true).catch(() => false);
  if (skillMdExists) assetScore += 3;
  scores.assets = Math.min(15, assetScore);

  // 5. Behavioral spec (max 15)
  let behScore = 0;
  if (fm.stopCondition && fm.stopCondition !== '') behScore += 5;
  else issues.push('missing stopCondition');
  if (fm.maxIterations && Number(fm.maxIterations) > 0) behScore += 3;
  if (fm.inputs && fm.inputs.length > 0) behScore += 3;
  if (fm.outputs && fm.outputs.length > 0) behScore += 4;
  scores.behavioralSpec = Math.min(15, behScore);

  // 6. Safety (max 10)
  let safetyScore = 10;
  const riskyPatterns = [
    { pattern: /rm\s+-rf\s+\//, label: 'dangerous rm -rf /' },
    { pattern: /curl\s*\|?\s*bash/, label: 'curl | bash pattern' },
    { pattern: /eval\s*\(/, label: 'eval() usage' },
    { pattern: /chmod\s+777/, label: 'chmod 777' },
  ];
  for (const { pattern, label } of riskyPatterns) {
    if (pattern.test(body)) {
      safetyScore -= 3;
      issues.push(`risky pattern: ${label}`);
    }
  }
  if (fm.risk === 'high' && !fm.sideEffects?.length) {
    safetyScore -= 2;
    warnings.push('high risk skill without declared sideEffects');
  }
  scores.safety = Math.max(0, safetyScore);

  const total = Object.values(scores).reduce((a, b) => a + b, 0);
  const tier = tierFor(total, lines, dirs.filter(d => fs.access(path.join(skillDir, d)).then(() => true).catch(() => false)).length, 0);

  const grade = total >= 90 ? 'A' : total >= 80 ? 'B' : total >= 70 ? 'C' : total >= 60 ? 'D' : 'F';

  return {
    skill: path.basename(skillPath),
    path: skillPath,
    scores,
    total,
    grade,
    tier,
    issues,
    warnings,
    metrics: { tokens, lines, headers },
  };
}

async function main() {
  const args = process.argv.slice(2);
  const skillPath = args.find(a => !a.startsWith('--'));
  const json = args.includes('--json');
  const minScore = parseInt(args.find(a => a.startsWith('--minimum-score='))?.split('=')[1]);

  if (!skillPath) {
    console.error('Usage: node quality-scorer.mjs <skill-path> [--json] [--minimum-score=N]');
    process.exit(1);
  }

  const result = await scoreSkill(skillPath);

  if (json) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log(`\nSkill: ${result.skill}`);
    console.log(`Score: ${result.total}/100 (Grade ${result.grade}, Tier: ${result.tier})`);
    console.log(`Metrics: ${result.metrics.tokens} tokens, ${result.metrics.lines} lines, ${result.metrics.headers} headers`);
    if (result.issues.length) {
      console.log('\nIssues:');
      for (const i of result.issues) console.log(`  - ${i}`);
    }
    if (result.warnings.length) {
      console.log('\nWarnings:');
      for (const w of result.warnings) console.log(`  - ${w}`);
    }
    console.log('\nBreakdown:');
    for (const [key, value] of Object.entries(result.scores)) {
      console.log(`  ${key}: ${value}`);
    }
  }

  if (minScore !== undefined && result.total < minScore) {
    console.error(`\nScore ${result.total} is below minimum ${minScore}`);
    process.exit(1);
  }
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
