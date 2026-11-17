---
description: "Analyse market microstructure — order book dynamics, price formation, execution costs (slippage, spread, impact), and optimal execution strategies."
---
# quant-market-micro

When to use: Analyse market microstructure — order book dynamics, price formation, execution costs (slippage, spread, impact), and optimal execution strategies.

## Workflow

1. Identify venue type — lit exchange, dark pool, OTC, CEX vs DEX; record venue rules, tick size, fees, queue priority, and latency assumptions
2. **Tick data quality** — grade tick data on five dimensions
3. **Distinguish microstructure noise from genuine data defects** — microstructure noise (bid-ask bounce, discreteness, queue position) is expected and modelled; genuine defects (ghost quotes, spoofed size, stale stamps, corrupted prices) a...
4. Order book model — queueing theory (Geometric Brownian Motion of queue), Glosten-Milgrom (adverse selection), or Kyle's lambda
5. Spread decomposition — bid-ask spread = adverse selection + inventory + order processing cost
6. Execution costs — slippage vs arrival price, market impact (temporary vs permanent), timing risk from delay
7. **Order book depth for temporary impact estimation** — use LOB depth at the inside and adjacent levels to estimate temporary impact of a child order walking the book; calibrate the impact coefficient from public LOB data
8. **Almgren-Chriss parameters calibrated from public LOB data** — estimate temporary impact (η), permanent impact (γ), and risk aversion (λ) from LOB shape, volatility, and volume; solve the optimal execution schedule minimising expected c...

## Deliverables

- quant artifact

## Guardrails

- risk: medium; trust tier: 3; approval required: yes
- side effects: write-files
- isolation: worktree; model tier: reasoning

Stop when: Venue modeled, spread decomposed, execution costs estimated, optimal schedule delivered.
