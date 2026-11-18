---
description: "Establish engineering decision rights, approval gates, exceptions, evidence, policy controls, auditability, escalation, and accountable ownership without replacing domain risk owners."
---
# engineering-governance

When to use: Establish engineering decision rights, approval gates, exceptions, evidence, policy controls, auditability, escalation, and accountable ownership without replacing domain risk owners.

## Workflow

1. Establish the fixed point, scope, affected assets, decision type, risk tier, and explicit non-goals
2. Resolve organization and team ownership, domain risk owners, delegates, conflicts, and separation-of-duties constraints
3. Build the decision-rights matrix with accountable, responsible, consulted, informed, proposer, approver, verifier, and escalation roles
4. Define approval gates and evidence requirements. Check that every gate is independently approved and verified, and that approval scope is not transitive
5. Model ordinary and urgent exception paths, including compensating controls, maximum duration, retrospective review, expiry, and revocation
6. Build the evidence ledger and policy-to-control mappings. Record provenance, integrity, freshness, authority, and unresolved gaps
7. Append an immutable audit trail for governance observations and decisions; do not claim an approval or verification performed by this skill
8. Emit the artifact, validate JSON and Markdown representations, and stop blocked when required authority, evidence, or ownership is missing

## Deliverables

- EngineeringGovernanceArtifact artifact

## Guardrails

- risk: high; trust tier: 4; approval required: no
- side effects: none
- isolation: none; model tier: reasoning

Stop when: Decision rights, gates, exceptions, evidence, mappings, audit trail, escalation, and ownership are explicit; the artifact validates or is blocked with structured gaps.
