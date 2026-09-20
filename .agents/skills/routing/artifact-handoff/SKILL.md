---
name: artifact-handoff
category: routing
maturity: stable
version: 1
description: Transfer structured artifacts between Skills and sessions — with explicit provenance and consumer expectations.
capabilities:
  - execute the core process defined in the skill body
  - produce a Markdown artifact or structured result
outputs:
  - Markdown artifact with process steps and completion criteria
sideEffects: []
dependencies: []
stopCondition: All process steps executed; artifact saved; criteria met.
risk: low
trustTier: 1
maxIterations: 6
---

## Contract

- **Input:** problem or task defined by the skill body.
- **Output:** Markdown artifact or structured result with completion criteria met.
- **Side effects:** none (design/review/documentation only unless explicitly stated).
- **Dependencies:** none (self-contained unless linked to other skills).
- **Stop condition:** all process steps completed; artifact saved; criteria checked.
- **Risk:** low.
- **Boundary:** produces reasoning or documentation artifacts; does not modify external systems unless explicitly instructed.


# Artifact Handoff

Use this skill to move a result from one Skill to another without flattening it into prose.

## Steps

1. Package the artifact with id, type, producer, status, summary, evidence, and consumers.
2. Include the minimal context pointer required by the consumer.
3. Preserve provenance and redaction by default.

## Rules

- Rule: include enough provenance for the consumer to verify the artifact without redoing the full prior session.
- Rule: distinguish artifact content from commentary about the artifact.
- Rule: redact secrets, personal data, and irrelevant private context before handoff.
- Rule: name the intended consumer Skill and the exact next action it should take.
- Rule: include validation status and known caveats when the artifact is partial.

## Completion criteria

- the artifact validates against the shared envelope
- the next consumer is explicit
- provenance, evidence, and redaction status are recorded
