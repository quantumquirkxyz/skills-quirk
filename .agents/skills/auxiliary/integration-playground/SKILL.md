---
name: "integration-playground"
category: "auxiliary"
maturity: "stable"
description: "Create a disposable fixture environment for safely exercising Skills against local APIs, data, and files; use when testing a Skill with isolated local fixtures."
license: "MIT"
version: "1"
capabilities:
  - apply integration playground methods within explicit auxiliary boundaries
  - analyze create a disposable fixture environment for safely exercising skills against local apis, data, and files; use when testing a skill with isolated local fixtures with assumptions, constraints, and failure modes
  - produce and validate a auxiliary artifact with evidence, decisions, and next steps
inputs:
  type: object
  properties:
    fixture:
      type: object
      description: "Fixture definition describing APIs, data, and files to expose in the playground"
    command:
      type: array
      items:
        type: string
      description: "Optional executable plus argument array; runs shell-free"
    outputDirectory:
      type: string
      description: "Temporary output directory under the system temporary directory"
  required:
    - fixture
outputs:
  - type: object
    name: IntegrationPlaygroundArtifact
    properties:
      result:
        type: object
        description: "Disposable playground directory path, command exit status and output, and command evidence"
      required: [result]
dependencies: []
sideEffects: []
stopCondition: "The command ran in the disposable fixture directory and its exit status and output are recorded."
risk: "low"
trustTier: "2"
promptVersion: "2.0"
artifactType: "auxiliary"
modelTier: "fast"
evaluators: ["behavioral", "regression"]
fixturesPath: tests/skill-output-migration-auxiliary-cms-compilers-cs-db.test.mjs
diataxis: "how-to"
tags: ["auxiliary"]
compatibility: []
approvalRequired: false
approvalFor: []
maxIterations: "6"
---

## Contract

**Input schema** (`inputs`):
- `fixture` (object, required): Fixture definition describing APIs, data, and files to expose in the playground. May include file contents, environment variables, network mocks, and expected side effects.
- `command` (array of strings, optional): Executable plus argument array to run inside the playground. Passed as an array, never through a shell.
- `outputDirectory` (string, optional): Temporary output directory under the system temporary directory. Defaults to a fresh disposable directory.

**Output schema** (`outputs`):
- `playgroundDirectory` (string): Path to the disposable playground directory.
- `exitStatus` (string): Exit status of the executed command, if a command was supplied.
- `stdout` (string): Standard output of the executed command, if a command was supplied.
- `stderr` (string): Standard error of the executed command, if a command was supplied.
- `evidence` (object): Command evidence including fixture definition, command, exit status, stdout, stderr, and generated files.

**Rules**:
- Rule: output must be under the system temporary directory; only Node.js commands run with a minimal environment and commands never pass through a shell.
- Rule: documented standards override defaults; explicit project rules take precedence.
- Rule: if blocked by missing context or dependencies, surface the blocker before proceeding.
- Rule: playgrounds are disposable; never persist output outside the temporary directory.
- Rule: sandbox boundaries must not be crossed; fixtures must not reference production hosts, credentials, or broad filesystem paths.

## Provenance

| Question | Answer |
|---|---|
| What is the source of truth? | The user's request, originating spec/issue, and the skill's declared outputs |
| What is in scope? | Work covered by the skill's acceptance criteria and completion rules |
| What is explicitly out of scope? | Files, behaviors, and decisions outside the skill's declared boundary |
| Who or what consumes this artifact afterward? | The next skill in the workflow or the user |
| What evidence proves it is done? | Completion criteria met, artifact saved, validation passed |
| What risk remains? | Subjective judgment calls, missing context, or external dependency failures |

**Evidence requirements**:
- Fixture definition recorded before execution.
- Command, exit status, stdout, stderr captured after execution.
- Generated files listed with paths relative to the playground directory.
- Artifact saved as both JSON and Markdown under `.agents/skills/platform/artifacts/integration-playground/`.

**Risk assessment — sandbox escape**:
- Low risk: commands run with a minimal environment and never through a shell.
- Fixtures must not include secrets, production data, or broad filesystem targets.
- Output is constrained to disposable temporary directories under the system temp directory.
- If a command attempts to access paths outside the playground, the skill must surface it as a blocker rather than proceeding.

## Artifact

Emit `IntegrationPlaygroundArtifact` as both:
- JSON: `.agents/skills/platform/artifacts/integration-playground/{identifier}.json`
- Markdown view: same filename with `.md` extension

**Guardrails**:
- Guardrail: create playgrounds only in disposable temporary directories under the system temp directory.
- Guardrail: keep commands shell-free and pass arguments as arrays.
- Guardrail: never include secrets, production data, or broad filesystem targets in fixtures.
- Guardrail: preserve command, exit status, stdout, stderr, and fixture definition as evidence.
- Guardrail: do not cross sandbox boundaries; all side effects must remain inside the playground directory.

## Steps

1. **Define the fixture data and the command to exercise.**
   - Completion criteria: fixture object is defined with file contents, environment variables, and expected side effects; command (if any) is an array of strings with no shell invocation.
   - Guidance: declare all files the playground will expose, the minimal environment variables required, and any network mocks. Keep the command scoped to a single skill invocation.

2. **Create the isolated playground under a temporary output path.**
   - Completion criteria: a new directory exists under the system temporary directory; it is empty or contains only the fixture files; its path is recorded as `playgroundDirectory`.
   - Guidance: use a unique, disposable directory name; never reuse an existing playground directory; do not write outside this directory.

3. **Run the command with the minimal environment required.**
   - Completion criteria: the command executed with only the environment variables declared in the fixture; exit status, stdout, and stderr are captured; no shell was involved.
   - Guidance: pass the command as an argument array, not a shell string; restrict the environment to what the fixture declares; observe sandbox boundaries.

4. **Record stdout, stderr, exit status, and generated files.**
   - Completion criteria: all command output and the exit status are saved as evidence; every file created or modified inside the playground is listed; evidence object is complete.
   - Guidance: capture output verbatim; do not filter or truncate; record relative paths for generated files.

5. **Summarize what the playground proved and what it did not prove.**
   - Completion criteria: a human-readable summary states which fixture behaviors were exercised, which commands succeeded or failed, and any limitations observed; untested behaviors are explicitly listed.
   - Guidance: distinguish proven behavior from assumptions; note edge cases the fixture did not cover; identify what the next skill or consumer should verify.

## Completion

**Per-step completion criteria**:
- Step 1 complete: fixture definition and optional command are declared and validated.
- Step 2 complete: disposable playground directory exists under the system temp directory.
- Step 3 complete: command executed shell-free with minimal environment; exit status and output captured.
- Step 4 complete: evidence recorded with stdout, stderr, exit status, and generated file list.
- Step 5 complete: summary written, limitations listed, next consumer identified.

**Global completion criteria**:
- The skill's completion criteria are explicitly checked
- The artifact is saved and validated
- Any blockers or skipped validations are documented
- The next consumer is identified or the work is handed off

## AGENTS.md vocabulary

- **quirk Skills**: canonical skills live in `.agents/skills/` as `<domain>/<skill>/SKILL.md` directories; they are the only source of truth for skill content.
- **quirk Method**: the bundle's method applied to work in this repo: artifact-first design, state-machine workflows, and shift-left quality gates.
- **canonical skill**: the authoritative `SKILL.md` in `.agents/skills/`; `.claude/skills/` is a generated compatibility view of relative symlinks and is never hand-edited.
- **provenance**: the documented source of truth, scope, consumers, evidence, and remaining risk for an artifact.

## References

- `skill-sandbox` — create, test, and iterate on experimental skills in an isolated environment without affecting the canonical skills bundle.
- `skill-testing-framework` — validate Skill structure, contracts, dependencies, anti-patterns, and isolated execution before promotion.
- `evaluate-skill` — evaluate a Skill against fixed scenarios for routing, completion, and artifact validity.
- `skill-quality-gate` — run and interpret the skill bundle quality gate across schema, lockfile, semantic, routing, placeholder, rule, metadata, and side-effect checks before promotion or publication.
- `integration-playground` — this skill; create a disposable fixture environment for safely exercising Skills against local APIs, data, and files.

## Examples

**Example: testing a skill command against a local fixture**

1. Define the fixture:
```json
{
  "files": {
    "input.txt": "hello world"
  },
  "env": { "NODE_ENV": "test" },
  "expectedSideEffects": ["output.txt created"]
}
```

2. Command to exercise (shell-free, array form):
```json
["node", "-e", "const fs=require('fs');fs.writeFileSync('output.txt',fs.readFileSync('input.txt','utf8').toUpperCase())"]
```

3. Output directory:
```json
"/tmp/kilo/integration-playground-abc123"
```

4. Expected result: `exitStatus` is `"0"`, `stdout` is empty, `stderr` is empty, and `output.txt` contains `HELLO WORLD` inside the playground directory.

5. Summary: the command proved the skill can read and write files within the sandbox; it did not prove behavior outside the temporary directory.

---
@include .agents/skills/platform/contract-base.xml