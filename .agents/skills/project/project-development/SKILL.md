---
name: "project-development"
category: "project"
maturity: "stable"
version: "1"
description: "Evaluate a project's shape, agent fit, and architectural starting point — before the main workflow begins."
license: "MIT"
capabilities:
  - apply project development methods within explicit project boundaries
  - analyze evaluate a project's shape, agent fit, and architectural starting point — before the main workflow begins with assumptions, constraints, and failure modes
  - produce and validate a project artifact with evidence, decisions, and next steps
outputs:
  type: object
  properties:
    projectFitAssessment:
      type: string
      description: "Assessment of whether and how quirk Skills apply to this project"
    projectShapeClassification:
      type: string
      enum: ["interactive app", "batch pipeline", "agentic system", "library", "backend service", "hybrid"]
      description: "Classification of the project's dominant shape"
    flowRecommendation:
      type: string
      description: "Recommended next workflow skill with rationale"
    thinnestSafePath:
      type: string
      description: "The minimal first step that stays within declared scope"
  required:
    - projectFitAssessment
    - projectShapeClassification
    - flowRecommendation
    - thinnestSafePath
sideEffects: []
dependencies: []
stopCondition: "Evaluate a project's shape, agent fit, and architectural starting point complete; structured result returned; completion criteria checked."
risk: "low"
trustTier: "1"
maxIterations: "6"
promptVersion: "2.0"
artifactType: "project-assessment"
modelTier: "reasoning"
evaluators: ["behavioral", "regression"]
fixturesPath: "tests/skill-output-migration-loop-project-qa.test.mjs"
diataxis: "how-to"
tags: ["project"]
compatibility: []
approvalRequired: false
approvalFor: []
---

## Normative Rules

- This skill is classification-only: do not design the whole system, choose implementation frameworks, write code, create files, or modify the repository.
- Inspect only the minimum repository context needed to classify the dominant project shape and identify the first useful seam.
- Select exactly one dominant shape; record secondary shapes and ambiguity rather than guessing.
- Recommend the thinnest safe path: the narrowest next workflow skill and one concrete first action that stays within declared scope.
- Do not broaden scope or route to whole-system design at this stage; surface blockers before making a recommendation.
- When this assessment establishes an architectural starting point, emit an `ArchitectureArtifact` validated against `schemas/software-engineering/architecture-artifact.schema.json`; retain the project-assessment fields in `payload`.
- The architecture payload must include the fixed point, source requirements digest, quality-attribute scenarios, risks, owner, next consumer, and verification plan. A missing requirements digest is a blocker, not an inferred value.
- If architecture is genuinely not applicable, emit `status: "blocked"` or `"completed"` with `payload.notApplicable: true`, explain the boundary and reason, and include an explicit approval record in `approvals`; never silently omit architecture.
- Do not claim certification or compliance merely because the artifact validates.

## Contract

- Input: project brief, repo state, and target stack.
- Output: a project fit assessment, a project shape classification, and an initial flow recommendation.
- Architecture handoff: when produced, the output is an `ArchitectureArtifact` envelope whose `sourceDigests.requirements` identifies the requirements fixed point and whose `payload.verificationPlan` names the next verification activities.
- Scope: stay within the skill's declared boundaries; do not broaden without explicit direction.
- Rule: documented standards override defaults; explicit project rules take precedence.
- Rule: if blocked by missing context or dependencies, surface the blocker before proceeding.

### Input schema

| Field | Type | Required | Description |
|---|---|---|---|
| projectBrief | string | yes | Plain-language description of what the project is meant to do |
| repoState | object | yes | Current repository shape: language, framework, entry points, tests, CI config |
| targetStack | object | yes | Intended or detected stack: runtime, UI layer, data layer, deployment target |

### Output schema

| Field | Type | Description |
|---|---|---|
| projectFitAssessment | string | Assessment of whether and how quirk Skills apply to this project |
| projectShapeClassification | string | One of: interactive app, batch pipeline, agentic system, library, backend service, hybrid |
| flowRecommendation | string | Recommended next workflow skill with rationale |
| thinnestSafePath | string | The minimal first step that stays within declared scope |

### Classification boundaries

- interactive app: user-facing UI with interactive flows (React, Next.js, Astro, Remix, mobile)
- batch pipeline: scheduled or event-triggered data transformation with no persistent UI
- agentic system: LLM-driven autonomous agents with tool use, memory, and decision loops
- library: reusable package consumed by other projects, no standalone runtime entry point
- backend service: API or server-side application with network-facing endpoints
- hybrid: mixes two or more shapes above; classify the dominant shape and note secondary shapes

## Provenance

| Question | Answer |
|---|---|
| What is the source of truth? | The user's request, originating spec/issue, and the skill's declared outputs |
| What is in scope? | Work covered by the skill's acceptance criteria and completion rules |
| What is explicitly out of scope? | Files, behaviors, and decisions outside the skill's declared boundary |
| Who or what consumes this artifact afterward? | The next skill in the workflow or the user |
| What evidence proves it is done? | Completion criteria met, structured result returned, validation passed |
| What risk remains? | Subjective judgment calls, missing context, or external dependency failures |

### Evidence requirements

- Repository read evidence: directory tree, package manifest, test files, CI configuration
- Classification rationale: which signals led to each shape assignment (entry points, user-facing routes, agent loops, library exports)
- Flow rationale: why the recommended skill is the thinnest safe path for this shape

### Risk assessment: misclassifying project shape

Misclassifying the project shape can route work to the wrong skill, wasting effort on an ill-fitting flow. A batch pipeline misclassified as an interactive app would pull in UI skills unnecessarily; an agentic system misclassified as a backend service would miss orchestration and evaluation steps. When signals are ambiguous, classify the dominant shape, note secondary shapes as risks, and surface the ambiguity rather than guessing.

### AGENTS.md vocabulary

- **quirk Skills**: Canonical skills live in `.agents/skills/` as `<domain>/<skill>/SKILL.md` directories — the only source of truth for skill content.
- **quirk Method**: The bundle's method applies to work done here: artifact-first design, state-machine workflows, shift-left quality gates.
- **canonical skill**: Skills in `.agents/skills/` are canonical; `.claude/skills/` is a generated compatibility view of relative symlinks.
- **provenance**: The evidence trail showing source of truth, scope boundaries, consumers, and what proves completion.

## Artifact

Return `ProjectDevelopmentArtifact` as structured output in the current response. Do not write local artifact files unless the user explicitly asks for an export.


# Project Development

Use this skill to decide what kind of project you are dealing with before the workflow commits to a path. A standard project can still be unusual in shape: batch pipeline, agentic system, interactive app, toolchain, or mixed stack. The point of this skill is to classify the shape and choose the right first seam, not to design the whole system.

## Steps

### Step 1: Read the minimum repo context

**What to do:** Inspect directory structure, package manifests, test files, CI config, and any existing AGENTS.md or CONTEXT.md to understand the stack and current constraints.

**Completion criteria:**
- Directory tree reviewed at top level and one level deep
- Package manifest(s) read (package.json, Cargo.toml, go.mod, pyproject.toml, etc.)
- Test files and CI configuration located if present
- Existing AGENTS.md/CONTEXT.md vocabulary noted if present
- Stack and constraints summarized in the structured output

### Step 2: Classify the project shape

**What to do:** Assign one shape from: interactive app, batch pipeline, agentic system, library, backend service, or hybrid. Use signals such as entry points, user-facing routes, agent loops, library exports, scheduled jobs, or network-facing endpoints.

**Shape classification guidance:**
- interactive app: user-facing UI with interactive flows (React, Next.js, Astro, Remix, mobile)
- batch pipeline: scheduled or event-triggered data transformation with no persistent UI
- agentic system: LLM-driven autonomous agents with tool use, memory, and decision loops
- library: reusable package consumed by other projects, no standalone runtime entry point
- backend service: API or server-side application with network-facing endpoints
- hybrid: mixes two or more shapes above; classify the dominant shape and note secondary shapes

**Completion criteria:**
- Exactly one dominant shape selected
- Rationale recorded citing specific repo signals
- Secondary shapes noted if present, with risk flagged

### Step 3: Identify the first useful seam

**What to do:** Determine whether the first useful seam is in UI, API, data, execution, or governance. The seam is where the next workflow skill should begin.

**Seam identification guidance:**
- UI: user-facing components, pages, interactions — route to frontend skills
- API: network-facing endpoints, service contracts — route to backend skills
- data: schema, models, pipelines, warehouses — route to data skills
- execution: jobs, workers, queues, deployment — route to devops/platform skills
- governance: access control, compliance, security boundaries — route to sec/compliance skills

**Completion criteria:**
- One primary seam selected
- Rationale tied to the project shape classification
- Alternative seams noted if ambiguous

### Step 4: Recommend the next workflow skill

**What to do:** Recommend the next workflow skill and explain why it is the thinnest safe path — the minimal first step that stays within declared scope without designing the whole system.

**Flow recommendation rationale:**
- Match the seam to the skill whose domain covers it
- Prefer the skill with the narrowest scope that still unblocks progress
- Avoid recommending system design skills at this stage; classification only

**Completion criteria:**
- Next skill named with explicit rationale
- Thinnest safe path described as a concrete first action
- No whole-system design included

## Scope Notes

This skill stays at classification level rather than designing the whole system. Framework, library, and architecture selection stops at identifying the seam. Repository mutation is outside this skill; ambiguous signals are surfaced rather than guessed, and the declared boundaries remain unchanged unless the user explicitly broadens them.

## Completion

- Step 1 complete: repo context read and summarized
- Step 2 complete: project shape classified with rationale and secondary shapes noted
- Step 3 complete: first useful seam identified with rationale
- Step 4 complete: next workflow skill recommended with thinnest safe path
- Structured result returned and validated against the output schema
- Any blockers or skipped validations documented
- Next consumer identified or the work handed off
- ArchitectureArtifact envelope validated when architecture is applicable; `notApplicable` approval and rationale validated otherwise

## References

- `spec-driven-development`: Run spec-driven development (SDD) after classification when a spec is needed
- `to-spec`: Convert requirements into an implementable technical specification
- `to-tickets`: Break a plan or spec into tracer-bullet tickets
- `make-project`: Create a GitHub project and wire its fields
- `project-viability`: Evaluate whether a project is viable, functional, and scalable
- `analyze-artifacts`: Analyze spec, plan, and ticket artifacts for consistency

## Examples

### Example: Classifying a batch data pipeline

**Input:**
- projectBrief: "A nightly job that reads CSV exports from a vendor, normalizes them, and loads into a warehouse."
- repoState: Python project, `pyproject.toml`, one entry script `etl/load.py`, tests in `tests/`, GitHub Actions cron schedule
- targetStack: Python, PostgreSQL, AWS S3, scheduled execution

**Classification:**
- projectShapeClassification: batch pipeline (dominant), no secondary shapes
- Seam: data (schema, transformation, load)
- flowRecommendation: `data-etl-pipeline` — the pipeline is scheduled, data-centric, and has no UI or API surface; this is the thinnest safe path
- thinnestSafePath: Run `data-etl-pipeline` to design the extraction, transformation, and load steps; do not add UI or API skills

**Rationale:** The cron schedule, single entry script, and warehouse target all point to batch data processing. No interactive routes, agent loops, or library exports are present, so interactive app, agentic system, and library are ruled out. Backend service is considered but rejected because there are no network-facing endpoints.

---
@include .agents/skills/platform/contract-base.xml