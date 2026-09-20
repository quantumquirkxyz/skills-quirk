---
name: workflow-fixture-author
category: skill-dev
maturity: stable
version: 1
description: Author deterministic scenario and behavioral fixtures for skills so routing, contracts, outputs, side effects, and refusal boundaries can be tested before promotion.
capabilities:
  - design skill evaluation scenarios
  - write behavioral fixture expectations
  - cover happy path, edge case, and refusal behavior
  - align fixtures with skill contracts and validation scripts
outputs:
  - Workflow fixture plan or fixture files with scenario coverage, expected assertions, and validation notes
sideEffects:
  - write-files
dependencies:
  - evaluate-skill
  - skill-testing-framework
stopCondition: Fixtures cover the requested skill behavior and either pass the relevant validator or list exact follow-up fixes.
risk: low
trustTier: 2
maxIterations: 6
---

## Operating Contract

- **Input:** target skill, intended behavior, existing evaluation format, and examples of acceptable and unacceptable outputs.
- **Output:** scenario fixtures, behavioral fixtures, or a fixture plan with coverage rationale and validation evidence.
- **Side effects:** create or edit fixture files only within the repository's evaluation or sandbox fixture locations.
- **Dependencies:** use `evaluate-skill` for scenario intent and `skill-testing-framework` for validation expectations.
- **Stop condition:** target behavior is represented by deterministic fixtures that can be run by repository tooling.
- **Risk:** low because fixtures are test assets, but misleading fixtures can institutionalize incorrect skill behavior.
- **Boundary:** do not weaken existing fixtures to make failures pass; update expectations only when the skill contract intentionally changed.

## Rules

- Rule: read the target skill contract before writing fixtures so expected behavior matches declared inputs, outputs, side effects, and stop condition.
- Rule: include at least one normal path and one boundary or refusal path for any skill that performs mutations or external coordination.
- Rule: make assertions deterministic; avoid expectations that depend on current dates, external network state, or model style unless they are explicitly controlled.
- Rule: fixtures should test observable behavior, not the private chain of reasoning used to reach it.
- Rule: preserve existing fixture formats and naming conventions.
- Rule: when a fixture encodes a side effect, assert both the allowed operation and the condition that makes it safe.
- Rule: run or identify the nearest validator after adding fixtures and report failures without diluting the test.
- Rule: start scenario fixtures from `references/scenario-fixture-template.json` unless an existing neighboring fixture is more specific.
- Rule: start behavioral fixtures from `references/behavioral-fixture-template.md` and replace every placeholder before validation.

## Workflow

1. Inspect the target skill and nearby existing fixtures to infer naming, schema, and assertion style.
2. Derive fixture coverage from the skill's contract, rules, dependencies, and completion criteria.
3. Draft scenarios for happy path, ambiguous input, unsafe mutation, and completion evidence as appropriate.
4. Draft behavioral expectations that forbid placeholders and require exact sections or fields that matter.
5. Add or update fixture files in the correct location.
6. Run the relevant fixture validator or explain why it cannot run locally.
7. Summarize coverage added, validation result, and remaining gaps.

## References

- `references/scenario-fixture-template.json` - scenario fixture skeleton for route, phrase, side-effect, and reference checks.
- `references/behavioral-fixture-template.md` - behavioral fixture skeleton for required sections and forbidden placeholder checks.

## Completion Criteria

- each fixture maps to a specific skill rule or contract obligation
- mutation-capable skills have safety or refusal coverage
- fixture files follow repository conventions
- validation ran or a precise blocker is reported
- no existing regression fixture was weakened without explicit rationale
