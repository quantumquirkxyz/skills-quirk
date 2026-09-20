---
name: cs-data-structures
category: cs
maturity: stable
version: 1
description: Design and analyze data structures — arrays, trees, heaps, hash tables, graphs, and balanced variants — with operation costs and invariants.
capabilities:
  - select data structures for access patterns
  - compare operation costs and invariants
  - design data-structure APIs
outputs:
  - data-structure recommendation with operations, invariants, and complexity table
sideEffects: []
dependencies: []
stopCondition: The recommended structure, invariants, and operation costs are explicit.
risk: low
trustTier: 1
maxIterations: 6
---

# cs-data-structures

Use this skill when choosing, designing, or reviewing a data structure for a specific workload, API, or algorithm.

## Contract

- Input: access patterns, operations, constraints, and expected data size.
- Output: recommended data structure, operation complexity, invariants, and failure modes.
- Scope: in-memory and algorithmic data structures; storage engines only when their abstract behavior matters.
- Boundary: prefer a simpler structure when it satisfies the workload and keeps invariants easier to maintain.

## Rules

- Rule: start from required operations, not from a favorite structure.
- Rule: state invariants that must hold after every mutation.
- Rule: compare at least one plausible alternative when the choice is not obvious.
- Rule: include memory overhead and locality when they materially affect the design.
- Rule: treat hash behavior, balancing, and ordering guarantees as explicit assumptions.

## Steps

1. List required operations and query/update frequency.
2. Identify constraints: ordering, duplicates, concurrency, memory, persistence, and latency.
3. Select candidate structures and compare operation costs.
4. Define invariants, mutation rules, and edge cases.
5. Recommend the structure and explain rejected alternatives.
6. Describe tests or proofs that would catch invariant violations.

## Completion Criteria

- required operations are named
- the chosen structure and alternatives are compared
- time and space trade-offs are documented
- invariants and mutation edge cases are explicit
