# Risk Profiles

> **Status:** Phase 0 policy | **Owner:** quirk Skills maintainers | **Scope:** selecting gates and authority by consequence | **Last reviewed:** 2026-11-17 | **Review cadence:** quarterly and after incident or regulatory change

Profiles are additive: choose the highest applicable profile and combine its gates with the general profile. A profile changes evidence and approval requirements; it does not guarantee safety or compliance.

| Profile | Trigger | Required gates | Required authority |
|---|---|---|---|
| General | Ordinary software with bounded impact | Requirements acceptance, design review, tests, code review, dependency/license check, release evidence | Product owner plus engineering reviewer |
| Security-sensitive | Secrets, identity, payment data, internet exposure, privileged execution | Threat model, secure design review, SSDF-aligned controls, SAST/DAST/dependency/SBOM checks, incident runbook, provenance | Security owner independent of implementer for release gate |
| Financial | Money movement, valuation, trading, credit, billing, material financial reporting | Deterministic fixtures, reconciliation, limits, audit trail, change control, rollback, model validation where applicable | Finance/risk control owner and engineering reviewer |
| AI-system | Model, agent, RAG, or automated decision affects people or operations | Dataset/model/prompt manifest, evaluation and calibration, privacy/abuse tests, human override, drift monitoring, incident and rollback plan | Model/risk owner; domain or ethics authority where impact warrants |
| Production | Customer-facing or operationally critical deployment | CI gate, release approval, observability, SLO/error budget, backup/restore, progressive rollout, rollback rehearsal | Service owner and operations/release authority |
| Regulated | Contract, law, regulator, or certification imposes controls | Control-to-evidence matrix, retention, access review, segregation of duties, audit trail, supplier evidence, periodic attestation | Named compliance/regulatory authority; independent audit when required |
| Safety-critical | Failure can cause injury, environmental harm, or loss of essential function | Hazard analysis, safety case, requirements traceability, independence, formal/structural verification as required, configuration control, validated change and rollback | Competent safety authority and applicable domain standard owner |

## Gate selection rules

- Record the profile, trigger, risk owner, acceptance authority, and required evidence in the work item.
- If profile applicability is uncertain, use the higher-risk profile until a competent authority resolves it.
- A general engineering reviewer cannot substitute for a required security, finance, compliance, AI-risk, production, or safety authority.
- `AUDIT-INCOMPLETE` is the default when a required authority or independent evidence is missing.
