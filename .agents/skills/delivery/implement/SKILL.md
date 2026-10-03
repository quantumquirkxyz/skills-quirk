---
name: implement
category: delivery
maturity: stable
version: 2
description: Implement a piece of work based on a spec or set of tickets, or build a scoped fix that can be handed off for publication. This skill stops at the implemented, validated branch.
capabilities:
  - apply implement workflow
  - produce implement artifact
  - validate implement completion criteria
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
dependencies: []
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
compatibility: [to-tickets, publish-open-pr, tdd, gate-ci]
approvalRequired: false
approvalFor: []
---

## Contract

- Input: one ticket or spec with concrete acceptance criteria, current repo state, explicit seams, optional feature flags.
- Output: `ImplementArtifact` (JSON schema + Markdown view). See `.agents/skills/platform/schemas/implement-schema.json`.
- Scope: execute approved work; do not reopen spec decisions unless blocked by a real defect or missing dependency.
- Rule: a ticket is executable only when its acceptance criteria are concrete and blockers are resolved.
- Rule: prefer one seam; make seam choice explicit before coding.
- Rule: break into tracer-bullet vertical slices; each slice: implement → validate → commit.
- Rule: use TDD at pre-agreed seams (see `tdd` skill).
- Rule: when implementing incomplete features, use feature flags via `feature-flag` skill and document the flag in the artifact.
- Rule: trunk-based workflow — short-lived branches (< 24h), push to origin, feature flags for incomplete features.
- Rule: run quality gates after each slice — gate-ide on file-save, gate-pre-commit before commit, gate-ci before PR.
- Rule: do not proceed to `publish-open-pr` until `gate-ci` passes.
- Rule: do not open or merge PR here; stop at validated branch.

Implement the work described by the user in the spec or tickets.

Follow the issue workflow in `AGENTS.md` for branch creation and publication handoff.
When the work comes from a spec or ticket set that expects a dedicated issue branch, create a new branch from the current branch before editing, so it inherits the current branch state and history. Name the branch formally from the issue reference, for example `feat/issue-28-consolidate-simulation-notebook-runtime-entry-points`, unless the user or spec explicitly names a different branch. After the local branch is ready, push the same branch name to `origin` so it is available for review and publication.

Use /tdd where possible, at pre-agreed seams.

Run typechecking regularly, single test files regularly, and the full test suite once at the end.

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

## Artifact

Emit `ImplementArtifact` as both:
- JSON: `.agents/skills/platform/artifacts/implement/{issue-id}.json`
- Markdown view: same filename with `.md` extension

Validate the JSON against `.agents/skills/platform/schemas/implement-schema.json` before saving.

Quality gate results are included in `ImplementArtifact.qualityGateResults`.

## Completion criteria

- the acceptance criteria are satisfied in the repo state
- validation ran at the appropriate seam and at the appropriate breadth
- the implementation note captures what changed and what was verified
- any skipped validation is explicitly justified
- feature flags documented if applicable
- the work is committed on the dedicated issue branch with conventional commit messages
- `ImplementArtifact` emitted and validated at `.agents/skills/platform/artifacts/implement/{issue-id}.json`
- `gate-ide` passed on final file-save
- `gate-pre-commit` passed before final commit
- `gate-ci` passed before PR publication

---
@include .agents/skills/platform/contract-base.xml
