---
name: contribution-workflow-optimizer
category: delivery
maturity: experimental
version: 1
description: Inspect changed Skills and recommend contribution improvements across standards, docs, tests, and examples; use when eva
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


# Contribution Workflow Optimizer

## Contract

- Input: a pull-request base reference and changed Skill files.
- Output: prioritized checks for contract, documentation, dependencies, tests, and examples.
- Boundary: recommend changes only; implementation and merge remain separate workflows.

Run `node .agents/skills/platform/skill-lab.mjs pr-check --base main`. Use its changed-file list as the scope, then validate each changed Skill and check for documentation and examples before recommending merge.

## Rules

- Rule: scope findings to changed Skills unless the change exposes a repository-wide regression.
- Rule: separate blockers, required fixes, and advisory improvements.
- Rule: check frontmatter, body contract, dependencies, references, validators, and examples independently.
- Rule: treat generated or lockfile changes as evidence to verify, not as proof of quality.
- Rule: recommend the smallest contributor action that restores merge readiness.

## Steps

1. Identify base ref, changed Skill files, lockfile changes, and related docs.
2. Run the PR check and repository validators.
3. Inspect each changed Skill for contract clarity, side effects, outputs, dependencies, and completion criteria.
4. Check examples, references, and tests for drift.
5. Produce prioritized recommendations with evidence and owner-friendly wording.

## Completion Criteria

- changed-file scope is explicit
- validation evidence is captured
- findings are prioritized by merge impact
- recommendation states whether the contribution is ready
