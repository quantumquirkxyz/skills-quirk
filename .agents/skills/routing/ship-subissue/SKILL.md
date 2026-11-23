---
name: "ship-subissue"
category: "routing"
maturity: "stable"
version: "1"
description: "Use when a finished subissue already has a clean PR and you need to merge it, mark it as completed, and close the linked issue — with release discipline."
license: "MIT"
capabilities:
  - apply ship subissue methods within explicit routing boundaries
  - analyze use when a finished subissue already has a clean pr and you need to merge it, mark it as completed, and close the linked issue — with release discipline with assumptions, constraints, and failure modes
  - produce and validate a routing artifact with evidence, decisions, and next steps
inputs:
  - operationId or idempotencyKey (optional for backward compatibility)
  - fixedPoint (optional; identifies the reviewed PR/commit state)
  - approved PR, linked issue, review result, and repository context
outputs:
  - type: object
    name: ShipSubissueArtifact
    properties:
      status: { type: string, enum: [planned, completed, blocked, needs-approval, outcome-unknown, stale-input, validation-failed, budget-exceeded, repeated-action, superseded, rolled-back] }
      checkpoint: { type: object }
      operationId: { type: string }
      recoveryStatus: { type: string, enum: [planned, completed, blocked, needs-approval, outcome-unknown, stale-input, validation-failed, budget-exceeded, repeated-action, superseded, rolled-back] }
      reconciliationEvidence: { type: array, items: { type: object } }
      dryRun: { type: boolean }
      saga: { type: object }
sideEffects:
  - merge-pull-request
  - close-issue
  - update-project

dependencies: []
stopCondition: "Use when a finished subissue already has a clean PR and you need to merge it, mark it as completed, and close the linked issue complete; structured result returned; completion criteria checked."
risk: "high"
trustTier: "4"
maxIterations: "6"
promptVersion: "2.0"
artifactType: ship-subissue
modelTier: "router"
evaluators: ["behavioral", "regression"]
fixturesPath: tests/skill-output-migration-routing-skill-dev.test.mjs
diataxis: "how-to"
tags: ["routing"]
compatibility: []
approvalRequired: "true"
approvalFor: ["merge-pull-request", "close-issue", "update-project"]
clauses:
  - id: SHIP-SUBISSUE-1
    text: "Never merge a PR with unresolved Standards or Spec review findings; return to review-fix-loop instead."
    check: "evals/behavioral/ship-subissue.json#SHIP-SUBISSUE-1"
  - id: SHIP-SUBISSUE-2
    text: "Never mark an issue complete unless the linked issue reference is clear, and never guess the issue number."
    check: "evals/behavioral/ship-subissue.json#SHIP-SUBISSUE-2"
  - id: SHIP-SUBISSUE-3
    text: "Never delete the branch before the merge has succeeded."
    check: "evals/behavioral/ship-subissue.json#SHIP-SUBISSUE-3"
reloadPolicy: always
---

## MCP Exposure

This high-trust workflow is not exposed over MCP; it requires explicit local approval for merge, issue-closing, and project updates.

## Contract

- Input: skill invocation with the user's request and available context.
- Output: a structured artifact or guidance aligned to the skill's declared outputs.
- Scope: stay within the skill's declared boundaries; do not broaden without explicit direction.
- Rule: follow the skill's completion criteria and stop condition exactly.
- Compatibility: `operationId`, `idempotencyKey`, and `fixedPoint` are optional for legacy callers; preserve supplied values in `ShipSubissueArtifact`.
- Side effect ownership: this skill owns one approved PR merge, project completion update, and linked issue closure; each requires explicit approval. It does not own code changes, review fixes, or PR creation.
- Recovery invariant: checkpoint before merge, after merge, after project update, and after issue closure. If any result is unknown, reconcile PR, commit, project item, and issue state before retrying. Existing matching state is adopted; never duplicate merge, completion comment, or closure.
- Retry invariant: reconcile remote state and verify `fixedPoint` before every retry. Changed review/commit state returns `stale-input`; missing approval returns `needs-approval`; unresolved review or validation returns `validation-failed`; superseded work returns `superseded`.
- Saga invariant: use one global `operationId`; checkpoint `planned`, `preflight`, `before-effect`, `after-effect`, and `reconciled` for merge, project update, and closure. `dryRun` is read/reconcile-only. Each effect has separate approval; verify branch protection, fixed-point/revision fence, and clean review immediately before it.
- Unknown/repeat invariant: after crash or unknown outcome, reconcile by operationId, PR, commit, project item, issue, and exact comment marker; adopt existing state and never duplicate merge, comment, completion, or closure. Repeated action returns `repeated-action`; compensation is limited to operation-owned project/issue updates and must include rollback evidence.

## Provenance

| Question | Answer |
|---|---|
| What is the source of truth? | The user's request, originating spec/issue, and the skill's declared outputs |
| What is in scope? | Work covered by the skill's acceptance criteria and completion rules |
| What is explicitly out of scope? | Files, behaviors, and decisions outside the skill's declared boundary |
| Who or what consumes this artifact afterward? | The next skill in the workflow or the user |
| What evidence proves it is done? | Completion criteria met, structured result returned, validation passed |
| What risk remains? | Subjective judgment calls, missing context, or external dependency failures


## Artifact

Return `ShipSubissueArtifact` as structured output in the current response. Do not write local artifact files unless the user explicitly asks for an export.


# Ship Subissue

Merge one approved repository-local subissue PR, including a corrective subissue PR, mark the subissue as completed, and close out the linked issue when needed.
Use the canonical work-item format in [`docs/reference/agents/work-item-format.md`](../../../../docs/reference/agents/work-item-format.md) when deciding what metadata to preserve: linked-issue labels and milestone are the source of truth, and the completion note should not introduce conflicting tracker metadata.

## Workflow

### Configurable transition policy

The caller supplies a label/project-state matrix. The default is `pr-opened` => `in-progress`/`review`, and verified merge => `done`/`completed`. Descriptive labels are preserved. Protected states (`blocked`, `needs-info`, `needs-triage`, `wontfix`) are never overwritten or removed by this workflow.

1. Confirm the target.
   - Read the open PR with `gh pr view`.
   - Confirm the PR still belongs to the current branch and subissue.
   - Confirm the linked issue reference is clear.
   - Confirm the branch is clean and no conflicted branch state remains from merge/rebase or review-request follow-up work; if it is conflicted, return to `resolving-merge-conflicts` before shipping.
2. Confirm review is clean.
   - Only proceed if the last `review-pr` pass was clean on both Standards and Spec.
   - If review is not clean, stop and return to `review-fix-loop`.
3. Merge the PR.
   - Use `gh pr merge <number>` with the repository's accepted merge strategy.
   - Verify the merge commit before any downstream mutation.
4. Update project state, then issue state and labels.
    - Apply the configured matrix only after merge verification; record typed applied, skipped, unsupported, and partial mutation fields.
    - Reconcile project item and issue state before retrying any unknown effect.
5. Close or complete the issue.
   - If the workflow uses an explicit completion state, update it to reflect that the subissue is done.
   - If GitHub does not auto-close the linked issue, close it with `gh issue close <number> --comment "Merged in PR #<number>."`
   - Do not guess the issue number.
6. Delete the branch only after merge verification and successful/reconciled downstream checkpoints, then record completion.
   - Leave a short note on the PR or issue summarizing the merge and completion state.

## Guardrails

- Never merge with unresolved review findings.
- Never mark an issue complete unless the linked reference is clear.
- Never delete the branch before the merge has succeeded.
- Sequence is merge verification -> project update -> issue state/labels -> close -> branch deletion.
- Every step is idempotent and resumes from a checkpoint; unknown effects reconcile by `operationId`, PR, merge commit, project item ID, and issue identity.

## Completion

- the skill's completion criteria are explicitly checked
- the structured result is returned and validated
- any blockers or skipped validations are documented
- the next consumer is identified or the work is handed off
- saga checkpoints, operationId, approvals, budgets, and reconciliation evidence are returned
---
@include .agents/skills/platform/contract-base.xml
## P0/P1 Workflow Controls

- `dryRun` reconciles merge, project, and issue state without mutating any remote resource; merge, project update, and closure each require separate approval.
- Persist a common snapshot and command evidence before and after each side effect; resume from the first unconfirmed checkpoint after a crash.
- Reconcile by operation key, PR, fixed point, commit, project item, and issue after unknown results; adopt matching state and never duplicate merges, comments, or closures.
- Compensate only operation-owned project or issue changes where supported. Terminal statuses are `planned`, `completed`, `blocked`, `needs-approval`, `outcome-unknown`, `validation-failed`, `superseded`, and `rolled-back`.

## ReleaseCandidateArtifact Handoff

Emit a schema-valid `ReleaseCandidateArtifact` using `schemas/software-engineering/release-candidate-artifact.schema.json` for `release-management`. It must bind the reviewed fixed point and source digests and include SBOM, VEX, provenance/attestation, named owner, approval evidence, verification, rollback plan and verification, canary/rollout evidence, and `nextConsumer: release-management`. Reject shipping when verification or rollback evidence is absent, stale, contradictory, or unowned. Preserve merge, issue-close, and project-update approval boundaries.
