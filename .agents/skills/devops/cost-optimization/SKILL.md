---
name: cost-optimization
category: skill-dev/sandbox
maturity: stable
version: 1
description: Design FinOps strategies — rightsizing, spot instances, committed use, budgets, showback/chargeback — with cost visibility and optimisation guardrails.
capabilities:
  - design cost visibility and reporting architecture
  - perform rightsizing recommendations (CPU, memory, storage, network)
  - design spot instance and preemptible workload strategies
  - design committed use and reserved capacity planning
  - implement budgets, alerts, showback, and chargeback
outputs:
  - FinOps architecture diagram (text/Markdown)
  - Cost visibility and reporting design
  - Rightsizing and instance strategy recommendations
  - Budget, alert, and showback/chargeback plan
sideEffects: []
dependencies: []
stopCondition: Architecture diagram saved; visibility design documented; rightsizing recommendations complete; budget and showback plan filled.
risk: medium
trustTier: 3
maxIterations: 7
---

## Contract

- **Input:** current cloud spend, workload inventory, performance requirements, budget constraints, team structure.
- **Output:** FinOps architecture + cost visibility design + rightsizing recommendations + budget and showback plan.
- **Side effects:** may modify instance types, purchase committed use discounts, or adjust autoscaling when executed.
- **Dependencies:** cloud provider (AWS / GCP / Azure), monitoring tooling (CloudWatch, Prometheus, Grafana), cost management API.
- **Stop condition:** architecture documented; visibility design saved; rightsizing recommendations complete; budget plan filled.
- **Risk:** medium — cost changes affect service performance and budget; misconfiguration can cause outages or overspend.
- **Boundary:** designs FinOps strategy; does not execute infrastructure changes or purchases unless explicitly instructed.

# Cost Optimization (FinOps)

Design a **FinOps** strategy for cloud cost visibility, rightsizing, spot instances, committed use, budgets, and showback/chargeback.

## Process

### 1. Frame the cost optimisation problem
- Current spend baseline: total cloud spend, top cost drivers, spend by service, team, environment.
- Waste categories: idle resources, over-provisioned instances, unoptimised storage, data transfer costs, unused licenses.
- Performance requirements: minimum CPU, memory, IOPS, network throughput; SLA constraints.
- Team accountability: who owns which resources; showback vs chargeback model.

**Completion criterion:** spend baseline documented; waste categories identified; team accountability model defined.

### 2. Cost visibility and reporting
- Cost allocation: tags, labels, projects, folders; enforce tagging policy.
- Reporting cadence: daily, weekly, monthly; anomaly detection thresholds.
- Dashboards: spend by service, team, environment; forecast vs actual; unit economics (cost per request, cost per user).
- Alerting: budget threshold alerts, anomalous spend spikes, forecast exceedance.

**Completion criterion:** cost visibility design documented with allocation tags, reporting cadence, and alert thresholds.

### 3. Rightsizing and instance strategy
- Rightsizing analysis: CPU and memory utilisation metrics; instance type recommendations; storage tier selection.
- Spot and preemptible instances: suitable workloads (batch, stateless, fault-tolerant); checkpoint and retry strategy; fallback to on-demand.
- Autoscaling: vertical (instance type change) and horizontal (replica count); target tracking vs step scaling.
- Storage optimisation: lifecycle policies, tier selection (standard, infrequent, archive), snapshot retention.

**Completion criterion:** rightsizing recommendations documented with utilisation thresholds and instance strategy.

### 4. Committed use and reserved capacity
- Committed use discounts (CUD): 1-year or 3-year commitment; scope (resource, service, region); exchangeability.
- Savings plans: flexible across instance families, OS, tenancy; compute-only vs specific scopes.
- Reservation management: existing reservation coverage, expiry tracking, renewal process, reservation exchange.
- RI / CUD coverage targets: baseline load commitment; variable load on spot or on-demand.

**Completion criterion:** committed use strategy documented with coverage targets and renewal calendar.

### 5. Budgets, showback, and chargeback
- Budgets: per team, per environment, per project; alert thresholds (50%, 80%, 100%, 120%).
- Showback: cost visibility to teams without direct charge; transparency and accountability.
- Chargeback: direct cost allocation to teams or projects; reconciliation process; dispute handling.
- Guardrails: spend caps, approval workflow for large purchases, anomaly-based blocking.

**Completion criterion:** budget, alert, and showback/chargeback plan saved.

## Rules

- Rule: enforce tagging and cost allocation policies before implementing visibility or chargeback.
- Rule: rightsizing recommendations must be validated against performance requirements and SLAs before execution.
- Rule: use spot instances only for fault-tolerant workloads with checkpoint and retry; never for stateful or latency-critical workloads without fallback.
- Rule: committed use discounts should cover baseline load; variable load should stay on spot or on-demand.
- Rule: alert on budget thresholds before overspend; implement approval workflow for large or anomalous purchases.
