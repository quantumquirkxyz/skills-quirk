---
description: "Solve classical mechanics problems — Newton's laws, Lagrangian, Hamiltonian, rigid body, orbital — with free-body diagrams, energy accounting, and dimensional checks."
---
# physics-classical

When to use: Solve classical mechanics problems — Newton's laws, Lagrangian, Hamiltonian, rigid body, orbital — with free-body diagrams, energy accounting, and dimensional checks.

## Workflow

1. Identify system — particles, rigid body, continuous; degrees of freedom
2. Draw free-body diagram — all forces with direction, labels, and units
3. Choose formulation — Newtonian (F=ma), Lagrangian (L=T−V), Hamiltonian (H=T+V), or energy methods
4. Write equations — Newton's 2nd / Euler-Lagrange / Hamilton's equations; include constraints (holonomic / nonholonomic)
5. Solve — analytically (harmonic oscillator, projectile, central force) or numerically (leapfrog/Verlet for Hamiltonian systems; RK45/RK4 flagged as non-symplectic and unsuitable for long-term Hamiltonian integration; fixed step size only...
6. Dimensional check — verify [force]=[mass][acceleration]; no hidden unit mismatches
7. Physical limits — check limiting cases (small angle, large mass, friction → 0)
8. Deliver — artifact: diagram, formulation, equations, solution, dimensional check, and limiting cases

## Deliverables

- physics artifact

## Guardrails

- risk: low; trust tier: 1; approval required: no
- side effects: none
- isolation: none; model tier: reasoning

Stop when: Diagram, formulation, equations, solution, dimensional check, and limiting cases all present.
