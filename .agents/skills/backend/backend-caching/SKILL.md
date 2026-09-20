---
name: backend-caching
category: backend
maturity: stable
version: 1
description: Design backend caching strategies — cache keys, TTLs, invalidation, stale-while-revalidate, and cache coherence — with explicit consistency and failure trade-offs.
capabilities:
  - design cache strategy
  - choose keys, TTLs, and invalidation rules
  - evaluate consistency and failure trade-offs
outputs:
  - cache design note with keys, freshness, invalidation, and fallback behavior
sideEffects: []
dependencies: []
stopCondition: Cache purpose, freshness, invalidation, and failure behavior are explicit.
risk: low
trustTier: 1
maxIterations: 6
---

# backend-caching

Use this skill when adding, reviewing, or debugging a backend cache, memoization layer, CDN-backed response cache, read-through cache, or stale-while-revalidate design.

## Contract

- Input: data source, read/write pattern, freshness requirements, traffic profile, failure tolerance, and invalidation triggers.
- Output: cache strategy with keys, TTLs, consistency trade-offs, invalidation rules, and monitoring.
- Scope: backend caching decisions; database query optimization belongs to the query optimization skill.
- Boundary: do not introduce caching until the source of latency or load is understood.

## Rules

- Rule: name the cache's job: latency reduction, load shedding, availability, or cost control.
- Rule: define cache keys from stable identity and all response-affecting dimensions.
- Rule: state freshness guarantees and what stale data can harm.
- Rule: choose explicit invalidation, TTL, write-through, write-behind, or stale-while-revalidate behavior.
- Rule: include fallback behavior for cache outage, stampede, and cold start.

## Steps

1. Identify data, readers, writers, traffic shape, and freshness constraints.
2. Decide cache placement: client, CDN, edge, service, shared store, or local memory.
3. Define key format, value shape, TTL, and invalidation triggers.
4. Analyze consistency risks, stampede risk, and failure behavior.
5. Add observability: hit rate, latency, eviction, stale responses, and backend load.
6. Document rollout, rollback, and cache-warming considerations.

## Completion Criteria

- cache purpose and placement are justified
- keys, TTLs, and invalidation rules are explicit
- stale-data risks and fallback behavior are documented
- monitoring and rollout concerns are covered
