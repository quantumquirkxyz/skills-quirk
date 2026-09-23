---
name: llmops
category: ai
maturity: stable
version: 1
description: LLMOps (deployment, monitoring, A/B testing, prompt management, cost optimization, evaluation pipelines)
capabilities:
  - deploy LLM applications to staging and production with rollback discipline
  - configure monitoring for latency, error rate, token usage, and cost
  - design A/B testing experiments for prompt variants and model swaps
  - manage prompt and chain versions with promotion rules and rollback
  - optimize cost through token budgets, model routing, and caching
  - implement evaluation pipelines with regression detection and canary checks
outputs:
  - Deployment manifest (image, environment, canary thresholds)
  - Monitoring config (latency, error, token, cost metrics, alerts)
  - A/B experiment spec (hypothesis, variants, success criteria, duration)
  - Prompt registry (versioned, validated, promoted)
  - Evaluation pipeline (dataset, metrics, regression gate, report)
sideEffects: []
dependencies: []
stopCondition: Deployment published; monitoring active; evaluation pipeline green.
risk: medium
trustTier: 3
maxIterations: 8
---

## Contract

- **Input:** LLM application, deployment target, acceptance criteria.
- **Output:** deployment manifest + monitoring config + A/B spec + prompt registry + evaluation pipeline.
- **Side effects:** deploy containers, provision cloud resources, run inference at scale.
- **Dependencies:** container registry, Kubernetes, Terraform, CI/CD, model endpoint, secret store, monitoring stack.
- **Stop condition:** deployment live; alerts configured; evaluation pipeline green.
- **Risk:** medium — production traffic depends on correct deploy and monitoring; cost overruns possible.
- **Boundary:** deploys and configures LLM operations; does not build model weights.

# LLMOps

Deploy, monitor, and operate LLM applications in production with discipline.

## Process

### 1. Pre-flight acceptance
Collect: traffic targets, latency budget, error budget, token cost budget, failure mode table.

**Completion criterion:** acceptance document with targets and failure modes.

### 2. Deployment manifest
Package container: pinned base image, dependencies, secrets, LLM endpoint, prompt registry ref.
Publish to registry; configure staging and production manifests; define rollback and health checks.

**Completion criterion:** manifest versioned; staged deploy green.

### 3. Monitoring and alerting
Emit metrics: latency (p50/p95/p99), error rate (4xx/5xx), token usage (input/output), cost per request, token budget burn rate.
Alert thresholds: latency exceed, error budget burn, cost anomaly, token bucket exhaustion.

**Completion criterion:** dashboards and alerts live with runbook links.

### 4. Prompt and chain management
Version prompts and chains; validate against acceptance suite; promote only after green evaluation.
Tag with model, intent, and environment; support rollback to prior tagged version.

**Completion criterion:** prompt registry at expected version; rollback tested.

### 5. Cost optimization
Token budgets per workload; model routing by complexity; prompt compression; response caching with TTL.
Fallback to cheaper model on budget breach; token bucket refill policy.

**Completion criterion:** cost per request under budget with error budget intact.

### 6. A/B experiment
Hypothesis: prompt variant or model swap improves acceptance metric.
Traffic split: staged ramp; success criteria; duration; sample size.
Guardrail: latency, cost, error rate must stay within budgets.

**Completion criterion:** experiment spec accepted; lift measured; winner promoted or rolled back.

### 7. Evaluation pipeline
Canary deploy: run evaluation dataset against new deploy; regression gate: no metric drops beyond threshold.
Promote or rollback based on canary result; report saved to run log.

**Completion criterion:** canary green; production promoted or rolled back.

## Rules

- No deploy without manifest and health check.
- No A/B lift accepted without guardrail metrics green.
- No cost optimization accepted without error budget intact.
- No prompt promoted without evaluation green.
