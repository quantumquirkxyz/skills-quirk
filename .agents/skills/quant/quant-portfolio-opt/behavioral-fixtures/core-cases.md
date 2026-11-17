# Portfolio Optimization Fixture

## Positive case
With a dated universe, return and risk model, constraints, costs, and benchmark, compute weights, test robustness, and preserve the optimization inputs and solver status.

## Boundary and refusal
If the universe, constraints, or covariance coverage is incomplete, return `BLOCKED` and identify the missing data or policy.

## Negative control
Do not silently relax constraints, report infeasible weights as valid, or imply personalized investment advice.
