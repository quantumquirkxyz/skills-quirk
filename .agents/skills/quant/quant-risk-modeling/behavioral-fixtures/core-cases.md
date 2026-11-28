# Risk Modeling Fixture

## Positive case
Define the risk object, horizon, confidence level, model, and validation data; compute the requested measures and document backtests, stress cases, and limitations.

## Boundary and refusal
If horizon, distributional assumptions, or validation observations are unspecified, return `BLOCKED` and request them before computing a risk claim.

## Negative control
Do not call an unvalidated tail estimate reliable, hide model uncertainty, or confuse a scenario with a realized loss.
