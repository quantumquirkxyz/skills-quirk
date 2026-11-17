---
name: "math-presentation-beamer"
category: "math"
maturity: "stable"
version: "1"
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
fixturesPath: ""
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


# 
# 
# Math Presentation — Beamer and Design

Build a **Beamer presentation** that communicates the mathematics clearly to the audience, with accessible design and speaker-ready notes.

## When to use

- A seminar, conference talk, or lecture needs a structured slide set.
- Figures need to be accurate, consistent, and accessible.
- The speaker wants timing and transition notes.

## Process

### 1. Define the audience and duration

- **Audience level** — general mathematician / specialist / student / public.
- **Duration** — 15 min / 30 min / 50 min / 90 min.
- **Goal** — inform / persuade / teach / review.

**Completion criterion:** audience and goal explicit.

### 2. Structure the slides

- **Title + outline** (first 2 minutes).
- **Motivation / context** (why does this matter to this audience?).
- **Statement / result** (clear, with hypotheses).
- **Proof / construction** (key steps, with citations).
- **Application / consequence** (what changes now?).
- **References / acknowledgements.**

**Completion criterion:** structure saved; each section has a clear purpose.

### 3. Figures and diagrams

- Use TikZ for mathematical figures; keep style consistent.
- Colour: avoid colour-only signalling; use patterns / shapes.
- Font size: readable from the back of the room (min 16pt for body, 20pt for headings).
- Alt-text for each figure (description for screen readers).

**Completion criterion:** all figures have alt-text; colour accessibility checked.

### 4. Speaker notes

For each slide, write:

- **Key message** in 1 sentence.
- **Timing target** (e.g. "2 minutes").
- **Transition cue** ("Next: we show the main theorem...").
- **Common question / answer** (if this slide confuses someone).

**Completion criterion:** notes saved for each slide.

### 5. Compile and check

- Compile the `.tex`; fix errors.
- Print / preview; verify that no content overflows.
- Check timing by reading aloud (target pace: ~2 minutes per major slide).

**Completion criterion:** compiled PDF; timing verified; overflow checked.

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
