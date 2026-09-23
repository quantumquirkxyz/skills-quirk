---
name: execution-policy
category: auxiliary
maturity: stable
description: Decide whether a Skill action is allowed, requires approval, or must stop.
disable-model-invocation: true
version: 1
capabilities:
  - classify-action
  - check-approval-threshold
  - require-approval
inputs:
  - requested action
  - skill manifest
outputs:
  - allow/block decision
  - approval requirement
  - rollback path
dependencies: []
sideEffects: []
stopCondition: The action is allowed or blocked with reason, approval requirement is clear, and rollback is named.
risk: low
trustTier: 1
---

## Operating Contract

- **Input:** Execution Policy request, relevant context, constraints, and source evidence.
- **Output:** Execution Policy artifact with findings, decisions, recommendations, and validation notes.
- **Side effects:** follow the frontmatter declaration; do not broaden scope without explicit user direction.
- **Dependencies:** declared dependencies, referenced skills, and source materials required by the task.
- **Stop condition:** Decide whether a Skill action is allowed, requires approval, or must stop is complete, evidence is captured, and completion criteria are checked.
- **Risk:** use the frontmatter risk classification and call out any escalation.
- **Boundary:** stay within the skill's declared scope, trust tier, and side-effect policy.

# Execution Policy

This skill is advisory only. It does not change repository state or perform the action it judges.

Use this skill before any risky state change.

## Steps

1. Classify the requested action as read, write, delete, network, or external write.
2. Check the Skill manifest side effects and approval threshold.
3. Require explicit approval for destructive or irreversible actions.
4. Record the decision and rollback path.

## Completion criteria

- the action is allowed or blocked with reason
- the approval requirement is clear
- rollback is named

## Rules

- Rule: classify the action before considering convenience or urgency.
- Rule: treat destructive, external, credential-bearing, and irreversible actions as higher scrutiny.
- Rule: approval requirements must name the exact action and target.
- Rule: if rollback is impossible or unproven, say so explicitly.

## Decision Output

Return a concise decision with:

- classification: read, write, delete, network, external write, or destructive
- decision: allow, require approval, or stop
- reason: the specific policy concern
- rollback: how to recover or why recovery is unavailable
