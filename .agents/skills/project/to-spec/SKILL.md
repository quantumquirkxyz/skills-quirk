---
name: to-spec
category: project
maturity: stable
version: 1
description: Turn the current conversation into a spec and publish it to the project issue tracker - no interview, just synthesis of what is already known.
capabilities:
  - apply to spec workflow
  - produce to spec artifact
  - validate to spec completion criteria
outputs:
  - type: object
    description: To Spec artifact with findings, decisions, recommendations, and validation notes
    properties:
      spec:
        type: object
        properties:
          title:
            type: string
          goals:
            type: array
            items:
              type: string
          nonGoals:
            type: array
            items:
              type: string
          acceptanceCriteria:
            type: array
            items:
              type: string
          risks:
            type: array
            items:
              type: string
          decisions:
            type: array
            items:
              type: object
              properties:
                decision:
                  type: string
                rationale:
                  type: string
          validationNotes:
            type: array
            items:
              type: string
        required:
          - title
          - goals
          - acceptanceCriteria
      trackerMeta:
        type: object
        properties:
          issueNumber:
            type: integer
          labels:
            type: array
            items:
              type: string
          milestone:
            type: string
      completionCriteriaMet:
        type: boolean
modelTier: reasoning
promptVersion: "2.0"
artifactType: spec
evaluators:
  - behavioral
  - regression
  - traceability
  - quality-bar
fixturesPath: .agents/skills/platform/fixtures/behavioral/to-spec.json
diataxis: how-to
tags: [project, spec, planning, documentation]
compatibility: [to-tickets, grill-with-docs]
approvalRequired: false
approvalFor: []
sideEffects:
  - create-issue
dependencies: []
stopCondition: Turn the current conversation into a spec and publish it to the project issue tracker - no interview, just synthesis of what is already known complete; artifact saved; completion criteria checked.
risk: medium
trustTier: 3
maxIterations: 6
---

## Contract

- **Input:** current conversation context, codebase understanding, and repo conventions.
- **Output:** one published spec issue plus the implementation and testing decisions that make the work buildable.
- **Scope:** synthesize what is already known; do not reopen discovery interviews.
- **Rule:** prefer one seam, and make any seam choice explicit before publishing.
- **Rule:** frame the work in terms of this repo's concepts where relevant: context, harness, loop, graph, data plane, execution plane, observability, and safety boundaries.
- **Rule:** if the spec cannot be made concrete enough to hand off, stop and say what is still missing.

## Provenance

| Quality-Bar Question | Evidence |
|---|---|
| **Intent** | Turn the current conversation into a spec and publish it to the project issue tracker - no interview, just synthesis of what is already known. |
| **Input** | current conversation context, codebase understanding, and repo conventions. |
| **Output** | one published spec issue plus the implementation and testing decisions that make the work buildable. |
| **Side effects** | create-issue. |
| **Boundaries** | synthesize what is already known; do not reopen discovery interviews. |
| **Completion criteria** | problem and solution stated from the user's perspective; implementation decisions concrete enough to guide ticketing; testing decisions identify external behavior and intended seam; scope and out-of-scope items explicit; spec published with tracker defaults applied. |

## Artifact

This skill emits a structured spec artifact (JSON) and a Markdown spec body. The JSON is the machine-readable contract; the Markdown is the published tracker issue. Both are emitted atomically so they stay in sync.

This skill takes the current conversation context and codebase understanding and produces a spec (you may know this document as a PRD). Do NOT interview the user — just synthesize what you already know. Write the published issue body in English, and use the this repo's vocabulary consistently.

The issue tracker and triage label vocabulary should have been provided to you — run `/setup-quirk-skills` if not.
The canonical work-item metadata shape is documented in [`docs/agents/work-item-format.md`](../../../../docs/reference/agents/work-item-format.md); follow it for labels, milestone, project, fields, and todo/acceptance structure.

## Process

1. Build a minimal fresh context pack before broad exploration. Route the task against declared capabilities so the work shape is explicit before you draft the spec. Use the project's domain glossary vocabulary throughout the spec, and respect any ADRs in the area you're touching.

2. Sketch out the seams at which you're going to test the feature. Existing seams should be preferred to new ones. Use the highest seam possible. If new seams are needed, propose them at the highest point you can. The fewer seams across the codebase, the better - the ideal number is one.

Check with the user that these seams match their expectations.

3. Write the spec using `references/spec-template.md`, then publish it to the project issue tracker. Apply the repo defaults from `docs/agents/issue-tracker.md`: for this repo that means labels `spec` plus `ready-for-agent` - no need for additional triage. The entire published issue, including headings, user stories, and notes, must be in English. Also apply the work-item format defaults: set the milestone when one is known, add the issue to the matching project board when relevant, and keep the todo/acceptance content aligned with the metadata.

The template shape still needs the familiar sections that make specs ticket-ready:

- Goals
- Non-goals
- Acceptance Criteria
- Risks and Open Questions

Professional spec standard: the template must be compact, traceable, and ticket-ready. Do not leave placeholder text in the published issue. Use `TBD` only when the unknown is explicitly accepted as an open question.

## Completion criteria

- the problem and solution are stated from the user's perspective
- implementation decisions are concrete enough to guide ticketing
- testing decisions identify external behavior and the intended seam
- scope and out-of-scope items are explicit
- the spec is published with the tracker defaults applied

See `references/spec-template.md` for the canonical shape.

---
@include .agents/skills/platform/contract-base.xml
