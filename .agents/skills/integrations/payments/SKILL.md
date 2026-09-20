---
name: payments
category: integrations
maturity: stable
version: 1
description: Design payment flows as a high-trust seam with explicit failure, reconciliation, and rollback posture.
capabilities:
  - apply payments workflow
  - produce payments artifact
  - validate payments completion criteria
outputs:
  - Payments artifact with findings, decisions, recommendations, and validation notes
sideEffects: []
dependencies: []
stopCondition: Design payment flows as a high-trust seam with explicit failure, reconciliation, and rollback posture complete; artifact saved; completion criteria checked.
risk: low
trustTier: 1
maxIterations: 6
---

## Operating Contract

- **Input:** Payments request, relevant context, constraints, and source evidence.
- **Output:** Payments artifact with findings, decisions, recommendations, and validation notes.
- **Side effects:** follow the frontmatter declaration; do not broaden scope without explicit user direction.
- **Dependencies:** declared dependencies, referenced skills, and source materials required by the task.
- **Stop condition:** Design payment flows as a high-trust seam with explicit failure, reconciliation, and rollback posture is complete, evidence is captured, and completion criteria are checked.
- **Risk:** use the frontmatter risk classification and call out any escalation.
- **Boundary:** stay within the skill's declared scope, trust tier, and side-effect policy.

# Payments

Use this skill when money moves through the system. It should keep the seam small, the trust boundary explicit, and the failure and reconciliation story visible before implementation begins.

## Contract

- Input: payments brief, money flow, and risk constraints.
- Output: payment seam proposal, reconciliation guidance, and failure/rollback posture.
- Scope: design the money-flow shape, not the full implementation.
- Rule: make settlement, retries, and reconciliation explicit.
- Rule: prefer the narrowest seam that still respects financial correctness.
- Rule: call out where manual review or operator intervention is required.

## Steps

1. Identify the funds flow and trust boundary.
2. Decide how retries, idempotency, and settlement are handled.
3. Define the reconciliation path and operator responsibilities.
4. State the rollback or compensation posture clearly.

## Completion criteria

- the funds-flow seam is named
- the reconciliation path is named
- the failure posture is explicit
