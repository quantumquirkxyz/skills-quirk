---
name: "physics-classical"
category: "physics"
maturity: "stable"
version: "2"
description: "Solve classical mechanics problems — Newton's laws, Lagrangian, Hamiltonian, rigid body, orbital — with free-body diagrams, energy accounting, and dimensional checks."
license: "MIT"
capabilities:
  - apply physics classical methods within explicit physics boundaries
  - analyze solve classical mechanics problems — newton's laws, lagrangian, hamiltonian, rigid body, orbital — with free-body diagrams, energy accounting, and dimensional checks with assumptions, constraints, and failure modes
  - produce and validate a physics artifact with evidence, decisions, and next steps
outputs: "physics artifact containing the scoped result, supporting evidence, validation status, and residual risks required by this skill's contract."
sideEffects: []
dependencies: []
stopCondition: "Diagram, formulation, equations, solution, dimensional check, and limiting cases all present."
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
compatibility: ["physics-quantum", "physics-simulation-setup"]
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

Emit `PhysicsClassicalArtifact` as both:
- JSON: `.agents/skills/platform/artifacts/physics-classical/{identifier}.json`
- Markdown view: same filename with `.md` extension


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
5. Solve — analytically (harmonic oscillator, projectile, central force) or numerically (leapfrog/Verlet for Hamiltonian systems; RK45/RK4 flagged as non-symplectic and unsuitable for long-term Hamiltonian integration; fixed step size only for Verlet/leapfrog — variable step destabilizes).
6. Dimensional check — verify [force]=[mass][acceleration]; no hidden unit mismatches.
7. Physical limits — check limiting cases (small angle, large mass, friction → 0).
8. Deliver — artifact: diagram, formulation, equations, solution, dimensional check, and limiting cases.

## Rules

- Rule: define coordinate system, sign conventions, and constraints before writing equations.
- Rule: account for every force, torque, or generalized coordinate.
- Rule: require symplectic integrators (leapfrog/Verlet) for Hamiltonian systems; flag RK45/RK4 as non-symplectic.
- Rule: use fixed step size for Verlet/leapfrog — variable step destabilizes the integration.
- Rule: verify time-reversal — integrate forward then backward; the system must return to its start.
- Rule: verify energy drift — energy error must be bounded and oscillatory, not secular growth.
- Rule: enforce dimensional consistency — every term in an equation must share the same dimensions.
- Rule: check units and limiting cases after deriving the solution.
- Rule: state when approximations such as small angle, massless string, or frictionless contact are used.
- Rule: prefer conservation laws when they simplify the problem without hiding assumptions.

## Completion

- the skill's completion criteria are explicitly checked
- the artifact is saved and validated
- any blockers or skipped validations are documented
- the next consumer is identified or the work is handed off
- required fixtures declared: harmonic oscillator energy bounded, Kepler problem stability, time-reversal test, variable-step Verlet instability
---
@include .agents/skills/platform/contract-base.xml
## Reproducibility, Evidence, and Stop Conditions

- **Domain boundary:** Apply this contract specifically to classical: invariantes, límites dimensionales, energía/momento y tolerancias numéricas. Do not claim execution, measurement, publication, peer review, or tool output unless supplied as evidence.
- **Provenance:** Record source identifiers, versions, retrieval dates, transformations, assumptions, and license/redistribution constraints for every external datum, reference, figure, or template. Keep user-provided and analyst-derived facts distinct.
- **Reproducibility:** Emit a manifest with inputs, units/schema, parameter values, software/tool versions, random seeds where relevant, deterministic commands or pseudocode, and content hashes. A missing item is `unknown`, not reconstructed.
- **Fixtures:** Include at least one `known-solution` fixture with expected result and tolerance, and one `counterexample` or failure fixture that must be rejected or flagged. Required fixtures: harmonic oscillator energy bounded, Kepler problem stability, time-reversal test, variable-step Verlet instability. Fixtures are specifications only; do not imply they were run.
- **Uncertainty:** State uncertainty sources, interval/confidence convention, numerical tolerances, significant figures, conditioning/sensitivity, and acceptance thresholds. Never turn a heuristic estimate into a proof or measurement.
- **Formal artifacts:** When correctness is claimed, attach assumptions, invariant/derivation, proof obligations, and a machine-checkable proof or verification artifact when available; otherwise label the result `informal` and list residual obligations.
- **Accessible output:** Provide units and plain-language interpretation, text alternatives for figures/equations, sufficient contrast and reading order, keyboard/screen-reader-friendly tables, and captions/transcripts for presentations or media.
- **Privacy and licensing:** Minimize personal/sensitive data, redact identifiers, document consent and access boundaries, and preserve attribution, citation, and license compatibility. Stop rather than expose restricted material.
- **Stop conditions:** Stop with status `blocked` or `uncertain` when provenance, units, baseline, tolerance, required proof, licensing, privacy, or fixture oracle is missing; when a result exceeds stated validity bounds; or when a requested action would require unobserved execution or unsafe disclosure.

## Validation Record

Return `status` (`planned`, `observed`, `validated`, `uncertain`, or `blocked`), the evidence manifest, fixture declarations and expected tolerances, assumptions, accessibility/privacy/licensing checks, and unresolved proof obligations. Completion requires all in-scope fields or an explicit reason for each unknown.
