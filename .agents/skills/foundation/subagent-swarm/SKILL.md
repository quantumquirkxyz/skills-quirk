---
name: "subagent-swarm"
category: "foundation"
maturity: "stable"
description: "Coordinate multiple agent sub-roles (architect, implementer, reviewer, tester) in parallel or sequential swarm mode, with clear handoff contracts and evidence recording."
license: "MIT"
version: "1"
capabilities:
  - apply subagent swarm methods within explicit foundation boundaries
  - analyze coordinate multiple agent sub-roles (architect, implementer, reviewer, tester) in parallel or sequential swarm mode, with clear handoff contracts and evidence recording with assumptions, constraints, and failure modes
  - produce and validate a foundation artifact with evidence, decisions, and next steps
inputs:
  - type: object
    name: SwarmInputs
    properties:
      mode: { type: string, enum: [parallel, sequential] }
      roles: { type: array, items: RoleSpec }
      taskSpec: { type: TaskSpec }
      handoffContract: { type: HandoffContract }
      effortBudget: { type: EffortBudget }
      authorityPolicy: { type: AuthorityPolicy }
    required: [mode, roles, taskSpec, handoffContract, effortBudget, authorityPolicy]
outputs:
  - type: object
    name: SubagentSwarmArtifact
    properties:
      swarmPlan: { type: object }
      roleResults: { type: array }
      evidence: { type: array }
      conflicts: { type: array }
      mergedOutput: { type: object }
      validation: { type: object }
      status: { type: string, enum: [completed, blocked, needs-approval, validation-failed, budget-exceeded] }
    required: [swarmPlan, roleResults, evidence, conflicts, mergedOutput, validation, status]
sideEffects:
  - "write-files (orchestrator-owned swarm artifact only)"
  - "write-temp-file (bounded role-result references, when needed)"
dependencies:
  - verify-delegation
stopCondition: "All roles completed with valid evidence, conflicts resolved, and merged output validated; otherwise return a typed non-completed status."
risk: "medium"
trustTier: "3"
maxIterations: "3"
promptVersion: "2.0"
artifactType: "agent"
modelTier: "reasoning"
evaluators: ["behavioral", "regression"]
fixturesPath: ".agents/skills/platform/fixtures/behavioral/subagent-swarm.json"
diataxis: "how-to"
tags: ["foundation"]
compatibility: []
approvalRequired: true
approvalFor: ["write-files"]
clauses:
  - id: SUBAGENT-SWARM-1
    text: "Never merge role outputs without validating the evidence, and stop instead of fabricating completion when evidence is missing."
    check: "evals/behavioral/subagent-swarm.json#SUBAGENT-SWARM-1"
  - id: SUBAGENT-SWARM-2
    text: "Keep each subagent inside its declared role boundary; crossing a boundary requires an explicit handoff."
    check: evals/behavioral/subagent-swarm.json#SUBAGENT-SWARM-2
  - id: SUBAGENT-SWARM-3
    text: "When outputs conflict, preserve both claims plus the evidence used to choose between them, and assign one owner for final integration."
    check: evals/behavioral/subagent-swarm.json#SUBAGENT-SWARM-3
reloadPolicy: on-trigger
---

## Contract

- Input: typed `mode`, `roles`, `taskSpec`, `handoffContract`, `effortBudget`, and `authorityPolicy`.
- Output: typed `SubagentSwarmArtifact` with `swarmPlan`, `roleResults`, `evidence`, `conflicts`, `mergedOutput`, `validation`, and `status`.
- Scope: does not replace individual skills; orchestrates them with roles
- Rule: does not replace individual skills; orchestrates them with roles
- Rule: documented standards override defaults; explicit project rules take precedence.
- Rule: if blocked by missing context or dependencies, surface the blocker before proceeding.

## Critical Limits

- `roles` is bounded by the declared `effortBudget`; never add workers or tool calls beyond `maxSubagents` or `maxToolCalls`.
- Each role stays inside its declared boundary. Boundary changes require an explicit `DelegationBrief` handoff and an updated `authorityPolicy`.
- One named `mergeOwner` owns final integration, even in parallel mode; workers do not merge one another's outputs.
- Verify every worker claim independently against its artifact, success criteria, and tools through `verify-delegation` before accepting or merging it.
- A missing required artifact or verification result yields `validation-failed` or `blocked`, never fabricated completion.

## Provenance

| Question | Answer |
|---|---|
| What is the source of truth? | The user's request, originating spec/issue, and the skill's declared outputs |
| What is in scope? | Work covered by the skill's acceptance criteria and completion rules |
| What is explicitly out of scope? | Files, behaviors, and decisions outside the skill's declared boundary |
| Who or what consumes this artifact afterward? | The next skill in the workflow or the user |
| What evidence proves it is done? | Completion criteria met, artifact saved, validation passed |
| What risk remains? | Subjective judgment calls, missing context, or external dependency failures


## Artifact

Emit `SubagentSwarmArtifact` as both:
- JSON: `.agents/skills/platform/artifacts/subagent-swarm/{identifier}.json`
- Markdown view: same filename with `.md` extension

`status` is one of: `completed`, `blocked`, `needs-approval`, `validation-failed`, or `budget-exceeded`.


# 
# 
# Subagent Swarm


## Process
1. Define roles and mode (parallel/sequential).
2. Create swarm plan with task assignments.
3. Execute roles (parallel or sequential).
4. Collect evidence from each role.
5. Resolve conflicts (if any).
6. Merge outputs with evidence.
7. Validate final output against handoff contract.

## Guardrails
- Each subagent must record evidence independently.
- Conflicts must be resolved with explicit reasoning.
- Never merge outputs without validating evidence.
- Preserve context between role handoffs.
- Rule: Assign one owner for final integration even when work is parallelized.
- Rule: Do not let a subagent operate outside its declared role boundary without an explicit handoff.
- Rule: If outputs conflict, preserve both claims and the evidence used to choose between them.
- Rule: Stop the swarm when validation evidence is missing for a required role instead of fabricating completion.
- Rule: Workers are read-only by default; delegated mutation is an effect of the worker and its approved brief, not authority owned by this orchestrator.

## Contracts Per Role

### architect
- Input: spec/task description
- Output: architecture proposal, module boundaries, dependency map
- Boundary: proposes changes; does not implement code

### implementer
- Input: architecture proposal + task spec
- Output: code changes, tests, validation evidence
- Boundary: writes within sandbox/target; preserves conventions

### reviewer
- Input: implementation + evidence
- Output: review findings (standards/spec), repair plan if needed, clean evidence
- Boundary: read-only analysis of code and evidence; proposes fixes; does not merge

### tester
- Input: implementation + test assertions
- Output: test suite, coverage report, execution log
- Boundary: does not modify source beyond fixtures; surfaces failures with evidence

## Canonical delegation brief

Every spawned role receives a `DelegationBrief` — see `.agents/skills/platform/schemas/delegation-brief.schema.json` and the protocol in `.agents/skills/foundation/verify-delegation/references/verify-protocol.md`. A brief without these fields is not a brief; it is a guess the worker will spend its budget on.

| Field | What every role carries |
|---|---|
| `objective` | The single outcome that ends the role's run. One objective per role. |
| `outputFormat` | `summary`, `artifact-reference`, or `findings-only` — never a transcript. |
| `toolGuidance` | Tools and sources in order, and what to do when a source is missing. |
| `boundaries` | At least one thing the role must NOT do, stated in the brief itself. |
| `stopCondition` | The observable condition that ends the run, so effort stops when the work does. |
| `effortBudget` | `maxToolCalls` / `maxSubagents` / `maxMinutes`, scaled to complexity: simple = 1 role and 3-10 tool calls; comparison = 2-4 roles; complex = more than 10 tool calls or several sources. |

- Rule: subagent output goes to the filesystem; what returns to the orchestrator is a bounded summary plus a reference. Forwarding a transcript is forwarding the game of telephone.
- Rule: conflict resolution preserves both claims **and** the evidence used to choose between them; a choice recorded without its evidence is not a resolution, and the conflict is reopened.
- Rule: decompose by the context each role needs, never by splitting one artifact across phases — that is the documented telephone-game failure.
- Rule: workers are read-only by default. A role that must mutate the repository sets `readOnly: false` in its brief, and only the orchestrator may opt in, with the write scope named in `boundaries`.
- Rule: verify a worker's claim with the artifact, the success criteria, and the tools — never with the worker's implementation narrative (see `verify-delegation`).

## P0/P1 Controls

| Role/tool | Authority | Forbidden | Proof |
|---|---|---|---|
| Orchestrator | Schedule, lease, merge after verification | Implement or self-approve | plan digest, merge owner |
| Worker | Declared task, tools, and paths | Scope expansion or subdelegation | signed typed handoff |
| Reviewer/tester | Independent check and replay | Repair or merge | verdict and replay tests |
| Approver | Named mutation until expiry | Broad or transitive approval | scoped approval token |

Each `DelegationBrief` carries `schemaVersion`, `runId`, `parentId`, authority scope, source SHA-256 digests, quotas, lease expiry, redaction/retention policy, kill-switch reference, and signature. Reject stale, unsigned, invalid, or digest-mismatched handoffs. Approval propagation is explicit per operation and path.

Use quotas for subagents, tool calls, tokens, cost, wall time, concurrency, bytes, and retries. Canonical states are `planned`, `leased`, `running`, `awaiting-approval`, `verifying`, `succeeded`, `failed`, `blocked`, `cancelled`, `crashed`, `resumable`, and `expired`. A kill switch revokes leases and prevents effects. Crash/resume starts at the last committed checkpoint and reports `outcome-unknown` rather than replaying uncertain mutations. Replay duplicate delivery, timeout, crash before/after commit, lease expiry, redaction, digest mismatch, and kill switch paths.

## Completion

- the skill's completion criteria are explicitly checked
- the artifact is saved and validated
- any blockers or skipped validations are documented
- the next consumer is identified or the work is handed off
---
@include .agents/skills/platform/contract-base.xml