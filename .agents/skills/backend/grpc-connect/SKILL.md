---
name: grpc-connect
category: backend
maturity: stable
version: 1
description: gRPC and Connect (protobuf, ConnectRPC, grpc-gateway, streaming, code generation).
capabilities:
  - design gRPC service contracts
  - configure protobuf schemas
  - plan streaming and unary APIs
  - design ConnectRPC and grpc-gateway integration
outputs:
  - gRPC/Connect artifact with findings, decisions, recommendations, and validation notes
sideEffects: []
dependencies: []
stopCondition: gRPC/Connect design complete; artifact saved; completion criteria checked.
risk: medium
trustTier: 3
maxIterations: 6
---

# gRPC and Connect

Use this skill when designing gRPC services, ConnectRPC APIs, or gRPC-to-REST gateway layers — protobuf contracts, streaming patterns, code generation, and cross-language compatibility.

## Contract

- Input: service interface requirements, data shapes, transport constraints, and client ecosystems.
- Output: service contract design with proto definitions, streaming plan, and gateway configuration.
- Scope: design protobuf contracts and API structure; not infrastructure deployment unless explicitly requested.
- Rule: define the contract before implementation; protobuf is the single source of truth for the API.
- Rule: keep messages flat and version-friendly; avoid deep nesting that resists field addition.
- Rule: document error codes, retry behavior, and timeout expectations per method.

## Process

### 1. Define service and method surface
- List RPC methods: unary, server streaming, client streaming, or bidirectional.
- Assign method semantics: idempotent, safe, retriable, or side-effecting.
- Group methods into services by domain boundary and ownership.

**Completion criterion:** service surface documented with method semantics.

### 2. Design protobuf schema
- Define `.proto` file structure: packages, imports, message types, enums.
- Choose field numbering strategy to leave room for future fields.
- Define `google.protobuf` well-known types where applicable (Timestamp, Duration, Struct).

**Completion criterion:** proto schema documented with field numbering and type choices.

### 3. Plan versioning and compatibility
- Define backward-compatible evolution rules: additive fields only, reserved field numbers for removed fields.
- Choose wire compatibility testing strategy.
- Document how consumers detect schema changes (reflection, descriptor sets, or version headers).

**Completion criterion:** versioning and compatibility rules documented.

### 4. Design streaming and long-running operations
- Choose streaming type per use case: server streaming for feeds, client streaming for ingestion, bidi for chat or sync.
- Define flow-control, backpressure, and cancellation semantics.
- Plan timeout and keepalive for long-running streams.

**Completion criterion:** streaming design documented with flow control and timeout behavior.

### 5. Configure ConnectRPC and gateway
- Choose transport layer: pure gRPC, ConnectRPC (HTTP/JSON + gRPC), or both.
- Design `grpc-gateway` annotations for REST mapping if dual-protocol is needed.
- Define error mapping: gRPC status codes to HTTP status codes for REST clients.

**Completion criterion:** transport and gateway configuration documented.

### 6. Plan code generation and CI
- Define generator pipeline: protoc plugins for Go, TypeScript, Python, etc.
- Set up generated code versioning and CI validation.
- Document client SDK packaging and distribution strategy.

**Completion criterion:** code generation pipeline and CI integration documented.

## Rules

- Rule: never reuse field numbers; reserve removed numbers immediately.
- Rule: treat proto files as public API contracts; review changes with the same rigor as REST API changes.
- Rule: use packages and import boundaries to prevent schema sprawl across teams.
- Rule: document retry budgets, idempotency keys, and safe-for-retry semantics per method.
- Rule: enable reflection and health checking for operational visibility.
- Rule: validate proto files in CI with linter, breaking-change detector, and code generation check.

## Completion Criteria

- service surface is documented with method semantics
- proto schema is documented with field numbering and type choices
- versioning and compatibility rules are documented
- streaming design includes flow control and timeout behavior
- transport and gateway configuration are documented
- code generation pipeline and CI integration are documented
