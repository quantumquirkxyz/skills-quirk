---
description: Orchestrate a bounded multi-agent refinement run that turns an idea into an evidence-backed draft and stops at refined-awaiting-review without publishing or implementing it.
---
# automatic-refinement

When to use: Orchestrate a bounded multi-agent refinement run that turns an idea into an evidence-backed draft and stops at refined-awaiting-review without publishing or implementing it.

## Workflow

1. Read the canonical skill at .agents/skills/routing/automatic-refinement/SKILL.md and execute its Process.

## Deliverables

- refinement artifact

## Guardrails

- risk: medium; trust tier: 3; approval required: yes
- side effects: write-temp-file
- isolation: none; model tier: reasoning

Stop when: All mandatory roles have valid handoffs, synthesis is independently verified, and a RefinementArtifact is emitted at refined-awaiting-review or a typed terminal failure is returned.
