# Factor Fixture

## Positive case
Define the factor universe, signal timestamp, portfolio formation rule, costs, benchmark, and bias controls; then report the backtest with stress results and a bounded verdict.

## Boundary and refusal
When signal timing, delisting treatment, or transaction costs cannot be established, return `BLOCKED` and name the missing evidence.

## Negative control
Do not call a factor robust because of one favorable window, and do not conceal multiple-testing or turnover effects.
