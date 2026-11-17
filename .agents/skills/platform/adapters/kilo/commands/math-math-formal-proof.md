---
description: "Develop formal mathematical proofs in proof assistants (Lean 4, Coq, Isabelle, Agda) with pinned toolchains, CI proof checking, zero-sorry discipline, literate programming, tactic-driven construction, and verification."
---
# math-formal-proof

When to use: Develop formal mathematical proofs in proof assistants (Lean 4, Coq, Isabelle, Agda) with pinned toolchains, CI proof checking, zero-sorry discipline, literate programming, tactic-driven construction, and verification.

## Workflow

1. Pick the assistant
2. Encode the statement
3. Choose proof strategy
4. Build and verify
5. Literate export

## Deliverables

- pull-request artifact

## Guardrails

- risk: low; trust tier: 1; approval required: no
- side effects: none
- isolation: none; model tier: reasoning

Stop when: Source file compiles in target assistant with pinned toolchain and no errors; no sorry/Admitted; CI proof-checking job passes; verification report attached.
