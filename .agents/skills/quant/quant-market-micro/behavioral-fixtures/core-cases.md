# Market Microstructure Fixture

## Positive case
Given venue, order-book, spread, latency, and fee observations, decompose execution costs and derive a schedule with assumptions, timestamps, and uncertainty bounds.

## Boundary and refusal
If venue rules, queue position, or latency measurements are unavailable, return `BLOCKED` instead of inferring fill quality.

## Negative control
Do not claim optimal execution from mid-price data alone or omit adverse selection and market-impact terms.
