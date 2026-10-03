---
name: work-item-router
category: routing
maturity: stable
version: 1
description: Force reading the canonical work-item governance index before routing specs, tickets, project boards, or publication flows.
capabilities:
  - apply work item router workflow
  - produce work item router artifact
  - validate work item router completion criteria
outputs:
  - type: object
    description: Routing decision artifact identifying downstream skill and governance documents
    properties:
      governanceIndexRead:
        type: boolean
      requestType:
        type: string
        enum: [spec, ticket, spec-audit, ticket-audit, corrective-ticket, project-board, pr-publication, review-fix-plan, closeout]
      downstreamSkill:
        type: string
      requiredMetadataContracts:
        type: array
        items:
          type: string
      notes:
        type: string
      completionCriteriaMet:
        type: boolean
modelTier: router
promptVersion: "2.0"
artifactType: plan
evaluators:
  - behavioral
  - regression
  - traceability
  - quality-bar
fixturesPath: .agents/skills/platform/fixtures/behavioral/work-item-router.json
diataxis: how-to
tags: [routing, governance, work-items, triage]
compatibility: [ask-to, to-spec, to-tickets, make-project]
approvalRequired: false
approvalFor: []
sideEffects: []
dependencies: []
stopCondition: Force reading the canonical work-item governance index before routing specs, tickets, project boards, or publication flows complete; artifact saved; completion criteria checked.
risk: low
trustTier: 1
maxIterations: 6
---

## Contract

- **Input:** a request involving specs, tickets, spec/ticket audits, projects, PR metadata, or review-fix comments.
- **Output:** a routing note that identifies the downstream skill and the relevant governance documents.
- **Scope:** routing only. Do not draft the artifact here.
- **Rule:** always read `docs/agents/index.md` first.
- **Rule:** prefer the canonical work-item format over ad hoc tracker metadata.
- **Rule:** route to the thinnest downstream skill that can finish the work.

## Provenance

| Quality-Bar Question | Evidence |
|---|---|
| **Intent** | Force reading the canonical work-item governance index before routing specs, tickets, project boards, or publication flows. |
| **Input** | a request involving specs, tickets, spec/ticket audits, projects, PR metadata, or review-fix comments. |
| **Output** | a routing note that identifies the downstream skill and the relevant governance documents. |
| **Side effects** | none. |
| **Boundaries** | routing only. Do not draft the artifact here. |
| **Completion criteria** | governance index has been read; downstream skill is named; any required metadata contract is explicit. |

## Artifact

This skill emits a structured routing decision (JSON) and a Markdown routing note. The JSON is the machine-readable decision record; the Markdown is the human-readable routing narrative. Both are emitted together so the routing trail is auditable.

This skill routes only. It does not create issues, tickets, PRs, or project items.

# Work Item Router

Use this skill before `to-spec`, `to-tickets`, or `make-project` when the task involves tracker metadata, project boards, or publication flow.

## Workflow

1. Read `docs/agents/index.md`.
2. Identify whether the request is a spec, ticket, spec completion audit, ticket coverage audit, corrective ticket publication, project board, PR publication, review-fix plan, or closeout.
3. Route to the thinnest downstream skill that can finish the work.
4. If metadata is involved, preserve the canonical shape from `docs/agents/work-item-format.md`.

## Completion criteria

- the governance index has been read
- the downstream skill is named
- any required metadata contract is explicit

---
@include .agents/skills/platform/contract-base.xml
