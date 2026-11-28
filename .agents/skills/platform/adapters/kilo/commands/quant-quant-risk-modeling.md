---
description: "Model market/portfolio/credit risk (VaR, CVaR, drawdown, stress) with explicit distributions, assumptions, and validation against historical stress events."
---
# quant-risk-modeling

When to use: Model market/portfolio/credit risk (VaR, CVaR, drawdown, stress) with explicit distributions, assumptions, and validation against historical stress events.

## Workflow

1. Define the risk object
2. Choose distribution / model
3. Compute
4. Validate
5. Deliver

## Deliverables

- model artifact

## Guardrails

- risk: medium; trust tier: 3; approval required: yes
- side effects: write-files
- isolation: worktree; model tier: reasoning

Stop when: Risk object defined, model selected, measures computed, validation complete.
