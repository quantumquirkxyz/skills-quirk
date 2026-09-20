---
name: docs-management
category: project
maturity: stable
version: 1
description: Keep repository documentation, ADRs, and durable context aligned with the current project shape — with explicit consumer rules.
capabilities:
  - apply docs management workflow
  - produce docs management artifact
  - validate docs management completion criteria
outputs:
  - Docs Management artifact with findings, decisions, recommendations, and validation notes
sideEffects: []
dependencies: []
stopCondition: Keep repository documentation, ADRs, and durable context aligned with the current project shape complete; artifact saved; completion criteria checked.
risk: low
trustTier: 1
maxIterations: 6
---

## Operating Contract

- **Input:** Docs Management request, relevant context, constraints, and source evidence.
- **Output:** Docs Management artifact with findings, decisions, recommendations, and validation notes.
- **Side effects:** follow the frontmatter declaration; do not broaden scope without explicit user direction.
- **Dependencies:** declared dependencies, referenced skills, and source materials required by the task.
- **Stop condition:** Keep repository documentation, ADRs, and durable context aligned with the current project shape is complete, evidence is captured, and completion criteria are checked.
- **Risk:** use the frontmatter risk classification and call out any escalation.
- **Boundary:** stay within the skill's declared scope, trust tier, and side-effect policy.

# Docs Management

Use this skill when the repository needs durable documentation discipline: what belongs in `CONTEXT.md`, when to write an ADR, and how to keep docs from drifting away from the code.

## Contract

- Input: docs brief, repository context, and change scope.
- Output: docs guidance, ADR guidance, and context coherence notes.
- Scope: decide what durable docs should say; do not write implementation code here.
- Rule: keep `CONTEXT.md` glossary-like and implementation-free.
- Rule: write an ADR only when the decision is hard to reverse and the trade-off is real.
- Rule: reject stale or duplicate documentation unless it is explicitly resolved.

## Steps

1. Identify which durable docs are affected by the change.
2. Decide whether the change is glossary material, an ADR, or operational guidance.
3. Note what needs to stay coherent across future changes.
4. Flag any stale or contradictory material that should be removed or revised.

## Completion criteria

- the durable doc surface is named
- the ADR threshold is explicit
- the coherence risk is described
