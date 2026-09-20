---
name: physics-quantum
category: skill-dev/sandbox
maturity: experimental
version: 1
description: Model quantum systems (states, operators, measurement, entanglement) and perform calculations using Dirac notation, with checks against limits and known results.
capabilities:
  - apply physics quantum workflow
  - produce physics quantum analysis artifact
  - validate physics quantum completion criteria
outputs:
  - Physics Quantum artifact with completed sections, evidence, and limitations
sideEffects: []
dependencies: []
stopCondition: Model quantum systems (states, operators, measurement, entanglement) and perform calculations using Dirac notation, with checks against limits and known results complete; required sections present; completion criteria checked.
risk: low
trustTier: 1
maxIterations: 6
---

## Operating Contract

- **Input:** Physics Quantum request, problem context, constraints, and available evidence.
- **Output:** Physics Quantum artifact with completed analysis, decisions, recommendations, and limitations.
- **Side effects:** follow the frontmatter declaration; do not change systems unless explicitly authorized.
- **Dependencies:** declared dependencies, source material, and domain references required by the task.
- **Stop condition:** Model quantum systems (states, operators, measurement, entanglement) and perform calculations using Dirac notation, with checks against limits and known results is complete, required sections are present, and completion criteria are checked.
- **Risk:** use the frontmatter risk classification and call out any escalation.
- **Boundary:** stay within the skill's declared scope and side-effect policy.

# Quantum Physics Modeling

Construct a **quantum model** of a system — state space, Hamiltonian, measurement — and answer a question about it with explicit regime checks.

## When to use

- The user wants to model a quantum system or compute an observable.
- A claim from quantum information, quantum computing, atomic/molecular physics, or condensed matter needs grounding.
- Another skill (e.g. `cs-cryptography` or quantum-related ML) needs a quantum-mechanical sub-model.

## Process

### 1. Define the system

Specify:

- **Hilbert space** — finite (qubits, spin-1/2) or infinite (position, Fock).
- **Basis** — computational, Fock, position, momentum.
- **State** — pure |ψ⟩ or mixed ρ; for multi-party, identify subsystems.
- **Hamiltonian** — kinetic + potential; cite which interactions are kept.

**Completion criterion:** Hilbert space, basis, state, and Hamiltonian all explicit.

### 2. Identify the regime

Locate the system in the taxonomy:

- Non-relativistic vs relativistic (Schrödinger vs Dirac).
- Single-particle vs many-body.
- Closed vs open (Lindblad master equation if open).
- Discrete (qubit) vs continuous-variable.

Pick the right formalism: Schrödinger picture, Heisenberg, interaction picture, path integral.

**Completion criterion:** regime and formalism chosen with a one-line justification.

### 3. Compute

Solve by the path that matches the system:

- **Exactly solvable** — harmonic oscillator, hydrogen, two-level, Jaynes–Cummings.
- **Perturbation theory** — time-independent or time-dependent; cite the small parameter.
- **Variational** — ansatz + minimize ⟨ψ|H|ψ⟩.
- **Numerical** — exact diagonalisation, DMRG, tensor networks, QMC.

For each step, state approximations and truncations.

**Completion criterion:** method named, approximations listed, computation executed.

### 4. Units and limits check

- **Units:** verify ℏ, c, k_B are set correctly; energies, lengths, times have plausible orders of magnitude.
- **Limits:** check classical limit (ℏ→0), continuum limit, weak-coupling limit, large-N limit.
- **Symmetries:** confirm the answer respects them (rotational, particle-number, parity).

**Completion criterion:** units sanity-checked; at least one limit recovered.

### 5. Deliver

Markdown artifact with: system definition, regime, computation, units/limits, and the answer with an uncertainty or approximation note. Cite the method used.

**Completion criterion:** artifact covers all five; answer is reproducible.
