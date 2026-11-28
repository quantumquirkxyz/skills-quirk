---
description: "Model credit risk — PD, LGD, EAD, expected loss, loss distribution, credit VaR — with default correlation and portfolio-level risk aggregation."
---
# quant-credit-risk

When to use: Model credit risk — PD, LGD, EAD, expected loss, loss distribution, credit VaR — with default correlation and portfolio-level risk aggregation.

## Workflow

1. Define scope — single name / portfolio; rating grade; time horizon (1Y PD, lifetime PD)
2. Estimate PD — historical default frequency, 迁移矩阵, KMV-Merton model, or logistic regression on financial ratios
3. Estimate LGD — workout LGD vs market LGD; recovery rate; downturn LGD (regulatory)
4. Estimate EAD — drawn amount + credit conversion factor (CCF) for off-balance-sheet
5. IFRS 9 staging
6. Compute Expected Loss (EL) = Σ PD × LGD × EAD × discount factor at EIR/CEIR over the relevant horizon; Unexpected Loss (UL) = √(variance of loss)
7. Default correlation — Basel rho formula (equity-based), or copula (Gaussian, t-copula). Aggregate portfolio loss distribution
8. Forward-looking macro scenarios — at least three scenarios (base / upside / downside), probability-weighted, applied to PD/LGD/EAD

## Deliverables

- quant artifact

## Guardrails

- risk: medium; trust tier: 3; approval required: yes
- side effects: write-files
- isolation: worktree; model tier: reasoning

Stop when: PD/LGD/EAD estimates, EL/UL computed, default correlation modeled, stress tests complete.
