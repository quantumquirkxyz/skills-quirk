---
name: grill-me
category: routing
maturity: stable
version: 1
description: A relentless interview to sharpen a plan or design.
capabilities:
  - apply grill me workflow
  - produce grill me artifact
  - validate grill me completion criteria
outputs:
  - Grill Me artifact with findings, decisions, recommendations, and validation notes
sideEffects: []
dependencies: []
stopCondition: A relentless interview to sharpen a plan or design complete; artifact saved; completion criteria checked.
risk: low
trustTier: 1
maxIterations: 6
---

## Operating Contract

- **Input:** Grill Me request, relevant context, constraints, and source evidence.
- **Output:** Grill Me artifact with findings, decisions, recommendations, and validation notes.
- **Side effects:** follow the frontmatter declaration; do not broaden scope without explicit user direction.
- **Dependencies:** declared dependencies, referenced skills, and source materials required by the task.
- **Stop condition:** A relentless interview to sharpen a plan or design is complete, evidence is captured, and completion criteria are checked.
- **Risk:** use the frontmatter risk classification and call out any escalation.
- **Boundary:** stay within the skill's declared scope, trust tier, and side-effect policy.

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
