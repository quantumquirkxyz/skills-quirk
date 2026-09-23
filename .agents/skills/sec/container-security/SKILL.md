---
name: container-security
category: sec
maturity: stable
version: 1
description: Container security (Docker, Kubernetes, image scanning, runtime security, pod security policies)
capabilities:
  - design secure container images (minimal base, non-root, read-only filesystem, no privileged mode)
  - implement image scanning (vulnerability, secret, malware, SBOM) in CI/CD
  - configure Kubernetes Pod Security Standards (restricted / baseline / privileged)
  - set up runtime security (Falco, Seccomp, AppArmor, seccomp profiles)
  - design Kubernetes RBAC and network policies for least-privilege access
  - manage container secrets (external secrets operator, CSI drivers, KMS integration)
outputs:
  - Container security baseline document
  - Image scan policy and CI/CD gate
  - Runtime security rules (Falco / Seccomp / AppArmor)
  - Kubernetes security policy (Pod Security, RBAC, NetworkPolicy)
sideEffects: []
dependencies: []
stopCondition: Container baseline saved; image scan policy defined; runtime rules documented; K8s security policies complete.
risk: medium
trustTier: 3
maxIterations: 6
---

## Contract

- **Input:** container runtime (Docker, Kubernetes, ECS, GKE), workload architecture, compliance requirements.
- **Output:** container security baseline + image scan policy + runtime rules + K8s security policies.
- **Side effects:** none.
- **Dependencies:** container registry access; cluster access for policy validation.
- **Stop condition:** baseline and policies documented; scan gates defined; runtime rules applied.
- **Risk:** medium — container breaches can lead to full cluster compromise and lateral movement.
- **Boundary:** designs and audits container security; does not deploy or patch workloads.

# Container Security

Secure **container workloads** — image hygiene, runtime protection, Kubernetes policies, and orchestration controls — for Docker and Kubernetes.

## Process

### 1. Image security baseline
- **Base image:** use minimal, distroless, or scratch images; pin digests (not tags) in production.
- **Non-root:** run containers as non-root user (USER directive); avoid running as root in Dockerfile or pod spec.
- **Read-only filesystem:** mount root filesystem read-only where possible; use emptyDir for writable paths.
- **Capabilities:** drop ALL Linux capabilities; add back only what is required (NET_BIND_SERVICE for port < 1024).
- **Privileged mode:** never run privileged containers in production; use specific capabilities instead.
- **Resource limits:** set CPU and memory limits; enable QoS class for critical workloads.

**Completion criterion:** image baseline documented; Dockerfile template created.

### 2. Image scanning and CI/CD gate
- **Scan types:** vulnerability (CVE), secrets (API keys, tokens), malware, license compliance.
- **Tooling:** Trivy, Grype, Snyk, Anchore, Docker Scout; integrate into CI/CD pipeline.
- **Gate policy:** block critical and high-severity CVEs; medium requires approval with justification; low tracked in backlog.
- **SBOM:** generate Software Bill of Materials (SPDX, CycloneDX) for each image; store in registry or artifact store.
- **Signing and verification:** sign images (Cosign, Notary); enforce signature verification in admission controller.

**Completion criterion:** scan policy defined; CI/CD gate implemented; SBOM generation automated.

### 3. Pod Security Standards (Kubernetes)
- **Restricted (production default):** must run as non-root; no privilege escalation; read-only root filesystem; drop all capabilities; seccomp profile RuntimeDefault.
- **Baseline:** prevents known privilege escalations; allows more flexibility than restricted.
- **Privileged:** unrestricted; only for system / infrastructure namespaces with explicit approval.
- **Enforcement:** use Pod Security Admission (enforce / audit / warn); migrate from PodSecurityPolicy (deprecated).
- **Namespace labels:** set pod-security.kubernetes.io/{enforce,audit,warn} labels per namespace.

**Completion criterion:** Pod Security Standards configured; production namespaces enforce restricted; exceptions documented.

### 4. Runtime security
- **Seccomp profiles:** apply RuntimeDefault or custom seccomp profiles; block dangerous syscalls (mount, ptrace, kexec).
- **AppArmor / SELinux:** apply mandatory access control profiles; use container-default profiles and customise for workload needs.
- **Falco / runtime detection:** deploy Falco for runtime anomaly detection (unexpected process execution, file modification, network connections).
- **Admission control:** enforce policies at admission time (Kyverno, OPA Gatekeeper); validate image provenance, resource limits, security context.

**Completion criterion:** runtime security rules documented; admission control configured; Falco rules deployed.

### 5. Kubernetes access control
- **RBAC:** least-privilege roles; avoid cluster-admin; use namespace-scoped roles; bind service accounts to specific roles.
- **Service accounts:** disable automountServiceAccountToken where not needed; use distinct service accounts per workload.
- **Network policies:** default-deny ingress and egress; allow only required traffic; use namespace-scoped policies.
- **API server hardening:** enable RBAC, Node Authorization, AlwaysPullImages; disable anonymous auth; enable audit logging.

**Completion criterion:** RBAC and NetworkPolicy templates created; cluster hardening checklist complete.

### 6. Secrets management in containers
- **Avoid env vars:** do not pass secrets via environment variables; use mounted secrets or volume projection.
- **External Secrets Operator:** sync secrets from Vault / AWS Secrets Manager / GCP Secret Manager into Kubernetes secrets.
- **CSI volume drivers:** mount secrets as files via CSI (secrets-store.csi.k8s.io); in-memory or encrypted volume.
- **KMS integration:** use envelope encryption for etcd; encrypt Kubernetes secrets at rest with KMS.

**Completion criterion:** secrets management design documented; injection method defined.

### 7. Monitoring and compliance
- **Audit logging:** enable Kubernetes audit logs; log to immutable storage; alert on suspicious RBAC changes.
- **Image attestation:** verify image provenance in admission control; reject unsigned or untrusted images.
- **Compliance checks:** CIS Kubernetes Benchmark; NSA / CISA Kubernetes Hardening Guide; SOC 2 controls.
- **Vulnerability management:** track CVEs by image and namespace; prioritise by severity and exploitability.

**Completion criterion:** monitoring and compliance runbook saved.

## Rules

- Rule: never run containers as root; enforce non-root in Pod Security Standards and Dockerfile.
- Rule: pin image digests in production; block mutable tags (latest, stable) in deployment pipelines.
- Rule: scan every image before it reaches production; block critical and high-severity findings automatically.
- Rule: default-deny all network traffic; allow only required ingress and egress paths with NetworkPolicy.
- Rule: store secrets in external secret stores (Vault, KMS, cloud secret manager); never embed secrets in images, ConfigMaps, or env vars.
- Rule: enable runtime security (Falco, Seccomp, AppArmor) and admission control for production clusters.
- Rule: apply least-privilege RBAC; review role bindings and service accounts quarterly; remove unused permissions.
