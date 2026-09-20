---
name: observability
category: foundation
maturity: stable
version: 1
description: Define the logs, metrics, traces, and alerts needed to understand a system in production — with explicit runtime signal ownership.
capabilities:
  - apply observability workflow
  - produce observability artifact
  - validate observability completion criteria
outputs:
  - Observability artifact with findings, decisions, recommendations, and validation notes
sideEffects: []
dependencies: []
stopCondition: Define the logs, metrics, traces, and alerts needed to understand a system in production complete; artifact saved; completion criteria checked.
risk: low
trustTier: 1
maxIterations: 6
---

## Operating Contract

- **Input:** Observability request, relevant context, constraints, and source evidence.
- **Output:** Observability artifact with findings, decisions, recommendations, and validation notes.
- **Side effects:** follow the frontmatter declaration; do not broaden scope without explicit user direction.
- **Dependencies:** declared dependencies, referenced skills, and source materials required by the task.
- **Stop condition:** Define the logs, metrics, traces, and alerts needed to understand a system in production is complete, evidence is captured, and completion criteria are checked.
- **Risk:** use the frontmatter risk classification and call out any escalation.
- **Boundary:** stay within the skill's declared scope, trust tier, and side-effect policy.

# Observability

Use this skill when a system needs to be understood in production, not just in tests. It should identify the smallest useful signal surface and make the diagnostic path explicit.

## Contract

- Input: system surface, production risk, and operational context.
- Output: an observability plan, signal priorities, and diagnostic coverage.
- Scope: design observability, not the alerting implementation.
- Rule: prioritize signals that explain user-visible failures first.
- Rule: avoid noisy telemetry that does not help diagnosis.
- Rule: connect signals to the seam where the system actually fails or slows down.

## Steps

1. Identify the user-visible failure modes.
2. Map each one to logs, metrics, traces, or alerts.
3. Prioritize the smallest set of signals that gives real diagnostic value.
4. Define what "healthy" and "broken" should look like.

## Completion criteria

- the signal surface is named
- the most important signals are prioritized
- the diagnostic path is concrete enough to build
