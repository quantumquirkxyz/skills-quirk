---
name: "quant-factors"
category: "quant"
maturity: "stable"
version: "2"
description: "Define, test, and stress-test a quantitative factor (momentum, value, carry, quality) with explicit universe, signal, weighting, and statistical checks."
license: "MIT"
capabilities:
  - apply quant factors methods within explicit quant boundaries
  - analyze define, test, and stress-test a quantitative factor (momentum, value, carry, quality) with explicit universe, signal, weighting, and statistical checks with assumptions, constraints, and failure modes
  - produce and validate a quant artifact with evidence, decisions, and next steps
outputs: "Markdown backtest artifact."
sideEffects: ["write-files"]
dependencies: []
stopCondition: "Signal defined, biases mitigated, backtest run, stress tests complete, verdict stated."
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
compatibility: ["quant-backtest", "quant-portfolio-opt"]
approvalRequired: "true"
approvalFor: ["write-files"]
---

## Contract

- Input: factor concept and universe definition.
- Output: Markdown backtest artifact.
- Scope: reasoning and optional code; no system changes.
- Rule: reasoning and optional code; no system changes.
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

Emit `QuantFactorsArtifact` as both:
- JSON: `.agents/skills/platform/artifacts/quant-factors/{identifier}.json`
- Markdown view: same filename with `.md` extension


# Quant Factors

Build a **factor** — a signal that explains cross-sectional returns — and test it with discipline. A factor without a robust test is a story.

## When to use

- The user wants to construct, validate, or critique an investment factor.
- A trading strategy needs its alpha source decomposed.
- An existing backtest needs the "is this real?" sanity pass.

## Process

### 1. Define the signal

State the factor in one sentence: *f(asset) → score*. Examples: trailing-12-month return (momentum), book-to-price (value), term-spread (carry).

Specify:

- **Universe** — what assets are eligible (equities, futures, FX pairs, crypto).
- **Rebalance frequency** — daily / weekly / monthly.
- **Lookback** — explicit window; no implicit defaults.
- **Score direction** — long top, short bottom, or long-only.

**Completion criterion:** signal, universe, rebalance, lookback, direction all stated.

### 2. Handle data honestly

- **Survivorship bias:** use a point-in-time dataset; delisted and dead names are kept, with delisting returns applied on the delisting date so exiting names contribute their realized exit performance.
- **Look-ahead bias:** features computed only on data available at decision time; fundamentals joined on filing/publication date, never on period end — enforce the publication lag so no fundamental is used before it was actually available.
- **Corporate actions:** splits, dividends, mergers adjusted consistently.
- **Missing data:** explicit policy (drop, fill, cap).

**Completion criterion:** each bias named and the mitigation is in code; point-in-time fundamental join uses filing/publication date with publication lag; delisted names retained with delisting returns.

### 3. Build the backtest

Run a backtest with:

- **Transaction-cost model** — not zero. Commissions + spread + market impact estimate.
- **Position sizing** — equal weight, inverse-vol, or factor-weighted.
- **Benchmark** — explicit (e.g. cap-weighted universe, risk-free, SPY).
- **Out-of-sample split** — train / test / walk-forward, not just one backtest window.

**Completion criterion:** backtest code runs; out-of-sample period exists and is honoured.

### 4. Stress tests

Attack the signal:

- **Subperiods:** does it survive across decades / regimes (2008, 2020, 2022)?
- **Factor decay:** measure factor IC / forward returns decay across sub-periods (e.g. first half vs second half of sample); report decay slope.
- **Sectors / geographies:** is the effect localised to one slice?
- **Turnover:** annualised; high turnover often eats alpha.
- **Capacity:** estimate capacity from turnover × market impact; report how Sharpe degrades as AUM grows under the impact model.
- **Crowding:** is the factor correlated with known crowded trades?

**Completion criterion:** each stress test reported, even if the answer is "passed"; factor decay and capacity estimation included.

### 5. Statistics

Report with discipline:

- **Sharpe**, **Sortino**, **max drawdown**, **Calmar**.
- **DSR** (Deflated Sharpe Ratio) and **PSR** (Probabilistic Sharpe Ratio) reported alongside raw Sharpe.
- **t-stat of alpha** vs benchmark, not just raw return; apply a **t > 3** hurdle for statistical significance.
- **Information ratio** if it's an active strategy.
- **p-values** and **multiple-testing correction** (BH-FDR or Bonferroni) if many variants were tried; disclose **N**, the number of variants tested.

**Completion criterion:** Sharpe, drawdown, t-stat (or alpha), DSR/PSR all present; multiple-testing correction disclosed with N variants; t-stat hurdle applied.

## Fixtures

Run known-solution factor fixtures and counterexamples:

- **Survivorship bias:** delisted names dropped vs retained with delisting returns.
- **Look-ahead bias:** fundamental joined on period end vs filing/publication date.
- **Multiple testing correction:** uncorrected vs BH-FDR / Bonferroni p-values.
- **Point-in-time join:** publication lag enforced vs instantaneous fundamental availability.
- **Factor decay:** sub-period IC decay slope vs stable IC.

State numerical tolerances for each fixture.

## Quality Gates

- Record SHA-256 hashes for point-in-time universe, prices, fundamentals, corporate actions, code, and environment; retain delisted constituents.
- Check look-ahead, survivorship, reconstitution, publication-lag, label, and feature leakage; stop if the historical investable universe cannot be reproduced.
- Use walk-forward or embargoed splits, report confidence intervals, multiple-testing corrections, calibration of forecasts, and out-of-sample backtest results.
- Run known-solution factor fixtures and counterexamples with shuffled labels, inverted signals, and zero-cost assumptions; state numerical tolerances.
- Assess fairness/privacy when signals use sensitive or proxy attributes and state that results are analytical, not investment advice.
- Stop with `inconclusive` when data hashes, leakage controls, uncertainty, or backtest gates are missing; align verdict and stop condition.

## Completion

- the skill's completion criteria are explicitly checked
- the artifact is saved and validated
- any blockers or skipped validations are documented
- the next consumer is identified or the work is handed off
---
@include .agents/skills/platform/contract-base.xml
