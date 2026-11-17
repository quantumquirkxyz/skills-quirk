---
description: "Coordinate multiple agent sub-roles (architect, implementer, reviewer, tester) in parallel or sequential swarm mode, with clear handoff contracts and evidence recording."
---
# subagent-swarm

When to use: Coordinate multiple agent sub-roles (architect, implementer, reviewer, tester) in parallel or sequential swarm mode, with clear handoff contracts and evidence recording.

## Workflow

1. Define roles and mode (parallel/sequential), then emit a unique `traceId`
2. Build and validate the capability/authority matrix, quotas, leases, kill-switch reference, and task assignments
3. Create and sign one complete `DelegationBrief` per role; reject missing, stale, unsigned, or digest-mismatched briefs
4. Execute roles in isolated contexts and failure domains; record checkpoint, intent, and bounded telemetry before each effect
5. Collect typed handoffs containing status, summary, artifact reference, evidence references, hashes, signature, and `traceId`; quarantine malformed or poisoned output
6. Run an independent verifier for every critical claim and check correlation/collusion signals before acceptance
7. Resolve conflicts by preserving claims, evidence, verifier verdict, and one merge owner
8. Merge only verified, approved, idempotently committed outputs; validate final output against the handoff contract

## Deliverables

- agent artifact

## Guardrails

- risk: medium; trust tier: 3; approval required: yes
- side effects: write-files (orchestrator-owned swarm artifact only), write-temp-file (bounded role-result references, when needed), write-ledger (intent, lease, checkpoint, approval, and kill-switch records; bounded and orchestrator-owned), emit-telemetry (trace-linked, redacted, bounded role lifecycle events)
- isolation: none; model tier: reasoning

Stop when: All roles completed with valid evidence, independent verification passed for critical claims, conflicts resolved, and merged output validated; otherwise return a typed non-completed status without executing an unapproved or uncertain side effect.
