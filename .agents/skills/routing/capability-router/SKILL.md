---
name: "capability-router"
category: "routing"
maturity: "stable"
version: "1"
description: "Route work to the best matching Skill using declared capabilities and compatibility — with explicit selection rules."
capabilities: ""
outputs: ""
sideEffects: []
dependencies: []
stopCondition: "Route work to the best matching Skill using declared capabilities and compatibility complete; artifact saved; completion criteria checked."
risk: "low"
trustTier: "1"
maxIterations: "6"
promptVersion: "2.0"
artifactType: "plan"
modelTier: "router"
evaluators: ["behavioral", "regression"]
fixturesPath: ".agents/skills/platform/fixtures/behavioral/capability-router.json"
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

Emit `CapabilityRouterArtifact` as both:
- JSON: `.agents/skills/platform/artifacts/capability-router/{identifier}.json`
- Markdown view: same filename with `.md` extension


# 
# 
# Capability Router

Use this skill to choose the right Skill from the registry instead of relying on memory.


## Steps

1. Parse the task intent and required artifact type.
2. Match against declared capabilities and side effects.
3. Prefer the thinnest Skill that can finish the work.
4. Fall back to a human-readable rationale when multiple Skills fit.

## Completion

- the skill's completion criteria are explicitly checked
- the artifact is saved and validated
- any blockers or skipped validations are documented
- the next consumer is identified or the work is handed off
---
@include .agents/skills/platform/contract-base.xml