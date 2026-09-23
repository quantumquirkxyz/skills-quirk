---
name: quant-derivatives-pricing
category: skill-dev/sandbox
maturity: stable
version: 1
description: Price and calibrate derivatives (options, exotics, structured products) — Black-Scholes, trees, Monte Carlo — with Greeks, model risk, and calibration validation.
capabilities:
  - apply quant derivatives pricing workflow
  - produce quant derivatives pricing analysis artifact
  - validate quant derivatives pricing completion criteria
outputs:
  - Quant Derivatives Pricing artifact with completed sections, evidence, and limitations
sideEffects: []
dependencies: []
stopCondition: Price and calibrate derivatives (options, exotics, structured products) complete; required sections present; completion criteria checked.
risk: low
trustTier: 1
maxIterations: 6
---

## Operating Contract

- **Input:** Quant Derivatives Pricing request, problem context, constraints, and available evidence.
- **Output:** Quant Derivatives Pricing artifact with completed analysis, decisions, recommendations, and limitations.
- **Side effects:** follow the frontmatter declaration; do not change systems unless explicitly authorized.
- **Dependencies:** declared dependencies, source material, and domain references required by the task.
- **Stop condition:** Price and calibrate derivatives (options, exotics, structured products) is complete, required sections are present, and completion criteria are checked.
- **Risk:** use the frontmatter risk classification and call out any escalation.
- **Boundary:** stay within the skill's declared scope and side-effect policy.

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
- Report calibration error (RMSE in vol points).
- Stress the calibration: what happens to price if one vol parameter changes?

**Completion criterion:** calibration done; RMSE reported; stressed parameters.

### 6. Deliver

Markdown artifact: instrument, model, SDE, price, Greeks, calibration (if applicable), and a **model risk note** — what the model ignores and what the gap to market means.

**Completion criterion:** deliverable complete; model risk addressed.
