---
name: "math-computational"
category: "math"
maturity: "stable"
version: "2"
description: "Solve numerical and symbolic math problems (root finding, integration, ODEs, symbolic manipulation) with stable algorithms and explicit error analysis."
license: "MIT"
capabilities:
  - apply math computational methods within explicit math boundaries
  - analyze solve numerical and symbolic math problems (root finding, integration, odes, symbolic manipulation) with stable algorithms and explicit error analysis with assumptions, constraints, and failure modes
  - produce and validate a math artifact with evidence, decisions, and next steps
outputs: "Markdown artifact with algorithm choice, error analysis, computation, and verification."
sideEffects: []
dependencies: []
stopCondition: "Artifact contains algorithm, error bounds, verification, and final answer; solution is reproducible from the code shown."
risk: "low"
trustTier: "1"
maxIterations: "6"
promptVersion: "2.0"
artifactType: "math"
modelTier: "reasoning"
evaluators: ["behavioral", "regression"]
fixturesPath: "evals/behavioral/math-computational.json"
diataxis: "how-to"
tags: ["math"]
compatibility: ["math-linear-algebra", "math-optimization", "math-probability-models"]
approvalRequired: "false"
approvalFor: []
---

## Contract

- Input: a numerical or symbolic mathematical problem.
- Output: Markdown artifact with algorithm choice, error analysis, computation, and verification.
- Scope: may execute code for numerical work but only in-memory, no file writes.
- Rule: may execute code for numerical work but only in-memory, no file writes.
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

Emit `MathComputationalArtifact` as both:
- JSON: `.agents/skills/platform/artifacts/math-computational/{identifier}.json`
- Markdown view: same filename with `.md` extension


# Computational Math

Solve a mathematical problem **numerically or symbolically** with an algorithm whose error, stability, and cost are explicit. Never ship a black-box answer.

## When to use

- The user wants a numerical result, symbolic simplification, or to choose between algorithms.
- A formula or expression needs to be evaluated, integrated, differentiated, or solved.
- An engineering / physics / quant problem needs a numerical kernel.

## Process

### 1. Frame the problem

Identify: input → output, the mathematical object (scalar / vector / function / matrix / ODE / PDE / integral), and the regime (smoothness, scale, boundary conditions). State whether an analytical or numerical answer is expected.

**Completion criterion:** problem restated as a clean mapping with regime noted.

### 2. Choose the algorithm

Pick the algorithm that matches the regime:

- **Root finding:** bisection (safe), Newton's (fast, needs derivative + good init), secant.
- **Integration:** Simpson / Gauss (smooth, 1D), Monte Carlo (high-D), adaptive quadrature (singularities).
- **ODEs:** explicit Euler (cheap, low order), RK4 (default), implicit (stiff), symplectic (Hamiltonian).
- **Linear systems:** direct (LU, Cholesky) vs iterative (CG, GMRES).
- **Symbolic:** CAS (SymPy / Mathematica) with manual simplification on top.

Name the algorithm and one reason it fits.

**Completion criterion:** algorithm named, with a one-line justification referencing the regime.

### 3. Estimate error and stability

For numerical work, state:

- **Local truncation error** and **global error** order.
- **Conditioning** — well-posed or ill-posed? Sensitivity to input noise.
- **Stability** — bounded-input-bounded-output? Stiffness concerns?
- **Cost** — O(n²)? O(n³)? Memory?

For symbolic work, state the simplification rules used and any non-canonical choices.

**Completion criterion:** error, stability, and cost all addressed for the chosen algorithm.

### 4. Implement / compute

Either run code (Python with NumPy/SciPy/SymPy) or hand-compute if tractable. For code, include:

- The algorithm in named functions, not one giant cell.
- Exact rational arithmetic where precision matters (SymPy `Rational`, not floats).
- Guard against integer overflow: use Python `int` (arbitrary precision) or an explicit dtype for values beyond 2^63.
- Use `math.fsum` for accounting summations; `np.sum` (pairwise) otherwise.
- Validate `assume_a` structural claims before declaring a decomposition or solver.
- Input validation (NaN, inf, dimension mismatch).
- Sanity asserts on outputs (sign, magnitude, symmetry).

**Completion criterion:** output produced and reproducible from the code shown.

### 5. Verify

Cross-check by at least one independent path:

- Different algorithm at lower fidelity.
- Asymptotic / limiting case (small/large parameter).
- Comparison against a known analytic solution or benchmark.
- Dimensional / sign / magnitude check.

**Completion criterion:** independent verification done; discrepancy explained or fixed.

### 6. Deliver

Markdown artifact with: problem, algorithm choice, error/stability/cost, code or computation, verification, and final answer with stated uncertainty (e.g. "to 6 significant digits").

**Completion criterion:** artifact contains algorithm, error bounds, verification, and a final answer whose precision is justified.

## Quality Gates

- Record SHA-256 hashes for input snapshots, code, dependencies, and environment; pin random seeds and numerical backends.
- Check data leakage, look-ahead, and survivorship whenever inputs are time-indexed; mark non-applicable checks explicitly and stop when the computational snapshot is not reproducible.
- Report uncertainty intervals, conditioning, convergence/calibration diagnostics, and tolerances separately from point estimates.
- Run known-solution fixtures plus counterexamples for domain violations, unstable regimes, and cancellation; report absolute and relative error.
- State fairness/privacy limits for data-driven inputs and no-claims/no-advice boundaries for engineering, scientific, or financial interpretations.
- Require a `conda-lock` file or committed Docker image alongside artifacts so the computational environment is reproducible.
- Fixtures: deterministic seed-controlled stochastic cases, integer overflow boundary (>2^63), and `assume_a` misuse (invalid structural claim) as negative cases.
- Stop with `inconclusive` when verification, hashes, uncertainty, or tolerance gates fail; align artifact sections and stop condition.

## Completion

- the skill's completion criteria are explicitly checked
- the artifact is saved and validated
- any blockers or skipped validations are documented
- the next consumer is identified or the work is handed off
---
@include .agents/skills/platform/contract-base.xml