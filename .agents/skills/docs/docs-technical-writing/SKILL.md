---
name: docs-technical-writing
category: docs
maturity: stable
version: 1
description: Write technical documentation — clear explanations, examples, warnings, and procedural guidance — with audience-aware structure and maintenance rules.
capabilities:
  - structure technical documentation
  - clarify procedural guidance
  - align docs with audience needs
outputs:
  - technical document plan or draft with audience, scope, and maintenance notes
sideEffects: []
dependencies: []
stopCondition: The document is clear for its audience, complete for its scope, and maintainable.
risk: low
trustTier: 1
maxIterations: 6
---

# docs-technical-writing

Use this skill when drafting, editing, or restructuring documentation for developers, operators, researchers, or technical stakeholders.

## Contract

- Input: documentation goal, audience, source material, and expected reader task.
- Output: outline, edited document, or review notes with gaps and maintenance concerns.
- Scope: technical clarity, structure, examples, warnings, and upkeep; not marketing copy.
- Boundary: preserve technical accuracy and mark unknowns instead of smoothing over missing facts.

## Rules

- Rule: name the reader and the job they are trying to complete.
- Rule: put prerequisites and danger points before procedural steps that depend on them.
- Rule: use examples that match the actual system, not abstract filler.
- Rule: separate conceptual explanation from step-by-step procedure when both are needed.
- Rule: include maintenance ownership for docs that will drift.

## Steps

1. Identify the audience, context, and reader outcome.
2. Inventory source facts, commands, warnings, and examples.
3. Choose the document shape: tutorial, how-to, reference, explanation, ADR, or runbook.
4. Draft or revise sections in the order the reader needs them.
5. Check for missing prerequisites, ambiguous pronouns, stale commands, and unsupported claims.
6. Add maintenance notes when the document depends on changing systems.

## Completion Criteria

- audience and reader task are explicit
- steps, examples, and warnings are placed where they are needed
- unknowns or assumptions are marked
- the document has a clear update path
