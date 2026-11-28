import crypto from 'node:crypto';

export const PHASE9A_STATUSES = Object.freeze([
  'covered', 'partial', 'manual', 'missing', 'blocked', 'not-run',
]);

const STATUS_SET = new Set(PHASE9A_STATUSES);
const BLOCKING_STATUSES = new Set(['missing', 'manual']);

function assertObject(value, name) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new TypeError(`${name} must be an object`);
  }
}

function requiredString(value, name, max = 240) {
  if (typeof value !== 'string' || value.trim() === '' || value.length > max) {
    throw new TypeError(`${name} must be a non-empty bounded string`);
  }
  return value.trim();
}

function stringList(value, name) {
  if (value === undefined) return [];
  if (!Array.isArray(value) || value.some((item) => typeof item !== 'string' || item.trim() === '')) {
    throw new TypeError(`${name} must be an array of non-empty strings`);
  }
  return [...new Set(value.map((item) => item.trim()))];
}

function normalizeRow(raw, index) {
  assertObject(raw, `rows[${index}]`);
  const skill = requiredString(raw.skill ?? raw.skillId, `rows[${index}].skill`);
  const clause = requiredString(raw.clause ?? raw.clauseId, `rows[${index}].clause`);
  const fixture = requiredString(raw.fixture ?? raw.fixtureId, `rows[${index}].fixture`);
  const validator = requiredString(raw.validator ?? raw.validatorId, `rows[${index}].validator`);
  const evidence = stringList(raw.evidence ?? raw.evidenceIds, `rows[${index}].evidence`);
  const status = raw.status;
  if (!STATUS_SET.has(status)) throw new RangeError(`invalid Phase 9A status: ${status}`);
  const critical = raw.critical === true;
  const justification = raw.justification ?? raw.reason ?? null;
  if (justification !== null) requiredString(justification, `rows[${index}].justification`, 1000);
  if (BLOCKING_STATUSES.has(status) && justification === null) {
    return Object.freeze({ skill, clause, fixture, validator, evidence, status: 'blocked', critical: true, justification: `critical ${status} requires justification` });
  }
  if (status === 'covered' && evidence.length === 0) {
    return Object.freeze({ skill, clause, fixture, validator, evidence, status: 'blocked', critical: true, justification: 'covered requires evidence' });
  }
  return Object.freeze({ skill, clause, fixture, validator, evidence, status, critical, ...(justification === null ? {} : { justification }) });
}

function verdict(rows) {
  if (rows.some((row) => row.status === 'blocked')) return 'blocked';
  if (rows.some((row) => row.critical && BLOCKING_STATUSES.has(row.status))) return 'blocked';
  if (rows.some((row) => row.status === 'missing' || row.status === 'manual')) return 'blocked';
  if (rows.some((row) => row.status === 'not-run')) return 'not-run';
  if (rows.some((row) => row.status === 'partial')) return 'partial';
  return 'covered';
}

export function generateSkillClauseMatrix(input, { id = crypto.randomUUID, now = () => new Date().toISOString() } = {}) {
  assertObject(input, 'matrix input');
  const source = input.rows ?? input.matrix ?? input.entries;
  if (!Array.isArray(source) || source.length === 0) throw new TypeError('rows must be a non-empty array');
  const rows = source.map(normalizeRow);
  const keys = new Set();
  for (const row of rows) {
    const key = `${row.skill}\u0000${row.clause}`;
    if (keys.has(key)) throw new Error(`duplicate skill/clause: ${row.skill}/${row.clause}`);
    keys.add(key);
  }
  const matrixId = input.matrixId ?? id();
  requiredString(matrixId, 'matrixId', 200);
  const generatedAt = input.generatedAt ?? now();
  requiredString(generatedAt, 'generatedAt', 100);
  const counts = Object.fromEntries(PHASE9A_STATUSES.map((status) => [status, rows.filter((row) => row.status === status).length]));
  return Object.freeze({
    schemaVersion: '9A',
    matrixId,
    verdict: verdict(rows),
    rows: Object.freeze(rows),
    counts: Object.freeze(counts),
    blocking: Object.freeze(rows.filter((row) => row.status === 'blocked' || BLOCKING_STATUSES.has(row.status)).map((row) => Object.freeze({ skill: row.skill, clause: row.clause, status: row.status, justification: row.justification ?? null }))),
    generatedAt,
    generator: input.generator ?? 'phase9a-matrix',
  });
}

export function validateSkillClauseMatrix(matrix) {
  assertObject(matrix, 'matrix');
  const generated = generateSkillClauseMatrix(matrix, { id: () => matrix.matrixId ?? 'validation', now: () => matrix.generatedAt ?? new Date().toISOString() });
  return Object.freeze({ valid: generated.verdict === 'covered' || generated.verdict === 'partial' || generated.verdict === 'not-run', verdict: generated.verdict, errors: Object.freeze(generated.blocking), matrix: generated });
}

export const phase9aMatrixContract = Object.freeze({ statuses: PHASE9A_STATUSES, criticalRule: 'Critical missing/manual clauses without justification are blocked; blocked matrices cannot pass.' });
