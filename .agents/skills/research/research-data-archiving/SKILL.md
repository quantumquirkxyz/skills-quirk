---
name: research-data-archiving
category: research
maturity: stable
version: 1
description: Archive research data — metadata, storage, preservation, provenance, and reuse planning — with reproducibility and access controls.
capabilities:
  - design research data archives
  - define metadata and provenance requirements
  - plan preservation, access, and reuse
outputs:
  - research archive plan with data inventory, metadata, provenance, access, and preservation rules
sideEffects: []
dependencies: []
stopCondition: Data, metadata, provenance, access controls, and preservation plan are explicit.
risk: low
trustTier: 1
maxIterations: 6
---

# research-data-archiving

Use this skill when preparing research data, code, notebooks, instruments outputs, or derived datasets for preservation, publication, review, or reuse.

## Contract

- Input: dataset inventory, file formats, provenance, privacy/compliance constraints, repository target, and reuse goals.
- Output: archive plan with metadata schema, storage layout, provenance, access policy, retention, and reproducibility checks.
- Scope: data archiving and preservation; analysis methodology belongs to the relevant research or domain skill.
- Boundary: do not expose restricted data; document de-identification, embargo, or controlled access when needed.

## Rules

- Rule: inventory raw, processed, derived, code, environment, and documentation artifacts separately.
- Rule: preserve provenance from collection through processing and analysis.
- Rule: choose open, documented formats unless domain standards require otherwise.
- Rule: include metadata sufficient for discovery, interpretation, reuse, and citation.
- Rule: define access controls, licenses, retention, and sensitive-data handling explicitly.

## Steps

1. Inventory data, code, environments, instruments, and documentation.
2. Identify provenance, transformations, versions, and quality-control checks.
3. Choose archive structure, formats, metadata schema, identifiers, and citation method.
4. Define access policy, license, embargo, privacy, and retention rules.
5. Add reproducibility checks for loading, running, and interpreting the archive.
6. Document maintenance and long-term preservation responsibilities.

## Completion Criteria

- archive inventory is complete enough to reproduce the work
- metadata and provenance are explicit
- access, license, and sensitivity constraints are documented
- reuse and preservation checks are defined
