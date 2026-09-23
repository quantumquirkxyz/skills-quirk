---
name: finance-portfolio-theory
category: skill-dev/sandbox
maturity: stable
version: 1
description: Modern Portfolio Theory — efficient frontier, CAPM, APT, risk attribution, and performance measurement — with explicit assumptions and regime analysis.
capabilities:
  - apply finance portfolio theory workflow
  - produce finance portfolio theory analysis artifact
  - validate finance portfolio theory completion criteria
outputs:
  - Finance Portfolio Theory artifact with completed sections, evidence, and limitations
sideEffects: []
dependencies: []
stopCondition: Modern Portfolio Theory complete; required sections present; completion criteria checked.
risk: low
trustTier: 1
maxIterations: 6
---

## Operating Contract

- **Input:** Finance Portfolio Theory request, problem context, constraints, and available evidence.
- **Output:** Finance Portfolio Theory artifact with completed analysis, decisions, recommendations, and limitations.
- **Side effects:** follow the frontmatter declaration; do not change systems unless explicitly authorized.
- **Dependencies:** declared dependencies, source material, and domain references required by the task.
- **Stop condition:** Modern Portfolio Theory is complete, required sections are present, and completion criteria are checked.
- **Risk:** use the frontmatter risk classification and call out any escalation.
- **Boundary:** stay within the skill's declared scope and side-effect policy.

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
4. CAPM / APT — estimate beta for each asset; APT: factor exposures (Fama-French 3/5, momentum, quality).
5. Performance attribution — Brinson-Hood-Beebower: allocation, selection, interaction effects.
6. Regime analysis — does the factor model / efficient frontier hold across economic regimes?
7. Deliver — artifact: efficient frontier, CAPM betas / APT factor exposures, attribution decomposition, and a note on model assumptions and regime robustness.

## Rules

- Rule: state that outputs are analytical and not personalized financial advice.
- Rule: define universe, benchmark, horizon, currency, and rebalancing assumptions before optimizing.
- Rule: treat expected return estimates as fragile and show sensitivity to assumptions.
- Rule: check covariance stability, concentration, turnover, and transaction-cost impact.
- Rule: distinguish ex ante risk modeling from realized performance attribution.
