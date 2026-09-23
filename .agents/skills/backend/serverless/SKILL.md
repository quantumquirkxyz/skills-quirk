---
name: serverless
category: backend
maturity: stable
version: 1
description: Serverless architecture (Lambda, Functions, FaaS, event-driven, cold starts, scaling, cost).
capabilities:
  - design serverless architecture
  - define event-driven flows
  - optimize cold starts and scaling
  - evaluate cost and resource allocation
outputs:
  - Serverless design note with function boundaries, event sources, cold start strategy, scaling policy, cost model, and failure handling
sideEffects: []
dependencies: []
stopCondition: Serverless architecture, event sources, scaling behavior, and cost model are explicit.
risk: medium
trustTier: 3
maxIterations: 6
---

# Serverless

Use this skill when designing, reviewing, or refactoring serverless systems — Lambda, Azure Functions, Google Cloud Functions, FaaS platforms, event-driven workflows, cold start mitigation, auto-scaling, and cost optimization.

## Contract

- Input: workload inventory, event sources, traffic profile, latency requirements, cost constraints, and failure cases.
- Output: serverless architecture with function boundaries, event source mapping, cold start strategy, scaling policy, cost model, and failure handling.
- Scope: serverless architecture design; not infrastructure provisioning unless explicitly requested.
- Rule: prefer event-driven boundaries that match business lifecycle events.
- Rule: keep functions small, focused, and independently deployable.
- Rule: make cold start, concurrency, and timeout behavior explicit for every function.

## Process

### 1. Inventory workloads and event sources
- Catalog existing functions, triggers, and integrations.
- Classify workloads by traffic shape: steady, spiky, batch, or event-burst.
- Map event sources: HTTP, queue, schedule, storage change, or stream.

**Completion criterion:** workload inventory documented with event sources and traffic shape.

### 2. Define function boundaries and triggers
- Group functionality by domain capability and ownership.
- Assign event sources to functions: API Gateway, SQS, SNS, EventBridge, or storage notifications.
- Define function timeout, memory, and environment configuration.

**Completion criterion:** function map documented with triggers, timeouts, and ownership.

### 3. Design cold start and scaling strategy
- Classify functions by latency sensitivity: latency-critical, background, or batch.
- Plan provisioned concurrency, reserved concurrency, and burst limits.
- Define scaling limits and queue-based throttling behavior.

**Completion criterion:** cold start mitigation and scaling limits documented per function class.

### 4. Plan state, storage, and integration
- Choose stateless function design with external state stores: DynamoDB, S3, Redis, or databases.
- Define connection pooling and reuse for external services.
- Plan idempotency and exactly-once processing where required.

**Completion criterion:** state management and integration strategy documented with retry behavior.

### 5. Configure observability and logging
- Define structured logging, distributed tracing, and metric collection.
- Set up error reporting, dead-letter queues, and alarm thresholds.
- Document operational runbook for function failures and throttles.

**Completion criterion:** observability and operational runbook documented.

### 6. Estimate cost and define budgets
- Model cost per invocation, duration, and data transfer.
- Define budget alerts and cost allocation tags.
- Plan cost optimization: memory tuning, batching, and reducing unnecessary invocations.

**Completion criterion:** cost model and budget controls documented.

## Rules

- Rule: keep function logic under the invocation timeout; offload long-running work to queues or step functions.
- Rule: treat environment variables as configuration, not secrets; use a secrets manager for credentials.
- Rule: design for retry semantics at the event source; handle duplicates idempotently.
- Rule: document cold start impact and provisioned concurrency decisions explicitly.
- Rule: version function artifacts and keep deployment immutable.
- Rule: test locally with production-like event payloads and cold start conditions.

## Completion Criteria

- workload inventory and event sources are documented
- function boundaries and triggers are explicit
- cold start mitigation and scaling limits are defined
- state management and integration strategy are documented
- observability and operational runbook are covered
- cost model and budget controls are defined
