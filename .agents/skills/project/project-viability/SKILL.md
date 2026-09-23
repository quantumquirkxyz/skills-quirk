---
name: project-viability
description: Evaluate whether a project is viable, functional, and scalable by analyzing its codebase against CONTEXT.md and ADRs. Use when the user wants a structured assessment of project health, architectural soundness, and growth boundaries before committing to further work.
capabilities:
  - apply project viability workflow
  - produce viability assessment artifact
  - validate project viability completion criteria
  - produce structured JSON artifact for tooling
outputs:
  - Viability Assessment artifact with findings, decisions, recommendations, and validation notes
  - Structured JSON artifact for downstream consumption
sideEffects:
  - write report file to .reports/ only if quality gate passes
  - write JSON artifact to .reports/ only if quality gate passes
dependencies: []
stopCondition: Pre-flight checks resolved; automated baseline completed; three parallel sub-agents executed; quality gate passed; Viability Assessment saved to .reports/; JSON artifact saved; completion criteria verified; user asked how to proceed.
risk: low
trustTier: 1
maxIterations: 6
---

## Operating Contract

- **Input:** Project viability request, repository context, CONTEXT.md, ADRs, source evidence, and automated baseline.
- **Output:** Viability Assessment artifact with findings, decisions, recommendations, and validation notes, saved to `.reports/`. Structured JSON artifact saved to `.reports/`.
- **Side effects:** write report and JSON files to `.reports/` only if quality gate passes; do not edit source code or docs without explicit user direction.
- **Dependencies:** none beyond repository access.
- **Stop condition:** pre-flight checks resolved; automated baseline completed; quality gate passed; artifacts saved; completion criteria checked; user asked how to proceed.
- **Risk:** low — read-only analysis with at most two report writes.
- **Boundary:** stay within the declared scope; do not implement fixes, draft specs, or modify tracker state.

# Project Viability

Analyze whether the project is viable, functional, and scalable across logic, architecture, technical capacity, team maintainability, and domain growth. Ground every finding in `CONTEXT.md`, the ADRs under `docs/adr/`, and actual code evidence. Complement subjective findings with an automated baseline of objective health signals.

Three parallel sub-agents evaluate each dimension independently so findings do not pollute each other's context. This skill aggregates their outputs into a single Markdown report and a structured JSON artifact.

## Contract

- Input: repository with `CONTEXT.md`, ADRs, source code, and automated baseline.
- Output: one Markdown report under `.reports/` and one JSON artifact under `.reports/`, both with layered findings and a prompt for the user.
- Scope: assess viability; do not refactor, implement, or alter project state beyond writing reports.
- Rule: every claim must cite `CONTEXT.md`, an ADR path, or a concrete code location.
- Rule: separate "missing" from "wrong" — distinguish undocumented behavior from contradicted behavior.
- Rule: after delivering the report, ask the user what to do next; do not take action autonomously.

## Confidence Criteria

Use these criteria when assigning confidence levels to findings:

- **High:** ≥2 independent citations supporting the finding, or 1 citation with automated baseline confirmation.
- **Medium:** 1 citation with no automated confirmation, or 2 weak citations.
- **Low:** No direct citation; finding is an inference from structure or naming alone.

Findings with `Low` confidence must be flagged explicitly and must not drive `Not viable` or `Broken` ratings alone.

## Numeric Scoring

In addition to categorical ratings, assign a numeric score 1–5 per dimension:

- 5 — Excellent, no material concerns
- 4 — Good, minor improvements possible
- 3 — Adequate, at least one material concern
- 2 — Poor, multiple material concerns
- 1 — Critical, project is blocked or fundamentally broken

Numeric scores enable tracking across assessments. Include both categorical rating and numeric score in the executive summary.

## Steps

### 1. Pre-flight check

Before proceeding, verify the following in the repository:

- `CONTEXT.md` exists and is non-empty. If missing, note "Insufficient context" for viability and record the gap.
- `docs/adr/` exists. If missing, note that ADR-grounded evaluation is limited and record the gap.
- `references/evaluation-criteria.md`, `references/report-template.md`, `references/subagent-prompts.md`, and `references/health-baseline.md` exist. If missing, warn and use inline defaults.

Record any gaps in the pre-flight findings. Do not abort the workflow; continue with reduced confidence and mark affected findings accordingly.

### 2. Gather context

Read `CONTEXT.md` and all files under `docs/adr/`. If `CONTEXT-MAP.md` exists, read it and resolve each mapped context. Record the domain vocabulary, stated goals, constraints, and recorded decisions.

### 3. Map the codebase

Identify the project shape: interactive app, batch pipeline, agentic system, library, backend service, or hybrid. Map the top-level structure, entry points, data flow, and external integrations. Note any seams between layers. Record approximate LOC and module count.

### 4. Automated baseline

Run the checks in `references/health-baseline.md`. Record the following objective signals:

- Repository LOC and module count
- Dependency health (outdated, vulnerable, orphaned)
- Test coverage signal (test LOC ratio, CI presence)
- Cross-import signal (import count across module boundaries)
- Configuration drift signal (uncommitted config, IaC changes without ADR)

Pass the baseline results to all sub-agents as part of the shared context.

### 5. Spawn parallel sub-agents

Send a single message with three `Agent` tool calls using the `general-purpose` subagent type. Use the prompt templates in `references/subagent-prompts.md`. Include:

- The shared context gathered in steps 1, 2, 3, and 4.
- The viability brief.
- The functionality brief.
- The scalability brief.

Each sub-agent returns:
- A categorical rating.
- A numeric score (1–5).
- Evidence list with citations.
- Confidence level per finding (High / Medium / Low).
- Risk level per finding (High / Medium / Low) based on Likelihood × Impact.
- Conditions, missing items, or limiting factors as applicable.

### 6. Quality gate

Before aggregating, verify:

- Every finding cites `CONTEXT.md`, an ADR path, or a concrete code location.
- Ratings are internally consistent (e.g., "Not viable" must have at least one blocker).
- No dimension contradicts another without an explicit unresolved conflict noted.
- Confidence levels are assigned to all findings.
- Risk levels are assigned to all findings.
- Numeric scores are consistent with categorical ratings.

If the quality gate fails, iterate on the failing sub-agent output before aggregation. Do not write a report that fails the gate.

### 7. Aggregate findings

Combine the three sub-agent outputs into a single report using the structure in `references/report-template.md`. Preserve each dimension's findings separately; do not merge or rerank across axes.

### 8. Write the report

Write the aggregated findings to `.reports/<YYYYMMDD>-viability.md`. Keep the report under 2000 words. Include:

- Executive summary with the three categorical ratings and three numeric scores.
- Evidence-backed findings per layer with confidence and risk levels.
- Priority matrix (Impact × Effort) for recommendations.
- Validation notes documenting quality gate results.
- Pre-flight gaps, if any.
- Delta section comparing with previous assessment, if one exists.

### 9. Write the JSON artifact

Write the structured JSON artifact to `.reports/<YYYYMMDD>-viability.json`. The artifact must include:

- `repository` and `date`
- `preflight` gaps
- `baseline` signals
- `dimensions` with categorical rating, numeric score, findings, and recommendations per dimension
- `overall` posture and conflict resolution
- `validation` notes
- `delta` from previous assessment, if one exists

### 10. Ask the user what to do

After writing the reports, present the path forward and ask the user to choose:

- Address the top findings via `/implement` or `/codebase-design`.
- Sharpen the project model via `/grill-with-docs` or `/domain-modeling`.
- Revisit ADRs via `/docs-management`.
- Abandon or pause the assessment.

Do not proceed without explicit user direction.

## Resources

### references/evaluation-criteria.md

Read this file when scoring viability, functionality, and scalability. It defines the rating thresholds, evidence requirements, anti-patterns, confidence criteria, numeric scoring, risk matrix, and conflict resolution rules for each dimension.

### references/report-template.md

Use this template when writing the `.reports/<YYYYMMDD>-viability.md` file. It specifies the required sections, wording conventions, validation note format, and JSON artifact schema.

### references/subagent-prompts.md

Use these prompts when spawning the three parallel sub-agents in step 5. Each prompt includes the shared context and a focused brief for one dimension, with an output schema that includes rating, numeric score, confidence, and risk.

### references/health-baseline.md

Read this file before step 4. It defines the automated baseline checks to run, the signals to collect, and how to pass them to sub-agents.

### references/edge-cases.md

Read this file when the repository deviates from the standard shape (missing CONTEXT.md, monorepos, legacy projects, config-only repos, dependency health issues).

### references/integration-points.md

Read this file after writing the report to decide which follow-up skill to recommend. It maps dimension ratings to the most effective next action, considering numeric scores and risk levels.

## Completion Criteria

- Pre-flight check completed; gaps recorded if present.
- Automated baseline completed; signals recorded.
- The Markdown report exists at `.reports/<YYYYMMDD>-viability.md`.
- The JSON artifact exists at `.reports/<YYYYMMDD>-viability.json`.
- All three layers (viability, functionality, scalability) are assessed with categorical ratings and numeric scores.
- Every finding cites `CONTEXT.md`, an ADR, or a concrete code location.
- Confidence and risk levels are assigned to all findings.
- Quality gate passed before writing the reports.
- Validation notes are included in the report.
- Delta from previous assessment recorded if applicable.
- The user has been asked how to proceed.
- No source files were modified.
