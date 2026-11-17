---
description: "Evaluate a Skill with versioned baseline/candidate experiments for routing, completion, safety, artifact validity, evaluator reliability, and regression risk."
---
# evaluate-skill

When to use: Evaluate a Skill with versioned baseline/candidate experiments for routing, completion, safety, artifact validity, evaluator reliability, and regression risk.

## Workflow

1. Read the canonical skill at .agents/skills/skill-dev/evaluate-skill/SKILL.md and execute its Process.

## Deliverables

- skill-dev artifact

## Guardrails

- risk: low; trust tier: 1; approval required: no
- side effects: none
- isolation: none; model tier: reasoning

Stop when: The versioned evaluation manifest is validated; required baseline/candidate trials, negative scenarios, judge checks, evidence checks, and thresholds are either completed or explicitly typed BLOCKED/NOT-RUN; artifact is saved and completion criteria checked.
