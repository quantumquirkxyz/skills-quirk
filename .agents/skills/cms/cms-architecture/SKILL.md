---
name: cms-architecture
category: cms
maturity: stable
version: 1
description: Design content management systems — content models, editorial workflows, publishing pipelines, localization — with schema evolution and multi-channel delivery.
capabilities:
  - apply cms architecture workflow
  - produce cms architecture artifact
  - validate cms architecture completion criteria
outputs:
  - Cms Architecture artifact with findings, decisions, recommendations, and validation notes
sideEffects: []
dependencies: []
stopCondition: Design content management systems complete; artifact saved; completion criteria checked.
risk: low
trustTier: 1
maxIterations: 6
---

# cms-architecture

Design content management systems — content models, editorial workflows, publishing pipelines, localization — with schema evolution and multi-channel delivery.

## Goals
- Define content models that are reusable across channels
- Plan editorial workflows with roles and approval states
- Design multi-language and multi-site architecture
- Ensure content portability and schema versioning

## Contract

### Input
A content platform to design: content types, publishing channels, team structure.

### Output
A CMS architecture with:
- Content model (entities, relationships, metadata)
- Editorial workflow (states, roles, transitions)
- Localization strategy
- API design for content delivery

## Content Model Patterns

| Pattern | Use case | Example |
|---|---|---|
| Page | Static, hierarchical | Marketing sites |
| Article | Time-based, rich media | Blogs, news |
| Product | Structured, transactional | E-commerce |
| Component | Reusable, composable | Design systems |
| Taxononomy | Classification | Categories, tags |

## Steps

1. **Audit content** — existing content types, volume, reuse patterns
2. **Define content model** — entities, fields, relationships
3. **Design workflow** — draft → review → approved → published
4. **Plan localization** — language variants, fallback, RTL
5. **Choose CMS architecture** — headless (API), coupled, hybrid
6. **Design delivery API** — query, filter, personalize
7. **Plan migration** — content mapping, transformation scripts

## Rules

- Rule: model content for reuse and governance before page rendering.
- Rule: keep editorial workflow, access control, and publishing pipeline explicit.
- Rule: plan schema evolution and migration paths before locking field names.
- Rule: include localization, preview, rollback, and scheduled publishing needs when relevant.
- Rule: define API delivery contracts separately from authoring UI behavior.

## References
- `../backend/backend-architecture/SKILL.md` — API design
- `../../frontend/frontend-design/SKILL.md` — content rendering
- `../../data/data-etl-pipeline/SKILL.md` — content migration
