---
description: "Analyze and govern corrective, adaptive, perfective, and preventive software maintenance, technical debt, compatibility, deprecation, EOL, migration, modernization, retirement, ownership, and feedback into requirements and architecture."
---
# software-maintenance-evolution

When to use: Analyze and govern corrective, adaptive, perfective, and preventive software maintenance, technical debt, compatibility, deprecation, EOL, migration, modernization, retirement, ownership, and feedback into requirements and architecture.

## Workflow

1. **Preflight.** Load and validate the schema; capture operation ID, fixed point, dry-run mode, input identities, and scope
2. **Inventory.** Normalize components, versions, contracts, data stores, dependency edges, consumers, owners, requirements, architecture decisions, incidents, defects, metrics, and constraints. Preserve unknowns
3. **Classify.** Assign one maintenance class, driver tags, severity/priority, evidence, and affected boundaries
4. **Assess impact.** Trace direct and transitive consumers; evaluate compatibility, data migration, release, security, operational, documentation, and rollback consequences. Mark incomplete graph coverage explicitly
5. **Choose disposition.** Propose fix, upgrade, compatibility bridge, deprecation plan, migration, modernization, retirement, monitoring, or risk acceptance. Include alternatives and exit criteria
6. **Assign and close.** Require owner and closure evidence, or produce a structured blocked artifact. Ticket creation and all writes remain approval-gated
7. **Feed back.** Link findings to requirements, architecture decisions, contracts, tests, runbooks, release plans, and follow-up tickets in both directions
8. **Validate.** Validate the entire envelope against the schema and preserve blockers, residual unknowns, provenance, and approval state

## Deliverables

- MaintenanceArtifact artifact

## Guardrails

- risk: high; trust tier: 4; approval required: yes
- side effects: none
- isolation: none; model tier: reasoning

Stop when: Return one schema-valid MaintenanceArtifact only when each finding has evidence, maintenance class, impact, owner or an explicit no-owner blocker, proposed action, closure state, and downstream feedback; otherwise return blocked with exact gaps and no invented ownership or approval.
