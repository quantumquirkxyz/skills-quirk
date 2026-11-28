---
name: "deployment"
category: "platform"
maturity: "stable"
version: "1"
description: "Define how a project is built, released, and rolled back — as a safe operational seam."
license: "MIT"
capabilities:
  - apply deployment methods within explicit platform boundaries
  - analyze define how a project is built, released, and rolled back — as a safe operational seam with assumptions, constraints, and failure modes
  - produce and validate a platform artifact with evidence, decisions, and next steps
outputs: "a deployment seam proposal, release path, rollback guidance, and deployment safety gates."
sideEffects: []
dependencies: []
stopCondition: "Define how a project is built, released, and rolled back complete; artifact saved; completion criteria checked."
risk: "low"
trustTier: "1"
maxIterations: "6"
promptVersion: "2.0"
artifactType: "deployment"
modelTier: "router"
evaluators: ["behavioral", "regression"]
fixturesPath: ".agents/skills/platform/fixtures/behavioral/deployment.json"
diataxis: "how-to"
tags: ["platform"]
compatibility: []
approvalRequired: "false"
approvalFor: []
---

## Contract

- Input: deployment brief, runtime context, and release constraints.
- Output: a deployment seam proposal, release path, rollback guidance, and deployment safety gates.
- Scope: stay within the skill's declared boundaries; do not broaden without explicit direction.
- Rule: documented standards override defaults; explicit project rules take precedence.
- Rule: if blocked by missing context or dependencies, surface the blocker before proceeding.

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

Emit `DeploymentArtifact` as both:
- JSON: `.agents/skills/platform/artifacts/deployment/{identifier}.json`
- Markdown view: same filename with `.md` extension


# Deployment

Use this skill when the project needs a clear release path. It should define how an immutable build artifact moves from repo to runtime, what can fail, and how to recover without guessing. It covers deployment mechanics; release policy and cadence belong to `release-management`.


## Steps

1. Identify the environments, runtime target, artifact identity, and deployment constraints.
2. Describe the build, artifact promotion, configuration, and secret-injection seams.
3. Choose the rollout strategy and define health, readiness, and abort gates.
4. Define rollback, forward-fix, migration compatibility, and failure ownership.
5. State what must be observable and what evidence makes the deployment safe to continue or complete.

## Completion

- the skill's completion criteria are explicitly checked
- the artifact is saved and validated
- any blockers or skipped validations are documented
- the next consumer is identified or the work is handed off
---
@include .agents/skills/platform/contract-base.xml

## P0/P1 Safety Controls

- Build and promote immutable, signed artifacts by digest. Require verifiable artifact attestation, SBOM, and provenance before deployment; record their references in `DeploymentArtifact`.
- Define protected environments and approval boundaries: development may be automatic, while staging/production promotion requires named approvers, separation of duties, and an auditable decision.
- Isolate fork and untrusted builds from deployment credentials and production networks; only trusted, attested outputs may enter promotion.
- Select canary, blue/green, or rolling rollout with measurable promotion, abort, and rollback thresholds. Verify rollback completion and service recovery, not merely command success.
- Include changed-risk coverage for code, dependencies, manifests, migrations, and policy changes; require additional validation for high-risk changes.
- Handle flaky checks and timeouts as unknown/failed evidence with bounded retries, owner, expiry, and explicit follow-up; never treat silence as health.

## DeploymentArtifact Contract

Consume only a current, schema-valid `ReleaseCandidateArtifact` and emit `DeploymentArtifact` using `schemas/software-engineering/deployment-artifact.schema.json`. Bind candidate reference, fixed point, and digest; retain SBOM/VEX/provenance, named owner, approval, canary/rollout observations, verification artifact, rollback plan and post-rollback verification, SLO/alert/runbook links, and `nextConsumer: observability` or `sre`. Reject stale candidates, missing owner/approval, failed canaries, absent verification, or absent rollback verification and return the blocker to `release-management`. Deployment mechanics do not grant approval authority.
