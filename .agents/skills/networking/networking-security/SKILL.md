---
name: "networking-security"
category: "networking"
maturity: "stable"
version: "1"
description: "Design network security — segmentation, firewalls, VPNs, TLS, authentication, and threat boundaries — with explicit trust zones."
license: "MIT"
capabilities:
  - apply networking security methods within explicit networking boundaries
  - analyze design network security — segmentation, firewalls, vpns, tls, authentication, and threat boundaries — with explicit trust zones with assumptions, constraints, and failure modes
  - produce and validate a networking artifact with evidence, decisions, and next steps
outputs: "trust-zone model, allowed/blocked flows, control recommendations, and residual risk."
sideEffects: []
dependencies: []
stopCondition: "Trust zones, allowed flows, controls, and residual risks are explicit."
risk: "low"
trustTier: "1"
maxIterations: "6"
promptVersion: "2.0"
artifactType: "security"
modelTier: "reasoning"
evaluators: ["behavioral", "regression"]
fixturesPath: ""
diataxis: "how-to"
tags: ["networking"]
compatibility: []
approvalRequired: "false"
approvalFor: []
---

## Contract

- Input: network topology, assets, identities, allowed flows, threat model, and operational constraints.
- Output: trust-zone model, allowed/blocked flows, control recommendations, and residual risk.
- Scope: prefer deny-by-default flow definitions and call out where business needs require exposure.
- Rule: prefer deny-by-default flow definitions and call out where business needs require exposure.
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

Emit `NetworkingSecurityArtifact` as both:
- JSON: `.agents/skills/platform/artifacts/networking-security/{identifier}.json`
- Markdown view: same filename with `.md` extension


# networking-security

Use this skill when designing or reviewing segmentation, firewall rules, VPN access, TLS posture, ingress/egress controls, or service-to-service network trust.


## P1 Controls

- Emit a policy manifest with trust-zone/version, identities, allowed and denied flows, certificate/key provenance, policy-as-code decision, rollout, rollback, abort, kill switch, and evidence digest.
- Enforce default-deny and fail-closed behavior for unknown identity, policy engine outage, certificate ambiguity, route/DNS uncertainty, or logging failure on high-risk paths.
- Cover IPv6 parity, QUIC/HTTP3 visibility and controls, identity-aware proxying, mTLS rotation/revocation, and encrypted-traffic metadata limits without claiming payload inspection.
- Include fixtures for policy precedence, parser fuzzing, malformed IPv6/DNS, route leak, certificate expiry, downgrade, segmentation bypass, egress exfiltration, and capacity/error-budget exhaustion.

## Rules

- Rule: define trust zones before discussing individual firewall rules.
- Rule: map allowed flows by source, destination, port/protocol, identity, and purpose.
- Rule: separate ingress, egress, lateral movement, and administrative access.
- Rule: include TLS, certificate, key rotation, and authentication assumptions where traffic crosses boundaries.
- Rule: document logging and alerting for policy violations and unexpected exposure.
- Rule: threat-model identity compromise, lateral movement, route/DNS/BGP abuse, supply-chain appliances, downgrade/misconfiguration, metadata leakage, and encrypted traffic blind spots.
- Rule: apply least privilege to users, services, network devices, certificates, and admin paths; default deny and explicitly constrain egress, management, and break-glass access.
- Rule: require adversarial/property/fuzz fixtures for parser/protocol boundaries, policy precedence, fail-open behavior, certificate rotation/revocation, segmentation bypass, and malformed DNS/route inputs.
- Rule: define rollback/safety case with staged policy rollout, known-good ruleset, emergency isolation, approver, telemetry gates, and stop conditions for unexpected exposure or unverifiable identity.
- Rule: preserve provenance for topology, rules, certificates, threat intel, captures, and assumptions; separate observed flows from inferred reachability.

## Steps

1. Inventory assets, zones, entry points, identities, and administrative paths.
2. Draw or describe current allowed flows and default-deny posture.
3. Identify exposed services, lateral movement paths, and weak trust assumptions.
4. Recommend segmentation, firewall, VPN, TLS, and access-control changes.
5. Define monitoring for denied traffic, anomalous egress, and admin actions.
6. Summarize residual risk and rollout considerations.

## Completion

- the skill's completion criteria are explicitly checked
- the artifact is saved and validated
- any blockers or skipped validations are documented
- the next consumer is identified or the work is handed off
---
@include .agents/skills/platform/contract-base.xml