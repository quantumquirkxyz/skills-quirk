---
description: "Orchestrate a bounded multi-agent refinement graph that runs after grill-with-docs to update and improve the little things left over from grilling. Agents dynamically invoke any canonical skill they need (search, brainstorming, research, grill-with-docs, grilling, code-review, etc.) based on the context and objective, using graph-skill-routing for discovery and loop-engineering for bounded iteration. Stops at refined-awaiting-review without publishing or implementing."
---
# automatic-refinement

When to use: Orchestrate a bounded multi-agent refinement graph that runs after grill-with-docs to update and improve the little things left over from grilling. Agents dynamically invoke any canonical skill they need (search, brainstorming, research, grill-with-docs, grilling, code-review, etc.) based on the context and objective, using graph-skill-routing for discovery and loop-engineering for bounded iteration. Stops at refined-awaiting-review without publishing or implementing.

## Workflow

1. Read the canonical skill at .agents/skills/routing/automatic-refinement/SKILL.md and execute its Process.

## Deliverables

- refinement artifact

## Guardrails

- risk: medium; trust tier: 3; approval required: yes
- side effects: write-temp-file
- isolation: none; model tier: reasoning

Stop when: Loop-engineering reports converged, budget-exceeded, no-progress, or ping-pong; all agent skill invocations have valid typed handoffs; a RefinementArtifact is emitted at refined-awaiting-review or a typed terminal failure is returned.
