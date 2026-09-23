---
name: caching-advanced
category: backend
maturity: stable
version: 1
description: Advanced caching strategies (Redis, Memcached, CDN, cache invalidation, stampede prevention).
capabilities:
  - design advanced cache architectures
  - configure Redis and Memcached
  - optimize CDN strategies
  - implement stampede prevention and cache invalidation
outputs:
  - Advanced caching design with store selection, key strategy, invalidation policy, stampede prevention, consistency model, and operational runbook
sideEffects: []
dependencies: []
stopCondition: Cache architecture, invalidation strategy, stampede prevention, and consistency model are explicit.
risk: medium
trustTier: 3
maxIterations: 6
---

# Advanced Caching

Use this skill when designing, reviewing, or optimizing advanced caching systems — Redis, Memcached, CDN, cache invalidation patterns, stampede prevention, consistency models, and multi-tier cache hierarchies.

## Contract

- Input: data access patterns, read/write ratio, latency requirements, consistency needs, traffic profile, and failure tolerance.
- Output: advanced caching design with store selection, key strategy, invalidation policy, stampede prevention, consistency model, and operational runbook.
- Scope: advanced caching architecture; not infrastructure provisioning unless explicitly requested.
- Rule: classify data by access frequency, mutability, and consistency tolerance before selecting stores.
- Rule: treat the cache as a performance optimization, not a source of truth.
- Rule: make invalidation, consistency, and failure behavior explicit and testable.

## Process

### 1. Analyze access patterns and requirements
- Catalog data: size, shape, read/write ratio, hot keys, and churn rate.
- Classify data by consistency requirement: strong, eventual, or best-effort.
- Identify latency and throughput targets per data class.

**Completion criterion:** data catalog and consistency requirements documented.

### 2. Select cache stores and layers
- Choose store per data class: in-process (Caffeine, Go cache), Redis (cluster or sentinel), Memcached, or CDN.
- Design multi-tier hierarchy: L1 local, L2 shared, L3 CDN or edge.
- Plan eviction policy per tier: LRU, LFU, TTL, or size-based.

**Completion criterion:** store selection and tier hierarchy documented with eviction policy.

### 3. Design key strategy and data shape
- Define key format: stable identity, versioning, and response-affecting dimensions.
- Choose value serialization and compression: JSON, Protobuf, MessagePack, or binary.
- Plan key lifecycle, rotation, and bulk invalidation approach.

**Completion criterion:** key format, value shape, and serialization strategy documented.

### 4. Plan invalidation and consistency
- Choose invalidation strategy: TTL, write-through, write-behind, or explicit invalidation.
- Define consistency model: cache-aside, read-through, write-through, or refresh-ahead.
- Plan handling for stale data, thundering herds, and cache outages.

**Completion criterion:** invalidation strategy and consistency model documented with failure behavior.

### 5. Implement stampede prevention
- Design stampede prevention: probabilistic early expiration, request coalescing, or jittered TTLs.
- Plan request mutex or single-flight for expensive regenerations.
- Define fallback behavior when regeneration fails or times out.

**Completion criterion:** stampede prevention mechanism documented with regeneration and fallback behavior.

### 6. Configure observability and operations
- Define metrics: hit rate, latency, eviction count, memory usage, key count, and error rate.
- Configure alerts for cache outage, high eviction, or degradation.
- Document operational runbook for scaling, failover, and cache warming.

**Completion criterion:** observability and operational runbook documented.

## Rules

- Rule: never cache data without understanding its mutation rate and consistency requirements.
- Rule: name the cache's job explicitly: latency reduction, load shedding, availability, or cost control.
- Rule: set explicit TTL bounds; avoid unbounded or infinite caching without review.
- Rule: test invalidation and stampede behavior under load before production deployment.
- Rule: encrypt sensitive cache data at rest and in transit.
- Rule: treat cache configuration as code; version control and review changes.

## Completion Criteria

- data catalog and consistency requirements are documented
- store selection and tier hierarchy are justified
- key format, value shape, and serialization strategy are explicit
- invalidation strategy and consistency model are documented
- stampede prevention mechanism is defined
- observability and operational runbook are covered
