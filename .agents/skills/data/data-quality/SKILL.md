---
name: data-quality
category: skill-dev/sandbox
maturity: stable
version: 1
description: Design data quality frameworks — Great Expectations, Soda, checks, observability, contracts — with explicit SLAs, freshness rules, and incident response for bad data.
capabilities:
  - define data quality dimensions (freshness, volume, distribution, referential integrity)
  - design check suites (expectations, thresholds, anomaly detection)
  - implement observability (metrics, alerts, dashboards)
  - define data contracts between producers and consumers
outputs:
  - Data quality framework (dimensions, SLAs, ownership)
  - Check suite configuration (Great Expectations / Soda)
  - Observability and alerting rules
  - Data contract specification
sideEffects: []
dependencies: []
stopCondition: Framework defined; check suite configured; observability and contract rules documented.
risk: medium
trustTier: 3
maxIterations: 6
---

## Contract

- **Input:** data inventory, producer/consumer map, SLAs, freshness requirements.
- **Output:** data quality framework + check suite + observability + data contract.
- **Side effects:** none.
- **Dependencies:** data quality tooling (Great Expectations, Soda, Monte Carlo), monitoring stack, data catalog.
- **Stop condition:** framework defined; check suite configured; observability and contract rules documented.
- **Risk:** medium — bad data propagates to downstream systems; requires proactive detection.
- **Boundary:** designs quality framework; does not execute data pipelines or modify production data unless explicitly instructed.

# Data Quality

Design a **data quality framework** — Great Expectations, Soda, checks, observability, contracts — with explicit SLAs, freshness rules, and incident response for bad data.

## Process

### 1. Inventory and ownership
- Data assets (tables, streams, files, APIs) with owners.
- Producer/consumer map (who writes, who reads, downstream dependencies).
- Criticality tiers (P0: financial / safety; P1: operational; P2: analytical).
- SLA definitions (freshness, completeness, accuracy).

**Completion criterion:** data inventory with owners and criticality tiers documented.

### 2. Quality dimensions
- Freshness (staleness threshold, lag alerts).
- Volume (row count, file size, expected range).
- Distribution (value ranges, null percentages, duplicates, cardinality).
- Referential integrity (foreign keys, joins, orphaned records).
- Uniqueness (primary keys, business keys).
- Validity (schema conformance, type checks, regex patterns).

**Completion criterion:** quality dimensions mapped to assets with thresholds.

### 3. Check suite design
- Expectation types (row count, column null %, unique, value set, regex, cross-column).
- Thresholds and tolerances (hard fail, warning, drift detection).
- Anomaly detection (seasonality-aware, change point detection).
- Check placement (ingestion, transformation, warehouse load, API response).

**Completion criterion:** check suite with thresholds and placement defined.

### 4. Tooling and implementation
- Tool selection (Great Expectations, Soda, Monte Carlo, custom SQL).
- Integration points (Airflow, dbt, Spark, Kafka, CI/CD).
- Check execution (scheduled, event-driven, on-demand).
- Result storage and versioning (expectation suite as code).

**Completion criterion:** tool selection and integration plan defined.

### 5. Observability and alerting
- Metrics (pass rate, failure count, time-to-detect, time-to-resolve).
- Dashboards (per-table health, SLA compliance, trend over time).
- Alert routing (on-call, data owner, platform team).
- Incident response (runbook, severity, escalation for data incidents).

**Completion criterion:** observability dashboard and alerting rules defined.

### 6. Data contracts
- Schema and semantics (column names, types, units, allowed values).
- Producer guarantees (freshness, completeness, format version).
- Consumer obligations (handling nulls, handling schema changes, deprecation notice).
- Versioning and breaking change policy.

**Completion criterion:** data contract specification with versioning policy defined.

## Rules

- Rule: treat data quality as a product feature, not an afterthought; assign owners.
- Rule: define SLAs in terms of business impact, not just technical thresholds.
- Rule: run checks as close to the source as possible; fail fast and loud.
- Rule: version expectation suites alongside data models and pipeline code.
- Rule: require data contracts for any cross-team or cross-service data exchange.
