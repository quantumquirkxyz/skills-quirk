---
name: "verify-delegation"
category: "foundation"
maturity: "stable"
version: "2"
description: "Black-box verify a delegated worker claim from the artifact, fixed-point inputs, success criteria, and independently reproducible read-only checks; never trust the worker narrative."
license: "MIT"
capabilities:
  - independently reproduce a delegated claim
  - reject unverifiable, stale, or partial evidence
  - emit a bounded verification verdict with evidence
risk: "medium"
trustTier: "3"
artifactType: "agent"
outputs: "VerificationVerdict JSON + Markdown."
approvalRequired: "false"
approvalFor: []
sideEffects: []
compatibility: ["subagent-swarm", "agent-observability", "skill-testing-framework"]
fixturesPath: "evals/behavioral/verify-delegation.json"
stopCondition: "Black-box verification complete; evidence reviewed; capability inventory confirmed; fixed-point digest matches; refusal issued when evidence insufficient."
maxIterations: "6"
---

## Why

Reference protocol: `references/verify-protocol.md`.

Agents write a growing share of code, so humans must direct and verify that work without trusting the worker narrative. Black-box verification treats every worker claim, transcript, plan, screenshot of claimed output, and self-attestation as untrusted data until independently reproduced against a frozen fixed point.

## Contract

- Emit `VerificationArtifact` using `schemas/software-engineering/verification-artifact.schema.json`; `VerificationVerdict` is its payload view.
- Require one `operationId`, the exact fixed-point commit/ref, source and artifact digests, changed-file/side-effect inventory, observed command provenance, tests run/skipped, suite coverage denominator/result, mutation evidence, security evidence, performance evidence, independent verifier identity, approvals, and canonical status.
- Reject stale source, wrong commit, fabricated or declared commands, transcript-only claims, mutation survivors, security omissions, and undisclosed partial suites. These produce `stale`, `blocked`, `validation-failed`, `outcome-unknown`, `partial`, `fail`, or `refusal`, never `pass`.

Inputs:
- `workerClaim`: the delegated work's claimed outcome, success criteria, and evidence references.
- `fixedPointInputs`: canonical brief bytes, artifact path and SHA-256, source/input digests, repository revision, configuration, dependency/tool versions, platform, architecture, locale/timezone, and verifier identity.
- `artifact`: the deliverable to verify — path, digest, schema, owner, expected side effects.
- `evidence`: observed command provenance, process records, test results, replay records, integrity observations.

Outputs:
- `VerificationVerdict`: typed pass/fail/blocked/partial/not-run/stale/outcome-unknown/refusal with fixed-point and artifact digests; `pass` requires independent evidence for every applicable check.
- `evidenceGaps`: missing criteria, unproven commands, stale digests, NOT-RUN reasons, redacted-or-unknown coverage.
- `recommendations`: next probes, capability additions, replay instructions, refusal next steps.

## Provenance

| Question | Answer |
|---|---|
| Who consumes this skill? | Humans directing delegated agent work; consumers of subagent-swarm, agent-observability, and skill-testing-framework. |
| What evidence is required? | Observable command provenance, independent replay records, artifact integrity pre/post digests, negative-test results, full applicable suite status. |
| What is the risk of trusting claims? | A worker narrative can substitute for reproducible evidence, letting partial, stale, or fabricated work pass as complete. |
| What is never accepted as proof? | Transcripts, plans, reasoning, screenshots of claimed output, self-attestations, green summaries. |
| Where is the verdict emitted? | JSON + Markdown under `.agents/skills/platform/artifacts/verify-delegation/{verificationId}`. |

## Artifact

Emit a `VerificationVerdict` as JSON and Markdown:

- `.agents/skills/platform/artifacts/verify-delegation/{verificationId}.json`
- `.agents/skills/platform/artifacts/verify-delegation/{verificationId}.md`

Validate the JSON against the declared output shape before returning it. Include criterion-level evidence references, every command provenance record, negative-test results and count, suite denominator and status, replay identity and comparison, integrity observations, fixed-point and artifact digests, and any refusal or NOT-RUN reasons. Store only bounded, redacted evidence; never persist worker transcripts or secrets.

## Rules

- Black-box verification only: never repair, patch, re-implement, re-delegate, or accept implementation narrative.
- Verify against a frozen fixed point: hash canonical bytes, not prose order; a changed input, missing digest, expired revision, or stale artifact yields `stale` or `blocked`.
- Capability inventory check: record allowed commands, exact resolved paths, versions, permissions, cwd, environment allowlist, resource limits; omitted capabilities are denied.
- Command provenance: only an observed process result counts as execution; `declared` is not `executed`.
- Negative-test minimum: at least two independent negative tests for mutating artifacts, at least one for read-only artifacts; one targets the success boundary, one targets integrity or scope failure.
- Fixed-point digest comparison: replay must run from the same fixed point; digest mismatch is `stale`.
- Reproducible replay: independent verifier with disjoint context, identity, and evidence collection; deterministic or records allowed variance.
- Refusal when evidence insufficient: typed verdict with `refusal.reasonCode`, `missingEvidence`, `nextProbe` — never inference hidden in prose.
- Read-only: verification performs no side effects; verdicts are emitted as artifacts only.

## Workflow

1. Inspect claim: validate the brief, schema, boundaries, stop condition, expiry, and caller authority.
2. Gather evidence: compute and freeze the fixed-point digest; verify artifact existence, type, path containment, SHA-256, schema, ownership, and no unexpected files.
3. Verify against fixed point: compare artifact digest, tool versions, revision, and expiry window against the snapshot.
4. Check capability inventory: reject commands not explicitly allowed; strip worker transcript and implementation context from the verifier context.
5. Run negative tests: meet the negative-test minimum against observable assertions mapped from success criteria.
6. Compare digest: recheck artifact digest and side effects after execution; hidden writes, undeclared network access, changed files, or output drift produce `FAIL`, `BLOCKED`, or `OUTCOME-UNKNOWN`.
7. Emit verdict: bounded `VerificationVerdict` JSON + Markdown, transcript-free; issue refusal when evidence is insufficient.

## Guardrails

- Never trust transcript-only evidence: a worker report, log fragment, or green summary never proves execution.
- Never accept "trust me" claims: `declared` is not `executed`; only observed process results count.
- Verify independently: replay from the same fixed point with disjoint context, identity, and evidence collection.
- Fail-closed: unresolved, partial, stale, or contradictory evidence is never promoted to pass; use `NOT-RUN`, `PARTIAL`, `STALE`, `BLOCKED`, `FAIL`, `OUTCOME-UNKNOWN`, or refusal.
- Never convert a timeout, crash, lease expiry, cancellation, or truncation into pass; checkpoint the fixed point and preserve partial evidence.

## Completion criteria

- The fixed point, artifact integrity, capability inventory, replay, negative tests, and evidence gaps are recorded.
- The emitted verdict is validated as bounded JSON and Markdown against the common `VerificationArtifact` schema, with refusal or non-pass status when evidence is insufficient; command, coverage, mutation, security, performance, and independent-verifier evidence are complete or explicitly skipped.

---
@include .agents/skills/platform/contract-base.xml
