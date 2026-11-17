---
description: "Run a reproducible, leakage-resistant backtest with dataset/code provenance, corporate-action fixtures, deterministic replay, and an explicit PASS/FAIL/BLOCKED/NOT-RUN verdict."
---
# quant-backtest

When to use: Run a reproducible, leakage-resistant backtest with dataset/code provenance, corporate-action fixtures, deterministic replay, and an explicit PASS/FAIL/BLOCKED/NOT-RUN verdict.

## Workflow

1. Spec the strategy
2. Audit the data and fixtures
3. Run and replay the backtest
4. Stress tests
5. Coverage validation
6. Verdict
7. Deliver

## Deliverables

- test-strategy artifact

## Guardrails

- risk: low; trust tier: 1; approval required: no
- side effects: none
- isolation: none; model tier: reasoning

Stop when: Manifest and hashes are recorded, leakage/survivorship/corporate-action checks and deterministic replay are evaluated, baseline comparison is complete or explicitly not-run, and the verdict is PASS, FAIL, BLOCKED, or NOT-RUN.
