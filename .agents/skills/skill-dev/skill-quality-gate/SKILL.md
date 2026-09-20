---
name: skill-quality-gate
category: skill-dev
maturity: stable
version: 1
description: Run and interpret the skill bundle quality gate across schema, lockfile, semantic, routing, placeholder, rule, metadata, and side-effect checks before promotion or publication.
capabilities:
  - run skill bundle validators
  - interpret semantic audit findings
  - identify placeholder and generic metadata risks
  - verify side-effect declarations against skill behavior
  - produce release readiness summaries
outputs:
  - Skill quality gate report with commands run, pass/fail status, warnings, blockers, and recommended fixes
sideEffects: []
dependencies:
  - skill-testing-framework
stopCondition: Quality gate commands are executed or blocked with reasons, findings are separated into blockers and warnings, and release readiness is stated.
risk: low
trustTier: 1
maxIterations: 5
---

## Operating Contract

- **Input:** changed skill paths, current repository state, and intended promotion or release target.
- **Output:** quality gate report with validation commands, exit status, findings, severity, and release recommendation.
- **Side effects:** none; this skill reports quality and does not edit skills or lockfiles.
- **Dependencies:** use `skill-testing-framework` for structural interpretation and sandbox-specific validation when needed.
- **Stop condition:** the user knows whether the skill bundle is ready to commit, promote, or publish.
- **Risk:** low because this skill is diagnostic, but false positives and false negatives should be called out.
- **Boundary:** do not silently fix files; hand off fixes to an implementation skill or act only when the user separately requested edits.

## Rules

- Rule: run the broadest available repository gate before claiming a skills release is clean.
- Rule: separate schema failures, lockfile drift, semantic warnings, routing issues, and documentation quality problems.
- Rule: treat placeholder bodies, generic metadata, missing explicit rules, and mismatched side effects as release risks even if parsing succeeds.
- Rule: report exact command names and whether each command passed, failed, or was skipped.
- Rule: when a command is unavailable, inspect nearby platform scripts before concluding the gate cannot run.
- Rule: avoid declaring success from a single narrow validator when changed skills affect lockfiles, symlinks, or generated registries.
- Rule: recommend fixes in priority order: correctness blockers, routing defects, unsafe side effects, quality debt, then optional cleanup.
- Rule: use `references/quality-gate-report-template.md` for release or handoff summaries.
- Rule: explain validator count differences using `references/validator-counts.md` before treating them as failures.

## Workflow

1. Identify changed skills and metadata files from git status or the user's scope.
2. Discover repository validation scripts under the skills platform directory.
3. Run structural, lockfile, semantic, and all-in-one gates when available.
4. Inspect output for warnings that should be promoted to blockers due to the requested release or promotion context.
5. If failures occur, map each failure to the responsible skill path and likely repair.
6. Return a compact readiness decision: ready, ready with warnings, or blocked.

## References

- `references/quality-gate-report-template.md` - compact release-readiness report format.
- `references/validator-counts.md` - explanation of expected count differences between structural and semantic checks.

## Completion Criteria

- validation command evidence is captured
- findings are grouped by severity and exact skill path
- release readiness is stated plainly
- skipped validation is justified
- next repairs are specific enough to execute without re-auditing from scratch
