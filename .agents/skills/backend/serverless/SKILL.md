---
name: "serverless"
category: "backend"
maturity: "stable"
version: "1"
description: "Serverless architecture (Lambda, Functions, FaaS, event-driven, cold starts, scaling, cost)."
license: "MIT"
capabilities:
  - apply serverless methods within explicit backend boundaries
  - analyze serverless architecture (lambda, functions, faas, event-driven, cold starts, scaling, cost) with assumptions, constraints, and failure modes
  - produce and validate a backend artifact with evidence, decisions, and next steps
outputs: "serverless architecture with function boundaries, event source mapping, cold start strategy, scaling policy, cost model, and failure handling."
sideEffects: []
dependencies: []
stopCondition: "Serverless architecture, event sources, scaling behavior, and cost model are explicit."
risk: "medium"
trustTier: "3"
maxIterations: "6"
promptVersion: "2.0"
artifactType: "backend"
modelTier: "reasoning"
evaluators: ["behavioral", "regression"]
fixturesPath: .agents/skills/platform/fixtures/behavioral/serverless.json
diataxis: "how-to"
tags: ["backend"]
compatibility: []
approvalRequired: "true"
approvalFor: []
---

## Contract

- Input: workload inventory, event sources, traffic profile, latency requirements, cost constraints, and failure cases.
- Output: serverless architecture with function boundaries, event source mapping, cold start strategy, scaling policy, cost model, and failure handling.
- Scope: stay within the skill's declared boundaries; do not broaden without explicit direction.
- Rule: documented standards override defaults; explicit project rules take precedence.
- Rule: if blocked by missing context or dependencies, surface the blocker before proceeding.

## Provenance

| Question | Answer |
|---|---|
| What is the source of truth? | The user's request, originating spec/issue, and the skill's declared outputs |
| What is in scope? | Work covered by the skill's acceptance criteria and completion rules |
| What is explicitly out of scope? | Files, behaviors, and decisions outside the skill's declared boundary |
| Who or what consumes this artifact afterward? | The next skill in the workflow or the user |
| What evidence proves it is done? | Completion criteria met, artifact saved, validation passed |
| What risk remains? | Subjective judgment calls, missing context, or external dependency failures


## Artifact

Emit `ServerlessArtifact` as both:
- JSON: `.agents/skills/platform/artifacts/serverless/{identifier}.json`
- Markdown view: same filename with `.md` extension


# Serverless

Use this skill when designing, reviewing, or refactoring serverless systems — Lambda, Azure Functions, Google Cloud Functions, FaaS platforms, event-driven workflows, cold start mitigation, auto-scaling, and cost optimization.


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

## Completion

- the skill's completion criteria are explicitly checked
- the artifact is saved and validated
- any blockers or skipped validations are documented
- the next consumer is identified or the work is handed off
---
@include .agents/skills/platform/contract-base.xml

## P1 Operational Audit Addendum

- Contract: define caller-visible request/response or command contract, ownership, timeout, retry, cancellation, and compatibility rules; include a versioned schema or event envelope with id, type, version, occurredAt, tenantId, traceId, and idempotencyKey where applicable.
- Reliability: make retries and side effects idempotent, and specify a crash/replay fixture proving no duplicate effect after timeout, restart, or redelivery.
- Security: define ACL checks, tenant isolation, least privilege, PII classification/redaction, and negative cases for cross-tenant access, missing claims, malformed envelopes, replayed keys, and unauthorized admin paths.
- SLOs and evidence: state latency, error, throughput, and cost SLOs; capture a pre-change baseline of metrics, trace, schema digest, load assumptions, and post-change evidence.
- Provenance: record source requirements, assumptions, versions, fixture IDs, evidence timestamps, and residual unknowns; do not claim runtime behavior from design-only evidence.
- Completion gate: cover normal, timeout, crash/restart, duplicate, overload, dead-letter, authorization, PII, and dependency-outage cases with rollback or forward-fix ownership.