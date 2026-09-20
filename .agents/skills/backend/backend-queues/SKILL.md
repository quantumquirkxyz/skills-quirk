---
name: backend-queues
category: backend
maturity: stable
version: 1
description: Design backend queues and background job systems — durability, retries, ordering, idempotency, and backpressure — with explicit delivery guarantees.
capabilities:
  - design queue-backed workflows
  - define retry and idempotency strategy
  - plan backpressure and observability
outputs:
  - queue design note with delivery guarantees, failure handling, and operational signals
sideEffects: []
dependencies: []
stopCondition: Queue behavior, recovery paths, and operator signals are explicit.
risk: low
trustTier: 1
maxIterations: 6
---

# backend-queues

Use this skill when designing background jobs, event consumers, message queues, worker pools, scheduled tasks, or asynchronous workflow boundaries.

## Contract

- Input: job/event type, producer and consumer behavior, ordering needs, durability requirements, expected volume, and failure cases.
- Output: queue architecture, delivery guarantees, retry policy, idempotency plan, and observability checklist.
- Scope: backend queue and worker design; not full stream-processing architecture unless queue semantics are the main decision.
- Boundary: make at-least-once, at-most-once, and exactly-once claims explicit and conservative.

## Rules

- Rule: define the delivery guarantee before designing retries.
- Rule: make every retried job idempotent or explain why duplicate execution is safe.
- Rule: separate transient failures, poison messages, and permanent business rejections.
- Rule: include backpressure behavior for producer overload and worker lag.
- Rule: expose queue depth, age, retry count, dead-letter count, and worker error rate.

## Steps

1. Identify producers, consumers, payload shape, and ownership boundaries.
2. Choose ordering, durability, acknowledgement, and retention semantics.
3. Design retry, timeout, dead-letter, and replay behavior.
4. Define idempotency keys and deduplication or compensation rules.
5. Plan scaling, backpressure, rate limits, and worker shutdown behavior.
6. Specify logs, metrics, alerts, and runbook checks.

## Completion Criteria

- delivery guarantee and ordering needs are named
- retry and dead-letter behavior are specified
- idempotency or duplicate safety is addressed
- operational signals and recovery paths are documented
