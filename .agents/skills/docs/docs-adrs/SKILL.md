---
name: docs-adrs
category: "docs"
maturity: stable
version: 1
description: Create and maintain Architecture Decision Records — context, decision, consequences, alternatives, status — with periodic review.
license: MIT
capabilities:
  - produce docs adrs analysis artifact
  - validate docs adrs completion criteria
  - trace docs adrs decisions across inputs, constraints, and failure paths
  - validate docs outcomes with evidence, assumptions, and explicit next steps
outputs:
  - type: object
    description: ADR document with completed sections and evidence
    properties:
      title:
        type: string
      number:
        type: integer
      date:
        type: string
      status:
        type: string
        enum: [proposed, accepted, deprecated, superseded]
      context:
        type: string
      decision:
        type: string
      consequences:
        type: array
        items:
          type: object
          properties:
            type:
              type: string
              enum: [positive, negative, neutral]
            description:
              type: string
      alternatives:
        type: array
        items:
          type: object
          properties:
            alternative:
              type: string
            reasonRejected:
              type: string
      links:
        type: array
        items:
          type: string
      reviewDate:
        type: string
      supersessionLinks:
        type: array
        items:
          type: string
      completionCriteriaMet:
        type: boolean
modelTier: reasoning
promptVersion: "2.0"
artifactType: adr
evaluators:
  - behavioral
  - regression
  - traceability
  - quality-bar
fixturesPath: .agents/skills/platform/fixtures/behavioral/docs-adrs.json
diataxis: how-to
tags: [docs, adr, architecture, decisions]
compatibility: [codebase-design, docs-management, grill-with-docs]
approvalRequired: false
approvalFor: []
sideEffects: []
dependencies: []
stopCondition: Create and maintain Architecture Decision Records complete; required sections present; completion criteria checked.
risk: low
trustTier: 1
maxIterations: 6
---

## Contract

- **Input:** architecture decision request, problem context, constraints, and available evidence.
- **Output:** a completed ADR document with context, decision, consequences, alternatives, status, and review cycle.
- **Scope:** record one decision per ADR; do not change systems unless explicitly authorized.
- **Rule:** write the decision as an active choice, not a vague preference.
- **Rule:** include rejected alternatives and the reason each lost.
- **Rule:** mark status and supersession links when a decision changes.
- **Rule:** keep consequences honest across benefits, costs, risks, and operational impact.

## Provenance

| Quality-Bar Question | Evidence |
|---|---|
| **Intent** | Create and maintain Architecture Decision Records — context, decision, consequences, alternatives, status — with periodic review. |
| **Input** | architecture decision request, problem context, constraints, and available evidence. |
| **Output** | a completed ADR document with context, decision, consequences, alternatives, status, and review cycle. |
| **Side effects** | none. |
| **Boundaries** | record one decision per ADR; do not change systems unless explicitly authorized. |
| **Completion criteria** | context, decision, alternatives, and consequences are present; status and date are explicit; links to related artifacts are included when available; review or supersession conditions are named. |

## Artifact

This skill emits a structured ADR document (JSON) and a Markdown ADR file. The JSON is the machine-readable decision record; the Markdown is the human-readable ADR narrative. Both are emitted together so the decision stays consistent across formats.

# ADR Creation

Create an **Architecture Decision Record** (context, decision, consequences, alternatives, status) with an explicit review cycle.

## When to use
- A significant architecture choice is made.
- The team needs a durable explanation of design.
- A decision needs to be revisited over time.

## Process
1. Title, number, date.
2. Status — proposed / accepted / deprecated / superseded.
3. Context — driving forces, constraints, alternatives considered briefly.
4. Decision — positive statement of what was chosen.
5. Consequences — positive, negative, neutral; risks and trade-offs.
6. Alternatives — listed with brief evaluation.
7. Links — related ADRs, PRs, docs.
8. Review — set a review date; document why it might be superseded.
9. Deliver — Markdown artifact in docs/adr/ directory with the full template.

## Rules

- Rule: record one decision per ADR.
- Rule: write the decision as an active choice, not a vague preference.
- Rule: include rejected alternatives and the reason each lost.
- Rule: mark status and supersession links when a decision changes.
- Rule: keep consequences honest across benefits, costs, risks, and operational impact.

## Completion Criteria

- context, decision, alternatives, and consequences are present
- status and date are explicit
- links to related artifacts are included when available
- review or supersession conditions are named

## Reproducibility and Decision Graph

- Emit a manifest with ADR ID, repository/ref digest, author/owner, date/time zone, evidence IDs, reviewed alternatives, validation commands, and artifact hash.
- Maintain a supersession graph: each `superseded` ADR links to exactly one successor, each successor links back to predecessors, cycles are invalid, and deprecated decisions retain historical rationale.
- Add deterministic and negative fixtures for missing context, duplicate numbers, invalid status transitions, broken links, cycles, and conflicting decisions. Unavailable evidence or checks are `NOT-RUN`.
- Keep an evidence ledger separating observed constraints, assumptions, decision, consequences, and inference. Link claims to source documents and review results; redact secrets and personal data from examples.

---
@include .agents/skills/platform/contract-base.xml
