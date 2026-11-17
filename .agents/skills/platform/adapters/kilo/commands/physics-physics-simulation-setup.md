---
description: "Set up reproducible physics simulations — Monte Carlo (GEANT4 11.2.x), molecular dynamics (LAMMPS), DFT (VASP commercial, Quantum ESPRESSO 7.x), quantum dynamics (QuTiP 5.x) — with pinned containers, parameter files, convergence verification, and regression benchmarks."
---
# physics-simulation-setup

When to use: Set up reproducible physics simulations — Monte Carlo (GEANT4 11.2.x), molecular dynamics (LAMMPS), DFT (VASP commercial, Quantum ESPRESSO 7.x), quantum dynamics (QuTiP 5.x) — with pinned containers, parameter files, convergence verification, and regression benchmarks.

## Workflow

1. Select the simulation family
2. Define the system
3. Configure the simulation
4. Containerise
5. Verify

## Deliverables

- physics artifact

## Guardrails

- risk: medium; trust tier: 3; approval required: yes
- side effects: write-files
- isolation: worktree; model tier: reasoning

Stop when: Container builds; parameters saved; convergence study passes; benchmark verification passes; quality gates green.
