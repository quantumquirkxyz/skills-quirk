---
name: ux-accessibility
category: ux
maturity: stable
version: 1
description: Design accessible UX — keyboard navigation, focus order, semantics, contrast, and assistive-technology support — with inclusive interaction patterns.
capabilities:
  - design accessible UX flows
  - identify task-level accessibility barriers
  - recommend inclusive interaction changes
outputs:
  - accessible UX review with task barriers, flow changes, and validation criteria
sideEffects: []
dependencies: []
stopCondition: Task-level accessibility barriers and flow-level remediations are explicit.
risk: low
trustTier: 1
maxIterations: 6
---

# ux-accessibility

Use this skill when reviewing or designing the accessibility of a user journey, not just individual UI components.

## Contract

- Input: user journey, tasks, states, constraints, and accessibility requirements or known barriers.
- Output: flow-level accessibility guidance with barriers, interaction changes, and validation criteria.
- Scope: accessible UX flows; component-level implementation details can use accessibility-design.
- Boundary: evaluate whether users can complete the task, recover from errors, and understand state changes.

## Rules

- Rule: inspect the whole task path, including setup, errors, loading, confirmation, and recovery.
- Rule: preserve multiple input modes: keyboard, touch, pointer, voice, and assistive technology where relevant.
- Rule: make state changes perceivable without relying on color, motion, or spatial memory alone.
- Rule: include cognitive load, reading clarity, timing pressure, and error prevention.
- Rule: define validation in terms of task completion, not only individual WCAG checks.

## Steps

1. Map the journey from entry point to completion and recovery.
2. Identify users, assistive technologies, input modes, and environmental constraints.
3. Review navigation, focus order, labels, feedback, errors, timing, and confirmation.
4. Rank barriers by task impact and likelihood.
5. Recommend flow, content, and component changes.
6. Define validation tasks and acceptance criteria.

## Completion Criteria

- journey and critical states are mapped
- barriers are tied to task completion
- remediation covers interaction and content
- validation criteria include realistic task paths
