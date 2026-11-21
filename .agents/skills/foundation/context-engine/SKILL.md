---
name: "context-engine"
category: "foundation"
maturity: "stable"
description: "Manage dynamic context for agent execution using retrieval-augmented generation patterns, updating the working context from sources beyond static CONTEXT.md (issues, PRs, docs, execution traces)."
license: "MIT"
version: "1"
capabilities:
  - apply context engine methods within explicit foundation boundaries
  - analyze manage dynamic context for agent execution using retrieval-augmented generation patterns, updating the working context from sources beyond static context.md (issues, prs, docs, execution traces) with assumptions, constraints, and failure modes
  - produce and validate a foundation artifact with evidence, decisions, and next steps
inputs:
  type: object
  name: ContextEngineInput
  properties:
    query: { type: string, description: "Question or task that determines context selection" }
    sources:
      type: array
      items:
        type: object
        properties:
          id: { type: string }
          locator: { type: string }
          kind: { type: string, enum: [file, issue, pull-request, document, trace] }
        required: [id, locator, kind]
    freshnessPolicy:
      type: object
      properties:
        maxAgeSeconds: { type: integer, minimum: 0 }
        requireValidation: { type: boolean }
      required: [requireValidation]
    contextBudget:
      type: object
      properties:
        maxSources: { type: integer, minimum: 1 }
        maxTokens: { type: integer, minimum: 1 }
        maxIterations: { type: integer, minimum: 1 }
      required: [maxSources, maxTokens]
  required: [query, sources, freshnessPolicy, contextBudget]
outputs:
  - type: object
    name: ContextEngineArtifact
    properties:
      contextPack: { type: object }
      selectedSources: { type: array, items: { type: string } }
      excludedSources: { type: array, items: { type: string } }
      provenance: { type: object }
      freshness: { type: object }
      blockers: { type: array, items: { type: string } }
      validation: { type: object }
    required: [contextPack, selectedSources, excludedSources, provenance, freshness, blockers, validation]
sideEffects:
  - write-files
dependencies:
  - context-pack
  - agent-memory
  - agent-observability
stopCondition: "A ContextEngineArtifact is validated and emitted, or a terminal state is recorded: completed, blocked, stale-input, validation-failed, or budget-exceeded."
risk: "low"
trustTier: "2"
maxIterations: "5"
promptVersion: "2.0"
artifactType: "foundation"
modelTier: "fast"
evaluators: ["behavioral", "regression"]
fixturesPath: .agents/skills/platform/fixtures/behavioral/context-engine.json
diataxis: "how-to"
tags: ["foundation"]
compatibility: []
approvalRequired: "true"
approvalFor: ["write-files"]
---

## Critical Rules

- Accept only the typed `ContextEngineInput`; reject missing query, source identity, freshness policy, or context budget before retrieval.
- Stay within the caller's declared source list and context budget; never broaden access or silently exceed either boundary.
- Validate freshness before selection. Sources with unknown or exceeded freshness are excluded and recorded in `excludedSources` and `freshness`.
- Attribute every retained fact to a selected source. Do not fabricate sources or resolve conflicts by guessing.
- Emit `ContextEngineArtifact` only after schema validation. Write the JSON artifact and Markdown view to the declared artifact destination using `write-files`; approval is required for that write.
- Record exactly one terminal state: `completed`, `blocked`, `stale-input`, `validation-failed`, or `budget-exceeded`.
- Surface blockers before proceeding when required context or an operational dependency is unavailable.

## Contract

- Input: a typed `ContextEngineInput` containing query, source list, freshness policy, and context budget.
- Output: a validated `ContextEngineArtifact` containing contextPack, selectedSources, excludedSources, provenance, freshness, blockers, and validation.
- Scope: retrieve and synthesize caller-authorized context, then write only the declared JSON and Markdown artifact views.
- Rule: documented standards override defaults; explicit project rules take precedence.
- Rule: terminal state and validation evidence are part of every output, including blocked or rejected results.

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

Emit `ContextEngineArtifact` as both:
- JSON: `.agents/skills/platform/artifacts/context-engine/{identifier}.json`
- Markdown view: same filename with `.md` extension


# Context Engine


## Process
1. Parse query and identify relevant sources.
2. Retrieve content from sources (files, issues, PRs, traces).
3. Index and synthesize.
4. Detect changes since last index.
5. Validate the artifact, write both views, and record the terminal state.

## Guardrails
- Always attribute sources.
- Do not fabricate sources.
- Preserve original vocabulary from CONTEXT.md.
- Update index only with verified changes.
- Rule: Prefer primary repository artifacts over summaries when both are available.
- Rule: Record source freshness and whether the answer depends on potentially stale external state.
- Rule: Do not broaden source access beyond the caller's declared boundary without asking.
- Rule: If retrieval fails, return the missing source list instead of guessing.

## Output Shape

- `contextPack`: concise synthesis tied to exact source references, including index, changes, and answer.
- `selectedSources`: source IDs retained in the pack.
- `excludedSources`: source IDs excluded with reasons.
- `provenance`: source identity, retrieval time, and attribution links.
- `freshness`: policy, checks, and stale-source findings.
- `blockers`: missing context, dependency, or conflict blockers.
- `validation`: schema result, terminal state, and artifact paths.

## Completion

- the skill's completion criteria are explicitly checked
- the JSON and Markdown artifact views are saved and validated
- any blockers or skipped validations are documented
- the next consumer is identified or the work is handed off
---
@include .agents/skills/platform/contract-base.xml