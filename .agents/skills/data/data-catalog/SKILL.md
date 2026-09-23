---
name: data-catalog
category: data
maturity: stable
version: 1
description: Data catalog (metadata management, discovery, classification, data mesh, governance).
capabilities:
  - manage metadata for datasets, tables, and streams
  - enable data discovery with search and lineage
  - classify data assets (PII, sensitivity, domain)
  - design data mesh domain ownership
outputs:
  - Catalog schema and metadata model
  - Search and discovery interface design
  - Classification and governance policy
sideEffects: []
dependencies: []
stopCondition: Catalog schema saved; discovery interface designed; governance policy defined.
risk: low
trustTier: 1
maxIterations: 5
---

## Contract

- **Input:** data asset inventory, domain boundaries, governance requirements.
- **Output:** catalog schema + discovery design + governance policy.
- **Side effects:** none.
- **Dependencies:** none.
- **Stop condition:** catalog schema saved; discovery designed.
- **Risk:** low.
- **Boundary:** designs catalog; does not ingest metadata automatically.

# Data Catalog

Design a **data catalog** — metadata management, discovery, classification, data mesh, and governance.

## Process

### 1. Inventory data assets
- Tables, files, streams, APIs, ML datasets, reports.
- Technical metadata: schema, format, location, owner, refresh frequency.
- Business metadata: description, glossary terms, domain, steward.

**Completion criterion:** asset inventory saved.

### 2. Design metadata model
- Core entities: dataset, column, domain, steward, classification, quality score.
- Attributes: name, description, type, format, size, row count, owner, tags.
- Relationships: dataset → columns, dataset → domain, dataset → lineage.

**Completion criterion:** metadata model saved.

### 3. Discovery and search
- Full-text search across names, descriptions, tags.
- Faceted filtering: domain, format, owner, classification, freshness.
- Recommendations: related datasets, popular queries, usage analytics.

**Completion criterion:** discovery interface design saved.

### 4. Classification and tagging
- Sensitivity levels: public, internal, confidential, restricted.
- PII detection: automatic tagging with manual review.
- Domain tags: business unit, product line, data mesh domain.

**Completion criterion:** classification policy saved.

### 5. Data mesh alignment
- Domain-oriented ownership: each domain owns its catalog entries.
- Self-serve infrastructure: discoverable APIs, schemas, samples.
- Federated governance: global policies with local execution.

**Completion criterion:** mesh ownership model saved.

### 6. Governance integration
- Access requests and approval workflows.
- Data quality scores and SLA tracking.
- Audit logs for catalog changes.

**Completion criterion:** governance workflow design saved.

## Rules

- Rule: define one owner per dataset and one steward per domain.
- Rule: classify sensitivity at ingestion time and enforce access boundaries from the catalog.
- Rule: separate technical metadata from business metadata so each can evolve independently.
- Rule: require approval workflows for restricted data and sensitive PII.
- Rule: make catalog entries deletable only with audit trail and steward consent.
