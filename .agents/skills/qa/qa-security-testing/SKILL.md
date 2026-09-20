---
name: qa-security-testing
category: qa
maturity: stable
version: 1
description: Test security posture — auth flows, authorization boundaries, injection paths, session handling, and misconfiguration checks — with adversarial scenarios.
capabilities:
  - design security test charters
  - probe auth and authorization boundaries
  - document security findings responsibly
outputs:
  - security test notes with tested boundaries, evidence, severity, and remediation guidance
sideEffects: []
dependencies: []
stopCondition: Security boundaries, findings, and responsible next steps are documented.
risk: low
trustTier: 1
maxIterations: 6
---

# qa-security-testing

Use this skill when checking security-sensitive behavior such as authentication, authorization, session handling, injection resistance, rate limits, or configuration exposure.

## Contract

- Input: target scope, allowed test environment, roles/accounts, auth model, and risk areas.
- Output: security test plan or findings with evidence, severity, and remediation guidance.
- Scope: authorized testing inside the provided environment; not exploit development outside the agreed target.
- Boundary: avoid destructive probes and stop when authorization, data exposure, or availability risk becomes unclear.

## Rules

- Rule: confirm test scope and environment before adversarial probing.
- Rule: test vertical and horizontal authorization separately.
- Rule: handle tokens, secrets, and user data as sensitive evidence.
- Rule: include impact and exploitability when assigning severity.
- Rule: prefer minimal proof-of-concept evidence over broad extraction or disruption.

## Steps

1. Identify assets, roles, trust boundaries, and security assumptions.
2. Define test scenarios for auth, authorization, input handling, sessions, and configuration.
3. Exercise positive and negative paths with controlled accounts and data.
4. Capture evidence safely: request shape, response, logs, and redacted identifiers.
5. Rate findings by impact, likelihood, and affected boundary.
6. Recommend remediation and retest criteria.

## Completion Criteria

- authorized scope and environment are explicit
- tested security boundaries are listed
- findings include safe evidence and severity rationale
- remediation and retest criteria are documented
