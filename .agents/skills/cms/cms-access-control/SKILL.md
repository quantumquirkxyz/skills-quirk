---
name: cms-access-control
category: cms
maturity: stable
version: 1
description: Design CMS access control — roles, permissions, editorial workflows, and publishing boundaries — with explicit least-privilege and auditability.
capabilities:
  - design CMS roles and permissions
  - define publishing and review gates
  - assess auditability and least privilege
outputs:
  - CMS access-control model with roles, permissions, workflows, and audit requirements
sideEffects: []
dependencies: []
stopCondition: Roles, permissions, workflow gates, and audit requirements are explicit.
risk: low
trustTier: 1
maxIterations: 6
---

# cms-access-control

Use this skill when designing or reviewing CMS roles, permissions, approval gates, publishing authority, content ownership, and audit requirements.

## Contract

- Input: editorial roles, content types, workflow states, publishing risk, compliance constraints, and platform capabilities.
- Output: role-permission matrix, workflow gates, audit requirements, and exception handling.
- Scope: CMS access control; general authentication belongs to auth.
- Boundary: keep least privilege practical enough for editors to complete normal work without sharing privileged accounts.

## Rules

- Rule: define roles by editorial responsibility, not only by organization chart.
- Rule: separate create, edit, review, approve, publish, archive, delete, and administer permissions.
- Rule: require explicit gates for high-risk publishing surfaces.
- Rule: log privileged actions, workflow transitions, and permission changes.
- Rule: document break-glass or emergency publishing behavior if needed.

## Steps

1. Inventory roles, content types, workflow states, and publishing risks.
2. Build a permission matrix by action and content scope.
3. Define approval gates, segregation of duties, and exceptions.
4. Specify audit logs, review cadence, and permission-change controls.
5. Identify usability risks that could drive unsafe workarounds.
6. Document validation tests for representative roles.

## Completion Criteria

- role-permission matrix is defined
- publishing gates and exceptions are explicit
- audit and permission-review requirements are documented
- representative access tests are identified
