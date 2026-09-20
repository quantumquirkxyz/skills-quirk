---
name: cms-content-strategy
category: cms
maturity: stable
version: 1
description: Design CMS content strategy — content models, taxonomy, governance, lifecycle, and multi-channel publishing — with explicit editorial ownership.
capabilities:
  - model content types and taxonomies
  - define editorial lifecycle and governance
  - plan multi-channel publishing rules
outputs:
  - CMS content strategy with models, taxonomy, ownership, lifecycle, and channel rules
sideEffects: []
dependencies: []
stopCondition: Content model, governance, lifecycle, and publishing rules are explicit.
risk: low
trustTier: 1
maxIterations: 6
---

# cms-content-strategy

Use this skill when designing CMS content models, editorial workflows, taxonomies, governance, content lifecycle, or publishing rules across channels.

## Contract

- Input: business goals, content inventory, audiences, editorial roles, channels, and localization or compliance needs.
- Output: content model, taxonomy, ownership, workflow, lifecycle, and publishing guidance.
- Scope: CMS content strategy; permission modeling belongs to cms-access-control.
- Boundary: model content around editorial intent and reuse, not around a single page layout.

## Rules

- Rule: define content types by purpose, owner, lifecycle, and reusable fields.
- Rule: separate taxonomy, navigation, search facets, and editorial labels.
- Rule: include governance for creation, review, publishing, archival, and deletion.
- Rule: identify channel-specific transformations without duplicating canonical content unnecessarily.
- Rule: account for localization, legal review, accessibility, and freshness where relevant.

## Steps

1. Inventory content, audiences, channels, and editorial pain points.
2. Define canonical content types, fields, relationships, and validation rules.
3. Design taxonomy and metadata for discovery, reuse, and governance.
4. Map editorial workflow, ownership, review gates, and lifecycle states.
5. Specify channel, localization, and archival behavior.
6. Document migration and maintenance considerations.

## Completion Criteria

- content types and taxonomy are explicit
- editorial ownership and lifecycle states are defined
- channel and localization rules are addressed
- governance and maintenance rules are documented
