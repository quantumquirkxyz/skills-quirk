---
name: distributed-tracing
category: backend
maturity: stable
version: 1
description: Distributed tracing (OpenTelemetry, W3C TraceContext, sampling, instrumentation).
capabilities:
  - design distributed tracing architecture
  - configure OpenTelemetry instrumentation
  - plan sampling and trace storage
  - define trace-based observability
outputs:
  - Distributed tracing artifact with findings, decisions, recommendations, and validation notes
sideEffects: []
dependencies: []
stopCondition: Distributed tracing design complete; artifact saved; completion criteria checked.
risk: medium
trustTier: 3
maxIterations: 6
---

# Distributed Tracing

Use this skill when designing distributed tracing for a service-oriented system — OpenTelemetry, W3C TraceContext, sampling strategies, instrumentation, and trace-based debugging.

## Contract

- Input: service inventory, request topology, observability requirements, and privacy constraints.
- Output: tracing architecture with instrumentation plan, sampling strategy, and backend configuration.
- Scope: design tracing strategy and instrumentation; not infrastructure deployment unless explicitly requested.
- Rule: traces explain latency and failure paths across service boundaries; they are not logs.
- Rule: instrument at the seam where requests enter and leave each service.
- Rule: redact sensitive data from spans before export.

## Process

### 1. Map request topology
- Identify service boundaries, synchronous and asynchronous hops, and external calls.
- Document critical paths and high-latency boundaries where tracing adds the most value.
- Define trace ownership: which service creates the root span and which propagate context.

**Completion criterion:** request topology documented with critical paths and ownership model.

### 2. Configure context propagation
- Choose propagation format: W3C TraceContext (default), B3, or Jaeger.
- Define how trace context is injected and extracted across HTTP, gRPC, messaging, and task queues.
- Handle cross-boundary propagation for asynchronous flows (message headers, job metadata).

**Completion criterion:** context propagation rules documented per transport and boundary.

### 3. Plan instrumentation strategy
- Identify auto-instrumentation candidates: HTTP servers, HTTP clients, gRPC, database drivers, messaging clients.
- Define manual instrumentation for business-critical spans where auto-instrumentation is insufficient.
- Plan span attributes: standard (http.method, http.status_code) and semantic (db.system, messaging.system).

**Completion criterion:** instrumentation plan documented per service and transport.

### 4. Design sampling strategy
- Choose sampling mode: head-based (probability, rate limiting) or tail-based (collect all, sample in backend).
- Define sampling rates per environment: higher in staging, cost-managed in production.
- Plan root span sampling and always-sample rules for critical paths or error traces.

**Completion criterion:** sampling strategy documented with rates and environment overrides.

### 5. Configure trace storage and backend
- Choose backend: Jaeger, Tempo, Zipkin, Datadog, or OpenSearch.
- Define retention policy, index strategy, and access controls.
- Plan trace-to-logs correlation via trace ID injection into log records.

**Completion criterion:** backend configuration and retention policy documented.

### 6. Plan trace-based analysis and alerting
- Define service-level latency and error rate objectives visible via trace analytics.
- Configure alerts on span error rate, latency spikes, and dropped traces.
- Document root cause analysis procedure using trace waterfall and span attributes.

**Completion criterion:** trace-based alerting rules and root cause analysis procedure documented.

## Rules

- Rule: generate trace IDs at the edge; propagate them unconditionally across all hops.
- Rule: keep span attributes bounded; avoid unbounded cardinality (user IDs, request IDs without hashing).
- Rule: redact secrets, tokens, and PII from span attributes and tags before export.
- Rule: instrument both successes and failures; errors without traces are hard to debug.
- Rule: define span ownership: one team owns instrumentation for each service; do not silently drop spans.
- Rule: validate trace completeness in CI using synthetic traffic or integration tests.

## Completion Criteria

- request topology is documented with critical paths and ownership model
- context propagation rules are documented per transport and boundary
- instrumentation plan is documented per service and transport
- sampling strategy is documented with rates and environment overrides
- backend configuration and retention policy are documented
- trace-based alerting rules and root cause analysis procedure are documented
