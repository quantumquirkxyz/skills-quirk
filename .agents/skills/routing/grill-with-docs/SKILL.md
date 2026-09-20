---
name: grill-with-docs
category: routing
maturity: experimental
version: 1
description: A relentless interview to sharpen a plan or design, while creating docs (ADRs and glossary) as we go.
capabilities:
  - apply grill with docs workflow
  - produce grill with docs artifact
  - validate grill with docs completion criteria
outputs:
  - Grill With Docs artifact with findings, decisions, recommendations, and validation notes
sideEffects:
  - write-docs
dependencies: []
stopCondition: A relentless interview to sharpen a plan or design, while creating docs (ADRs and glossary) as we go complete; artifact saved; completion criteria checked.
risk: low
trustTier: 2
maxIterations: 6
---

## Operating Contract

- **Input:** Grill With Docs request, relevant context, constraints, and source evidence.
- **Output:** Grill With Docs artifact with findings, decisions, recommendations, and validation notes.
- **Side effects:** follow the frontmatter declaration; do not broaden scope without explicit user direction.
- **Dependencies:** declared dependencies, referenced skills, and source materials required by the task.
- **Stop condition:** A relentless interview to sharpen a plan or design, while creating docs (ADRs and glossary) as we go is complete, evidence is captured, and completion criteria are checked.
- **Risk:** use the frontmatter risk classification and call out any escalation.
- **Boundary:** stay within the skill's declared scope, trust tier, and side-effect policy.

Run a `/grilling` session, using the `/domain-modeling` skill.

## Rules

- Rule: ask one question at a time and recommend a concrete answer.
- Rule: capture durable terminology, decisions, and disagreements as documentation candidates.
- Rule: use domain-modeling when names, boundaries, or concepts are unstable.
- Rule: do not write ADRs or glossary entries until the user has confirmed the decision or definition.

## Steps

1. Identify the plan or design to grill and the documentation artifacts likely to emerge.
2. Question assumptions, terms, boundaries, and decision criteria.
3. Convert stable answers into ADR, glossary, or context-pack notes.
4. Keep unresolved disagreements visible instead of documenting them as settled.
5. Summarize the refined plan and docs to create or update.

## Completion Criteria

- critical assumptions have been challenged
- candidate docs are tied to confirmed decisions or terms
- unresolved questions are separated from settled guidance
