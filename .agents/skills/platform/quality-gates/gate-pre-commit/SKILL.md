---
name: gate-pre-commit
category: platform
maturity: stable
version: 1
description: Shift-left quality gate triggered on git-commit events. Runs lint + typecheck on changed files only, unit tests for changed files only, lightweight dependency vulnerability check, and blocks on failure within a 10s budget.
license: MIT
capabilities:
  - run scoped checks
  - produce quality gate artifact
  - validate quality gate completion criteria
  - trace gate pre commit decisions across inputs, constraints, and failure paths
  - validate platform outcomes with evidence, assumptions, and explicit next steps
outputs:
  - type: object
    name: GatePreCommitArtifact
    properties:
      trigger: { type: string, enum: [git-commit] }
      checks:
        type: array
        items:
          type: object
          properties:
            name: { type: string }
            status: { type: string, enum: [passed, failed, skipped, timed_out, partial, inconclusive, quarantined] }
            durationMs: { type: integer }
            output: { type: string }
      maxDuration: { type: integer }
      blockOnFailure: { type: boolean }
      result: { type: string, enum: [completed, blocked, failed, partial] }
    required: [trigger, checks, maxDuration, blockOnFailure, result]
sideEffects: []
dependencies: []
stopCondition: Shift-left quality gate triggered on git-commit events complete; structured result returned; completion criteria checked.
risk: low
trustTier: 1
maxIterations: 3
modelTier: fast
promptVersion: "2.0"
artifactType: plan
evaluators:
  - behavioral
  - regression
fixturesPath: .agents/skills/platform/fixtures/behavioral/gate-pre-commit.json
diataxis: how-to
tags: [quality, shift-left, git, gate]
compatibility: [implement, publish-open-pr]
approvalRequired: false
approvalFor: []
---

## Contract

- Input: git-commit event, staged diff, project tooling config.
- Output: `GatePreCommitArtifact` with per-check results and terminal state.
- Scope: pre-commit checks only — lint/typecheck on changed files, unit tests on changed files, lightweight dependency vuln check.
- Rule: enforce maxDuration of 10 seconds; skip slow checks rather than exceed budget.
- Rule: scope to changed files only — do not run full suite here.
- Rule: block on failure; commit must not proceed if any check fails.
- Rule: timeout, partial, inconclusive, or unverified secret/provenance evidence blocks the commit.

## Provenance

| Question | Answer |
|---|---|
| What is the source of truth? | The git-commit event and staged diff |
| What is in scope? | Changed files since last commit; lint, typecheck, unit tests, dependency vuln check |
| What is explicitly out of scope? | Full integration suite, security scan, performance tests, E2E tests |
| Who or what consumes this artifact afterward? | `gate-ci` or commit process |
| What evidence proves it is done? | All checks completed within 10s budget, structured result returned, terminal state determined |
| What risk remains? | Skipped checks due to time budget; lightweight vuln check may miss transitive vulnerabilities |

## Artifact

Return `GatePreCommitArtifact` as structured output in the current response. Do not write local artifact files unless the user explicitly asks for an export.

## Process

### 1. Capture staged diff
Run `git diff --cached --name-only` to get the list of staged files. If no staged files, report idle.

### 2. Run lint + typecheck on changed files
Execute linter and type checker against only the staged files. Use project-native tooling (eslint, tsc --noEmit, etc.).

### 3. Run unit tests for changed files
Map changed files to their corresponding test files. Run only those unit tests. If no test files map, skip with reason.

### 4. Run lightweight dependency vulnerability check
Execute a fast dependency check (npm audit --audit-level=high, pip-audit, etc.). Limit to direct dependencies only.

### 5. Run secret and provenance checks
Scan staged content and dependency/configuration changes for secrets and record commit identity, tool versions, file provenance, and isolation. Do not expose credentials to hooks or untrusted content. If a required check cannot run within the budget, mark it `timed_out` or `skipped` with a downstream owner; do not claim success.

### 6. Run applicable AI evaluation
For staged prompts, model adapters, agent policies, or evaluation fixtures, record the applicable evaluation requirement and result. Do not invent an evaluator; missing evidence is `inconclusive` and routes to CI.

### 7. Enforce time budget
Track elapsed time. If any check risks exceeding 10 seconds total, skip remaining checks and mark them as `skipped` with reason `time-budget-exceeded`.

### 8. Aggregate results
Compile all check results into `GatePreCommitArtifact`. Terminal state:
- Any `failed` → `blocked` (commit prevented)
- All `passed` → `completed`
- Any `timed_out`, `partial`, or `inconclusive` → `partial` and block
- Error → `failed`

### 9. Enforce blockOnFailure
If terminal state is `blocked`, return exit code 1 to prevent the commit.

## Completion

- all applicable checks have run or been skipped with reason
- total duration within 10s budget
- structured result returned
- commit blocked if any check failed
- changed-risk coverage and required downstream checks are recorded
- secret, provenance, isolation, and applicable AI-evaluation evidence is recorded
- every bypass attempt has actor, reason, scope, expiry, approver, and audit status


## P0/P1 Trust And Risk Controls

- Derive changed-risk coverage from the staged diff. Changes to auth, deployment, policy, dependency, migration, or secret-handling paths require the mapped higher-level checks and cannot be waived by this fast gate.
- Run hooks in an isolated, non-privileged context; never expose signing keys, cloud credentials, or protected-environment tokens to hooks or untrusted repository content.
- A timeout is a failed check for commit purposes. Bounded retries may identify flaky behavior but cannot convert it to `passed`; quarantine must include owner and expiry.
- Record staged commit identity, tool versions, duration budget, retry/timeout facts, and reasons for every skip.
- Quarantine is diagnostic only and requires owner, expiry, linked issue, and re-entry condition; quarantined checks never pass.
- Stop on non-hermetic execution, unavailable untrusted-fork isolation, secret-scan failure, or expired/unapproved bypass.
