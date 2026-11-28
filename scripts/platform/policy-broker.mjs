import crypto from 'node:crypto';
import { SideEffectLedger } from './side-effect-ledger.mjs';

const DECISIONS = new Set(['allow', 'ask', 'deny']);
const ACTIONS = new Set(['read', 'write']);
const MAX_APPROVAL_MS = 24 * 60 * 60 * 1000;

function required(value, name) {
  if (typeof value !== 'string' || value.length === 0 || value.length > 500) {
    throw new TypeError(`${name} must be a non-empty bounded string`);
  }
  return value;
}

function normalize(value, name) {
  return required(value, name).trim();
}

function exactKey({ identity, tool, destination, action }) {
  return [identity, tool, destination, action].join('\u0000');
}

function validIso(value, name) {
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) throw new TypeError(`${name} must be a valid timestamp`);
  return date;
}

function validateRequest(input) {
  if (!input || typeof input !== 'object') throw new TypeError('request must be an object');
  const identity = normalize(input.identity, 'identity');
  const tool = normalize(input.tool, 'tool');
  const destination = normalize(input.destination, 'destination');
  const action = normalize(input.action, 'action');
  if (!ACTIONS.has(action)) throw new TypeError(`unsupported action: ${action}`);
  return { identity, tool, destination, action };
}

function makeApproval(input, now) {
  const request = validateRequest(input);
  const issuedAt = input.issuedAt ?? now();
  const expiresAt = input.expiresAt ?? new Date(new Date(issuedAt).getTime() + 15 * 60 * 1000).toISOString();
  const issuedDate = validIso(issuedAt, 'issuedAt');
  const expiresDate = validIso(expiresAt, 'expiresAt');
  if (expiresDate <= issuedDate) throw new RangeError('expiresAt must be after issuedAt');
  if (expiresDate - issuedDate > MAX_APPROVAL_MS) throw new RangeError('approval lifetime exceeds limit');
  return Object.freeze({
    approvalId: normalize(input.approvalId ?? crypto.randomUUID(), 'approvalId'),
    ...request,
    issuedAt: issuedDate.toISOString(),
    expiresAt: expiresDate.toISOString(),
  });
}

export class PolicyBroker {
  #policy;
  #approvals = new Map();
  #ledger;
  #now;
  #id;

  constructor({ policy = {}, ledger = new SideEffectLedger(), now = () => new Date(), id = crypto.randomUUID } = {}) {
    this.#policy = policy;
    this.#ledger = ledger;
    this.#now = now;
    this.#id = id;
  }

  issueApproval(input) {
    const approval = makeApproval(input, () => this.#now().toISOString());
    this.#approvals.set(approval.approvalId, approval);
    return approval;
  }

  decide(input) {
    const request = validateRequest(input);
    const toolPolicy = this.#policy[request.tool];
    if (!toolPolicy) return this.#result(request, 'deny', 'tool-not-declared');
    const identities = Array.isArray(toolPolicy.identities) ? toolPolicy.identities : null;
    if (identities && !identities.includes(request.identity)) return this.#result(request, 'deny', 'identity-not-allowed');
    const destinations = Array.isArray(toolPolicy.destinations) ? toolPolicy.destinations : [];
    if (!destinations.includes(request.destination)) return this.#result(request, 'deny', 'destination-not-allowed');
    const actions = Array.isArray(toolPolicy.actions) ? toolPolicy.actions : [];
    if (!actions.includes(request.action)) return this.#result(request, 'deny', 'action-not-allowed');
    if (toolPolicy.readOnly === true && request.action === 'write') return this.#result(request, 'deny', 'read-only-write');
    if (toolPolicy.approvalRequired === true) {
      const approval = input.approvalId ? this.#approvals.get(input.approvalId) : null;
      const approvalState = this.#checkApproval(approval, request);
      if (approvalState !== 'valid') return this.#result(request, approvalState === 'missing' ? 'ask' : 'deny', `approval-${approvalState}`);
    }
    return this.#result(request, 'allow', 'policy-allowed', input.approvalId ?? null);
  }

  authorize(input) {
    const result = this.decide(input);
    if (result.decision !== 'allow') return Object.freeze({ ...result, decision: 'deny', reason: result.reason === 'approval-missing' ? 'approval-required' : result.reason });
    return result;
  }

  records() { return this.#ledger.records(); }

  #checkApproval(approval, request) {
    if (!approval) return 'missing';
    if (exactKey(approval) !== exactKey(request)) return 'mismatched';
    if (this.#now() >= new Date(approval.expiresAt)) return 'expired';
    return 'valid';
  }

  #result(request, decision, reason, approvalRef = null) {
    if (!DECISIONS.has(decision)) throw new Error('invalid policy decision');
    const operationId = 'policy-' + this.#id();
    const record = this.#ledger.append({
      operationId, runId: operationId, toolCallId: operationId,
      action: request.action, resource: request.destination, kind: 'policy',
      policyDecision: decision, approvalRef, approval: decision === 'allow' ? 'approved' : 'not-approved',
      outcome: decision === 'deny' ? 'blocked' : 'planned',
      arguments: { identity: request.identity, tool: request.tool, destination: request.destination, action: request.action },
      declared: true, metadata: { reason },
    });
    return Object.freeze({ decision, reason, approvalRef, record });
  }
}

export const policyBrokerLimits = Object.freeze({ maxApprovalLifetimeMs: MAX_APPROVAL_MS });
