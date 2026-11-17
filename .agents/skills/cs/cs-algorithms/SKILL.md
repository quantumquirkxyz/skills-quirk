---
name: "cs-algorithms"
category: "cs"
maturity: "stable"
version: "1"
description: "Design and analyse algorithms — correctness proof, complexity analysis (time and space), and stability — with explicit proof of invariants and termination."
license: "MIT"
capabilities:
  - apply cs algorithms methods within explicit cs boundaries
  - analyze design and analyse algorithms — correctness proof, complexity analysis (time and space), and stability — with explicit proof of invariants and termination with assumptions, constraints, and failure modes
  - produce and validate a cs artifact with evidence, decisions, and next steps
outputs: "cs artifact containing the scoped result, supporting evidence, validation status, and residual risks required by this skill's contract."
sideEffects: []
dependencies: []
stopCondition: "Design and analyse algorithms complete; required sections present; completion criteria checked."
risk: "low"
trustTier: "1"
maxIterations: "6"
promptVersion: "2.0"
artifactType: "cs"
modelTier: "reasoning"
evaluators: ["behavioral", "regression"]
fixturesPath: ""
diataxis: "how-to"
tags: ["cs"]
compatibility: []
approvalRequired: "false"
approvalFor: []
---

## Contract

- Input: skill invocation with the user's request and available context.
- Output: a structured artifact or guidance aligned to the skill's declared outputs.
- Scope: stay within the skill's declared boundaries; do not broaden without explicit direction.
- Rule: follow the skill's completion criteria and stop condition exactly.

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

Emit `CsAlgorithmsArtifact` as both:
- JSON: `.agents/skills/platform/artifacts/cs-algorithms/{identifier}.json`
- Markdown view: same filename with `.md` extension


# 
# 
# CS Algorithms

Design, analyse, and verify an **algorithm** — its correctness, complexity, stability, and invariants — with an explicit proof structure.

## When to use

- The user needs an algorithm designed or analysed.
- A data structure choice needs justification.
- Performance or correctness requires proof.

## Process

1. Problem statement — input, output, pre/post conditions.
2. Algorithm design — strategy (divide and conquer, greedy, dynamic programming, backtracking, etc.); justify why it fits.
3. Pseudocode / code — clean, with clear variable names.
4. Correctness proof — loop invariant; termination; initialisation, maintenance, termination. Or proof by contradiction / induction for non-loop structures.
5. Complexity analysis — time (best/average/worst), space; use Big-O with justification (count operations, recursion depth).
6. Stability — if numerical, numerical stability; if combinatorial, output stability.
7. Deliver — artifact: problem, design, code/pseudocode, correctness proof, complexity, stability note.

## Rules

- Rule: define inputs, outputs, and preconditions before proposing the algorithm.
- Rule: prove correctness with an invariant, induction, exchange argument, or contradiction that matches the strategy.
- Rule: analyze time and space separately and name all size parameters.
- Rule: test the algorithm against edge cases and adversarial inputs.
- Rule: state when a simpler baseline is preferable to a more complex optimization.

## Completion

- the skill's completion criteria are explicitly checked
- the artifact is saved and validated
- any blockers or skipped validations are documented
- the next consumer is identified or the work is handed off
---
@include .agents/skills/platform/contract-base.xml
## Reproducibility, Evidence, and Stop Conditions

- **Domain boundary:** Apply this contract specifically to algorithms: invariants, termination, complexity bounds, adversarial inputs and stability; do not claim benchmark, execution, termination, or formal verification without evidence.
- **Provenance/privacy/licensing:** Record problem/source identifiers, versions, assumptions, transformations, dependencies, licenses and attribution; minimize or redact personal data and stop on restricted material.
- **Reproducibility manifest:** Capture canonical input encoding, implementation/pseudocode, environment, seeds, resource model, hashes and deterministic replay steps. Unknowns stay explicit.
- **Fixtures:** Specify a `known-solution` fixture with oracle and tolerance, and a `counterexample`/adversarial fixture that must fail or expose the stated boundary; do not imply either was run.
- **Uncertainty and formal proof:** State complexity model, numeric tolerances, invariant/termination obligations, confidence or approximation bounds, and attach machine-checkable proof artifacts when available; label unformalized claims.
- **Accessible output:** Provide language-agnostic pseudocode, semantic headings, text descriptions of diagrams, readable tables, and a plain-language interpretation.
- **Stop conditions:** Stop as / when input encoding, oracle, bound, invariant, proof artifact, provenance, license, privacy condition, or tolerance is missing; when adversarial evidence contradicts a claim; or when execution would be required to establish it.

## Validation Record

Return `status` (`planned`, `observed`, `validated`, `uncertain`, or `blocked`), manifest, fixture declarations, bounds/tolerances, proof obligations, accessibility/privacy/licensing checks, and unresolved assumptions.
