import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

export const OUTCOME_STATUSES = Object.freeze([
  'passed', 'failed', 'skipped', 'partial', 'blocked', 'outcome-unknown',
]);
export const CANONICAL_GATE_RESULTS = Object.freeze(['pass', 'fail', 'skipped']);
export const REAL_COMMIT_SHA = /^[0-9a-f]{40}$/i;

export function isRealCommitSha(value) {
  if (typeof value !== 'string' || !REAL_COMMIT_SHA.test(value)) return false;
  return !/^([0-9a-f])\1{39}$/i.test(value);
}

export function validateGateResults(results = {}) {
  const errors = [];
  for (const key of ['gateIde', 'gatePreCommit', 'gateCi']) {
    if (!CANONICAL_GATE_RESULTS.includes(results[key])) {
      errors.push(`${key} must be one of: ${CANONICAL_GATE_RESULTS.join(', ')}`);
    }
  }
  return errors;
}

export function evaluateGates(results = {}, mandatory = ['gateCi']) {
  const errors = validateGateResults(results);
  if (errors.length) return { status: 'blocked', errors };
  const values = Object.values(results);
  if (values.includes('fail')) return { status: 'failed', errors: ['one or more gates failed'] };
  const mandatorySkipped = mandatory.filter((key) => results[key] === 'skipped');
  if (mandatorySkipped.length) {
    return { status: 'blocked', errors: [`mandatory gates skipped: ${mandatorySkipped.join(', ')}`] };
  }
  if (values.includes('skipped')) return { status: 'partial', errors: ['one or more optional gates skipped'] };
  return { status: 'passed', errors: [] };
}

export function validatePublishableArtifact(value, mandatory = ['gateCi']) {
  const errors = [];
  if (!isRealCommitSha(value?.commitSha)) errors.push('commitSha must be a real 40-character commit SHA');
  errors.push(...validateGateResults(value?.qualityGateResults));
  const gateState = evaluateGates(value?.qualityGateResults, mandatory);
  if (value?.status === 'completed' && gateState.status !== 'passed') {
    errors.push(`completed is invalid when gate outcome is ${gateState.status}`);
  }
  if (value?.status === 'completed' && value?.validation?.acceptanceCriteriaMet !== true) {
    errors.push('completed requires validation.acceptanceCriteriaMet=true');
  }
  return errors;
}

export function validateScopePaths(paths, { allowedFiles = [], allowedPrefixes = [], excludedPrefixes = [] } = {}) {
  const normalize = (value) => String(value).replaceAll('\\', '/').replace(/^\.?\//, '');
  const files = new Set(allowedFiles.map(normalize));
  const prefixes = allowedPrefixes.map((value) => `${normalize(value).replace(/\/$/, '')}/`);
  const excluded = excludedPrefixes.map((value) => `${normalize(value).replace(/\/$/, '')}/`);
  return paths.map(normalize).filter((file) => {
    if (excluded.some((prefix) => file.startsWith(prefix))) return true;
    return !files.has(file) && !prefixes.some((prefix) => file.startsWith(prefix));
  });
}

export function reviewPlanDigest(plan) {
  const canonical = JSON.stringify({
    prNumber: plan?.prNumber ?? null,
    sourceReview: plan?.sourceReview ?? null,
    items: plan?.items ?? [],
  });
  return crypto.createHash('sha256').update(canonical).digest('hex');
}

export function isDuplicateReviewPlan(existingPlans, plan) {
  const digest = reviewPlanDigest(plan);
  return existingPlans.some((existing) => existing?.planDigest === digest || reviewPlanDigest(existing) === digest);
}

export function repeatedBlockerCount(blockers, blockerKey) {
  return blockers.filter((entry) => String(entry?.key ?? entry) === String(blockerKey)).length;
}

export function shipSubissueBlockers({ prState, linkedIssue, standardsFindings = 0, specFindings = 0, gates = {} } = {}) {
  const blockers = [];
  if (prState?.state !== 'open' || prState?.mergeable !== true) blockers.push('pull request is not open and mergeable');
  if (!linkedIssue?.number || linkedIssue?.ambiguous === true) blockers.push('linked issue is missing or ambiguous');
  if (standardsFindings !== 0) blockers.push('unresolved Standards findings remain');
  if (specFindings !== 0) blockers.push('unresolved Spec findings remain');
  const gateState = evaluateGates(gates);
  if (gateState.status !== 'passed') blockers.push(`mandatory gates are ${gateState.status}`);
  return blockers;
}

export function validateInstallationReferences(root) {
  const errors = [];
  const skillsRoot = path.join(root, '.agents', 'skills');
  if (!fs.existsSync(skillsRoot)) return ['missing .agents/skills'];
  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const absolute = path.join(dir, entry.name);
      if (entry.isSymbolicLink()) {
        try { fs.realpathSync(absolute); } catch { errors.push(`broken symlink: ${path.relative(root, absolute)}`); }
      } else if (entry.isDirectory()) walk(absolute);
    }
  }
  walk(skillsRoot);
  return errors;
}

export function validateInstallationBundle(root) {
  const errors = [...validateInstallationReferences(root)];
  const required = [
    path.join(root, '.agents', 'skills'),
    path.join(root, 'skills-lock.json'),
    path.join(root, 'skills.json'),
  ];
  for (const file of required) if (!fs.existsSync(file)) errors.push(`missing required installation artifact: ${path.relative(root, file)}`);
  const jsonRoots = [path.join(root, '.agents', 'skills', 'platform', 'schemas')];
  function checkJson(dir) {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const absolute = path.join(dir, entry.name);
      if (entry.isDirectory()) checkJson(absolute);
      else if (entry.name.endsWith('.json')) {
        try { JSON.parse(fs.readFileSync(absolute, 'utf8')); } catch (error) { errors.push(`invalid JSON artifact ${path.relative(root, absolute)}: ${error.message}`); }
      }
    }
  }
  for (const dir of jsonRoots) checkJson(dir);
  return errors;
}
