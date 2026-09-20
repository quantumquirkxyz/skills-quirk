---
name: capability-router
category: routing
maturity: experimental
version: 1
description: Route work to the best matching Skill using declared capabilities and compatibility — with explicit selection rules.
capabilities:
  - apply capability router workflow
  - produce capability router artifact
  - validate capability router completion criteria
outputs:
  - Capability Router artifact with findings, decisions, recommendations, and validation notes
sideEffects: []
dependencies: []
stopCondition: Route work to the best matching Skill using declared capabilities and compatibility complete; artifact saved; completion criteria checked.
risk: low
trustTier: 1
maxIterations: 6
---

## Operating Contract

- **Input:** Capability Router request, relevant context, constraints, and source evidence.
- **Output:** Capability Router artifact with findings, decisions, recommendations, and validation notes.
- **Side effects:** follow the frontmatter declaration; do not broaden scope without explicit user direction.
- **Dependencies:** declared dependencies, referenced skills, and source materials required by the task.
- **Stop condition:** Route work to the best matching Skill using declared capabilities and compatibility is complete, evidence is captured, and completion criteria are checked.
- **Risk:** use the frontmatter risk classification and call out any escalation.
- **Boundary:** stay within the skill's declared scope, trust tier, and side-effect policy.

# Capability Router

Use this skill to choose the right Skill from the registry instead of relying on memory.

## Contract

- Rule: route from declared capabilities, inputs, outputs, and side effects.
- Rule: choose the thinnest Skill that can complete the work end to end.
- Rule: prefer one primary Skill; add a second only when the task truly crosses a seam.
- Rule: if the choice is ambiguous, state the competing Skills and the reason for the final pick.
- Rule: do not route on name similarity or past habit when the registry says otherwise.

## Steps

1. Parse the task intent and required artifact type.
2. Match against declared capabilities and side effects.
3. Prefer the thinnest Skill that can finish the work.
4. Fall back to a human-readable rationale when multiple Skills fit.

## Completion criteria

- a selected Skill is named
- the reason for the selection is explicit
- fallback options are noted when applicable
