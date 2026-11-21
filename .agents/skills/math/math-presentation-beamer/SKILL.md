---
name: "math-presentation-beamer"
category: "math"
maturity: "stable"
version: "2"
description: "Design mathematics presentations — Beamer slides with TikZ diagrams, colour accessibility, speaker notes, and audience-level adjustments — for seminars, conferences, or lectures."
license: "MIT"
capabilities:
  - apply math presentation beamer methods within explicit math boundaries
  - analyze design mathematics presentations — beamer slides with tikz diagrams, colour accessibility, speaker notes, and audience-level adjustments — for seminars, conferences, or lectures with assumptions, constraints, and failure modes
  - produce and validate a math artifact with evidence, decisions, and next steps
outputs: "Beamer source + speaker notes + accessibility checklist."
sideEffects: []
dependencies: []
stopCondition: "Source compiles; speaker notes saved; accessibility checklist completed; audience-level stated."
risk: "low"
trustTier: "1"
maxIterations: "5"
promptVersion: "2.0"
artifactType: "pull-request"
modelTier: "reasoning"
evaluators: ["behavioral", "regression"]
fixturesPath: "evals/behavioral/math-presentation-beamer.json"
fixtures:
  colour-accessibility:
    description: "Colour contrast WCAG AA; no colour-only signalling; patterns/shapes supplement colour"
    source: "WCAG 2.1 AA colour contrast"
  compilation:
    description: "Beamer source compiles cleanly with pdfLaTeX/XeLaTeX/LuaLaTeX; no overflow errors"
    source: "LaTeX compilation"
  audience-level:
    description: "Audience level stated and matched to slide content; terminology and pacing adjusted"
    source: "audience profile"
diataxis: "how-to"
tags: ["math"]
compatibility: []
approvalRequired: "false"
approvalFor: []
---

## Contract

- Input: talk content (topic, audience, duration), and any figures.
- Output: Beamer source + speaker notes + accessibility checklist.
- Scope: produces presentation artifacts; does not deliver the talk.
- Rule: produces presentation artifacts; does not deliver the talk.
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

Emit `MathPresentationBeamerArtifact` as both:
- JSON: `.agents/skills/platform/artifacts/math-presentation-beamer/{identifier}.json`
- Markdown view: same filename with `.md` extension


# Math Presentation — Beamer and Design

Build a **Beamer presentation** that communicates the mathematics clearly to the audience, with accessible design and speaker-ready notes.

## When to use

- A seminar, conference talk, or lecture needs a structured slide set.
- Figures need to be accurate, consistent, and accessible.
- The speaker wants timing and transition notes.

## Process

### 1. Define the audience and duration

- **Audience level** — general mathematician / specialist / student / public. State the level explicitly and record assumptions about prior knowledge.
- **Duration** — 15 min / 30 min / 50 min / 90 min.
- **Goal** — inform / persuade / teach / review.
- **Audience-level adjustments** — terminology, notation recaps, proof depth, and pacing tuned to the stated level; specialist content flagged for non-specialist audiences.

**Completion criterion:** audience and goal explicit; audience-level adjustments documented.

### 2. Structure the slides

- **Title + outline** (first 2 minutes).
- **Motivation / context** (why does this matter to this audience?).
- **Statement / result** (clear, with hypotheses).
- **Proof / construction** (key steps, with citations).
- **Application / consequence** (what changes now?).
- **References / acknowledgements.**

**Completion criterion:** structure saved; each section has a clear purpose.

### 3. Colour accessibility

- **Colour contrast** — WCAG 2.1 AA contrast ratios for text/background (minimum 4.5:1 normal text, 3:1 large text).
- **No colour-only signalling** — never convey information by colour alone; combine colour with patterns, shapes, line styles, or labels.
- Use colourblind-safe palettes (e.g. ColorBrewer, viridis); test in grayscale.
- Alt-text for each figure (description for screen readers).
- Font size readable from the back of the room (min 16pt body, 20pt headings).

**Completion criterion:** colour accessibility checked; all figures have alt-text.

### 4. Figures and diagrams

- Use TikZ for mathematical figures; keep style consistent.
- Colour: avoid colour-only signalling; use patterns / shapes.
- Font size: readable from the back of the room (min 16pt for body, 20pt for headings).
- Alt-text for each figure (description for screen readers).

**Completion criterion:** figures consistent; colour accessibility checked.

### 5. Speaker notes

For each slide, write:

- **Key message** in 1 sentence.
- **Timing target** (e.g. "2 minutes").
- **Transition cue** ("Next: we show the main theorem...").
- **Common question / answer** (if this slide confuses someone).

**Completion criterion:** notes saved for each slide; timing totals match declared duration.

### 6. LaTeX compilation

- Compile the `.tex` with pdfLaTeX / XeLaTeX / LuaLaTeX; fix all errors and warnings.
- Check for overfull boxes and content overflow.
- Verify embedded fonts and correct page geometry.
- Produce a compiled `.pdf` artifact alongside the source.

**Completion criterion:** compiled PDF; zero errors; overflow checked.

### 7. Compile and check

- Print / preview; verify that no content overflows.
- Check timing by reading aloud (target pace: ~2 minutes per major slide).
- Verify speaker notes render in notes pages or secondary display.

**Completion criterion:** compiled PDF; timing verified; overflow checked; notes render.

## Notes

- Pair with `math-paper-collaboration` for sharing .tex source.
- Use `math-formal-proof` for appendix slides that cite a verified proof.

## Completion

- the skill's completion criteria are explicitly checked
- the artifact is saved and validated
- any blockers or skipped validations are documented
- the next consumer is identified or the work is handed off
---
@include .agents/skills/platform/contract-base.xml
## Reproducibility, Evidence, and Stop Conditions

- **Domain boundary:** Apply this contract specifically to presentation-beamer: theorem/figure accessibility, source citations and reproducible compilation; do not invent computation, literature access, proof checking, or compilation.
- **Provenance and licensing:** Record source/version/date, transformations, dependencies, authorship, citation, license, and redistribution limits; separate supplied facts from derived claims and protect private collaborator data.
- **Reproducibility manifest:** Include exact inputs, notation/schema, parameters, software versions, seeds, commands or pseudocode, and hashes. Missing evidence remains `unknown`.
- **Fixtures:** Declare a  with expected value/proof and tolerance, plus a /negative case. These are test specifications, not claims of execution.
- **Uncertainty and proof:** State assumptions, error bounds, conditioning, tolerances and confidence convention. Attach proof obligations and formal proof artifacts when available; otherwise label reasoning `informal`.
- **Accessible output:** Use semantic headings, readable equations/tables, text alternatives, descriptive captions, high contrast and a plain-language summary.
- **Stop conditions:** Stop as / if a definition, oracle, tolerance, proof artifact, provenance, license, privacy boundary, or required input is missing, contradictory, outside validity bounds, or would require unobserved execution.

## Validation Record

Return `status` (`planned`, `observed`, `validated`, `uncertain`, or `blocked`), manifest, fixture expectations, assumptions, tolerances, proof obligations, accessibility/privacy/licensing checks, and explicit unknowns.
