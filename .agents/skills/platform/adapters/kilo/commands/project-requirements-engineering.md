---
description: "Transform stakeholder, business, and system needs into verifiable, traceable, versioned requirements with explicit provenance, conflicts, quality gates, and change impact."
---
# requirements-engineering

When to use: Transform stakeholder, business, and system needs into verifiable, traceable, versioned requirements with explicit provenance, conflicts, quality gates, and change impact.

## Workflow

1. **Preflight.** Load the schema, identify scope/non-goals, collect fixed point and operation metadata, and inventory sources. Completion: all inputs are labeled untrusted; source identity and digest/absence are recorded; schema availabili...
2. **Normalize.** Split statements into atomic obligations, define terms, actors, boundaries, dependencies, and IDs. Completion: no compound “and” obligation remains unexplained; duplicates and omissions are listed
3. **Classify and quality-check.** Assign taxonomy, priority, owner, applicability, and all nine quality results. Completion: every applicable quality check has pass/fail evidence; omitted classes have reasons
4. **Resolve.** Record ambiguity/conflict options, named authority, decision, and evidence. Completion: unresolved issues are blockers; no guessed resolution remains
5. **Verify.** Add measurable acceptance criteria, Gherkin mappings, verification method/oracle, and forward/backward trace links. Completion: every non-blocked requirement has an observable oracle and both trace directions
6. **Baseline or change.** Record approval only when explicitly supplied; otherwise use `ready`. For changes, compare revisions and enumerate impacts and rollback. Completion: immutable revision, approval evidence, or exact blocker is present
7. **Validate and hand off.** Validate the complete envelope against the schema and report status, risks, residual unknowns, and next consumer. Completion: invalid output is rejected; valid output names the next consumer and does not overcl...

## Deliverables

- RequirementsArtifact artifact

## Guardrails

- risk: high; trust tier: 4; approval required: yes
- side effects: none
- isolation: none; model tier: reasoning

Stop when: Return one schema-valid RequirementsArtifact only when every included requirement has provenance, owner, status, priority, verification evidence, and bidirectional traceability; otherwise return a structured blocked or rejected artifact with exact blockers and no invented values.
