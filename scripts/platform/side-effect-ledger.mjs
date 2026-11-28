import crypto from 'node:crypto';

const SCHEMA_VERSION = '1.0';
const MAX_ENTRIES = 1000;
const MAX_STRING = 500;
const MAX_DETAILS_BYTES = 4096;
const DIGEST_RE = /^[a-f0-9]{64}$/;

function digest(value) {
  return crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex');
}

function redact(value, depth = 0) {
  if (depth > 6) return '[truncated]';
  if (typeof value === 'string') return value.length > MAX_STRING ? `${value.slice(0, MAX_STRING)}...[redacted]` : value;
  if (Array.isArray(value)) return value.slice(0, 50).map((item) => redact(item, depth + 1));
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).slice(0, 50).map(([key, item]) => [key, /pass(word)?|token|secret|authorization|credential/i.test(key) ? '[redacted]' : redact(item, depth + 1)]));
  }
  return value;
}

function boundedDetails(value) {
  const safe = redact(value ?? {});
  const serialized = JSON.stringify(safe);
  if (Buffer.byteLength(serialized) <= MAX_DETAILS_BYTES) return safe;
  return { truncated: true, digest: digest(safe), preview: serialized.slice(0, MAX_DETAILS_BYTES) };
}

function requiredString(value, name, max = MAX_STRING) {
  if (typeof value !== 'string' || value.length === 0 || value.length > max) throw new TypeError(`${name} must be a non-empty bounded string`);
  return value;
}

function digestOrNull(value) {
  if (value == null) return null;
  if (typeof value === 'string' && DIGEST_RE.test(value)) return value;
  return digest(value);
}

export function createSideEffectRecord(input, { now = () => new Date().toISOString(), id = crypto.randomUUID } = {}) {
  const args = input.arguments ?? {};
  const effectId = input.effectId ?? id();
  requiredString(effectId, 'effectId', 100);
  const operationId = requiredString(input.operationId, 'operationId', 200);
  const runId = requiredString(input.runId, 'runId', 200);
  const toolCallId = requiredString(input.toolCallId, 'toolCallId', 200);
  const action = requiredString(input.action, 'action', 200);
  const resource = requiredString(input.resource, 'resource', MAX_STRING);
  const policyDecision = requiredString(input.policyDecision ?? 'unknown', 'policyDecision', 100);
  const outcome = input.outcome ?? 'planned';
  if (!['planned', 'attempted', 'succeeded', 'failed', 'blocked', 'unknown'].includes(outcome)) throw new RangeError(`Invalid outcome: ${outcome}`);
  const attempt = Number.isInteger(input.attempt) && input.attempt > 0 ? input.attempt : 1;
  const details = boundedDetails({ operationId, runId, toolCallId, action, resource, argumentDigest: digest(args), policyDecision, approvalRef: input.approvalRef ?? null, beforeDigest: digestOrNull(input.before), afterDigest: digestOrNull(input.after), attempt, result: boundedDetails(input.result), error: boundedDetails(input.error), reconciliation: boundedDetails(input.reconciliation), declared: input.declared !== false, metadata: input.metadata });
  return Object.freeze({
    schemaVersion: SCHEMA_VERSION,
    effectId,
    kind: input.kind ?? 'other',
    operation: action,
    target: resource,
    observedAt: input.observedAt ?? now(),
    outcome,
    approval: input.approval ?? 'unknown',
    evidenceIds: Array.isArray(input.evidenceIds) ? [...new Set(input.evidenceIds)].slice(0, 20) : [],
    details,
  });
}

export function toSchemaRecord(record) {
  return Object.freeze({ ...record, details: boundedDetails(record.details) });
}

export class SideEffectLedger {
  #records = [];
  constructor({ maxEntries = MAX_ENTRIES } = {}) { this.maxEntries = maxEntries; }
  append(input) {
    if (this.#records.length >= this.maxEntries) throw new RangeError('Side-effect ledger capacity exceeded');
    const record = createSideEffectRecord(input);
    this.#records = [...this.#records, record];
    return record;
  }
  records() { return this.#records.slice(); }
  toJSON() { return this.records().map(toSchemaRecord); }
}

export function detectUndeclaredEffects({ observed = [], declared = [] } = {}) {
  const declarations = new Set(declared.map((item) => `${item.action}\u0000${item.resource}`));
  return observed.filter((effect) => !declarations.has(`${effect.action ?? effect.operation}\u0000${effect.resource ?? effect.target}`)).map((effect) => ({ action: effect.action ?? effect.operation, resource: effect.resource ?? effect.target, effectId: effect.effectId ?? null }));
}

export function reconcileEffect({ before, after, result, error = null }) {
  return { status: error ? 'failed' : 'reconciled', beforeDigest: digestOrNull(before), afterDigest: digestOrNull(after), result: boundedDetails(result), error: boundedDetails(error) };
}

export const sideEffectLedgerLimits = Object.freeze({ maxEntries: MAX_ENTRIES, maxDetailsBytes: MAX_DETAILS_BYTES, maxStringLength: MAX_STRING });
