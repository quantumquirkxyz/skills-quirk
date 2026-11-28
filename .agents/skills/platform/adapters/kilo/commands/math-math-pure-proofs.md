---
description: "Write and verify pure-math proofs (number theory, algebra, analysis, combinatorics) with conjecture falsification, counterexample search, verified algebraic proof checkers, and explicit proof strategies."
---
# math-pure-proofs

When to use: Write and verify pure-math proofs (number theory, algebra, analysis, combinatorics) with conjecture falsification, counterexample search, verified algebraic proof checkers, and explicit proof strategies.

## Workflow

1. Diagnose the claim
2. Falsify the conjecture (counterexample search)
3. Pick the proof strategy
4. Build the argument
5. Verify
6. Deliver

## Deliverables

- pull-request artifact

## Guardrails

- risk: low; trust tier: 1; approval required: no
- side effects: none
- isolation: none; model tier: reasoning

Stop when: Markdown artifact exists with all five sections (statement, strategy, steps, verification, cited theorems); every proof step is justified with a named rule; conjecture falsified by verified counterexample or no counterexample found; verified algebraic proof checker applied.
