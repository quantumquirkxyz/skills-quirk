---
name: grill-with-docs
category: routing
maturity: experimental
version: 1
description: A relentless interview to sharpen a plan or design, while creating docs (ADRs and glossary) as we go.
capabilities:
  - execute the core process defined in the skill body
  - produce a Markdown artifact or structured result
outputs:
  - Markdown artifact with process steps and completion criteria
sideEffects: []
dependencies: []
stopCondition: All process steps executed; artifact saved; criteria met.
risk: low
trustTier: 1
maxIterations: 6
---

## Contract

- **Input:** problem or task defined by the skill body.
- **Output:** Markdown artifact or structured result with completion criteria met.
- **Side effects:** none (design/review/documentation only unless explicitly stated).
- **Dependencies:** none (self-contained unless linked to other skills).
- **Stop condition:** all process steps completed; artifact saved; criteria checked.
- **Risk:** low.
- **Boundary:** produces reasoning or documentation artifacts; does not modify external systems unless explicitly instructed.


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
