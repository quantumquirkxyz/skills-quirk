#!/usr/bin/env node
import fs from 'node:fs/promises';

export function compareBaselines(baseline, candidate, { strict = false } = {}) {
  if (!baseline || !candidate || !Array.isArray(baseline.checks) || !Array.isArray(candidate.checks)) {
    throw new TypeError('Both reports must contain checks arrays');
  }
  const toMap = (checks) => {
    const map = new Map();
    for (const check of checks) {
      if (!check || typeof check.id !== 'string' || !['PASS', 'FAIL', 'BLOCKED', 'NOT RUN'].includes(check.status) || map.has(check.id)) {
        throw new TypeError('Invalid or duplicate check entry');
      }
      map.set(check.id, check.status);
    }
    return map;
  };
  const before = toMap(baseline.checks);
  const after = toMap(candidate.checks);
  const findings = [];
  for (const [id, prev] of before) {
    if (!after.has(id)) findings.push({ id, type: 'missing-check', before: prev, after: null });
    else if (prev === 'PASS' && after.get(id) !== 'PASS') findings.push({ id, type: 'regression', before: prev, after: after.get(id) });
  }
  for (const [id, current] of after) {
    if (!before.has(id)) findings.push({ id, type: 'new-check', before: null, after: current });
    if (strict && current !== 'PASS') findings.push({ id, type: 'release-blocker', before: before.get(id) ?? null, after: current });
  }
  findings.sort((a, b) => a.id.localeCompare(b.id) || a.type.localeCompare(b.type));
  return { schema_version: 1, baseline_revision: baseline.revision ?? null, candidate_revision: candidate.revision ?? null,
    ok: !findings.some(f => f.type !== 'new-check'), findings };
}

if (process.argv[1]?.endsWith('/baseline-scorecard.mjs')) {
  try {
    const args = process.argv.slice(2);
    const get = name => { const i = args.indexOf(name); return i < 0 ? null : args[i + 1]; };
    const base = get('--baseline'), next = get('--candidate');
    if (!base || !next) throw new Error('Usage: node scripts/baseline-scorecard.mjs --baseline old.json --candidate new.json [--strict]');
    const result = compareBaselines(JSON.parse(await fs.readFile(base, 'utf8')), JSON.parse(await fs.readFile(next, 'utf8')), { strict: args.includes('--strict') });
    console.log(JSON.stringify(result, null, 2));
    if (!result.ok) process.exitCode = 1;
  } catch (error) { console.error(error.message); process.exitCode = 2; }
}
