---
name: event-driven-architecture
category: backend
maturity: stable
version: 1
description: Event-driven architecture (Kafka, NATS, EventBridge, choreography vs orchestration).
capabilities:
  - design event-driven system architecture
  - choose messaging pattern and broker
  - plan choreography and orchestration flows
  - define event schema and contract strategy
outputs:
  - Event-driven architecture artifact with findings, decisions, recommendations, and validation notes
sideEffects: []
dependencies: []
stopCondition: Event-driven architecture design complete; artifact saved; completion criteria checked.
risk: medium
trustTier: 3
maxIterations: 6
---

# Event-Driven Architecture

Use this skill when designing event-driven systems — Kafka, NATS, EventBridge, SQS/SNS — with choreography, orchestration, event schemas, and delivery guarantees.

## Contract

- Input: business workflows, service boundaries, data change frequency, and consistency requirements.
- Output: event architecture with topic/stream design, schema registry plan, and flow diagrams.
- Scope: design event topology and contracts; not broker provisioning unless explicitly requested.
- Rule: events describe what happened, not what to do; keep them immutable and past-tense.
- Rule: define schema before topic creation; version schemas explicitly.
- Rule: choose choreography for loose coupling; choose orchestration for explicit control flow.

## Process

### 1. Inventory events and workflows
- List business events and their producers and consumers.
- Identify synchronous vs asynchronous boundaries and where eventual consistency is acceptable.
- Map workflows that span multiple services.

**Completion criterion:** event inventory and workflow map documented.

### 2. Choose messaging pattern
- Evaluate choreography (each service reacts to events independently) vs orchestration (central coordinator).
- Choose broker: Kafka (high throughput, log-based), NATS (lightweight, low latency), EventBridge (serverless, AWS-native), or SQS/SNS (simple queueing).
- Justify choice against durability, ordering, throughput, and operational cost.

**Completion criterion:** pattern and broker chosen with rationale per workflow.

### 3. Design topics, streams, and queues
- Define topic naming convention, partition strategy, and retention policy.
- Plan consumer groups, subscription patterns, and replay requirements.
- Design dead-letter queues and retry policies for poison messages.

**Completion criterion:** topic/stream design documented with partition, retention, and DLQ strategy.

### 4. Define event schema and contracts
- Choose schema format (Avro, Protobuf, JSON Schema) and schema registry tooling.
- Define backward and forward compatibility rules for schema evolution.
- Document required vs optional fields and schema versioning policy.

**Completion criterion:** schema format, compatibility rules, and versioning policy documented.

### 5. Plan delivery guarantees and idempotency
- Define required delivery semantics per event type: at-most-once, at-least-once, exactly-once.
- Design idempotency keys and consumer deduplication strategies.
- Plan ordering guarantees where required and how to handle out-of-order delivery.

**Completion criterion:** delivery guarantee matrix and idempotency strategy documented.

### 6. Design observability and operations
- Configure metrics: publish rate, consume rate, consumer lag, error rate, retry rate.
- Enable distributed tracing with event context propagation.
- Document schema migration procedure and consumer compatibility testing.

**Completion criterion:** observability strategy and operational runbook documented.

## Rules

- Rule: never couple event schema to internal database schema; use an anti-corruption layer.
- Rule: treat events as immutable; never update or delete a published event.
- Rule: version schemas from day one; breaking changes require a new topic or schema version.
- Rule: design consumers to be resilient to missing, duplicate, or out-of-order events.
- Rule: set retention and compaction policies based on replay and debugging needs, not unlimited storage.
- Rule: avoid chatty event topologies; prefer fewer, richer events over many tiny events.

## Completion Criteria

- event inventory and workflow map are documented
- messaging pattern and broker are chosen with rationale
- topic/stream design includes partition, retention, and DLQ strategy
- schema format, compatibility rules, and versioning policy are documented
- delivery guarantee matrix and idempotency strategy are documented
- observability strategy and operational runbook are documented
