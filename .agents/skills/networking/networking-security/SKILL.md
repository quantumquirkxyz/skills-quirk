---
name: networking-security
category: networking
maturity: stable
version: 1
description: Design network security — segmentation, firewalls, VPNs, TLS, authentication, and threat boundaries — with explicit trust zones.
capabilities:
  - design network trust boundaries
  - review segmentation and firewall posture
  - identify exposure and control gaps
outputs:
  - network security review with trust zones, controls, exposure, and mitigations
sideEffects: []
dependencies: []
stopCondition: Trust zones, allowed flows, controls, and residual risks are explicit.
risk: low
trustTier: 1
maxIterations: 6
---

# networking-security

Use this skill when designing or reviewing segmentation, firewall rules, VPN access, TLS posture, ingress/egress controls, or service-to-service network trust.

## Contract

- Input: network topology, assets, identities, allowed flows, threat model, and operational constraints.
- Output: trust-zone model, allowed/blocked flows, control recommendations, and residual risk.
- Scope: network security architecture and review; application authorization belongs to auth/security skills.
- Boundary: prefer deny-by-default flow definitions and call out where business needs require exposure.

## Rules

- Rule: define trust zones before discussing individual firewall rules.
- Rule: map allowed flows by source, destination, port/protocol, identity, and purpose.
- Rule: separate ingress, egress, lateral movement, and administrative access.
- Rule: include TLS, certificate, key rotation, and authentication assumptions where traffic crosses boundaries.
- Rule: document logging and alerting for policy violations and unexpected exposure.

## Steps

1. Inventory assets, zones, entry points, identities, and administrative paths.
2. Draw or describe current allowed flows and default-deny posture.
3. Identify exposed services, lateral movement paths, and weak trust assumptions.
4. Recommend segmentation, firewall, VPN, TLS, and access-control changes.
5. Define monitoring for denied traffic, anomalous egress, and admin actions.
6. Summarize residual risk and rollout considerations.

## Completion Criteria

- trust zones and allowed flows are named
- exposure and lateral-movement risks are documented
- controls include operational monitoring
- residual risks and exceptions are explicit
