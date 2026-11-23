---
name: "automatic-refinement"
category: "routing"
maturity: "stable"
version: "3"
description: "Orchestrate a bounded multi-agent refinement graph that runs after grill-with-docs to update and improve the little things left over from grilling. Agents dynamically invoke any canonical skill they need (search, brainstorming, research, grill-with-docs, grilling, code-review, etc.) based on the context and objective, using graph-skill-routing for discovery and loop-engineering for bounded iteration. Stops at refined-awaiting-review without publishing or implementing."
license: "MIT"
capabilities:
  - plan and execute a dynamic multi-agent refinement graph
  - agents invoke canonical skills they need based on context and objective
  - route skills dynamically through canonical graph/graph-skill-routing, with no fixed role set
  - enforce typed handoffs, budgets, convergence, and independent verification via canonical loop/loop-engineering
  - synthesize a review-ready RefinementArtifact without remote effects
inputs:
  type: object
  required: [idea, objective]
  properties:
    idea: { type: string }
    objective: { type: string }
    context: { type: string }
    documents: { type: array }
    domain: { type: string }
    constraints: { type: array }
    successCriteria: { type: array }
outputs: "RefinementArtifact with provenance, invocation trace, evidence, decisions, assumptions, risks, open questions, proposed artifacts, verification, and approval status."
sideEffects:
  - write-temp-file
dependencies:
  - context-pack
  - grill-with-docs
  - graph-skill-routing
  - loop-engineering
  - subagent-swarm
  - skill-composition
  - artifact-handoff
  - domain-modeling
  - verify-delegation
stopCondition: "Loop-engineering reports converged, budget-exceeded, no-progress, or ping-pong; all agent skill invocations have valid typed handoffs; a RefinementArtifact is emitted at refined-awaiting-review or a typed terminal failure is returned."
risk: "medium"
trustTier: "3"
maxIterations: 6
promptVersion: "2.0"
artifactType: "refinement"
modelTier: "reasoning"
evaluators: ["behavioral", "regression"]
fixturesPath: "tests/skill-output-migration-routing-skill-dev.test.mjs"
diataxis: "how-to"
tags: ["routing", "orchestration", "refinement", "multi-agent", "bounded-loop", "post-grill", "little-things", "dynamic-skills"]
compatibility: ["grill-with-docs"]
approvalRequired: true
approvalFor: ["write-temp-file"]
---

## Contract

- Input: an object containing `idea` and `objective`, with optional context, documents, domain, constraints, and success criteria.
- Output: one schema-valid `RefinementArtifact` or a typed terminal failure.
- Accept exactly an `idea` and `objective`; accept optional `context`, `documents`, `domain`, `constraints`, and `successCriteria`.
- Normalize input without changing its meaning and calculate an input digest over canonical bytes.
- Assign a unique `operationId`; retain `parentOperationId` when nested under another operation. Include both in every brief, handoff, and artifact.
- Return one `RefinementArtifact`; do not return a prose-only completion claim.
- Distinguish a Skill (a reusable method and contract loaded from `.agents/skills/`) from a subagent (a leased execution identity that applies a role brief). A skill does not become a subagent, and a subagent cannot invent a skill.

### Deriving input from GrillWithDocsArtifact

When invoked after `grill-with-docs`, `automatic-refinement` consumes the schema at `.agents/skills/routing/grill-with-docs/references/grill-with-docs-artifact.schema.json` and derives its `context` and `objective` from the `GrillWithDocsArtifact`:

- **`objective`**: Taken from the artifact's required `objective` field. Never infer an objective from prose alone; a missing or empty objective returns `blocked`.

- **`context`**: Composed from the artifact's required `context`, `documents`, `decisions`, `evidence`, and `residualRisks` fields. Residual risks are carried into `constraints` when they bound the refinement scope.

The `parentOperationId` is set to the `operationId` of the `grill-with-docs` operation that produced the artifact, establishing operation lineage. The `inputDigest` is calculated over the canonical bytes of the derived `idea` + `objective` + `context` so the refinement is traceable to its grill source.

## Position in the Workflow

This skill runs after `grill-with-docs`. The grill flow sharpens the plan or design through relentless interview and produces a `GrillWithDocsArtifact` (ADRs and glossary). `automatic-refinement` consumes that artifact as context and runs a bounded multi-agent refinement graph where agents dynamically invoke any canonical skill they need to catch the little things left over — small refinements, residual ambiguities, loose ends, and updates that the grill session surfaced but did not close.

It does not implement code, publish PRs, or create remote effects. It stops at `refined-awaiting-review`, producing a `RefinementArtifact` that the next skill in the flow (for example `implement` or `to-spec`) can consume.

### Identifying context and objective from the grill artifact

The `GrillWithDocsArtifact` is the authoritative source for both `context` and `objective`:

- `objective` is the required `objective` field in the grill artifact.
- `context` is the required `context` field plus its structured `documents`, `evidence`, `decisions`, `constraints`, and `residualRisks`.

If the grill artifact does not contain a usable objective, return `blocked` with the missing field recorded — do not synthesize one.

## Dynamic Agent-to-Skill Graph

`automatic-refinement` has no fixed role count or named role set. There is no fixed role set: it delegates a capability-driven graph where each leased agent:

1. **Receives a schema-valid `DelegationBrief`** from `.agents/skills/platform/schemas/delegation-brief.schema.json`, including identity, isolation, read-only mode, sources, trace/run/schema/signature/checkpoint/lease/authority/quota/retention fields.
2. **Calls canonical `graph/graph-skill-routing`** to discover which canonical skills match its objective and context.
3. **Invokes the skills it needs** — for example `research/github-project-analysis` for GitHub repository comparison, `product/brainstorming`, research, grill-with-docs, grilling, code-review, or domain-modeling — through their declared contracts, not by filesystem path.
4. **Returns a typed handoff** through `artifact-handoff` with operationId, parentOperationId, roleId, wave, inputDigests, artifactRef, evidenceRefs, outputDigest, status, nextOwner, and validation results.

### How agents choose skills

Each agent examines its DelegationBrief objective and the shared context, then asks canonical `graph/graph-skill-routing` to return candidate skills:

- Objective mentions "search GitHub repos" → route to `research/github-project-analysis`
- Objective mentions "brainstorm alternatives" → route to brainstorming
- Objective mentions "review code" → route to code-review
- Objective mentions "grill assumptions" → route to grill-with-docs or grilling
- Objective mentions "domain terms" → route to domain-modeling
- Objective needs source-backed facts → route to research

The agent then invokes the routed skills through their declared contracts, passing the relevant context and objective subsets.

### Typed handoffs across dynamic edges

Every edge between agents transfers a typed artifact through `artifact-handoff`. An absent edge is a validation failure. Handoffs carry:

```
{
  "operationId": "op-...",
  "parentOperationId": "op-parent-... or null",
  "roleId": "agent-...",
  "wave": "independent-analysis | synthesis | verification | ...",
  "status": "succeeded | blocked | validation-failed | ...",
  "summary": "bounded claim summary",
  "artifactRef": "artifact://...",
  "evidenceRefs": ["evidence://..."],
  "inputDigests": ["sha256:..."],
  "outputDigest": "sha256:...",
  "verifierRef": null,
  "nextOwner": "orchestrator | agent-id",
  "validation": {"schema": "passed", "integrity": "passed"},
  "skillsInvoked": ["skill-name-1", "skill-name-2"],
  "skillOutputs": {"skill-name-1": "output-ref-1", ...}
}
```

Missing fields reject the handoff. Every brief and handoff preserves `sourceDigests`, `leaseExpiry`, `authorityPolicy`, `quota`, and `retentionPolicy`; the emitted artifact records `budgetSpent`. `blocked`, `cancelled`, `validation-failed`, and `outcome-unknown` handoffs must explain the reason and never masquerade as success.

## Guardrails

- Never claim an agent ran when it was unavailable; record the unavailable capability and stop `blocked`.
- Never mark an artifact verified without independent verifier-capability evidence; unavailable verification is not verified.
- Never mark the result approved without explicit user refinement review; never infer local or remote approval transitively.
- Never invoke undeclared skills, exceed budgets, retry an unknown effect, or publish a remote effect.
- Preserve conflicts, assumptions, limitations, and open questions in the artifact; do not optimize for a falsely clean conclusion.
- Every skill invocation must go through canonical `graph/graph-skill-routing` and its declared contract — never by filesystem path.

## Runtime Boundary

This bundle supplies contracts, routing metadata, handoff schemas, and validation fixtures; it does not expose a universal subagent-dispatch API. Require the host runtime to provide role leasing, isolated context, and invocation evidence. When those capabilities are absent, return `blocked` with the missing capability recorded. Never simulate a role result, infer execution from a loaded Skill, or claim that a wave ran.

## Waves (bounded by canonical loop/loop-engineering)

Run waves in this order, with loop-engineering managing iteration budgets:

1. **Preflight:** validate inputs, untrusted-content boundaries, approval state, budgets, capability availability, and `context-pack`; create `operationId`, input digest, run ledger, and graph plan. Call canonical `loop/loop-engineering` to initialize the loop budget.
2. **Capability-driven analysis:** lease zero or more agents in parallel (up to `maxParallelSubagents`) for the routed capabilities. Every agent calls canonical `graph/graph-skill-routing` and invokes only declared skill contracts.
3. **Synthesis:** the orchestrator capability alone merges validated handoffs using `skill-composition`; preserve conflicts and cite evidence rather than averaging claims.
4. **Adversarial critique:** require one leased agent with an explicit critic capability, or an equivalent capability declared in the graph, against the synthesis and original criteria with disjoint context.
5. **Loop check:** call canonical `loop/loop-engineering` and map its `exitStatus` exactly: `completed` -> continue after external verification; `limits-exceeded` -> `budget-exceeded`; `repeated-action` or `ping-pong` -> `no-progress`; `no-progress` -> `no-progress`; `blocker-escalated` -> `blocked`. Carry `loopId`, `ledgerRef`, `recoveryPolicy`, and `progressEvidence` into the artifact. Do not retry identically.
6. **Independent verification:** require one leased agent with an explicit verifier capability, or an equivalent independent-verification capability, with read-only access to source artifacts and criteria. Accept critical claims only on an independent pass.
7. **Emit RefinementArtifact** at `refined-awaiting-review` or typed terminal failure.

Do not skip or reorder barriers. If orchestrator, critic, or verifier capability cannot run, return `blocked`. Use canonical `loop/loop-engineering` ledger semantics: charge failed calls, check limits before each lease, and never relax a budget mid-run. `maxSources` remains owned by this skill and must be preserved in every nested brief and handoff.

## Budgets And Termination

Declare immutable budgets before leasing the first agent. Caller limits override these defaults:

| Budget | Default |
|---|---:|
| `maxIterations` | 6 waves/corrections |
| `maxSubagents` | 8 (agents plus bounded retries) |
| `maxSkillInvocations` | 24 |
| `maxParallelSubagents` | 4 |
| `maxWallTimeMs` | 900000 |
| `maxSources` | 20 |

Use `loop-engineering` ledger semantics: charge failed calls, check limits before each lease, and never relax a budget mid-run. Define progress as a new validated handoff, resolved conflict, or independently verified claim. Detect no progress when two consecutive iterations add no validated evidence; detect ping-pong when the same two synthesis states recur within the repeat window. Return `budget-exceeded` or `no-progress` and preserve the trace; do not retry identically. Cancellation returns `cancelled`.

## Approval And Effects

Use three separate approvals: `refinement-review` approves the draft artifact for human review; `local-file-approval` permits a named temporary/local write; `remote-effect-approval` is required for any external mutation and is never implied by either earlier approval. Default to read-only and draft-local. Do not automatically create issues, projects, PRs, commits, implementation changes, remote documents, network mutations, or publication. This skill stops before implementation at `refined-awaiting-review`; a local temporary handoff write requires the declared approval and must be bounded and redacted.

Apply stronger guardrails for high-risk domains (security, privacy, safety, finance, health, legal, production operations): require explicit domain identification, independent sources, uncertainty labels, a domain specialist, and verifier coverage for every material claim. Refuse to convert missing evidence into a recommendation.

## Output And Status

Emit the fields defined in `references/refinement-artifact.schema.json`: provenance, invocation trace, evidence, decisions, assumptions, risks, open questions, proposed artifacts, verification, and approval status. Include source and handoff digests, role statuses, routing confidence, budget spent, limitations, and next consumer. Also include `skillsInvoked` listing every canonical skill called during the refinement.

Terminal statuses are `refined-awaiting-review`, `refined-with-limitations`, `blocked`, `validation-failed`, `budget-exceeded`, `no-progress`, `cancelled`, and `stale-input`. `refined-awaiting-review` is the only successful terminal status and always has `approvalStatus: pending-refinement-review`; it is not publication approval. `refined-with-limitations` is never considered verified or approved. Stale input, changed source digests, expired leases, or unknown effect outcomes terminate safely and require a new operation.

### Consuming the RefinementArtifact after grill-with-docs

The `RefinementArtifact` emitted by this skill carries `nextConsumer` and `proposedArtifacts`. Downstream skills (for example `implement`, `to-spec`, or `to-tickets`) read `nextConsumer` to know what to do next and `proposedArtifacts` for the concrete artifacts to produce. The `approvalStatus` is always `pending-refinement-review` at `refined-awaiting-review` — it is review-pending, not publication-approved.

## Completion

- Input contract, digests, operation lineage, and immutable budgets are recorded.
- All agent skill invocations have valid typed handoffs through `artifact-handoff`.
- Domain routing uses `graph-skill-routing` evidence; unknown or unavailable routes are visible.
- Loop-engineering convergence/no-progress/ping-pong checks ran; the result stayed within budget.
- Critique and independent verification are present, or the terminal status explicitly records why verification is unavailable.
- `RefinementArtifact` is schema-valid, provenance-complete, review-pending, and contains no publication or implementation effect.

---
@include .agents/skills/platform/contract-base.xml