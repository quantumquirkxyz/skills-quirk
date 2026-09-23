---
name: system-design
category: platform
maturity: stable
version: 1
description: Design whole systems — components, data flow, scaling, reliability, and trade-offs — with clear assumptions and failure boundaries.
capabilities:
  - design system architecture
  - compare trade-offs and failure modes
  - define operational and scaling boundaries
outputs:
  - system design proposal with components, data flow, trade-offs, risks, and operations
sideEffects: []
dependencies: []
stopCondition: Components, data flow, trade-offs, failure modes, and operational assumptions are explicit.
risk: low
trustTier: 1
maxIterations: 6
---

# System Design

Use this skill when shaping an end-to-end system, comparing architectures, defining service boundaries, or explaining scaling and reliability trade-offs.

## Contract

- Input: goals, users, scale, constraints, data model, integration points, and operational requirements.
- Output: system design proposal with components, data flow, APIs, storage, trade-offs, risks, and validation plan.
- Scope: broad system design; defer deep database, frontend, queue, or security details to specialized skills when needed.
- Boundary: make assumptions visible and avoid pretending a single architecture is optimal for every constraint.

## Rules

- Rule: start from requirements, scale, reliability target, and constraints.
- Rule: define components by responsibility and data ownership.
- Rule: trace critical reads, writes, failures, and recovery paths.
- Rule: compare at least one meaningful alternative for major architecture choices.
- Rule: include observability, deployment, migration, and operational ownership.

## Steps

1. Clarify goals, non-goals, users, scale, and constraints.
2. Define domain concepts, data flow, components, and external integrations.
3. Choose storage, APIs, queues, caching, and consistency model where relevant.
4. Analyze failure modes, scaling limits, security boundaries, and operations.
5. Compare alternatives and document trade-offs.
6. Define validation, rollout, and open questions.

## Completion Criteria

- requirements and assumptions are explicit
- components and data flow are described
- trade-offs and alternatives are documented
- failure, scaling, and operational concerns are addressed
