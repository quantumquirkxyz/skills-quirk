---
name: db-query-optimization
category: db
maturity: stable
version: 1
description: Optimize database queries — indexing, query plans, cardinality, joins, and execution trade-offs — with explainable reasoning and measurement.
capabilities:
  - analyze query performance
  - interpret execution plans
  - recommend indexing and rewrite strategies
outputs:
  - query optimization note with plan evidence, bottleneck, recommendation, and validation path
sideEffects: []
dependencies: []
stopCondition: The bottleneck, proposed change, and validation plan are explicit.
risk: low
trustTier: 1
maxIterations: 6
---

# db-query-optimization

Use this skill when a query is slow, a database plan changed, an index is being considered, or a data-access pattern needs performance review.

## Contract

- Input: query, schema, indexes, data volume/cardinality, database engine, and available plan or timing evidence.
- Output: bottleneck analysis, recommended rewrite or index change, and validation plan.
- Scope: query-level optimization and indexing; broader data modeling belongs to relational or NoSQL modeling skills.
- Boundary: do not recommend indexes without considering write cost, storage, and competing query patterns.

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

## Completion Criteria

- query context and data scale are stated
- plan evidence or missing-plan limitation is documented
- recommendation includes trade-offs
- validation and rollback path are clear
