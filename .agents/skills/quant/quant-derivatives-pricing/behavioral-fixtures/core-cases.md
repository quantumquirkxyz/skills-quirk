# Derivatives Pricing Fixture

## Positive case
Given instrument terms, market inputs, model choice, and calibration observations, price the contract, report Greeks, and validate against an independent check with timestamps.

## Boundary and refusal
If payoff terms, exercise style, curve, volatility, or calibration data is missing, return `BLOCKED` rather than assuming a standard contract.

## Negative control
Do not present model output as a market quote, omit model risk, or claim calibrated Greeks without calibration evidence.
