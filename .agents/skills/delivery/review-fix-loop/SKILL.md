---
name: "review-fix-loop"
category: "delivery"
maturity: "stable"
version: "1"
description: "Orchestrate the PR repair loop: run review-pr, use plan-review-fixes when findings exist, use implement-review-fixes to apply them, and repeat until the PR is clean or blocked. This skill coordinates the loop only."
license: "MIT"
capabilities:
  - apply review fix loop methods within explicit delivery boundaries
  - analyze orchestrate the pr repair loop: run review-pr, use plan-review-fixes when findings exist, use implement-review-fixes to apply them, and repeat until the pr is clean or blocked. this skill coordinates the loop only with assumptions, constraints, and failure modes
  - produce and validate a delivery artifact with evidence, decisions, and next steps
outputs: "ReviewFixLoopArtifact with saga checkpoints, operationId, fixed-point fence, budgets, reconciliation evidence, and either a clean review state or a blocked repair loop with a documented cause."
sideEffects:
  - write-code
  - post-pr-comment
  - commit-git
  - push-branch

dependencies:
  - review-pr
  - plan-review-fixes
  - implement-review-fixes
stopCondition: "Orchestrate the PR repair loop: run review-pr, use plan-review-fixes when findings exist, use implement-review-fixes to apply them, and repeat until the PR is clean or blocked complete; artifact saved; completion criteria checked."
risk: "medium"
trustTier: "3"
maxIterations: "6"
promptVersion: "2.0"
artifactType: "ReviewFixLoopArtifact"
modelTier: "reasoning"
evaluators: ["behavioral", "regression"]
fixturesPath: .agents/skills/platform/fixtures/behavioral/review-fix-loop.json
diataxis: "how-to"
tags: ["delivery"]
compatibility: []
approvalRequired: "true"
approvalFor: ["write-code", "post-pr-comment", "commit-git", "push-branch"]
clauses:
  - id: REVIEW-FIX-LOOP-1
    text: "Stop instead of restating the same repair when a pass would post the same review-fix plan without a new finding."
    check: "evals/behavioral/review-fix-loop.json#REVIEW-FIX-LOOP-1"
  - id: REVIEW-FIX-LOOP-2
    text: "Stop and report the blocker when the same blocking condition repeats for three consecutive loop passes."
    check: "evals/behavioral/review-fix-loop.json#REVIEW-FIX-LOOP-2"
  - id: REVIEW-FIX-LOOP-3
    text: "Never widen scope during a repeat pass unless a new review finding makes it unavoidable."
    check: "evals/behavioral/review-fix-loop.json#REVIEW-FIX-LOOP-3"
reloadPolicy: on-trigger
---

## Contract

- Input: one PR, one fixed point, and one spec source when needed.
- Output: either a clean review state or a blocked repair loop with a documented cause.
- Scope: stay within the skill's declared boundaries; do not broaden without explicit direction.
- Rule: documented standards override defaults; explicit project rules take precedence.
- Rule: if blocked by missing context or dependencies, surface the blocker before proceeding.
- Contract metadata: carry `loopId`, `ledgerRef`, `budget`, `progressEvidence`, `recoveryPolicy`, and `status`; carry `operationId` for comments, code, git, or other external effects.
- Standard statuses are `planned`, `completed`, `blocked`, `needs-approval`, `outcome-unknown`, `stale-input`, `validation-failed`, `budget-exceeded`, `repeated-action`, `superseded`, and `rolled-back`.
- Budget precedence is caller budget > loop budget > retry policy; no inherited limit may be relaxed. Unknown effect results require reconciliation by `operationId` before repeating the effect.
- Saga metadata MUST include `dryRun`, `fixedPoint`, `revisionFence`, checkpoints, per-effect approvals, and rollback evidence. Dry-run may review and reconcile but cannot write code, comment, commit, or push.

## Provenance

| Question | Answer |
|---|---|
| What is the source of truth? | The user's request, originating spec/issue, and the skill's declared outputs |
| What is in scope? | Work covered by the skill's acceptance criteria and completion rules |
| What is explicitly out of scope? | Files, behaviors, and decisions outside the skill's declared boundary |
| Who or what consumes this artifact afterward? | The next skill in the workflow or the user |
| What evidence proves it is done? | Completion criteria met, artifact saved, validation passed |
| What risk remains? | Subjective judgment calls, missing context, or external dependency failures


## Maintenance handoff

A review finding that is an incident, defect, regression, or deferred corrective action MUST produce a `MaintenanceArtifact` handoff using `schemas/software-engineering/maintenance-artifact.schema.json`. Carry the source incident/defect digest, owner, PR fixed point and revision fence, impact, rollback/mitigation, verification evidence, next corrective consumer, and documentation/provenance refresh. End with exactly one closure state: `resolved-with-evidence`, `corrective-ticket-created`, `accepted-risk-with-owner-and-expiry`, or `blocked`; a missing owner, stale review/diagnosis, regression, or unverified fix remains `blocked` or returns to `implement-fixes`. Preserve the existing review, approval, checkpoint, reconciliation, and deferral rules.

## Artifact

Emit `ReviewFixLoopArtifact` as both:
- JSON: `.agents/skills/platform/artifacts/review-fix-loop/{identifier}.json`
- Markdown view: same filename with `.md` extension


# Review Fix Loop

## Overview

Coordinate review, planning, and implementation without diluting any one skill's responsibility. The review remains the measurement instrument; this skill decides whether to plan fixes, implement them, repeat, or hand off to ship-subissue.
Use the canonical work-item metadata format in [`docs/reference/agents/work-item-format.md`](../../../../docs/reference/agents/work-item-format.md) as the source of truth for labels, milestone, and project metadata when preserving the loop state in comments or handoffs.
Keep the loop tight: if the same review-fix plan would be posted again without a new finding, stop rather than restating the same repair in different words.


## Inputs

- PR number or current branch with an associated PR.
- Fixed point for review-pr, such as `main`, a base branch, a commit SHA, or a tag.
- Spec source when review-pr cannot infer one.

If the fixed point is missing, ask for it before starting. If the PR is missing, identify it with `gh pr view` or stop.

## Workflow

The machine states are `review`, `plan-fixes`, `implement-fixes`, `verify`, `completed`, `blocked`, and `repeated-action`. Transitions MUST record `progressEvidence` and append to `ledgerRef`.

1. Run review-pr.
   - Use the user-provided fixed point.
   - Preserve the output exactly enough that plan-review-fixes can cite Standards and Spec separately.

2. Decide.
   - If Standards and Spec both have no findings, stop the loop and tell the user the PR is ready for ship-subissue.
   - If either axis has findings, continue.
   - Recoverable failures (`stale-input`, `validation-failed`, transient remote errors, and `outcome-unknown`) continue through bounded retry, reconciliation, and a fresh re-review; they are not terminal blockers.
   - If the same blocking condition repeats for three consecutive loop passes, stop and report the blocker instead of looping indefinitely.
   - If the latest review changes only wording but not substance, treat it as the same blocker.
   - If a conflicted branch state was resolved, rerun review-pr on the cleaned branch before deciding whether to plan more fixes or hand off to ship-subissue.

3. Plan.
   - Use plan-review-fixes to turn the review findings into a PR comment headed `## Review Fix Plan`.
   - Treat the PR comment as the durable handoff between review and implementation.

4. Implement.
   - Use implement-review-fixes to apply the latest planned fixes.
   - Require local validation or an explicit explanation of skipped validation before the next review pass.
   - If the branch is conflicted, resolve that branch state first with `resolving-merge-conflicts`, then return here and continue the review-fix plan.

5. Repeat.
   - Run review-pr again against the same fixed point.
   - Continue until clean or blocked.
   - Do not widen scope during a repeat pass unless a new review finding makes it unavoidable.
   - After degeneration or `repeated-action`, do not restart the identical review/plan/implementation sequence; change the approach or transition to `blocked`.

6. Recover and fence.
  - Before every external effect, write a checkpoint and verify the same PR head, base fixed point, and review revision; stale data returns `stale-input`.
  - After a crash or unknown result, reconcile by operationId, effect digest, PR head, and exact comment marker before retrying. Adopt existing effects; never duplicate comments, commits, pushes, or plans. If reconciliation cannot prove the outcome, return `outcome-unknown`.
  - Compensate only operation-owned comments or branch effects when explicitly supported; record rollback evidence and never claim rollback from a failed request.

### Recovery decision table

| Condition | Continue action | Terminal outcome |
|---|---|---|
| stale plan or revision fence | reconcile head/plan, refresh plan, re-review | `blocked` only when authority is missing or fence cannot be reconciled |
| validation failure | apply scoped fix, rerun validation, re-review | `blocked` only when no scoped fix or budget is exhausted |
| remote conflict | invoke conflict-resolution handoff, verify clean tree, re-review | `blocked` for unresolved conflict |
| unknown effect | reconcile by `operationId` and effect digest, adopt or retry once within budget | `outcome-unknown`, then `blocked` only if irreconcilable |
| repeated action | change approach and checkpoint; do not duplicate effect | `blocked` after repeat safeguard/budget |

`blocked` is reserved for missing authority/input, unresolved conflict, irreconcilable unknown effects, exhausted budget, or an explicit user stop. Every recovery attempt keeps idempotency, checkpoints, `operationId`, the fixed-point fence, and repeat safeguards.

## Loop State

Track these facts in the working response or PR comments:

- PR number and branch.
- Fixed point.
- Review pass count.
- Whether the last plan was posted.
- Whether the last implementation completed.
- Validation commands and results.
- Any metadata that must stay aligned with the linked issue: labels, milestone, and project fields.

## Exit Conditions

- **Clean:** review-pr reports no Standards findings and no Spec findings. Say that ship-subissue may proceed when the user wants merge/close/project updates or when a separate ship step will handle them.
- **Blocked:** missing PR, missing fixed point, stale or contradictory plan, failing validation without an obvious scoped fix, or the same findings recurring after three passes.
- **User stop:** user pauses or redirects the loop.
- **Budget:** aggregate attempts, passes, effects, comments, commits, pushes, wall time, and compensation are exhausted; return `budget-exceeded` with the last checkpoint.

## Deferred Work

Some valid findings are not this PR's job: a real defect that belongs to another work item. Deferring one is allowed; dropping one is not, because a dropped finding turns into a surprise later.

- Rule: a finding may only be deferred with a named owner and a follow-up ticket. "Later", "backlog", and "someone" are not owners.
- Rule: record the deferred finding, its owner, and the follow-up ticket in the loop state and in the PR comment, so the next pass reads what was deferred instead of rediscovering it.
- Rule: a deferred finding that is missing either the owner or the ticket keeps the loop blocked, not clean.
- Rule: only out-of-scope findings may be deferred. A Standards finding that blocks the PR is repaired in the PR or the PR stays open.
- Rule: confirm on re-review that the deferral still holds: the follow-up ticket exists, is still open, and still describes the original finding.
- Rule: a follow-up ticket closed without the work being done, or an owner who no longer holds it, converts the deferral back into an open finding for the next pass.
- Rule: the exit summary reports the deferred list, so shipping the PR never hides what was postponed.

## Completion

- the skill's completion criteria are explicitly checked
- the artifact is saved and validated
- any blockers or skipped validations are documented
- the next consumer is identified or the work is handed off
- saga checkpoints, operationId, approvals, budgets, fixed-point fence, and reconciliation evidence are returned
---
@include .agents/skills/platform/contract-base.xml