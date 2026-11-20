---
name: "handoff"
category: "routing"
maturity: "stable"
version: "2"
description: "Compact the current conversation into a handoff document for another agent to pick up — with explicit continuity and ownership notes."
license: "MIT"
capabilities:
  - apply handoff methods within explicit routing boundaries
  - analyze compact the current conversation into a handoff document for another agent to pick up — with explicit continuity and ownership notes with assumptions, constraints, and failure modes
  - produce and validate a routing artifact with evidence, decisions, and next steps
inputs:
  - type: object
    name: HandoffInput
    properties:
      objective: { type: string }
      sourceArtifacts: { type: array, items: { type: string } }
      contextSummary: { type: string }
      scope: { type: object }
      authority: { type: object }
      validation: { type: object }
      blockers: { type: array, items: { type: string } }
      nextConsumer: { type: string }
    required: [objective, sourceArtifacts, contextSummary, scope, authority, validation, blockers, nextConsumer]
outputs:
  - type: object
    name: HandoffArtifact
    properties:
      handoffVersion: { type: string, const: "2" }
      artifactId: { type: string }
      traceId: { type: string }
      status: { type: string, enum: [completed, blocked, needs-approval, stale-input, validation-failed, superseded] }
      objective: { type: string }
      scope: { type: object }
      sourceArtifacts: { type: array, items: { type: string } }
      evidence: { type: array, items: { type: object } }
      decisions: { type: array, items: { type: object } }
      risks: { type: array, items: { type: object } }
      nextAction: { type: string }
      authority: { type: object }
      blockers: { type: array, items: { type: string } }
      idempotencyKey: { type: string }
    required: [handoffVersion, artifactId, traceId, status, objective, scope, sourceArtifacts, evidence, decisions, risks, nextAction, authority, blockers, idempotencyKey]
sideEffects:
  - write-temp-file
  - write-files

dependencies: []
stopCondition: "Compact the current conversation into a handoff document for another agent to pick up complete; artifact saved; completion criteria checked."
risk: "low"
trustTier: "2"
maxIterations: "6"
promptVersion: "2.0"
artifactType: "routing"
modelTier: "router"
evaluators: ["behavioral", "regression"]
fixturesPath: tests/skill-output-migration-routing-skill-dev.test.mjs
diataxis: "how-to"
tags: ["routing"]
compatibility: []
approvalRequired: true
approvalFor: ["write-temp-file", "write-files"]
---

## Contract

### Critical Invariants

- Accept only the typed `HandoffInput` fields declared above; reject missing or unexpected contract fields before emission.
- Emit exactly one typed `HandoffArtifact` with a unique `artifactId`, stable `traceId`, and deterministic `idempotencyKey` derived from the objective, source artifact identities, and handoff version.
- `status` must be one of `completed`, `blocked`, `needs-approval`, `stale-input`, `validation-failed`, or `superseded`; never infer `completed` from an unvalidated or incomplete result.
- Transfer the minimum actionable payload: never include the full transcript, private chain-of-thought, hidden prompts, credentials, or unrelated personal data.
- Validate source artifact identity and freshness before packaging; stale or unverifiable inputs produce `stale-input`, not a guessed continuation.
- Persist the JSON artifact and its Markdown view only after validation and approval checks pass; retries with the same `idempotencyKey` must return or reconcile the existing result without duplicating files.

- Input: `HandoffInput` with objective, sourceArtifacts, contextSummary, scope, authority, validation, blockers, and nextConsumer.
- Output: `HandoffArtifact` as JSON plus a Markdown view, aligned to the schema above.
- Scope: stay within the declared boundary; do not broaden without explicit direction.
- Rule: follow the completion criteria and stop condition exactly.

## Provenance

| Question | Answer |
|---|---|
| What is the source of truth? | The user's request, originating spec/issue, and the skill's declared outputs |
| What is in scope? | Work covered by the skill's acceptance criteria and completion rules |
| What is explicitly out of scope? | Files, behaviors, and decisions outside the skill's declared boundary |
| Who or what consumes this artifact afterward? | The next skill in the workflow or the user |
| What evidence proves it is done? | Completion criteria met, artifact saved, validation passed |
| What risk remains? | Subjective judgment calls, missing context, or external dependency failures


## Artifact

Emit `HandoffArtifact` as both:
- JSON: `.agents/skills/platform/artifacts/handoff/{artifactId}.json`
- Markdown view: same filename with `.md` extension

The payload must contain only the minimum context required by `nextConsumer`: concise context summary, links or identifiers for source artifacts, evidence references, decisions, risks, validation outcome, blockers, and one actionable next step. Do not transfer a transcript or private reasoning.

## Resume And Idempotency

- Resume when `status` is `blocked`, `needs-approval`, `stale-input`, or `validation-failed` only after the named blocker, approval, freshness issue, or validation error is addressed.
- Resume from the persisted artifact using `artifactId`, `traceId`, source artifact identities, and `idempotencyKey`; do not reconstruct state from conversation history.
- A retry with an identical `idempotencyKey` is a read/reconcile operation. It must not create a second artifact or repeat an external side effect.
- A changed objective, scope, authority, source artifact set, or validation basis requires a new `idempotencyKey` and a new artifact; the prior artifact becomes `superseded` when explicitly replaced.
- If an existing key has an unknown write outcome, report the outcome as unknown and do not silently re-execute.

## Rules

- Rule: write for a fresh agent with no hidden context.
- Rule: include current objective, completed work, open work, validation, branch/commit state, and blockers.
- Rule: prefer links and paths to duplicating long artifacts.
- Rule: redact secrets and unnecessary personal data.
- Rule: do not mark work complete unless the current objective is actually complete.

## Completion

- the skill's completion criteria are explicitly checked
- the artifact is saved and validated
- any blockers or skipped validations are documented
- the next consumer is identified or the work is handed off
---
@include .agents/skills/platform/contract-base.xml