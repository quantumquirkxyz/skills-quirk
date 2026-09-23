---
name: performance
category: platform
maturity: stable
version: 1
description: Measure and improve system performance — latency, throughput, resource usage, bottlenecks, and capacity planning — with reproducible profiling.
capabilities:
  - build performance hypotheses
  - plan profiling and measurement
  - recommend bottleneck remediation
outputs:
  - performance analysis with hypothesis, measurements, bottleneck, and validation plan
sideEffects: []
dependencies: []
stopCondition: Performance target, measurements, bottleneck, and validation plan are explicit.
risk: low
trustTier: 1
maxIterations: 6
---

# Performance

Use this skill when diagnosing or improving latency, throughput, resource usage, scalability, capacity, or performance regressions in a system.

## Contract

- Input: performance goal, workload, architecture, measurements, environment, and suspected bottlenecks.
- Output: performance hypothesis, profiling plan, bottleneck analysis, remediation options, and validation criteria.
- Scope: system performance engineering; database-only query tuning belongs to db-query-optimization.
- Boundary: do not optimize without a measurable target and representative workload.

## Rules

- Rule: define the target metric, workload, and measurement environment before interpreting results.
- Rule: separate latency percentiles, throughput, saturation, utilization, and error rate.
- Rule: compare baseline and changed behavior with the same workload.
- Rule: identify the limiting resource before prescribing changes.
- Rule: include regression checks so improvements do not silently degrade later.

## Steps

1. Define user-visible target, SLO or benchmark, workload, and environment.
2. Gather baseline measurements and instrumentation gaps.
3. Build hypotheses about bottlenecks across CPU, memory, I/O, network, locks, and external services.
4. Profile at the narrowest seam that can confirm or reject the hypothesis.
5. Recommend remediation with trade-offs and expected impact.
6. Define validation, regression checks, and rollout monitoring.

## Completion Criteria

- metric, workload, and baseline are explicit
- bottleneck hypothesis is tied to evidence
- remediation includes trade-offs
- validation and regression checks are documented
