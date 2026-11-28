const CANONICAL = Object.freeze([
  'planned', 'leased', 'running', 'awaiting-approval', 'verifying',
  'succeeded', 'failed', 'blocked', 'cancelled', 'crashed', 'resumable',
  'outcome-unknown', 'validation-failed', 'budget-exceeded',
  'repeated-action', 'stale-input', 'superseded', 'audit-incomplete',
]);

const ALIASES = Object.freeze({
  discovered: 'planned', authorized: 'planned', needs_approval: 'awaiting-approval',
  validating: 'verifying', review: 'verifying', completed: 'succeeded', retryable_failed: 'resumable',
});

const DOMAINS = Object.freeze({
  work: new Set(['planned', 'leased', 'running', 'blocked', 'crashed', 'resumable']),
  validation: new Set(['verifying', 'validation-failed', 'audit-incomplete']),
  effects: new Set(['awaiting-approval', 'outcome-unknown', 'repeated-action']),
  terminal: new Set(['succeeded', 'failed', 'cancelled', 'budget-exceeded', 'stale-input', 'superseded']),
});

const TERMINAL = new Set(['succeeded', 'failed', 'cancelled', 'outcome-unknown', 'validation-failed', 'budget-exceeded', 'repeated-action', 'stale-input', 'superseded', 'audit-incomplete']);

export function normalizeWorkflowStatus(value) {
  if (typeof value !== 'string' || value.length === 0) throw new TypeError('Workflow status must be a non-empty string');
  const normalized = ALIASES[value] ?? value;
  if (!CANONICAL.includes(normalized)) throw new RangeError(`Unknown workflow status: ${value}`);
  return normalized;
}

export function describeWorkflowStatus(value) {
  const status = normalizeWorkflowStatus(value);
  const domain = Object.entries(DOMAINS).find(([, statuses]) => statuses.has(status))?.[0];
  return { status, domain, terminal: TERMINAL.has(status), legacy: value !== status };
}

export function isTerminalWorkflowStatus(value) {
  return TERMINAL.has(normalizeWorkflowStatus(value));
}

export const workflowStatuses = CANONICAL;
