---
name: "physics-thermo"
category: "physics"
maturity: "stable"
version: "2"
description: "Model thermodynamic systems — first and second law, heat engines, entropy, phase transitions — with energy accounting and efficiency bounds."
license: "MIT"
capabilities:
  - apply physics thermo methods within explicit physics boundaries
  - analyze model thermodynamic systems — first and second law, heat engines, entropy, phase transitions — with energy accounting and efficiency bounds with assumptions, constraints, and failure modes
  - produce and validate a physics artifact with evidence, decisions, and next steps
outputs: "physics artifact containing the scoped result, supporting evidence, validation status, and residual risks required by this skill's contract."
sideEffects: []
dependencies: []
stopCondition: "System definition, first law, second law, cycle analysis, efficiency, and key bound all documented."
risk: "low"
trustTier: "1"
maxIterations: "6"
promptVersion: "2.0"
artifactType: "physics"
modelTier: "reasoning"
evaluators: ["behavioral", "regression"]
fixturesPath: "tests/skill-output-migration-physics.test.mjs"
diataxis: "how-to"
tags: ["physics"]
compatibility: ["physics-classical", "physics-simulation-setup"]
approvalRequired: "false"
approvalFor: []
---

## Contract

- Input: skill invocation with the user's request and available context.
- Output: a structured artifact or guidance aligned to the skill's declared outputs.
- Scope: stay within the skill's declared boundaries; do not broaden without explicit direction.
- Rule: follow the skill's completion criteria and stop condition exactly.

## Provenance

| Question | Answer |
|---|---|
| What is the source of truth? | The user's request, originating spec/issue, and the skill's declared outputs |
| What is in scope? | Work covered by the skill's acceptance criteria and completion rules |
| What is explicitly out of scope? | Files, behaviors, and decisions outside the skill's declared boundary |
| Who or what consumes this artifact afterward? | The next skill in the workflow or the user |
| What evidence proves it is done? | Completion criteria met, artifact saved, validation passed |
| What risk remains? | Subjective judgment calls, missing context, or external dependency failures


## Artifact

Emit `PhysicsThermoArtifact` as both:
- JSON: `.agents/skills/platform/artifacts/physics-thermo/{identifier}.json`
- Markdown view: same filename with `.md` extension


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

### 3. First-law cycle accounting

For any closed cycle, verify net Q − W = 0 (net heat equals net work over the cycle). Sum Q and W over every step and confirm closure within tolerance.

**Completion criterion:** cycle energy balance closes: ΣQ − ΣW = 0.

### 4. Second law (entropy)

Apply ΔS = ∫δQ_rev/T + S_gen. Compute S_gen ≥ 0. If an irreversibility is present (friction, mixing, finite ΔT), quantify it: lost work W_lost = T₀ · S_gen.

**Completion criterion:** entropy balance written; lost work computed if irreversibility present.

### 5. Entropy production

For isolated or closed systems, verify entropy production ≥ 0. Report S_gen and confirm it is non-negative for every process step.

**Completion criterion:** S_gen ≥ 0 confirmed for isolated/closed systems.

### 6. Pick the cycle / process

- Isothermal, adiabatic, polytropic, or specific process (Otto, Diesel, Rankine, Carnot, Brayton, refrigeration).
- For each step, apply the appropriate equation of state (ideal gas law, Van der Waals, Steam tables).
- Compute efficiency η = W_net / Q_in; compare to Carnot η = 1 − T_C/T_H.

**Completion criterion:** cycle named; each step computed; efficiency vs Carnot stated.

### 7. Carnot bound check

Verify η ≤ 1 − T_C/T_H for any heat engine operating between reservoirs at T_H and T_C. Confirm no claimed efficiency exceeds the Carnot bound.

**Completion criterion:** efficiency compared to Carnot bound; bound not violated.

### 8. Van der Waals critical point verification

For a Van der Waals fluid (p + a/V²)(V − b) = RT, verify the critical point conditions:

- ∂p/∂V = 0 at critical point.
- ∂²p/∂V² = 0 at critical point.

Compute V_c, p_c, T_c and confirm both derivatives vanish at the critical point.

**Completion criterion:** both critical-point derivative conditions verified.

### 9. Maxwell construction (if phase coexistence)

Apply the Maxwell equal-area construction for first-order phase transitions: verify equal areas under the Van der Waals isotherm in the coexistence region.

**Completion criterion:** Maxwell construction verified where applicable.

### 10. Phase transitions (if applicable)

- Clapeyron equation: dP/dT = ΔS/ΔV = ΔH/(TΔV).
- Phase diagram: identify phases, coexistence lines, critical point.
- Latent heat, specific heats, and supercooling / superheating.

**Completion criterion:** phase diagram described; latent heat and critical point computed.

### 11. Deliver

Markdown artifact: system definition, first law, first-law cycle accounting, second law, entropy production, cycle analysis, efficiency, Carnot bound check, Van der Waals critical point verification, Maxwell construction, and the key bound (e.g. "this engine cannot exceed 60% Carnot efficiency at these temperatures").

**Completion criterion:** all sections present; efficiency bound stated.

## Fixtures

- **Carnot efficiency** — fixture with T_H, T_C, expected Carnot bound, and confirmation that claimed η does not exceed it.
- **First-law cycle** — fixture with per-step Q and W values; expected closure ΣQ − ΣW = 0 within tolerance.
- **Van der Waals critical point** — fixture with a, b, R; expected V_c, p_c, T_c; confirmation ∂p/∂V = ∂²p/∂V² = 0 at the critical point.
- **Maxwell construction** — fixture with a Van der Waals isotherm; expected equal areas in the coexistence region.
- **Entropy production** — fixture with heat transfers and temperatures; expected S_gen ≥ 0 for isolated/closed systems.

## Completion

- the skill's completion criteria are explicitly checked
- the artifact is saved and validated
- any blockers or skipped validations are documented
- the next consumer is identified or the work is handed off
---
@include .agents/skills/platform/contract-base.xml
## Reproducibility, Evidence, and Stop Conditions

- **Domain boundary:** Apply this contract specifically to thermo: balances, ecuaciones de estado, límites de equilibrio y propagación de incertidumbre. Do not claim execution, measurement, publication, peer review, or tool output unless supplied as evidence.
- **Provenance:** Record source identifiers, versions, retrieval dates, transformations, assumptions, and license/redistribution constraints for every external datum, reference, figure, or template. Keep user-provided and analyst-derived facts distinct.
- **Reproducibility:** Emit a manifest with inputs, units/schema, parameter values, software/tool versions, random seeds where relevant, deterministic commands or pseudocode, and content hashes. A missing item is `unknown`, not reconstructed.
- **Fixtures:** Include at least one `known-solution` fixture with expected result and tolerance, and one `counterexample` or failure fixture that must be rejected or flagged. Fixtures are specifications only; do not imply they were run.
- **Uncertainty:** State uncertainty sources, interval/confidence convention, numerical tolerances, significant figures, conditioning/sensitivity, and acceptance thresholds. Never turn a heuristic estimate into a proof or measurement.
- **Formal artifacts:** When correctness is claimed, attach assumptions, invariant/derivation, proof obligations, and a machine-checkable proof or verification artifact when available; otherwise label the result `informal` and list residual obligations.
- **Accessible output:** Provide units and plain-language interpretation, text alternatives for figures/equations, sufficient contrast and reading order, keyboard/screen-reader-friendly tables, and captions/transcripts for presentations or media.
- **Privacy and licensing:** Minimize personal/sensitive data, redact identifiers, document consent and access boundaries, and preserve attribution, citation, and license compatibility. Stop rather than expose restricted material.
- **Stop conditions:** Stop with status `blocked` or `uncertain` when provenance, units, baseline, tolerance, required proof, licensing, privacy, or fixture oracle is missing; when a result exceeds stated validity bounds; or when a requested action would require unobserved execution or unsafe disclosure.

## Validation Record

Return `status` (`planned`, `observed`, `validated`, `uncertain`, or `blocked`), the evidence manifest, fixture declarations and expected tolerances, assumptions, accessibility/privacy/licensing checks, and unresolved proof obligations. Completion requires all in-scope fields or an explicit reason for each unknown.
