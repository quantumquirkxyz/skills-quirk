---
name: contribution-workflow-optimizer
category: delivery
maturity: stable
version: 1
description: Inspect changed Skills and recommend contribution improvements across standards, docs, tests, and examples; use when eva
capabilities:
  - apply contribution workflow optimizer workflow
  - produce contribution workflow optimizer artifact
  - validate contribution workflow optimizer completion criteria
outputs:
  - Contribution Workflow Optimizer artifact with findings, decisions, recommendations, and validation notes
sideEffects: []
dependencies: []
stopCondition: Inspect changed Skills and recommend contribution improvements across standards, docs, tests, and examples complete; artifact saved; completion criteria checked.
risk: low
trustTier: 1
maxIterations: 6
---

## Operating Contract

- **Input:** Contribution Workflow Optimizer request, relevant context, constraints, and source evidence.
- **Output:** Contribution Workflow Optimizer artifact with findings, decisions, recommendations, and validation notes.
- **Side effects:** follow the frontmatter declaration; do not broaden scope without explicit user direction.
- **Dependencies:** declared dependencies, referenced skills, and source materials required by the task.
- **Stop condition:** Inspect changed Skills and recommend contribution improvements across standards, docs, tests, and examples is complete, evidence is captured, and completion criteria are checked.
- **Risk:** use the frontmatter risk classification and call out any escalation.
- **Boundary:** stay within the skill's declared scope, trust tier, and side-effect policy.

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
