---
description: "Run a bounded multi-agent refinement graph after grill-with-docs. Route canonical skills from the context and objective, enforce typed handoffs and bounded iteration, and stop at refined-awaiting-review without publishing or implementing."
---
# automatic-refinement

When to use: Run a bounded multi-agent refinement graph after grill-with-docs. Route canonical skills from the context and objective, enforce typed handoffs and bounded iteration, and stop at refined-awaiting-review without publishing or implementing.

## Workflow

1. Read the canonical skill at .agents/skills/routing/automatic-refinement/SKILL.md and execute its Process.

## Deliverables

- refinement artifact

## Guardrails

- risk: medium; trust tier: 3; approval required: yes
- side effects: write-temp-file
- isolation: none; model tier: reasoning

Stop when: Loop-engineering reports converged, budget-exceeded, no-progress, or ping-pong; all agent skill invocations have valid typed handoffs; a RefinementArtifact is emitted at refined-awaiting-review or a typed terminal failure is returned.
