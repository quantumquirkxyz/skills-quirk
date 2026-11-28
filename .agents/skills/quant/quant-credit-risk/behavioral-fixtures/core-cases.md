# Credit Risk Fixture

## Positive case
Using dated default, exposure, recovery, and segment data, estimate PD, LGD, EAD, expected and unexpected loss, then document correlation and stress scenarios.

## Boundary and refusal
If default definitions, horizon, recovery basis, or exposure coverage is ambiguous, return `BLOCKED` and request the missing policy or dataset.

## Negative control
Do not report a calibrated loss estimate without validation, or treat a stress scenario as an observed forecast.
