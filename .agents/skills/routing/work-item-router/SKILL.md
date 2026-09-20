---
name: work-item-router
category: routing
maturity: experimental
version: 1
description: Force reading the canonical work-item governance index before routing specs, tickets, project boards, or publication flows.
capabilities:
  - apply work item router workflow
  - produce work item router artifact
  - validate work item router completion criteria
outputs:
  - Work Item Router artifact with findings, decisions, recommendations, and validation notes
sideEffects: []
dependencies: []
stopCondition: Force reading the canonical work-item governance index before routing specs, tickets, project boards, or publication flows complete; artifact saved; completion criteria checked.
risk: low
trustTier: 1
maxIterations: 6
---

## Operating Contract

- **Input:** Work Item Router request, relevant context, constraints, and source evidence.
- **Output:** Work Item Router artifact with findings, decisions, recommendations, and validation notes.
- **Side effects:** follow the frontmatter declaration; do not broaden scope without explicit user direction.
- **Dependencies:** declared dependencies, referenced skills, and source materials required by the task.
- **Stop condition:** Force reading the canonical work-item governance index before routing specs, tickets, project boards, or publication flows is complete, evidence is captured, and completion criteria are checked.
- **Risk:** use the frontmatter risk classification and call out any escalation.
- **Boundary:** stay within the skill's declared scope, trust tier, and side-effect policy.

This skill routes only. It does not create issues, tickets, PRs, or project items.

# Work Item Router

Use this skill before `to-spec`, `to-tickets`, or `make-project` when the task involves tracker metadata, project boards, or publication flow.

## Contract

- Input: a request involving specs, tickets, spec/ticket audits, projects, PR metadata, or review-fix comments.
- Output: a routing note that identifies the downstream skill and the relevant governance documents.
- Scope: routing only. Do not draft the artifact here.
- Rule: always read [`docs/agents/index.md`](../../../../docs/agents/index.md) first.
- Rule: prefer the canonical work-item format over ad hoc tracker metadata.

## Workflow

1. Read `docs/agents/index.md`.
2. Identify whether the request is a spec, ticket, spec completion audit, ticket coverage audit, corrective ticket publication, project board, PR publication, review-fix plan, or closeout.
3. Route to the thinnest downstream skill that can finish the work.
4. If metadata is involved, preserve the canonical shape from `docs/agents/work-item-format.md`.

## Completion criteria

- the governance index has been read
- the downstream skill is named
- any required metadata contract is explicit
