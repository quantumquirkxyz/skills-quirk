---
description: "This skill should be used when assessing or improving software carbon intensity, energy use, embodied hardware impact, workload efficiency, or regional carbon intensity with source-qualified measurement and explicit performance, reliability, and cost trade-offs."
---
# green-software-engineering

When to use: This skill should be used when assessing or improving software carbon intensity, energy use, embodied hardware impact, workload efficiency, or regional carbon intensity with source-qualified measurement and explicit performance, reliability, and cost trade-offs.

## Workflow

1. Read the canonical skill at .agents/skills/engineering/green-software-engineering/SKILL.md and execute its Process.

## Deliverables

- green-software-artifact artifact

## Guardrails

- risk: medium; trust tier: 3; approval required: yes
- side effects: write-files
- isolation: worktree; model tier: reasoning

Stop when: GreenSoftwareArtifact is schema-valid, source-qualified, trade-offs are explicit, and verification gates are actionable
