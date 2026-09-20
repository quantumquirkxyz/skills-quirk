---
name: math-linear-algebra
category: skill-dev/sandbox
maturity: experimental
version: 1
description: Solve and analyse linear algebra problems — matrix decompositions (LU, QR, SVD, eigendecomposition), linear systems, and applications in ML, graphics, and optimisation.
capabilities:
  - apply math linear algebra workflow
  - produce math linear algebra analysis artifact
  - validate math linear algebra completion criteria
outputs:
  - Math Linear Algebra artifact with completed sections, evidence, and limitations
sideEffects: []
dependencies: []
stopCondition: Solve and analyse linear algebra problems complete; required sections present; completion criteria checked.
risk: low
trustTier: 1
maxIterations: 6
---

## Operating Contract

- **Input:** Math Linear Algebra request, problem context, constraints, and available evidence.
- **Output:** Math Linear Algebra artifact with completed analysis, decisions, recommendations, and limitations.
- **Side effects:** follow the frontmatter declaration; do not change systems unless explicitly authorized.
- **Dependencies:** declared dependencies, source material, and domain references required by the task.
- **Stop condition:** Solve and analyse linear algebra problems is complete, required sections are present, and completion criteria are checked.
- **Risk:** use the frontmatter risk classification and call out any escalation.
- **Boundary:** stay within the skill's declared scope and side-effect policy.

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
5. Validate — residual ||Ax−b||, orthogonality of eigenvectors, singular values non-negative, backward error.
6. Interpret — in the problem domain (e.g. SVD: principal components, condition number → sensitivity; eigenvalues: stability of dynamical system).
7. Deliver — artifact with matrix properties, decomposition chosen, computation, residual/validation, and domain interpretation.

## Rules

- Rule: inspect matrix shape, rank, symmetry, sparsity, and conditioning before selecting a method.
- Rule: prefer numerically stable decompositions over explicit matrix inversion.
- Rule: report residuals, condition number, or backward error when solving numerically.
- Rule: separate exact symbolic reasoning from floating-point computation.
- Rule: interpret the result in the original problem domain, not only as matrix algebra.
