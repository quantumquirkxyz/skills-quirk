---
name: side-effect-auditor
category: skill-dev
maturity: stable
version: 1
description: Audit skill side-effect, risk, trust tier, dependency, and boundary metadata against the actual workflow so mutating skills declare their operational authority honestly.
capabilities:
  - compare declared side effects to workflow behavior
  - identify understated or overstated risk metadata
  - check trust tier consistency
  - recommend metadata repairs for mutating skills
outputs:
  - Side-effect audit report with mismatches, severity, exact frontmatter fields, and recommended corrections
sideEffects: []
dependencies:
  - skill-quality-gate
stopCondition: Side-effect mismatches are classified with recommended frontmatter changes or the audited skills are confirmed consistent.
risk: low
trustTier: 1
maxIterations: 5
---

## Operating Contract

- **Input:** one or more skills, their frontmatter, body instructions, referenced workflows, and recent validation findings.
- **Output:** side-effect audit report with mismatches, severity, rationale, and recommended metadata changes.
- **Side effects:** none; this skill audits and recommends but does not edit metadata.
- **Dependencies:** use `skill-quality-gate` when the side-effect audit is part of a broader release check.
- **Stop condition:** every audited skill is classified as consistent, over-declared, under-declared, or blocked by missing evidence.
- **Risk:** low because this is a diagnostic workflow; the main risk is misclassifying operational authority.
- **Boundary:** do not assume a skill is safe because it has `sideEffects: []`; compare the full body and referenced files to the declaration.

## Rules

- Rule: inspect both frontmatter and body instructions before deciding whether side effects are accurate.
- Rule: treat create, update, delete, publish, send, schedule, deploy, commit, push, comment, assign, label, close, merge, and external-notification actions as side effects.
- Rule: identify under-declared side effects as blockers for promotion because they can cause unsafe automation.
- Rule: identify over-declared side effects as quality debt because they make safe skills appear riskier than necessary.
- Rule: compare risk and trust tier to the strongest declared or implied mutation, not the most common path.
- Rule: when a skill delegates mutation to another skill, verify whether that delegation is optional guidance or part of the required workflow.
- Rule: recommend exact frontmatter field changes instead of vague "tighten metadata" guidance.

## Workflow

1. Select the skills in scope from git status, a release list, or a category requested by the user.
2. Read each skill's frontmatter, contract, rules, workflow, and completion criteria.
3. Extract implied operations and compare them with declared `sideEffects`, `risk`, `trustTier`, and dependencies.
4. Classify each mismatch by severity: blocker, warning, or informational.
5. Recommend exact frontmatter updates and, when needed, body rule changes that make operational authority explicit.
6. Return a concise audit table or grouped list with paths and suggested changes.

## Completion Criteria

- every audited skill has a consistency classification
- blockers name the missing or incorrect side-effect declaration
- recommendations include exact field-level edits
- risk and trust tier mismatches are explained from skill text evidence
- the audit result can be fed directly into an implementation pass
