---
name: vercel
category: platform
maturity: stable
version: 2
description: Shape Vercel deployment and runtime concerns into a clear operational seam — with Next.js, edge functions, ISR, middleware, environment, security, and observability constraints.
capabilities:
  - design Vercel deployment shape (Next.js, static, serverless, edge)
  - plan edge functions, middleware, ISR, and streaming
  - define environment, secrets, domains, and security headers
  - evaluate Vercel lock-in vs portability trade-offs
outputs:
  - Vercel deployment design (runtime shape, edge strategy, ISR, middleware, environment, security, observability)
sideEffects: []
dependencies: []
stopCondition: Vercel design complete; runtime seam and edge strategy explicit; lock-in trade-offs named.
risk: low
trustTier: 1
maxIterations: 6
---

# Vercel

Use this skill when a project runs on Vercel and the deployment/runtime seam needs to be clear. It should define what Vercel owns, what the app owns, and where operational expectations live.

## Contract

- Input: Vercel brief, runtime constraints, and deployment target.
- Output: a Vercel deployment design covering runtime shape, edge strategy, ISR, middleware, environment, security, and observability.
- Scope: design the Vercel shape, not the full deployment implementation.
- Rule: make runtime expectations explicit before choosing platform features.
- Rule: keep platform-specific coupling visible.
- Rule: describe rollback, monitoring, and cost boundaries in the same pass as the runtime seam.

## Process

### 1. Identify the runtime shape

- **Framework:** Next.js (App Router, Pages Router), React, Vue, Svelte, vanilla JS.
- **Deployment target:** static export, serverless functions, edge functions, or hybrid.
- **Runtime boundaries:** where does Vercel own execution vs the client?

**Completion criterion:** runtime shape named.

### 2. Design the edge and middleware strategy

- **Edge Functions:** lightweight, low-latency, geo-distributed; use for auth, redirects, A/B testing.
- **Middleware:** request/response interception; auth checks, rewrites, redirects, feature flags.
- **Regional vs centralized:** edge-first vs origin-rendered trade-offs.

**Completion criterion:** edge and middleware responsibilities named.

### 3. Plan caching and rendering

- **ISR / SSG / SSR:** incremental static regeneration, static site generation, server-side rendering.
- **Stale-while-revalidate:** cache strategy for data freshness vs latency.
- **On-demand revalidation:** cache tags, revalidation API, purge semantics.

**Completion criterion:** caching and rendering strategy named.

### 4. Environment and secrets

- **Environment variables:** build-time vs runtime; public vs private; edge vs serverless exposure.
- **Secrets management:** Vercel encrypted secrets, external vaults, rotation.
- **Domains and DNS:** custom domains, DNS provider, CDN, SSL/TLS.

**Completion criterion:** environment model and secret handling explicit.

### 5. Security and compliance

- **Security headers:** CSP, HSTS, X-Frame-Options, CORS.
- **Access control:** IP allowlisting, password protection, preview deployment access.
- **Compliance:** data residency, GDPR, PCI scope if handling payments.

**Completion criterion:** security controls named.

### 6. Observability and cost

- **Logs and metrics:** Vercel Analytics, Log Drains, external observability (Datadog, Sentry).
- **Performance:** Web Vitals, edge latency, function duration, cold starts.
- **Cost boundaries:** invocation limits, bandwidth, edge function pricing, overage risk.

**Completion criterion:** observability and cost boundaries explicit.

### 7. Lock-in and portability

- **Vercel-specific APIs:** Edge Config, KV, Blob, Postgres; migration path if leaving Vercel.
- **Open standards:** Next.js, OpenNext, adapter patterns for other platforms.

**Completion criterion:** lock-in trade-offs named.

## Completion criteria

- the runtime shape is named
- edge and middleware strategy is explicit
- caching and rendering approach is named
- environment and secret handling are explicit
- security controls are named
- observability and cost boundaries are explicit
- lock-in trade-offs are named

## References

- `../../foundation/observability/SKILL.md` — signal design
- `../../backend/backend-architecture/SKILL.md` — API and service seams
- `../../devops/devops-ci-cd-pipeline/SKILL.md` — deployment pipeline
