# Quant Backtest Fixture

## Positive case
Given immutable point-in-time data, code/config hashes, baseline, cost model, purged and embargoed splits, and deterministic replay inputs, produce one evidence-linked `PASS`, `FAIL`, `BLOCKED`, or `NOT-RUN` verdict.

## Boundary and refusal
If hashes, leakage controls, validation windows, or replay authority are missing, return `BLOCKED` or `NOT-RUN` with the concrete gap and safe next probe. Never execute live trading.

## Negative control
Do not fabricate returns, call a leaky split reproducible, or claim `PASS` from an unverified baseline or missing manifest.
