---
name: state-management
category: frontend
maturity: stable
version: 1
description: Modern state management (Zustand, Jotai, signals, Redux Toolkit, server state).
capabilities:
  - design client state architecture
  - choose state management primitive
  - plan server state and caching
  - define state boundaries and ownership
outputs:
  - State management artifact with findings, decisions, recommendations, and validation notes
sideEffects: []
dependencies: []
stopCondition: State management design complete; artifact saved; completion criteria checked.
risk: low
trustTier: 1
maxIterations: 6
---

# State Management

Use this skill when designing state architecture for modern frontend applications — client state, server state, derived signals, and cache boundaries.

## Contract

- Input: application data flow, component tree, read/write patterns, and server interaction needs.
- Output: state architecture with primitive choices, state boundaries, and data flow diagram.
- Scope: design state management shape and boundaries; not full implementation.
- Rule: minimize global state; prefer local state, URL state, or server cache first.
- Rule: separate server state from client state; they have different lifecycles and invalidation rules.
- Rule: name the owner of each piece of state and its update authority.

## Process

### 1. Inventory state
- Catalog all state: UI state, form state, server cache, URL state, and global domain state.
- Classify each by lifetime, owner, and read/write frequency.
- Identify derived state and computed values.

**Completion criterion:** state inventory classified by type, lifetime, and owner.

### 2. Choose primitives
- Match state type to primitive: local React state, URL/search params, React Query/TanStack Query, Zustand, Jotai, Redux Toolkit, or signals.
- Justify each choice against performance, debugging, and team familiarity needs.

**Completion criterion:** primitive selected per state type with rationale.

### 3. Define state boundaries
- Determine which components or features own which slices.
- Design action/reducer or setter patterns for each boundary.
- Plan cross-slice communication without tight coupling.

**Completion criterion:** state boundary map with ownership and update paths.

### 4. Plan server state
- Choose caching and revalidation strategy (React Query, SWR, Apollo, Relay, or router cache).
- Define stale-while-revalidate, deduplication, and invalidation rules.
- Document optimistic updates and error rollback behavior.

**Completion criterion:** server state strategy documented with caching and invalidation rules.

### 5. Handle async and derived state
- Plan loading, error, success, and empty states for each async boundary.
- Design memoization or signal derivation for expensive computed values.
- Define suspense and transition boundaries if applicable.

**Completion criterion:** async and derived state patterns documented.

## Rules

- Rule: treat URL state as the canonical source for shareable UI state.
- Rule: avoid global client state when local state, context, or URL state suffices.
- Rule: separate server cache from client state; do not store server data in global client stores without revalidation.
- Rule: keep state updates unidirectional and traceable.
- Rule: avoid normalized stores unless the data shape justifies the complexity.
- Rule: document state hydration, rehydration, and hydration mismatch handling.

## Completion Criteria

- state inventory is classified by type, lifetime, and owner
- primitive selected per state type with rationale
- state boundary map defines ownership and update paths
- server state strategy documents caching and invalidation rules
- async and derived state patterns are documented
