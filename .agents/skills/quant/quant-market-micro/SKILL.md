---
name: quant-market-micro
category: skill-dev/sandbox
maturity: experimental
version: 1
description: Analyse market microstructure — order book dynamics, price formation, execution costs (slippage, spread, impact), and optimal execution strategies.
capabilities:
  - apply quant market micro workflow
  - produce quant market micro analysis artifact
  - validate quant market micro completion criteria
outputs:
  - Quant Market Micro artifact with completed sections, evidence, and limitations
sideEffects: []
dependencies: []
stopCondition: Analyse market microstructure complete; required sections present; completion criteria checked.
risk: low
trustTier: 1
maxIterations: 6
---

## Operating Contract

- **Input:** Quant Market Micro request, problem context, constraints, and available evidence.
- **Output:** Quant Market Micro artifact with completed analysis, decisions, recommendations, and limitations.
- **Side effects:** follow the frontmatter declaration; do not change systems unless explicitly authorized.
- **Dependencies:** declared dependencies, source material, and domain references required by the task.
- **Stop condition:** Analyse market microstructure is complete, required sections are present, and completion criteria are checked.
- **Risk:** use the frontmatter risk classification and call out any escalation.
- **Boundary:** stay within the skill's declared scope and side-effect policy.

# Market Microstructure

Analyse **market microstructure** — order book, price formation, execution costs, and optimal execution — with quantitative models.

## When to use

- The user wants to analyse or minimise execution costs.
- An algo trading or execution strategy needs a market model.
- A quant strategy needs realistic slippage / spread estimates.

## Process

1. Identify venue type — lit exchange, dark pool, OTC, CEX vs DEX.
2. Order book model — queueing theory (Geometric Brownian Motion of queue), Glosten-Milgrom (adverse selection), or Kyle's lambda.
3. Spread decomposition — bid-ask spread = adverse selection + inventory + order processing cost.
4. Execution costs — slippage vs arrival price, market impact (temporary vs permanent), timing risk from delay.
5. Optimal execution — Almgren-Chriss framework (minimise expected cost + variance of execution); VWAP, TWAP, POV benchmarks.
6. Data requirements — tick data, order log, trade reporting; NO OHLCV-only backtests for microstructure claims.
7. Deliver — artifact: venue model, spread decomposition, cost estimate (bps), and optimal execution schedule.

## Rules

- Rule: do not infer microstructure behavior from OHLCV-only data.
- Rule: identify venue rules, tick size, fees, queue priority, and latency assumptions.
- Rule: separate spread, slippage, market impact, and timing risk.
- Rule: model temporary and permanent impact separately when estimating execution cost.
- Rule: validate execution assumptions against tick, quote, or order-book data.
