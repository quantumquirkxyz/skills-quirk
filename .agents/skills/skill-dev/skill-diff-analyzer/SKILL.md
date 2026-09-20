---
name: skill-diff-analyzer
category: skill-dev
maturity: experimental
version: 1
description: Compare Skill versions and explain contract, dependency, and behavior impact — use when assessing changes between two Skills.
capabilities:
  - apply skill diff analyzer workflow
  - produce skill diff analyzer artifact
  - validate skill diff analyzer completion criteria
outputs:
  - Skill Diff Analyzer artifact with findings, decisions, recommendations, and validation notes
sideEffects: []
dependencies: []
stopCondition: Compare Skill versions and explain contract, dependency, and behavior impact complete; artifact saved; completion criteria checked.
risk: low
trustTier: 1
maxIterations: 6
---

## Operating Contract

- **Input:** Skill Diff Analyzer request, relevant context, constraints, and source evidence.
- **Output:** Skill Diff Analyzer artifact with findings, decisions, recommendations, and validation notes.
- **Side effects:** follow the frontmatter declaration; do not broaden scope without explicit user direction.
- **Dependencies:** declared dependencies, referenced skills, and source materials required by the task.
- **Stop condition:** Compare Skill versions and explain contract, dependency, and behavior impact is complete, evidence is captured, and completion criteria are checked.
- **Risk:** use the frontmatter risk classification and call out any escalation.
- **Boundary:** stay within the skill's declared scope, trust tier, and side-effect policy.

# Skill Diff Analyzer

## Contract

- Input: two readable `SKILL.md` files.
- Output: frontmatter changes, content additions/removals, dependency impact, and review recommendation.
- Boundary: compare files without editing either version.

Run `node .agents/skills/platform/skill-lab.mjs diff <old>/SKILL.md <new>/SKILL.md`. Treat changes to dependencies, side effects, or risk as review-required, and inspect additions/removals for accidental contract drift.

## Rules

- Rule: compare frontmatter, contract, rules, steps, references, and side-effect policy separately.
- Rule: treat risk, trust tier, dependencies, outputs, and stop condition changes as behavior changes.
- Rule: distinguish editorial expansion from routing or execution drift.
- Rule: recommend review when a change broadens authority or changes external side effects.

## Completion Criteria

- frontmatter and body changes are summarized separately
- behavior-impacting changes are called out
- review recommendation is explicit
