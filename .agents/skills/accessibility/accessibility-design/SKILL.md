---
name: accessibility-design
category: accessibility
maturity: stable
version: 1
description: Design accessible interfaces — semantics, focus management, keyboard flows, contrast, and assistive-technology compatibility — with inclusive interaction patterns.
capabilities:
  - design accessible interaction patterns
  - review semantics, focus, and contrast
  - propose remediation for accessibility barriers
outputs:
  - accessibility design review with barriers, recommendations, and validation checks
sideEffects: []
dependencies: []
stopCondition: Accessibility barriers, design decisions, and validation checks are explicit.
risk: low
trustTier: 1
maxIterations: 6
---

# accessibility-design

Use this skill when designing or reviewing interface behavior for keyboard access, semantics, focus management, contrast, forms, errors, and assistive-technology compatibility.

## Contract

- Input: user flow, component or screen description, target users, platform constraints, and any accessibility requirements.
- Output: accessibility design guidance with barriers, remediations, validation checks, and residual risks.
- Scope: inclusive interface design; automated audits belong to accessibility-testing.
- Boundary: prioritize user tasks and assistive-technology behavior over checklist-only compliance.

## Rules

- Rule: define the primary task and interaction sequence before checking individual controls.
- Rule: specify semantic roles, labels, names, states, and relationships.
- Rule: preserve keyboard access, visible focus, logical focus order, and escape paths.
- Rule: treat color, motion, timing, and error recovery as accessibility concerns.
- Rule: include manual validation steps for screen reader and keyboard behavior when possible.

## Steps

1. Identify the task, users, devices, and assistive technologies in scope.
2. Map the interaction path, focus order, and state changes.
3. Review semantics, labels, contrast, motion, target size, and error handling.
4. Identify barriers and rank them by task impact.
5. Recommend design and implementation changes with acceptance checks.
6. Document validation steps and any remaining risks.

## Completion Criteria

- task and assistive-technology assumptions are explicit
- barriers are tied to user impact
- remediation guidance is concrete
- validation checks cover keyboard and screen-reader behavior
