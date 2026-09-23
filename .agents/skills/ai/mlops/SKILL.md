---
name: mlops
category: ai
maturity: stable
version: 1
description: MLOps (feature stores, model registry, data versioning, pipeline orchestration, monitoring, retraining)
capabilities:
  - design and operate feature stores with point-in-time correctness
  - manage model registry with promotion, validation, and rollback
  - version data with lineage and reproducibility
  - orchestrate training and retraining pipelines
  - configure model monitoring for drift and performance decay
  - define retraining triggers and backfill discipline
outputs:
  - Feature store contract (schema, point-in-time rules, window specs)
  - Model registry manifest (run, model, validation, promotion state)
  - Data version manifest (hash, lineage, reproduction steps)
  - Pipeline manifest (schedule, image, secrets, rollback, alert)
  - Monitoring config (drift, latency, error, regression gate)
  - Retraining trigger policy (metric, threshold, window, approval)
sideEffects: []
dependencies: []
stopCondition: Registry green; pipelines passing; model validated; monitoring active.
risk: medium
trustTier: 3
maxIterations: 8
---

## Contract

- **Input:** dataset description, model class, performance target, operational constraint.
- **Output:** feature store contract + model registry + data version + pipeline manifest + monitoring + trigger policy.
- **Side effects:** may write to feature store, model registry, and cloud storage.
- **Dependencies:** feature store, model registry, container registry, orchestration, secret store, monitoring stack.
- **Stop condition:** feature store live; model registered; pipelines passing; monitoring green.
- **Risk:** medium — production models depend on correct data and training; drift and decay possible.
- **Boundary:** manages ML operations; does not build model weights from scratch.

# MLOps

Operate ML systems with reproducibility, validation, and monitoring.

## Process

### 1. Feature store contract
Schema: feature names, types, units, null policy, default.
Point-in-time rules: avoid leakage with event time and processing time.
Window specs: tumbling, sliding, session; aggregation; late arrival policy.
Validation: on write, on read, on retraining.

**Completion criterion:** feature store contract with lineage and reproduction steps.

### 2. Model registry
Run metadata: git sha, docker image, dataset version, hyperparameters, env.
Artifacts: model weights, tokenizer, config, card.
Promotion: staging -> production after acceptance suite green.
Rollback: prior tagged version with reproduction and reconciliation.

**Completion criterion:** registry manifest with validation result and promotion state.

### 3. Data version and lineage
Manifest: dataset hash, split ratios, timestamp, license, source.
Lineage: upstream tables, joins, filters, aggregation.
Reproduction: command, docker image, env vars, secrets, output path.

**Completion criterion:** data version manifest with lineage and reproduction steps.

### 4. Pipeline orchestration
Trigger: schedule, webhook, or retraining policy.
Steps: build, validate, train, evaluate, register, deploy.
Artifacts: images, weights, metrics, cards.
Rollback: prior tagged deploy with reconciliation.

**Completion criterion:** pipeline manifest with schedule, image, secrets, rollback, alert.

### 5. Monitoring
Drift: feature, label, concept; method: KS test, PSI, DDM.
Performance: latency, error rate, business metric, token usage.
Regression gate: no metric drops beyond threshold.
Alert: pager, slack, or runbook link.

**Completion criterion:** monitoring config with drift, latency, error, regression gate, alert.

### 6. Retraining triggers
Metric: acceptance metric, drift, latency, error, token budget.
Threshold: absolute or relative; window: day, week, month.
Approval: data QA, model QA, security, SRE, product.
Backfill: retrain from scratch or incremental; lineage preserved.

**Completion criterion:** trigger policy with metric, threshold, window, approval, backfill.

## Rules

- No deploy without acceptance suite green.
- No retrain without data QA and model QA green.
- No backfill without lineage preserved and validation green.
- No drift ignored without regression gate and rollback tested.
