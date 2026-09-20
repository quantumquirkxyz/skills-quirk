---
name: research
category: delivery
maturity: stable
version: 1
description: Investigate a question against high-trust primary sources and capture the findings as a Markdown file in the repo. Use w
capabilities:
  - apply research workflow
  - produce research artifact
  - validate research completion criteria
outputs:
  - Research artifact with findings, decisions, recommendations, and validation notes
sideEffects:
  - write-docs
dependencies: []
stopCondition: Investigate a question against high-trust primary sources and capture the findings as a Markdown file in the repo complete; artifact saved; completion criteria checked.
risk: low
trustTier: 2
maxIterations: 6
---

## Operating Contract

- **Input:** Research request, relevant context, constraints, and source evidence.
- **Output:** Research artifact with findings, decisions, recommendations, and validation notes.
- **Side effects:** follow the frontmatter declaration; do not broaden scope without explicit user direction.
- **Dependencies:** declared dependencies, referenced skills, and source materials required by the task.
- **Stop condition:** Investigate a question against high-trust primary sources and capture the findings as a Markdown file in the repo is complete, evidence is captured, and completion criteria are checked.
- **Risk:** use the frontmatter risk classification and call out any escalation.
- **Boundary:** stay within the skill's declared scope, trust tier, and side-effect policy.

Spin up a **background agent** to do the research, so you keep working while it reads.

Its job:

1. Investigate the question against **primary sources** — official docs, source code, specs, first-party APIs — not a secondary write-up of them. Follow every claim back to the source that owns it.
2. Write the findings to a single Markdown file, citing each claim's source.
3. Save it where the repo already keeps such notes; match the existing convention, and if there is none, put it somewhere sensible and say where.

## Rules

- Rule: prefer primary sources and record why any secondary source was used.
- Rule: cite claim-level sources, not just a bibliography at the end.
- Rule: capture publication or access dates when freshness matters.
- Rule: separate confirmed facts, source interpretation, and open questions.
- Rule: preserve enough search/query detail for another agent to reproduce the research path.

## Completion Criteria

- research question and scope are explicit
- sources are primary or justified exceptions
- findings are saved to a Markdown artifact
- every material claim has traceable source evidence
