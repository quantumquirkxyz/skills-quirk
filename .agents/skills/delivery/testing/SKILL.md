---
name: testing
category: delivery
maturity: stable
version: 1
description: Shape the test strategy for a project so behavior is verified at the right seams and at the right level.
capabilities:
  - apply testing workflow
  - produce testing artifact
  - validate testing completion criteria
outputs:
  - Testing artifact with findings, decisions, recommendations, and validation notes
sideEffects: []
dependencies: []
stopCondition: Shape the test strategy for a project so behavior is verified at the right seams and at the right level complete; artifact saved; completion criteria checked.
risk: low
trustTier: 1
maxIterations: 6
---

## Operating Contract

- **Input:** Testing request, relevant context, constraints, and source evidence.
- **Output:** Testing artifact with findings, decisions, recommendations, and validation notes.
- **Side effects:** follow the frontmatter declaration; do not broaden scope without explicit user direction.
- **Dependencies:** declared dependencies, referenced skills, and source materials required by the task.
- **Stop condition:** Shape the test strategy for a project so behavior is verified at the right seams and at the right level is complete, evidence is captured, and completion criteria are checked.
- **Risk:** use the frontmatter risk classification and call out any escalation.
- **Boundary:** stay within the skill's declared scope, trust tier, and side-effect policy.

# Testing

Use this skill when the project needs a testing strategy beyond a single feature slice. It should make the seams, levels, and coverage boundaries explicit so tests stay behavior-focused and maintainable.

## Contract

- Input: testing brief, system surface, and test stack.
- Output: a test strategy, seam guidance, and coverage boundaries.
- Scope: design test strategy, not implementation details.
- Rule: test the public seam first, not the internals.
- Rule: distinguish unit, integration, and end-to-end ownership clearly.
- Rule: avoid speculative coverage that does not prove user-visible behavior.

## Steps

1. Identify the public behavior that needs protection.
2. Choose the smallest seam that proves that behavior.
3. Assign the right test level to each behavior slice.
4. State what is intentionally not covered.

## Completion criteria

- the test seam is named
- the test level is named
- the coverage boundary is explicit
