# Evaluation Criteria

Use these thresholds when scoring viability, functionality, and scalability. A rating must be justified by at least one concrete finding.

## Viability

**Viable**
- `CONTEXT.md` goals are achievable with the current module boundaries.
- ADR decisions are internally consistent and implemented.
- No dead code, orphaned modules, or abandoned integration seams.

**Conditional**
- Goals are achievable but depend on resolving a specific blocker (e.g., missing data layer, contradicted ADR).
- One or more modules exist without a clear caller or purpose.

**Not viable**
- `CONTEXT.md` goals contradict the codebase shape.
- Core ADR decisions are violated and cannot be reconciled without rewrites.
- The project is missing its primary abstraction or data plane.

## Functionality

**Complete**
- Every behavior described in `CONTEXT.md` and the ADRs has a matching implementation.
- No undocumented behavior contradicts the domain model.

**Partial**
- Some documented behavior is missing or only partially implemented.
- Gaps are localized and do not break core invariants.

**Broken**
- Documented behavior is contradicted by implementation.
- Core invariants from `CONTEXT.md` or ADRs are violated in production paths.

## Scalability

**Scalable**
- Modules are deep: small interfaces, large behavior.
- New domain concepts can be added at existing seams without rewriting core logic.
- Logical changes concentrate in one module or layer.

**Bounded**
- The current architecture supports growth up to a known limit (e.g., single-region deployment, synchronous call graph).
- Adding new dimensions requires explicit refactoring, but the path is clear.

**Fragile**
- Shotgun surgery or divergent change is the norm.
- New domain concepts require changes across unrelated modules.
- The codebase has no clear seam for storage, transport, or presentation changes.
