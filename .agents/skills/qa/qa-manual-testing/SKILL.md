---
name: qa-manual-testing
category: qa
maturity: stable
version: 1
description: Perform manual test sessions — exploratory checks, edge cases, accessibility, and user-visible regressions — with explicit reproduction notes.
capabilities:
  - plan exploratory test sessions
  - document reproducible findings
  - assess user-visible regressions
outputs:
  - manual test plan or session notes with coverage, findings, and repro steps
sideEffects: []
dependencies: []
stopCondition: Tested paths, environment, findings, and residual risks are documented.
risk: low
trustTier: 1
maxIterations: 6
---

# qa-manual-testing

Use this skill when manually testing a feature, reproducing a user-visible issue, or running an exploratory session that needs evidence and coverage notes.

## Contract

- Input: feature or bug scope, environment, build/version, target users, and known risk areas.
- Output: test charter, executed paths, findings, reproduction notes, and residual risk.
- Scope: manual and exploratory testing; automated test implementation belongs to QA automation or webapp testing.
- Boundary: report observed behavior and evidence without assuming root cause unless independently verified.

## Rules

- Rule: record environment, account state, data setup, and build identifier.
- Rule: test the happy path, likely edge cases, and at least one failure path.
- Rule: write findings with expected behavior, actual behavior, steps, and impact.
- Rule: distinguish bugs from usability concerns and open questions.
- Rule: include screenshots, logs, or exact UI text when they materially improve reproducibility.

## Steps

1. Define the test charter and risk areas.
2. Prepare environment, test data, permissions, and device/browser matrix.
3. Execute core workflows before edge cases.
4. Probe boundaries: empty states, invalid input, permission gaps, latency, and navigation.
5. Document findings with reproduction steps and severity rationale.
6. Summarize coverage, untested areas, and follow-up recommendations.

## Completion Criteria

- test scope and environment are documented
- core path and risk paths were exercised
- findings include reproducible steps
- residual risk and untested areas are explicit
