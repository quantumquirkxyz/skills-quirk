# Migration Policy

> **Status:** Phase 0 policy | **Owner:** quirk Skills maintainers | **Scope:** schema, API, data, configuration, and operational migrations | **Last reviewed:** 2026-11-17 | **Review cadence:** quarterly and before irreversible deletion

## Expand-contract

1. **Inventory:** identify producers, consumers, data owners, compatibility constraints, rollback point, and deletion authority. Capture a baseline digest and migration manifest.
2. **Expand:** add the new schema/API/configuration in a backward-compatible form. Deploy readers that tolerate old and new forms before changing writers.
3. **Migrate:** dual-read or dual-write only when bounded, observable, and idempotent. Backfill in resumable batches with checksums, rate limits, and reconciliation.
4. **Contract:** switch traffic or writers after acceptance evidence, monitor the compatibility window, and retain a tested rollback path.
5. **Delete:** remove old fields, endpoints, indexes, or code only after the deletion criteria below are met and the owning authority approves.

## Compatibility windows

- Declare start, end, supported versions, consumers, success metrics, and abort thresholds.
- Keep the window long enough for the slowest supported consumer and one normal release/rollback cycle; regulated and safety-critical systems require the governing authority's retention period.
- Reject silent breaking changes. If compatibility cannot be preserved, publish a versioned contract and migration plan before deployment.

## Schema versioning

- Every persisted or exchanged schema has an explicit version and owner.
- Prefer additive changes; make removals and semantic changes versioned and documented.
- Validate both directions where rollback requires old readers or writers.
- Store migration IDs, source/target versions, code/tool versions, timestamps, counts, checksums, and residual errors.

## Rollback

- Define rollback, roll-forward, and compensating action separately; rollback is not assumed safe after destructive writes.
- Take a restorable snapshot or prove an equivalent recovery mechanism before mutation.
- Stop on failed reconciliation, unexpected cardinality, integrity mismatch, incompatible consumer, or breached error budget.
- Rehearse the rollback on a representative fixture or staging environment and retain the result.

## Deletion criteria

Old schema/code/data may be deleted only when all are true:

- compatibility-window expiry is recorded;
- consumer inventory is complete or explicitly bounded with owner sign-off;
- telemetry shows no supported reads/writes for the declared observation period;
- rollback or approved compensation is no longer dependent on the old form;
- backup/retention and legal-hold requirements are satisfied;
- migration, reconciliation, and deletion evidence are linked; and
- the owning authority approves the irreversible step.

If any condition is unknown, mark the migration `BLOCKED` or `AUDIT-INCOMPLETE`; do not infer safety from elapsed time alone.
