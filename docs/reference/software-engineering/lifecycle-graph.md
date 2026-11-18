# Software Engineering Lifecycle Graph

This is the canonical route for feature, platform, and corrective-change work in quirk Skills. It is a contract over canonical Skills and artifacts; it does not add a second runtime state machine. Execution uses the statuses, guards, approvals, journals, snapshots, and typed edges in [Workflow State Model](workflow-state-model.md). The graph builder remains a read-only projection of `SKILL.md` metadata and is not authority to skip a stage.

## Route

```text
requirements-engineering
  -> architecture-evaluation
  -> codebase-design / domain-modeling
  -> to-tickets
  -> implement
  -> testing / quality gates
  -> review-pr
  -> release-management
  -> deployment
  -> observability / sre
  -> software-maintenance-evolution
  -> corrective requirements-engineering
```

The final edge starts a new run/revision; it is not an in-run cycle. Testing, quality gates, observability, and SRE may run as parallel evidence branches when inputs are compatible, but implementation, release, deployment, and closure retain their declared gates.

## Stage Map

| Stage | Canonical Skill(s) | Required output and next consumer |
|---|---|---|
| Requirements | `requirements-engineering` | Schema-valid `RequirementsArtifact`; architecture, domain, testing, and ticketing consume it. |
| Architecture | `architecture-evaluation` | `ArchitectureArtifact` with alternatives, risks, reversibility, fitness functions, and operational impact. |
| Structure and domain | `codebase-design`, `domain-modeling` | Deep-module boundaries, domain vocabulary, decisions, and unresolved terms. |
| Ticketing | `to-tickets` | Claimable tickets with acceptance, traceability, dependencies, owner, rollback, and validation plan. |
| Implementation | `implement` | Validated branch and implementation artifact bound to the ticket fixed point. |
| Verification | `testing`, `skill-quality-gate`, applicable platform gates | Test evidence, gate results, residual unknowns, and exact artifact digests. |
| Review | `review-pr`, with `review-fix-loop` and its plan/repair skills when needed | Independent Standards and Spec verdict; unresolved findings block release. |
| Release | `release-management` | Release plan, provenance, approvals, rollout, and rollback decision. |
| Deployment | `deployment` | Target/environment identity, outcome, rollback path, and verification evidence. |
| Operations | `observability`, `sre` | Telemetry, SLI/SLO policy, alerts, runbooks, error budget, owner, and recovery evidence. |
| Maintenance | `software-maintenance-evolution` | Evidence-linked `MaintenanceArtifact`, classified corrective/adaptive/perfective/preventive, with impact, owner, rollback, closure, and feedback. |

`sec-threat-modeling`, `auth`, `api-contracts`, `db-migrations`, `performance`, accessibility, supply-chain, and other canonical Skills are inserted when applicability requires them. A stage is never silently omitted because a route renderer did not display it.

## Artifact and Edge Contracts

Every handoff MUST include artifact type/schema/version, stable artifact ID, operation ID, producer, source identities and revisions, timestamps, digests (or explicit digest absence), provenance locations, fixed-point digest covering inputs/scope/environment/dependency frontier, status, owner, next consumer, acceptance/verifier references, residual unknowns, blockers, non-goals, and rollback/recovery intent for effectful work.

Edges are explicit `dependsOn`, `handoffTo`, `optionalConsumer`, `verifier`, `compatibleWith`, or `supersedes` edges. `handoffTo` transfers artifact ownership, not authority, approval, lease, secrets, or production access. Compatibility requires schema, contract version, digest, platform, and environment evidence; names are not compatibility evidence. A consumer may lease only after its dependency reaches the required status and the edge contract validates.

An optional stage uses `optionalConsumer` only when the producer records `not-applicable`, applicability evidence, a named operational owner, and approval bound to the exact action and fixed point. `not-applicable` is not an omission and cannot be inferred from empty evidence.

## Verification and Operations

The producer MUST NOT be its own verifier. Verification is a separate plane and actor/tool where practical; it re-reads immutable artifacts at the same fixed point and records pass, fail, unknown, or contradiction. A successful command is not proof of deployment, rollback, recovery, compatibility, or user outcome.

Every operationally relevant route names an operational owner, escalation path, monitoring signal, rollback decision-maker, rollback procedure, abort condition, and post-change verification query. Deployment success requires observed health and user-journey recovery. If an external effect or persistence is uncertain, use `outcome-unknown`, reconcile authoritative state, and create a new attempt rather than retrying blindly.

Maintenance closes only with `resolved-with-evidence`, `corrective-ticket-created`, `accepted-risk-with-owner-and-expiry`, or explicit `blocked`. Closure links the finding to requirements, architecture, tests, release/deployment evidence, and runbooks. Corrective requirements create a new revision and fixed point; they never edit the prior baseline.

## Graph Invariants

1. The executable route is acyclic within one change; maintenance feedback creates a new run.
2. Every edge has one type, direction, producer, consumer, contract, and fixed-point relationship.
3. Missing, stale, contradictory, or unverifiable inputs fail closed to `blocked` or `audit-incomplete`.
4. No stage claims success without schema-valid output, independent verification, and no blocking unknown.
5. Approvals are exact, non-transitive, expiring, and bound to action, resource, actor, and digest.
6. Effects use intent/claim before execution and committed outcome after; unresolved claims are not retry permission.
7. Ownership is singular; review, repair, release, deployment, and merge authority remain separate.
8. Snapshots and journals are append-only and replay/digest consistent.

## Failure Modes

| Failure | Required disposition |
|---|---|
| Missing or stale artifact/digest | `stale-input` or `blocked`; rerun the producer. |
| Schema, contract, invariant, or verifier failure | `validation-failed`; do not hand off or release. |
| Missing owner, authority, environment, or approval | `blocked` or `awaiting-approval`; name the decision. |
| Producer/verifier coupling | `audit-incomplete`; assign an independent verifier. |
| Crash after possible external effect | `outcome-unknown`; reconcile authoritative state first. |
| Failed rollback or missing recovery evidence | Keep the change/incident open; escalate through `sre`/`observability`. |
| Review finding or failed quality gate | Stay in the review-fix loop; never ship. |
| Maintenance closure without evidence/owner | `blocked`; expose the corrective requirement gap. |
| Cycle, unreachable node, or incompatible edge | Graph is non-executable; repair local declarations. |

## Conformance

Use `node .agents/skills/platform/skill-graph.mjs build --json` to inspect the metadata projection and `node .agents/skills/platform/workflow-state-machine.mjs <workflow> replay` to verify a journal. Neither substitutes for artifact validation, independent verification, or approval. The operational owner updates this document when canonical Skill names, schemas, stage ownership, or workflow semantics change. Generated compatibility views are not edited by hand.
