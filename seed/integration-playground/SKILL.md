---
name: integration-playground
description: A playground environment for testing and developing quirk skills locally.
version: 1
capabilities:
  - create-skill
  - validate-skill
  - run-skill
  - export-skill
  - import-skill
inputs:
  - skill-template: Path to a skill template (optional)
  - test-case: Description of the test scenario
  - environment: Target environment (default: general)
outputs:
  - skill-result: The resulting skill object with validation evidence
  - test-report: Detailed test results
  - execution-log: Full execution log
stopCondition: The skill result is complete and validation passes
risk: medium
trustTier: 3
maxIterations: 10
---

# Integration Playground

## Contract
- Input: test case and environment specification
- Output: skill result with validation evidence
- Boundary: isolated from production code

## Process
1. Parse the test case.
2. Execute against the environment.
3. Collect output and validation evidence.
4. Report results.

## Guardrails
- Never write to the target repo outside the sandbox.
- Surface uncertainty and failures explicitly.
