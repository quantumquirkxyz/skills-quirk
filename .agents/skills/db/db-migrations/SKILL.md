---
name: db-migrations
category: db
maturity: stable
version: 1
description: Plan database migrations — schema changes, backfills, compatibility windows, and rollback strategy — with explicit application and data safety checks.
capabilities:
  - plan schema migrations
  - sequence backfills safely
  - define rollback and compatibility windows
outputs:
  - migration plan with phases, compatibility risks, validation, and rollback notes
sideEffects: []
dependencies: []
stopCondition: The migration sequence, compatibility window, validation, and rollback posture are explicit.
risk: low
trustTier: 1
maxIterations: 6
---

# db-migrations

Use this skill when changing a database schema, moving data, adding constraints, backfilling fields, or coordinating application and database compatibility.

## Contract

- Input: current schema, target schema, application readers/writers, data volume, deployment process, and rollback constraints.
- Output: phased migration plan with forward/backward compatibility, validation queries, and rollback posture.
- Scope: database schema and data migrations; broader release coordination belongs to release management.
- Boundary: avoid single-step migrations that require app and database changes to land atomically unless downtime is explicitly accepted.

## Rules

- Rule: separate expand, backfill, switch reads/writes, contract, and cleanup phases.
- Rule: preserve compatibility across at least one deploy window unless the system can be stopped safely.
- Rule: make backfills resumable, observable, and bounded by batch size.
- Rule: validate data correctness before dropping old columns, indexes, or paths.
- Rule: state whether rollback is schema rollback, application rollback, data repair, or forward fix.

## Steps

1. Map current readers, writers, constraints, indexes, triggers, and data volume.
2. Define the target schema and compatibility hazards.
3. Sequence the migration into reversible or forward-safe phases.
4. Plan backfill mechanics, throttling, monitoring, and retry behavior.
5. Write validation checks for counts, nullability, referential integrity, and application behavior.
6. Document rollback or forward-fix actions for each phase.

## Completion Criteria

- phased migration order is explicit
- app/database compatibility is addressed
- backfill and validation plans are defined
- rollback or forward-fix posture is documented
