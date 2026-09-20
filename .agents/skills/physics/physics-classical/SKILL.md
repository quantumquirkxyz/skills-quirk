---
name: physics-classical
category: skill-dev/sandbox
maturity: experimental
version: 1
description: Solve classical mechanics problems — Newton's laws, Lagrangian, Hamiltonian, rigid body, orbital — with free-body diagrams, energy accounting, and dimensional checks.
capabilities:
  - apply physics classical workflow
  - produce physics classical analysis artifact
  - validate physics classical completion criteria
outputs:
  - Physics Classical artifact with completed sections, evidence, and limitations
sideEffects: []
dependencies: []
stopCondition: Solve classical mechanics problems complete; required sections present; completion criteria checked.
risk: low
trustTier: 1
maxIterations: 6
---

## Operating Contract

- **Input:** Physics Classical request, problem context, constraints, and available evidence.
- **Output:** Physics Classical artifact with completed analysis, decisions, recommendations, and limitations.
- **Side effects:** follow the frontmatter declaration; do not change systems unless explicitly authorized.
- **Dependencies:** declared dependencies, source material, and domain references required by the task.
- **Stop condition:** Solve classical mechanics problems is complete, required sections are present, and completion criteria are checked.
- **Risk:** use the frontmatter risk classification and call out any escalation.
- **Boundary:** stay within the skill's declared scope and side-effect policy.

# Classical Mechanics

Solve a **classical mechanics** problem — Newton's laws, Lagrangian, Hamiltonian, or orbital — with free-body analysis, energy accounting, and dimensional checks.

## When to use

- A mechanical system needs its motion solved (forces, trajectories, equilibrium).
- Engineering, robotics, aerospace, or sports analysis.
- Rigid body rotation, orbital mechanics, or vibrations.

## Process

1. Identify system — particles, rigid body, continuous; degrees of freedom.
2. Draw free-body diagram — all forces with direction, labels, and units.
3. Choose formulation — Newtonian (F=ma), Lagrangian (L=T−V), Hamiltonian (H=T+V), or energy methods.
4. Write equations — Newton's 2nd / Euler-Lagrange / Hamilton's equations; include constraints (holonomic / nonholonomic).
5. Solve — analytically (harmonic oscillator, projectile, central force) or numerically (RK4 for ODEs, finite elements).
6. Dimensional check — verify [force]=[mass][acceleration]; no hidden unit mismatches.
7. Physical limits — check limiting cases (small angle, large mass, friction → 0).
8. Deliver — artifact: diagram, formulation, equations, solution, dimensional check, and limiting cases.

## Rules

- Rule: define coordinate system, sign conventions, and constraints before writing equations.
- Rule: account for every force, torque, or generalized coordinate.
- Rule: check units and limiting cases after deriving the solution.
- Rule: state when approximations such as small angle, massless string, or frictionless contact are used.
- Rule: prefer conservation laws when they simplify the problem without hiding assumptions.
