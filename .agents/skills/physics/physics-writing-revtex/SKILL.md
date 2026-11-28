---
name: "physics-writing-revtex"
category: "physics"
maturity: "stable"
version: "2"
description: "Write physics papers using RevTeX / APS / IOP / AIP formatting, with figure conventions, citation styles, and submission package preparation."
license: "MIT"
capabilities:
  - apply physics writing revtex methods within explicit physics boundaries
  - analyze write physics papers using revtex / aps / iop / aip formatting, with figure conventions, citation styles, and submission package preparation with assumptions, constraints, and failure modes
  - produce and validate a physics artifact with evidence, decisions, and next steps
outputs: "compiled PDF + source package + figure checklist."
sideEffects: []
dependencies: []
stopCondition: "PDF compiled in journal format; figure checklist complete; submission package ready."
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
compatibility: ["physics-paper-collaboration", "physics-reproducibility-archive"]
approvalRequired: "false"
approvalFor: []
---

## Contract

- Input: paper content, journal choice.
- Output: compiled PDF + source package + figure checklist.
- Scope: formats and prepares; does not write scientific content.
- Rule: formats and prepares; does not write scientific content.
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

Emit `PhysicsWritingRevtexArtifact` as both:
- JSON: `.agents/skills/platform/artifacts/physics-writing-revtex/{identifier}.json`
- Markdown view: same filename with `.md` extension


# Physics Paper Writing — RevTeX and Formats

Prepare a **physics paper** in the target journal format — RevTeX (APS), IOP, AIP — with figures meeting conventions and a submission package.

## When to use

- A physics result needs to be submitted to a journal.
- A preprint needs to be formatted for arXiv or a conference.
- Figures need to match journal conventions.

## Process

### 1. Choose journal and format

- **APS / Physical Review** — RevTeX template (`revsym`, `revtwo`, `aps`).
- **IOP** — `iopart` class.
- **AIP** — `aip` / `aip-cp` class.

Download the template; check page limit and figure rules.

**Completion criterion:** template downloaded; rules noted.

### 2. Require REVTeX 4.2f

When using APS / Physical Review format:

- Require REVTeX 4.2f (`\documentclass[...]{revtex4-2}` or the appropriate 4.2f class option).
- Do not use REVTeX 3.x or 4.1 without explicit justification.
- Record the REVTeX version in the submission manifest.

**Completion criterion:** REVTeX 4.2f required and recorded.

### 3. Validate class options

Confirm the document class option matches the target journal:

- **prl** — Physical Review Letters.
- **prx** — Physical Review X.
- **prb** — Physical Review B.
- **pra** — Physical Review A.
- **prc** — Physical Review C.
- **prd** — Physical Review D.
- **pre** — Physical Review E.
- **prl/prx/prb/etc.** with `aps` / `revtwo` / `revsym` as appropriate.

Validate that the selected option is supported by REVTeX 4.2f for the target journal.

**Completion criterion:** class option validated against target journal.

### 4. 80-char line limit

Keep all source lines at or below 80 characters:

- TeX source, BibTeX entries, and configuration files.
- Wrap long equations and URLs without breaking semantics.
- Check with a line-length lint on every source file.

**Completion criterion:** no source line exceeds 80 characters.

### 5. BibTeX apsrev4-2 style

- Use `apsrev4-2` bibliography style for APS journals.
- Confirm `.bbl` entries match `apsrev4-2` output.
- Validate that citations resolve and reference list is complete.

**Completion criterion:** bibliography uses `apsrev4-2`; citations resolved.

### 6. Write the structure

Standard sections for physics papers:

- Title, authors, affiliations.
- Abstract (≤ 150 words for APS; check journal rules).
- Introduction (context, problem, previous work).
- Theory / Model (with equations, variables defined).
- Method / Experiment.
- Results (figures, data, analysis).
- Discussion (interpretation, comparison, limitations).
- Conclusion (key result, future work).
- References (BibTeX; check journal citation style).
- Acknowledgements (funding, collaborations).

**Completion criterion:** structure complete.

### 7. Figures

Journal rules vary; common conventions:

- **Resolution:** 300 dpi for raster, vector (PDF / EPS) preferred.
- **Colour mode:** CMYK for print, RGB for online; check journal.
- **Line thickness:** 0.5–1pt; avoid hairlines (too thin for print).
- **Font size:** consistent with body text (often 9pt in print).
- **Labels:** use `\label` / `\ref` for cross-references; avoid ambiguous numbering.

**Completion criterion:** figures comply with checklist; all cross-references resolved.

### 8. Compile and check

- Compile `.tex` with `pdfLaTeX` / `LuaLaTeX`; fix errors.
- Check reference list for duplicates / missing entries.
- Verify equation numbering; fix broken references.
- Check page count; trim or expand to meet limits.
- Check that the abstract contains no references to figures or equations (APS rule).

**Completion criterion:** compiled PDF; all checks passed.

### 9. Submission package

Prepare:

- Source `.tex` + `.bib` + `.sty` + figure files.
- Compiled `.pdf`.
- Metadata file (`title.tex`, `abstract.tex`, `keywords.tex`).
- `README.md` describing file structure.

**Completion criterion:** package saved; all files present.

## Fixtures

- **Compile test** — fixture confirming the `.tex` compiles cleanly with REVTeX 4.2f and produces a PDF.
- **Class option test** — fixture validating the class option (prl, prx, prb, etc.) against the target journal and REVTeX 4.2f.
- **Package version test** — fixture confirming REVTeX 4.2f is required and recorded; no 3.x / 4.1 usage without justification.
- **Line-length test** — fixture confirming no source line exceeds 80 characters.
- **Citation test** — fixture confirming `apsrev4-2` bibliography style is used and all citations resolve.

## Completion

- the skill's completion criteria are explicitly checked
- the artifact is saved and validated
- any blockers or skipped validations are documented
- the next consumer is identified or the work is handed off
---
@include .agents/skills/platform/contract-base.xml
## Reproducibility, Evidence, and Stop Conditions

- **Domain boundary:** Apply this contract specifically to writing-revtex: manuscrito reproducible, referencias, figuras accesibles y licencia. Do not claim execution, measurement, publication, peer review, or tool output unless supplied as evidence.
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
