---
name: observability
category: foundation
maturity: stable
version: 2
description: Define the logs, metrics, traces, and alerts needed to understand a system in production — with SLIs, SLOs, dashboards, alert rules, and incident runbooks.
capabilities:
  - define SLIs and SLOs for critical user journeys
  - design dashboards for metrics, logs, traces, and alerts
  - create alert rules with thresholds, routing, and escalation
  - write incident response runbooks
  - apply observability workflow
  - validate observability completion criteria
outputs:
  - Observability artifact with SLI/SLO spec, dashboard design, alert rules, runbook, and validation notes
sideEffects: []
dependencies: []
stopCondition: Observability design complete; artifact saved; completion criteria checked.
risk: low
trustTier: 1
maxIterations: 6
---

## Operating Contract

- **Input:** Observability request, relevant context, constraints, and source evidence.
- **Output:** Observability artifact with SLI/SLO spec, dashboard design, alert rules, runbook, and validation notes.
- **Side effects:** follow the frontmatter declaration; do not broaden scope without explicit user direction.
- **Dependencies:** declared dependencies, referenced skills, and source materials required by the task.
- **Stop condition:** Observability design is complete, evidence is captured, and completion criteria are checked.
- **Risk:** use the frontmatter risk classification and call out any escalation.
- **Boundary:** stay within the skill's declared scope, trust tier, and side-effect policy.

# Observability

Use this skill when a system needs to be understood in production, not just in tests. Design operational signals — SLIs, SLOs, dashboards, alerts, and runbooks — so the system stays understandable under load.

## Contract

- Input: system surface, production risk, operational context, and available telemetry.
- Output: SLI/SLO spec, dashboard design, alert rules, incident runbook, and signal ownership.
- Scope: design observability and operational signals; not the monitoring stack implementation.
- Rule: prioritize signals that explain user-visible failures first.
- Rule: avoid noisy telemetry that does not help diagnosis.
- Rule: connect signals to the seam where the system actually fails or slows down.
- Rule: every paging alert needs a threshold, owner, severity, response target, and first diagnostic action.
- Rule: define retention, sampling, cardinality, and redaction constraints for signals that may contain user or secret data.
- Rule: state how deploy markers correlate with alerts so regressions can be attributed.

## Process

### 1. Identify critical user journeys
- What must always work? (login, checkout, search, data retrieval, payment).
- For each journey: what is the user-facing outcome?

**Completion criterion:** journeys listed.

### 2. Define SLIs
For each journey, pick 2–4 indicators:
- **Latency:** request latency (p50 / p95 / p99).
- **Availability:** success rate (HTTP 2xx / total) or error rate.
- **Quality:** result relevance, correctness rate, data freshness.
- **Freshness:** data delay (time from source update to available to user).

**Completion criterion:** SLIs defined per journey.

### 3. Set SLOs
Target values per SLO (e.g. 99.9% availability over 30 days; p95 latency < 200ms; error rate < 0.1%).
Compute error budget (1 — SLO target) — available for planned maintenance / risk-taking.

**Completion criterion:** SLO targets stated; error budgets computed.

### 4. Design alerts
- **Critical:** page immediately (availability < SLO, latency spike, error rate surge).
- **Warning:** investigate within 15 min (gradual degradation, resource exhaustion).
- **Info:** log for trend analysis (slow growth, seasonal patterns).
- **Routing:** to on-call, team, or manager based on severity.
- **Escalation:** if not acknowledged, auto-escalate.

**Completion criterion:** alert rules defined with thresholds, routing, escalation.

### 5. Dashboards
- **Overview:** key SLIs, current SLO status, error budget consumed.
- **Detail:** per-service, per-journey, per-region.
- **Trace:** link to tracing for debugging.
- **Historical:** trends over 30/90/365 days.

**Completion criterion:** dashboard design saved.

### 6. Incident runbook
For each critical alert: what to check first? (metrics, logs, traces, recent deploys, dependency status). What is the rollback / mitigation action? Who to page?

**Completion criterion:** runbook saved for each critical alert.

### 7. Signal ownership and safety
- Define who owns each signal, dashboard, and alert.
- Set retention, sampling, and redaction rules for sensitive data.
- Document deploy markers and release identity for regression attribution.

**Completion criterion:** ownership and safety constraints are explicit.

## Completion Criteria

- critical user journeys are named
- SLIs and SLOs are defined with error budgets
- alert rules include thresholds, routing, escalation, and severity
- dashboard structure covers overview, detail, trace, and historical views
- incident runbooks exist for each critical alert
- signal ownership, retention, sampling, and redaction are documented
- diagnostic path is concrete enough to operate under load

## References
- `../../backend/backend-queues/SKILL.md` — background job observability
- `../../devops/devops-ci-cd-pipeline/SKILL.md` — deploy marker correlation
- `../../qa/performance-testing/SKILL.md` — performance signal design
