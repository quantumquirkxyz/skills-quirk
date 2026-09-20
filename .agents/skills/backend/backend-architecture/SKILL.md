---
name: backend-architecture
category: backend
maturity: stable
version: 1
description: Shape backend systems — REST/gRPC APIs, service contracts, data flow, state management, error handling — with explicit seams and caller responsibilities.
capabilities:
  - apply backend architecture workflow
  - produce backend architecture artifact
  - validate backend architecture completion criteria
outputs:
  - Backend Architecture artifact with findings, decisions, recommendations, and validation notes
sideEffects: []
dependencies: []
stopCondition: Shape backend systems complete; artifact saved; completion criteria checked.
risk: low
trustTier: 1
maxIterations: 6
---

# backend-architecture

Shape backend systems — REST/gRPC APIs, service contracts, data flow, state management, error handling — with explicit seams and caller responsibilities.

## Goals
- Design small, durable API seams
- Define request/response contracts explicitly
- Separate business logic from transport layer
- Plan for versioning and backward compatibility

## Contract

### Input
A description of the backend problem: service type, data model, integration points.

### Output
A backend architecture design with:
- API endpoints and contracts
- Data flow diagram
- Error handling strategy
- Service boundaries

## Steps

1. **Identify the domain model** — entities, aggregates, value objects
2. **Define API contracts** — request/response shapes, HTTP methods, status codes
3. **Choose transport protocol** — REST, gRPC, GraphQL, WebSocket
4. **Design service seams** — internal modules, data access layer
5. **Plan error handling** — typed errors, retry logic, circuit breakers
6. **Document the architecture** — ADR or README with diagrams

## Rules

- Rule: define service responsibilities before choosing transport details.
- Rule: make caller obligations, error semantics, and versioning rules explicit.
- Rule: keep business logic behind a stable interface rather than leaking transport concerns inward.
- Rule: include data ownership, persistence boundaries, and transaction assumptions.
- Rule: document operational concerns such as observability, rollout, and backward compatibility.

## Completion Criteria

- domain model and service boundaries are named
- API contracts and error semantics are explicit
- data ownership and state transitions are documented
- versioning and operational concerns are addressed

## References
- `../api-design/SKILL.md` — API seam design
- `../api-contracts/SKILL.md` — contract versioning
- `../../platform/postgres/SKILL.md` — data persistence
