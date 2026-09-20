---
name: mobile
category: frontend
maturity: stable
version: 1
description: Shape mobile projects around device constraints, offline behavior, and platform seams — with explicit performance and resilience boundaries.
capabilities:
  - apply mobile workflow
  - produce mobile artifact
  - validate mobile completion criteria
outputs:
  - Mobile artifact with findings, decisions, recommendations, and validation notes
sideEffects: []
dependencies: []
stopCondition: Shape mobile projects around device constraints, offline behavior, and platform seams complete; artifact saved; completion criteria checked.
risk: low
trustTier: 1
maxIterations: 6
---

## Operating Contract

- **Input:** Mobile request, relevant context, constraints, and source evidence.
- **Output:** Mobile artifact with findings, decisions, recommendations, and validation notes.
- **Side effects:** follow the frontmatter declaration; do not broaden scope without explicit user direction.
- **Dependencies:** declared dependencies, referenced skills, and source materials required by the task.
- **Stop condition:** Shape mobile projects around device constraints, offline behavior, and platform seams is complete, evidence is captured, and completion criteria are checked.
- **Risk:** use the frontmatter risk classification and call out any escalation.
- **Boundary:** stay within the skill's declared scope, trust tier, and side-effect policy.

# Mobile

Use this skill when the product needs to respect device constraints, offline behavior, or platform-specific UX. It should keep the seam explicit so the app can remain reliable across different device conditions.

## Contract

- Input: mobile brief, device constraints, and interaction context.
- Output: mobile seam proposal, device-flow guidance, and offline boundary guidance.
- Scope: design the mobile shape, not the full implementation.
- Rule: account for small screens, interruptions, and connectivity loss.
- Rule: make offline behavior explicit when it matters.
- Rule: keep platform-specific quirks visible rather than hidden behind generic advice.

## Steps

1. Identify the core mobile interaction path.
2. Define the seam around device and connectivity constraints.
3. Decide what must work offline or under interruption.
4. Describe the platform-specific behaviors that matter.

## Completion criteria

- the mobile seam is named
- the offline boundary is named
- the device constraints are explicit
