---
name: review-pr
category: delivery
maturity: stable
version: 1
description: Review a pull request against the fixed point the user supplies, separating Standards and Spec findings into distinct axes.
license: MIT
capabilities:
  - apply review pr workflow
  - produce review pr artifact
  - validate review pr completion criteria
inputs:
  - fixed point reference (commit, branch, tag, or merge-base)
  - diff command
  - originating spec or issue reference
  - standards sources
outputs:
  - type: object
    description: Review findings artifact with Standards and Spec axes
    properties:
      fixedPoint:
        type: string
      diffCommand:
        type: string
      standards:
        type: array
        items:
          type: object
          properties:
            file:
              type: string
            line:
              type: integer
            hunk:
              type: string
            smellName:
              type: string
            severity:
              type: string
              enum: [hard-violation, judgement-call]
            explanation:
              type: string
      spec:
        type: array
        items:
          type: object
          properties:
            requirement:
              type: string
            status:
              type: string
              enum: [missing, partial, scope-creep, implemented-incorrectly]
            evidence:
              type: string
      summary:
        type: object
        properties:
          standardsFindings:
            type: integer
          specFindings:
            type: integer
          worstStandard:
            type: string
          worstSpec:
            type: string
      completionCriteriaMet:
        type: boolean
modelTier: reasoning
promptVersion: "2.0"
artifactType: review
evaluators:
  - behavioral
  - regression
  - traceability
  - quality-bar
fixturesPath: fixtures/behavioral/review-pr.json
diataxis: how-to
tags: [delivery, review, standards, spec, quality]
compatibility: [plan-review-fixes, ship-subissue, resolving-merge-conflicts]
approvalRequired: true
approvalFor: ["post-pr-comment"]
sideEffects:
  - post-pr-comment
dependencies: []
stopCondition: Review a pull request against the fixed point the user supplies, separating Standards and Spec findings into distinct axes complete; structured result returned; completion criteria checked.
risk: medium
trustTier: 3
maxIterations: 6
reloadPolicy: on-trigger
---

## Contract

- **Input:** a PR, diff, fixed point reference, and the originating spec if available.
- **Output:** a two-axis review report (Standards + Spec) with per-file findings and a summary line.
- **Scope:** publish findings only — do not change source files, fix the PR, or merge it.
- **Rule:** keep Standards and Spec axes separate so neither masks the other.
- **Rule:** every finding must include exact file/line, the rule or smell that justifies it, and a concrete explanation of what breaks.
- **Rule:** documented-standard breaches are hard; baseline smells are always judgement calls.

## Provenance

| Quality-Bar Question | Evidence |
|---|---|
| **Intent** | Review a pull request against the fixed point the user supplies, separating Standards and Spec findings into distinct axes. |
| **Input** | a PR, diff, fixed point reference, and the originating spec if available. |
| **Output** | a two-axis review report (Standards + Spec) with per-file findings and a summary line. |
| **Side effects** | may post PR review comments; no local files are written. |
| **Boundaries** | publish findings only — do not change source files, fix the PR, or merge it. |
| **Completion criteria** | fixed point pinned and diff non-empty; Standards findings cite documented standards or smell names; Spec findings quote the spec; review published; no merging or fixing. |

## Artifact

This skill returns a structured review report and, when reviewing a GitHub PR, publishes the review body to the PR. The artifact validates against `schema/review-findings-schema.json`.

## Completion

- fixed point is pinned and diff is non-empty
- Standards findings cite documented standards or smell names
- Spec findings quote the spec line for each requirement
- review is published to the PR (if GitHub) or returned as structured output
- no source files are changed, fixed, or merged
- `ReviewArtifact` returned as structured output and validated against `schema/review-findings-schema.json`
