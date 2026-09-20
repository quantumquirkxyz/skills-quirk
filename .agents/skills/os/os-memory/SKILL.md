---
name: os-memory
category: os
maturity: stable
version: 1
description: Design operating system memory systems — virtual memory, paging, allocation, swapping, and protection — with explicit resource accounting and locality assumptions.
capabilities:
  - analyze memory management behavior
  - reason about virtual memory and allocation
  - diagnose locality, paging, and protection issues
outputs:
  - memory-system analysis with allocation, paging, protection, and resource assumptions
sideEffects: []
dependencies: []
stopCondition: Memory layout, resource limits, and protection/locality trade-offs are explicit.
risk: low
trustTier: 1
maxIterations: 6
---

# os-memory

Use this skill when reasoning about virtual memory, paging, allocation, swapping, address spaces, memory protection, locality, or OS-level memory pressure.

## Contract

- Input: workload, memory layout, allocation pattern, OS constraints, resource limits, and observed metrics or symptoms.
- Output: memory-behavior analysis with protection, paging, allocation, locality, and mitigation options.
- Scope: OS memory management; language runtime GC specifics belong to the relevant language/runtime context.
- Boundary: separate virtual address space, resident memory, committed memory, and physical memory pressure.

## Rules

- Rule: define which memory metric is being discussed before drawing conclusions.
- Rule: distinguish fragmentation, leaks, cache growth, swapping, and expected working-set size.
- Rule: include page size, locality, NUMA, mmap, copy-on-write, or overcommit when they matter.
- Rule: treat memory protection and privilege boundaries as part of the design.
- Rule: verify pressure with representative workload data when possible.

## Steps

1. Identify process memory layout, allocation pattern, limits, and workload shape.
2. Separate virtual, resident, shared, heap, stack, mapped, and cached memory concerns.
3. Analyze paging, locality, fragmentation, copy-on-write, and swapping behavior.
4. Identify protection and isolation assumptions.
5. Recommend mitigation: allocation strategy, batching, limits, pooling, profiling, or architecture change.
6. Define measurements that would validate the recommendation.

## Completion Criteria

- memory metrics and workload assumptions are explicit
- paging/allocation/protection behavior is explained
- likely failure mode or trade-off is named
- validation measurements are specified
