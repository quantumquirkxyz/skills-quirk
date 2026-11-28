---
name: green-software-engineering
category: engineering
maturity: experimental
version: 1
description: "This skill should be used when assessing or improving software carbon intensity, energy use, embodied hardware impact, workload efficiency, or regional carbon intensity with source-qualified measurement and explicit performance, reliability, and cost trade-offs."
license: MIT
capabilities:
  - define workload-normalized energy and carbon budgets using SCI/ISO 21031 concepts
  - design reproducible measurement plans for operational energy, carbon intensity, and embodied hardware
  - distinguish measured, sourced, estimated, and unknown emissions inputs
  - evaluate performance, reliability, capacity, and cost trade-offs without greenwashing
  - produce a prioritized optimization backlog and verification plan
inputs:
  - systemContext: {type: object, required: true, description: "System boundary, architecture, workload units, regions, hardware, and service objectives"}
  - measurements: {type: object, required: true, description: "Energy, utilization, workload, latency, reliability, cost, and source-quality observations"}
  - constraints: {type: object, required: false, description: "Carbon, energy, SLO, budget, data residency, and change constraints"}
outputs:
  - type: object
    name: GreenSoftwareArtifact
    schema: "schemas/green-software-artifact-schema.json"
    properties:
      GreenSoftwareArtifact:
        type: object
        required: [scope, budgets, measurementPlan, assumptions, tradeoffs, optimizationBacklog, verification]
sideEffects: ["write-files"]
dependencies:
  - observability
  - cost-optimization
  - software-economics
stopCondition: "GreenSoftwareArtifact is schema-valid, source-qualified, trade-offs are explicit, and verification gates are actionable"
risk: medium
trustTier: 3
maxIterations: 5
promptVersion: 1.0
artifactType: green-software-artifact
modelTier: reasoning
evaluators: ["behavioral", "quality-bar", "evidence-quality"]
fixturesPath: evals/behavioral/green-software-engineering.json
diataxis: how-to
tags: ["engineering", "green-software", "SCI", "ISO-21031", "energy", "carbon", "sustainability"]
approvalRequired: true
approvalFor: ["write-files"]
---

# Green Software Engineering

## Purpose

Produce an auditable `GreenSoftwareArtifact` for software carbon intensity and energy decisions. Treat carbon as a measured or source-qualified engineering signal, not a decorative estimate. Keep operational energy, regional electricity intensity, embodied hardware, and workload allocation separate until the evidence supports combining them.

## Contract

- Input: typed system context, measurements, optional constraints.
- Output: schema-valid `GreenSoftwareArtifact` containing scope, carbon/energy budgets, measurement plan, assumptions, trade-offs, optimization backlog, and verification.
- Scope: quantify and improve software sustainability at a declared system boundary; do not certify ISO conformance or claim exact emissions without authoritative source quality.
- Rule: Normalize results by a declared workload unit and reporting period; never compare totals without matching units and boundaries.
- Rule: Label every material value as `measured`, `sourced`, `estimated`, or `unknown`, with source, timestamp, method, uncertainty, and coverage where applicable.
- Rule: Preserve latency, availability, durability, throughput, capacity, cost, and data-residency constraints as first-class trade-offs.
- Rule: Reject unsupported precision, unverified emissions factors, double-counted embodied impacts, and offsets presented as reductions.
- Rule: Validate against `schemas/green-software-artifact-schema.json` before emission; rejected artifacts are not passed downstream.

## Method

1. Define the system boundary, lifecycle boundary, geography, hardware ownership model, workload unit, period, and decision owner.
2. State the SCI-style decomposition: operational energy, operational carbon intensity, embodied hardware allocation, and functional unit. Record whether each term is measured, sourced, estimated, or unknown.
3. Set budgets for energy and carbon per workload unit plus aggregate guardrails. Bind budgets to SLOs, reliability targets, cost ceilings, and a review period.
4. Build a measurement plan covering power or energy telemetry, utilization, workload counts, queueing, latency, errors, hardware lifecycle, region, and electricity-factor provenance. Prefer calibrated measurements and triangulate estimates.
5. Assess regional intensity using time and location matching. Do not substitute annual grid averages for marginal or interval claims without labeling the limitation.
6. Allocate embodied hardware only with declared lifetime, utilization, allocation rule, manufacturing source, and uncertainty. Avoid counting provider-reported embodied values twice.
7. Analyze trade-offs. For example, latency optimization can increase replicas or accelerator duty cycle; batch shifting can reduce carbon intensity while increasing delay, storage, or reliability risk; idle GPUs can dominate energy despite low request volume.
8. Prioritize an optimization backlog with expected direction and confidence, owner, dependencies, guardrails, and rollback. Include measurement improvements when evidence quality is the limiting factor.
9. Verify with before/after workload-normalized measurements and unchanged or explicitly renegotiated SLOs. Report null results, regressions, uncertainty, and residual unknowns.

## Evidence Rules

Use `measured` for instrumented energy or workload observations; `sourced` for a versioned provider or grid-factor source; `estimated` for modeled allocations or extrapolations; and `unknown` when the evidence cannot support a defensible value. An inaccurate emissions factor invalidates the precision of downstream carbon results; retain the energy result and downgrade carbon conclusions rather than silently correcting it.

Never infer that lower latency, lower cost, higher utilization, or a greener region automatically lowers total emissions. Check rebound effects, replication, retries, idle capacity, queueing, hardware lifetime, and workload migration. State whether a recommendation reduces absolute emissions, intensity, peak demand, or only uncertainty.

## Completion Criteria

- [ ] Boundary and workload unit are explicit.
- [ ] Energy and carbon budgets include period, unit, target, guardrail, and evidence quality.
- [ ] Measurement plan identifies telemetry, sampling, calibration, source provenance, and uncertainty.
- [ ] Embodied hardware and regional intensity assumptions are explicit and non-duplicative.
- [ ] Performance, reliability, cost, and residency trade-offs are recorded.
- [ ] Optimization backlog is prioritized and verifiable.
- [ ] Verification includes workload-normalized before/after checks and regression thresholds.
- [ ] Artifact validates against the declared JSON schema.

---

@include .agents/skills/platform/contract-base.xml
