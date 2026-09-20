---
name: docs-knowledge-base
category: docs
maturity: stable
version: 1
description: Maintain a repository knowledge base — glossary, durable references, indexed guidance, and consumer-oriented navigation — with explicit update rules.
capabilities:
  - organize knowledge-base content
  - design durable navigation
  - identify stale or missing references
outputs:
  - knowledge-base structure or maintenance plan with owners and update rules
sideEffects: []
dependencies: []
stopCondition: Knowledge-base entries are findable, scoped, owned, and linked to durable sources.
risk: low
trustTier: 1
maxIterations: 6
---

# docs-knowledge-base

Use this skill when building or maintaining a repository knowledge base, glossary, handbook, or indexed guidance set that multiple agents or contributors rely on.

## Contract

- Input: existing docs, target audiences, repeated questions, and source-of-truth locations.
- Output: information architecture, index entries, glossary rules, and maintenance plan.
- Scope: durable knowledge organization; not one-off task notes unless they should become reusable references.
- Boundary: link to source material rather than duplicating details that will drift quickly.

## Rules

- Rule: define the consumer of each knowledge-base entry.
- Rule: prefer durable references over copied snapshots when the source changes often.
- Rule: mark ownership and review cadence for pages that guide operational behavior.
- Rule: keep glossary terms precise and avoid competing definitions.
- Rule: remove or retire stale navigation instead of leaving misleading paths.

## Steps

1. Identify recurring questions and the audiences that ask them.
2. Map current docs, source systems, and known stale entries.
3. Define navigation: index, glossary, topic pages, and task-oriented entry points.
4. Decide which content should be canonical, linked, summarized, or retired.
5. Add maintenance rules for owners, review cadence, and drift triggers.
6. Validate the structure by tracing common lookup paths.

## Completion Criteria

- target audiences and common lookup paths are named
- canonical sources and duplicated content are distinguished
- ownership or review cadence is explicit
- stale or missing entries are called out
