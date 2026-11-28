---
name: "design-system"
category: "frontend"
maturity: "stable"
version: "1"
description: "Define and evolve reusable UI tokens, components, and usage rules as a coherent system."
license: "MIT"
capabilities:
  - apply design system methods within explicit frontend boundaries
  - analyze define and evolve reusable ui tokens, components, and usage rules as a coherent system with assumptions, constraints, and failure modes
  - produce and validate a frontend artifact with evidence, decisions, and next steps
inputs:
  - type: object
    description: UI requirements, component inventory, target platforms, brand context, accessibility/privacy constraints, deterministic fixtures, and performance budgets.
outputs:
  - type: object
    description: Token definitions, component contracts, usage rules, browser/accessibility fixture matrix, and performance/privacy guardrails.
sideEffects: []
dependencies: []
stopCondition: "Tokens, component contracts, compatibility targets, fixtures, accessibility/privacy guardrails, and budgets are explicit; artifact saved; completion criteria checked."
risk: "low"
trustTier: "1"
maxIterations: "6"
promptVersion: "2.0"
artifactType: "plan"
modelTier: "reasoning"
evaluators: ["behavioral", "regression"]
fixturesPath: ""
diataxis: "how-to"
tags: ["frontend"]
compatibility: [design-tokens, web-components-or-react, browser-matrix, a11y, privacy-manifest]
approvalRequired: "false"
approvalFor: []
---

## Contract

- Input: UI requirements, component inventory, and brand context.
- Output: token guidance, component guidance, and usage rules.
- Scope: stay within the skill's declared boundaries; do not broaden without explicit direction.
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

Emit `DesignSystemArtifact` as both:
- JSON: `.agents/skills/platform/artifacts/design-system/{identifier}.json`
- Markdown view: same filename with `.md` extension


# Design System

Use this skill when UI work starts to repeat and needs a shared system rather than one-off styling. It should define the reusable tokens, components, and usage rules that keep the frontend coherent as it grows.


## Why

A design system prevents drift by making the shared token and component decisions explicit and reviewable. Without it, teams repeat patterns, diverge on spacing and color, and accessibility regresses silently.

## Steps

1. Find repeated UI patterns and naming collisions.
2. Define the minimum token set that carries the brand.
3. Identify which components should be shared and which should stay local.
4. Write the rules that keep the system coherent over time. Record the design decision traceId and link the artifact to the originating issue so reviewers can replay the rationale.

## Completion

- the skill's completion criteria are explicitly checked
- the artifact is saved and validated
- any blockers or skipped validations are documented
- the next consumer is identified or the work is handed off
---
@include .agents/skills/platform/contract-base.xml
## Modern Target Contract

- Declare browser, input-modality, reduced-motion, forced-colors, dark-mode, localization, and host targets without inventing versions.
- Specify server/client ownership for token delivery, cache boundaries for remote content, and graceful fallback for unsupported CSS or interaction APIs.
- Create deterministic component fixtures for every state, breakpoint/theme, keyboard flow, accessible name, contrast check, and privacy-sensitive rendering.
- Set budgets for CSS, fonts, images, rendering, and animation; stop on an accessibility invariant or budget violation.
