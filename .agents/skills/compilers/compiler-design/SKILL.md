---
name: compiler-design
category: compilers
maturity: stable
version: 1
description: Design compiler pipelines — lexing, parsing, ASTs, type checking, IR, optimization, and code generation — with correctness and modularity.
capabilities:
  - design compiler pipeline stages
  - choose AST, type, and IR boundaries
  - reason about diagnostics and code generation
outputs:
  - compiler design note with stages, representations, invariants, and validation strategy
sideEffects: []
dependencies: []
stopCondition: Pipeline stages, representations, invariants, and validation strategy are explicit.
risk: low
trustTier: 1
maxIterations: 6
---

# compiler-design

Use this skill when designing or changing a compiler, interpreter, transpiler, parser, type checker, optimizer, or code-generation pipeline.

## Contract

- Input: language goals, syntax/semantics, target runtime, existing architecture, and correctness constraints.
- Output: pipeline design with stages, representations, invariants, diagnostics, and validation plan.
- Scope: compiler architecture and stage boundaries; detailed test planning belongs to compiler-testing.
- Boundary: keep representations explicit so later stages do not depend on parser accidents or source-text trivia.

## Rules

- Rule: define the source language subset and target behavior before choosing representations.
- Rule: separate parsing, binding/name resolution, type checking, lowering, optimization, and emission concerns.
- Rule: state invariants for AST, typed AST, IR, and emitted artifacts.
- Rule: design diagnostics with source spans, recovery behavior, and stable error codes where useful.
- Rule: validate each stage with the smallest artifact that proves its contract.

## Steps

1. Define source constructs, semantic rules, and target runtime constraints.
2. Choose pipeline stages and representation boundaries.
3. Specify symbol, scope, type, and error models.
4. Decide IR shape, lowering rules, and optimization boundaries.
5. Plan code generation or interpretation and runtime integration.
6. Define stage-level validation, diagnostics, and regression strategy.

## Completion Criteria

- stages and representation boundaries are named
- invariants and diagnostics behavior are explicit
- target runtime assumptions are documented
- validation strategy covers each stage
