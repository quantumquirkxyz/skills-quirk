# Portfolio Theory Fixture

## Positive case
Given a dated return matrix, risk-free rate, constraints, and regime labels, compute the efficient frontier, factor attribution, and robustness checks with reproducible inputs and uncertainty notes.

## Boundary and refusal
If returns contain unresolved survivorship, look-ahead, or missing-asset coverage, mark the analysis `BLOCKED` and request a point-in-time dataset.

## Negative control
Do not recommend weights from an unvalidated covariance matrix, imply future performance, or omit constraint violations.
