---
name: api-gateway
category: backend
maturity: stable
version: 1
description: API gateway (Kong, Envoy, AWS API Gateway, rate limiting, auth, routing).
capabilities:
  - design API gateway architecture
  - configure rate limiting and auth
  - plan request routing and transformation
  - define gateway observability
outputs:
  - API gateway artifact with findings, decisions, recommendations, and validation notes
sideEffects: []
dependencies: []
stopCondition: API gateway design complete; artifact saved; completion criteria checked.
risk: medium
trustTier: 3
maxIterations: 6
---

# API Gateway

Use this skill when designing or reviewing an API gateway layer — Kong, Envoy, AWS API Gateway, or similar — for routing, rate limiting, authentication, and observability.

## Contract

- Input: backend service inventory, traffic profile, auth requirements, and SLA targets.
- Output: gateway architecture with route rules, policies, auth configuration, and observability plan.
- Scope: design gateway configuration and policies; not infrastructure provisioning unless explicitly requested.
- Rule: the gateway is the public surface; all external traffic must pass through it.
- Rule: define service ownership and route precedence explicitly to avoid shadow routes.
- Rule: enforce auth, rate limits, and schema validation at the edge.

## Process

### 1. Catalog backend services
- Inventory all internal services, their paths, versions, and owners.
- Define service contract: expected request/response shapes and auth requirements.
- Map dependencies between services and external APIs.

**Completion criterion:** service catalog documented with routes, versions, and owners.

### 2. Design routing rules
- Define path-based, host-based, and header-based routing rules.
- Plan versioning strategy (path prefix, header, or query parameter).
- Configure retries, timeouts, circuit breaking, and fallback routes.

**Completion criterion:** routing rules documented with precedence and fallback behavior.

### 3. Configure rate limiting and quotas
- Set per-client, per-route, or per-user rate limits based on SLA.
- Define burst allowance, quota periods, and limit-by headers.
- Plan graceful degradation when limits are exceeded (429 with Retry-After).

**Completion criterion:** rate limit matrix documented with enforcement strategy.

### 4. Implement authentication and authorization
- Choose auth mechanism per route: API key, JWT, OAuth2, mTLS, or custom.
- Configure upstream credential injection or header transformation.
- Define auth failure behavior (401, 403, redirect) and token validation rules.

**Completion criterion:** auth strategy per route documented with token handling.

### 5. Configure request transformation
- Plan request/response body and header transformation rules.
- Define caching policies for idempotent GET requests.
- Set up CORS, request/response logging, and payload size limits.

**Completion criterion:** transformation and caching rules documented.

### 6. Plan observability and operations
- Design gateway metrics: request rate, error rate, latency, upstream health.
- Configure distributed tracing propagation and log enrichment.
- Document rollout, rollback, and canary routing for gateway config changes.

**Completion criterion:** observability and operational runbook documented.

## Rules

- Rule: enforce TLS termination and HSTS at the gateway edge.
- Rule: reject malformed requests before they reach backend services.
- Rule: keep route rules and policies as code; version control gateway configuration.
- Rule: log request metadata (not sensitive payloads) for audit and debugging.
- Rule: define health check endpoints and upstream failure behavior explicitly.
- Rule: test gateway config changes in staging with production-like traffic before deploy.

## Completion Criteria

- service catalog is documented with routes, versions, and owners
- routing rules are defined with precedence and fallback behavior
- rate limit matrix is documented with enforcement strategy
- auth strategy per route is documented with token handling
- transformation and caching rules are documented
- observability and operational runbook are documented
