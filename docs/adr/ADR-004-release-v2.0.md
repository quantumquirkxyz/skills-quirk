# ADR-004: quirk Skills Release v2.0

## Status
Superseded by the v3.0.0 release (`VERSION`, `package.json`, `registry.yaml`).

> Historical record. The v2.0 plan below shipped as v3.0.0; it is kept for
> provenance and must not be read as the current release decision.

## Context
After 8 waves of modernization (artifact-first design, state machine workflows, shift-left gates, MCP-native, prompt management), the bundle has accumulated enough breaking changes to warrant a major version bump.

## Decision
Release v2.0 of quirk Skills with the following changes:
- All skills use v2 format (externalized contract, typed artifacts)
- Workflows are state machines in YAML
- 4-layer quality gates are standard
- MCP server and Agent Cards enable external discovery
- Documentation follows Diátaxis framework
- Prompt templates are versioned

## Consequences

### Positive
- Clean break from v1 format
- All modernization work is bundled in one release
- Consumers can migrate atomically

### Negative
- Breaking change for existing consumers
- Migration effort for all 230+ remaining skills
- Documentation overhaul

## Alternatives Considered

### A: Incremental v1.x releases
Release changes incrementally. Pros: no breaking changes. Cons: v1 format limitations persist, migration debt accumulates.

### B: v2.0 with all changes (CHOSEN)
Major version with all modernization. Pros: clean break, coherent story. Cons: bigger migration.

### C: Skip version bump
Just ship changes. Pros: no versioning friction. Cons: no clear signal of breaking changes.

## Review
Pending release approval.

## Related
- ADR-001: Artifact-First Design
- ADR-002: State Machine Workflows
- ADR-003: Shift-Left Quality Gates
