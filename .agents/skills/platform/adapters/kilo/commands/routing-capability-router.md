---
description: "Route work to the best matching Skill using declared capabilities and compatibility — with explicit selection rules."
---
# capability-router

When to use: Route work to the best matching Skill using declared capabilities and compatibility — with explicit selection rules.

## Workflow

1. **Parse the task intent and required artifact type.**
2. **Match against declared capabilities and side effects.**
3. **Ask `skill-graph.mjs` to rank the candidate set.**
4. **Select the thinnest matching Skill.**
5. **Handle conflicts and surface blockers.**
6. **Produce and validate the CapabilityRouterArtifact.**

## Deliverables

- plan artifact

## Guardrails

- risk: low; trust tier: 1; approval required: no
- side effects: none
- isolation: none; model tier: router

Stop when: Route work to the best matching Skill using declared capabilities and compatibility complete; structured result returned; per-step completion criteria checked.
