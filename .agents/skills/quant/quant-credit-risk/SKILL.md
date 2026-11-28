---
name: "quant-credit-risk"
category: "quant"
maturity: "stable"
version: "2"
description: "Model credit risk — PD, LGD, EAD, expected loss, loss distribution, credit VaR — with default correlation and portfolio-level risk aggregation."
license: "MIT"
capabilities:
  - apply quant credit risk methods within explicit quant boundaries
  - analyze model credit risk — pd, lgd, ead, expected loss, loss distribution, credit var — with default correlation and portfolio-level risk aggregation with assumptions, constraints, and failure modes
  - produce and validate a quant artifact with evidence, decisions, and next steps
outputs: "quant artifact containing the scoped result, supporting evidence, validation status, and residual risks required by this skill's contract."
sideEffects: ["write-files"]
dependencies: []
stopCondition: "PD/LGD/EAD estimates, EL/UL computed, default correlation modeled, stress tests complete."
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
compatibility: ["quant-risk-modeling", "quant-derivatives-pricing"]
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

Emit `QuantCreditRiskArtifact` as both:
- JSON: `.agents/skills/platform/artifacts/quant-credit-risk/{identifier}.json`
- Markdown view: same filename with `.md` extension


# Credit Risk Modeling

Model **credit risk** at the instrument and portfolio level — PD, LGD, EAD, EL, UL — with default correlation and aggregation.

## When to use

- The user wants to model credit exposure, expected loss, or portfolio credit risk.
- A loan book, bond portfolio, or corporate credit desk needs risk quantification.
- A Basel / IFRS 9 / CECL calculation is needed.

## Process

1. Define scope — single name / portfolio; rating grade; time horizon (1Y PD, lifetime PD).
2. Estimate PD — historical default frequency, 迁移矩阵, KMV-Merton model, or logistic regression on financial ratios.
   - **PD floor:** apply a minimum PD ≥ 0.05% (corporate, sovereign, and bank exposures); a 100% default grade exists for defaulted obligors.
   - **Point-in-time PD:** use PiT PD for ECL (IFRS 9 / CECL), not raw through-the-cycle PD.
3. Estimate LGD — workout LGD vs market LGD; recovery rate; downturn LGD (regulatory).
   - **LGD floors:** 25% for unsecured corporate exposures; secured LGD varies with collateral (haircuts, eligibility, maturity mismatches).
   - **Downturn LGD:** estimated separately from through-the-cycle LGD.
4. Estimate EAD — drawn amount + credit conversion factor (CCF) for off-balance-sheet.
5. IFRS 9 staging:
   - **Stage 1:** 12-month PD for performing exposures.
   - **Stage 2:** lifetime PD when SICR triggers (significant increase in credit risk) are met.
   - **Stage 3:** lifetime PD for credit-impaired exposures.
   - Direct 1→3 transitions flagged as transitory Stage 2 and reviewed.
6. Compute Expected Loss (EL) = Σ PD × LGD × EAD × discount factor at EIR/CEIR over the relevant horizon; Unexpected Loss (UL) = √(variance of loss).
7. Default correlation — Basel rho formula (equity-based), or copula (Gaussian, t-copula). Aggregate portfolio loss distribution.
8. Forward-looking macro scenarios — at least three scenarios (base / upside / downside), probability-weighted, applied to PD/LGD/EAD.
9. Stress testing — PD + 2 grades, LGD × 1.5, portfolio loss at 99.9%.
10. Deliver — artifact: PD/LGD/EAD estimates with methodology, EL/UL, correlation, stress test, staging logic, macro scenarios, downturn LGD, and regulatory compliance note (Basel III / IFRS 9 / CECL).

## Rules

- Rule: state that outputs are analytical and not lending, investment, or regulatory advice.
- Rule: define horizon, exposure type, rating system, and portfolio scope before estimating risk.
- Rule: keep PD, LGD, EAD, expected loss, and unexpected loss conceptually separate.
- Rule: document calibration data, default definition, and downturn assumptions.
- Rule: stress-test correlation, concentration, and macro scenarios.

## Fixtures

Run known-solution EL/UL fixtures and counterexamples:

- **PD floor:** PD clamped at ≥ 0.05%; 100% default grade applied.
- **LGD floor:** 25% unsecured corporate floor; collateral-varying secured LGD.
- **Staging logic:** SICR triggers move exposure to Stage 2; direct 1→3 flagged as transitory.
- **ECL computation:** Σ PD × LGD × EAD × discount factor at EIR/CEIR matches hand calculation.
- **Downturn LGD:** downturn LGD distinct from through-the-cycle LGD.

State numerical tolerances for each fixture.

## Quality Gates

- Record SHA-256 hashes for exposure, default, recovery, macro, code, and environment snapshots, including as-of dates and target population.
- Check look-ahead, survivorship, censoring, label leakage, missing-not-at-random, and rating-migration leakage; stop when default definitions or observation windows are not point-in-time.
- Calibrate PD/LGD/EAD on held-out or time-split data, report confidence intervals and calibration curves, and backtest loss coverage and stress scenarios.
- Run known-solution EL/UL fixtures and counterexamples for impossible probabilities, recoveries, or CCFs; state numerical tolerances.
- Assess fairness/privacy across protected groups when borrower-level attributes or proxies are used, minimize sensitive data, and state that outputs are analytical, not lending, investment, or regulatory advice.
- Stop with `inconclusive` when calibration, provenance, uncertainty, or fairness checks are unavailable; align output validation with the stop condition.

## Completion

- the skill's completion criteria are explicitly checked
- the artifact is saved and validated
- any blockers or skipped validations are documented
- the next consumer is identified or the work is handed off
---
@include .agents/skills/platform/contract-base.xml
