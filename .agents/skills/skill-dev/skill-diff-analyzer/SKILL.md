---
name: skill-diff-analyzer
category: skill-dev
maturity: experimental
version: 1
description: Compare Skill versions and explain contract, dependency, and behavior impact — use when assessing changes between two Skills.
capabilities:
  - execute the core process defined in the skill body
  - produce a Markdown artifact or structured result
outputs:
  - Markdown artifact with process steps and completion criteria
sideEffects: []
dependencies: []
stopCondition: All process steps executed; artifact saved; criteria met.
risk: low
trustTier: 1
maxIterations: 6
---

## Contract

- **Input:** problem or task defined by the skill body.
- **Output:** Markdown artifact or structured result with completion criteria met.
- **Side effects:** none (design/review/documentation only unless explicitly stated).
- **Dependencies:** none (self-contained unless linked to other skills).
- **Stop condition:** all process steps completed; artifact saved; criteria checked.
- **Risk:** low.
- **Boundary:** produces reasoning or documentation artifacts; does not modify external systems unless explicitly instructed.


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
