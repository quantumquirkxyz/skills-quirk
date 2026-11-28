---
name: "physics-data-analysis-root"
category: "physics"
maturity: "stable"
version: "2"
description: "Analyse experimental physics data with ROOT, pandas, uproot, NumPy — calibration, systematic errors, statistical inference, result archival — with reproducible scripts."
license: "MIT"
capabilities:
  - apply physics data analysis root methods within explicit physics boundaries
  - analyze analyse experimental physics data with root, pandas, uproot, numpy — calibration, systematic errors, statistical inference, result archival — with reproducible scripts with assumptions, constraints, and failure modes
  - produce and validate a physics artifact with evidence, decisions, and next steps
outputs: "analysis script + report."
sideEffects: []
dependencies: []
stopCondition: "Script runs; report saved with error budget, systematic table, and plot links."
risk: "medium"
trustTier: "3"
maxIterations: "6"
promptVersion: "2.0"
artifactType: "data"
modelTier: "reasoning"
evaluators: ["behavioral", "regression"]
fixturesPath: "tests/skill-output-migration-physics.test.mjs"
diataxis: "how-to"
tags: ["physics"]
compatibility: ["physics-experimental-notebook", "physics-reproducibility-archive"]
approvalRequired: "false"
approvalFor: []
---

## Contract

- Input: experimental data file(s), calibration constants, analysis goal.
- Output: analysis script + report.
- Scope: analyses data; does not change raw files.
- Rule: analyses data; does not change raw files.
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

Emit `PhysicsDataAnalysisRootArtifact` as both:
- JSON: `.agents/skills/platform/artifacts/physics-data-analysis-root/{identifier}.json`
- Markdown view: same filename with `.md` extension


# Physics Data Analysis — ROOT / Python

Analyse **experimental physics data** with reproducible scripts, explicit calibration, and a complete error budget.

## When to use

- Experimental data needs statistical analysis.
- A result needs a systematic error table.
- Data must be preserved with analysis linked.

## Process

### 1. Data loading and validation

- Load data (ROOT / HDF5 / CSV / binary); verify schema.
- Check for missing values, outliers, inconsistent units.
- Confirm file provenance (run number, detector state, date).

**Completion criterion:** data validated; provenance recorded.

### 2. Calibration

Apply:

- **Energy / momentum scale** — calibration from standard source.
- **Efficiency correction** — acceptance and reconstruction efficiency.
- **Background subtraction** — with statistical error.

Record the calibration constants with their uncertainties.

**Completion criterion:** calibration applied; constants with errors saved.

### 3. Statistical analysis

- **Blinding** — apply the blinding state machine: signal-region access is blocked until sideband validation passes; record blinding state.
- **Histogram / fit** — with appropriate model (Gaussian, Poisson, exponential, custom), performed on blinded/sideband data only.
- **Hypothesis test** — chi² / Kolmogorov-Smirnov / likelihood ratio.
- **Confidence interval** — 68% / 95% (bootstrap or analytic).
- **Uncertainty propagation** — propagate statistical and systematic uncertainties separately; never combine before reporting.
- **Systematic table** — named systematics (calibration, model, background, acceptance, ...) each with contribution.
- **Unblinding approval** — record approval before unblinding the signal region; track approver, timestamp, and criteria met.

**Completion criterion:** statistical result with error budget saved; systematic table present; blinding state and unblinding approval recorded.

### 4. Results and plots

- **Plots:** data points + model / fit; systematic bands; labels with units.
- **Result summary:** value ± statistical ± systematic.
- **Reproducibility:** script saved; data file linked by DOI or path.

**Completion criterion:** plots saved; result summary present; script linked.

## Rules

- Rule: preserve raw data and write analysis outputs separately.
- Rule: record provenance, run conditions, calibration constants, and software environment.
- Rule: block signal-region access until sideband validation passes (blinding state machine).
- Rule: require a systematic error table with named systematics and contributions.
- Rule: propagate statistical and systematic uncertainties separately.
- Rule: record unblinding approval (approver, timestamp, criteria) before unblinding.
- Rule: label plots with units, selections, and fit/model assumptions.
- Rule: make scripts reproducible from a clean checkout or documented environment.

## Completion

- the skill's completion criteria are explicitly checked
- the artifact is saved and validated
- any blockers or skipped validations are documented
- the next consumer is identified or the work is handed off
- required fixtures declared: signal-region access blocked until sideband validation, systematic error table, statistical vs systematic separation, unblinding approval
---
@include .agents/skills/platform/contract-base.xml
## Reproducibility, Evidence, and Stop Conditions

- **Domain boundary:** Apply this contract specifically to data-analysis-root: calibración, propagación de errores, estadística y análisis reproducible. Do not claim execution, measurement, publication, peer review, or tool output unless supplied as evidence.
- **Provenance:** Record source identifiers, versions, retrieval dates, transformations, assumptions, and license/redistribution constraints for every external datum, reference, figure, or template. Keep user-provided and analyst-derived facts distinct.
- **Reproducibility:** Emit a manifest with inputs, units/schema, parameter values, software/tool versions, random seeds where relevant, deterministic commands or pseudocode, and content hashes. A missing item is `unknown`, not reconstructed.
- **Fixtures:** Include at least one `known-solution` fixture with expected result and tolerance, and one `counterexample` or failure fixture that must be rejected or flagged. Required fixtures: signal-region access blocked until sideband validation, systematic error table, statistical vs systematic separation, unblinding approval. Fixtures are specifications only; do not imply they were run.
- **Uncertainty:** State uncertainty sources, interval/confidence convention, numerical tolerances, significant figures, conditioning/sensitivity, and acceptance thresholds. Never turn a heuristic estimate into a proof or measurement.
- **Formal artifacts:** When correctness is claimed, attach assumptions, invariant/derivation, proof obligations, and a machine-checkable proof or verification artifact when available; otherwise label the result `informal` and list residual obligations.
- **Accessible output:** Provide units and plain-language interpretation, text alternatives for figures/equations, sufficient contrast and reading order, keyboard/screen-reader-friendly tables, and captions/transcripts for presentations or media.
- **Privacy and licensing:** Minimize personal/sensitive data, redact identifiers, document consent and access boundaries, and preserve attribution, citation, and license compatibility. Stop rather than expose restricted material.
- **Stop conditions:** Stop with status `blocked` or `uncertain` when provenance, units, baseline, tolerance, required proof, licensing, privacy, or fixture oracle is missing; when a result exceeds stated validity bounds; or when a requested action would require unobserved execution or unsafe disclosure.

## Validation Record

Return `status` (`planned`, `observed`, `validated`, `uncertain`, or `blocked`), the evidence manifest, fixture declarations and expected tolerances, assumptions, accessibility/privacy/licensing checks, and unresolved proof obligations. Completion requires all in-scope fields or an explicit reason for each unknown.
