---
name: microservices
category: backend
maturity: stable
version: 1
description: Design microservice architectures — service decomposition, inter-service communication, data ownership, resilience patterns — with explicit boundaries and failure isolation.
capabilities:
  - apply microservices workflow
  - produce microservices artifact
  - validate microservices completion criteria
outputs:
  - Microservices artifact with findings, decisions, recommendations, and validation notes
sideEffects: []
dependencies: []
stopCondition: Design microservice architectures complete; artifact saved; completion criteria checked.
risk: low
trustTier: 1
maxIterations: 6
---

# microservices

Design microservice architectures — service decomposition, inter-service communication, data ownership, resilience patterns — with explicit boundaries and failure isolation.

## Goals
- Decompose monoliths into bounded services
- Define clear ownership of data and behavior
- Plan synchronous and asynchronous communication
- Design for resilience and observability

## Contract

### Input
A description of the system to decompose: domain model, current architecture, scaling needs.

### Output
A microservices decomposition with:
- Service map and ownership boundaries
- Communication patterns (sync/async)
- Data replication strategy
- Resilience patterns (retry, circuit breaker, timeout)

## Steps

1. **Map the domain** — identify bounded contexts and aggregates
2. **Define service boundaries** — single responsibility, high cohesion
3. **Assign data ownership** — which service owns which data
4. **Choose communication style** — REST, gRPC, message queue, event bus
5. **Design resilience** — timeouts, retries, circuit breakers, bulkheads
6. **Plan observability** — distributed tracing, centralized logging

## Rules

- Rule: do not split a service without a clear ownership, scaling, deployment, or team-boundary reason.
- Rule: assign exactly one owner for each source of truth.
- Rule: prefer asynchronous communication only when eventual consistency is acceptable and observable.
- Rule: include timeout, retry, idempotency, and circuit-breaker behavior for every cross-service call.
- Rule: account for distributed tracing, correlation IDs, and operational ownership from the start.

## Completion Criteria

- service boundaries and data ownership are explicit
- communication patterns include failure behavior
- consistency trade-offs are documented
- observability and deployment implications are addressed

## References
- `../backend-architecture/SKILL.md` — service design
- `../../backend/backend-queues/SKILL.md` — async messaging
- `../../foundation/observability/SKILL.md` — observability
- `../../devops/devops-k8s-orchestration/SKILL.md` — deployment
