---
name: physics-astro
category: skill-dev/sandbox
maturity: stable
version: 1
description: Model astrophysical systems — stellar structure, orbital dynamics, cosmology, gravitational waves — with physical scales, order-of-magnitude estimates, and scaling laws.
capabilities:
  - apply physics astro workflow
  - produce physics astro analysis artifact
  - validate physics astro completion criteria
outputs:
  - Physics Astro artifact with completed sections, evidence, and limitations
sideEffects: []
dependencies: []
stopCondition: Model astrophysical systems complete; required sections present; completion criteria checked.
risk: low
trustTier: 1
maxIterations: 6
---

## Operating Contract

- **Input:** Physics Astro request, problem context, constraints, and available evidence.
- **Output:** Physics Astro artifact with completed analysis, decisions, recommendations, and limitations.
- **Side effects:** follow the frontmatter declaration; do not change systems unless explicitly authorized.
- **Dependencies:** declared dependencies, source material, and domain references required by the task.
- **Stop condition:** Model astrophysical systems is complete, required sections are present, and completion criteria are checked.
- **Risk:** use the frontmatter risk classification and call out any escalation.
- **Boundary:** stay within the skill's declared scope and side-effect policy.

# Astrophysics Modeling

Model an **astrophysical system** — stellar, galactic, cosmological — with physical scales, order-of-magnitude estimates, and known scaling laws.

## When to use

- A stellar, planetary, galactic, or cosmological problem needs a quantitative model.
- Order-of-magnitude estimates for astrophysical phenomena.
- Connecting observations to physical theory.

## Process

1. Identify the astrophysical regime — stellar (fusion, HR diagram, mass-radius), orbital (Kepler's laws, n-body), galactic (dynamics, spiral structure), cosmological (FLRW, CMB, dark matter).
2. State physical scales — distances (AU, parsec, Mpc), masses (M☉), times (Myr, Gyr), temperatures.
3. Choose the governing physics — gravity (Newton/Einstein), thermodynamics, nuclear physics, radiation transport.
4. Apply scaling laws — Virial theorem, Jeans equations, mass-luminosity relation, Kepler's 3rd, Chandrasekhar limit, Schwarzschild radius.
5. Estimate numerically — order-of-magnitude before exact calculation; use the scaling to catch errors.
6. Check against observations — known values for comparable objects (e.g. Sun, Jupiter, Milky Way mass).
7. Deliver — artifact: regime, scales, governing physics, scaling laws applied, numerical estimate, observational check.

## Rules

- Rule: establish physical scale and regime before choosing equations.
- Rule: run an order-of-magnitude estimate before detailed computation.
- Rule: state units, constants, and cosmological parameters explicitly.
- Rule: compare estimates against known astrophysical objects or observed values.
- Rule: flag where Newtonian, relativistic, fluid, or radiative assumptions dominate.
