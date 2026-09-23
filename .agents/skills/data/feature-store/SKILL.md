---
name: feature-store
category: data
maturity: stable
version: 1
description: Feature store (online/offline, feature engineering, serving, monitoring, drift).
capabilities:
  - design online and offline feature stores
  - manage feature engineering and transformation logic
  - serve features with low latency for inference
  - monitor feature drift and data quality
outputs:
  - Feature store architecture diagram
  - Feature definitions and schemas
  - Monitoring and drift detection plan
sideEffects: []
dependencies: []
stopCondition: Architecture diagram saved; feature definitions documented; monitoring plan present.
risk: medium
trustTier: 3
maxIterations: 6
---

## Contract

- **Input:** ML use cases, feature candidates, latency requirements, SLA.
- **Output:** feature store architecture + feature definitions + monitoring plan.
- **Side effects:** may read from and write to feature stores when executed.
- **Dependencies:** storage (online: Redis, DynamoDB; offline: S3, warehouse), compute.
- **Stop condition:** architecture saved; features defined; monitoring planned.
- **Risk:** medium — stale or drifting features degrade model performance; requires testing.
- **Boundary:** designs feature store; execution requires approval.

# Feature Store

Design a **feature store** — online/offline, feature engineering, serving, monitoring, and drift detection.

## Process

### 1. Use case and requirements
- Inference latency: real-time (ms), batch (minutes/hours).
- Feature types: categorical, numerical, embedding, time-series.
- Freshness: real-time, near-real-time, daily.
- Team: data scientists, ML engineers, platform team.

**Completion criterion:** use cases and requirements saved.

### 2. Architecture design
- Online store: Redis, DynamoDB, Cassandra, Feast.
- Offline store: S3, GCS, data warehouse, Delta Lake.
- Serving layer: REST / gRPC / feature server.
- Transformation: batch (Spark, dbt) vs streaming (Flink, Kafka Streams).

**Completion criterion:** architecture diagram saved.

### 3. Feature definitions and schemas
- Feature: name, description, type, entity, value type, TTL.
- Entities: user, item, session, device.
- Features: user features (history, demographics), item features (attributes, popularity).
- Point-in-time correctness: avoid leakage with event-time joins.

**Completion criterion:** feature definitions and schemas saved.

### 4. Feature engineering
- Reusable transformations: standardise, normalise, encode, aggregate.
- Feature pipelines: batch backfill vs streaming updates.
- Testing: unit tests for transformations, data quality checks.

**Completion criterion:** transformation logic documented.

### 5. Serving and latency
- Online serving: low-latency lookups, caching, TTL eviction.
- Consistency: online vs offline alignment, point-in-time joins.
- Scalability: sharding, replication, load balancing.

**Completion criterion:** serving design saved.

### 6. Monitoring and drift detection
- Feature quality: null rate, type violations, out-of-range.
- Feature drift: distribution shift (KS test, PSI, Wasserstein).
- Alerting: thresholds, notifications, on-call runbook.
- Model impact: link feature drift to model performance degradation.

**Completion criterion:** monitoring and drift plan saved.
