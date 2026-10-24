# Codebase Design: Skill Graph Index

**Status:** Proposed design; no implementation included.
**Context:** `CONTEXT.md`, ADR-001, ADR-002, ADR-003, and the 2026-10-24 viability assessment.

## Problem space

The current skill graph module mixes five responsibilities: frontmatter parsing, skill discovery, graph construction, persistence, and ranking. It exposes many low-level functions (`parseFrontmatter`, `collectSkills`, `buildGraphFromSkills`, `propagate`, `rank`, `neighbors`, and persistence helpers) to callers such as routing evaluation and the MCP skill-lab server (`.agents/skills/platform/skill-graph.mjs:76-182`, `216-347`, `424-570`). That makes the graph's invariants—exact matches remain above neighborhood matches, persisted graphs are deterministic, and graph edges resolve only to known skills—caller's knowledge.

The proposed deep module is a **Skill Graph Index**. Its external seam owns graph lifecycle and retrieval. The current filesystem walk and shared check-all manifest are source adapters; an in-memory graph is the test adapter. Persistence remains hidden behind the module rather than becoming a caller concern.

Illustrative shape, not implementation:

```js
const index = createSkillGraphIndex({ source, store });
await index.refresh();
const result = index.find("artifact handoff", { limit: 5 });
```

## Proposed interface

```ts
type SkillGraphIndex = {
  refresh(): Promise<RefreshResult>;
  find(query: string, options?: FindOptions): FindResult;
  neighbors(skill: string): NeighborResult;
  diagnostics(): GraphDiagnostics;
};

type FindOptions = { limit?: number };
```

### Interface contract

- `refresh()` reads the source adapter, validates and normalizes skill records, rebuilds the graph, and atomically replaces the in-memory snapshot. It returns node count, edge count, edge-type counts, and a content fingerprint.
- `find()` accepts a user query and returns ranked skills plus reasons and convergence metadata. Exact-name and keyword seeds always outrank pure neighborhood activation, preserving the current invariant (`skill-graph.mjs:10-13`, `43-50`).
- `neighbors()` returns typed adjacent skills for a known skill; unknown names return a typed `not-found` result rather than throwing.
- `diagnostics()` reports graph freshness, node/edge counts, unresolved references, empty-capability count, and the source fingerprint. It does not expose graph construction structures.
- The index is read-only between refreshes. A query observes one immutable snapshot; refresh cannot partially mutate a query.
- `limit` is positive and bounded by a module-owned maximum. Invalid options produce a typed usage error.
- Ranking remains deterministic for the same source snapshot and query. Persistence format and PageRank parameters are implementation details.

## Seam and adapters

The seam is at the **Skill Graph Index interface**, not at every parser or algorithm helper. This is a real seam because there are already two source forms: filesystem discovery (`collectSkills`) and the shared manifest path (`skillsFromManifest`), plus two testable storage choices: persisted JSON and in-memory snapshots.

Adapters:

1. `FilesystemSkillSource` — production/CLI adapter; discovers canonical skills below `.agents/skills`, excluding platform infrastructure.
2. `ManifestSkillSource` — check-all/audit adapter; consumes the already-built manifest and must produce the same normalized records.
3. `FileGraphStore` — optional production cache adapter for `.agents/skills/platform/graph/skill-graph.json`.
4. `MemoryGraphStore` — test adapter; no file writes.

The public module hides frontmatter parsing, handoff extraction, edge weighting, PageRank, determinism sorting, JSON persistence, cache invalidation, and unresolved-reference accounting. Callers should not import `parseFrontmatter`, `buildGraphFromSkills`, `propagate`, or `saveGraph` once migrated.

## Depth analysis

This is a deep module because one small interface absorbs source normalization, graph invariants, ranking policy, snapshot consistency, diagnostics, and persistence policy. It gives routing callers leverage: they ask for a result, not a graph algorithm. It gives maintainers locality: adding a new edge type or changing ranking policy is localized to the index implementation and its interface tests.

The platform validator/runtime split should remain an **internal packaging move**, not a second public seam in this design. The index may live with read-only graph/index code, while executors and mutating runners move to a runtime area later. Exposing separate validator APIs to every caller would create a shallow pass-through layer and increase coupling.

## Migration and test surface

1. Define normalized source and result types in a platform-local module.
2. Implement the index around the existing pure graph functions without changing ranking behavior.
3. Replace direct imports in `evals/evaluate-routing.mjs`, `trajectory-eval.mjs`, `trace-improver.mjs`, marketplace export, and MCP skill-lab with the index interface.
4. Keep CLI commands as a thin adapter over the index.
5. Add interface tests for: filesystem/manifest equivalence, deterministic refresh, exact-match precedence, unknown skill handling, unresolved references, atomic refresh, and memory-store isolation.
6. Remove tests that assert private graph representation once equivalent interface tests exist.

## Rejected alternatives

- **Expose a `Graph` object:** rejected; callers would learn node/edge layout and PageRank details, making future edge types expensive.
- **One interface per helper:** rejected; it preserves the current shallow decomposition and spreads invariants across callers.
- **Only split directories:** useful for LOC budgeting, but it does not create leverage or hide graph policy.

## Recommendation

Adopt the Skill Graph Index as the single external seam. Treat filesystem and manifest ingestion as adapters, preserve the current ranking invariants, and use interface-level tests as the replacement test surface. After this seam is stable, split platform validators from runtime executors internally to satisfy the growth policy without exposing another caller-facing interface.

## Glossary

- **Module:** the Skill Graph Index and its hidden implementation.
- **Interface:** the four operations and their invariants above.
- **Seam:** the location of the Skill Graph Index interface.
- **Adapter:** filesystem, manifest, file-store, and memory-store implementations.
- **Depth:** graph lifecycle, ranking, consistency, and diagnostics hidden behind four operations.
- **Leverage:** one routing contract serves CLI, evaluation, MCP, and future consumers.
- **Locality:** graph policy changes remain inside the index.
