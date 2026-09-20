---
name: design-system
category: frontend
maturity: stable
version: 1
description: Define and evolve reusable UI tokens, components, and usage rules as a coherent system.
capabilities:
  - apply design system workflow
  - produce design system artifact
  - validate design system completion criteria
outputs:
  - Design System artifact with findings, decisions, recommendations, and validation notes
sideEffects: []
dependencies: []
stopCondition: Define and evolve reusable UI tokens, components, and usage rules as a coherent system complete; artifact saved; completion criteria checked.
risk: low
trustTier: 1
maxIterations: 6
---

## Operating Contract

- **Input:** Design System request, relevant context, constraints, and source evidence.
- **Output:** Design System artifact with findings, decisions, recommendations, and validation notes.
- **Side effects:** follow the frontmatter declaration; do not broaden scope without explicit user direction.
- **Dependencies:** declared dependencies, referenced skills, and source materials required by the task.
- **Stop condition:** Define and evolve reusable UI tokens, components, and usage rules as a coherent system is complete, evidence is captured, and completion criteria are checked.
- **Risk:** use the frontmatter risk classification and call out any escalation.
- **Boundary:** stay within the skill's declared scope, trust tier, and side-effect policy.

# Design System

Use this skill when UI work starts to repeat and needs a shared system rather than one-off styling. It should define the reusable tokens, components, and usage rules that keep the frontend coherent as it grows.

## Contract

- Input: UI requirements, component inventory, and brand context.
- Output: token guidance, component guidance, and usage rules.
- Scope: design the shared system, not a single page.
- Rule: prefer a small set of reusable tokens over ad hoc styling.
- Rule: make reuse rules explicit so callers know what belongs in the system.
- Rule: keep component contracts stable enough for multiple surfaces.

## Steps

1. Find repeated UI patterns and naming collisions.
2. Define the minimum token set that carries the brand.
3. Identify which components should be shared and which should stay local.
4. Write the rules that keep the system coherent over time.

## Completion criteria

- the reusable tokens are named
- the shared components are named
- the usage rules are explicit
