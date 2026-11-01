---
name: code-review
category: delivery
maturity: stable
version: 3
description: Analyze a repository or requested code scope for logical correctness, behavior, architecture, risks, and maintainability, returning evidence-backed findings without editing source files.
license: MIT
capabilities:
  - verify logic against the user's stated objective
  - produce an evidence-backed repository audit artifact
  - trace code review decisions across inputs, constraints, and failure paths
  - validate delivery outcomes with evidence, assumptions, and explicit next steps
inputs:
  - user objective or review question
  - repository path and optional scope
  - optional specification, issue, or acceptance criteria
  - repository context and standards sources
outputs:
  - type: object
    name: RepositoryAuditArtifact
    properties:
      scope: { type: string }
      objective: { type: string }
      inspected: { type: array, items: { type: string } }
      findings: { type: array, items: { type: object } }
      summary: { type: object }
      limitations: { type: array, items: { type: string } }
      nextConsumer: { type: string }
    required: [scope, objective, findings, summary, limitations]
sideEffects:
  - post-pr-comment
dependencies: []
stopCondition: Repository or scoped audit complete; evidence-backed structured result returned; limitations and completion criteria checked.
risk: medium
trustTier: 3
maxIterations: 6
modelTier: reasoning
promptVersion: "3.0"
artifactType: repository-audit
evaluators: [behavioral, regression, review-effectiveness]
fixturesPath: .agents/skills/platform/fixtures/regression/code-review.json
diataxis: how-to
tags: [delivery, audit, logic, architecture, quality]
compatibility: [diagnosing-bugs, testing, project-viability, improve-codebase-architecture]
approvalRequired: true
approvalFor: ["post-pr-comment"]
clauses:
  - id: CODE-REVIEW-1
    text: "Establish repository context and the user's objective before judging code, and inspect the complete requested scope rather than assuming a diff is sufficient."
    check: "evals/behavioral/code-review.json#CODE-REVIEW-1"
  - id: CODE-REVIEW-2
    text: "Stay read-only: never edit source files, fix the repository, rewrite history, or merge changes."
    check: "evals/behavioral/code-review.json#CODE-REVIEW-2"
  - id: CODE-REVIEW-3
    text: "Separate confirmed defects, risks, improvements, and evidence gaps; never present an unverified inference as a defect."
    check: "evals/behavioral/code-review.json#CODE-REVIEW-3"
  - id: CODE-REVIEW-4
    text: "Every finding cites concrete repository evidence and explains its logical impact; documented project standards take precedence over generic heuristics."
    check: "evals/behavioral/code-review.json#CODE-REVIEW-4"
reloadPolicy: on-trigger
---

## Contract

- **Input:** user objective, repository path, optional scope, and optional specification or acceptance criteria.
- **Output:** `RepositoryAuditArtifact`, validated against `.agents/skills/platform/schemas/repository-audit-schema.json`.
- **Scope:** read-only analysis; do not edit source files, rewrite history, or apply fixes.
- **Rule:** inspect context, entrypoints, relevant modules, tests, configuration, and documentation before concluding.
- **Rule:** classify each finding as `confirmed-defect`, `risk`, `improvement`, or `evidence-gap`.
- **Rule:** if the requested scope is too large, report inspected boundaries and limitations instead of claiming full coverage.

## Process

1. Read `CONTEXT.md`, repository `AGENTS.md`, ADRs, package manifests, and project entrypoints.
2. Translate the user's request into an explicit objective and scope.
3. Build a repository map: applications, libraries, services, data flows, external boundaries, tests, scripts, and configuration.
4. Trace relevant behavior end to end. For a full audit, prioritize public entrypoints, critical paths, failure paths, persistence, integrations, and startup/build paths.
5. Compare behavior with the objective, specifications, documented conventions, and observable contracts.
6. Inspect tests and identify uncovered behavior, weak assertions, and regression risks.
7. Report findings with severity, kind, exact location, evidence, impact, cause when supported, and recommendation.
8. State inspected areas, uninspected areas, assumptions, and limitations.
9. Validate the structured result against the repository-audit schema before returning it.

## Finding standard

Do not call something a defect because it looks unfamiliar. A confirmed defect needs code evidence and a demonstrated or logically necessary broken behavior. Risks and improvements must be labelled separately. Explain why the finding matters and how it relates to the user's objective.

## Boundaries

- This skill does not modify source code or implement fixes.
- This skill does not require a branch, fixed point, or diff.
- Pull-request comparison against a base branch belongs to `review-pr`.
- Deep security, performance, frontend, backend, and testing investigations should hand off to specialist skills when appropriate.

## Completion

- objective and scope are explicit;
- inspected areas are listed;
- findings cite evidence and logical impact;
- confirmed defects are distinguished from risks and improvements;
- limitations are documented;
- `RepositoryAuditArtifact` is returned and schema-validated;
- no source files are changed.

## Artifact

Return `RepositoryAuditArtifact` as structured output in the current response. Do not write local artifact files unless the user explicitly asks for an export.

---
@include .agents/skills/platform/contract-base.xml
