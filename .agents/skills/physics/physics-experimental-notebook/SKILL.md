---
name: "physics-experimental-notebook"
category: "physics"
maturity: "stable"
version: "2"
description: "Maintain experimental physics lab notebooks — measurements, calibration, error analysis, FAIR data principles, reproducibility — with digital and physical structure."
license: "MIT"
capabilities:
  - apply physics experimental notebook methods within explicit physics boundaries
  - analyze maintain experimental physics lab notebooks — measurements, calibration, error analysis, fair data principles, reproducibility — with digital and physical structure with assumptions, constraints, and failure modes
  - produce and validate a physics artifact with evidence, decisions, and next steps
outputs: "digital notebook entry + FAIR checklist."
sideEffects: []
dependencies: []
stopCondition: "Notebook entry saved with all sections; calibration and error analysis complete; FAIR checklist filled."
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
compatibility: ["physics-data-analysis-root", "physics-reproducibility-archive"]
approvalRequired: "false"
approvalFor: []
---

## Contract

- Input: experiment setup, measurements, calibration data.
- Output: digital notebook entry + FAIR checklist.
- Scope: produces documentation artifacts; no changes to equipment.
- Rule: produces documentation artifacts; no changes to equipment.
- Rule: documented standards override defaults; explicit project rules take precedence.
- Rule: if blocked by missing context or dependencies, surface the blocker before proceeding.

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

Emit `PhysicsExperimentalNotebookArtifact` as both:
- JSON: `.agents/skills/platform/artifacts/physics-experimental-notebook/{identifier}.json`
- Markdown view: same filename with `.md` extension


# Experimental Physics Notebook

Build an **experimental lab notebook** — structured, reproducible, FAIR-compliant — that another physicist could use to reproduce the measurement.

## When to use

- A measurement has been made.
- Data must be preserved for publication or collaboration.
- A reviewer asks for raw data or calibration details.

## Process

### 1. Experiment description

State:

- **Physical system** — apparatus, conditions (T, P, B, etc.), scale.
- **Measured quantity** — with units and expected magnitude.
- **Purpose** — hypothesis tested or parameter extracted.
- **References** — theory / prior measurement.

**Completion criterion:** all elements present.

### 2. Setup and calibration

Document:

- **Apparatus** — instruments with model numbers, settings.
- **Calibration procedure** — standard source, method, date, result.
- **Traceability** — chain to a national/international standard if applicable; record calibration certificate number, issuing lab, calibration date, next due date, and the link from each measurement to its calibration record.
- **Calibration uncertainty** — propagated into the final result as a Type B component.

**Completion criterion:** calibration documented with traceability link to each measurement and uncertainty.

### 3. Measurements

Record:

- **Raw data** — time stamps, conditions, instrument readings.
- **Data format** — file format (CSV, HDF5, ROOT) with schema description.
- **Sampling rate / integration time** — with justification.
- **Environment conditions** — during measurement (temperature, humidity, magnetic field, vibration).

**Completion criterion:** raw data linked; format described.

### 4. Error analysis

Apply **GUM uncertainty propagation**:

- **Type A (statistical)** — standard uncertainty from repeated measurements: `u_A = s / sqrt(n)` where `s` is the sample standard deviation and `n` the number of repetitions.
- **Type B (systematic)** — standard uncertainty from calibration certificates, instrument specifications, or tolerance limits; for a uniform (rectangular) distribution with half-width `a`, `u_B = a / sqrt(3)`.
- **Combined standard uncertainty** — `u_c = sqrt(sum_i u_i^2)` over independent Type A and Type B components (root-sum-square), or the full covariance matrix when components are correlated.
- **Expanded uncertainty** — `U = k · u_c` with coverage factor `k = 2` for approximately 95% confidence; report the result as `measurand ± U`.
- **Sensitivity analysis** — how does the result change with key parameter perturbation?

**Completion criterion:** statistical and systematic errors quantified; combined and expanded uncertainty (k=2) reported.

### 5. FAIR checklist

- **Findable** — metadata (title, authors, date, keywords) in a repository (Zenodo, OSF, institutional); assign a **DOI** with **DataCite** metadata (creators, title, publisher, publicationYear, resourceType, relatedIdentifiers).
- **Accessible** — open access policy; file formats (CSV, HDF5) with open specifications.
- **Interoperable** — metadata uses standard vocabularies (e.g. Dublin Core, DataCite, FAIRsharing).
- **Reusable** — licence (CC0 / MIT), code for analysis linked, version control (Git tag / DOI).

**Completion criterion:** checklist filled; DOI or Git tag assigned; DataCite metadata present.

### 6. Audit trail immutability

- Record every notebook entry as **append-only** with a UTC timestamp and a content hash (SHA-256).
- Corrections are made only by **addendum**; never edit or delete a recorded entry.
- Pin entries with **Git signed commits** (or equivalent signed record) so the history cannot be rewritten silently.
- Verify immutability on each review by recomputing hashes and comparing against the stored manifest.

**Completion criterion:** audit trail is append-only, hashed, and signed; immutability check passes.

### 7. Deliver

Markdown entry with: description, setup, calibration, measurements, error analysis, FAIR checklist, audit trail, and linked data. The entry should be readable by another physicist without the original experimenter.

**Completion criterion:** entry saved; all links active; FAIR checklist complete; audit trail verified.

## Completion

- the skill's completion criteria are explicitly checked
- the artifact is saved and validated
- any blockers or skipped validations are documented
- the next consumer is identified or the work is handed off
---
@include .agents/skills/platform/contract-base.xml
## Reproducibility, Evidence, and Stop Conditions

- **Domain boundary:** Apply this contract specifically to experimental-notebook: cadena de custodia de mediciones, cuaderno inmutable y seguridad de participantes. Do not claim execution, measurement, publication, peer review, or tool output unless supplied as evidence.
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

## Fixtures

- `uncertainty-propagation` — known-solution: two repeated measurements (10.12, 10.18) with Type B calibration component `u_B = 0.05`; expected combined `u_c ≈ 0.053`, expanded `U = 2 · u_c ≈ 0.106`, reported as `10.15 ± 0.11`.
- `calibration-traceability` — counterexample: a measurement whose calibration certificate is expired or lacks the standard-source chain must be flagged and excluded from the FAIR entry.
- `audit-trail-immutability` — counterexample: an edited or deleted notebook entry without an addendum or signed commit must be rejected as non-immutable.
