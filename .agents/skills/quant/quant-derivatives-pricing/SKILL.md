---
name: "quant-derivatives-pricing"
category: "quant"
maturity: "stable"
version: "2"
description: "Price and calibrate derivatives (options, exotics, structured products) — Black-Scholes, trees, Monte Carlo — with Greeks, model risk, and calibration validation."
license: "MIT"
capabilities:
  - apply quant derivatives pricing methods within explicit quant boundaries
  - analyze price and calibrate derivatives (options, exotics, structured products) — black-scholes, trees, monte carlo — with greeks, model risk, and calibration validation with assumptions, constraints, and failure modes
  - produce and validate a quant artifact with evidence, decisions, and next steps
outputs: "quant artifact containing the scoped result, supporting evidence, validation status, and residual risks required by this skill's contract."
sideEffects: ["write-files"]
dependencies: []
stopCondition: "Instrument specified, model selected, price computed, Greeks reported, calibration validated."
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
compatibility: ["quant-market-micro", "quant-risk-modeling"]
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

Emit `QuantDerivativesPricingArtifact` as both:
- JSON: `.agents/skills/platform/artifacts/quant-derivatives-pricing/{identifier}.json`
- Markdown view: same filename with `.md` extension


# Derivatives Pricing & Calibration

Price a **derivative** — vanilla option, exotic, structured — using a model, compute Greeks, and validate calibration against market data.

## When to use

- The user wants to price an option, swap, exotic, or structured product.
- A risk desk needs Greeks for hedging.
- A quant strategy involves derivatives as a building block.

## Process

### 1. Define the instrument

Name the instrument type (European call, American put, barrier, Asian, quanto, swaption, etc.). Specify underlier, notional, maturity, strike, currency, exercise style (European / American / Bermudan), and payoff structure.

**Completion criterion:** instrument fully specified with all contractual terms.

### 2. Choose the model

- **Black-Scholes** — European options on log-normal underliers; closed-form.
- **Black-76** — futures / forward options; cap/floor.
- **Binomial / Trinomial trees** — American options, early exercise premium.
- **Monte Carlo** — path-dependent exotics, stochastic vol.
- **Heston** — stochastic vol; semi-closed form (characteristic function) or MC.
- **Local vol** — calibrated to vol surface.
- **Jump-diffusion** — Merton, Kou; for gaps and fat tails.

Name the model and state the SDE.

**Completion criterion:** model named; SDE or pricing equation written.

### 3. Price

Run the model:

- Analytical (closed-form formula).
- Numerical (tree steps, MC paths, PDE grid).
- Report the price; state the risk-neutral vs physical measure if relevant.

**Completion criterion:** price computed; method, steps / paths, and seed (if MC) reported.

### 4. Compute Greeks

Report at minimum: Δ, Γ, ν (vega), ρ (rho), θ. For American options, also report early exercise boundary. Greeks should be computed via bump-and-reprice or finite differences on the model.

**Completion criterion:** Δ, Γ, ν, ρ, θ all present; method (bump-and-reprice or finite diff) stated.

### 5. Calibrate to market

If using a model with free parameters (Heston k, θ, ν, ρ; local vol volatility):

- Fit to market-implied vol surface (minimise squared-error weighted by vega).
- **Constrained optimization:** enforce positivity, |ρ| ≤ 1, and the Feller condition (2κθ ≥ ν²) throughout calibration.
- **Multi-start calibration:** run from diverse initial points; divergence between starts signals a flat or multi-modal objective — flag it rather than accepting a local optimum.
- Report calibration error (RMSE in vol points).
- Stress the calibration: what happens to price if one vol parameter changes?

**Completion criterion:** calibration done with constraints; RMSE reported; multi-start checked; stressed parameters.

### 6. Validate

- **Vanilla European option:** price matches Black-Scholes analytic within stated tolerance.
- **Greeks:** validated against numerical finite differences.
- **Held-out surface:** calibration instruments excluded from pricing validation; price held-out strikes/maturities and report error.
- **Convergence:** MC standard error shrinks O(1/√N); trees converge O(1/N) with sawtooth pattern; report step/path counts and observed convergence.

**Completion criterion:** validation evidence present; held-out and convergence checks reported.

## Fixtures

Run known-solution fixtures and counterexamples:

- **Black-Scholes round-trip:** model price vs analytic Black-Scholes within tolerance.
- **Heston vs Black pricing:** stochastic-vol price vs Black price across the vol surface.
- **Tree sawtooth:** convergence O(1/N) with sawtooth across step counts.
- **MC standard error:** error shrinks O(1/√N) across path counts.
- **Calibration held-out:** calibration instruments excluded; held-out surface error reported.

State numerical tolerances for each fixture.

## Deliver

Markdown artifact: instrument, model, SDE, price, Greeks, calibration (if applicable), validation results, and a **model risk note** — what the model ignores and what the gap to market means.

**Completion criterion:** deliverable complete; model risk addressed.

## Quality Gates

- Record SHA-256 hashes for market snapshots, volatility surfaces, curves, code, calibration data, and environment; preserve quote timestamps and settlement conventions.
- Check look-ahead, stale-quote, survivorship, corporate-action, interpolation, and calibration leakage; stop when market data is not point-in-time.
- Report Monte Carlo confidence intervals, finite-difference tolerances, calibration error, and parameter uncertainty; backtest Greeks or calibration stability where feasible.
- Run known-solution Black-Scholes/parity fixtures and counterexamples for negative time value, arbitrage bounds, or unstable Greeks; state numerical tolerances.
- Apply fairness/privacy checks to client or trade-level data and state that outputs are analytical, not trading, investment, legal, or regulatory advice.
- Stop with `inconclusive` when hashes, calibration, uncertainty, or tolerance gates fail; align the quant artifact and stop condition.

## Completion

- the skill's completion criteria are explicitly checked
- the artifact is saved and validated
- any blockers or skipped validations are documented
- the next consumer is identified or the work is handed off
---
@include .agents/skills/platform/contract-base.xml
