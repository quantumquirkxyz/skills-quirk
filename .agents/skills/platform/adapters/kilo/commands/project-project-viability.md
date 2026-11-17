---
description: "Evaluate whether a project is viable, functional, and scalable by analyzing its codebase against CONTEXT.md and ADRs. Use when the user wants a structured assessment of project health, architectural soundness, and growth boundaries before committing to further work."
---
# project-viability

When to use: Evaluate whether a project is viable, functional, and scalable by analyzing its codebase against CONTEXT.md and ADRs. Use when the user wants a structured assessment of project health, architectural soundness, and growth boundaries before committing to further work.

## Workflow

1. Pre-flight check
2. Gather context
3. Map the codebase
4. Automated baseline
5. Spawn parallel sub-agents
6. Quality gate
7. Aggregate findings
8. Write the report

## Deliverables

- project-viability artifact

## Guardrails

- risk: low; trust tier: 1; approval required: yes
- side effects: write-files
- isolation: worktree; model tier: reasoning

Stop when: Pre-flight checks recorded; automated baseline completed; three parallel sub-agents executed; quality gate passed; Markdown and JSON reports saved under .reports/; ProjectViabilityArtifact with assessment, score, evidence, confidence, risks, recommendations, and report paths returned; completion criteria verified; no implementation or project changes performed.
