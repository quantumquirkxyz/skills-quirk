---
description: "Modern Portfolio Theory — efficient frontier, CAPM, APT, risk attribution, and performance measurement — with explicit assumptions and regime analysis."
---
# finance-portfolio-theory

When to use: Modern Portfolio Theory — efficient frontier, CAPM, APT, risk attribution, and performance measurement — with explicit assumptions and regime analysis.

## Workflow

1. Define universe — assets, time window, currency
2. Compute moments — expected returns (historical, factor, or blended), covariance matrix (shrinkage justified), correlations
3. Efficient frontier — compute frontier; identify minimum-variance portfolio, tangency portfolio, and efficient set
4. CAPM / APT — CAPM: beta = cov(Ri,RM)/var(RM); security market line; alpha = intercept. APT/Fama-French: correct factor construction (SMB, HML, RMW, CMA, WML)
5. Performance attribution — Brinson: allocation + selection + interaction reconciles to active return. Time-weighted returns for manager evaluation; money-weighted returns for investor experience
6. Regime analysis — factor performance across regimes; structural break detection
7. Deliver — artifact: efficient frontier, CAPM betas / APT factor exposures, attribution decomposition, and a note on model assumptions and regime robustness

## Deliverables

- finance artifact

## Guardrails

- risk: medium; trust tier: 3; approval required: yes
- side effects: write-files
- isolation: worktree; model tier: reasoning

Stop when: Efficient frontier computed, CAPM/APT estimated, attribution decomposed, regime robustness noted.
