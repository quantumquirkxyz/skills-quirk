---
name: rate-limiting
category: backend
maturity: stable
version: 1
description: Rate limiting and throttling (token bucket, sliding window, distributed rate limiting, API protection).
capabilities:
  - design rate limiting systems
  - configure token bucket and sliding window algorithms
  - implement distributed rate limiting
  - protect APIs with throttling strategies
outputs:
  - Rate limiting design with algorithm selection, limit configuration, distributed coordination, API protection strategy, and operational monitoring
sideEffects: []
dependencies: []
stopCondition: Rate limiting algorithms, limit tiers, distributed coordination, and API protection rules are explicit.
risk: medium
trustTier: 3
maxIterations: 6
---

# Rate Limiting and Throttling

Use this skill when designing, reviewing, or implementing rate limiting and throttling systems — token bucket, sliding window, distributed rate limiting, API protection, and overload prevention.

## Contract

- Input: API inventory, traffic profile, client tiers, SLA targets, abuse patterns, and infrastructure capacity.
- Output: rate limiting design with algorithm selection, limit tiers, distributed coordination, API protection rules, graceful degradation, and monitoring.
- Scope: rate limiting architecture; not infrastructure provisioning unless explicitly requested.
- Rule: rate limiting protects service health; it is not a substitute for capacity planning or auth.
- Rule: classify traffic by client, endpoint, and intent before applying limits.
- Rule: make limit breach behavior explicit: reject, delay, queue, or degrade.

## Process

### 1. Identify protected resources and clients
- Catalog APIs by criticality, cost, and abuse surface.
- Classify clients: anonymous, authenticated, partner, or internal.
- Define traffic baseline, peak load, and growth projections.

**Completion criterion:** API inventory and client classification documented.

### 2. Choose rate limiting algorithms
- Select algorithm per use case: token bucket for bursty traffic, sliding window for strict intervals, fixed window for simplicity, or leaky bucket for steady rate.
- Evaluate distributed vs. local enforcement: edge gateway, service mesh, or application layer.
- Define algorithm parameters: capacity, refill rate, window size, and precision.

**Completion criterion:** algorithm selection documented with parameters and enforcement layer.

### 3. Define limit tiers and rules
- Set limit tiers per client, endpoint, or resource: free, standard, premium, or burst.
- Plan quota periods: per-second, per-minute, per-hour, or daily.
- Define multi-factor limits: requests per IP, per user, per API key, or per resource.

**Completion criterion:** limit tier matrix documented with enforcement granularity.

### 4. Design distributed coordination
- Choose coordination store for distributed limits: Redis, Memcached, or cloud-native.
- Plan consistency model: eventually consistent or strongly consistent counters.
- Handle clock skew, partition tolerance, and store failure behavior.

**Completion criterion:** distributed coordination design documented with failure behavior.

### 5. Plan error handling and graceful degradation
- Define HTTP status and headers for limit breach: 429 Too Many Requests, Retry-After, and X-RateLimit-* headers.
- Plan response degradation: queue requests, serve stale cache, or disable non-critical features.
- Design retry behavior for clients: backoff, jitter, and idempotency.

**Completion criterion:** error handling and degradation strategy documented.

### 6. Configure observability and alerting
- Define metrics: request rate, limit breach rate, 429 count, queue depth, and client impact.
- Configure tracing for rate-limited requests and audit logs for abuse patterns.
- Document operational runbook for false positive tuning and emergency limit changes.

**Completion criterion:** observability and operational runbook documented.

## Rules

- Rule: never rate limit health check or readiness endpoints; they must remain accessible for load balancers and monitoring.
- Rule: set limits conservatively above normal traffic with headroom for legitimate bursts.
- Rule: log limit breach events with client identity and endpoint for audit and tuning.
- Rule: test limit enforcement under load with production-like traffic patterns before deploy.
- Rule: document emergency override procedures for false positives or incidents.
- Rule: apply rate limiting at the edge when possible to protect downstream services.

## Completion Criteria

- API inventory and client classification are documented
- algorithm selection and enforcement layer are justified
- limit tier matrix is documented with enforcement granularity
- distributed coordination design is explicit
- error handling and degradation strategy are defined
- observability and operational runbook are covered
