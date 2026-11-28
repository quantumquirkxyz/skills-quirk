---
description: "Model astrophysical systems — stellar structure, orbital dynamics, cosmology, gravitational waves — with physical scales, order-of-magnitude estimates, and scaling laws."
---
# physics-astro

When to use: Model astrophysical systems — stellar structure, orbital dynamics, cosmology, gravitational waves — with physical scales, order-of-magnitude estimates, and scaling laws.

## Workflow

1. Identify the astrophysical regime — stellar (fusion, HR diagram, mass-radius), orbital (Kepler's laws, n-body), galactic (dynamics, spiral structure), cosmological (FLRW, CMB, dark matter)
2. State physical scales — distances (AU, parsec, Mpc), masses (M☉), times (Myr, Gyr), temperatures
3. Choose the governing physics — gravity (Newton/Einstein), thermodynamics, nuclear physics, radiation transport
4. Apply scaling laws — Virial theorem, Jeans equations, mass-luminosity relation, Kepler's 3rd, Chandrasekhar limit, Schwarzschild radius
5. Cosmological parameters — default to Planck 2018 base-ΛCDM with uncertainties (H₀, Ω_m, Ω_Λ, Ω_b, σ_8, n_s); use Planck PR4 only as an explicitly requested option
6. Estimate numerically — order-of-magnitude before exact calculation; use the scaling to catch errors
7. Check against observations — known values for comparable objects (e.g. Sun, Jupiter, Milky Way mass)
8. Deliver — artifact: regime, scales, governing physics, scaling laws applied, numerical estimate, observational check

## Deliverables

- physics artifact

## Guardrails

- risk: low; trust tier: 1; approval required: no
- side effects: none
- isolation: none; model tier: reasoning

Stop when: Regime, scales, governing physics, scaling laws, numerical estimate, and observational check all documented.
