---
description: "Run a reproducible, leakage-resistant backtest with point-in-time data, purged and embargoed validation, combinatorial purged cross-validation, walk-forward evaluation, DSR/PSR, deterministic replay, FRTB alignment, multiple-testing correction, cost/impact realism, generated-code audit, failure fixtures, and an explicit PASS/FAIL/BLOCKED/NOT-RUN verdict."
---
# quant-backtest

When to use: Run a reproducible, leakage-resistant backtest with point-in-time data, purged and embargoed validation, combinatorial purged cross-validation, walk-forward evaluation, DSR/PSR, deterministic replay, FRTB alignment, multiple-testing correction, cost/impact realism, generated-code audit, failure fixtures, and an explicit PASS/FAIL/BLOCKED/NOT-RUN verdict.

## Workflow

1. Read the canonical skill at .agents/skills/quant/quant-backtest/SKILL.md and execute its Process.

## Deliverables

- test-strategy artifact

## Guardrails

- risk: high; trust tier: 4; approval required: yes
- side effects: write-files
- isolation: worktree; model tier: reasoning

Stop when: Required manifests and hashes recorded, point-in-time and leakage controls pass, purged/embargoed/CPCV/walk-forward validation evidenced, DSR/PSR reported, multiple-testing correction disclosed, deterministic replay verified, FRTB alignment evidenced, verdict is PASS/FAIL/BLOCKED/NOT-RUN.
