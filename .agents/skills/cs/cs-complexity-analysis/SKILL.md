---
name: cs-complexity-analysis
category: cs
maturity: stable
version: 1
description: Analyze algorithmic complexity — time, space, amortized cost, and lower bounds — with explicit assumptions and proof sketches.
capabilities:
  - analyze asymptotic complexity
  - compare algorithmic trade-offs
  - justify bounds with assumptions
outputs:
  - complexity analysis with time, space, assumptions, and proof sketch
sideEffects: []
dependencies: []
stopCondition: Complexity bounds are stated, justified, and tied to the chosen input model.
risk: low
trustTier: 1
maxIterations: 6
---

# cs-complexity-analysis

Use this skill when a task asks how an algorithm scales, why one approach is faster, how much memory is needed, or whether an optimization changes asymptotic behavior.

## Contract

- Input: algorithm, pseudocode, implementation, recurrence, or data-structure operation.
- Output: time and space bounds with assumptions, proof sketch, and meaningful constants or bottlenecks when relevant.
- Scope: asymptotic and practical complexity reasoning; not benchmarking unless measurements are provided.
- Boundary: call out input model, operation costs, and whether average, worst, best, or amortized analysis is being used.

## Rules

- Rule: define `n` and every secondary variable before using a bound.
- Rule: distinguish worst-case, expected, amortized, and empirical performance.
- Rule: include space complexity separately from time complexity.
- Rule: solve recurrences with a named method when the recurrence is non-trivial.
- Rule: do not claim an optimization improves complexity unless the dominant term changes.

## Steps

1. Identify inputs, size variables, and cost model.
2. Break the algorithm into loops, recursive calls, operations, and data-structure interactions.
3. Derive local costs and combine them into a total bound.
4. Simplify the asymptotic expression while preserving meaningful parameters.
5. Check tightness or give upper/lower bounds when exact tightness is unclear.
6. Explain trade-offs and edge cases that affect real performance.

## Completion Criteria

- input-size variables and cost model are named
- time and space bounds are stated separately
- assumptions and case type are explicit
- the reasoning path is visible enough to audit
