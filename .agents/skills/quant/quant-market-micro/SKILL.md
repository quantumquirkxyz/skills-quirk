---
name: "quant-market-micro"
category: "quant"
maturity: "stable"
version: "2"
description: "Analyse market microstructure — order book dynamics, price formation, execution costs (slippage, spread, impact), and optimal execution strategies."
license: "MIT"
capabilities:
  - apply quant market micro methods within explicit quant boundaries
  - analyze analyse market microstructure — order book dynamics, price formation, execution costs (slippage, spread, impact), and optimal execution strategies with assumptions, constraints, and failure modes
  - produce and validate a quant artifact with evidence, decisions, and next steps
outputs: "quant artifact containing the scoped result, supporting evidence, validation status, and residual risks required by this skill's contract."
sideEffects: ["write-files"]
dependencies: []
stopCondition: "Venue modeled, spread decomposed, execution costs estimated, optimal schedule delivered."
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
compatibility: ["quant-backtest", "quant-derivatives-pricing"]
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

Emit `QuantMarketMicroArtifact` as both:
- JSON: `.agents/skills/platform/artifacts/quant-market-micro/{identifier}.json`
- Markdown view: same filename with `.md` extension


# Market Microstructure

Analyse **market microstructure** — order book, price formation, execution costs, and optimal execution — with quantitative models.

## When to use

- The user wants to analyse or minimise execution costs.
- An algo trading or execution strategy needs a market model.
- A quant strategy needs realistic slippage / spread estimates.

## Process

1. Identify venue type — lit exchange, dark pool, OTC, CEX vs DEX; record venue rules, tick size, fees, queue priority, and latency assumptions.
2. **Tick data quality** — grade tick data on five dimensions:
   - **Completeness** — fraction of expected events present; flag missing days, sessions, or symbols.
   - **Accuracy** — price/size values free of misprints and cross-book errors (negative spreads, trades outside quotes).
   - **Consistency** — cross-feed agreement, sequence-number continuity, no timestamp inversions.
   - **Granularity** — tick-by-tick vs L1/L2/L3 order-book depth; minimum observable unit.
   - **Timeliness** — event capture latency vs exchange timestamp; clock-sync tolerance.
   Record a quality score per dimension; stop when tick data fails minimum quality.
3. **Distinguish microstructure noise from genuine data defects** — microstructure noise (bid-ask bounce, discreteness, queue position) is expected and modelled; genuine defects (ghost quotes, spoofed size, stale stamps, corrupted prices) are excluded and logged.
4. Order book model — queueing theory (Geometric Brownian Motion of queue), Glosten-Milgrom (adverse selection), or Kyle's lambda.
5. Spread decomposition — bid-ask spread = adverse selection + inventory + order processing cost.
6. Execution costs — slippage vs arrival price, market impact (temporary vs permanent), timing risk from delay.
7. **Order book depth for temporary impact estimation** — use LOB depth at the inside and adjacent levels to estimate temporary impact of a child order walking the book; calibrate the impact coefficient from public LOB data.
8. **Almgren-Chriss parameters calibrated from public LOB data** — estimate temporary impact (η), permanent impact (γ), and risk aversion (λ) from LOB shape, volatility, and volume; solve the optimal execution schedule minimising expected cost plus variance.
9. **Implementation shortfall decomposition** — decompose implementation shortfall into permanent impact + temporary impact + risk (timing + adverse selection), reported in bps versus arrival price.
10. Optimal execution — Almgren-Chriss framework (minimise expected cost + variance of execution); VWAP, TWAP, POV benchmarks.
11. Data requirements — tick data, order log, trade reporting; NO OHLCV-only backtests for microstructure claims.
12. Deliver — artifact: venue model, spread decomposition, cost estimate (bps), and optimal execution schedule.

## Rules

- Rule: do not infer microstructure behavior from OHLCV-only data.
- Rule: identify venue rules, tick size, fees, queue priority, and latency assumptions.
- Rule: separate spread, slippage, market impact, and timing risk.
- Rule: model temporary and permanent impact separately when estimating execution cost.
- Rule: validate execution assumptions against tick, quote, or order-book data.

## Quality Gates

- Record SHA-256 hashes for tick, quote, order-book, venue-rule, code, and environment snapshots, with exchange timestamps and timezone.
- Check event-order, clock-sync, look-ahead, survivorship, hidden-liquidity, and selection leakage; stop for OHLCV-only evidence or unverifiable queue history.
- Report confidence intervals for spread, impact, and fill estimates; calibrate against held-out sessions and backtest execution schedules with realistic latency and costs.
- Run known-solution queue/spread fixtures and counterexamples for crossed books, negative spreads, timestamp inversions, and zero latency; state numerical tolerances.
- Minimize trader/customer identifiers, assess fairness/privacy in execution allocation, and state that outputs are analytical, not trading or investment advice.
- Stop with `inconclusive` when event provenance, calibration, uncertainty, or tolerance checks fail; align artifact validation and stop condition.

## Completion

- the skill's completion criteria are explicitly checked
- the artifact is saved and validated
- any blockers or skipped validations are documented
- the next consumer is identified or the work is handed off
- Fixtures validated: tick data quality, Roll estimator, Almgren-Chriss, slippage decomposition, venue rules
---
@include .agents/skills/platform/contract-base.xml