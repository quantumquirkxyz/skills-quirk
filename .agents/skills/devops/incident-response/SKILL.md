---
name: incident-response
category: skill-dev/sandbox
maturity: stable
version: 1
description: Design incident response — runbooks, war rooms, postmortems, blameless culture — with explicit severity taxonomy, escalation paths, and communication rules.
capabilities:
  - define severity taxonomy and escalation paths
  - author runbooks for known failure modes
  - design war room and incident command procedures
  - write postmortems with root cause and remediation tracking
outputs:
  - Incident response plan (severity, roles, escalation, communication)
  - Runbook library (per-service or per-failure-mode)
  - Postmortem template and process
  - Blameless culture guidelines
sideEffects: []
dependencies: []
stopCondition: Incident response plan complete; runbook library defined; postmortem process documented.
risk: medium
trustTier: 3
maxIterations: 6
---

## Contract

- **Input:** service inventory, on-call structure, communication channels, past incident history (optional).
- **Output:** incident response plan + runbook library + postmortem process.
- **Side effects:** none.
- **Dependencies:** on-call tooling, communication platform, incident management system.
- **Stop condition:** plan complete; runbooks defined; postmortem process documented.
- **Risk:** medium — poor incident response increases outage duration and customer impact.
- **Boundary:** designs response process; does not execute incident command unless explicitly instructed.

# Incident Response

Design **incident response** — runbooks, war rooms, postmortems, blameless culture — with explicit severity taxonomy, escalation paths, and communication rules.

## Process

### 1. Severity taxonomy
- Severity levels (SEV1 / SEV2 / SEV3 / SEV4) with customer impact and SLA definitions.
- Time-to-acknowledge and time-to-resolve targets per level.
- Escalation matrix (on-call → secondary → manager → executive).
- Declaration authority (who can declare a SEV and how).

**Completion criterion:** severity taxonomy and escalation matrix documented.

### 2. Incident workflow
- Detection (alerts, user reports, synthetic monitors).
- Triage (initial assessment, severity assignment, owner assignment).
- Mitigation (rollback, feature flag kill, capacity increase, traffic shift).
- Resolution (root cause confirmed, fix deployed, monitoring verified).
- Communication cadence (status page, stakeholder updates, customer updates).

**Completion criterion:** incident workflow with time targets defined.

### 3. Runbooks
- Per-service runbooks (start/stop, health checks, known failure modes).
- Per-failure-mode runbooks (latency spike, error rate increase, data inconsistency).
- Rollback and restore procedures with verification steps.
- Escalation contacts and communication templates.

**Completion criterion:** runbook library with verification steps defined.

### 4. War room and incident command
- Incident commander (IC) responsibilities and decision authority.
- War room setup (video bridge, Slack channel, shared doc).
- Roles (IC, communications lead, technical lead, scribe).
- Communication rules (what to say, what not to say, cadence).

**Completion criterion:** incident command structure and communication rules defined.

### 5. Postmortem process
- Trigger (SEV1 / SEV2, or any SEV with > X minutes duration).
- Timeline reconstruction (logs, metrics, deployment history, chat).
- Root cause analysis (5 Whys, fault tree, contributing factors).
- Remediation items (immediate fix, preventive action, detection improvement).
- Action item tracking (owner, due date, verification).

**Completion criterion:** postmortem template with action item tracking defined.

### 6. Blameless culture
- Focus on systems and processes, not individuals.
- Psychological safety guidelines for postmortem participants.
- Recognition of effective response, not punishment for honest mistakes.
- Retrospective scheduling and cross-team sharing.

**Completion criterion:** blameless culture guidelines documented.

## Rules

- Rule: define severity by customer impact, not by team comfort.
- Rule: keep runbooks executable by any on-call engineer, not just the service author.
- Rule: require a postmortem for every SEV1 / SEV2; optional for lower severities.
- Rule: track remediation items in the same system as product work so they are visible and ship.
- Rule: conduct GameDays for critical runbooks so they stay fresh and accurate.
