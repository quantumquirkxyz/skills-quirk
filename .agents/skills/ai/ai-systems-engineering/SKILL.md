---
name: "ai-systems-engineering"
category: "ai"
maturity: "experimental"
version: "1"
description: "Engineer complete AI systems by integrating product requirements, models, data, evaluation, safety, security, serving, fallback, human oversight, monitoring, cost, and latency; use when an AI feature needs an end-to-end production contract rather than isolated MLOps or prompt work."
license: "MIT"
capabilities:
  - frame AI product requirements as measurable system behavior and constraints
  - connect model, data, evaluation, abuse, serving, fallback, oversight, monitoring, cost, and latency decisions
  - produce and validate an AISystemSpecificationArtifact with explicit evidence and approval gates
outputs: "AISystemSpecificationArtifact containing system spec, model/data contracts, eval matrix, abuse/safety cases, serving topology, fallback policy, monitoring/change gates."
sideEffects: []
dependencies:
  - ai-ml-pipeline
  - mlops
  - ai-model-evaluation
  - llmops
  - data-contracts
  - sec-threat-modeling
  - software-economics
stopCondition: "All required artifact sections are complete, risks and unknowns are explicit, approval gates are identified, and JSON/schema plus Markdown/diff checks pass."
risk: "high"
trustTier: "4"
maxIterations: "8"
promptVersion: "1.0"
artifactType: "ai-system"
modelTier: "reasoning"
evaluators: ["behavioral", "regression"]
fixturesPath: .agents/skills/platform/fixtures/behavioral/ai-systems-engineering.json
diataxis: "how-to"
tags: ["ai", "systems", "safety", "serving"]
compatibility: []
approvalRequired: "true"
approvalFor: ["production-readiness", "high-risk-use", "human-oversight-bypass", "fallback-change"]
---

MCP exposure: This trustTier 4 skill is not exposed over MCP.

## Contract

- Input: product objective, users and affected parties, operating environment, model/provider candidates, data sources, constraints, and applicable policies.
- Output: `AISystemSpecificationArtifact` as a validated JSON artifact and a human-readable Markdown view.
- Scope: specifies the complete AI system and its operational decision gates; it does not silently train, deploy, or approve a system.
- Boundary: cover the product-to-runtime path, including non-model components and human decisions. This is broader than MLOps, LLMOps, prompt engineering, or model evaluation alone.
- Authority: separate observed evidence, derived requirements, assumptions, and unresolved unknowns. Never claim safety, quality, availability, or cost targets are met without evidence.
- Approval: require a human owner for production readiness and any high-risk or safety-sensitive use. A missing approver blocks completion.

## Provenance

| Question | Answer |
|---|---|
| What is the source of truth? | The user request, originating product requirements, applicable policy, and cited evidence |
| What is in scope? | End-to-end AI system behavior, interfaces, risks, controls, operating budgets, and change gates |
| What is explicitly out of scope? | Unapproved production deployment, autonomous policy exceptions, and unsupported claims about model behavior |
| Who or what consumes this artifact afterward? | Product, engineering, security, SRE, evaluation, operations, and human-oversight owners |
| What evidence proves it is done? | Required sections populated, schema validation, diff check, and recorded approvals or blockers |
| What risk remains? | Unknown distribution shift, novel abuse, provider/model changes, and untested operational conditions |

## Artifact

Emit `AISystemSpecificationArtifact` as both:
- JSON: `.agents/skills/platform/artifacts/ai-systems-engineering/{identifier}.json`
- Markdown view: same filename with `.md` extension
- Schema: `.agents/skills/ai/ai-systems-engineering/schemas/ai-system-specification.schema.json`

## Process

### 1. Frame the system
State user goals, non-goals, affected parties, decisions made by the system, unacceptable outcomes, success metrics, and explicit latency, availability, cost, privacy, and safety budgets. Mark assumptions and unknowns.

### 2. Define contracts and data boundaries
Describe model inputs/outputs, tool and API schemas, data ownership, provenance, quality, retention, access, feedback loops, and versioning. Include admission checks and behavior for malformed, missing, sensitive, or out-of-distribution data.

### 3. Build the evaluation matrix
Map requirements to offline, adversarial, human, canary, and production metrics. Include slices, thresholds, confidence/uncertainty, test data lineage, contamination controls, rollback criteria, and explicit non-evaluated claims.

### 4. Model abuse and safety
Document threat actors, prompt/tool injection, privacy leakage, unsafe or biased outputs, misuse, escalation paths, rate abuse, and supply-chain/provider risks. For every case specify prevention, detection, mitigation, owner, evidence, and residual risk.

### 5. Specify serving and fallbacks
Describe request flow, model/provider routing, retrieval/tools, isolation, authorization, timeouts, retries, budgets, caching, queues, degradation modes, fallback eligibility, and fail-closed behavior. Fallbacks must preserve safety and contract compatibility, not merely reduce cost.

### 6. Assign human oversight
Define review triggers, reviewer authority, queue capacity, escalation, audit trail, response-time budget, sampling, and what happens when reviewers are unavailable or overloaded. Do not treat a nominal human-in-the-loop as a control without capacity evidence.

### 7. Define monitoring and change gates
Specify telemetry for quality, safety, drift, data integrity, latency, availability, errors, tokens, cost, queue health, and provider health. Define alert thresholds, ownership, runbooks, canary gates, approval requirements, rollback, and post-change verification.

## Rules

- Do not approve production readiness when a required contract, evaluator, owner, fallback, or monitoring signal is missing.
- Do not treat a model score as proof of system safety, product value, or operational readiness.
- Stop or fail closed on unsafe output, prompt/tool injection, privacy exposure, schema incompatibility, provider outage without a safe fallback, budget breach, or human-review overload.
- Treat model, prompt, retrieval, tool, data, policy, provider, and routing changes as change-controlled inputs.
- Keep cost and latency budgets explicit per request, workload, and aggregate period; record trade-offs instead of hiding them.
- Prefer bounded retries and deterministic degradation over unbounded autonomy.

## Completion

- the system boundary and product requirements are explicit
- model and data contracts are versioned and compatible
- the evaluation matrix covers normal, adversarial, safety, and operational behavior
- abuse/safety cases have controls, owners, evidence status, and residual risk
- serving topology and fallback policy define safe degradation and outage behavior
- human oversight has triggers, capacity, authority, and overload handling
- monitoring and change gates cover quality, safety, reliability, latency, and cost
- JSON validates against the skill-owned schema and the Markdown view passes a diff check against JSON
- approvals, blockers, skipped validations, and next consumers are recorded

---
@include .agents/skills/platform/contract-base.xml
