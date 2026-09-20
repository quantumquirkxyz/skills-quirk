---
name: react
category: frontend
maturity: stable
version: 1
description: Design React component structure and state seams — with composability, testability, and clear data flow.
capabilities:
  - apply react workflow
  - produce react artifact
  - validate react completion criteria
outputs:
  - React artifact with findings, decisions, recommendations, and validation notes
sideEffects: []
dependencies: []
stopCondition: Design React component structure and state seams complete; artifact saved; completion criteria checked.
risk: low
trustTier: 1
maxIterations: 6
---

## Operating Contract

- **Input:** React request, relevant context, constraints, and source evidence.
- **Output:** React artifact with findings, decisions, recommendations, and validation notes.
- **Side effects:** follow the frontmatter declaration; do not broaden scope without explicit user direction.
- **Dependencies:** declared dependencies, referenced skills, and source materials required by the task.
- **Stop condition:** Design React component structure and state seams is complete, evidence is captured, and completion criteria are checked.
- **Risk:** use the frontmatter risk classification and call out any escalation.
- **Boundary:** stay within the skill's declared scope, trust tier, and side-effect policy.

# React

Use this skill when React components or state need to be shaped deliberately. Keep the component graph shallow where possible, and make the state seam explicit so the UI remains testable and refactor-friendly.

## Contract

- Input: React brief, component tree, and state shape.
- Output: a React seam proposal, component guidance, and state boundary guidance.
- Scope: design component and state shape, not the full implementation.
- Rule: keep state as local as possible while still serving the interaction flow.
- Rule: prefer reusable components only when the interface stays honest.
- Rule: avoid component forests that hide the real user path.

## Steps

1. Identify the primary interaction path.
2. Decide which state is local and which state must be lifted.
3. Shape the component graph around the seam.
4. Describe the boundaries that make the UI easy to test.

## Completion criteria

- the component seam is named
- the state boundary is named
- the interaction path is explicit
