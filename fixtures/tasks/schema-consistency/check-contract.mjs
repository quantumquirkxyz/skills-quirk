#!/usr/bin/env node
// check-contract.mjs - task fixture checker for the mini-bundle skill contract.
//
// Runs inside the isolated task workspace and validates
// .agents/skills/delivery/review-pr/SKILL.md against the contract the bundle
// declares for a skill: a complete frontmatter, a name that matches its
// directory, enumerations that stay inside their documented values, and the
// four load-bearing body sections. It is deliberately dependency-free and
// self-contained, because the workspace it runs in contains nothing but the
// task fixture.
//
// Usage: node check-contract.mjs [--json]
// Exit codes: 0 the skill satisfies the contract, 1 it does not.

import fs from 'node:fs';
import path from 'node:path';

const SKILL_PATH = path.join(process.cwd(), '.agents', 'skills', 'delivery', 'review-pr', 'SKILL.md');
const jsonOnly = process.argv.includes('--json');

const REQUIRED_FIELDS = [
  'name', 'category', 'maturity', 'version', 'description', 'capabilities', 'inputs',
  'outputs', 'sideEffects', 'dependencies', 'stopCondition', 'risk', 'trustTier',
  'maxIterations', 'modelTier', 'promptVersion', 'artifactType', 'evaluators',
  'fixturesPath', 'diataxis', 'tags', 'compatibility', 'approvalRequired', 'approvalFor',
];
const RISKS = ['low', 'medium', 'high'];
const TIERS = ['1', '2', '3', '4'];
const SECTIONS = ['## Contract', '## Provenance', '## Artifact', '## Completion'];

function parseFrontmatter(text) {
  if (!text.startsWith('---')) return { fields: {}, body: text };
  const end = text.indexOf('\n---', 3);
  if (end === -1) return { fields: {}, body: text };
  const fields = {};
  let active = null;
  for (const line of text.slice(4, end).split(/\r?\n/)) {
    const key = line.match(/^([A-Za-z][A-Za-z0-9-]*):\s*(.*)$/);
    if (key) {
      active = key[1];
      const raw = key[2].trim().replace(/^["']|["']$/g, '');
      fields[active] = raw === '' || raw === '[]' ? [] : raw;
      continue;
    }
    const item = line.match(/^\s+-\s+(.+)$/);
    if (item && active) {
      if (!Array.isArray(fields[active])) fields[active] = [];
      fields[active].push(item[1].trim().replace(/^["']|["']$/g, ''));
    }
  }
  return { fields, body: text.slice(end + 4) };
}

function checkSkill() {
  let text;
  try {
    text = fs.readFileSync(SKILL_PATH, 'utf8');
  } catch {
    return { valid: false, violations: [{ rule: 'skill-readable', detail: `${SKILL_PATH} could not be read` }] };
  }

  const { fields, body } = parseFrontmatter(text);
  const violations = [];
  const dirName = path.basename(path.dirname(SKILL_PATH));

  // An empty list is a declared value (dependencies and compatibility are
  // legitimately empty on skills with no adjacent skills), so only an absent
  // or null key counts as missing.
  for (const field of REQUIRED_FIELDS) {
    const value = fields[field];
    const empty = value === undefined || value === null || value === '';
    if (empty) violations.push({ rule: 'field-missing', detail: `frontmatter is missing ${field}` });
  }

  if (fields.name !== undefined && fields.name !== '' && fields.name !== dirName) {
    violations.push({
      rule: 'name-directory-mismatch',
      detail: `name "${fields.name}" does not match directory "${dirName}"`,
    });
  }

  if (fields.risk !== undefined && fields.risk !== '' && !RISKS.includes(String(fields.risk))) {
    violations.push({
      rule: 'risk-enum',
      detail: `risk "${fields.risk}" is outside ${RISKS.join(' | ')}`,
    });
  }

  if (fields.trustTier !== undefined && fields.trustTier !== '' && !TIERS.includes(String(fields.trustTier))) {
    violations.push({
      rule: 'trust-tier-enum',
      detail: `trustTier "${fields.trustTier}" is outside ${TIERS.join(' | ')}`,
    });
  }

  if (fields.maxIterations !== undefined && fields.maxIterations !== '') {
    const iterations = Number(fields.maxIterations);
    if (!Number.isInteger(iterations) || iterations < 1) {
      violations.push({
        rule: 'max-iterations',
        detail: `maxIterations "${fields.maxIterations}" must be a positive integer`,
      });
    }
  }

  for (const section of SECTIONS) {
    if (!body.includes(section)) {
      violations.push({ rule: 'body-section', detail: `body is missing the ${section} section` });
    }
  }

  if (body.split(/\r?\n/).length < 20) {
    violations.push({ rule: 'body-length', detail: 'body is shorter than 20 lines' });
  }

  return { valid: violations.length === 0, violations };
}

const result = checkSkill();
const report = {
  skill: 'delivery/review-pr',
  path: path.relative(process.cwd(), SKILL_PATH),
  valid: result.valid,
  violations: result.violations,
};

if (jsonOnly) console.log(JSON.stringify(report, null, 2));
else {
  console.log(`check-contract: ${report.path}`);
  if (result.valid) console.log('check-contract: the skill satisfies its contract');
  else for (const violation of result.violations) console.log(`check-contract: ${violation.rule} - ${violation.detail}`);
}

process.exit(result.valid ? 0 : 1);
