---
name: compiler-testing
category: compilers
maturity: stable
version: 1
description: Test compilers and interpreters — parser tests, semantic tests, IR validation, golden tests, and regression checks — with explicit oracle design.
capabilities:
  - design compiler test suites
  - define parser, semantic, and IR oracles
  - create regression and negative test strategy
outputs:
  - compiler testing plan with fixture matrix, oracles, and regression coverage
sideEffects: []
dependencies: []
stopCondition: Test oracles, fixture classes, and regression checks are explicit.
risk: low
trustTier: 1
maxIterations: 6
---

# compiler-testing

Use this skill when planning tests for a compiler, interpreter, transpiler, parser, type checker, optimizer, or code generator.

## Contract

- Input: language surface, compiler stages, existing fixtures, known bugs, and target runtime behavior.
- Output: test matrix with fixture types, expected oracles, golden strategy, and regression checks.
- Scope: compiler and interpreter correctness testing; implementation architecture belongs to compiler-design.
- Boundary: do not rely on golden files alone when structural invariants or diagnostics need stronger oracles.

## Rules

- Rule: test each pipeline stage at the narrowest reliable boundary.
- Rule: include positive, negative, malformed, boundary, and regression fixtures.
- Rule: define the oracle: parse tree, typed AST, diagnostics, IR, output behavior, or runtime result.
- Rule: keep diagnostics tests stable by checking meaning, location, and code rather than incidental wording when possible.
- Rule: verify optimizer tests preserve semantics, not only textual IR shape.

## Steps

1. Map compiler stages and externally visible behavior.
2. Identify fixture classes for syntax, semantics, diagnostics, IR, optimization, and runtime.
3. Choose oracles for each stage and decide where golden tests are appropriate.
4. Add negative and recovery tests for invalid programs.
5. Tie known bugs to regression fixtures.
6. Define minimization, naming, and update rules for fixtures.

## Completion Criteria

- compiler stages and fixture classes are covered
- oracles are explicit for each test type
- invalid input and regressions are included
- golden-file update rules are documented
