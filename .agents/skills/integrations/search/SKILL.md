---
name: search
category: integrations
maturity: stable
version: 1
description: Design search behavior, indexing, and relevance seams — so retrieval stays understandable and adjustable.
capabilities:
  - apply search workflow
  - produce search artifact
  - validate search completion criteria
outputs:
  - Search artifact with findings, decisions, recommendations, and validation notes
sideEffects: []
dependencies: []
stopCondition: Design search behavior, indexing, and relevance seams complete; artifact saved; completion criteria checked.
risk: low
trustTier: 1
maxIterations: 6
---

## Operating Contract

- **Input:** Search request, relevant context, constraints, and source evidence.
- **Output:** Search artifact with findings, decisions, recommendations, and validation notes.
- **Side effects:** follow the frontmatter declaration; do not broaden scope without explicit user direction.
- **Dependencies:** declared dependencies, referenced skills, and source materials required by the task.
- **Stop condition:** Design search behavior, indexing, and relevance seams is complete, evidence is captured, and completion criteria are checked.
- **Risk:** use the frontmatter risk classification and call out any escalation.
- **Boundary:** stay within the skill's declared scope, trust tier, and side-effect policy.

# Search

Use this skill when the system needs retrieval that users can trust. It should define the retrieval seam, indexing shape, and the controls that keep relevance adjustable instead of opaque.

## Contract

- Input: search brief, retrieval context, and relevance constraints.
- Output: search seam proposal, indexing guidance, and relevance control guidance.
- Scope: design search behavior, not the full implementation.
- Rule: keep retrieval and presentation concerns separate.
- Rule: make indexing and ranking tradeoffs explicit.
- Rule: note how relevance can be tuned without rewriting the whole flow.

## Steps

1. Identify the user search job and the target corpus.
2. Define the retrieval and indexing seams.
3. Describe the ranking and relevance controls.
4. Note what feedback or telemetry can tune the result quality.

## Completion criteria

- the retrieval seam is named
- the indexing approach is named
- the relevance controls are explicit
