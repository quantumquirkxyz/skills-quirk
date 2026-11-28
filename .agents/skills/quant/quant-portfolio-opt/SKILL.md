---
name: "quant-portfolio-opt"
category: "quant"
maturity: "stable"
version: "2"
description: "Construct and optimise portfolios — mean-variance, Black-Litterman, risk-parity, factor — with explicit objectives, constraints, and robustness checks."
license: "MIT"
capabilities:
  - apply quant portfolio opt methods within explicit quant boundaries
  - analyze construct and optimise portfolios — mean-variance, black-litterman, risk-parity, factor — with explicit objectives, constraints, and failure modes
  - produce and validate a quant artifact with evidence, decisions, and next steps
outputs: "quant artifact containing the scoped result, supporting evidence, validation status, and residual risks required by this skill's contract."
sideEffects: ["write-files"]
dependencies: []
stopCondition: "Universe defined, models selected, weights computed, robustness checks complete."
risk: "medium"
trustTier: "3"
maxIterations: "6"
promptVersion: "2.0"
artifactType: "quant"
modelTier: "reasoning"
evaluators: ["behavioral", "regression"]
fixturesPath: "tests/skill-output-migration-quant.test.mjs"
diataxis: "how-to"
tags: ["quant"]
compatibility: ["quant-backtest", "quant-risk-modeling", "quant-factors"]
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

Emit `QuantPortfolioOptArtifact` as both:
- JSON: `.agents/skills/platform/artifacts/quant-portfolio-opt/{identifier}.json`
- Markdown view: same filename with `.md` extension


# Portfolio Optimisation

Build a **portfolio** from first principles — return model, risk model, objective, constraints — and solve for weights with explicit robustness checks.

## When to use

- The user wants to construct an optimal portfolio (minimum variance, max Sharpe, risk-parity, etc.).
- Asset allocation decisions need a quantitative basis.
- A factor strategy or multi-asset portfolio needs weight optimisation.

## Process

### 1. Define the problem

State:

- **Universe** — assets, time window, currency.
- **Return model** — historical mean, CAPM alpha, factor model; if historical, use shrinkage.
- **Risk model** — sample covariance, factor model covariance, shrinkage (Ledoit-Wolf), or realised vol.
- **Objective** — minimum variance, maximum Sharpe, risk-parity, maximum diversification, minimum drawdown.
- **Constraints** — long-only, box, sector, turnover, leverage, carbon / ESG screens.

**Completion criterion:** universe, return model, risk model, objective, and constraints all explicit.

### 2. Handle estimation error

Historical covariance and mean are noisy. Address:

- **Shrinkage on covariance** — sample covariance must not be used raw; apply shrinkage with Ledoit-Wolf as default. Estimate shrinkage intensity δ* analytically (Ledoit-Wolf closed form) or via cross-validation; report the chosen δ*.
- **Resampled efficiency** or Bayesian posterior for mean.
- **Black-Litterman** — blend market-implied equilibrium returns π (implied from market caps) with views; document views P, Q, and uncertainty Ω explicitly.
- **Dropout estimation** — what fraction of estimated alpha survives out-of-sample?

**Completion criterion:** at least one technique to combat estimation error applied.

### 3. Solve

Run the optimisation:

- Quadratic solver (QP) for mean-variance.
- Non-linear for risk-parity (risk budgeting); enforce risk contribution deviation ≤ threshold.
- MIP if cardinality constraints (max N assets).
- **Transaction costs** — include linear/quadratic transaction costs in the objective.
- Report weights, expected return, expected vol, Sharpe ratio.

**Completion criterion:** weights computed; metrics (return, vol, Sharpe) reported.

### 4. Robustness checks

- **Covariance perturbation Monte Carlo** — perturb the covariance matrix; report P5 Sharpe across draws.
- **Turnover** — if rebalanced monthly, annual turnover and transaction cost drag; enforce turnover budget.
- **Regime** — does the portfolio behave in 2008 / 2020 as it did in calm markets?
- **Corner solutions** — if weights are extreme (e.g. 90% in one asset), re-run with tighter constraints.

**Completion criterion:** each check completed; extreme or fragile weights flagged.

### 5. Deliver

Markdown artifact: universe, return/risk models, objective, constraints, weights (table), metrics, robustness checks, and the **key sensitivity** — which input moves the most.

**Completion criterion:** deliverable complete; extreme weights acknowledged.

## Quality Gates

- Record SHA-256 hashes for asset, return, benchmark, constraint, code, and environment snapshots, including point-in-time timestamps.
- Check look-ahead, survivorship, stale-price, reconstitution, benchmark, and constraint leakage; stop when the investable universe cannot be reconstructed.
- Report confidence/bootstrap intervals for returns, risk, and weights; calibrate risk forecasts and use walk-forward backtesting with turnover and costs.
- Run known-solution convex/QP fixtures and counterexamples for singular covariance, infeasibility, and corner concentration; state solver and numerical tolerances.
- Assess fairness/privacy for ESG or demographic proxies and state that outputs are analytical, not personalized financial advice.
- Stop with `inconclusive` when provenance, calibration, uncertainty, or tolerance gates fail; align output validation and stop condition.

## Completion

- the skill's completion criteria are explicitly checked
- the artifact is saved and validated
- any blockers or skipped validations are documented
- the next consumer is identified or the work is handed off
- Fixtures validated: shrinkage, Black-Litterman, risk parity, corner solution, turnover
---
@include .agents/skills/platform/contract-base.xml