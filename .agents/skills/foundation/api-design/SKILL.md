---
name: api-design
category: foundation
maturity: stable
version: 1
description: Design a small, durable API seam — with a deep backend and explicit caller contract boundaries.
capabilities:
  - apply api design workflow
  - produce api design artifact
  - validate api design completion criteria
outputs:
  - Api Design artifact with findings, decisions, recommendations, and validation notes
sideEffects: []
dependencies: []
stopCondition: Design a small, durable API seam complete; artifact saved; completion criteria checked.
risk: low
trustTier: 1
maxIterations: 6
---

## Operating Contract

- **Input:** Api Design request, relevant context, constraints, and source evidence.
- **Output:** Api Design artifact with findings, decisions, recommendations, and validation notes.
- **Side effects:** follow the frontmatter declaration; do not broaden scope without explicit user direction.
- **Dependencies:** declared dependencies, referenced skills, and source materials required by the task.
- **Stop condition:** Design a small, durable API seam is complete, evidence is captured, and completion criteria are checked.
- **Risk:** use the frontmatter risk classification and call out any escalation.
- **Boundary:** stay within the skill's declared scope, trust tier, and side-effect policy.

# API Design

Use this skill when the backend needs a stable public contract. It should decide what the caller must know, what stays behind the seam, and how the contract handles errors, versioning, and evolution.

## Contract

- Input: API brief, backend context, and integration constraints.
- Output: an API seam proposal, contract guidance, and error/versioning guidance.
- Scope: design the contract, not the full implementation.
- Rule: keep the API as small as possible while still supporting the real use case.
- Rule: name errors and versioning choices explicitly when they affect callers.
- Rule: prefer a contract that can survive backend refactors without churn.

## Steps

1. Identify the caller's core job.
2. Choose the smallest seam that supports that job.
3. Define success, failure, and evolution behavior.
4. Describe what remains hidden behind the API.

## Completion criteria

- the API seam is named
- the caller contract is explicit
- the error and versioning approach is named
