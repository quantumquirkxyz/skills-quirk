import crypto from 'node:crypto';

export const PHASE8A_DIMENSIONS = Object.freeze([
  'contract',
  'security',
  'permissions',
  'side-effects',
  'replay',
  'crash-resume',
  'mutation',
  'traceability',
  'evidence',
]);

const STATUSES = new Set(['PASS', 'FAIL', 'BLOCKED', 'NOT-RUN']);
const DIMENSION_SET = new Set(PHASE8A_DIMENSIONS);

function assertObject(value, name) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new TypeError(`${name} must be an object`);
}

function boundedString(value, name, max = 500) {
  if (typeof value !== 'string' || value.trim().length === 0 || value.length > max) throw new TypeError(`${name} must be a non-empty bounded string`);
  return value;
}

function evidenceIds(value, name) {
  if (value === undefined) return [];
  if (!Array.isArray(value) || value.some((id) => typeof id !== 'string' || id.trim() === '')) throw new TypeError(`${name} must be an array of non-empty strings`);
  return [...new Set(value)];
}

function normalizeDimension(raw, index) {
  assertObject(raw, `dimensions[${index}]`);
  const id = boundedString(raw.id ?? raw.dimension, `dimensions[${index}].id`, 120);
  if (!DIMENSION_SET.has(id)) throw new RangeError(`unknown Phase 8A dimension: ${id}`);
  const status = raw.status ?? raw.result;
  if (!STATUSES.has(status)) throw new RangeError(`invalid status for ${id}: ${status}`);
  const evidence = evidenceIds(raw.evidenceIds ?? raw.evidence, `${id}.evidenceIds`);
  const critical = raw.critical === true;
  const reason = raw.reason ?? raw.notes ?? null;
  if (reason !== null) boundedString(reason, `${id}.reason`, 1000);
  if ((status === 'PASS' || status === 'FAIL') && evidence.length === 0) {
    return Object.freeze({ id, status: 'BLOCKED', critical: true, evidenceIds: [], reason: 'missing evidence for evaluated dimension' });
  }
  if (status === 'NOT-RUN' && reason === null) {
    return Object.freeze({ id, status: 'BLOCKED', critical: true, evidenceIds: evidence, reason: 'NOT-RUN requires a reason' });
  }
  return Object.freeze({ id, status, critical, evidenceIds: evidence, ...(reason === null ? {} : { reason }) });
}

function verdictFor(dimensions) {
  const critical = dimensions.filter((item) => item.critical);
  if (critical.some((item) => item.status === 'BLOCKED')) return 'BLOCKED';
  if (critical.some((item) => item.status === 'FAIL')) return 'BLOCKED';
  if (dimensions.some((item) => item.status === 'BLOCKED')) return 'BLOCKED';
  if (dimensions.some((item) => item.status === 'FAIL')) return 'FAIL';
  if (dimensions.every((item) => item.status === 'NOT-RUN')) return 'NOT-RUN';
  if (dimensions.some((item) => item.status === 'NOT-RUN')) return 'BLOCKED';
  return 'PASS';
}

export function evaluatePhase8A(input, { now = () => new Date().toISOString(), id = crypto.randomUUID } = {}) {
  assertObject(input, 'scorecard input');
  const supplied = input.dimensions ?? input.criteria;
  if (!Array.isArray(supplied) || supplied.length === 0) throw new TypeError('dimensions must be a non-empty array');
  const dimensions = supplied.map(normalizeDimension);
  const ids = new Set();
  for (const dimension of dimensions) {
    if (ids.has(dimension.id)) throw new Error(`duplicate dimension: ${dimension.id}`);
    ids.add(dimension.id);
  }
  const missing = PHASE8A_DIMENSIONS.filter((dimension) => !ids.has(dimension));
  if (missing.length > 0) throw new Error(`missing Phase 8A dimensions: ${missing.join(', ')}`);
  const scorecardId = input.scorecardId ?? id();
  boundedString(scorecardId, 'scorecardId', 200);
  const evaluatedAt = input.evaluatedAt ?? now();
  boundedString(evaluatedAt, 'evaluatedAt', 100);
  const counts = Object.fromEntries([...STATUSES].map((status) => [status, dimensions.filter((item) => item.status === status).length]));
  const failures = dimensions.filter((item) => item.status !== 'PASS').map((item) => ({
    id: item.id,
    status: item.status,
    critical: item.critical,
    reason: item.reason ?? null,
  }));
  return Object.freeze({
    schemaVersion: '8A',
    scorecardId,
    verdict: verdictFor(dimensions),
    dimensions: Object.freeze(dimensions),
    counts: Object.freeze(counts),
    failures: Object.freeze(failures.map((failure) => Object.freeze(failure))),
    evaluatedAt,
    evaluator: input.evaluator ?? 'phase8a-scorecard',
    limitations: Object.freeze(Array.isArray(input.limitations) ? [...input.limitations] : []),
  });
}

export function isPhase8APassing(scorecard) {
  return scorecard?.verdict === 'PASS';
}

export const phase8aScorecardContract = Object.freeze({
  dimensions: PHASE8A_DIMENSIONS,
  statuses: [...STATUSES],
  criticalFailure: 'A critical FAIL or BLOCKED dimension yields BLOCKED; no aggregate score can override it.',
});
