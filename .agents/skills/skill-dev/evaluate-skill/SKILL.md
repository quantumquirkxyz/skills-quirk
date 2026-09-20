---
name: evaluate-skill
category: skill-dev
maturity: experimental
version: 1
description: Evaluate a Skill against fixed scenarios for routing, completion, and artifact validity.
capabilities:
  - apply evaluate skill workflow
  - produce evaluate skill artifact
  - validate evaluate skill completion criteria
outputs:
  - Evaluate Skill artifact with findings, decisions, recommendations, and validation notes
sideEffects: []
dependencies: []
stopCondition: Evaluate a Skill against fixed scenarios for routing, completion, and artifact validity complete; artifact saved; completion criteria checked.
risk: low
trustTier: 1
maxIterations: 6
---

## Operating Contract

- **Input:** Evaluate Skill request, relevant context, constraints, and source evidence.
- **Output:** Evaluate Skill artifact with findings, decisions, recommendations, and validation notes.
- **Side effects:** follow the frontmatter declaration; do not broaden scope without explicit user direction.
- **Dependencies:** declared dependencies, referenced skills, and source materials required by the task.
- **Stop condition:** Evaluate a Skill against fixed scenarios for routing, completion, and artifact validity is complete, evidence is captured, and completion criteria are checked.
- **Risk:** use the frontmatter risk classification and call out any escalation.
- **Boundary:** stay within the skill's declared scope, trust tier, and side-effect policy.

# Evaluate Skill

Use this skill to check whether a Skill behaves predictably.

Scenario fixtures live in [`scenarios/`](scenarios/). They describe expected routes and static assertions for representative project-development workflows.
Behavioral fixtures live in [`behavioral-fixtures/`](behavioral-fixtures/). They describe representative artifact outputs that templates should continue to produce.

Use the deterministic runner when you need a repeatable regression check:

```bash
node .agents/skills/platform/evaluate-scenarios.mjs
node .agents/skills/platform/evaluate-behavioral-fixtures.mjs
```

## Steps

1. Load the Skill manifest and representative fixtures from `scenarios/`.
2. Run the static scenario evaluator when deterministic validation is enough.
3. Run the behavioral fixture evaluator after changing templates or artifact formats.
4. Check routing, output shape, stop condition, and safety behavior.
5. Check that the skill's contract matches the shape of its actual effects: routing-only skills should not write, write-capable skills should declare their side effects, and read-only skills should stay read-only.
6. Record the failures as regression cases by adding or updating a scenario or behavioral fixture.

## Rules

- Rule: separate routing failures, artifact-shape failures, and contract mismatches.
- Rule: preserve deterministic runner output as evidence.
- Rule: add or update fixtures when a failure represents a regression class.
- Rule: do not promote a Skill whose declared side effects differ from observed behavior.
- Rule: treat missing stop conditions or vague outputs as evaluability defects.

## Completion criteria

- the Skill passes or fails against a fixed scenario set
- regressions are captured in writing
- contract mismatches are called out separately from scenario failures
- the scenario runner result is captured when the deterministic runner applies
- behavioral fixture output is captured when templates or artifact formats changed
