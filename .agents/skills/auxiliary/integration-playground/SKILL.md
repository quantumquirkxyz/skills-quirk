---
name: integration-playground
category: auxiliary
maturity: experimental
description: Create a disposable fixture environment for safely exercising Skills against local APIs, data, and files; use when testing a Skill with isolated local fixtures.
version: 1
capabilities:
  - create-isolated-fixtures
  - run-sandboxed-command
  - preserve-playground-evidence
inputs:
  - fixture-definition
  - command
  - output-directory
outputs:
  - playground-directory
  - execution-result
  - stdout-and-stderr
dependencies:
  - skill-sandbox
sideEffects:
  - write-files
stopCondition: The command ran in the disposable fixture directory and its exit status and output are recorded.
risk: low
trustTier: 2
---

# Integration Playground

## Contract

- Input: JSON fixture definition, an optional executable plus argument array, and a temporary output directory.
- Output: disposable playground directory; when a command is supplied, its exit status, stdout, stderr, and command evidence.
- Boundary: output must be under the system temporary directory; only Node.js commands run with a minimal environment and commands never pass through a shell.

Run `node .agents/skills/platform/skill-lab.mjs playground --output /tmp/quirk-playground --fixtures '{"api":{"status":"ok"}}' --command '["node","script.mjs"]'`. Never point it at a production directory or pass credentials into a playground command.

## Rules

- Rule: create playgrounds only in disposable temporary directories.
- Rule: keep commands shell-free and pass arguments as arrays.
- Rule: never include secrets, production data, or broad filesystem targets in fixtures.
- Rule: preserve command, exit status, stdout, stderr, and fixture definition as evidence.

## Steps

1. Define the fixture data and the command to exercise.
2. Create the isolated playground under a temporary output path.
3. Run the command with the minimal environment required.
4. Record stdout, stderr, exit status, and generated files.
5. Summarize what the playground proved and what it did not prove.

## Completion Criteria

- playground path is disposable
- command evidence is recorded
- fixture scope excludes production data and credentials
