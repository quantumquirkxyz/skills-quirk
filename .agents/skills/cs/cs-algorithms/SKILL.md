---
name: cs-algorithms
category: skill-dev/sandbox
maturity: stable
version: 1
description: Design and analyse algorithms — correctness proof, complexity analysis (time and space), and stability — with explicit proof of invariants and termination.
capabilities:
  - apply cs algorithms workflow
  - produce cs algorithms analysis artifact
  - validate cs algorithms completion criteria
outputs:
  - Cs Algorithms artifact with completed sections, evidence, and limitations
sideEffects: []
dependencies: []
stopCondition: Design and analyse algorithms complete; required sections present; completion criteria checked.
risk: low
trustTier: 1
maxIterations: 6
---

## Operating Contract

- **Input:** Cs Algorithms request, problem context, constraints, and available evidence.
- **Output:** Cs Algorithms artifact with completed analysis, decisions, recommendations, and limitations.
- **Side effects:** follow the frontmatter declaration; do not change systems unless explicitly authorized.
- **Dependencies:** declared dependencies, source material, and domain references required by the task.
- **Stop condition:** Design and analyse algorithms is complete, required sections are present, and completion criteria are checked.
- **Risk:** use the frontmatter risk classification and call out any escalation.
- **Boundary:** stay within the skill's declared scope and side-effect policy.

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
