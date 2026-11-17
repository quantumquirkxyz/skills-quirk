---
description: "Retry-with-backoff patterns for agent actions: exponential backoff with jitter, idempotency keys, circuit breakers, and a retry decision table — retry tool errors, never retry hallucinated calls."
---
# retry-backoff

When to use: Retry-with-backoff patterns for agent actions: exponential backoff with jitter, idempotency keys, circuit breakers, and a retry decision table — retry tool errors, never retry hallucinated calls.

## Workflow

1. Classify the error from the tool result (status code, error type, exception kind)
2. Check circuit breaker state; if `open` and cooldown not elapsed, abandon/escalate
3. Consult the retry decision table for `errorType` and action kind
4. Compute delay via exponential backoff with jitter; honor `Retry-After` and idempotency key requirements
5. Emit `RetryDecision` as JSON + Markdown
6. Execute retry, escalate to HITL, or abandon per `decision`

## Deliverables

- retry-backoff artifact

## Guardrails

- risk: low; trust tier: 2; approval required: no
- side effects: none
- isolation: none; model tier: reasoning

Stop when: Retry decision emitted with delay, idempotency key, and circuit breaker state; action either retried, escalated, or abandoned
