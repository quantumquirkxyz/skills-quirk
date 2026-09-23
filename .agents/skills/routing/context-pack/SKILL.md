---
name: context-pack
category: routing
maturity: stable
version: 1
description: Build a minimal fresh context pack with ordered reads and provenance — for scoped, high-signal handoff.
capabilities:
  - apply context pack workflow
  - produce context pack artifact
  - validate context pack completion criteria
outputs:
  - Context Pack artifact with findings, decisions, recommendations, and validation notes
sideEffects: []
dependencies: []
stopCondition: Build a minimal fresh context pack with ordered reads and provenance complete; artifact saved; completion criteria checked.
risk: low
trustTier: 1
maxIterations: 6
---

## Operating Contract

- **Input:** Context Pack request, relevant context, constraints, and source evidence.
- **Output:** Context Pack artifact with findings, decisions, recommendations, and validation notes.
- **Side effects:** follow the frontmatter declaration; do not broaden scope without explicit user direction.
- **Dependencies:** declared dependencies, referenced skills, and source materials required by the task.
- **Stop condition:** Build a minimal fresh context pack with ordered reads and provenance is complete, evidence is captured, and completion criteria are checked.
- **Risk:** use the frontmatter risk classification and call out any escalation.
- **Boundary:** stay within the skill's declared scope, trust tier, and side-effect policy.

# Context Pack

Use this skill to select the minimum repo context needed for a task.

## Contract

- Rule: build the pack before reading broadly.
- Rule: keep the read set minimal and ordered from durable context to task-specific evidence.
- Rule: record why each read is included, how fresh it is, and what it should answer.
- Rule: prefer authoritative repo docs, then the smallest relevant evidence.
- Rule: stop when the pack is sufficient to start work; do not over-collect.
- Rule: include enough provenance that a later skill can tell which facts came from durable docs and which came from runtime state.
- Rule: prefer one pack per task, not one pack per skill hop.

## Steps

1. Identify the task scope and the smallest authoritative docs needed.
2. Order the reads from durable repo context to task-specific evidence.
3. Record freshness, provenance, and budget in the pack.
4. Capture the smallest set of facts needed to choose the next skill without reopening the full repo.

## Completion criteria

- the pack has an ordered read set
- freshness and provenance are explicit
- the pack stays bounded
