---
name: testing-framework
description: Provides standardized testing utilities for quirk skills.
version: 1
capabilities:
  - define-test
  - run-test
  - collect-coverage
  - generate-report
inputs:
  - test-type: Unit, integration, e2e
  - target: Path to codebase or endpoint
  - assertions: List of expected behaviors
outputs:
  - test-suite: Executable test suite
  - coverage-report: Coverage metrics
  - report: Test results summary
stopCondition: Tests pass or fail according to defined criteria
risk: low
trustTier: 2
maxIterations: 5
---

# Testing Framework

## Contract
- Input: test type, target, and assertions
- Output: test suite and coverage report
- Boundary: read-only analysis of target

## Process
1. Parse test type and target.
2. Define test cases from assertions.
3. Execute tests.
4. Collect coverage and report results.

## Guardrails
- Do not modify the target codebase.
- Surface failures with clear evidence.
