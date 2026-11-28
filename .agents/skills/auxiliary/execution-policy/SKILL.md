---
name: "execution-policy"
category: "auxiliary"
maturity: "stable"
description: "Decide whether a Skill action is allowed, requires approval, or must stop."
license: "MIT"
disable-model-invocation: true
version: "1"
capabilities:
  - apply execution policy methods within explicit auxiliary boundaries
  - analyze decide whether a skill action is allowed, requires approval, or must stop with assumptions, constraints, and failure modes
  - produce and validate an auxiliary artifact with evidence, decisions, and next steps
inputs:
  type: object
  required:
    - requestedAction
    - skillManifest
  properties:
    requestedAction:
      type: object
      required:
        - kind
        - target
      properties:
        kind:
          type: string
          enum: ["read", "write", "delete", "network", "external"]
          description: "Action class: read, write, delete, network, or external"
        target:
          type: string
          description: "File, path, URL, or system target of the action"
        description:
          type: string
          description: "Human-readable summary of what the action does"
        destructive:
          type: boolean
          default: false
          description: "Whether the action mutates or destroys state irreversibly"
    skillManifest:
      type: object
      required:
        - name
        - sideEffects
      properties:
        name:
          type: string
        sideEffects:
          type: array
          items:
            type: string
          description: "Declared side effects from the skill manifest"
        approvalThreshold:
          type: string
          enum: ["none", "anyWrite", "anyDelete", "anyNetwork", "externalOnly"]
          default: "anyWrite"
outputs:
  - type: object
    name: ExecutionPolicyArtifact
    properties:
      result:
        type: object
        description: "Execution-policy decision with reason, rollback path, approval requirement, evidence, and risk level"
      required: [result]
dependencies: []
sideEffects: []
stopCondition: "The action is allowed or blocked with reason, approval requirement is clear, and rollback is named."
risk: "low"
trustTier: "1"
promptVersion: "2.0"
artifactType: "auxiliary"
modelTier: "reasoning"
evaluators: ["behavioral", "regression"]
fixturesPath: tests/skill-output-migration-auxiliary-cms-compilers-cs-db.test.mjs
diataxis: "how-to"
tags: ["auxiliary"]
compatibility: []
approvalRequired: false
approvalFor: []
maxIterations: "6"
---

## Normative Rules

- Classify every requested action as exactly one of `read`, `write`, `delete`, `network`, or `external`, and record `destructive` (default `false`).
- `read` is allowed by default; `write` and `network` require the manifest side-effect check; `delete`, `external`, and every destructive action require explicit approval.
- Apply `skillManifest.approvalThreshold`; when it requires approval, set `decision: approvalRequired` and do not proceed until approval is granted.
- If the action is blocked or approval is required, stop before execution. This skill only classifies and records; it never performs the action.
- Always record a concrete rollback procedure or artifact path, including for allowed actions.

## Vocabulary

- **quirk Skills** — The author-owned skills bundle in this repository; canonical skills live under `.agents/skills/`.
- **quirk Method** — The workflow philosophy that governs how skills route work, preserve context, produce artifacts, review changes, repair findings, and ship.
- **canonical skill** — A skill folder under `.agents/skills/` with a `SKILL.md` entrypoint and matching lockfile entry; this file is the canonical source for `execution-policy`.
- **provenance** — The recorded origin and evidence trail supporting an execution-policy decision, including manifest side effects, rollback path, and consumer.

## Contract

### Input schema

| Field | Type | Required | Description |
|---|---|---|---|
| `requestedAction.kind` | `string` (enum: read, write, delete, network, external) | Yes | Action class |
| `requestedAction.target` | `string` | Yes | File, path, URL, or system target |
| `requestedAction.description` | `string` | No | Human-readable summary |
| `requestedAction.destructive` | `boolean` | No (default `false`) | Whether the action mutates or destroys state irreversibly |
| `skillManifest.name` | `string` | Yes | Skill name |
| `skillManifest.sideEffects` | `string[]` | Yes | Declared side effects from the skill manifest |
| `skillManifest.approvalThreshold` | `string` (enum: none, anyWrite, anyDelete, anyNetwork, externalOnly) | No (default `anyWrite`) | Approval gating policy |

### Output schema

| Field | Type | Required | Description |
|---|---|---|---|
| `decision` | `string` (enum: allowed, blocked, approvalRequired) | Yes | Execution-policy decision |
| `reason` | `string` | Yes | Human-readable justification |
| `rollbackPath` | `string` | Yes | Named rollback procedure or artifact path |
| `approvalRequired` | `boolean` | No (default `false`) | Whether explicit approval is needed |
| `evidence` | `string[]` | No | Supporting evidence cited |
| `risk` | `string` (enum: low, medium, high) | No (default `low`) | Risk level of proceeding |

### Classification rules

- `read`: inspects files, state, or metadata without mutation; default `allowed`.
- `write`: mutates files, repository state, or records; requires manifest side-effect check; default `allowed` unless `approvalThreshold` is `anyWrite` or higher.
- `delete`: removes files, records, or state; requires explicit approval; default `approvalRequired`.
- `network`: makes outbound HTTP/RPC/socket calls; requires manifest side-effect check; default `allowed` unless `approvalThreshold` is `anyNetwork` or higher.
- `external`: invokes tools, processes, or services outside the skill boundary; requires explicit approval; default `approvalRequired`.
- Destructive actions (`destructive: true`) always require explicit approval regardless of `kind`.
- When `decision` is `blocked` or `approvalRequired`, the action must not proceed until the stop condition is satisfied.

## Provenance

| Question | Answer |
|---|---|
| What is the source of truth? | The user's request, originating spec/issue, skill manifest `sideEffects`, and the `execution-policy` canonical skill declaration |
| What is in scope? | Classification of the requested action, manifest side-effect verification, approval determination, rollback path naming, and artifact emission |
| What is explicitly out of scope? | Performing the action itself, modifying repository state, or bypassing approval gates |
| Who or what consumes this artifact afterward? | The next skill in the workflow, the user, or `verify-delegation` as a blackbox check |
| What evidence proves it is done? | Emitted `ExecutionPolicyArtifact` JSON + Markdown, completion criteria met, validation passed, rollback path named |
| What risk remains? | Incorrect policy decisions (false allowed/blocked), missing manifest side effects, unstated destructive intent, or reliance on stale manifest data |

### Evidence requirements

- Cite the skill manifest `sideEffects` array for the target skill.
- Record the `requestedAction.kind` and `destructive` flag used for classification.
- Name the rollback procedure or artifact path that would reverse the action.
- Document any `approvalRequired` determination and which threshold triggered it.

### Risk assessment

Incorrect execution-policy decisions are the primary risk:
- **False allowed**: a destructive or network action proceeds without approval, causing unintended state change or external side effects.
- **False blocked**: a safe read action is halted, stalling workflow progress unnecessarily.
- **Missing manifest side effects**: the skill manifest under-declares side effects, so the policy under-estimates risk.
- **Stale manifest data**: the manifest side effects do not match the skill's current behavior.

Mitigation: treat this skill as advisory only, require explicit approval for destructive/external actions, and re-verify against `side-effect-auditor` when manifest data is uncertain.

## Operational Notes

This skill is advisory only: it classifies, recommends, and records without changing repository state or performing the judged action. Destructive (`destructive: true`), `delete`, and `external` actions receive an explicit approval requirement before a consumer proceeds. A consumer waits for that approval whenever `approvalRequired` is true. The artifact records a rollback path even when the decision is `allowed`, preserving a reversal route if new evidence emerges.

## Steps

### 1. Classify the requested action

Read `requestedAction.kind` and map it to one of: `read`, `write`, `delete`, `network`, `external`. Note `requestedAction.destructive` and `requestedAction.target`.

**Completion criteria:**
- `requestedAction.kind` is one of the five enumerated classes.
- `destructive` flag is read and recorded (default `false`).
- Classification is documented in the artifact `reason`.

### 2. Check the Skill manifest side effects

Read `skillManifest.sideEffects` and `skillManifest.approvalThreshold`. Compare declared side effects against the action target and kind.

**Completion criteria:**
- All manifest `sideEffects` are listed in the artifact `evidence`.
- `approvalThreshold` is recorded and applied to the classification.
- Mismatch between manifest claims and action kind is flagged in `reason`.

### 3. Require explicit approval for destructive or irreversible actions

If `destructive: true`, `kind` is `delete` or `external`, or `approvalThreshold` mandates it, set `decision: approvalRequired` and `approvalRequired: true`.

**Completion criteria:**
- Destructive/delete/external actions are never silently `allowed`.
- `approvalRequired` is set to `true` exactly when the rules demand it.
- The reason cites the specific rule that triggered the approval requirement.

### 4. Record the decision and rollback path

Emit the `ExecutionPolicyArtifact` with `decision`, `reason`, `rollbackPath`, and supporting `evidence`.

**Completion criteria:**
- `decision` is one of `allowed`, `blocked`, `approvalRequired`.
- `rollbackPath` names a concrete rollback procedure or artifact path.
- Artifact is saved as JSON and Markdown under `.agents/skills/platform/artifacts/execution-policy/`.

## Artifact

Emit `ExecutionPolicyArtifact` as both:
- JSON: `.agents/skills/platform/artifacts/execution-policy/{identifier}.json`
- Markdown view: same filename with `.md` extension

## References

- `subagent-swarm` — coordinated sub-agent roles with handoff contracts; execution policy gates which sub-agent actions may proceed.
- `verify-delegation` — blackbox-verifies a delegated worker's claim; uses the execution-policy artifact as an input gate.
- `side-effect-auditor` — audits skill side-effect, risk, trust tier, dependency, and boundary metadata; cross-checks manifest side effects declared in step 2.
- `work-item-router` — routes work items to skills; execution policy decisions inform whether a routed action is permitted.
- `skill-quality-gate` — runs the skill bundle quality gate; validates that execution-policy artifacts meet schema and evidence standards.

## Examples

### Write-code action scenario

**Input:**
```json
{
  "requestedAction": {
    "kind": "write",
    "target": "src/components/Button.tsx",
    "description": "Add a new Button component with click handler",
    "destructive": false
  },
  "skillManifest": {
    "name": "frontend-design",
    "sideEffects": ["writes files under src/components/"],
    "approvalThreshold": "anyWrite"
  }
}
```

**Reasoning:**
1. Kind `write` targeting `src/components/Button.tsx`.
2. Manifest declares side effect `writes files under src/components/`; target matches.
3. `approvalThreshold: anyWrite` means any write action requires approval.
4. Action is not destructive, so it is not blocked, but approval is required.

**Output:**
```json
{
  "decision": "approvalRequired",
  "reason": "Write action to src/components/Button.tsx matches manifest side effect 'writes files under src/components/'; approvalThreshold anyWrite requires explicit approval before proceeding.",
  "rollbackPath": "git revert <commit> or restore src/components/Button.tsx from prior commit",
  "approvalRequired": true,
  "evidence": ["skillManifest.sideEffects: writes files under src/components/", "approvalThreshold: anyWrite"],
  "risk": "medium"
}
```

**Consumer action:** Do not write the file until explicit approval is granted. Once approved, the write proceeds and the rollback path names the git revert target.

## Completion

Per-step completion criteria:

1. **Classify** — `requestedAction.kind` is one of read/write/delete/network/external; `destructive` flag recorded; classification documented in `reason`.
2. **Check manifest** — all `skillManifest.sideEffects` listed in `evidence`; `approvalThreshold` recorded and applied; mismatches flagged.
3. **Require approval** — destructive/delete/external actions are never silently `allowed`; `approvalRequired` set correctly per rule; reason cites the triggering rule.
4. **Record decision** — `decision` is allowed/blocked/approvalRequired; `rollbackPath` names a concrete procedure; artifact saved as JSON + Markdown.

Global completion checks:
- The artifact is saved and validated against the output schema.
- Any blockers or skipped validations are documented in `reason`.
- The next consumer is identified or the work is handed off.
- The stop condition is satisfied: action is allowed or blocked with reason, approval requirement is clear, and rollback is named.

---
@include .agents/skills/platform/contract-base.xml
