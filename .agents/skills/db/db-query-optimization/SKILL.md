---
name: "db-query-optimization"
category: "db"
maturity: "stable"
version: "1"
description: "Optimize database queries — indexing, query plans, cardinality, joins, and execution trade-offs — with explainable reasoning and measurement."
license: "MIT"
capabilities:
  - apply db query optimization methods within explicit db boundaries
  - analyze optimize database queries — indexing, query plans, cardinality, joins, and execution trade-offs — with explainable reasoning and measurement with assumptions, constraints, and failure modes
  - produce and validate a db artifact with evidence, decisions, and next steps
outputs: "bottleneck analysis, recommended rewrite or index change, and validation plan."
sideEffects: []
dependencies: []
stopCondition: "The bottleneck, proposed change, and validation plan are explicit."
risk: "low"
trustTier: "1"
maxIterations: "6"
promptVersion: "2.0"
artifactType: "db"
modelTier: "reasoning"
evaluators: ["behavioral", "regression"]
fixturesPath: tests/skill-output-migration-auxiliary-cms-compilers-cs-db.test.mjs
diataxis: "how-to"
tags: ["db"]
compatibility: []
approvalRequired: "false"
approvalFor: []
---

## Contract

- Input: query, schema, indexes, data volume/cardinality, database engine, and available plan or timing evidence.
- Output: bottleneck analysis, recommended rewrite or index change, and validation plan.
- Scope: do not recommend indexes without considering write cost, storage, and competing query patterns.
- Rule: do not recommend indexes without considering write cost, storage, and competing query patterns.
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

Emit `DbQueryOptimizationArtifact` as both:
- JSON: `.agents/skills/platform/artifacts/db-query-optimization/{identifier}.json`
- Markdown view: same filename with `.md` extension


# db-query-optimization

Use this skill when a query is slow, a database plan changed, an index is being considered, or a data-access pattern needs performance review.


## Rules

- Rule: inspect the execution plan before prescribing a fix when plan data is available.
- Rule: distinguish estimated cardinality from actual row counts.
- Rule: consider joins, filters, ordering, grouping, and projection separately.
- Rule: account for write amplification and maintenance cost of new indexes.
- Rule: validate with representative data, not only empty or toy datasets.

## Steps

1. Capture the query, schema, indexes, engine/version, parameters, and observed latency.
2. Review the execution plan for scans, join strategy, sorting, spills, and misestimated cardinality.
3. Identify the dominant bottleneck and likely cause.
4. Compare candidate fixes: rewrite, index, statistics update, denormalization, or pagination change.
5. Recommend the smallest change with expected impact and trade-offs.
6. Define a before/after validation plan and rollback considerations.

## Completion

- the skill's completion criteria are explicitly checked
- the artifact is saved and validated
- any blockers or skipped validations are documented
- the next consumer is identified or the work is handed off
---
@include .agents/skills/platform/contract-base.xml

## P1 Operational Audit Addendum

- Contract: define schema, ownership, compatibility window, tenant scope, idempotency key, and correlation ID for every operation.
- Safety: require expand/compatibility before destructive change, resumable checkpoints, bounded batches, and an explicit schema rollback, data repair, or forward-fix path with owner and stop condition.
- Security: define ACL, tenant isolation, least privilege, PII classification/redaction/retention, and negative cases for cross-tenant reads, unauthorized writes, malformed input, stale versions, and partial failure.
- Reliability: include timeout, duplicate, crash/restart, replay, lock/contention, replica lag, and dependency outage fixtures; specify reconciliation evidence and when rollback is unsafe.
- SLOs and evidence: state query latency, error rate, throughput, and cost SLOs; capture a baseline with schema digest, cardinality samples, query plans, lock/replication metrics, and backup/restore evidence.
- Provenance and completion: record engine/version, migration IDs, fixture IDs, evidence timestamps, assumptions, and residual unknowns; validate positive and negative cases before completion.