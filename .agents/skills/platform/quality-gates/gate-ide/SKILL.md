---
name: gate-ide
category: platform
maturity: stable
version: 1
description: Shift-left quality gate triggered on file-save events. Runs lint, format, typecheck, spellcheck, and lightweight secret scan. Blocks on failure and reports results to agent context.
license: MIT
capabilities:
  - run ide-level checks
  - produce quality gate artifact
  - validate quality gate completion criteria
  - trace gate ide decisions across inputs, constraints, and failure paths
  - validate platform outcomes with evidence, assumptions, and explicit next steps
outputs:
  - type: object
    name: GateIdeArtifact
    properties:
      trigger: { type: string, enum: [file-save] }
      checks:
        type: array
        items:
          type: object
          properties:
            name: { type: string }
            status: { type: string, enum: [passed, failed, skipped, timed_out, partial, inconclusive, quarantined] }
            durationMs: { type: integer }
            output: { type: string }
      blockOnFailure: { type: boolean }
      reportTo: { type: string }
      result: { type: string, enum: [completed, blocked, failed, partial] }
    required: [trigger, checks, blockOnFailure, reportTo, result]
sideEffects: []
dependencies: []
stopCondition: Shift-left quality gate triggered on file-save events complete; structured result returned; completion criteria checked.
risk: low
trustTier: 1
maxIterations: 3
modelTier: fast
promptVersion: "2.0"
artifactType: plan
evaluators:
  - behavioral
  - regression
fixturesPath: .agents/skills/platform/fixtures/behavioral/gate-ide.json
diataxis: how-to
tags: [quality, shift-left, ide, gate]
compatibility: [implement, tdd, publish-open-pr]
approvalRequired: false
approvalFor: []
---

## Contract

- Input: file-save event, changed file paths, project tooling config.
- Output: `GateIdeArtifact` with per-check results and terminal state.
- Scope: IDE-level checks only — lint, format, typecheck, spellcheck, secret scan.
- Rule: run checks in parallel where possible to stay under sub-second budget.
- Rule: lightweight secret scan only — do not run full dependency audit here.
- Rule: report results to agent context immediately; do not block the save operation itself.
- Rule: timeout, partial, inconclusive, or quarantined checks are visible and never silently pass.

## Provenance

| Question | Answer |
|---|---|
| What is the source of truth? | The file-save event and project tooling config (eslint, prettier, typescript, cspell, gitleaks) |
| What is in scope? | Changed files since last save; IDE-level checks only |
| What is explicitly out of scope? | Full test suite, dependency audit, security scan, performance tests |
| Who or what consumes this artifact afterward? | `gate-pre-commit` or agent context for immediate feedback |
| What evidence proves it is done? | All checks completed, results reported, structured result returned |
| What risk remains? | False positives from spellchecker; secret scan is lightweight and may miss obfuscated secrets |

## Artifact

Return `GateIdeArtifact` as structured output in the current response. Do not write local artifact files unless the user explicitly asks for an export.

## Process

### 1. Detect changed files
Receive the file-save event payload. Extract the list of changed file paths. If no files changed, skip checks and report idle.

### 2. Run lint
Execute the project's linter (eslint, pylint, rubocop, etc.) against changed files only. Capture exit code, stdout, and stderr.

### 3. Run format check
Execute the formatter in check mode (prettier --check, black --check, etc.). Do not modify files.

### 4. Run typecheck
Execute the type checker (tsc --noEmit, mypy, etc.) against changed files and their dependents.

### 5. Run spellcheck
Execute spellchecker (cspell, codespell) against changed files. Flag unknown words but do not block on them unless configured as errors.

### 6. Run lightweight secret scan
Scan changed files for common secret patterns (API keys, tokens, passwords). Use regex-based detection only — do not run full gitleaks or truffleHog here.

### 7. Aggregate results
Compile all check results into `GateIdeArtifact`. Determine terminal state:
- If any check failed and `blockOnFailure` is true → `blocked`
- If all checks passed → `completed`
- If checks errored → `failed`
- If a check timed out, is partial, or is inconclusive → `partial` unless policy marks it failed

### 8. Record risk, provenance, and isolation
Classify changed-file risk, including dependency/configuration/security paths, and record file/tool versions, content provenance, hermeticity, and whether the workspace is trusted. Scan fork, downloaded, or untrusted content without credentials or write-capable access. Route elevated risk to the next gate.

### 9. Run applicable AI evaluation
When prompts, model adapters, agent behavior, or evaluation fixtures change, run the repository-declared lightweight evaluation or mark it `inconclusive` with the missing evidence and downstream gate. Do not invent a command or score.

### 10. Report to agent context
Publish a concise summary to agent context so the user sees results immediately.

## Completion

- all 5 checks have run or been explicitly skipped with reason
- structured result returned
- results reported to agent context
- terminal state correctly reflects `blockOnFailure` policy
- changed-risk coverage, secret-scan status, and provenance are recorded
- bypass attempts are recorded with actor, reason, expiry, approver, and audit status


## P1 Risk And Failure Handling

- Calculate changed-risk coverage from modified files, dependency manifests, generated code, configuration, and security-sensitive paths; route elevated risk to `gate-pre-commit` or `gate-ci`.
- Treat formatter, linter, typechecker, and secret-scan timeouts as `failed` unless an explicit, visible local policy marks the check advisory; never silently pass a timeout.
- Retries are bounded and diagnostic only. A flaky result remains `failed` or `skipped` with owner, expiry, and reproduction data.
- Fork, untrusted workspace, and downloaded content are scanned without secrets or write-capable credentials; report isolation status in the artifact.
- Report changed-file provenance, tool versions, timeout/retry data, and all skipped checks with reasons.
- Quarantine requires an owner, expiry, linked issue, and re-entry condition; it remains non-passing.
- Stop and report `failed` when isolation, secret-scan integrity, or required evidence cannot be established.
