---
description: "Run a reproducible, leakage-resistant backtest with point-in-time data, purged and embargoed validation, cost/impact realism, generated-code audit, deterministic replay, known-failure fixtures, and an explicit PASS/FAIL/BLOCKED/NOT-RUN verdict."
---
# quant-backtest

When to use: Run a reproducible, leakage-resistant backtest with point-in-time data, purged and embargoed validation, cost/impact realism, generated-code audit, deterministic replay, known-failure fixtures, and an explicit PASS/FAIL/BLOCKED/NOT-RUN verdict.

## Workflow

1. Read the canonical skill at .agents/skills/quant/quant-backtest/SKILL.md and execute its Process.

## Deliverables

- test-strategy artifact

## Guardrails

- risk: low; trust tier: 1; approval required: no
- side effects: none
- isolation: none; model tier: reasoning

Stop when: Required manifests and hashes are recorded, point-in-time and leakage controls pass, validation and cost assumptions are evidenced, deterministic replay and known-failure fixtures are evaluated, and the verdict is PASS, FAIL, BLOCKED, or NOT-RUN.
