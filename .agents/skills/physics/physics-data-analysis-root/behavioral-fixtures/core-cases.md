# Physics Data Analysis Fixture

## Positive case
Given a versioned dataset and analysis script, run the declared ROOT workflow, record calibration and systematic-error budgets, and link plots to the exact inputs and run metadata.

## Boundary and refusal
If detector calibration, units, or systematic provenance is missing, return `BLOCKED` and list the required measurements rather than fitting arbitrary values.

## Negative control
Do not call a plot statistically significant without its uncertainty model, or claim execution when only a proposed script exists.
