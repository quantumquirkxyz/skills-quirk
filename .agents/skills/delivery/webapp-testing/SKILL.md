---
name: webapp-testing
category: delivery
maturity: stable
version: 1
description: Choose the right test seam for a web app and describe how to verify it at unit, integration, and end-to-end levels.
capabilities:
  - apply webapp testing workflow
  - produce webapp testing artifact
  - validate webapp testing completion criteria
outputs:
  - Webapp Testing artifact with findings, decisions, recommendations, and validation notes
sideEffects: []
dependencies: []
stopCondition: Choose the right test seam for a web app and describe how to verify it at unit, integration, and end-to-end levels complete; artifact saved; completion criteria checked.
risk: low
trustTier: 1
maxIterations: 6
---

## Operating Contract

- **Input:** Webapp Testing request, relevant context, constraints, and source evidence.
- **Output:** Webapp Testing artifact with findings, decisions, recommendations, and validation notes.
- **Side effects:** follow the frontmatter declaration; do not broaden scope without explicit user direction.
- **Dependencies:** declared dependencies, referenced skills, and source materials required by the task.
- **Stop condition:** Choose the right test seam for a web app and describe how to verify it at unit, integration, and end-to-end levels is complete, evidence is captured, and completion criteria are checked.
- **Risk:** use the frontmatter risk classification and call out any escalation.
- **Boundary:** stay within the skill's declared scope, trust tier, and side-effect policy.

# Webapp Testing

Use this skill when the project needs guidance on how to test a frontend or full-stack web app. The goal is to select the right seam and keep each test level honest about what it proves.

## Contract

- Input: web app surface, behavior under test, and test stack.
- Output: a test seam recommendation, verification plan, and coverage boundaries.
- Scope: choose testing strategy, not implementation details.
- Rule: keep unit, integration, and end-to-end tests distinct in purpose.
- Rule: avoid testing private UI internals when the public seam can prove the behavior.
- Rule: identify the smallest observable check that proves the user-facing contract.

## Steps

1. Identify the public behavior that needs proof.
2. Map that behavior to the smallest useful seam.
3. Decide which level owns the check: unit, integration, or end-to-end.
4. Define the boundary so tests do not overreach into internals.

## Completion criteria

- the best test seam is named
- the test level is named
- the observable behavior is clear enough to automate
