# Automatic Refinement Agent Graph

## Dynamic Graph Contract

`automatic-refinement` is a capability-driven graph, not a fixed role roster. The orchestrator selects zero or more leased agents from the canonical skill graph for the current objective and context. Role count, names, and parallel fan-out are runtime data bounded by `maxSubagents` and `maxParallelSubagents`; no six-role assertion is valid.

Required capabilities are:

- `orchestrator`: owns planning, synthesis, and final artifact emission.
- `critic` or an explicitly equivalent adversarial-review capability.
- `verifier` or an explicitly equivalent independent-verification capability.

A graph that cannot lease these capabilities returns `blocked`. Routed skills are not evidence that an agent ran.

```text
grill-with-docs -> automatic-refinement
  -> preflight
  -> capability-driven analysis (zero or more routed agents)
  -> orchestrator synthesis
  -> critic-capability barrier
  -> loop/loop-engineering check
  -> verifier-capability barrier
  -> refined-awaiting-review
```

Every edge is declared in the runtime graph plan, and every edge transfers a typed artifact. The orchestrator is the sole merge owner; it may not substitute a routed Skill for a leased agent capability.

## DelegationBrief

Every lease MUST validate against `.agents/skills/platform/schemas/delegation-brief.schema.json#/$defs/DelegationBrief`. The canonical schema is authoritative and must not be duplicated with a partial example. Required operational identity and control fields include `briefId`, `schemaVersion`, `traceId`, `runId`, `parentId`, `roleId`, `objective`, `inputDigest`, `sourceDigests`, `outputSchema`, `toolGuidance`, `boundaries`, `stopCondition`, `effortBudget`, `contextIsolation`, `readOnly`, `sources`, `checkpointId`, `leaseExpiry`, `authorityPolicy`, `quota`, `retentionPolicy`, `redactionPolicy`, and `signature`.

A missing identity, source digest, lease, signature, authority, quota, checkpoint, or retention field is a validation failure. Context is isolated by default and workers are read-only unless the invoking skill declares the matching side effect and approval.

## Typed Handoff

Each handoff is validated through `artifact-handoff`, `subagent-swarm`, and `skill-composition` and carries traceable lineage:

```json
{
  "traceId": "trace-...",
  "runId": "run-...",
  "operationId": "op-...",
  "parentOperationId": null,
  "roleId": "agent-...",
  "wave": "capability-driven",
  "status": "succeeded",
  "summary": "bounded claim summary",
  "artifactRef": "artifact://...",
  "evidenceRefs": ["evidence://..."],
  "inputDigests": ["sha256:..."],
  "outputDigest": "sha256:...",
  "signature": "sig-...",
  "checkpointId": "checkpoint-...",
  "verifierRef": null,
  "nextOwner": "orchestrator",
  "validation": {"schema": "passed", "integrity": "passed"}
}
```

The complete handoff contract, including authority scope, approval state, quota, lease expiry, retention/redaction policy, and signature, is inherited from the canonical schemas and `subagent-swarm`; missing fields reject the handoff. Blocked, cancelled, validation-failed, stale, and outcome-unknown handoffs must explain the reason and never masquerade as success.

## Skill/Subagent Boundary

Canonical Skills provide methods, prerequisites, schemas, and safety policy. Subagents are leased execution identities that consume a complete brief and return a handoff. Capability routing may select Skills, but only an actually leased agent proves execution. The graph resolver is `.agents/skills/graph/graph-skill-routing`, and the bounded-loop primitive is `.agents/skills/loop/loop-engineering`.

## Loop Contract

`automatic-refinement` owns `maxSources`; nested briefs and handoffs must carry the remaining source quota. It consumes the canonical `LoopEngineeringVerdict` and maps statuses as follows:

| Loop status | Refinement status/action |
|---|---|
| `completed` | continue to independent verification, then emit review-pending artifact |
| `limits-exceeded` | `budget-exceeded` |
| `repeated-action` | `no-progress` |
| `ping-pong` | `no-progress` |
| `no-progress` | `no-progress` |
| `blocker-escalated` | `blocked` |

Carry `loopId`, `ledgerRef`, `recoveryPolicy`, `progressEvidence`, and `budgetSpent` into the refinement artifact. Never restart an identical loop.

## Post-Grill Flow Position

`grill-with-docs` produces a schema-valid `GrillWithDocsArtifact`. `automatic-refinement` consumes its required objective and structured context fields, preserving `parentOperationId` and source digests. Missing objective blocks rather than synthesizing one. The output is a `RefinementArtifact` at `refined-awaiting-review`, review-pending and not publication-approved, for the declared `nextConsumer` such as `implement`, `to-spec`, or `to-tickets`.
