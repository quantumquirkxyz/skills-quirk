---
name: gate-ci
category: platform
maturity: stable
version: 1
description: "Shift-left quality gate that runs on push-to-PR events. Executes the full unit suite, integration tests, contract tests, security scan (semgrep, snyk), performance regression (k6), and enforces an 80% line coverage threshold. Blocks on failure. Max duration: 30min."
license: MIT
capabilities:
  - run full test suite
  - produce quality gate artifact
  - validate quality gate completion criteria
  - trace gate ci decisions across inputs, constraints, and failure paths
  - validate platform outcomes with evidence, assumptions, and explicit next steps
outputs:
  - type: object
    name: GateCiArtifact
    properties:
      trigger: { type: string, enum: [push-to-pr] }
      checks:
        type: array
        items:
          type: object
          properties:
            name: { type: string }
            status: { type: string, enum: [passed, failed, skipped, timed_out, partial, inconclusive, quarantined] }
            durationMs: { type: integer }
            output: { type: string }
      maxDuration: { type: integer }
      blockOnFailure: { type: boolean }
      coverageThreshold: { type: integer }
      qualityBar: { type: boolean }
      result: { type: string, enum: [completed, blocked, failed, partial] }
    required: [trigger, checks, maxDuration, blockOnFailure, coverageThreshold, result]
sideEffects: []
dependencies: []
stopCondition: Shift-left quality gate that runs on push-to-PR events complete; structured result returned; completion criteria checked.
risk: medium
trustTier: 1
maxIterations: 3
modelTier: fast
promptVersion: "2.0"
artifactType: plan
evaluators:
  - behavioral
  - regression
fixturesPath: .agents/skills/platform/fixtures/behavioral/gate-ci.json
diataxis: how-to
tags: [quality, ci, integration, gate]
compatibility: [implement, publish-open-pr, review-pr]
approvalRequired: false
approvalFor: []
---

## Contract

- Input: push-to-PR event, PR metadata, full repo state.
- Output: `GateCiArtifact` with full suite results, coverage data, and terminal state.
- Scope: CI-level checks — unit, integration, contract, security scan, performance regression, coverage.
- Rule: enforce 80% line coverage threshold for new/modified lines.
- Rule: max duration 30min (30 minutes); fail the gate if exceeded.
- Rule: block on failure; PR cannot be merged until gate passes.
- Rule: timeout, partial, inconclusive, or unverified supply-chain evidence cannot be treated as passed.

## Provenance

| Question | Answer |
|---|---|
| What is the source of truth? | The push-to-PR event and PR metadata |
| What is in scope? | Full unit suite, integration tests, contract tests, security scan, performance regression, coverage |
| What is explicitly out of scope? | E2E tests, manual QA, production canary |
| Who or what consumes this artifact afterward? | `review-pr` or merge gate |
| What evidence proves it is done? | Check evidence, risk coverage, secret-scan result, SBOM/provenance/attestation references, and structured terminal result |
| What risk remains? | Flaky tests; security scan false positives; performance regression baselines may need tuning |

## Artifact

Return `GateCiArtifact` as structured output in the current response. Do not write local artifact files unless the user explicitly asks for an export.

## Process

### 1. Run full unit suite
Execute the full unit test suite. Capture pass/fail counts, duration, and any failures.

### 2. Run integration tests
Execute integration tests against a test environment. Capture results.

### 3. Run contract tests
Execute contract tests (Pact, OpenAPI-driven Spectral, etc.) to verify API contracts are unbroken.

### 4. Run security scan
Execute static analysis security scanner (semgrep, snyk) against the codebase. Capture findings by severity.

### 5. Run performance regression
Execute performance test suite (k6, Gatling) against baseline. Flag regressions beyond configured thresholds.

### 6. Check coverage
Measure line coverage for new/modified lines. Enforce 80% threshold. If below threshold, mark check as failed.

### 7. Enforce time budget
Track elapsed time. If approaching 30min (30 minutes), skip remaining non-critical checks and mark as `skipped` with reason `time-budget-exceeded`.

### 8. Run AI evaluation checks
Run repository-declared AI evaluations when changed code, prompts, models, agents, or evaluation fixtures are in scope. Record dataset/model/prompt versions, score thresholds, and evaluation seed. Missing required evaluation evidence is `inconclusive`, not passed.

### 9. Aggregate and block
Compile all results into `GateCiArtifact`. Terminal state:
- Any `failed` → `blocked` (PR merge prevented)
- Any `timed_out`, `partial`, or `inconclusive` → `partial` and block merge
- All `passed` and coverage met → `completed`
- Error or invalid evidence → `failed`

## Completion

- full unit suite executed
- integration tests executed
- contract tests executed
- security scan completed
- performance regression executed
- coverage threshold enforced (80% lines)
- structured result returned
- PR blocked if any check failed
- risk-based changed coverage recorded for every changed file and impacted dependency/configuration
- secret scan and AI evaluation evidence recorded when applicable
- SBOM, provenance, and artifact attestation references are present and verifiable
- bypass requests are denied by default or recorded with actor, reason, scope, expiry, approver, and follow-up verification


## P0/P1 Supply-Chain And Trust Controls

- Build once from the reviewed commit and promote the immutable digest; record an artifact attestation linking commit, builder, inputs, and workflow run.
- Produce and retain an SBOM plus build provenance. Missing, invalid, or unverifiable attestations are `failed`, not `skipped`.
- Run fork and untrusted contributions in isolated, least-privilege workers with read-only secrets (normally none), no production credentials, and no write access to protected environments.
- Apply changed-risk coverage: map changed files and dependency/configuration impact to required tests; changed high-risk paths require explicit integration/security coverage or a documented block.
- Classify flaky failures separately from product failures. A bounded retry may gather evidence, but a flaky or timeout result never becomes `passed`; quarantine requires owner, expiry, and a follow-up issue.
- Enforce protected-environment approvals for deployment-facing checks; CI may produce evidence but cannot self-approve production promotion.
- Record timeout budgets, retry counts, test seed, runner identity, artifact digests, SBOM/provenance references, and the reason for every skip.
- Quarantine only reproducibly flaky checks, with owner, expiry, linked issue, retry evidence, and a required re-entry condition; quarantine never produces `passed`.
- Record hermeticity, network access, credential scope, and fork/untrusted-worker isolation. Stop if isolation cannot be established.
- Record every bypass attempt and audit it after the gate; an unapproved or expired bypass is `failed`.
