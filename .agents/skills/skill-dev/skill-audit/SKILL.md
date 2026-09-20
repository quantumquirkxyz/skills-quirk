---
name: skill-audit
category: skill-dev
maturity: experimental
version: 1
description: Audit the Skills bundle, lockfile, symlink parity, and contract drift — with actionable maintenance output.
capabilities:
  - apply skill audit workflow
  - produce skill audit artifact
  - validate skill audit completion criteria
outputs:
  - Skill Audit artifact with findings, decisions, recommendations, and validation notes
sideEffects: []
dependencies: []
stopCondition: Audit the Skills bundle, lockfile, symlink parity, and contract drift complete; artifact saved; completion criteria checked.
risk: low
trustTier: 1
maxIterations: 6
---

## Operating Contract

- **Input:** Skill Audit request, relevant context, constraints, and source evidence.
- **Output:** Skill Audit artifact with findings, decisions, recommendations, and validation notes.
- **Side effects:** follow the frontmatter declaration; do not broaden scope without explicit user direction.
- **Dependencies:** declared dependencies, referenced skills, and source materials required by the task.
- **Stop condition:** Audit the Skills bundle, lockfile, symlink parity, and contract drift is complete, evidence is captured, and completion criteria are checked.
- **Risk:** use the frontmatter risk classification and call out any escalation.
- **Boundary:** stay within the skill's declared scope, trust tier, and side-effect policy.

# Skill Audit

Use this skill to verify the repository-local Skills platform.

## Contract

- Input: the local Skills bundle, lockfile, symlink tree, and platform schemas.
- Output: a concise audit report with warnings and errors ranked by impact.
- Scope: verify bundle health; do not modify the skills during the audit.
- Rule: report parity, lock coverage, and contract drift separately.
- Rule: treat validator output as evidence, not as the audit itself.
- Rule: distinguish inventory drift, symlink drift, and contract drift so the maintenance action is obvious.
- Rule: if the bundle is healthy, say so explicitly instead of summarizing only the validator.

## Steps

1. Run the platform validator in `.agents/skills/platform/validate-skills.mjs`.
2. Run the semantic auditor in `.agents/skills/platform/audit-semantics.mjs` when the audit includes templates, retired names, Markdown links, or contract drift.
3. Inspect the output for missing canonical skills, broken `.claude/` links, and lockfile drift.
4. Inspect the inventory for stale aliases or mismatched metadata that the validator may not classify crisply.
5. Summarize findings as a prioritized maintenance report.

## Completion criteria

- `.agents/` and `.claude/` parity is checked
- the lockfile coverage gap is reported
- any missing manifest or contract issue is surfaced
- the report is prioritized and actionable
- the validator result is captured in the audit evidence
- semantic audit output is captured when run
- the report states whether the bundle is healthy, warning-only, or failing
