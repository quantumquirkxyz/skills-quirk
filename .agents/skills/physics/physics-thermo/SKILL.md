---
name: physics-thermo
category: skill-dev/sandbox
maturity: stable
version: 1
description: Model thermodynamic systems — first and second law, heat engines, entropy, phase transitions — with energy accounting and efficiency bounds.
capabilities:
  - apply physics thermo workflow
  - produce physics thermo analysis artifact
  - validate physics thermo completion criteria
outputs:
  - Physics Thermo artifact with completed sections, evidence, and limitations
sideEffects: []
dependencies: []
stopCondition: Model thermodynamic systems complete; required sections present; completion criteria checked.
risk: low
trustTier: 1
maxIterations: 6
---

## Operating Contract

- **Input:** Physics Thermo request, problem context, constraints, and available evidence.
- **Output:** Physics Thermo artifact with completed analysis, decisions, recommendations, and limitations.
- **Side effects:** follow the frontmatter declaration; do not change systems unless explicitly authorized.
- **Dependencies:** declared dependencies, source material, and domain references required by the task.
- **Stop condition:** Model thermodynamic systems is complete, required sections are present, and completion criteria are checked.
- **Risk:** use the frontmatter risk classification and call out any escalation.
- **Boundary:** stay within the skill's declared scope and side-effect policy.

# Thermodynamics Modeling

Apply **thermodynamics** — first/second law, entropy, phase transitions — to a physical system with explicit energy accounting and efficiency limits.

## When to use

- The user wants to analyse an engine, refrigeration cycle, chemical process, or material phase change.
- A system needs energy conservation, entropy production, or efficiency bounds.
- Engineering / chemistry / physics requires a thermodynamic model.

## Process

### 1. Define the system

Name: open / closed / isolated. Identify the control volume (if any) and time window. List known and unknown state variables (T, P, V, U, H, S). State the working substance (ideal gas, real fluid, solid).

**Completion criterion:** system type, control volume, substance, and known/unknown variables all explicit.

### 2. First law (energy accounting)

Apply ΔU = Q − W for closed systems; ṁ(ĥ₂ − ĥ₁) for open systems. List each energy term and its sign convention. Write the energy balance equation.

**Completion criterion:** energy balance written with every term named and signed.

### 3. Second law (entropy)

Apply ΔS = ∫δQ_rev/T + S_gen. Compute S_gen ≥ 0. If an irreversibility is present (friction, mixing, finite ΔT), quantify it: lost work W_lost = T₀ · S_gen.

**Completion criterion:** entropy balance written; lost work computed if irreversibility present.

### 4. Pick the cycle / process

- Isothermal, adiabatic, polytropic, or specific process (Otto, Diesel, Rankine, Carnot, Brayton, refrigeration).
- For each step, apply the appropriate equation of state (ideal gas law, Van der Waals, Steam tables).
- Compute efficiency η = W_net / Q_in; compare to Carnot η = 1 − T_C/T_H.

**Completion criterion:** cycle named; each step computed; efficiency vs Carnot stated.

### 5. Phase transitions (if applicable)

- Clapeyron equation: dP/dT = ΔS/ΔV = ΔH/(TΔV).
- Phase diagram: identify phases, coexistence lines, critical point.
- Latent heat, specific heats, and supercooling / superheating.

**Completion criterion:** phase diagram described; latent heat and critical point computed.

### 6. Deliver

Markdown artifact: system definition, first law, second law, cycle analysis, efficiency, and the key bound (e.g. "this engine cannot exceed 60% Carnot efficiency at these temperatures").

**Completion criterion:** all sections present; efficiency bound stated.
