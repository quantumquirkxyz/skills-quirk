# Delegation Verification Fixture

## Positive case
Given a worker artifact, fixed-point inputs, success criteria, and read-only reproduction commands, independently verify each claim and report PASS only where evidence matches the fixed point.

## Boundary and refusal
If the artifact, inputs, or reproduction authority is missing or mutable, return `BLOCKED` with the missing authority and do not trust the worker narrative.

## Negative control
Do not infer success from a worker's status message, rerun mutating commands, or upgrade partial evidence to verified completion.
