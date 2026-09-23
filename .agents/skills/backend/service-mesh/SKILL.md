---
name: service-mesh
category: backend
maturity: stable
version: 1
description: Service mesh (Istio, Linkerd, Cilium, mTLS, traffic splitting, observability).
capabilities:
  - design service mesh architecture
  - configure mTLS and zero trust
  - plan traffic splitting and routing
  - define mesh observability
outputs:
  - Service mesh artifact with findings, decisions, recommendations, and validation notes
sideEffects: []
dependencies: []
stopCondition: Service mesh design complete; artifact saved; completion criteria checked.
risk: medium
trustTier: 3
maxIterations: 6
---

# Service Mesh

Use this skill when designing or reviewing a service mesh — Istio, Linkerd, Cilium, or similar — for mTLS, traffic management, observability, and zero-trust networking.

## Contract

- Input: service inventory, traffic topology, security requirements, and observability needs.
- Output: mesh architecture with trust model, traffic policies, and observability configuration.
- Scope: design mesh policies and topology; not cluster provisioning unless explicitly requested.
- Rule: the mesh secures east-west traffic; north-south traffic should still pass through gateway policies.
- Rule: define a clear trust boundary: which services are in-mesh, which are external, and how they connect.
- Rule: keep mesh configuration declarative and version-controlled.

## Process

### 1. Map service topology
- Inventory all services, their namespaces, communication patterns, and dependencies.
- Identify critical paths, latency-sensitive services, and blast-radius concerns.
- Define namespace and mesh boundary strategy.

**Completion criterion:** service topology documented with critical paths and mesh boundary.

### 2. Design zero-trust security
- Define mTLS policy: permissive, strict, or per-service migration strategy.
- Plan authorization policies: which services can call which, with what method/path constraints.
- Define certificate rotation and external CA integration if needed.

**Completion criterion:** mTLS and authorization policy documented with migration strategy.

### 3. Configure traffic management
- Define routing rules, retries, timeouts, and circuit breakers per service.
- Plan canary releases, A/B testing, and traffic splitting via header or weight routing.
- Design fault injection rules for resilience testing in staging.

**Completion criterion:** traffic management rules documented with rollout and rollback behavior.

### 4. Plan observability
- Configure automatic metric emission: request rate, error rate, latency (RED metrics).
- Enable distributed tracing with W3C TraceContext propagation.
- Define access logging policy and sampling rate.

**Completion criterion:** RED metrics, tracing, and access log policy documented.

### 5. Design ingress and egress
- Configure ingress gateway for north-south traffic with TLS termination.
- Define egress policy: which services may call external endpoints and through which egress gateway.
- Plan DNS resolution and service entry configuration for external services.

**Completion criterion:** ingress/egress policy documented with TLS and access control.

### 6. Plan operations and rollout
- Define sidecar injection strategy (automatic namespace-wide or manual per pod).
- Plan mesh upgrade procedure with canary control plane and data plane validation.
- Document rollback triggers and mesh-aware debugging procedures.

**Completion criterion:** rollout and rollback procedure documented.

## Rules

- Rule: never disable mTLS in production without an explicit, time-boxed exception.
- Rule: keep mesh configuration in Git; use progressive rollout for policy changes.
- Rule: define retry budgets; unlimited retries amplify failures.
- Rule: scope authorization policies to least privilege; default deny.
- Rule: instrument mesh metadata carefully; avoid logging request/response bodies in production.
- Rule: validate mesh config in staging with production traffic mirrors before promoting.

## Completion Criteria

- service topology is documented with critical paths and mesh boundary
- mTLS and authorization policy is documented with migration strategy
- traffic management rules are documented with rollout and rollback behavior
- RED metrics, tracing, and access log policy are documented
- ingress/egress policy is documented with TLS and access control
- rollout and rollback procedure is documented
