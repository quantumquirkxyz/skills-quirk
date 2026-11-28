---
name: publish-open-pr
category: routing
maturity: stable
version: 2
description: Use when the user wants to publish a finished subissue as an open GitHub pull request from an already-prepared issue branch — with scoped, auditable publication.
license: MIT
capabilities:
  - produce publish open pr artifact
  - validate publish open pr completion criteria
  - trace publish open pr decisions across inputs, constraints, and failure paths
  - validate routing outcomes with evidence, assumptions, and explicit next steps
inputs:
  - operationId or idempotencyKey (optional for backward compatibility)
  - fixedPoint (optional legacy alias for the prepared branch revision)
  - validated issue branch, linked issue identity/metadata, PR bundle metadata, and quality gate results
outputs:
  - type: object
    name: PublishOpenPrArtifact
    properties:
      status: { type: string, enum: [planned, completed, blocked, needs-approval, outcome-unknown, stale-input, validation-failed, budget-exceeded, repeated-action, superseded, rolled-back] }
      branch: { type: string }
      commitSha: { type: string, pattern: "^[0-9a-fA-F]{40}$" }
      prNumber: { type: integer }
      prUrl: { type: string }
      title: { type: string }
      validation: { type: object }
      gateCiResult: { type: object }
      reviewers: { type: array, items: { type: string } }
      labels: { type: array, items: { type: string } }
      issueMetadata: { type: object }
      prMetadata: { type: object }
      mutationEvidence: { type: array, items: { type: object } }
      checkpoint: { type: object }
      operationId: { type: string }
      recoveryStatus: { type: string, enum: [planned, completed, blocked, needs-approval, outcome-unknown, stale-input, validation-failed, budget-exceeded, repeated-action, superseded, rolled-back] }
      reconciliationEvidence: { type: array, items: { type: object } }
      dryRun: { type: boolean }
      saga: { type: object }
    required: [status, branch, prNumber, prUrl, title, validation, gateCiResult]
sideEffects:
  - push-branch
  - create-pull-request
capabilityRequirements:
  - engineering-preflight (required for software publication)
  - testing (required for validation evidence)
dependencies: []
stopCondition: Use when the user wants to publish a finished subissue as an open GitHub pull request from an already-prepared issue branch complete; structured result returned; completion criteria checked.
risk: medium
trustTier: 3
maxIterations: 6
modelTier: router
promptVersion: "2.0"
artifactType: publish-open-pr
evaluators:
  - behavioral
  - regression
  - traceability
fixturesPath: tests/skill-output-migration-routing-skill-dev.test.mjs
diataxis: how-to
tags: [routing, pr, publication, quality-gate]
compatibility: [review-pr, ship-subissue]
approvalRequired: true
approvalFor: [push-branch, create-pull-request]
clauses:
  - id: PUBLISH-OPEN-PR-1
    text: "Never open a PR before every mandatory gate has passed on the exact pushed commit; skipped, blocked, partial, and unknown outcomes prevent publication."
    check: "evals/behavioral/publish-open-pr.json#PUBLISH-OPEN-PR-1"
  - id: PUBLISH-OPEN-PR-2
    text: "Never create or amend commits here, and never merge the PR or close the issue; those belong to implement and ship-subissue."
    check: evals/behavioral/publish-open-pr.json#PUBLISH-OPEN-PR-2
  - id: PUBLISH-OPEN-PR-3
    text: "Take the linked issue labels and milestone as the source of truth for PR metadata."
    check: evals/behavioral/publish-open-pr.json#PUBLISH-OPEN-PR-3
  - id: PUBLISH-OPEN-PR-4
    text: "Confirm branch scope and prerequisites first, and stop to ask for clarification when the intended scope is unclear."
    check: evals/behavioral/publish-open-pr.json#PUBLISH-OPEN-PR-4
reloadPolicy: always
---

## Contract

- Input: validated issue branch, linked issue metadata, PR bundle metadata, and quality gate results.
- Output: `PublishOpenPrArtifact` as structured output in the response. See `.agents/skills/platform/schemas/publish-open-pr-schema.json`.
- Scope: package, push, and publish a completed branch as an open PR; do not reopen implementation decisions.
- Rule: never open a PR before every mandatory gate has passed on the exact pushed commit.
- Rule: a real 40-character commit SHA is required; null, placeholder, invented, and stale SHAs are invalid.
- Rule: read the linked issue before changing files and reject files outside its declared scope or non-goals.
- Rule: push and PR creation run automatically after validating the exact commit SHA and required gates immediately before publication.
- Rule: never create or amend commits here; that belongs to `implement`.
- Rule: never merge the PR or close the issue here; that belongs to `ship-subissue`.
- Rule: the linked issue's complete metadata is the source of truth: identity, assignees, reviewer policy, labels (including state/triage classification), milestone, projects and item IDs, Project V2 fields, development linkage, and relationships.
- Compatibility: `operationId`, `idempotencyKey`, and `fixedPoint` are optional for legacy callers; supplied values must be echoed in `PublishOpenPrArtifact`.
- Side effect ownership: this skill owns pushing the prepared branch and creating one open PR automatically within the declared scope. It does not own commits, comments, merges, issue closure, or review decisions.
- Recovery invariant: write `checkpoint` before push, after push, and after PR lookup/create. On an unknown push or PR result, reconcile branch and PR state by branch, head revision, title, linked issue, and idempotency key before any retry. Adopt an existing matching PR; never create a second PR. Reconcile unknown commit/push outcomes by `operationId`, branch, and exact SHA; never blindly retry.
- Retry invariant: reconcile remote state and verify `fixedPoint` (or the prepared branch revision) before retrying. A changed revision returns `stale-input`; a failed gate returns `validation-failed`; a superseded branch returns `superseded`.
- Saga invariant: use one global `operationId`; checkpoint `planned`, `preflight`, `before-effect`, `after-effect`, and `reconciled` for each effect. `dryRun` may not push or create. Verify branch protection and the fixed-point/revision fence immediately before every effect.
- Unknown/repeat invariant: after crash or unknown outcome, reconcile by operationId plus branch, revision, title, issue, and PR URL/number; adopt one matching remote PR or return `outcome-unknown`. Repeated action returns `repeated-action`; compensation is limited to an operation-owned branch/PR and requires rollback evidence.

### Phase 2B Output Alignment

- The canonical workflow states are `planned`, `completed`, `blocked`, `needs-approval`, `outcome-unknown`, `stale-input`, `validation-failed`, `budget-exceeded`, `repeated-action`, `superseded`, and `rolled-back`. A legacy caller may omit `fixedPoint` or idempotency fields, but the artifact must preserve supplied values and report the omission as a validation limitation.
- `fixedPoint` is the immutable prepared branch revision fence: branch, commit SHA, base revision, source digests, and gate evidence must match it immediately before push and immediately before PR creation. Any mismatch is `stale-input` and performs no effect.
- Effect authority is explicit: `publish-open-pr` owns only `push-branch` and `create-pull-request`; implementation, commit creation, review decisions, merge, issue closure, and release approval belong to other skills. Each owned effect has a distinct approval record and checkpoint; `approvalFor` names both effects.
- Every invocation uses one `operationId` and an idempotency key derived from operation, branch, fixed point, and effect. Before retrying, reconcile by those identities and adopt exactly one matching remote result. An unverified push or PR result is `outcome-unknown`, never an automatic replay.
- The output must include `status`, `operationId`, `fixedPoint`, `dryRun`, `approvals`, `authority`, `checkpoint`, `mutationEvidence`, `reconciliationEvidence`, and `nextConsumer: review-pr`; `completed` requires verified push and open PR evidence on the exact fixed point.

## Provenance

| Question | Answer |
|---|---|
| What is the source of truth? | The linked issue metadata and the prepared branch state |
| What is in scope? | Packaging, pushing, and opening the PR |
| What is explicitly out of scope? | Implementation, review, merge, issue completion |
| Who or what consumes this artifact afterward? | `review-pr` |
| What evidence proves it is done? | Open PR exists, gate-ci passed, structured result returned |
| What risk remains? | Reviewer rejection; failing post-publish checks |

## Artifact

Return `PublishOpenPrArtifact` as structured output in the current response. Do not write local artifact files unless the user explicitly asks for an export.

## Process

### 1. Confirm scope

- Run `git status -sb`.
- Review the changed files and the relevant diff hunks.
- Confirm the current branch matches the dedicated issue branch and only contains that subissue's work.
- If the intended scope is unclear, stop and ask for clarification before opening the PR.

### 2. Verify prerequisites

- Confirm `git` is available.
- Confirm `gh` is available and `gh auth status` succeeds.
- Confirm the current branch can push to `origin`.

### 3. Run mandatory gates before opening PR

- Execute `gate-ci` against the current branch state.
- If a mandatory gate fails, is skipped, blocked, or has an unknown outcome, stop and report it rather than opening the PR.
- Record every skipped check and its reason in the artifact and PR body; never convert an unavailable check into `pass`.
- Summarize the gate-ci result in the PR body or PR metadata; do not write a local gate artifact.

### 4. Run the smallest relevant validation

- Follow [Validation](references/validation.md).
- If validation fails, stop and report it rather than changing the branch here.

### 5. Prepare the PR bundle

- Follow [PR Body](references/pr-body.md).
- Run the bundled read-only renderer from this skill directory:
  `python3 scripts/render_pr_bundle.py --base <base> --issue <number> --validation "<command>: <result>" --out /tmp/pr.json --body-file /tmp/pr-body.md`.
  It reads git and (when `gh` is available) the linked issue, and never pushes or edits a PR.
- Use explicit temporary files only when required by `gh pr create --body-file`; delete or ignore them after the PR is opened.
- If the repository already has a PR template, fill it in rather than replacing it.

### 6. Push the branch and open a PR

- Use `git push -u origin <branch>`.
- Verify the linked issue identity before mutation and resolve assignees/reviewers by login, never by `@me`. Copy labels, milestone, project/item IDs, relationships, and development linkage according to the explicit PR-copy policy in the body/schema; preserve unsupported fields as `unsupported` or `partial` evidence rather than fabricating mutations.
- Use resolved login values with `gh pr create`, then reconcile assignees, reviewers, labels, milestone, projects, and linkage. This skill owns only push/open-PR effects.
- If GitHub rejects the non-draft PR path with a diff-resolution error for this prepared branch, retry the same PR as `--draft` rather than stopping.
- Use a title that matches the subissue and the actual diff.

### 7. Hand off to the next workflow

- After the PR opens, the next workflow is `review-pr`.
- If review finds defects, hand off to `review-fix-loop`.
- When the latest review is clean, hand off to `ship-subissue` for merge and issue completion.

## Completion

- branch scope confirmed
- prerequisites verified
- all mandatory gates passed on the exact pushed commit
- validation completed
- PR bundle prepared from linked issue metadata
- branch pushed to origin
- open PR created with title, body, assignee, labels, milestone, and reviewers
- linked issue identity verified and all requested metadata/project/relationship outcomes recorded
- `PublishOpenPrArtifact` returned as structured output
- handoff to `review-pr` is explicit
- saga checkpoints, operationId, approvals, budgets, and reconciliation evidence are returned

---
@include .agents/skills/platform/contract-base.xml

## P0/P1 Workflow Controls

- `dryRun` performs local packaging and remote reconciliation only; push and PR creation each require separate approval.
- Persist the common snapshot and exact command evidence at every checkpoint; resume from the first unconfirmed effect after a crash.
- Reconcile by operation key, branch, fixed point, head revision, title, and linked issue after unknown results; adopt matching remote state and never duplicate a PR.
- Compensation is limited to operation-owned branch/PR effects. Terminal statuses remain canonical: `planned`, `completed`, `blocked`, `needs-approval`, `outcome-unknown`, `validation-failed`, `superseded`, `rolled-back`.

## Release Readiness Boundary

Publication may provide candidate evidence, but `ship-subissue` owns the release-candidate handoff. Preserve fixed point, digest, SBOM/VEX/provenance, owner, approval, rollback, canary/rollout evidence, and next consumer without widening this skill's push/PR side effects.

Publication note: push is a separate approved effect from implementation and commit creation.
