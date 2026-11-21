---
name: "math-linear-algebra"
category: "math"
maturity: "stable"
version: "2"
description: "Solve and analyse linear algebra problems — matrix decompositions (LU, QR, SVD, eigendecomposition), linear systems, and applications in ML, graphics, and optimisation."
license: "MIT"
capabilities:
  - apply math linear algebra methods within explicit math boundaries
  - analyze solve and analyse linear algebra problems — matrix decompositions (lu, qr, svd, eigendecomposition), linear systems, and applications in ml, graphics, and optimisation with assumptions, constraints, and failure modes
  - produce and validate a math artifact with evidence, decisions, and next steps
outputs: "math artifact containing the scoped result, supporting evidence, validation status, and residual risks required by this skill's contract."
sideEffects: []
dependencies: []
stopCondition: "Matrix properties, decomposition, residual validation, and domain interpretation all documented."
risk: "low"
trustTier: "1"
maxIterations: "6"
promptVersion: "2.0"
artifactType: "math"
modelTier: "reasoning"
evaluators: ["behavioral", "regression"]
fixturesPath: "evals/behavioral/math-linear-algebra.json"
diataxis: "how-to"
tags: ["math"]
compatibility: ["quant-portfolio-opt", "math-linear-algebra"]
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

Emit `MathLinearAlgebraArtifact` as both:
- JSON: `.agents/skills/platform/artifacts/math-linear-algebra/{identifier}.json`
- Markdown view: same filename with `.md` extension


# Linear Algebra

Apply **linear algebra** — decompositions, solving systems, transformations — with explicit numerical stability and interpretation.

## When to use

- User needs a matrix decomposition, linear system solved, or eigenproblem.
- ML, graphics, optimisation, or signal processing needs a linear-algebra backbone.
- Numerical stability of a computation is in question.

## Process

1. Identify problem type — linear system Ax = b, eigenvalue problem Ax = λx, SVD, least squares, PCA, or transformation.
2. State matrix properties: shape, rank, symmetry, positive-definiteness, sparsity.
3. Choose decomposition / method — LU (stable for well-conditioned), Cholesky (SPD), QR (least-squares), SVD (rank-deficient / ill-posed), eigendecomposition (diagonalisation).
4. Compute — with explicit pivoting strategy and condition number estimate.
5. Validate — residual ||Ax−b||, orthogonality of eigenvectors, singular values non-negative, backward error. Fixtures: condition number estimation, decomposition accuracy, backward error (negative case: ill-conditioned system).
6. Interpret — in the problem domain (e.g. SVD: principal components, condition number → sensitivity; eigenvalues: stability of dynamical system).
7. Deliver — artifact with matrix properties, decomposition chosen, computation, residual/validation, and domain interpretation.

## Rules

- Rule: inspect matrix shape, rank, symmetry, sparsity, and conditioning before selecting a method.
- Rule: prefer numerically stable decompositions over explicit matrix inversion.
- Rule: report residuals, condition number, or backward error when solving numerically.
- Rule: separate exact symbolic reasoning from floating-point computation.
- Rule: interpret the result in the original problem domain, not only as matrix algebra.

## Completion

- the skill's completion criteria are explicitly checked
- the artifact is saved and validated
- any blockers or skipped validations are documented
- the next consumer is identified or the work is handed off
---
@include .agents/skills/platform/contract-base.xml
## Reproducibility, Evidence, and Stop Conditions

- **Domain boundary:** Apply this contract specifically to linear-algebra: dimensions, rank/conditioning, decomposition residuals and numerical tolerances; do not invent computation, literature access, proof checking, or compilation.
- **Provenance and licensing:** Record source/version/date, transformations, dependencies, authorship, citation, license, and redistribution limits; separate supplied facts from derived claims and protect private collaborator data.
- **Reproducibility manifest:** Include exact inputs, notation/schema, parameters, software versions, seeds, commands or pseudocode, and hashes. Missing evidence remains `unknown`.
- **Fixtures:** Declare a  with expected value/proof and tolerance, plus a /negative case. These are test specifications, not claims of execution.
- **Uncertainty and proof:** State assumptions, error bounds, conditioning, tolerances and confidence convention. Attach proof obligations and formal proof artifacts when available; otherwise label reasoning `informal`.
- **Accessible output:** Use semantic headings, readable equations/tables, text alternatives, descriptive captions, high contrast and a plain-language summary.
- **Stop conditions:** Stop as / if a definition, oracle, tolerance, proof artifact, provenance, license, privacy boundary, or required input is missing, contradictory, outside validity bounds, or would require unobserved execution.

## Validation Record

Return `status` (`planned`, `observed`, `validated`, `uncertain`, or `blocked`), manifest, fixture expectations, assumptions, tolerances, proof obligations, accessibility/privacy/licensing checks, and explicit unknowns.
---
@include .agents/skills/platform/contract-base.xml