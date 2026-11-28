---
name: "configuration-management"
category: "platform"
maturity: "stable"
version: "1"
description: "Control configuration identity, baselines, variants, drift, and reproducible change without conflating configuration with deployment or secret storage."
license: "MIT"
capabilities:
  - inventory configuration items, variants, feature flags, and secret references
  - establish immutable baselines and reproducibility manifests for release artifacts
  - detect drift, unauthorized changes, and environment divergence
  - produce auditable change records with approval and rollback compatibility checks
outputs: "a configuration inventory, approved baseline, drift report, reproducibility manifest, and auditable change records."
sideEffects: ["may write approved baselines, change records, or configuration repositories when explicitly authorized"]
dependencies:
  - deployment
  - release-management
  - devops-terraform-iac
  - devops-feature-flags
  - supply-chain-security
stopCondition: "Configuration inventory, baseline, drift and reproducibility assessment are complete; authorized records are saved; approvals and unresolved risks are explicit."
risk: "high"
trustTier: "2"
maxIterations: "6"
promptVersion: "2.0"
artifactType: "configuration-management"
modelTier: "router"
evaluators: ["behavioral", "regression"]
fixturesPath: ".agents/skills/platform/fixtures/behavioral/configuration-management.json"
diataxis: "how-to"
tags: ["platform", "configuration", "drift", "reproducibility"]
compatibility: []
approvalRequired: "true"
approvalFor: ["writing baselines", "changing protected configuration", "recording emergency changes"]
---

## Contract

- Input: repositories, configuration manifests, environment declarations, release artifacts, feature-flag definitions, secret references, policies, and a fixed commit or release identity.
- Output: a `ConfigurationManagementArtifact` containing an inventory, approved baseline, drift report, reproducibility manifest, and change records.
- Scope: configuration items, baselines, environment variants, release inputs, feature flags, secret references, drift, reproducibility, audit, and change control.
- Boundary: do not store, reveal, rotate, or retrieve secret values; do not deploy runtime changes; do not replace release governance, infrastructure provisioning, feature-flag evaluation, or supply-chain attestation.
- Rule: represent secret references and provenance, never secret material. Redact embedded values in evidence and stop on suspected exposure.
- Rule: compare environments against an explicit baseline and classify intentional variants separately from unexplained drift.
- Rule: a reproducibility claim requires pinned inputs, content digests, toolchain identity, and a deterministic rebuild or an explicit unresolved limitation.
- Rule: protected baseline writes and manual remediation require named approval, separation of duties, an operation ID, and before/after evidence; dry runs and read-only audits do not mutate.
- Rule: rollback and schema compatibility must be checked before approving a configuration change that affects a release artifact.
- Rule: if required manifests, policy, approval, or provenance are missing, emit a blocked artifact with structured gaps rather than guessing.

## Provenance

| Question | Answer |
|---|---|
| What is the source of truth? | The fixed repository revision, declared manifests, environment policy, release metadata, and approved change records |
| What is in scope? | Configuration identity, baseline and variants, drift, reproducibility, auditability, and controlled change |
| What is explicitly out of scope? | Secret values or secret storage, deployment execution, infrastructure provisioning, flag evaluation, and artifact signing itself |
| Who consumes this artifact? | `release-management`, `deployment`, security/release approvers, and operators |
| What proves completion? | Schema-valid artifact, complete inventory, baseline decision, classified drift, reproducibility result, and approval/change evidence |
| What risk remains? | Unobserved runtime overrides, unavailable secret-manager state, nondeterministic tools, and incomplete environment access |

## Artifact

Emit `ConfigurationManagementArtifact` as both:
- JSON: `.agents/skills/platform/artifacts/configuration-management/{identifier}.json`
- Markdown view: same filename with `.md` extension

## Workflow

1. Establish the fixed point, authority, environment set, protected paths, and approval policy.
2. Inventory configuration items with owner, source, scope, type, sensitivity, digest, and variant relationships.
3. Build or compare the proposed baseline; distinguish approved variants from drift and classify severity.
4. Verify release reproducibility inputs, feature-flag state, secret references, schema compatibility, rollback semantics, and provenance gaps.
5. Produce read-only findings first; for an authorized mutation, record intent, approval, before-state, effect, after-state, and reconciliation evidence.
6. Hand off unresolved drift and approval decisions to the named owner; never silently normalize production.

## Completion

- the skill's completion criteria are explicitly checked
- the artifact is saved and validated against `schemas/software-engineering/configuration-management-artifact.schema.json`
- secret values are absent and any exposure is blocked and reported
- approvals, side effects, drift dispositions, and residual unknowns are documented
- the next consumer is identified or the work is handed off

@include .agents/skills/platform/contract-base.xml

## P0/P1 Controls

- Production baseline changes require independent approval, immutable before/after digests, and a reversible plan.
- Embedded secrets are a blocking security finding; preserve only location, type, digest, and remediation owner.
- A release is not reproducible when any input, toolchain, flag state, or generated configuration is unpinned.
- Manual changes outside the approved operation are unauthorized drift until reconciled with audit evidence.
- Treat unavailable runtime state, stale reads, flaky checks, and timeout as unknown, never as compliant.
