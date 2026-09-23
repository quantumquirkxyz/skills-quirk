---
name: supply-chain-security
category: skill-dev/sandbox
maturity: stable
version: 1
description: Design supply chain security — SBOM, Sigstore, SLSA, provenance, signing — with explicit trust tiers, artifact verification, and incident response for compromised dependencies.
capabilities:
  - generate and maintain SBOM (SPDX, CycloneDX)
  - implement artifact signing and verification (Sigstore, Cosign)
  - define SLSA build tiers and provenance attestations
  - design dependency vulnerability response and patching SLA
outputs:
  - SBOM policy (format, generation, storage, update cadence)
  - Signing and verification policy (keys, tooling, enforcement)
  - SLSA target and build provenance attestation
  - Vulnerability response SLA and runbook
sideEffects: []
dependencies: []
stopCondition: SBOM policy defined; signing policy defined; SLSA target and attestation documented.
risk: medium
trustTier: 3
maxIterations: 6
---

## Contract

- **Input:** software bill of materials (existing or target), build system, deployment pipeline, threat model.
- **Output:** SBOM policy + signing policy + SLSA target + vulnerability response runbook.
- **Side effects:** none.
- **Dependencies:** signing tooling (Sigstore / Cosign), SBOM generation (Syft, Trivy), CI/CD integration.
- **Stop condition:** SBOM policy defined; signing policy defined; SLSA target and attestation documented.
- **Risk:** medium — supply chain attacks compromise build and deploy; requires proactive verification.
- **Boundary:** designs security policy; does not patch dependencies or re-sign artifacts unless explicitly instructed.

# Supply Chain Security

Design **supply chain security** — SBOM, Sigstore, SLSA, provenance, signing — with explicit trust tiers, artifact verification, and incident response for compromised dependencies.

## Process

### 1. Inventory and SBOM policy
- Artifact types (container images, binaries, packages, libraries, firmware).
- SBOM format (SPDX, CycloneDX) and minimum granularity (package, file, container).
- Generation cadence (per-build, per-release, continuous).
- Storage and access (artifact registry, versioning, retention).
- Verification rules (SBOM present, signed, matches artifact hash).

**Completion criterion:** SBOM policy with format, cadence, and storage defined.

### 2. Artifact signing
- Signing authority (machine identity, build service, developer keys).
- Signing tool (Sigstore / Cosign, keyless vs key-based).
- Verification enforcement (admission controller, CI gate, deployment policy).
- Key rotation and revocation process.

**Completion criterion:** signing policy with enforcement points defined.

### 3. SLSA build tiers
- SLSA level target (L2: hosted build platform; L3: hard and hermetic).
- Build platform requirements (isolated, reproducible, ephemeral).
- Provenance attestation generation (SLSA provenance, in-toto).
- Verification by consumers (registry, deployment pipeline).

**Completion criterion:** SLSA target and build platform requirements documented.

### 4. Dependency management
- Dependency allow-list and deny-list (internal, open source, critical CVE history).
- Update policy (automated Dependabot / Renovate, review cadence).
- Lock files and pinned versions enforced.
- Transitive dependency visibility (SBOM includes transitive deps).

**Completion criterion:** dependency management policy with update and pinning rules defined.

### 5. Vulnerability response
- Scanning cadence (per-build, nightly, on CVE publication).
- SLA by severity (critical: 24h; high: 7d; medium: 30d; low: 90d).
- Triage and patch process (upstream fix, patch release, CVE acceptance).
- Communication plan (security advisories, customer notifications).

**Completion criterion:** vulnerability SLA and response runbook defined.

### 6. Audit and compliance
- Attestation verification in CI/CD and runtime.
- Periodic audit of signing keys, SBOM accuracy, and SLSA compliance.
- Evidence collection for compliance (SOC 2, FedRAMP, ISO 27001).
- Incident response for compromised artifacts (revocation, re-sign, customer notification).

**Completion criterion:** audit schedule and incident response runbook defined.

## Rules

- Rule: generate SBOM for every artifact; never ship without it.
- Rule: verify signatures at every stage: build, registry, deploy, runtime.
- Rule: target SLSA L3 for production artifacts; document exceptions with risk acceptance.
- Rule: automate dependency updates and vulnerability scanning; manual review only for exceptions.
- Rule: maintain an incident response runbook for supply chain compromise.
