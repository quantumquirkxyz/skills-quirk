---
name: postgres
category: platform
maturity: stable
version: 1
description: Shape PostgreSQL schema and query decisions — so the data model stays durable and reviewable.
capabilities:
  - apply postgres workflow
  - produce postgres artifact
  - validate postgres completion criteria
outputs:
  - Postgres artifact with findings, decisions, recommendations, and validation notes
sideEffects: []
dependencies: []
stopCondition: Shape PostgreSQL schema and query decisions complete; artifact saved; completion criteria checked.
risk: low
trustTier: 1
maxIterations: 6
---

## Operating Contract

- **Input:** Postgres request, relevant context, constraints, and source evidence.
- **Output:** Postgres artifact with findings, decisions, recommendations, and validation notes.
- **Side effects:** follow the frontmatter declaration; do not broaden scope without explicit user direction.
- **Dependencies:** declared dependencies, referenced skills, and source materials required by the task.
- **Stop condition:** Shape PostgreSQL schema and query decisions is complete, evidence is captured, and completion criteria are checked.
- **Risk:** use the frontmatter risk classification and call out any escalation.
- **Boundary:** stay within the skill's declared scope, trust tier, and side-effect policy.

# Postgres

Use this skill when PostgreSQL is the persistence layer and the schema or query shape matters. It should make the data model durable and the query seam explicit so changes can be migrated safely.

## Contract

- Input: postgres brief, data model, and persistence constraints.
- Output: schema guidance, query guidance, and data durability notes.
- Scope: design the persistence shape, not the full implementation.
- Rule: keep the schema honest to the domain model.
- Rule: make the query seam explicit when it affects performance or correctness.
- Rule: flag data-loss risk and migration coupling early.

## Steps

1. Identify the persisted concepts and their boundaries.
2. Decide what belongs in schema versus derived data.
3. Note the query and migration constraints.
4. Describe the durability tradeoffs clearly.

## Completion criteria

- the schema shape is named
- the query seam is named
- the durability risks are explicit
