---
name: chaos-engineering
category: skill-dev/sandbox
maturity: stable
version: 1
description: Design chaos engineering — fault injection, GameDays, resilience validation — with explicit steady-state hypotheses, blast radius controls, and safety rails.
capabilities:
  - define steady-state hypotheses and SLO-based guardrails
  - design fault injection experiments (network, compute, dependency)
  - run GameDays with controlled blast radius
  - validate resilience and produce remediation recommendations
outputs:
  - Chaos experiment plan (hypothesis, scope, fault type, success criteria)
  - Fault injection configuration (tool, parameters, safety constraints)
  - Resilience report (findings, blast radius, remediation backlog)
sideEffects: []
dependencies: []
stopCondition: Experiment plan defined; fault injection config documented; resilience report produced.
risk: medium
trustTier: 3
maxIterations: 6
---

## Contract

- **Input:** service inventory, SLOs, dependency graph, production traffic patterns.
- **Output:** chaos experiment plan + fault injection config + resilience report.
- **Side effects:** may simulate faults in production-like environments; requires safety controls.
- **Dependencies:** chaos platform (Chaos Monkey, Gremlin, Litmus, custom scripts), monitoring stack.
- **Stop condition:** experiment plan defined; fault injection config documented; resilience report produced.
- **Risk:** medium — fault injection can degrade service; requires blast radius limits and abort conditions.
- **Boundary:** designs experiments and documents results; does not execute production chaos without explicit authorisation and safety review.

# Chaos Engineering

Design **chaos engineering** — fault injection, GameDays, resilience validation — with explicit steady-state hypotheses, blast radius controls, and safety rails.

## Process

### 1. Define steady state
- System behaviour under normal conditions (SLOs: latency, error rate, throughput).
- Observable metrics and dashboards for live monitoring during experiments.
- Blast radius definition (region, cluster, service, customer segment).
- Safety rails (abort conditions, automatic rollback, circuit breakers).

**Completion criterion:** steady-state metrics, blast radius, and safety rails documented.

### 2. Identify weaknesses
- Dependency map (upstream services, databases, caches, DNS, load balancers).
- Historical failure modes (outages, degradation, cascading failures).
- Single points of failure and lack of redundancy.
- Hypothesis: "If we inject fault X, the system will behave Y within SLO."

**Completion criterion:** weakness list and experiment hypotheses documented.

### 3. Design experiments
- Fault types (network latency, packet loss, DNS failure, CPU / memory pressure, instance termination, dependency failure).
- Experiment scope (production-like staging vs production; time window).
- Success and failure criteria (SLO held? system degraded? data lost?).
- Rollback plan (manual and automated).

**Completion criterion:** experiment design with success/failure criteria defined.

### 4. Run GameDay
- Pre-flight checklist (approvals, monitoring ready, on-call briefed).
- Execute fault injection with real-time observation.
- Abort immediately if safety rails are breached.
- Record timeline, observations, and system response.

**Completion criterion:** GameDay execution log and observation notes saved.

### 5. Analyze and document
- Compare observed behaviour against steady-state hypothesis.
- Identify surprising behaviours, hidden dependencies, and resilience gaps.
- Assess impact on user experience and downstream services.
- Prioritise remediation (P0 fix, P1 follow-up, accepted risk).

**Completion criterion:** resilience report with findings and remediation backlog defined.

### 6. Continuous improvement
- Automate repeatable experiments in CI/CD or staging.
- Track remediation items and verify fixes with follow-up experiments.
- Expand experiment coverage to new services and failure modes.
- Share findings across teams to build organisational resilience knowledge.

**Completion criterion:** automation plan and sharing process defined.

## Rules

- Rule: start with a steady-state hypothesis; never inject faults without an expected outcome.
- Rule: limit blast radius; prefer staging over production for first experiments.
- Rule: require live monitoring and on-call readiness before any fault injection.
- Rule: stop immediately if abort conditions are met; do not push through to prove a point.
- Rule: treat every finding as a product risk item, not a one-off engineering curiosity.
