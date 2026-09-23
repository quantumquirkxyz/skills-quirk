---
name: zero-trust
category: skill-dev/sandbox
maturity: stable
version: 1
description: Design zero trust architecture — identity, per-request auth, microsegmentation, policy — with explicit trust tiers, continuous verification, and least-privilege enforcement.
capabilities:
  - design identity fabric (IAM, IdP, MFA, SSO)
  - define per-request authentication and authorisation policies
  - design microsegmentation (network, workload, data)
  - implement policy engine (OPA, Rego, ABAC, PBAC)
outputs:
  - Zero trust architecture document (pillars, trust model, maturity roadmap)
  - Identity and access model (IAM policies, MFA requirements, service identity)
  - Microsegmentation policy (network zones, workload boundaries)
  - Policy engine rules and enforcement points
sideEffects: []
dependencies: []
stopCondition: Architecture documented; identity model defined; segmentation and policy rules documented.
risk: medium
trustTier: 3
maxIterations: 6
---

## Contract

- **Input:** current architecture, identity provider, network topology, compliance requirements.
- **Output:** zero trust architecture + identity model + segmentation policy + policy rules.
- **Side effects:** none.
- **Dependencies:** IAM provider (Okta, Auth0, Keycloak), policy engine (OPA, Cloud IAM), network controls.
- **Stop condition:** architecture documented; identity model defined; segmentation and policy rules documented.
- **Risk:** medium — misconfigured zero trust blocks legitimate access or leaves gaps; requires staged rollout.
- **Boundary:** designs architecture and policy; does not modify production auth or network config unless explicitly instructed.

# Zero Trust Architecture

Design a **zero trust architecture** — identity, per-request auth, microsegmentation, policy — with explicit trust tiers, continuous verification, and least-privilege enforcement.

## Process

### 1. Define trust model
- Core principle: never trust, always verify; assume breach.
- Trust tiers (device posture, user identity, network location, application state).
- Continuous verification signals (MFA, device health, behavioural analytics, geo-risk).
- Session posture (short-lived tokens, step-up auth, conditional access).

**Completion criterion:** trust model and verification signals documented.

### 2. Identity fabric
- Identity provider (IdP) and federation (SSO, SAML, OIDC).
- User lifecycle (joiner, mover, leaver; just-in-time provisioning).
- MFA policy (required, step-up for sensitive actions, phishing-resistant).
- Service identity (machine-to-machine, workload identity, SPIFFE).
- Privileged access management (break-glass, just-in-time elevation, session recording).

**Completion criterion:** identity fabric with IAM policies and MFA requirements defined.

### 3. Per-request authentication and authorisation
- Authentication (identity proof at every request, token validation, session binding).
- Authorisation model (RBAC, ABAC, PBAC, ReBAC).
- Fine-grained permissions (resource-level, action-level, attribute-based).
- API gateway and service mesh enforcement (mTLS, JWT validation, rate limiting).

**Completion criterion:** per-request auth model and enforcement points defined.

### 4. Microsegmentation
- Network zones (internal, DMZ, database, management).
- Workload segmentation (namespace, cluster, application tier).
- East-west traffic rules (default deny, explicit allow, service-to-service auth).
- Data segmentation (classification, encryption, access logging).

**Completion criterion:** microsegmentation policy with default-deny rules defined.

### 5. Policy engine
- Policy as code (OPA / Rego, Cloud IAM, Kubernetes admission).
- Policy categories (identity, network, data, infrastructure).
- Decision flow (who can access what, under which conditions).
- Audit and observability (policy decisions logged, denied requests alerted).

**Completion criterion:** policy engine rules, decision flow, and enforcement points defined.

### 6. Monitoring and verification
- Telemetry (auth events, policy decisions, network flows,异常访问).
- Dashboards (trust score, policy violation rate, MFA adoption).
- Alerting (privileged access anomalies, impossible travel, token reuse).
- Periodic red teaming and breach simulation.

**Completion criterion:** monitoring, dashboard, and alerting rules defined.

## Rules

- Rule: start with identity; zero trust without strong identity is theatre.
- Rule: enforce least privilege by default; allow-list exceptions with time-bound approval.
- Rule: encrypt all traffic (mTLS east-west, TLS north-south); verify certificates at every hop.
- Rule: log every auth decision and policy evaluation; make logs queryable for incident response.
- Rule: phase rollout by workload criticality; never deploy all-or-nothing zero trust.
