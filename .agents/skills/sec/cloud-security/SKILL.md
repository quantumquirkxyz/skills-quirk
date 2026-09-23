---
name: cloud-security
category: sec
maturity: stable
version: 1
description: Cloud security (AWS, GCP, Azure, IAM, KMS, security groups, compliance, posture management)
capabilities:
  - design IAM policies and roles (least-privilege, service accounts, cross-account)
  - configure KMS / key management (envelope encryption, rotation, access policies)
  - audit security groups, NACLs, firewalls, and network segmentation
  - map cloud controls to compliance frameworks (SOC 2, PCI-DSS, HIPAA, FedRAMP, CIS)
  - set up cloud security posture management (CSPM) and continuous compliance
  - design cloud-native monitoring, alerting, and incident response
outputs:
  - Cloud security architecture document
  - IAM policy review (least-privilege findings)
  - Compliance matrix (control × cloud service × framework)
  - Posture management runbook
sideEffects: []
dependencies: []
stopCondition: Security architecture saved; IAM reviewed; compliance matrix complete; posture runbook documented.
risk: medium
trustTier: 3
maxIterations: 6
---

## Contract

- **Input:** cloud provider (AWS / GCP / Azure), workload architecture, compliance requirements.
- **Output:** cloud security architecture + IAM review + compliance matrix + CSPM runbook.
- **Side effects:** none.
- **Dependencies:** cloud provider access for validation; compliance framework definitions.
- **Stop condition:** architecture and controls documented; IAM least-privilege verified; compliance mapped.
- **Risk:** medium — misconfigured cloud controls lead to data exposure and regulatory violations.
- **Boundary:** designs and audits cloud security; does not provision resources.

# Cloud Security

Design and audit **cloud security** for AWS, GCP, and Azure — IAM, KMS, network controls, compliance, and posture management.

## Process

### 1. Asset and data inventory
- Enumerate cloud resources: compute, storage, databases, networking, serverless, containers.
- Classify data by sensitivity (public, internal, confidential, secret).
- Map data flows across regions and accounts.

**Completion criterion:** cloud asset inventory and data classification saved.

### 2. IAM design and review
- **Identity sources:** IdP (SAML, OIDC, LDAP); avoid local users where possible.
- **Roles and permissions:** least-privilege; separate duties; no wildcard actions on sensitive services.
- **Service accounts:** disable default credentials; use workload identity / IAM roles for service accounts (IRSA / Workload Identity).
- **Cross-account access:** use roles with explicit trust policies; avoid long-lived keys.
- **MFA:** enforce MFA for all human users; MFA-protected API access.
- **Access reviews:** periodic review of unused permissions and stale accounts.

**Completion criterion:** IAM design reviewed; least-privilege gaps documented.

### 3. Key management and encryption
- **KMS:** use cloud KMS (AWS KMS, GCP Cloud KMS, Azure Key Vault); envelope encryption for large datasets.
- **Key rotation:** automatic rotation (annual for data keys; more frequent for session keys).
- **Access control on keys:** restrict key usage to specific roles and services; use key policies / IAM conditions.
- **At-rest encryption:** enable by default for storage (S3, GCS, Blob), databases (RDS, Cloud SQL, Cosmos), block storage.
- **In-transit encryption:** TLS 1.3 for all endpoints; disable unencrypted protocols.

**Completion criterion:** KMS and encryption design documented; rotation schedule defined.

### 4. Network security
- **Security groups / firewall rules:** deny all by default; allow only required ports and sources; avoid 0.0.0.0/0 on sensitive ports.
- **NACLs and network policies:** layer-4 controls for subnet-level restrictions.
- **Private connectivity:** use VPC endpoints / Private Service Connect; avoid public IPs for internal services.
- **DNS security:** enable DNS logging; use private DNS zones; protect against DNS hijacking.
- **DDoS protection:** enable cloud-native DDoS (Shield, Cloud Armor, DDoS Protection Standard).

**Completion criterion:** network security baseline documented; exceptions justified.

### 5. Compliance mapping
- **Frameworks:** SOC 2 (CC6, CC7), PCI-DSS (req 2, 3, 6, 8, 10, 12), HIPAA (164.312), CIS Controls (IG1/IG2), FedRAMP (Moderate / High).
- **Control mapping:** map each cloud control (encryption, logging, IAM, network) to framework requirements.
- **Evidence collection:** enable audit logs (CloudTrail, Cloud Audit Logs, Activity Log); store logs immutably.
- **Gap analysis:** identify controls not met; document compensating controls or remediation plans.

**Completion criterion:** compliance matrix complete; gaps and compensating controls documented.

### 6. Cloud security posture management (CSPM)
- **Tooling:** enable native CSPM (AWS Security Hub, GCP Security Command Center, Azure Defender) and/or third-party (Wiz, Prisma, Lacework).
- **Checks:** misconfigured storage (public S3/GCS/Blob), overly permissive IAM, unencrypted services, exposed secrets.
- **Automation:** auto-remediate low-severity findings (e.g., public bucket alerts); manual review for high-severity.
- **Continuous monitoring:** dashboards for open findings, trend analysis, mean-time-to-remediate (MTTR).

**Completion criterion:** CSPM runbook complete; dashboards and alerting configured.

### 7. Incident response and logging
- **Logging:** enable and centralise audit logs, VPC flow logs, application logs, Kubernetes audit logs.
- **Alerting:** define alert thresholds for anomalous IAM activity, data exfiltration indicators, privilege escalation.
- **Runbooks:** document response playbooks for common incidents (public bucket, compromised IAM key, DDoS, data breach).
- **Forensics:** enable immutable log storage; snapshot capabilities for compute and storage.

**Completion criterion:** incident response runbook saved; logging and alerting verified.

## Rules

- Rule: enforce least-privilege IAM with deny-by-default; review and remove excess permissions quarterly.
- Rule: enable encryption at rest and in transit for all sensitive data; never store secrets in resource names or tags.
- Rule: use cloud-native security tools before third-party solutions; document exceptions.
- Rule: map every compliance requirement to a verifiable control and evidence source.
- Rule: never grant cloud admin / owner role to service accounts or CI/CD pipelines without explicit approval and just-in-time access.
- Rule: enable multi-factor authentication (MFA) for all human identities; use workload identity for machines.
- Rule: implement network segmentation and private connectivity for all internal traffic; public exposure must be explicitly justified.
