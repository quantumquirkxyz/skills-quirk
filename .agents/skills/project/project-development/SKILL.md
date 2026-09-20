---
name: project-development
category: project
maturity: stable
version: 1
description: Evaluate a project's shape, agent fit, and architectural starting point — before the main workflow begins.
capabilities:
  - apply project development workflow
  - produce project development artifact
  - validate project development completion criteria
outputs:
  - Project Development artifact with findings, decisions, recommendations, and validation notes
sideEffects: []
dependencies: []
stopCondition: Evaluate a project's shape, agent fit, and architectural starting point complete; artifact saved; completion criteria checked.
risk: low
trustTier: 1
maxIterations: 6
---

## Operating Contract

- **Input:** Project Development request, relevant context, constraints, and source evidence.
- **Output:** Project Development artifact with findings, decisions, recommendations, and validation notes.
- **Side effects:** follow the frontmatter declaration; do not broaden scope without explicit user direction.
- **Dependencies:** declared dependencies, referenced skills, and source materials required by the task.
- **Stop condition:** Evaluate a project's shape, agent fit, and architectural starting point is complete, evidence is captured, and completion criteria are checked.
- **Risk:** use the frontmatter risk classification and call out any escalation.
- **Boundary:** stay within the skill's declared scope, trust tier, and side-effect policy.

# Project Development

Use this skill to decide what kind of project you are dealing with before the workflow commits to a path. A standard project can still be unusual in shape: batch pipeline, agentic system, interactive app, toolchain, or mixed stack. The point of this skill is to classify the shape and choose the right first seam, not to design the whole system.

## Contract

- Input: project brief, repo state, and target stack.
- Output: a project fit assessment, a project shape classification, and an initial flow recommendation.
- Scope: decide the project shape and the first workflow step; do not draft the spec or implementation plan.
- Rule: prefer the smallest workflow that can still respect the project's risk and interface complexity.
- Rule: call out when the project is a poor fit for agent-heavy workflow rather than forcing one.
- Rule: if the project is multi-surface, identify the first surface that should become the seam.

## Steps

1. Read the minimum repo context needed to understand the stack and current constraints.
2. Classify the project shape: interactive app, batch pipeline, agentic system, library, backend service, or hybrid.
3. Identify whether the first useful seam is in UI, API, data, execution, or governance.
4. Recommend the next workflow skill and explain why it is the thinnest safe path.

## Completion criteria

- the project shape is named
- the likely first seam is named
- the next workflow skill is recommended with rationale
