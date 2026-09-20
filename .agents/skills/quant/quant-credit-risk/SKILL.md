---
name: quant-credit-risk
category: skill-dev/sandbox
maturity: experimental
version: 1
description: Model credit risk — PD, LGD, EAD, expected loss, loss distribution, credit VaR — with default correlation and portfolio-level risk aggregation.
capabilities:
  - apply quant credit risk workflow
  - produce quant credit risk analysis artifact
  - validate quant credit risk completion criteria
outputs:
  - Quant Credit Risk artifact with completed sections, evidence, and limitations
sideEffects: []
dependencies: []
stopCondition: Model credit risk complete; required sections present; completion criteria checked.
risk: low
trustTier: 1
maxIterations: 6
---

## Operating Contract

- **Input:** Quant Credit Risk request, problem context, constraints, and available evidence.
- **Output:** Quant Credit Risk artifact with completed analysis, decisions, recommendations, and limitations.
- **Side effects:** follow the frontmatter declaration; do not change systems unless explicitly authorized.
- **Dependencies:** declared dependencies, source material, and domain references required by the task.
- **Stop condition:** Model credit risk is complete, required sections are present, and completion criteria are checked.
- **Risk:** use the frontmatter risk classification and call out any escalation.
- **Boundary:** stay within the skill's declared scope and side-effect policy.

# Credit Risk Modeling

Model **credit risk** at the instrument and portfolio level — PD, LGD, EAD, EL, UL — with default correlation and aggregation.

## When to use

- The user wants to model credit exposure, expected loss, or portfolio credit risk.
- A loan book, bond portfolio, or corporate credit desk needs risk quantification.
- A Basel / IFRS 9 / CECL calculation is needed.

## Process

1. Define scope — single name / portfolio; rating grade; time horizon (1Y PD, lifetime PD).
2. Estimate PD — historical default frequency,迁移矩阵, KMV-Merton model, or logistic regression on financial ratios.
3. Estimate LGD — workout LGD vs market LGD; recovery rate; downturn LGD (regulatory).
4. Estimate EAD — drawn amount + credit conversion factor (CCF) for off-balance-sheet.
5. Compute Expected Loss (EL) = PD × LGD × EAD; Unexpected Loss (UL) = √(variance of loss).
6. Default correlation — Basel rho formula (equity-based), or copula (Gaussian, t-copula). Aggregate portfolio loss distribution.
7. Stress testing — PD + 2 grades, LGD × 1.5, portfolio loss at 99.9%.
8. Deliver — artifact: PD/LGD/EAD estimates with methodology, EL/UL, correlation, stress test, and regulatory compliance note (Basel III / IFRS 9).

## Rules

- Rule: state that outputs are analytical and not lending, investment, or regulatory advice.
- Rule: define horizon, exposure type, rating system, and portfolio scope before estimating risk.
- Rule: keep PD, LGD, EAD, expected loss, and unexpected loss conceptually separate.
- Rule: document calibration data, default definition, and downturn assumptions.
- Rule: stress-test correlation, concentration, and macro scenarios.
