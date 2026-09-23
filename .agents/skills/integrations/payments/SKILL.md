---
name: payments
category: integrations
maturity: stable
version: 2
description: Design payment flows as a high-trust seam with explicit failure, reconciliation, webhooks, idempotency, PCI DSS, and rollback posture — with Stripe, Adyen, or equivalent.
capabilities:
  - design payment flows (authorization, capture, void, refund, dispute)
  - plan webhooks, idempotency, reconciliation, and retry behavior
  - evaluate PCI DSS scope, fraud detection, and compliance
  - assess payment provider lock-in and migration paths
outputs:
  - Payments design document (flows, webhooks, idempotency, reconciliation, PCI, fraud, provider evaluation)
sideEffects: []
dependencies: []
stopCondition: Payment design complete; flows, webhooks, and reconciliation explicit; PCI and fraud controls named.
risk: medium
trustTier: 3
maxIterations: 6
---

# Payments

Use this skill when money moves through the system. It should keep the seam small, the trust boundary explicit, and the failure, reconciliation, and compliance story visible before implementation begins.

## Contract

- Input: payments brief, money flow, provider options, and compliance constraints.
- Output: payment design covering flows, webhooks, idempotency, reconciliation, PCI, fraud, and provider evaluation.
- Scope: design the money-flow shape, not the full implementation.
- Rule: make settlement, retries, and reconciliation explicit.
- Rule: prefer the narrowest seam that still respects financial correctness.
- Rule: call out where manual review or operator intervention is required.

## Process

### 1. Map the payment flow

- **Authorization:** hold funds without capturing; authorization validity window.
- **Capture:** full vs partial; automatic vs manual capture; capture timing.
- **Void:** cancel authorization before capture; void vs refund distinction.
- **Refund:** full vs partial; refund timing; refund idempotency.
- **Dispute / chargeback:** evidence requirements, timeline, operator workflow.
- **Recurring:** subscriptions, invoicing, usage-based billing; proration.

**Completion criterion:** flow diagram or description saved.

### 2. Choose the payment provider

- **Stripe:** Payment Intents, Connect, Sigma, Radar; strongest developer experience.
- **Adyen:** enterprise-grade, global coverage, risk management; complex integration.
- **PayPal / Braintree:** consumer trust, PayPal checkout, Venmo.
- **Square:** in-person + online, POS integration.
- **Custom / ledger:** internal ledger, wallet, or ledger-backed payment; full control.

**Completion criterion:** provider chosen with rationale; lock-in risks named.

### 3. Design webhooks and events

- **Event types:** payment_intent.succeeded, payment_intent.failed, charge.dispute.created, invoice.payment_succeeded.
- **Webhook security:** signature verification, replay protection, idempotent handling.
- **Retry behavior:** exponential backoff, dead-letter queue, manual retry.
- **Event ordering:** idempotency keys, idempotency window, out-of-order handling.

**Completion criterion:** webhook strategy and event handling explicit.

### 4. Idempotency and retries

- **Idempotency keys:** client-generated keys; idempotency window; key rotation.
- **Retry policy:** retryable errors (network, 5xx); non-retryable errors (4xx, validation); max retries.
- **Duplicate detection:** database constraints, unique keys, deduplication logic.

**Completion criterion:** idempotency and retry strategy named.

### 5. Reconciliation and reporting

- **Daily reconciliation:** match provider transactions to internal ledger; discrepancy handling.
- **Settlement:** payout schedule, currency conversion, fees; settlement reports.
- **Balance tracking:** available balance, pending balance, reserved balance; ledger entries.
- **Operator workflow:** dispute investigation, refund approval, manual adjustment.

**Completion criterion:** reconciliation process and operator workflow named.

### 6. PCI DSS compliance

- **Scope reduction:** use hosted payment pages (Stripe Checkout, Elements) to minimize PCI scope.
- **Card data handling:** never store full card numbers; use tokens; PCI DSS SAQ A vs SAQ D.
- **Transmission:** TLS 1.2+; certificate pinning if applicable.
- **Vulnerability management:** quarterly scans, penetration testing, ASV scanning.

**Completion criterion:** PCI scope and controls named.

### 7. Fraud and risk management

- **Rules-based:** velocity limits, geolocation, AVS/CVV checks, blocklists.
- **ML-based:** Stripe Radar, Adyen Risk; custom models for fraud detection.
- **3D Secure:** SCA compliance, frictionless flow, challenge flow; exemption handling.
- **Dispute management:** evidence collection, timeline, auto-response rules.

**Completion criterion:** fraud controls and dispute workflow named.

### 8. Rollback and compensation

- **Failure handling:** payment failure → graceful degradation → retry → fallback payment method.
- **Compensation:** refund, credit, or store credit; partial compensation rules.
- **Idempotent rollback:** reverse ledger entries; reconciliation after rollback.

**Completion criterion:** rollback and compensation posture explicit.

## Completion criteria

- the payment flow is diagrammed
- the provider choice is justified with lock-in analysis
- webhooks and idempotency are designed
- reconciliation and operator workflow are named
- PCI scope and controls are explicit
- fraud and dispute controls are named
- rollback and compensation posture is explicit

## References

- `../../sec/sec-privacy-engineering/SKILL.md` — PCI and data protection
- `../../backend/backend-architecture/SKILL.md` — API design for payment endpoints
- `../../qa/qa-security-testing/SKILL.md` — payment security testing
