---
name: project-viability
description: Evaluate whether a project is viable, functional, and scalable by analyzing its codebase against CONTEXT.md and ADRs. Use when the user wants a structured assessment of project health, architectural soundness, and growth boundaries before committing to further work.
capabilities:
  - apply project viability workflow
  - produce viability assessment artifact
  - validate project viability completion criteria
outputs:
  - Viability Assessment artifact with findings, decisions, recommendations, and validation notes
sideEffects:
  - write report file to .reports/
dependencies: []
stopCondition: Project viability, functionality, and scalability assessment is complete; artifact saved to .reports/; completion criteria checked.
risk: low
trustTier: 1
maxIterations: 6
---

## Operating Contract

- **Input:** Project viability request, repository context, CONTEXT.md, ADRs, and source evidence.
- **Output:** Viability Assessment artifact with findings, decisions, recommendations, and validation notes, saved to `.reports/`.
- **Side effects:** write report file to `.reports/`; do not edit source code or docs without explicit user direction.
- **Dependencies:** none beyond repository access.
- **Stop condition:** assessment complete; artifact saved to `.reports/`; completion criteria checked; user asked how to proceed.
- **Risk:** low — read-only analysis with a single report write.
- **Boundary:** stay within the declared scope; do not implement fixes, draft specs, or modify tracker state.

# Project Viability

Analyze whether the project is viable, functional, and scalable across logic, architecture, technical capacity, team maintainability, and domain growth. Ground every finding in `CONTEXT.md`, the ADRs under `docs/adr/`, and actual code evidence.

Three parallel sub-agents evaluate each dimension independently so findings do not pollute each other's context. This skill aggregates their outputs into a single Markdown report.

## Contract

- Input: repository with `CONTEXT.md`, ADRs, and source code.
- Output: one Markdown report under `.reports/` with layered findings and a prompt for the user.
- Scope: assess viability; do not refactor, implement, or alter project state beyond writing the report.
- Rule: every claim must cite `CONTEXT.md`, an ADR path, or a concrete code location.
- Rule: separate "missing" from "wrong" — distinguish undocumented behavior from contradicted behavior.
- Rule: after delivering the report, ask the user what to do next; do not take action autonomously.

## Steps

### 1. Gather context

Read `CONTEXT.md` and all files under `docs/adr/`. If `CONTEXT-MAP.md` exists, read it and resolve each mapped context. Record the domain vocabulary, stated goals, constraints, and recorded decisions.

### 2. Map the codebase

Identify the project shape: interactive app, batch pipeline, agentic system, library, backend service, or hybrid. Map the top-level structure, entry points, data flow, and external integrations. Note any seams between layers.

### 3. Spawn parallel sub-agents

Send a single message with three `Agent` tool calls using the `general-purpose` subagent type. Use the prompt templates in `references/subagent-prompts.md`. Include:

- The shared context gathered in steps 1 and 2.
- The viability brief.
- The functionality brief.
- The scalability brief.

Each sub-agent returns:
- A rating.
- Evidence list with citations.
- Conditions, missing items, or limiting factors as applicable.

### 4. Aggregate findings

Combine the three sub-agent outputs into a single report using the structure in `references/report-template.md`. Preserve each dimension's findings separately; do not merge or rerank across axes.

### 5. Write the report

Write the aggregated findings to `.reports/<YYYYMMDD>-viability.md`. Keep the report under 1200 words. Include:

- Executive summary with the three ratings.
- Evidence-backed findings per layer.
- Concrete recommendations for the highest-priority issue in each layer.

### 6. Ask the user what to do

After writing the report, present the path forward and ask the user to choose:

- Address the top findings via `/implement` or `/codebase-design`.
- Sharpen the project model via `/grill-with-docs` or `/domain-modeling`.
- Revisit ADRs via `/docs-management`.
- Abandon or pause the assessment.

Do not proceed without explicit user direction.

## Resources

### references/evaluation-criteria.md

Read this file when scoring viability, functionality, and scalability. It defines the rating thresholds and evidence expectations for each dimension.

### references/report-template.md

Use this template when writing the `.reports/<YYYYMMDD>-viability.md` file. It specifies the required sections and wording conventions.

### references/subagent-prompts.md

Use these prompts when spawning the three parallel sub-agents in step 3. Each prompt includes the shared context and a focused brief for one dimension.

## Completion Criteria

- the report exists at `.reports/<YYYYMMDD>-viability.md`
- all three layers (viability, functionality, scalability) are assessed with ratings
- every finding cites `CONTEXT.md`, an ADR, or a concrete code location
- the user has been asked how to proceed
- no source files were modified
