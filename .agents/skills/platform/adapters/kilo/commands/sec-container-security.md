---
description: "Container security (Docker, Kubernetes, image scanning, runtime security, pod security policies)"
---
# container-security

When to use: Container security (Docker, Kubernetes, image scanning, runtime security, pod security policies)

## Workflow

1. Image and build baseline
2. SBOM, VEX, signing, and scan gate
3. Admission policy and mutable-tag defense
4. Kubernetes isolation and access
5. Runtime detection and drift
6. Secrets and data boundaries
7. Sandbox escape and vulnerability response
8. Rollback, monitoring, and adversarial fixtures

## Deliverables

- security artifact

## Guardrails

- risk: medium; trust tier: 3; approval required: yes
- side effects: none
- isolation: none; model tier: reasoning

Stop when: Container baseline saved; image scan policy defined; runtime rules documented; K8s security policies complete.
