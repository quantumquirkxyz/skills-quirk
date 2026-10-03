---
name: "context-pack"
category: "routing"
maturity: "stable"
version: "1"
description: "Build a minimal fresh context pack with ordered reads and provenance — for scoped, high-signal handoff."
capabilities: ""
outputs: ""
sideEffects: []
dependencies: []
stopCondition: "Build a minimal fresh context pack with ordered reads and provenance complete; artifact saved; completion criteria checked."
risk: "low"
trustTier: "1"
maxIterations: "6"
promptVersion: "2.0"
artifactType: "routing"
modelTier: "router"
evaluators: ["behavioral", "regression"]
fixturesPath: ".agents/skills/platform/fixtures/behavioral/context-pack.json"
diataxis: "how-to"
tags: ["routing"]
compatibility: []
approvalRequired: "false"
approvalFor: []
---

## Contract

- Input: skill invocation with the user's request and available context.
- Output: a structured artifact or guidance aligned to the skill's declared outputs.
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

Emit `ContextPackArtifact` as both:
- JSON: `.agents/skills/platform/artifacts/context-pack/{identifier}.json`
- Markdown view: same filename with `.md` extension


# 
# 
# Context Pack

Use this skill to select the minimum repo context needed for a task.


## Steps

1. Identify the task scope and the smallest authoritative docs needed.
2. Order the reads from durable repo context to task-specific evidence.
3. Record freshness, provenance, and budget in the pack.
4. Capture the smallest set of facts needed to choose the next skill without reopening the full repo.

## Completion

- the skill's completion criteria are explicitly checked
- the artifact is saved and validated
- any blockers or skipped validations are documented
- the next consumer is identified or the work is handed off
---
@include .agents/skills/platform/contract-base.xml