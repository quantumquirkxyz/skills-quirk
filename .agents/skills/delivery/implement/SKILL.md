---
name: implement
category: delivery
maturity: stable
version: 2
description: Implement a piece of work based on a spec or set of tickets, or build a scoped fix that can be handed off for publication. This skill stops at the implemented, validated branch.
license: MIT
capabilities:
  - produce implement artifact
  - validate implement completion criteria
  - trace implement decisions across inputs, constraints, and failure paths
  - validate delivery outcomes with evidence, assumptions, and explicit next steps
inputs:
  - spec or ticket with concrete acceptance criteria
  - current repo state
  - explicit seams
  - optional feature flags
outputs:
  - type: object
    name: ImplementArtifact
    properties:
      status: { type: string, enum: [completed, blocked, partial] }
      changes: { type: array, items: { type: string } }
      validation: { type: object }
      commitSha: { type: string }
      branch: { type: string }
      nextConsumer: { type: string }
      blockedBy: { type: array, items: { type: string } }
      riskRemaining: { type: string }
      qualityGateResults: { type: object }
    required: [status, nextConsumer, validation, qualityGateResults]
sideEffects:
  - write-code
  - commit-git
  - push-branch
dependencies:
  - tdd
stopCondition: Implement a piece of work based on a spec or set of tickets, or build a scoped fix that can be handed off for publication complete; artifact saved; completion criteria checked.
risk: medium
trustTier: 3
maxIterations: 6
modelTier: code
promptVersion: "2.0"
artifactType: implementation
evaluators: [behavioral, regression, traceability, quality-bar]
fixturesPath: .agents/skills/platform/fixtures/behavioral/implement.json
diataxis: how-to
tags: [tdd, delivery, implementation, testing]
compatibility: [to-tickets, publish-open-pr, tdd, gate-ide, gate-pre-commit, gate-ci]
approvalRequired: true
approvalFor: ["write-code", "commit-git", "push-branch"]
clauses:
  - id: IMPLEMENT-1
    text: "Treat a ticket as executable only when its acceptance criteria are concrete and its blockers are resolved."
    check: "evals/behavioral/implement.json#IMPLEMENT-1"
  - id: IMPLEMENT-2
    text: "Require an explicit user request or prior workflow approval before any repository-mutating side effect (write-code, commit-git, push-branch)."
    check: "evals/behavioral/implement.json#IMPLEMENT-2"
  - id: IMPLEMENT-3
    text: "Do not open or merge a PR here; stop at the validated branch and do not proceed to publish-open-pr until gate-ci passes."
    check: "evals/behavioral/implement.json#IMPLEMENT-3"
  - id: IMPLEMENT-4
    text: "Drive tracer-bullet vertical slices with TDD at pre-agreed seams: implement, validate, commit, per slice."
    check: "evals/behavioral/implement.json#IMPLEMENT-4"
reloadPolicy: on-trigger
---

## Contract

- Artifact contract: emit `ImplementArtifact` using `schemas/software-engineering/implement-artifact.schema.json`; put implementation details in `payload` and retain the full envelope fields.
- `payload` must include the same `operationId`, fixed-point commit/ref and source digests used for the run; list changed files with before/after digests and command provenance (argv, resolved executable/version, cwd, exit status, output digest, timestamp).
- Record tests run and skipped with reasons, coverage denominator/result, mutation evidence, security evidence, performance evidence, independent verifier identity/result, approvals, blockers, and canonical status. A transcript, plan, screenshot, or self-attestation is never evidence of execution.
- Reject stale source or a fixed-point mismatch. Partial validation must be disclosed and yields `blocked`, `validation-failed`, or `outcome-unknown`, never `completed`.

- Input: one ticket or spec with concrete acceptance criteria, current repo state, explicit seams, optional feature flags.
- Output: `ImplementArtifact` (JSON schema + Markdown view). See `.agents/skills/platform/schemas/implement-schema.json`.
- Scope: execute approved work; do not reopen spec decisions unless blocked by a real defect or missing dependency.
- Rule: a ticket is executable only when its acceptance criteria are concrete and blockers are resolved.
- Rule: prefer one seam; make seam choice explicit before coding.
- Rule: break into tracer-bullet vertical slices; each slice: implement → validate → commit.
- Rule: use TDD at pre-agreed seams (see `tdd` skill).
- Rule: when implementing incomplete features, use feature flags via `feature-flag` skill and document the flag in the artifact.
- Rule: trunk-based workflow — short-lived branches (< 24h), push to origin, feature flags for incomplete features.
- Rule: side effects that change repository state (`write-code`, `commit-git`, `push-branch`) require an explicit user request or prior workflow approval before execution.
- Rule: run quality gates after each slice — gate-ide on file-save, gate-pre-commit before commit, gate-ci before PR.
- Rule: do not proceed to `publish-open-pr` until `gate-ci` passes and the independent verifier records a matching fixed point, source digests, changed-file set, and canonical `completed` verification status.
- Rule: do not open or merge PR here; stop at validated branch.

The `gate-ide`, `gate-pre-commit`, and `gate-ci` names are compatibility labels for the repository's validation workflows, not canonical skill dependencies. Run their equivalent validation commands when available and record the results in `qualityGateResults`.

See `.agents/skills/prompts/implement/v2.md` for the canonical prompt.

Implement the work described by the user in the spec or tickets.

Follow the issue workflow in `AGENTS.md` for branch creation and publication handoff.
When the work comes from a spec or ticket set that expects a dedicated issue branch, create a new branch from the current branch before editing, so it inherits the current branch state and history. Name the branch formally from the issue reference, for example `feat/issue-28-consolidate-simulation-notebook-runtime-entry-points`, unless the user or spec explicitly names a different branch. After the local branch is ready, push the same branch name to `origin` so it is available for review and publication.

Use /tdd where possible, at pre-agreed seams.

Run typechecking regularly, single test files regularly, and the full test suite once at the end.

## Why

Artifact-first design keeps the handoff machine-readable. A typed `ImplementArtifact` lets downstream skills (`publish-open-pr`, `tdd`, `review-pr`) consume status, branch, commitSha, and qualityGateResults without parsing natural language. Typed outputs also make regression testing deterministic: fixtures can assert on exact fields rather than substring matches.

The process stops at the validated branch because merge decisions belong to `publish-open-pr`, which owns reviewer assignment, label strategy, and release metadata. Separating implementation from publication keeps each skill small and auditable.

## Provenance

Every artifact this skill produces must answer the quality bar:

| Question | Answer |
|---|---|
| What is the source of truth? | The originating spec or ticket reference |
| What is in scope? | Files and behaviors covered by the acceptance criteria |
| What is explicitly out of scope? | UI-layer changes, unrelated modules |
| Who or what consumes this artifact afterward? | `publish-open-pr` or `tdd` |
| What evidence proves it is done? | Passing tests + quality gates + validated branch |
| What risk remains? | Any skipped validation, legacy shims, or flagged technical debt |

## Process

### Tracer-Bullet Execution

1. Read the spec or ticket and confirm acceptance criteria are concrete.
2. Identify the seam and create the issue branch.
3. For each vertical slice:
   - Write a failing test (red).
   - Implement the minimal code to pass (green).
   - Run quality gates (validate).
   - Commit with a conventional message.
4. Run the full test suite and gate-ci.

### Quality Gate Sequence

Quality gates run at three scopes. See `references/quality-gates.md` for full details.

| Gate | Trigger | Scope |
|------|---------|-------|
| gate-ide | file-save | changed files only |
| gate-pre-commit | git-commit | changed files only |
| gate-ci | push-to-PR | full suite |

## Artifact

Emit `ImplementArtifact` as both:
- JSON: `.agents/skills/platform/artifacts/implement/{issue-id}.json`
- Markdown view: same filename with `.md` extension

Validate the JSON against `.agents/skills/platform/schemas/implement-schema.json` before saving.

Quality gate results are included in `ImplementArtifact.qualityGateResults`.

## Observability

Every execution is traced via `record-execution.mjs`. The trace includes traceId, spanId, model tier, duration, tool calls, and quality score.
Set `nextConsumer` to the next workflow skill (`publish-open-pr`, `tdd`, or a named handoff) so downstream automation can route the `ImplementArtifact` without parsing prose.

## Reference

- Vertical slicing rules: `references/vertical-slicing.md`
- Quality gates reference: `references/quality-gates.md`
- Validation script: `scripts/validate-implementation.sh`
- Canonical prompt: `.agents/skills/prompts/implement/v2.md`

## Completion criteria

- the acceptance criteria are satisfied in the repo state
- validation ran at the appropriate seam and at the appropriate breadth
- the implementation note captures what changed and what was verified
- any skipped validation is explicitly justified
- feature flags documented if applicable
- the work is committed on the dedicated issue branch with conventional commit messages and the artifact records the exact fixed-point/commit identity
- `ImplementArtifact` emitted and validated at `.agents/skills/platform/artifacts/implement/{issue-id}.json`
- `gate-ide` passed on final file-save
- `gate-pre-commit` passed before final commit
- `gate-ci` passed before PR publication
- `ImplementArtifact` and its paired `VerificationArtifact` are schema-validated; no transcript-only, fabricated-command, stale-source, mutation-survivor, security-omission, or undisclosed-partial claim is accepted

---
@include .agents/skills/platform/contract-base.xml

## P0/P1 Workflow Controls

- Accept optional `operationId`/`idempotencyKey` and `fixedPoint`; preserve them in `ImplementArtifact` for legacy callers.
- Require an explicit `dryRun` plan before any write, commit, or push, and separate approval for each declared side effect.
- Persist a common snapshot and checkpoint before and after every slice, including scope, branch, fixed point, command evidence, and validation results.
- After a crash or unknown command result, reconcile git state and artifact identity before retrying; never duplicate commits or pushes.
- Use compensation only for effects owned by this operation. Terminal statuses are `planned`, `running`, `completed`, `blocked`, `needs-approval`, `outcome-unknown`, and `validation-failed`.
