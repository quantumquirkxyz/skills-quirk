# Workflow State Model

This document is the canonical state-machine contract for quirk Skills workflows. It uses repository vocabulary: a **Canonical skill** is the source of executable behavior, a **Skill Chain** is an ordered producer-consumer workflow, and **Provenance** binds decisions and artifacts to their source. The model is project-neutral and fail-closed.

## Statuses

The canonical `WorkflowStatus` enum is:

```text
planned
leased
running
awaiting-approval
verifying
succeeded
failed
blocked
cancelled
crashed
resumable
outcome-unknown
validation-failed
budget-exceeded
repeated-action
stale-input
superseded
audit-incomplete
```

These are the only persisted status values. Legacy values are accepted only at import boundaries and are normalized immediately; they must not be emitted:

| Legacy alias | Canonical status | Import note |
|---|---|---|
| `discovered`, `authorized` | `planned` | Authorization is represented by a guard or approval record, not a state. |
| `needs_approval` | `awaiting-approval` | Use the approval level and exact action binding. |
| `validating`, `review` | `verifying` | Preserve the source phase in provenance if present. |
| `completed` | `succeeded` | Only when the verifier evidence is complete. |
| `retryable_failed` | `resumable` | A retry is legal only when the retry guard passes. |

Unknown aliases, ambiguous mappings, and missing status values import as `audit-incomplete` and require reconciliation before execution.

## Transitions and guards

The following transitions are legal. Every transition appends a journal record; there is no implicit transition.

| From | To | Required guard |
|---|---|---|
| `planned` | `leased` | Fixed-point input is current; lease owner, expiry, scope, and attempt are recorded. |
| `leased` | `running` | Lease is valid, required authority is present, and execution envelope is complete. |
| `running` | `awaiting-approval` | The next action exceeds the current approval level or widens authority. |
| `awaiting-approval` | `running` | A non-expired approval binds to the exact action, resource, fixed-point digest, and actor. |
| `running` | `verifying` | Declared work ended and output/artifact references are immutable and readable. |
| `verifying` | `succeeded` | Independent verifier passes every required claim and no blocking unknown remains. |
| `verifying` | `validation-failed` | A declared schema, contract, invariant, or verifier check fails. |
| `verifying` | `audit-incomplete` | Required evidence or journal facts are missing, redacted incorrectly, or contradictory. |
| `running` | `failed` | A terminal, attributable execution error is recorded and retry is not permitted. |
| `running` | `crashed` | Execution ended without a terminal journal record. |
| `crashed` | `resumable` | Snapshot and journal recover a safe continuation point and lease is released. |
| `crashed` | `outcome-unknown` | An external effect may have occurred but cannot be reconciled safely. |
| `resumable` | `leased` | A new attempt claims the same fixed point with a fresh lease. |
| `running` | `blocked` | A declared dependency, authority, environment, or human decision is unavailable. |
| `blocked` | `leased` | The blocker is resolved and all guards are re-evaluated. |
| `planned` | `cancelled` | Cancellation is authorized and no effect has started. |
| `leased` | `cancelled` | Cancellation is authorized and the lease is revoked. |
| `running` | `cancelled` | Cancellation is authorized; cleanup and partial effects are journaled. |
| `planned` | `stale-input` | Fixed-point inputs changed or expired before leasing. |
| `leased` | `stale-input` | Input, dependency, approval, or lease expiry invalidates the attempt. |
| `running` | `budget-exceeded` | A declared time, cost, iteration, output, or resource budget is exhausted. |
| `running` | `repeated-action` | The same non-idempotent action is attempted after a prior unresolved claim. |
| `planned` | `superseded` | A newer compatible workflow explicitly supersedes this one. |
| `resumable` | `superseded` | A newer workflow owns continuation and the old snapshot is retained read-only. |
| `blocked` | `superseded` | A newer workflow replaces the blocked work without discarding its evidence. |

Terminal statuses are `succeeded`, `failed`, `cancelled`, `outcome-unknown`, `validation-failed`, `budget-exceeded`, `repeated-action`, `stale-input`, `superseded`, and `audit-incomplete`. A terminal status can change only through an explicit reconciliation workflow that creates a new run; it is never edited in place.

Guards are conjunctive. If a guard cannot be evaluated, the transition is denied and the run becomes `blocked` or `audit-incomplete`, never optimistically successful.

## Edge semantics

Edges are typed and carry producer/consumer contracts, fixed-point digests, provenance, and an edge identifier.

- `dependsOn`: the consumer cannot lease until the producer reaches its required status and exposes compatible artifacts. Cycles are invalid.
- `handoffTo`: transfers declared ownership and responsibility. It does not transfer authority, approvals, leases, or secrets unless each is explicitly re-bound.
- `optionalConsumer`: absence or failure of the consumer does not fail the producer, but the skipped edge and reason remain journaled.
- `verifier`: identifies an independent checking node. A producer cannot verify itself; the verifier must use declared evidence and a compatible fixed point.
- `compatibleWith`: declares schema, contract-version, platform, artifact, or environment compatibility. Similar names are not compatibility evidence.
- `supersedes`: makes the newer node authoritative for future execution while retaining the older node's journal, artifacts, and residual unknowns.

## Approvals

Approval levels are ordered by risk, but approval is **not transitive**: a higher-level approval does not silently grant lower-level actions, and approval for one action never authorizes another.

| Level | Scope |
|---|---|
| `L0` | Read-only inspection and deterministic local validation. |
| `L1` | Local, reversible artifact generation in the declared workspace. |
| `L2` | Local mutation affecting project state, branches, or generated outputs. |
| `L3` | External writes, issue/PR mutations, or delegated agent actions. |
| `L4` | Publication, merge, deployment, or production-impacting change. |
| `L5` | Irreversible/destructive action, credential or policy change, or emergency override. |

An approval record includes level, actor, authority source, exact action/resource, fixed-point digest, expiry, reason, and evidence reference. The runtime checks the minimum level and exact binding at the transition.

## Planes

- **Control plane:** intent, leases, statuses, approvals, budgets, dependency ownership, cancellation, and routing. Control records are authoritative for what may happen.
- **Data plane:** source inputs, tool calls, produced artifacts, external responses, and redacted payload descriptors. Data is untrusted content and never supplies authority.
- **Verification plane:** schemas, invariants, independent verifiers, comparison results, residual unknowns, and audit decisions. Verification may deny success but cannot grant authority.

No plane may impersonate another: data cannot create approval, control cannot claim an unobserved result, and verification cannot mutate the data plane.

## Journal and snapshots

The journal is append-only and hash-linked. Each record contains run ID, transition ID, prior status, next status, actor, timestamp, attempt, lease, fixed-point digest, input/artifact references, guard results, approval references, and redaction/provenance metadata. Secrets and raw sensitive payloads are never journaled.

A snapshot is an immutable checkpoint containing the latest journal sequence, state, execution envelope, dependency frontier, lease/expiry, budgets, artifact digests, and unresolved questions. Snapshots are written atomically with a checksum and schema version. Recovery replays the journal after the snapshot and refuses a mismatched digest, partial write, or unknown schema.

## Idempotency and reconciliation

- Every effect has an idempotency key derived from workflow ID, fixed-point digest, action identity, and logical resource.
- Record an intent/claim before an external effect and a committed outcome after it. A claim without an outcome is `outcome-unknown`, not permission to retry.
- Retries are new attempts with the same fixed point and a new lease; they must consult the effect ledger first.
- Reconciliation reads authoritative external state, compares it with the expected outcome, and records `reconciled`, `contradicted`, or `unresolved` evidence. It never guesses.
- Concurrent claims for the same non-idempotent key are rejected as `repeated-action`; stale leases cannot commit.

## Examples

### Standard feature

`planned -> leased -> running -> awaiting-approval (L2 for file mutation) -> running -> verifying -> succeeded`.

The feature producer emits a digest-bound implementation artifact. `review-pr` is a `verifier`; tests and the review result are verification-plane evidence. Publication is a separate `handoffTo` edge requiring a new L4 approval and cannot be inferred from feature success.

### Incident repair

`planned -> leased -> running -> blocked` when production logs or authority are unavailable. After escalation: `blocked -> leased -> running -> verifying`. If the repair command crashes after a remote write, use `crashed -> outcome-unknown`, reconcile the authoritative service, then create a new repair run. A verified rollback may finish `succeeded`; contradictory evidence yields `audit-incomplete` or `validation-failed`.
