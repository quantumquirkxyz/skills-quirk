---
description: "Design payment flows as a high-trust seam with explicit failure, reconciliation, webhooks, idempotency, PCI DSS, and rollback posture — with Stripe, Adyen, or equivalent."
---
# payments

When to use: Design payment flows as a high-trust seam with explicit failure, reconciliation, webhooks, idempotency, PCI DSS, and rollback posture — with Stripe, Adyen, or equivalent.

## Workflow

1. Map the payment flow
2. Choose the payment provider
3. Design webhooks and events
4. Idempotency and retries
5. Reconciliation and reporting
6. PCI DSS compliance
7. Fraud and risk management
8. Rollback and compensation

## Deliverables

- payment artifact

## Guardrails

- risk: medium; trust tier: 3; approval required: yes
- side effects: write-artifact
- isolation: none; model tier: reasoning

Stop when: Stop only when each money movement has an authoritative state machine, immutable ledger postings, replay/idempotency strategy, settlement and reconciliation owner, fraud/approval outcome, compensation path, and evidence boundary; stop as blocked on amount/currency mismatch, unverifiable webhook, unresolved ledger discrepancy, unsafe failover, or missing approval.
