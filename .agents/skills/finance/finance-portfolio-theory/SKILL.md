---
name: "finance-portfolio-theory"
category: "finance"
maturity: "stable"
version: "2"
description: "Modern Portfolio Theory — efficient frontier, CAPM, APT, risk attribution, and performance measurement — with explicit assumptions and regime analysis."
license: "MIT"
capabilities:
  - apply finance portfolio theory methods within explicit finance boundaries
  - analyze modern portfolio theory — efficient frontier, capm, apt, risk attribution, and performance measurement — with explicit assumptions and regime analysis with assumptions, constraints, and failure modes
  - produce and validate a finance artifact with evidence, decisions, and next steps
outputs: "finance artifact containing the scoped result, supporting evidence, validation status, and residual risks required by this skill's contract."
sideEffects: ["write-files"]
dependencies: []
stopCondition: "Efficient frontier computed, CAPM/APT estimated, attribution decomposed, regime robustness noted."
risk: "medium"
trustTier: "3"
maxIterations: "6"
promptVersion: "2.0"
artifactType: "finance"
modelTier: "reasoning"
evaluators: ["behavioral", "regression"]
fixturesPath: "evals/behavioral/finance-portfolio-theory.json"
diataxis: "how-to"
tags: ["finance"]
compatibility: ["quant-portfolio-opt", "quant-risk-modeling"]
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

Emit `FinancePortfolioTheoryArtifact` as both:
- JSON: `.agents/skills/platform/artifacts/finance-portfolio-theory/{identifier}.json`
- Markdown view: same filename with `.md` extension


# Portfolio Theory

Apply **Modern Portfolio Theory** — efficient frontier, CAPM, APT, performance attribution — with explicit assumptions and regime analysis.

## When to use

- The user wants to understand portfolio construction theory.
- CAPM / factor models are used for expected returns or risk attribution.
- Performance attribution or benchmark comparison is needed.

## Process

1. Define universe — assets, time window, currency.
2. Compute moments — expected returns (historical, factor, or blended), covariance matrix (shrinkage justified), correlations.
3. Efficient frontier — compute frontier; identify minimum-variance portfolio, tangency portfolio, and efficient set.
4. CAPM / APT — CAPM: beta = cov(Ri,RM)/var(RM); security market line; alpha = intercept. APT/Fama-French: correct factor construction (SMB, HML, RMW, CMA, WML).
5. Performance attribution — Brinson: allocation + selection + interaction reconciles to active return. Time-weighted returns for manager evaluation; money-weighted returns for investor experience.
6. Regime analysis — factor performance across regimes; structural break detection.
7. Deliver — artifact: efficient frontier, CAPM betas / APT factor exposures, attribution decomposition, and a note on model assumptions and regime robustness.

## Rules

- Rule: state that outputs are analytical and not personalized financial advice.
- Rule: define universe, benchmark, horizon, currency, and rebalancing assumptions before optimizing.
- Rule: treat expected return estimates as fragile and show sensitivity to assumptions.
- Rule: check covariance stability, concentration, turnover, and transaction-cost impact.
- Rule: distinguish ex ante risk modeling from realized performance attribution.

## Quality Gates

- Record SHA-256 hashes for price/fundamental snapshots, benchmark data, code, and environment, with point-in-time timestamps.
- Check look-ahead, survivorship, stale-price, corporate-action, benchmark-selection, and regime leakage; stop when the investable universe cannot be reconstructed.
- Report parameter and estimation uncertainty with confidence or bootstrap intervals; calibrate risk forecasts and use walk-forward backtesting for performance claims.
- Run known-solution fixtures: CAPM, Fama-French, Brinson attribution, efficient frontier, and risk attribution; plus counterexamples for singular covariance, short-sale limits, and concentration; state numerical tolerances.
- Test fairness/privacy implications of demographic or ESG proxies and state that outputs are analytical, not personalized financial advice.
- Stop with `inconclusive` when provenance, calibration, uncertainty, or tolerance gates fail; align artifact validation and residual risks with the stop condition.

## Completion

- the skill's completion criteria are explicitly checked
- the artifact is saved and validated
- any blockers or skipped validations are documented
- the next consumer is identified or the work is handed off
---
@include .agents/skills/platform/contract-base.xml