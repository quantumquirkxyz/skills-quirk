# Edge Contract

This contract governs every producer-consumer edge in a Skill Chain. An edge is a durable, typed agreement; it is not an informal handoff or a similarity judgment. The edge record is part of Provenance and is evaluated before leasing the consumer.

## Required edge record

Each edge declares:

- `edgeId`, producer and consumer identifiers, edge type, contract version, and owner;
- input/output schemas and the exact artifact references the consumer may read;
- producer and consumer digests, plus the fixed-point digest for the run;
- required authority and approval level, lease owner/expiry, and execution environment;
- redaction policy and sensitivity classification;
- verifier identity, required claims, acceptance criteria, and residual-unknown policy;
- expiry, supersession, rollback/reconciliation behavior, and journal references.

An omitted required field is incompatible. `compatibleWith` must be explicit; names, timestamps, or successful prior runs do not establish compatibility.

## Compatibility

A consumer may lease only when all of the following hold:

- the producer status satisfies the edge requirement;
- schema and contract versions are supported by the consumer;
- artifact bytes and manifests match their recorded digests;
- platform, architecture, tool/provider, and environment constraints match;
- the fixed-point input digest is identical, or an explicit migration edge proves the conversion;
- edge scope, permissions, and redactions allow the consumer's declared reads;
- no dependency is stale, superseded, cancelled, or audit-incomplete.

Compatibility is evaluated at lease time and again before commit. A changed digest or fixed point invalidates prior approval and moves the edge to `stale-input`.

## Authority and approvals

The producer owns claims about its own outputs; the consumer owns claims about its own processing. Neither may mint authority for the other. `handoffTo` transfers responsibility only after the consumer accepts the edge and records its own lease.

Approval is bound to the exact edge, action, resource, fixed-point digest, actor, and expiry. Approval levels are L0-L5 as defined in the [Workflow State Model](workflow-state-model.md). Approvals are non-transitive: an approval for a producer, artifact, or lower-risk action does not authorize a consumer mutation or a later publication.

## Lease and expiry

Leases are exclusive for non-shareable work and include owner, scope, issued-at, expiry, heartbeat policy, and attempt. A consumer must not execute or commit with an expired lease. Expiry releases the lease but does not erase evidence; recovery is `resumable` only when replay is safe. Edge, approval, artifact, and environment expiries are checked independently, and the earliest failure wins.

## Redaction

Redaction is declared before capture and preserves the field name, type/shape, sensitivity class, digest where safe, and reason for omission. Redaction must not alter the fixed-point digest silently. A verifier that needs a redacted value must use an approved derived claim or fail closed as `audit-incomplete`; it may not infer the value from logs or neighboring records. Secrets and personal data are never copied into handoffs, journals, snapshots, or generated projections.

## Verifiers

Every edge that gates success names an independent `verifier`. The verifier consumes only declared evidence, checks the exact fixed point, and records pass/fail/unknown per claim. It must distinguish:

- `succeeded`: all required claims pass;
- `validation-failed`: a claim fails;
- `audit-incomplete`: evidence is missing, contradictory, or improperly redacted;
- `outcome-unknown`: an external effect cannot be determined.

The producer cannot be its own verifier. A verifier result does not mutate producer artifacts and cannot waive an approval, lease, digest, or expiry guard.

## Idempotency and reconciliation

The edge's idempotency key is `(edgeId, producerDigest, consumerDigest, fixedPointDigest, logicalResource, action)`. The consumer records a claim before any external effect and an outcome after it. A replay first consults the claim/outcome ledger; it must not repeat a non-idempotent action with an unresolved claim. Reconciliation compares authoritative state and records the evidence or leaves the edge `outcome-unknown`.

## Failure and lifecycle rules

An edge becomes `blocked` when a human decision, dependency, authority, or environment is unavailable. It becomes `stale-input` when any bound digest, fixed point, approval, lease, or expiry changes. It becomes `superseded` only through an explicit `supersedes` edge. Optional consumers may be skipped with a reason and evidence; required consumers cannot be silently omitted.

All edge decisions append to the workflow journal and reference immutable snapshots or artifacts. Unknown edge types, cycles, duplicate ownership, unverifiable digests, and missing verifiers are rejected before execution.
