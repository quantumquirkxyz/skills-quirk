---
name: "prod-okr-planning"
category: "product"
maturity: "stable"
version: "1"
description: "Design OKR cycles — Objectives, Key Results, initiatives — with measurable outcomes, quarterly cadences, and team alignment."
license: "MIT"
capabilities:
  - apply prod okr planning methods within explicit product boundaries
  - analyze design okr cycles — objectives, key results, initiatives — with measurable outcomes, quarterly cadences, and team alignment with assumptions, constraints, and failure modes
  - produce and validate a product artifact with evidence, decisions, and next steps
outputs: "OkrArtifact with team OKR document, initiative mapping, measurement evidence, and work-item metadata."
sideEffects: ["write-files"]
dependencies: []
capabilityRequirements:
  - engineering-preflight (required when initiatives govern software delivery)
  - requirements-engineering (when KRs encode software outcomes)
  - architecture-evaluation (when initiatives include architecture decisions)
  - codebase-design (when initiatives name code seams)
  - testing (when KRs require verification)
  - qa-automation (when automated quality gates are measured)
  - observability (when KRs depend on product or system telemetry)
  - engineering-governance (when approvals or risk controls are tracked)
stopCondition: "OKR document saved; initiatives mapped to KRs; progress tracker template ready."
risk: "low"
trustTier: "1"
maxIterations: "4"
promptVersion: "2.0"
artifactType: "OkrArtifact"
aliases: [OKR]
modelTier: "reasoning"
evaluators: ["behavioral", "regression"]
fixturesPath: ".agents/skills/platform/fixtures/behavioral/prod-okr-planning.json"
diataxis: "how-to"
tags: ["product"]
compatibility: [requirements-engineering, professional-project-management, architecture-evaluation, testing, observability, release-management, sre]
approvalRequired: "true"
approvalFor: ["write-files", "release-plan"]
---

## Contract

- Input: team mission, company OKRs, current quarter / cycle.
- Output: team OKR document + initiative mapping.
- Contract base: emit a schema-versioned OKR artifact with source digests, cycle fixed point, artifact/operation IDs, owner, next consumer, approvals, evidence, blockers, risks, and canonical work-item metadata.
- Handoff: version the cycle and measurement schema; release planning must reference the frozen OKR revision and named owners rather than treating initiative mapping as execution approval.
- Scope: designs OKRs; does not execute initiatives.
- Rule: designs OKRs; does not execute initiatives.
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

Emit `ProdOkrPlanningArtifact` as both:
- JSON: `.agents/skills/platform/artifacts/prod-okr-planning/{identifier}.json`
- Markdown view: same filename with `.md` extension


# OKR Planning

Design a **quarterly OKR cycle** — Objectives, Key Results, initiatives — with measurable outcomes and team alignment.

## Process

### 1. Mission alignment
- State the team mission for the quarter.
- Align with company OKRs (copy relevant ones; ignore if not applicable).
- Identify what the team uniquely contributes that no other team can.

**Completion criterion:** mission statement saved.

### 2. Objectives
Rules for a good Objective:
- Ambitious and inspiring (motivates the team).
- Qualitative (not a number).
- Time-bound (one quarter).
- 2–4 Objectives per team per quarter.

**Completion criterion:** 2–4 Objectives saved.

### 3. Key Results
Rules for good Key Results:
- Measurable (has a number and baseline).
- Outcome-oriented (not output — not "we will build X" but "X will improve Y by Z%").
- Achievable (70% success is good — overconfident KRs demoralise teams).
- Relevant (directly supports the Objective).
- Time-bound (achievable within the quarter).

For each Objective: 2–4 Key Results.

**Completion criterion:** KRs saved with baseline and target.

### 4. Initiatives
For each KR: list the initiatives (projects, tasks, experiments) that drive it.
Not every initiative maps to a KR — if an initiative has no KR, question whether it belongs.

**Completion criterion:** initiatives mapped to KRs.

### 5. Progress tracking
Define: how often (weekly / biweekly), who updates, what format (score 0–1.0 per KR), and what to do when off-track (adjust, escalate, drop).

**Completion criterion:** tracker template saved.

### 6. Retro
At end of cycle: score each KR (0.0–1.0); write retrospective: what worked, what didn't, what to carry forward.

**Completion criterion:** retro template saved.

## Completion

- the skill's completion criteria are explicitly checked
- the artifact is saved and validated
- any blockers or skipped validations are documented
- the next consumer is identified or the work is handed off
---
## Measurement and Inclusion Controls
- Define every metric with formula, numerator/denominator, unit, cohort, window, exclusions, source query, baseline, target, owner, and freshness SLA; preserve an evidence ledger with provenance, confidence, uncertainty, and claim substantiation.
- Review privacy, accessibility, localization, and inclusive communication impacts; disclose synthetic inputs and never use unlicensed or stale sources.
- Negative fixtures: metric drift, missing denominator, stale source, unsupported target, PII leakage, inaccessible communication, or inequitable cohort omission. Stop as `blocked` and require named-owner remediation evidence plus rerun.

@include .agents/skills/platform/contract-base.xml

Output schema: `schemas/software-engineering/okr-artifact.schema.json`; legacy artifact aliases are accepted by adapters.
