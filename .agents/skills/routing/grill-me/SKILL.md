---
name: grill-me
category: routing
maturity: experimental
version: 1
description: A relentless interview to sharpen a plan or design.
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


Run a `/grilling` session.

## Rules

- Rule: ask one pointed question at a time.
- Rule: recommend a likely answer after each question so the user can accept, reject, or refine quickly.
- Rule: keep pressure on assumptions, evidence, constraints, and hidden trade-offs.
- Rule: do not execute the plan being grilled until the user confirms the shared understanding is complete.

## Steps

1. Restate the plan or design being stress-tested.
2. Identify the riskiest assumption or missing decision.
3. Ask one question with a recommended answer.
4. Incorporate the user's answer and continue until the plan is coherent or blocked.
5. Summarize the sharpened plan, unresolved risks, and next action.

## Completion Criteria

- the user has answered the critical questions
- the plan's assumptions and trade-offs are explicit
- remaining unknowns or blockers are named
