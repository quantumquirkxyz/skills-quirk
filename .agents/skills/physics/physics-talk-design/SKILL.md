---
name: "physics-talk-design"
category: "physics"
maturity: "stable"
version: "2"
description: "Design physics talks — seminars, conference presentations, posters, public outreach — with audience-level adjustments, timing, visual conventions, and accessibility."
license: "MIT"
capabilities:
  - apply physics talk design methods within explicit physics boundaries
  - analyze design physics talks — seminars, conference presentations, posters, public outreach — with audience-level adjustments, timing, visual conventions, and accessibility with assumptions, constraints, and failure modes
  - produce and validate a physics artifact with evidence, decisions, and next steps
outputs: "source + notes + checklist."
sideEffects: []
dependencies: []
stopCondition: "Source compiled; notes saved; checklist completed."
risk: "low"
trustTier: "1"
maxIterations: "5"
promptVersion: "2.0"
artifactType: "plan"
modelTier: "reasoning"
evaluators: ["behavioral", "regression"]
fixturesPath: "tests/skill-output-migration-physics.test.mjs"
diataxis: "how-to"
tags: ["physics"]
compatibility: ["physics-writing-revtex", "physics-paper-collaboration"]
approvalRequired: "false"
approvalFor: []
---

## Contract

- Input: talk/poster topic, audience, duration / size.
- Output: source + notes + checklist.
- Scope: prepares talk/poster; does not deliver it.
- Rule: prepares talk/poster; does not deliver it.
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

Emit `PhysicsTalkDesignArtifact` as both:
- JSON: `.agents/skills/platform/artifacts/physics-talk-design/{identifier}.json`
- Markdown view: same filename with `.md` extension


# Physics Talk Design

Build a **physics talk or poster** — seminar, conference talk, public outreach — with audience-appropriate depth and visual conventions.

## When to use

- A seminar or conference talk needs slides.
- A poster needs layout, figure arrangement, and colour rules.
- A public talk needs a reduced-depth version.

## Process

### 1. Audience and duration

- **Audience:** specialist / cross-disciplinary / student / public.
- **Duration:** 15 min / 30 min / 50 min / 90 min.
- **Format:** talk / poster / panel / public lecture.

**Completion criterion:** audience and format explicit.

### 2. Structure

Standard talk structure:

- **Hook:** why should this audience care? (1 minute).
- **Context:** what is known; what is missing. (2 minutes).
- **Method / model:** the approach (technical for specialists; conceptual for students). (3–5 minutes).
- **Result:** clear statement with figure. (3–5 minutes).
- **Interpretation:** what does this mean? (2 minutes).
- **Conclusion / take-away:** one sentence. (1 minute).

**Completion criterion:** structure saved; timing targets set.

### 3. Figures and conventions

Physics conventions:

- **Units:** always on axes (e.g. "Energy (eV)").
- **Error bars:** visible and labelled (statistical, systematic).
- **Colour:** distinguishable in grayscale; use pattern or line style for colour-blind readers.
- **Scale:** logarithmic / linear stated; avoid misleading truncation.
- **Reference lines:** dashed for theoretical predictions; solid for data.

**Completion criterion:** all figures comply with conventions; accessibility checklist filled.

### 4. Colour accessibility

- **WCAG 2.1 AA contrast:** text and figures meet at least 4.5:1 contrast against background (3:1 for large text); graphics and UI components meet 3:1.
- **No colour-only signalling:** never encode meaning by colour alone; add pattern, line style, marker shape, or text labels.
- **Colour-blind simulation:** check figures against common colour blindness (protanopia, deuteranopia, tritanopia).
- **Grayscale check:** confirm figures remain readable when printed in black and white.

**Completion criterion:** contrast targets met; no colour-only encodings remain.

### 5. Poster design

- **Layout:** title, abstract, result figure, conclusion, references.
- **Flow:** top-to-bottom, left-to-right; highlight result in centre.
- **Font size:** readable from 1.5 m (min 18pt for body, 36pt for headings).
- **Colour:** consistent theme; avoid red-green only combinations.
- **QR code:** link to paper / data / arXiv.

**Completion criterion:** poster layout saved; readability checked.

### 6. Speaker notes

For each slide:

- **Key message:** one sentence the audience should take away.
- **Timing target:** planned seconds / minutes for the slide.
- **Transition cue:** what the next slide answers.
- **Q/A:** anticipated question and prepared answer.

**Completion criterion:** notes saved for each slide; timing totals match duration.

### 7. Audience-level adjustments

- **Terminology:** define specialist terms for students / public; use precise notation for specialists.
- **Notation recaps:** restate symbols and units before reuse.
- **Proof depth:** full derivation for specialists; sketch / statement-only for students and public.
- **Pacing:** slower and more repetition for student / public audiences; tighter for specialists.

**Completion criterion:** audience-level settings documented; notes reflect adjustments.

### 8. Compilation

- Compile the source (LaTeX Beamer, PowerPoint, Keynote, or Markdown-based tooling).
- Verify no missing references, broken links, or overflowing text.
- Render to PDF and inspect each slide visually.

**Completion criterion:** source compiles cleanly; PDF rendered.

## Fixtures

- **Colour accessibility** — fixture with expected contrast ratios (≥4.5:1 text, ≥3:1 graphics/UI) and confirmation no encoding relies on colour alone.
- **Compilation** — fixture confirming the source compiles without errors and a PDF is produced.
- **Audience-level** — fixture verifying terminology definitions, notation recaps, proof depth, and pacing match the declared audience level.

## Completion

- the skill's completion criteria are explicitly checked
- the artifact is saved and validated
- any blockers or skipped validations are documented
- the next consumer is identified or the work is handed off
---
@include .agents/skills/platform/contract-base.xml
## Reproducibility, Evidence, and Stop Conditions

- **Domain boundary:** Apply this contract specifically to talk-design: narrativa, citas, accesibilidad visual y divulgación responsable. Do not claim execution, measurement, publication, peer review, or tool output unless supplied as evidence.
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
