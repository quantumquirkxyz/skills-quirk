---
name: "math-teaching-problem-set"
category: "math"
maturity: "stable"
version: "2"
description: "Design and grade math problem sets and exams — difficulty progression, rubric, anti-cheating variants, accessibility, and LaTeX layout."
license: "MIT"
capabilities:
  - apply math teaching problem set methods within explicit math boundaries
  - analyze design and grade math problem sets and exams — difficulty progression, rubric, anti-cheating variants, accessibility, and latex layout with assumptions, constraints, and failure modes
  - produce and validate a math artifact with evidence, decisions, and next steps
outputs: "LaTeX problem set + rubric + variants."
sideEffects: []
dependencies: []
stopCondition: "Problem-set + rubric + variants saved; difficulty progression documented."
risk: "low"
trustTier: "1"
maxIterations: "5"
promptVersion: "2.0"
artifactType: "pull-request"
modelTier: "reasoning"
evaluators: ["behavioral", "regression"]
fixturesPath: "evals/behavioral/math-teaching-problem-set.json"
fixtures:
  accessibility-check:
    description: "WCAG 2.1 AA compliance checked; ADA Title II deadline April 2027 noted"
    source: "WCAG 2.1 AA / ADA Title II"
  semantic-format-check:
    description: "Math rendered in MathML/MathJax/OMML, not images"
    source: "MathML / MathJax / OMML"
  anti-cheating-variant:
    description: "Variants provably distinct; no identical numerical answers across variants"
    source: "variant generation"
diataxis: "how-to"
tags: ["math"]
compatibility: ["math-paper-collaboration"]
approvalRequired: "false"
approvalFor: []
---

## Contract

- Input: topic(s), audience level, problem count.
- Output: LaTeX problem set + rubric + variants.
- Scope: produces teaching artifacts; no live grading.
- Rule: produces teaching artifacts; no live grading.
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

Emit `MathTeachingProblemSetArtifact` as both:
- JSON: `.agents/skills/platform/artifacts/math-teaching-problem-set/{identifier}.json`
- Markdown view: same filename with `.md` extension


# Math Teaching — Problem Sets and Exams

Design a **problem set or exam** that tests the right concepts at the right difficulty, with grading rules and exam-ready variants.

## When to use

- A course needs a problem set, midterm, or final.
- An instructor wants multiple variants for exam integrity.
- A grader needs a rubric with partial credit.

## Process

### 1. Define the scope

- **Course level** — undergrad / graduate / competition.
- **Topics** — explicit list of concepts to test.
- **Time** — exam length; per-problem estimate.
- **Allowed aids** — open-book, calculator, none.

**Completion criterion:** scope explicit.

### 2. Build difficulty progression

Order problems so each builds on the prior:

- **Tier 1 — recall:** definitions, standard computations.
- **Tier 2 — apply:** use a known method in a new setting.
- **Tier 3 — analyse:** choose a method, justify.
- **Tier 4 — synthesise / prove:** construct a new argument or counterexample.

Each problem tags its tier.

**Completion criterion:** tiers labelled; progression tested.

### 3. Generate variants

For each problem, generate **N variants** (default 4) by:

- Permuting numerical parameters within the same difficulty.
- Swapping roles (e.g. domain/codomain swap).
- Re-arranging order without changing difficulty.

Variants must be **provably distinct** (different numerical answer or different proof).

**Completion criterion:** N variants exist; distinctness argued.

### 4. Rubric

For each problem, write a rubric:

- **Total points.**
- **Per-step credit** — which sub-step earns how much.
- **Common mistakes** — and their deductions.
- **Proofs vs computation** — partial credit for partial proofs.
- **Segment-level evidence mapping** — each scoreable segment maps to the rubric line that justifies credit; grader records which segment earned which points.

**Completion criterion:** rubric saved with concrete point allocations; segment-to-evidence mapping complete.

### 5. Accessibility and layout

- Use LaTeX with semantic commands (`\theorem`, `\lemma`).
- Render math in a **semantic format** (MathML / MathJax / OMML), **not images**; equations are text, selectable, and screen-reader accessible.
- Add `alt` text for figures (TikZ).
- Avoid colour-only signalling.
- Meet **WCAG 2.1 AA** (contrast, focus order, semantic headings); note ADA Title II deadline **April 2027** for public-facing course materials.
- Provide a print-friendly PDF and a screen-reader-friendly version.

**Completion criterion:** accessibility checklist completed; semantic math confirmed; WCAG 2.1 AA checked.

## Notes

- Pair with `math-paper-collaboration` for sharing and versioning.
- Use Overleaf for collaborative editing; tag each term's set.

## Quality Gates

- Record SHA-256 hashes for source curriculum, problem data, solution code, LaTeX, fonts, and rendering environment; version each variant set.
- Check answer-key leakage, look-ahead to prior solutions, survivorship of examples, prior-exam contamination, demographic or language bias, accessibility barriers, and variant collisions before release.
- Report uncertainty in difficulty estimates using pilot intervals or calibrated item statistics; backtest scoring/rubrics against known learner solutions where available.
- Run known-solution fixtures and counterexamples for ambiguous wording, multiple valid proofs, malformed inputs, and tolerance-sensitive numeric answers; state grading tolerances.
- Accessibility fixture: verify WCAG 2.1 AA compliance (contrast, focus order, semantic headings, alt text); note ADA Title II deadline April 2027.
- Semantic format fixture: verify math renders as MathML / MathJax / OMML, not as images.
- Anti-cheating fixture: verify N variants are provably distinct (different numerical answers or different proofs).
- Minimize student personal data, document fairness/privacy limits, and protect accommodations and submissions, and state no-claims boundaries: assessment artifacts do not diagnose ability or replace educator judgment.
- Stop with `inconclusive` when hashes, fairness/accessibility, validation, or tolerance checks are missing; align artifact, rubric, validation status, and stop condition.

## Completion

- the skill's completion criteria are explicitly checked
- the artifact is saved and validated
- any blockers or skipped validations are documented
- the next consumer is identified or the work is handed off
---
@include .agents/skills/platform/contract-base.xml
## Reproducibility, Evidence, and Stop Conditions

- **Domain boundary:** Apply this contract specifically to teaching-problem-set: curriculum scope, item difficulty, rubric validity, variant distinctness, accessibility; do not invent computation, literature access, proof checking, or compilation.
- **Provenance and licensing:** Record source/version/date, transformations, dependencies, authorship, citation, license, and redistribution limits; separate supplied facts from derived claims and protect student data.
- **Reproducibility manifest:** Include exact inputs, notation/schema, parameters, software versions, seeds, commands or pseudocode, and hashes. Missing evidence remains `unknown`.
- **Fixtures:** Declare a  with expected value/proof and tolerance, plus a /negative case. These are test specifications, not claims of execution.
- **Uncertainty and proof:** State assumptions, error bounds, conditioning, tolerances and confidence convention. Attach proof obligations and formal proof artifacts when available; otherwise label reasoning `informal`.
- **Accessible output:** Use semantic headings, readable equations/tables, text alternatives, descriptive captions, high contrast and a plain-language summary.
- **Stop conditions:** Stop as / if a definition, oracle, tolerance, proof artifact, provenance, license, privacy boundary, or required input is missing, contradictory, outside validity bounds, or would require unobserved execution.

## Validation Record

Return `status` (`planned`, `observed`, `validated`, `uncertain`, or `blocked`), manifest, fixture expectations, assumptions, tolerances, proof obligations, accessibility/privacy/licensing checks, and explicit unknowns.
