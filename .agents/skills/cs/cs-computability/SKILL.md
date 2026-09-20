---
name: cs-computability
category: cs
maturity: stable
version: 1
description: Analyze computability questions — decidability, reductions, recognizability, and undecidability proofs — with formal problem transformations.
capabilities:
  - classify computability problems
  - construct reductions and recognizers
  - explain decidability proofs
outputs:
  - computability analysis with definitions, reduction direction, and proof sketch
sideEffects: []
dependencies: []
stopCondition: The problem class, proof strategy, and reduction obligations are explicit and checked.
risk: low
trustTier: 1
maxIterations: 6
---

# cs-computability

Use this skill when the task involves decidability, recognizability, reductions, Rice-style reasoning, or a proof that a language or machine property cannot be decided.

## Contract

- Input: formal problem statement, machine/language definitions, and any known source problem.
- Output: classification, reduction or recognizer construction, and proof sketch.
- Scope: computability reasoning, not complexity bounds unless they affect the reduction.
- Boundary: state assumptions about encodings and machine model before proving.

## Rules

- Rule: define the language or decision problem before classifying it.
- Rule: name the reduction direction explicitly; for undecidability, reduce from a known hard problem to the target.
- Rule: separate decidable, recognizable, co-recognizable, and undecidable claims.
- Rule: verify that constructed machines halt exactly when the proof requires it.
- Rule: do not use Rice's theorem until the property is shown to be semantic and non-trivial.

## Steps

1. Restate the problem as a language membership or machine-property question.
2. Identify the closest canonical problem, such as `A_TM`, `HALT_TM`, `E_TM`, or `EQ_TM`.
3. Choose a proof strategy: decider, recognizer, mapping reduction, contradiction, or Rice theorem.
4. Build the machine transformation or algorithm with enough detail to check both directions.
5. Prove soundness and completeness of the construction.
6. State the final classification and any unresolved variants.

## Completion Criteria

- the target language/problem is defined
- the proof technique and source problem are named
- both directions of the reduction or recognizer argument are checked
- the final decidability/recognizability classification is explicit
