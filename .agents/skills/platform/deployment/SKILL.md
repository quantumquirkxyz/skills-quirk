---
name: deployment
category: platform
maturity: stable
version: 1
description: Define how a project is built, released, and rolled back — as a safe operational seam.
capabilities:
  - apply deployment workflow
  - produce deployment artifact
  - validate deployment completion criteria
outputs:
  - Deployment artifact with findings, decisions, recommendations, and validation notes
sideEffects: []
dependencies: []
stopCondition: Define how a project is built, released, and rolled back complete; artifact saved; completion criteria checked.
risk: low
trustTier: 1
maxIterations: 6
---

## Operating Contract

- **Input:** Deployment request, relevant context, constraints, and source evidence.
- **Output:** Deployment artifact with findings, decisions, recommendations, and validation notes.
- **Side effects:** follow the frontmatter declaration; do not broaden scope without explicit user direction.
- **Dependencies:** declared dependencies, referenced skills, and source materials required by the task.
- **Stop condition:** Define how a project is built, released, and rolled back is complete, evidence is captured, and completion criteria are checked.
- **Risk:** use the frontmatter risk classification and call out any escalation.
- **Boundary:** stay within the skill's declared scope, trust tier, and side-effect policy.

# Deployment

Use this skill when the project needs a clear release path. It should define how an immutable build artifact moves from repo to runtime, what can fail, and how to recover without guessing. It covers deployment mechanics; release policy and cadence belong to `release-management`.

## Contract

- Input: deployment brief, runtime context, and release constraints.
- Output: a deployment seam proposal, release path, rollback guidance, and deployment safety gates.
- Scope: design release mechanics, not the actual deployment execution.
- Rule: every deployment path needs an explicit rollback path.
- Rule: keep the release seam as small as possible while still covering the operational reality.
- Rule: identify what must be observable before a rollout is safe to continue.
- Rule: promote the same identified artifact through environments; do not rebuild implicitly between gates.
- Rule: state whether the rollout is all-at-once, rolling, blue-green, canary, or another strategy and why it fits the failure domain.
- Rule: treat destructive or incompatible data migrations as a separate compatibility problem; application rollback alone must not be called sufficient.
- Rule: define who or what can halt promotion and what evidence permits resumption.

## Steps

1. Identify the environments, runtime target, artifact identity, and deployment constraints.
2. Describe the build, artifact promotion, configuration, and secret-injection seams.
3. Choose the rollout strategy and define health, readiness, and abort gates.
4. Define rollback, forward-fix, migration compatibility, and failure ownership.
5. State what must be observable and what evidence makes the deployment safe to continue or complete.

## Completion criteria

- the release path is named
- the rollback path is named
- the artifact and rollout strategy are named
- health and abort gates are concrete
- migration and configuration failure modes are addressed
