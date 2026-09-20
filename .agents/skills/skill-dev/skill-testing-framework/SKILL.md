---
name: skill-testing-framework
category: skill-dev
maturity: stable
version: 1
description: Validate Skill structure, contracts, dependencies, anti-patterns, and isolated execution — use when checking a Skill before promotion.
capabilities:
  - apply skill testing framework workflow
  - produce skill testing framework artifact
  - validate skill testing framework completion criteria
outputs:
  - Skill Testing Framework artifact with findings, decisions, recommendations, and validation notes
sideEffects: []
dependencies: []
stopCondition: Validate Skill structure, contracts, dependencies, anti-patterns, and isolated execution complete; artifact saved; completion criteria checked.
risk: low
trustTier: 1
maxIterations: 6
---

## Operating Contract

- **Input:** Skill Testing Framework request, relevant context, constraints, and source evidence.
- **Output:** Skill Testing Framework artifact with findings, decisions, recommendations, and validation notes.
- **Side effects:** follow the frontmatter declaration; do not broaden scope without explicit user direction.
- **Dependencies:** declared dependencies, referenced skills, and source materials required by the task.
- **Stop condition:** Validate Skill structure, contracts, dependencies, anti-patterns, and isolated execution is complete, evidence is captured, and completion criteria are checked.
- **Risk:** use the frontmatter risk classification and call out any escalation.
- **Boundary:** stay within the skill's declared scope, trust tier, and side-effect policy.

# Skill Testing Framework

## Contract

- Input: a Skill path and optional sandbox execution request.
- Output: structural findings and, for sandbox Skills, execution evidence and a promotion recommendation.
- Boundary: use existing repository validators; do not silently mutate canonical Skills.

Run the shared validator with `node .agents/skills/platform/skill-lab.mjs validate <path> --json`, then run the existing sandbox and behavioral validators for execution evidence. Treat unknown dependencies, missing outputs, placeholder text, and contradictory risk declarations as failures or warnings rather than silently accepting them.

## Rules

- Rule: run structural validation before behavioral or sandbox validation.
- Rule: treat placeholder bodies and generic outputs as quality risks even when schemas pass.
- Rule: preserve validator output as evidence, but add human interpretation for impact.
- Rule: do not promote a Skill when dependencies, side effects, or stop condition are ambiguous.

## Completion Criteria

- structural validator result is captured
- behavioral or sandbox evidence is captured when applicable
- promotion recommendation names blockers and warnings separately
