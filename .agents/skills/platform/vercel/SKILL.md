---
name: vercel
category: platform
maturity: experimental
version: 1
description: Shape Vercel deployment and runtime concerns into a clear operational seam — with explicit platform constraints.
capabilities:
  - apply vercel workflow
  - produce vercel artifact
  - validate vercel completion criteria
outputs:
  - Vercel artifact with findings, decisions, recommendations, and validation notes
sideEffects: []
dependencies: []
stopCondition: Shape Vercel deployment and runtime concerns into a clear operational seam complete; artifact saved; completion criteria checked.
risk: low
trustTier: 1
maxIterations: 6
---

## Operating Contract

- **Input:** Vercel request, relevant context, constraints, and source evidence.
- **Output:** Vercel artifact with findings, decisions, recommendations, and validation notes.
- **Side effects:** follow the frontmatter declaration; do not broaden scope without explicit user direction.
- **Dependencies:** declared dependencies, referenced skills, and source materials required by the task.
- **Stop condition:** Shape Vercel deployment and runtime concerns into a clear operational seam is complete, evidence is captured, and completion criteria are checked.
- **Risk:** use the frontmatter risk classification and call out any escalation.
- **Boundary:** stay within the skill's declared scope, trust tier, and side-effect policy.

# Vercel

Use this skill when a project runs on Vercel and the deployment/runtime seam needs to be clear. It should define what Vercel owns, what the app owns, and where operational expectations live.

## Contract

- Input: Vercel brief, runtime constraints, and deployment target.
- Output: a Vercel seam proposal, runtime guidance, and operational guidance.
- Scope: design the Vercel shape, not the full deployment implementation.
- Rule: make runtime expectations explicit before choosing platform features.
- Rule: keep platform-specific coupling visible.
- Rule: describe rollback and observability in the same pass as the runtime seam.

## Steps

1. Identify the platform responsibilities and app responsibilities.
2. Define the runtime seam and its constraints.
3. Note deployment and rollback expectations.
4. Call out any Vercel-specific lock-in that matters.

## Completion criteria

- the runtime seam is named
- the platform responsibilities are explicit
- the lock-in tradeoff is named
