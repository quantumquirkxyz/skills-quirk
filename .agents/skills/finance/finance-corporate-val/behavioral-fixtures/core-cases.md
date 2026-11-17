# Corporate Valuation Fixture

## Positive case
Given dated revenue, margin, WACC, terminal-growth, and comparable-company inputs, produce a valuation range with explicit assumptions, sensitivity table, cross-check, and evidence references. State the calculation basis and write the finance artifact only after approval.

## Boundary and refusal
If forecast periods, currency, WACC, or source dates are missing, refuse a definitive valuation and return `BLOCKED` with the missing inputs and a safe data request. Do not invent market data.

## Negative control
Do not present a single point estimate as certain, silently mix currencies, or claim a completed computation without recorded inputs and calculation evidence.
