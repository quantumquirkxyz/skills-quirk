---
name: grill
category: routing
maturity: stable
version: 1
description: Alias for the quirk grilling flow. Use when the user says "grill" and wants a relentless interview to sharpen a plan, decision, or design.
capabilities:
  - apply grill workflow
  - produce grill artifact
  - validate grill completion criteria
outputs:
  - Grill artifact with findings, decisions, recommendations, and validation notes
sideEffects: []
dependencies: []
stopCondition: Alias for the quirk grilling flow complete; artifact saved; completion criteria checked.
risk: low
trustTier: 1
maxIterations: 6
---

## Operating Contract

- **Input:** Grill request, relevant context, constraints, and source evidence.
- **Output:** Grill artifact with findings, decisions, recommendations, and validation notes.
- **Side effects:** follow the frontmatter declaration; do not broaden scope without explicit user direction.
- **Dependencies:** declared dependencies, referenced skills, and source materials required by the task.
- **Stop condition:** Alias for the quirk grilling flow is complete, evidence is captured, and completion criteria are checked.
- **Risk:** use the frontmatter risk classification and call out any escalation.
- **Boundary:** stay within the skill's declared scope, trust tier, and side-effect policy.

# Grill

Run the `grilling` primitive as the stable quirk entrypoint named `grill`.

Use this alias when the user asks for `grill` specifically. Keep the behavior identical to `grilling`: ask one question at a time, recommend an answer for each question, inspect discoverable facts directly, and do not act on the plan until the user confirms the shared understanding is complete.

## Rules

- Rule: preserve behavior parity with `grilling`.
- Rule: use this skill only as the stable alias entrypoint.
- Rule: keep the session interrogative until the user asks to implement, document, or execute.
- Rule: summarize the sharpened premise before handing off to another skill.

## Completion Criteria

- the alias route is clear
- the grilling session has produced a refined premise or a named blocker
- any follow-on skill is named only after the user confirms the premise
