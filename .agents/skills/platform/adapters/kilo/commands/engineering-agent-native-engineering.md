---
description: "AI-Native Engineer skill stack: spec literacy, context engineering, orchestration, and quality ownership — plan with agents, maintain AGENTS.md, run agents in parallel, review diffs line by line, own quality gates."
---
# agent-native-engineering

When to use: AI-Native Engineer skill stack: spec literacy, context engineering, orchestration, and quality ownership — plan with agents, maintain AGENTS.md, run agents in parallel, review diffs line by line, own quality gates.

## Workflow

1. **Assess spec literacy** — Read the spec, tickets, and AGENTS.md. Compute a spec literacy score (0–100). List gaps, ambiguities, and blockers
2. **Engineer context** — Build or verify the context pack. Confirm ordered reads and provenance for every input. Rate context quality as complete, partial, or missing
3. **Design orchestration** — Separate work into parallelizable and sequential tracks. Define handoffs between agents. Assign each task to a compatible quirk Skill
4. **Own quality gates** — Run lint, typecheck, tests, and review-pr. Record passed, failed, and pending gates. Block on failures
5. **Produce recommendations** — Emit concrete, actionable recommendations based on the assessment. Each recommendation names the skill, the action, and the expected outcome

## Deliverables

- engineering-assessment artifact

## Guardrails

- risk: medium; trust tier: 3; approval required: yes
- side effects: write-files
- isolation: worktree; model tier: reasoning

Stop when: Engineering assessment complete with spec literacy score, context quality rating, orchestration plan, and quality gate status
