---
name: data-lineage
category: data
maturity: stable
version: 1
description: Data lineage (end-to-end tracing, impact analysis, column-level lineage, governance).
capabilities:
  - trace end-to-end data flow from source to consumption
  - perform impact analysis for schema or pipeline changes
  - map column-level lineage across transformations
  - support data governance and compliance audits
outputs:
  - Lineage graph (source → transformation → target)
  - Impact analysis report
  - Column-level mapping documentation
sideEffects: []
dependencies: []
stopCondition: Lineage graph saved; impact analysis complete; column mappings documented.
risk: medium
trustTier: 3
maxIterations: 6
---

## Contract

- **Input:** source systems, transformation logic, target systems, governance requirements.
- **Output:** lineage graph + impact analysis + column-level mapping.
- **Side effects:** may query metadata stores or pipeline registries (read-only).
- **Dependencies:** access to metadata stores, pipeline configuration, data dictionaries.
- **Stop condition:** lineage graph saved; impact analysis complete.
- **Risk:** medium — incomplete lineage can mask compliance gaps; requires validation.
- **Boundary:** traces lineage; does not modify pipelines.

# Data Lineage

Design **data lineage** — end-to-end tracing, impact analysis, column-level lineage, and governance support.

## Process

### 1. Inventory sources and targets
- Identify all source systems (databases, APIs, files, streams).
- Identify all target systems (warehouses, lakes, marts, dashboards).
- Capture ownership and SLAs for each system.

**Completion criterion:** source/target inventory saved.

### 2. Map transformations
- Extract: ingestion jobs, CDC captures, batch loads.
- Transform: cleaning, enrichment, aggregation, deduplication.
- Load: writes to targets, materialised views, BI exports.

**Completion criterion:** transformation map saved.

### 3. Build end-to-end lineage graph
- Nodes: sources, transformations, targets, dashboards, ML models.
- Edges: data flow direction, schedule, volume, freshness.
- Format: directed acyclic graph (DAG) with metadata.

**Completion criterion:** lineage graph saved (ASCII / Mermaid / diagram).

### 4. Column-level lineage
- Track column names, types, and transformations per field.
- Capture renaming, type casting, derivation, and aggregation.
- Link business terms to technical columns.

**Completion criterion:** column-level mapping saved.

### 5. Impact analysis
- Given a schema change, identify affected downstream assets.
- Prioritise by criticality, usage, and SLA.
- Document remediation steps and communication plan.

**Completion criterion:** impact analysis report saved.

### 6. Governance integration
- Tag lineage with data classification (PII, sensitive, public).
- Attach owners, stewards, and retention policies.
- Link to compliance requirements (GDPR, HIPAA, SOX).

**Completion criterion:** governance tags and policies saved.

## Rules

- Rule: trace lineage from source to consumer before declaring impact scope.
- Rule: classify data assets at ingestion time and enforce access boundaries from lineage metadata.
- Rule: separate technical lineage (ETL jobs, queries) from business lineage (reports, dashboards).
- Rule: require owner and steward consent for schema or ownership changes.
- Rule: make lineage queries auditable and retention-aligned with compliance windows.
