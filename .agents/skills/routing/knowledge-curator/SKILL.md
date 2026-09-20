---
name: knowledge-curator
category: routing
maturity: experimental
version: 1
description: Keep context, ADRs, registry entries, and research coherent over time — with refresh and provenance discipline.
capabilities:
  - apply knowledge curator workflow
  - produce knowledge curator artifact
  - validate knowledge curator completion criteria
outputs:
  - Knowledge Curator artifact with findings, decisions, recommendations, and validation notes
sideEffects:
  - write-docs
dependencies: []
stopCondition: Keep context, ADRs, registry entries, and research coherent over time complete; artifact saved; completion criteria checked.
risk: low
trustTier: 2
maxIterations: 6
---

## Operating Contract

- **Input:** Knowledge Curator request, relevant context, constraints, and source evidence.
- **Output:** Knowledge Curator artifact with findings, decisions, recommendations, and validation notes.
- **Side effects:** follow the frontmatter declaration; do not broaden scope without explicit user direction.
- **Dependencies:** declared dependencies, referenced skills, and source materials required by the task.
- **Stop condition:** Keep context, ADRs, registry entries, and research coherent over time is complete, evidence is captured, and completion criteria are checked.
- **Risk:** use the frontmatter risk classification and call out any escalation.
- **Boundary:** stay within the skill's declared scope, trust tier, and side-effect policy.

# Knowledge Curator

Use this skill to curate durable knowledge after a run.

## Contract

- Input: candidate updates, existing context, and ADRs.
- Output: the minimal durable update that preserves consistency.
- Scope: curate durable knowledge, not implementation work.
- Rule: reject stale, duplicate, or contradictory material unless it is explicitly resolved.
- Rule: write only what should survive the current session.

## Steps

1. Compare candidate updates against existing context and ADRs.
2. Resolve contradictions or mark them for review.
3. Write only the minimal durable update needed.

## Completion criteria

- the durable knowledge set is consistent
- stale or duplicate material is rejected or merged
- the update is minimal and durable
- any contradiction is either resolved or flagged for review
