---
name: "devops-terraform-iac"
category: "devops"
maturity: "stable"
version: "1"
description: "Design infrastructure as code — Terraform / Pulumi / CloudFormation — for reproducible, version-controlled, auditable cloud infrastructure."
license: "MIT"
capabilities:
  - apply devops terraform iac methods within explicit devops boundaries
  - analyze design infrastructure as code — terraform / pulumi / cloudformation — for reproducible, version-controlled, auditable cloud infrastructure with assumptions, constraints, and failure modes
  - produce and validate a devops artifact with evidence, decisions, and next steps
outputs: "IAC module definitions + state rules + policy checklist."
sideEffects: []
dependencies: []
stopCondition: "Module definitions saved; state rules saved; policy checklist filled."
risk: "medium"
trustTier: "3"
maxIterations: "5"
promptVersion: "2.0"
artifactType: "devops"
modelTier: "reasoning"
evaluators: ["behavioral", "regression"]
fixturesPath: .agents/skills/platform/fixtures/behavioral/devops-terraform-iac.json
diataxis: "how-to"
tags: ["devops"]
compatibility: []
approvalRequired: "true"
approvalFor: []
---

## Contract

- Input: infrastructure requirements (compute, storage, network, identity, policies).
- Output: IAC module definitions + state rules + policy checklist.
- Scope: defines infrastructure; execution requires explicit approval and testing.
- Rule: defines infrastructure; execution requires explicit approval and testing.
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

Emit `DevopsTerraformIacArtifact` as both:
- JSON: `.agents/skills/platform/artifacts/devops-terraform-iac/{identifier}.json`
- Markdown view: same filename with `.md` extension


# Infrastructure as Code Design

Design **reproducible infrastructure** — compute, network, storage, identity — with version control, state management, and policy enforcement.

## Process

### 1. Define requirements
- Compute: instances / containers / serverless / managed Kubernetes.
- Storage: object, block, database, cache, archive.
- Network: VPC, subnets, load balancers, DNS, CDN, VPN, private links.
- Identity: IAM roles, service accounts, SSO integration.

**Completion criterion:** requirements list saved.

### 2. Design modules
- **Module** per concern: compute module, network module, storage module, identity module.
- Each module defines resources, variables, outputs.
- Composition: root module calls sub-modules with variables.

**Completion criterion:** module tree saved.

### 3. State management
- Remote backend (S3 / GCS / Azure Storage with locking).
- State encryption (at rest / in transit).
- State isolation per environment (workspaces / separate state files).
- State versioning / backup.

**Completion criterion:** state rules saved.

### 4. Policy enforcement
- IAM: least-privilege roles; no root/admin by default; service-specific roles.
- Network: default-deny; allow only required ports / sources; private subnets for databases.
- Encryption: at rest (AES-256) and in transit (TLS 1.3); key management.
- Compliance: GDPR / SOC2 / HIPAA / ISO 27001 rules mapped to controls.

**Completion criterion:** policy checklist filled.

### 5. Deliver
Module definitions (HCL / TypeScript / YAML) + state rules + policy checklist + plan example (terraform plan output or equivalent).

## P1 Controls

- Require a change manifest containing plan digest, state snapshot identity, module/provider versions, policy decisions, approvers, blast radius, rollback, kill switch, and expiry.
- Enforce policy-as-code and fail closed on unknown drift, unverifiable state, provider errors, missing identity, or incomplete plan output.
- Preserve immutable plan/apply evidence and provenance; never treat a plan as an applied result. Include capacity and error-budget gates before destructive or scaling changes.

## Rules

- Rule: separate module design from apply/execution; production changes require explicit approval.
- Rule: keep state remote, encrypted, locked, versioned, and isolated by environment.
- Rule: design least-privilege IAM and default-deny network posture.
- Rule: require plan/dry-run review before apply.
- Rule: document drift detection, rollback, import, and destroy safeguards.

## Completion

- the skill's completion criteria are explicitly checked
- the artifact is saved and validated
- any blockers or skipped validations are documented
- the next consumer is identified or the work is handed off
---
@include .agents/skills/platform/contract-base.xml

## P0/P1 Governance Controls

- Use remote, encrypted, versioned state with state locking and a documented recovery path. A plan must fail closed when the lock cannot be acquired or state integrity is uncertain.
- Run policy-as-code checks on plan and configuration for identity, network, encryption, public exposure, data residency, and protected-environment boundaries; exceptions require owner, scope, expiry, and approval.
- Treat plan provenance as evidence: record commit, provider/module lockfiles, tool versions, inputs, plan digest, and artifact attestations/SBOM for supplied modules or images.
- Isolate fork/untrusted plan execution from cloud write credentials; use read-only or mocked providers and separate state. Apply requires protected-environment approval and separation of duties.
- Detect and classify drift before apply. Refresh-only evidence, timeout, or flaky provider responses are not approval to apply; retry within bounds and preserve the last known-good state.
- Require changed-risk coverage for IAM, networking, encryption, data stores, modules, and destructive operations, with explicit review and rollback/import safeguards.
