---
name: "finance-corporate-val"
category: "finance"
maturity: "stable"
version: "2"
description: "Corporate valuation — DCF, multiples, sum-of-parts, scenario analysis — with explicit assumptions, sensitivity, and cross-checks."
license: "MIT"
capabilities:
  - apply finance corporate val methods within explicit finance boundaries
  - analyze corporate valuation — dcf, multiples, sum-of-parts, scenario analysis — with explicit assumptions, sensitivity, and cross-checks with assumptions, constraints, and failure modes
  - produce and validate a finance artifact with evidence, decisions, and next steps
outputs: "finance artifact containing the scoped result, supporting evidence, validation status, and residual risks required by this skill's contract."
sideEffects: ["write-files"]
dependencies: []
stopCondition: "Scope defined, methods selected, assumptions explicit, computation executed, cross-check complete, valuation range delivered."
risk: "medium"
trustTier: "3"
maxIterations: "6"
promptVersion: "2.0"
artifactType: "finance"
modelTier: "reasoning"
evaluators: ["behavioral", "regression"]
fixturesPath: "evals/behavioral/finance-corporate-val.json"
diataxis: "how-to"
tags: ["finance"]
compatibility: ["finance-dcf", "quant-portfolio-opt"]
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

Emit `FinanceCorporateValArtifact` as both:
- JSON: `.agents/skills/platform/artifacts/finance-corporate-val/{identifier}.json`
- Markdown view: same filename with `.md` extension


# Corporate Valuation

Compute a **corporate valuation** — not a price target, but a disciplined range with assumptions exposed — using DCF, multiples, and scenario analysis.

## When to use

- The user wants to value a company, business unit, or asset.
- A deal, M&A, or investment decision depends on a valuation range.
- A back-of-envelope valuation needs to be made defensible.

## Process

### 1. Define scope

Name: the company / unit, the valuation date, the purpose (fair market value, strategic value, liquidation), and the currency / currency-adjusted scenario.

**Completion criterion:** scope, valuation date, purpose, currency all explicit.

### 2. Choose methods

Select at least two independent methods:

- **DCF:** forecast free cash flow, terminal growth, WACC.
- **Multiples:** P/E, EV/EBITDA, EV/Revenue, P/B — with comparable company selection criteria.
- **Sum-of-parts:** for conglomerates; each segment with its own method.
- **Asset-based / liquidation:** for distressed cases.

State why each method fits.

**Completion criterion:** at least two methods named with selection rationale.

### 3. Make assumptions explicit

Every number comes from a source or an explicit assumption:

- **Forecasts:** revenue growth, margins, capex, working-capital — with a source (management, analyst, industry).
- **WACC / discount rate:** risk-free rate, beta, equity risk premium, debt cost, capital structure. Match cash flow type to discount rate: FCFF is discounted at WACC; FCFE is discounted at cost of equity. WACC uses market-value weights and net debt, not gross debt.
- **Terminal growth:** g ≤ long-term nominal GDP (~2–3%) and ≤ risk-free proxy; not automatically 3%.
- **Terminal FCFF numerator:** reinvestment-consistent NOPAT × (1 − g/ROIC).
- **Mid-year convention:** apply consistently to explicit period cash flows and terminal value.
- **Multiples:** how comparables selected; adjustments for size, growth, profitability.

**Completion criterion:** every major assumption is either cited or explicitly stated.

### 4. Run the numbers

Compute each method. For DCF, report:

- Projected FCF by year.
- Terminal value and terminal-value-to-enterprise-value ratio (60–80% typical; >85% flagged).
- Sensitivity table (WACC ±2%, terminal growth ±1%).

For multiples, show the comparable list and adjustments.

**Completion criterion:** computation executed; sensitivity table present for DCF.

### 5. Cross-check and reconcile

Compare methods:

- Is the DCF range consistent with the multiples range?
- If they diverge, which assumption drives it?
- Cross-check the implied exit multiple and implied growth rate; flag inconsistency.
- Scenario analysis: base / optimistic / pessimistic case.
- Sanity against market price: premium / discount to current price, and why.

**Completion criterion:** at least two methods compared; divergence explained.

### 6. Deliver

Markdown artifact with: scope, methods, assumptions (with sources or notes), computation, cross-check, scenario analysis, and a **valuation range** with a narrative about its reliability.

**Completion criterion:** range delivered; reliability note included; sources cited.

## Quality Gates

- Record SHA-256 hashes for every data snapshot, source table, model-input file, and code revision; include valuation-date and publication timestamps.
- Check look-ahead, survivorship, stale-price, currency, corporate-action, and double-counting leakage; stop with `blocked` when point-in-time provenance is unavailable.
- Report scenario and parameter uncertainty as intervals or ranges, not a single point estimate; include calibration, historical cross-checks, or a documented backtest where data supports it.
- Run known-solution fixtures: DCF round-trip, terminal value, WACC, and sensitivity; and a counterexample that exposes an invalid assumption; state numerical tolerances.
- State fairness/privacy limits for sensitive inputs and that the artifact is analytical, not investment, legal, tax, or accounting advice.
- Stop with `inconclusive` when material inputs, hashes, leakage checks, or tolerance checks are missing; align artifact validation and residual risks with the stop condition.

## Completion

- the skill's completion criteria are explicitly checked
- the artifact is saved and validated
- any blockers or skipped validations are documented
- the next consumer is identified or the work is handed off
---
@include .agents/skills/platform/contract-base.xml