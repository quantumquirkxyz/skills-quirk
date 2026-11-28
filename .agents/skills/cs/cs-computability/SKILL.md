---
name: "cs-computability"
category: "cs"
maturity: "stable"
version: "2"
description: "Analyze computability questions — decidability, reductions, recognizability, and undecidability proofs — with formal problem transformations."
license: "MIT"
capabilities:
  - apply cs computability methods within explicit cs boundaries
  - analyze analyze computability questions — decidability, reductions, recognizability, and undecidability proofs — with formal problem transformations with assumptions, constraints, and failure modes
  - produce and validate a cs artifact with evidence, decisions, and next steps
outputs: "classification, reduction or recognizer construction, and proof sketch."
sideEffects: []
dependencies: []
stopCondition: "Problem class, proof strategy, and reduction obligations explicit and checked."
risk: "low"
trustTier: "1"
maxIterations: "6"
promptVersion: "2.0"
artifactType: "cs"
modelTier: "reasoning"
evaluators: ["behavioral", "regression"]
fixturesPath: tests/skill-output-migration-auxiliary-cms-compilers-cs-db.test.mjs
diataxis: "how-to"
tags: ["cs"]
compatibility: ["cs-algorithms", "math-formal-proof"]
approvalRequired: "false"
approvalFor: []
---

## Contract

- Input: formal problem statement, machine/language definitions, and any known source problem.
- Output: classification, reduction or recognizer construction, and proof sketch.
- Scope: state assumptions about encodings and machine model before proving.
- Rule: state assumptions about encodings and machine model before proving.
- Rule: documented standards override defaults; explicit project rules take precedence.
- Rule: if blocked by missing context or dependencies, surface the blocker before proceeding.

## Provenance

| Question | Answer |
|---|---|
| What is the source of truth? | The user's request, originating spec/issue, and the skill's declared outputs |
| What is in scope? | Work covered by the skill's acceptance criteria and completion rules |
| What is explicitly out of scope? | Files, behaviors, and decisions outside the skill's declared boundary |
| Who or what consumes this artifact afterward? | The next skill in the workflow or the user |
| What evidence proves it is done? | Completion criteria met, artifact saved, validation passed |
| What risk remains? | Subjective judgment calls, missing context, or external dependency failures


## Artifact

Emit `CsComputabilityArtifact` as both:
- JSON: `.agents/skills/platform/artifacts/cs-computability/{identifier}.json`
- Markdown view: same filename with `.md` extension


# cs-computability

Use this skill when the task involves decidability, recognizability, reductions, Rice-style reasoning, or a proof that a language or machine property cannot be decided.


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

## Computability Obligations

- Reduction direction: reduce from a known-hard problem to the target (known-hard → target), never backward.
- Reduction function: verify the reduction function is computable and total; state its cost model.
- Semantic vs syntactic: distinguish semantic from syntactic properties before applying Rice's theorem; confirm the property is semantic and non-trivial.
- Halting problem: flag any claim that the halting problem is decidable; it is undecidable.
- Decidability classification: give an explicit classification — decidable, r.e. (recognizable), co-r.e., or neither — for every problem.

## Completion

- the skill's completion criteria are explicitly checked
- the artifact is saved and validated
- any blockers or skipped validations are documented
- the next consumer is identified or the work is handed off

## Fixtures

- Undecidable problems: Halting, ε-Halting, A_TM, NOT_EMPTY_TM, EQ_TM.
- Decidable problems: decidable language recognizers with explicit deciders.
- Reduction fixtures: many-one reductions with direction, computability, and totality checks.
- Busy Beaver known values: BB(1) = 1, BB(2) = 4, BB(3) = 6, BB(4) = 13.
---
@include .agents/skills/platform/contract-base.xml
## Reproducibility, Evidence, and Stop Conditions

- **Domain boundary:** Apply this contract specifically to computability: encodings, reductions, oracle assumptions, undecidability witnesses and formal proof; do not claim benchmark, execution, termination, or formal verification without evidence.
- **Provenance/privacy/licensing:** Record problem/source identifiers, versions, assumptions, transformations, dependencies, licenses and attribution; minimize or redact personal data and stop on restricted material.
- **Reproducibility manifest:** Capture canonical input encoding, implementation/pseudocode, environment, seeds, resource model, hashes and deterministic replay steps. Unknowns stay explicit.
- **Fixtures:** Specify a `known-solution` fixture with oracle and tolerance, and a `counterexample`/adversarial fixture that must fail or expose the stated boundary; do not imply either was run.
- **Uncertainty and formal proof:** State complexity model, numeric tolerances, invariant/termination obligations, confidence or approximation bounds, and attach machine-checkable proof artifacts when available; label unformalized claims.
- **Accessible output:** Provide language-agnostic pseudocode, semantic headings, text descriptions of diagrams, readable tables, and a plain-language interpretation.
- **Stop conditions:** Stop as / when input encoding, oracle, bound, invariant, proof artifact, provenance, license, privacy condition, or tolerance is missing; when adversarial evidence contradicts a claim; or when execution would be required to establish it.

## Validation Record

Return `status` (`planned`, `observed`, `validated`, `uncertain`, or `blocked`), manifest, fixture declarations, bounds/tolerances, proof obligations, accessibility/privacy/licensing checks, and unresolved assumptions.
