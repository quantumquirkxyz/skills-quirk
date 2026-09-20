---
name: quant-risk-modeling
category: skill-dev/sandbox
maturity: experimental
version: 1
description: Model market/portfolio/credit risk (VaR, CVaR, drawdown, stress) with explicit distributions, assumptions, and validation against historical stress events.
capabilities:
  - apply quant risk modeling workflow
  - produce quant risk modeling analysis artifact
  - validate quant risk modeling completion criteria
outputs:
  - Quant Risk Modeling artifact with completed sections, evidence, and limitations
sideEffects: []
dependencies: []
stopCondition: Model market/portfolio/credit risk (VaR, CVaR, drawdown, stress) with explicit distributions, assumptions, and validation against historical stress events complete; required sections present; completion criteria checked.
risk: low
trustTier: 1
maxIterations: 6
---

## Operating Contract

- **Input:** Quant Risk Modeling request, problem context, constraints, and available evidence.
- **Output:** Quant Risk Modeling artifact with completed analysis, decisions, recommendations, and limitations.
- **Side effects:** follow the frontmatter declaration; do not change systems unless explicitly authorized.
- **Dependencies:** declared dependencies, source material, and domain references required by the task.
- **Stop condition:** Model market/portfolio/credit risk (VaR, CVaR, drawdown, stress) with explicit distributions, assumptions, and validation against historical stress events is complete, required sections are present, and completion criteria are checked.
- **Risk:** use the frontmatter risk classification and call out any escalation.
- **Boundary:** stay within the skill's declared scope and side-effect policy.

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

- **Backtest coverage:** does VaR 95% cover ~95% of out-of-sample days? If not, recalibrate.
- **Stress test:** does the model predict known historical losses within a factor?
- **Stability:** does the risk measure jump wildly on small data changes?

**Completion criterion:** out-of-sample coverage or stability check completed; discrepancy addressed.

### 5. Deliver

Markdown artifact: risk definition, model, measures, validation, and a note on what the number means operationally (e.g. "VaR 99% = $1.2M; expected loss beyond is CVaR 99% = $2.5M").

**Completion criterion:** deliverable includes measures, validation, and an operational interpretation.
