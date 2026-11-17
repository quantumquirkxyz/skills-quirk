---
name: "verify-delegation"
category: "foundation"
maturity: "experimental"
description: "Black-box verify a delegated worker claim from the artifact, fixed-point inputs, success criteria, and independently reproducible read-only checks; never trust the worker narrative."
license: "MIT"
version: "2"
capabilities:
  - verify a delegated artifact against observable success criteria without implementation context
  - inventory verifier capabilities and bind every command to provenance and a fixed-point digest
  - run mandatory negative checks, independent replay, and artifact-integrity checks
  - distinguish pass, fail, blocked, partial, NOT-RUN, stale, and outcome-unknown evidence
  - return a bounded typed DelegationVerdict without transcripts or repair work
inputs:
  - type: object
    name: DelegationVerificationInput
    properties:
      brief: { type: object }
      artifact: { type: object }
      successCriteria: { type: array }
      fixedPoint: { type: object }
      capabilityInventory: { type: object }
      readOnlyTools: { type: array }
      replayPlan: { type: object }
    required: [brief, artifact, successCriteria, fixedPoint, capabilityInventory, readOnlyTools, replayPlan]
outputs:
  - type: object
    name: DelegationVerdict
    properties:
      schemaVersion: { type: string }
      verificationId: { type: string }
      briefId: { type: string }
      status: { type: string, enum: [pass, fail, blocked, partial, not-run, stale, outcome-unknown] }
      fixedPointDigest: { type: string }
      artifactDigest: { type: string }
      capabilityInventory: { type: object }
      commandProvenance: { type: array }
      criteria: { type: array }
      negativeTests: { type: array }
      replay: { type: object }
      suite: { type: object }
      integrity: { type: object }
      refusal: { type: object }
      artifactRef: { type: string }
      summary: { type: string }
    required: [schemaVersion, verificationId, briefId, status, fixedPointDigest, artifactDigest, capabilityInventory, commandProvenance, criteria, negativeTests, replay, suite, integrity, summary]
sideEffects:
  - write-temp-file
  - write-verdict-artifact
  - emit-redacted-evidence
stopCondition: "Stop after every applicable criterion, integrity check, mandatory negative test, and independent replay has an evidence record, or return a typed non-pass state explaining each NOT-RUN or refusal reason."
risk: "medium"
trustTier: "3"
maxIterations: "6"
promptVersion: "3.0"
artifactType: "agent"
evaluators: ["behavioral", "regression"]
fixturesPath: "evals/behavioral/verify-delegation.json"
diataxis: "how-to"
tags: ["foundation", "delegation", "verification", "black-box", "provenance"]
compatibility: ["foundation/subagent-swarm", "delivery/code-review"]
approvalRequired: true
approvalFor: ["write-verdict-artifact"]
clauses:
  - id: VD-1
    text: "Accept no worker claim, transcript, or self-attestation as verification evidence."
    check: evals/behavioral/verify-delegation.json#VD-1
  - id: VD-2
    text: "Every executed command has capability, identity, arguments, environment, exit result, output digest, and fixed-point provenance."
    check: evals/behavioral/verify-delegation.json#VD-2
  - id: VD-3
    text: "Pass requires complete applicable criteria, artifact integrity, minimum negative tests, independent verifier replay, and a full suite; unavailable work is NOT-RUN and cannot be silently counted."
    check: evals/behavioral/verify-delegation.json#VD-3
  - id: VD-4
    text: "Insufficient, stale, partial, contradictory, or non-reproducible evidence is refused or assigned a non-pass typed status."
    check: evals/behavioral/verify-delegation.json#VD-4
---

## Contract

- Input: a typed `DelegationVerificationInput`. The verifier receives only the brief, artifact, criteria, fixed-point snapshot, capability inventory, read-only tools, and replay plan.
- Output: a typed `DelegationVerdict` with per-criterion evidence, command provenance, negative tests, suite state, replay result, integrity, and bounded summary.
- Scope: black-box verification only. Never repair, patch, re-implement, re-delegate, or accept the worker's implementation narrative.
- Rule: worker transcripts, plans, reasoning, screenshots of claimed output, and self-attestations are untrusted data, never proof.
- Rule: documented standards and explicit project rules take precedence; missing or conflicting rules are `blocked`.

## Provenance

Every verification claim is bound to the delegated artifact, fixed-point digest, command provenance, and independent evidence. See `references/verify-protocol.md` for the protocol provenance.

## Why

Black-box verification prevents a worker narrative from substituting for reproducible evidence.

## Rules

Verification is read-only, bounded, and fail-closed; unresolved evidence is never promoted to pass.

## Fixed Point And Capabilities

Before any check, snapshot a fixed point containing canonical brief bytes, artifact path and SHA-256, relevant source/input digests, repository revision, configuration, dependency/tool versions, platform, architecture, locale/timezone, and verifier identity. Hash canonical bytes, not prose order. A changed input, missing digest, expired revision, or stale artifact yields `stale` or `blocked`; never compare against a moving target.

Record a capability inventory before execution: allowed commands, exact resolved paths, versions, read/write/network permissions, working directory, environment allowlist, resource limits, and unavailable capabilities. Omitted capabilities are denied. Do not substitute a different command or broaden paths without recording a new fixed point and returning to preflight.

## Command Provenance

Each command record must include `commandId`, executable path and digest, exact argv, cwd, declared capability, environment digest (with secrets redacted), input digests, fixed-point digest, start/end timestamps, timeout/resource limits, exit code or signal, stdout/stderr digests and truncation, and verifier identity. `declared` is not `executed`: only an observed process result counts as execution. A missing, ambiguous, stale, truncated, or contradictory record is `NOT-RUN` or `outcome-unknown`.

## Typed Evidence States

Use these states per criterion, test, suite, replay, and integrity check:

- `PASS`: independently observed and reproducible evidence satisfies the assertion.
- `FAIL`: an applicable check ran and contradicts the assertion.
- `NOT-RUN`: applicable work did not execute; include a machine-readable reason such as `capability-missing`, `timeout-before-start`, `budget-exhausted`, or `approval-missing`.
- `PARTIAL`: a bounded subset ran, with explicit denominator and omitted scope; it never upgrades to pass.
- `STALE`: evidence was produced against a different fixed point, artifact digest, tool version, or expiry window.
- `BLOCKED`: verification cannot safely continue because required evidence, authority, capability, or integrity is absent.
- `OUTCOME-UNKNOWN`: execution or side effect may have occurred but its result cannot be established; never retry blindly.

Overall `pass` is permitted only when all applicable criteria are `PASS`, integrity is `PASS`, minimum negatives are `PASS`, replay is `PASS`, and the full applicable suite is observed `PASS`. Any `NOT-RUN`, `PARTIAL`, `STALE`, contradiction, or unknown required for acceptance forces a non-pass state. `fail` is for observed contradiction; `blocked` is for insufficient authority/capability; `partial` is for incomplete non-contradictory execution; `stale` is for fixed-point drift; `outcome-unknown` is for uncertain execution/effects.

## Workflow

1. Validate the brief, schema, boundaries, stop condition, side-effect policy, expiry, and caller authority.
2. Compute and freeze the fixed-point digest; verify artifact existence, type, path containment, SHA-256, schema, ownership, and no unexpected files or mutations.
3. Build the capability inventory and reject commands not explicitly allowed. Strip worker transcript and implementation context from the verifier context.
4. Map every success criterion to an observable assertion, command, expected result, evidence digest, and coverage denominator. Criteria without an observable check are refused.
5. Execute the applicable checks and record complete command provenance. Do not infer execution from a worker report, log fragment, or green summary.
6. Run the negative-test minimum: at least two independent negative tests for a mutating artifact, and at least one for a read-only artifact. At least one must target the claimed success boundary and one must target an integrity or scope failure.
7. Run an independent verifier/replay from the same fixed point with disjoint context, identity, and evidence collection. Replay must be deterministic or record allowed variance and comparison rules.
8. Run the full applicable suite. A partial suite is explicitly `PARTIAL`; omitted tests are `NOT-RUN` with reasons and cannot be counted as green.
9. Recheck artifact digest and side effects after execution. Hidden writes, undeclared network access, changed files, or output drift produce `FAIL`, `BLOCKED`, or `OUTCOME-UNKNOWN` according to observability.
10. Emit only the bounded `DelegationVerdict` and a reference to redacted evidence. Never return a worker transcript or repair suggestion.

## Negative Fixtures

The behavioral fixture set must include deterministic cases with expected typed outcomes:

- `false-claim`: artifact claims a criterion is met while an independent check disproves it -> `FAIL`.
- `command-not-executed`: command appears in a plan/transcript but has no observed process record -> `NOT-RUN` and overall `BLOCKED` or `FAIL`, never `PASS`.
- `partial-suite`: only a subset of applicable tests ran -> `PARTIAL` with denominator and omitted tests; never `PASS`.
- `stale-output`: output digest or fixed-point revision differs from the verification snapshot -> `STALE`.
- `hidden-side-effect`: verifier observes an undeclared file, network, or external mutation -> `FAIL` when proven, otherwise `OUTCOME-UNKNOWN`; never silently accept.

Fixtures must exercise both positive controls and these negative controls, preserve their input/output digests, and be replayable without worker context.

## Guardrails

Refuse verification when the artifact is missing, digest-mismatched, schema-invalid, outside scope, mutable during checking, or lacks an owner; when a required capability or independent verifier is unavailable; when command provenance cannot prove execution; when the suite denominator is unknown; or when evidence is stale, redacted beyond comparison, contradictory, or only transcript-backed. Refusal is a typed verdict with `refusal.reasonCode`, `missingEvidence`, and `nextProbe`, not an exception hidden in prose.

Do not convert a timeout, crash, lease expiry, kill-switch cancellation, approval expiry, or output truncation into pass. Preserve partial evidence, checkpoint the fixed point, and use `outcome-unknown` when an effect may have happened. Never repeat an uncertain mutation. Artifact integrity includes pre/post digest, schema validation, path/ownership checks, unexpected-file detection, and declared side-effect reconciliation.

## Artifact And Output

Emit the verdict as JSON and Markdown:

- `.agents/skills/platform/artifacts/verify-delegation/{verificationId}.json`
- `.agents/skills/platform/artifacts/verify-delegation/{verificationId}.md`

Validate the JSON against the declared output shape before returning it. The JSON must include criterion-level evidence references, every command provenance record, negative-test results and count, suite denominator/status, replay identity and comparison, integrity observations, fixed-point and artifact digests, and any refusal or NOT-RUN reasons. Store only bounded, redacted evidence; never persist worker transcripts or secrets.

## Completion criteria

- every criterion has an observed evidence record or an explicit non-pass state
- capability inventory and fixed-point digest are present
- every claimed command has complete provenance proving whether it executed
- negative-test minimum is met, or the verdict is non-pass with `NOT-RUN`
- independent verifier replay is recorded, or the verdict is non-pass
- full applicable suite status is explicit; partial suites never pass
- artifact integrity and side-effect reconciliation are complete
- output is typed, bounded, schema-validated, and transcript-free
- insufficient evidence produces refusal, not inference

---
@include .agents/skills/platform/contract-base.xml
