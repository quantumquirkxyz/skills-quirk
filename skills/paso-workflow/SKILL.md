---
name: paso-workflow
category: example
maturity: experimental
version: 1
description: Example generated skill that demonstrates a simple multi-step workflow structure for the skill-creator templates.
capabilities:
  - demonstrate generated skill structure
  - document a linear workflow
outputs:
  - example workflow notes
  - validation checklist
sideEffects:
  - write-files
dependencies: []
stopCondition: The example workflow structure has been inspected and its generated files are present.
risk: low
trustTier: 2
maxIterations: 3
---

## Operating Contract

- **Input:** A request to inspect or adapt the generated `paso-workflow` example.
- **Output:** Notes about the workflow structure and whether the generated files are complete.
- **Side effects:** follow the frontmatter declaration; this example may write local notes only when explicitly adapted.
- **Dependencies:** none.
- **Stop condition:** the example structure is understood or copied into a real sandbox skill.
- **Risk:** low; this is a local example.
- **Boundary:** use this as an example, not as an active production workflow.

# Paso Workflow

This is a concrete example produced by the skill creation tooling. It exists to show the expected shape of a generated skill: `SKILL.md`, `scripts/`, `references/`, `assets/`, and `adrs/`.

## Contract

- Input: a small workflow idea that can be expressed as ordered steps.
- Output: a generated skill skeleton with documentation, a script entry point, and an initial ADR.
- Scope: example workflow scaffolding only.
- Rule: replace example language before promoting this into `.agents/skills/`.
- Rule: validate generated skills before using them as part of the active bundle.

## Structured Skill Creation Process

1. Define the workflow goal.
2. List the required inputs and outputs.
3. Generate or adapt the skeleton files.
4. Add domain references and implementation logic.
5. Validate the resulting skill before promotion.

## Completion Criteria

- The example files are present.
- The workflow has a named input, output, and stop condition.
- Any promoted copy has concrete metadata rather than example text.
