---
name: astro
category: frontend
maturity: stable
version: 1
description: Astro framework (islands architecture, content-focused sites, SSR/SSG, view transitions).
capabilities:
  - design astro project structure
  - apply islands architecture
  - configure SSR and SSG rendering modes
  - design view transitions
outputs:
  - Astro artifact with findings, decisions, recommendations, and validation notes
sideEffects: []
dependencies: []
stopCondition: Astro design complete; artifact saved; completion criteria checked.
risk: low
trustTier: 1
maxIterations: 6
---

# Astro

Use this skill when designing or reviewing Astro projects — content-focused sites, islands architecture, SSR/SSG hybrid rendering, and view transitions.

## Contract

- Input: site content model, rendering requirements, interactivity needs, and deployment target.
- Output: Astro project design with island strategy, rendering mode decisions, and routing plan.
- Scope: design Astro architecture and component boundaries; not full implementation.
- Rule: default to static rendering unless interactivity or personalization demands SSR/SSR.
- Rule: isolate interactive components as islands to minimize client-side JavaScript.
- Rule: keep content collections typed and validated at build time.

## Process

### 1. Map content and routes
- Inventory content types, collections, and dynamic routes.
- Identify which pages are static, server-rendered, or edge-rendered.
- Define the routing structure and any middleware needs.

**Completion criterion:** content map and route strategy documented.

### 2. Design island architecture
- Identify interactive components that need client-side hydration.
- Choose hydration strategy per island (`visible`, `load`, `idle`, `media`, `only`).
- Determine island boundaries to minimize bundle size.

**Completion criterion:** island inventory with hydration strategies defined.

### 3. Configure rendering modes
- Set SSR/SSG per route based on freshness, personalization, and performance needs.
- Choose adapter for deployment target (Vercel, Netlify, Cloudflare, Node).
- Define on-demand rendering triggers and caching policy.

**Completion criterion:** rendering mode per route documented with rationale.

### 4. Design view transitions
- Plan animated transitions between routes where they improve UX.
- Use `view-transition` API or Astro's `transition:` directives.
- Define fallback for browsers without view transition support.

**Completion criterion:** transition map created with progressive enhancement noted.

### 5. Plan integrations and content
- Configure content collections, schemas, and TypeScript types.
- Define CMS integration strategy if applicable.
- Set up image optimization, RSS feeds, and sitemap.

**Completion criterion:** content layer and integrations planned.

## Rules

- Rule: prefer static rendering by default; justify every SSR route with a concrete need.
- Rule: keep client-side islands small, lazy-loaded, and independently hydratable.
- Rule: use content collections for type-safe content management.
- Rule: design for progressive enhancement; view transitions must not block navigation.
- Rule: define caching and revalidation strategy at the route level.
- Rule: separate data-fetching logic from UI components to keep islands shallow.

## Completion Criteria

- content map and route strategy are documented
- island boundaries and hydration strategies are defined
- rendering mode is chosen per route with rationale
- view transitions are mapped with fallback behavior
- content collections and integrations are planned
