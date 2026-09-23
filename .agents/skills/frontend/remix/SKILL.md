---
name: remix
category: frontend
maturity: stable
version: 1
description: Remix framework (loaders, actions, nested routes, progressive enhancement).
capabilities:
  - design remix route structure
  - apply loaders and actions
  - implement progressive enhancement
  - plan nested route boundaries
outputs:
  - Remix artifact with findings, decisions, recommendations, and validation notes
sideEffects: []
dependencies: []
stopCondition: Remix design complete; artifact saved; completion criteria checked.
risk: low
trustTier: 1
maxIterations: 6
---

# Remix

Use this skill when designing or reviewing Remix applications — loaders, actions, nested routes, mutations, and progressive enhancement.

## Contract

- Input: route map, data requirements, mutation patterns, and user interaction flows.
- Output: Remix route design with loader/action plan, data flow, and progressive enhancement strategy.
- Scope: design Remix routing and data-fetching architecture; not full implementation.
- Rule: every route owns its data via loaders; avoid shared mutable client state for server-owned data.
- Rule: actions handle mutations; loaders handle reads — keep the separation explicit.
- Rule: design for progressive enhancement so the app works without JavaScript.

## Process

### 1. Map nested routes
- Identify layout hierarchy, outlet structure, and parallel routes.
- Define which routes are index routes, parent layouts, or leaf pages.
- Plan error boundaries and CatchBoundary placement.

**Completion criterion:** nested route tree documented with boundaries marked.

### 2. Design loaders and data flow
- For each route: define loader function, required parameters, and data dependencies.
- Choose between parallel and dependent loaders.
- Document caching strategy and revalidation triggers.

**Completion criterion:** loader plan per route with dependencies and caching noted.

### 3. Define actions and mutations
- Identify mutation points: form submissions, optimistic updates, and side effects.
- Design action functions with intent-based routing (`intent` or named actions).
- Plan error handling and optimistic UI patterns.

**Completion criterion:** mutation map with action responsibilities and error strategy.

### 4. Plan progressive enhancement
- Ensure forms submit natively without JavaScript.
- Use `useNavigation` and `useSubmit` for client-side enhancement only.
- Design fallback loading and error states for non-JS users.

**Completion criterion:** enhancement strategy documented with non-JS fallback verified.

### 5. Configure integrations
- Define session management, cookie strategy, and auth boundaries.
- Plan external API integration via loaders or server utilities.
- Set up Vite, deploy target, and adapter.

**Completion criterion:** auth, session, and deployment configuration planned.

## Rules

- Rule: keep loaders and actions close to the route they serve; avoid centralizing data logic.
- Rule: never trust client state for authoritative data; loaders are the source of truth.
- Rule: use form actions over fetch-based mutations for accessibility and progressive enhancement.
- Rule: place error boundaries at logical route boundaries where failures should be isolated.
- Rule: cache loader responses explicitly; avoid over-fetching or under-fetching per route.
- Rule: keep mutations idempotent and side-effect-free on revalidation.

## Completion Criteria

- nested route tree is documented with boundaries marked
- loader plan per route includes dependencies and caching strategy
- mutation map documents action responsibilities and error handling
- progressive enhancement strategy is verified with non-JS fallback
- auth, session, and deployment configuration are planned
