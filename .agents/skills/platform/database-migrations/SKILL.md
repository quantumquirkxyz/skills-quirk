---
name: database-migrations
category: platform
maturity: stable
version: 1
description: Plan and sequence database schema changes so they can ship safely without breaking callers.
capabilities:
  - apply database migrations workflow
  - produce database migrations artifact
  - validate database migrations completion criteria
outputs:
  - Database Migrations artifact with findings, decisions, recommendations, and validation notes
sideEffects: []
dependencies: []
stopCondition: Plan and sequence database schema changes so they can ship safely without breaking callers complete; artifact saved; completion criteria checked.
risk: low
trustTier: 1
maxIterations: 6
---

## Operating Contract

- **Input:** Database Migrations request, relevant context, constraints, and source evidence.
- **Output:** Database Migrations artifact with findings, decisions, recommendations, and validation notes.
- **Side effects:** follow the frontmatter declaration; do not broaden scope without explicit user direction.
- **Dependencies:** declared dependencies, referenced skills, and source materials required by the task.
- **Stop condition:** Plan and sequence database schema changes so they can ship safely without breaking callers is complete, evidence is captured, and completion criteria are checked.
- **Risk:** use the frontmatter risk classification and call out any escalation.
- **Boundary:** stay within the skill's declared scope, trust tier, and side-effect policy.

# Database Migrations

Use this skill when a schema or data-shape change needs to be made safely. It should sequence the move, identify backwards-compatibility concerns, and keep data integrity visible.

## Contract

- Input: schema change request, data shape, and migration context.
- Output: a migration plan, rollback guidance, and data integrity checks.
- Scope: plan the migration, not the live execution.
- Rule: prefer expand-then-contract when callers need time to move.
- Rule: call out destructive steps and their rollback path explicitly.
- Rule: keep compatibility windows short but real when the change spans deploys.

## Steps

1. Identify the current and target schema shapes.
2. Choose the safest migration ordering.
3. Define rollback and data integrity checks.
4. Note when the migration must be coordinated with application code.

## Completion criteria

- the migration order is named
- the rollback path is named
- the data integrity checks are concrete
