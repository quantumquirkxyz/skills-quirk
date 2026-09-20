---
name: implement-review-fixes
category: delivery
maturity: stable
version: 1
description: Read a GitHub PR remediation plan produced by plan-review-fixes, implement the planned corrections through the repositor
capabilities:
  - apply implement review fixes workflow
  - produce implement review fixes artifact
  - validate implement review fixes completion criteria
outputs:
  - Implement Review Fixes artifact with findings, decisions, recommendations, and validation notes
sideEffects:
  - write-code
  - commit-git
  - push-branch
dependencies: []
stopCondition: Read a GitHub PR remediation plan produced by plan-review-fixes, implement the planned corrections through the repositor complete; artifact saved; completion criteria checked.
risk: medium
trustTier: 3
maxIterations: 6
---

## Operating Contract

- **Input:** Implement Review Fixes request, relevant context, constraints, and source evidence.
- **Output:** Implement Review Fixes artifact with findings, decisions, recommendations, and validation notes.
- **Side effects:** follow the frontmatter declaration; do not broaden scope without explicit user direction.
- **Dependencies:** declared dependencies, referenced skills, and source materials required by the task.
- **Stop condition:** Read a GitHub PR remediation plan produced by plan-review-fixes, implement the planned corrections through the repositor is complete, evidence is captured, and completion criteria are checked.
- **Risk:** use the frontmatter risk classification and call out any escalation.
- **Boundary:** stay within the skill's declared scope, trust tier, and side-effect policy.

# Implement Review Fixes

## Overview

Execute an existing review correction plan. This skill treats the PR comment as the source of truth, applies only scoped corrections, and leaves the PR ready for another review-pr pass. Use `references/implementation-note.md` as the canonical completion shape.

The completion note still needs the familiar closing sections that make the handoff explicit:

- Status: implemented
- Scope Notes
If the planned fixes are blocked by a conflicted branch state, hand off to `resolving-merge-conflicts` first, then resume the review-fix plan on the clean branch state.
When the fix plan references tracker metadata, use [`docs/agents/work-item-format.md`](../../../../docs/agents/work-item-format.md) so labels, milestone, and project context remain consistent with the linked issue.
If a planned item no longer matches the diff, stop and refresh the plan instead of improvising around it.

## Workflow

1. Identify the PR and branch.
   - Prefer an explicit PR number from the user.
   - Otherwise run `gh pr view --json number,headRefName,baseRefName,url,title`.
   - Confirm the current branch matches the PR head branch before editing.

2. Read the current plan.
   - Fetch PR comments with `gh pr view <number> --comments`.
   - Use the latest comment headed `## Review Fix Plan` with `Status: planned`.
   - Stop if no plan exists; run plan-review-fixes first.

3. Validate the plan against the current diff.
   - Confirm the files or symbols named in the plan still exist.
   - Check whether any item is already fixed; mark it complete in your local working notes and do not rework it.
   - If the diff has moved enough that the plan is stale, stop and ask for a new plan-review-fixes pass.
   - If the branch is conflicted, stop and hand off to `resolving-merge-conflicts` before trying to apply the plan.

4. Implement scoped fixes.
   - Use the implement workflow for the actual edits.
   - Prefer test-first fixes when a finding maps to observable behavior.
   - Keep each correction local to the finding that motivated it.
   - Avoid opportunistic refactors unless the plan explicitly requires them.
   - If a fix changes behavior beyond the original finding, pause and send the PR back through review-pr.

5. Validate.
   - Run targeted tests or checks named in the plan.
   - Run repo-level typecheck/lint/test commands when the change surface justifies it.
   - If a planned item cannot be validated locally, state the reason in the PR completion note.
   - Validation should cover the exact failure mode the finding identified, not an adjacent check.

6. Report completion on the PR.
   - Comment with heading `## Review Fix Implementation`.
   - Include completed items, validation commands, failures or skipped checks, and any remaining blockers.
   - Do not mark the PR clean; only a later review-pr pass can do that.

## Completion Comment Format

Use the structure in `references/implementation-note.md`.

## Guardrails

- Never implement without a current Review Fix Plan.
- Never broaden scope beyond review findings unless the user explicitly asks.
- Never merge or close the PR.
- If implementation changes the intended behavior beyond the original spec, stop and send the PR back through review-pr.
- Never introduce tracker metadata that conflicts with the linked issue's labels or milestone.
