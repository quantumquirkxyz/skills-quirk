---
name: handoff
category: routing
maturity: stable
version: 1
description: Compact the current conversation into a handoff document for another agent to pick up — with explicit continuity and ownership notes.
capabilities:
  - apply handoff workflow
  - produce handoff artifact
  - validate handoff completion criteria
outputs:
  - Handoff artifact with findings, decisions, recommendations, and validation notes
sideEffects: []
dependencies: []
stopCondition: Compact the current conversation into a handoff document for another agent to pick up complete; artifact saved; completion criteria checked.
risk: low
trustTier: 1
maxIterations: 6
---

## Operating Contract

- **Input:** Handoff request, relevant context, constraints, and source evidence.
- **Output:** Handoff artifact with findings, decisions, recommendations, and validation notes.
- **Side effects:** follow the frontmatter declaration; do not broaden scope without explicit user direction.
- **Dependencies:** declared dependencies, referenced skills, and source materials required by the task.
- **Stop condition:** Compact the current conversation into a handoff document for another agent to pick up is complete, evidence is captured, and completion criteria are checked.
- **Risk:** use the frontmatter risk classification and call out any escalation.
- **Boundary:** stay within the skill's declared scope, trust tier, and side-effect policy.

Write a handoff document summarising the current conversation so a fresh agent can continue the work. Save to the temporary directory of the user's OS - not the current workspace.

Include a "suggested skills" section in the document, which suggests skills that the agent should invoke.

Do not duplicate content already captured in other artifacts (specs, plans, ADRs, issues, commits, diffs). Reference them by path or URL instead.

Redact any sensitive information, such as API keys, passwords, or personally identifiable information.

If the user passed arguments, treat them as a description of what the next session will focus on and tailor the doc accordingly.

## Rules

- Rule: write for a fresh agent with no hidden context.
- Rule: include current objective, completed work, open work, validation, branch/commit state, and blockers.
- Rule: prefer links and paths to duplicating long artifacts.
- Rule: redact secrets and unnecessary personal data.
- Rule: do not mark work complete unless the current objective is actually complete.

## Completion Criteria

- handoff location is outside the workspace unless the user requested otherwise
- next agent can identify the next action without reading the whole prior conversation
- open risks and validation status are explicit
- suggested skills are relevant to the remaining work
