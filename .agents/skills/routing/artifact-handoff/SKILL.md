---
name: artifact-handoff
category: routing
maturity: stable
version: 1
description: Transfer structured artifacts between Skills and sessions — with explicit provenance and consumer expectations.
capabilities:
  - apply artifact handoff workflow
  - produce artifact handoff artifact
  - validate artifact handoff completion criteria
outputs:
  - Artifact Handoff artifact with findings, decisions, recommendations, and validation notes
sideEffects: []
dependencies: []
stopCondition: Transfer structured artifacts between Skills and sessions complete; artifact saved; completion criteria checked.
risk: low
trustTier: 1
maxIterations: 6
---

## Operating Contract

- **Input:** Artifact Handoff request, relevant context, constraints, and source evidence.
- **Output:** Artifact Handoff artifact with findings, decisions, recommendations, and validation notes.
- **Side effects:** follow the frontmatter declaration; do not broaden scope without explicit user direction.
- **Dependencies:** declared dependencies, referenced skills, and source materials required by the task.
- **Stop condition:** Transfer structured artifacts between Skills and sessions is complete, evidence is captured, and completion criteria are checked.
- **Risk:** use the frontmatter risk classification and call out any escalation.
- **Boundary:** stay within the skill's declared scope, trust tier, and side-effect policy.

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
