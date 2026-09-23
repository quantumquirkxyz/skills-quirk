---
name: db-nosql-modeling
category: skill-dev/sandbox
maturity: stable
version: 1
description: Design NoSQL data models — document, key-value, wide-column, graph, time-series — with access pattern analysis, consistency requirements, and schema evolution.
capabilities:
  - apply db nosql modeling workflow
  - produce db nosql modeling analysis artifact
  - validate db nosql modeling completion criteria
outputs:
  - Db Nosql Modeling artifact with completed sections, evidence, and limitations
sideEffects: []
dependencies: []
stopCondition: Design NoSQL data models complete; required sections present; completion criteria checked.
risk: low
trustTier: 1
maxIterations: 6
---

## Operating Contract

- **Input:** Db Nosql Modeling request, problem context, constraints, and available evidence.
- **Output:** Db Nosql Modeling artifact with completed analysis, decisions, recommendations, and limitations.
- **Side effects:** follow the frontmatter declaration; do not change systems unless explicitly authorized.
- **Dependencies:** declared dependencies, source material, and domain references required by the task.
- **Stop condition:** Design NoSQL data models is complete, required sections are present, and completion criteria are checked.
- **Risk:** use the frontmatter risk classification and call out any escalation.
- **Boundary:** stay within the skill's declared scope and side-effect policy.

# NoSQL Data Modeling

Design a **NoSQL data model** — document, key-value, wide-column, graph, time-series — with access pattern analysis and consistency trade-offs.

## When to use

- A domain naturally fits a NoSQL store (events, social graph, time-series, cache).
- Relational schema has been over-normalised for the read/write pattern.
- Scalability requirements push past a single RDBMS instance.

## Process

1. Identify access patterns — reads (by key, range, full-text, graph traversal) and writes (append, upsert, batch); frequency and latency requirements.
2. Choose NoSQL type:
   - Document (MongoDB, Couchbase): nested JSON, flexible schema.
   - Key-value (Redis, DynamoDB): simple get/put by key.
   - Wide-column (Cassandra, ScyllaDB): time-series, high-write throughput.
   - Graph (Neo4j, DynamoDB GSI): many-to-many, traversals.
   - Time-series (InfluxDB, TimescaleDB): metric ingestion, downsampling.
3. Design data layout — document structure, key design (partition + sort), column families, graph topology.
4. Consistency model — strong vs eventual; how does this affect correctness of reads?
5. Schema evolution — how are new fields / relationships added without downtime?
6. Scalability — partition/shard key; replication factor; read replicas; hot-key mitigation; backup and restore behavior.
7. Deliver — artifact with access patterns, selected store type, data layout, consistency model, schema evolution plan, and scaling risks.

## Rules

- Rule: design from access patterns before choosing a NoSQL product.
- Rule: state partition keys, sort keys, document boundaries, or graph traversal anchors explicitly.
- Rule: account for consistency, conflict resolution, and read-your-writes expectations.
- Rule: plan schema evolution and backfill paths for existing records.
- Rule: identify hot partitions, fan-out, and query patterns that the model cannot serve.
