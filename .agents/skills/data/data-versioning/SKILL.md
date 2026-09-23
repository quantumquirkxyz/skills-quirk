---
name: data-versioning
category: data
maturity: stable
version: 1
description: Data versioning (DVC, lakeFS, delta tables, snapshotting, reproducibility).
capabilities:
  - version datasets and ML assets with DVC or lakeFS
  - design delta table versioning and time travel
  - implement snapshotting for reproducibility
  - manage branching and merging for data
outputs:
  - Versioning strategy and tool selection
  - Branching and merging workflow
  - Reproducibility and rollback plan
sideEffects: []
dependencies: []
stopCondition: Versioning strategy saved; branching workflow defined; reproducibility plan documented.
risk: medium
trustTier: 3
maxIterations: 6
---

## Contract

- **Input:** data assets, reproducibility requirements, collaboration model.
- **Output:** versioning strategy + branching workflow + reproducibility plan.
- **Side effects:** may create snapshots or branches when executed.
- **Dependencies:** versioning tool (DVC, lakeFS, Delta Lake), object store.
- **Stop condition:** strategy saved; workflow defined; plan documented.
- **Risk:** medium — stale versions or branching conflicts; requires testing.
- **Boundary:** designs versioning; execution requires approval.

# Data Versioning

Design **data versioning** — DVC, lakeFS, delta tables, snapshotting, and reproducibility.

## Process

### 1. Assess versioning needs
- Datasets: raw, processed, feature, model.
- Frequency of change: static, nightly, streaming.
- Team collaboration: single team, cross-team, external.
- Compliance: audit trail, retention, immutability.

**Completion criterion:** requirements and constraints saved.

### 2. Tool selection
- DVC: Git-like versioning for files and ML pipelines; works with any storage.
- lakeFS: open-source Git-like lakehouse; branch/commit/merge for data lakes.
- Delta Lake: ACID transactions, time travel, schema enforcement on lakes.
- Iceberg / Hudi: alternative table formats with versioning.

**Completion criterion:** tool selection saved with justification.

### 3. Versioning strategy
- Granularity: file-level, table-level, snapshot-level.
- Naming: semantic versioning, timestamped, hash-based.
- Metadata: commit messages, author, timestamp, diff summary.
- Storage: object store (S3, GCS, ADLS) with versioning enabled.

**Completion criterion:** versioning strategy saved.

### 4. Branching and merging
- Branching: dev / staging / prod; experiment branches for ML.
- Merging: conflict resolution, merge commits, cherry-pick.
- CI/CD: validate branches before merge (schema, quality, tests).

**Completion criterion:** branching workflow saved.

### 5. Snapshotting and reproducibility
- Snapshots: point-in-time captures of datasets and code.
- Provenance: link data version to code version, config, environment.
- Rollback: revert to previous snapshot with validation.

**Completion criterion:** snapshot and rollback plan saved.

### 6. Integration with ML pipelines
- Experiment tracking: data version → model version → metrics.
- Feature reproducibility: pin feature dataset version.
- Deployment: promote approved data versions to production.

**Completion criterion:** ML integration design saved.
