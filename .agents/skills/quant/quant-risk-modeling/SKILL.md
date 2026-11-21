---
name: "quant-risk-modeling"
category: "quant"
maturity: "stable"
version: "2"
description: "Model market/portfolio/credit risk (VaR, CVaR, drawdown, stress) with explicit distributions, assumptions, and validation against historical stress events."
license: "MIT"
capabilities:
  - apply quant risk modeling methods within explicit quant boundaries
  - analyze model market/portfolio/credit risk (var, cvar, drawdown, stress) with explicit distributions, assumptions, and validation against historical stress events with assumptions, constraints, and failure modes
  - produce and validate a quant artifact with evidence, decisions, and next steps
outputs: "model artifact containing the scoped result, supporting evidence, validation status, and residual risks required by this skill's contract."
sideEffects: ["write-files"]
dependencies: []
stopCondition: "Risk object defined, model selected, measures computed, validation complete."
risk: "medium"
trustTier: "3"
maxIterations: "6"
promptVersion: "2.0"
artifactType: "model"
modelTier: "reasoning"
evaluators: ["behavioral", "regression"]
fixturesPath: "tests/skill-output-migration-quant.test.mjs"
diataxis: "how-to"
tags: ["quant"]
compatibility: ["quant-backtest", "quant-portfolio-opt", "quant-credit-risk"]
approvalRequired: "true"
approvalFor: ["write-files"]
---

## Contract

- Input: skill invocation with the user's request and available context.
- Output: a structured artifact or guidance aligned to the skill's declared outputs.
- Scope: stay within the skill's declared boundaries; do not broaden without explicit direction.
- Rule: follow the skill's completion criteria and stop condition exactly.

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

Emit `QuantRiskModelingArtifact` as both:
- JSON: `.agents/skills/platform/artifacts/quant-risk-modeling/{identifier}.json`
- Markdown view: same filename with `.md` extension


# Quant Risk Modeling

Build a **risk measure** — VaR, CVaR, drawdown, stress — with explicit distributions, assumptions, and historical validation. A risk number without context is misleading.

## When to use

- The user needs a risk metric for a portfolio or strategy.
- A backtest needs a drawdown / stress profile.
- A strategy needs a position-size or leverage cap based on risk.

## Process

### 1. Define the risk object

State exactly what needs measurement: portfolio-level P&L, a single factor, a strategy, an instrument. Time horizon (1-day / 10-day / monthly) matters.

**Completion criterion:** risk object and horizon named; measurement unit (absolute / % / $) specified.

### 2. Choose distribution / model

- **Parametric:** Normal, Student-t, GARCH, multivariate Normal / t.
- **Non-parametric:** historical simulation, bootstrap.
- **Scenario / stress:** specific shocks (rates +200bp, equity crash 2008).
- **Credit / default:** CVaR for defaults, PD/LGD/EAD framework.

Name the choice and why it fits the regime (e.g. "t-distribution for fat tails").

**Completion criterion:** model named; assumption (distribution, correlation, independence) listed.

### 3. Compute

Run with explicit parameters. Report:

- **VaR** at chosen confidence (e.g. 95%, 99%).
- **CVaR / ES** (expected shortfall) — more stable than VaR.
- **Drawdown:** max, average, recovery time.
- **Stress:** impact of named historical or hypothetical shock.

**Completion criterion:** all requested measures present with exact parameters.

### 4. Validate

- **VaR backtest** — Kupiec LR test for unconditional coverage; Christoffersen independence test for violations clustering.
- **Basel traffic light** — exception count determines the capital multiplier (green / yellow / red zones).
- **ES backtest** — Acerbi–Székely statistic with Monte Carlo p-value.
- **PIT uniformity test** — probability integral transform of forecasted CDF at realised outcomes should be uniform.
- **Stress test** — sensitivity, historical, hypothetical, and reverse stress tests; reverse stress at least annually.
- **Stability:** does the risk measure jump wildly on small data changes?

**Completion criterion:** out-of-sample coverage or stability check completed; discrepancy addressed.

### 5. Deliver

Markdown artifact: risk definition, model, measures, validation, and a note on what the number means operationally (e.g. "VaR 99% = $1.2M; expected loss beyond is CVaR 99% = $2.5M").

**Completion criterion:** deliverable includes measures, validation, and an operational interpretation.

## Quality Gates

- Record SHA-256 hashes for returns, positions, risk-factor, scenario, code, and environment snapshots, with as-of timestamps.
- Check look-ahead, survivorship, stale-price, missing-data, stress-selection, and scenario leakage; stop when historical coverage is not point-in-time.
- Report confidence intervals for VaR/CVaR and drawdown, calibrate coverage, and run rolling or walk-forward backtests plus named historical stress tests.
- Run known-solution distribution/VaR fixtures and counterexamples for tail, dependence, and confidence-level violations; state numerical tolerances.
- Apply fairness/privacy controls when risk data contains protected or personal attributes and state that outputs are analytical, not risk, investment, or regulatory advice.
- Stop with `inconclusive` when coverage, provenance, uncertainty, or tolerance checks fail; align artifact validation and stop condition.

## Completion

- the skill's completion criteria are explicitly checked
- the artifact is saved and validated
- any blockers or skipped validations are documented
- the next consumer is identified or the work is handed off
- Fixtures validated: Kupiec, traffic light, ES Acerbi–Székely, drawdown, stress test
---
@include .agents/skills/platform/contract-base.xml