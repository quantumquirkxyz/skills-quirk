# Software Engineering Standards Registry

> **Status:** Phase 0 verified-reference register | **Owner:** quirk Skills maintainers | **Scope:** references and classification only; not a compliance claim | **Last reviewed:** 2026-11-17 | **Review cadence:** quarterly, on edition change, or when a gate adopts a reference

`Standard` is a published normative specification. `Framework` is guidance or a control taxonomy. `Method` is a way of working. `Metric` is a measurement model. “Current” means the cited edition is the maintained target at this baseline; “historical” means retained for transition, compatibility, or provenance.

| Reference | Class | Status / boundary | URL |
|---|---|---|---|
| SWEBOK v4.0a | body of knowledge | Current draft/baseline; not a certification or process standard | [IEEE Computer Society](https://www.computer.org/education/bodies-of-knowledge/software-engineering-v4) |
| ISO/IEC/IEEE 12207 | standard | Transition family; record exact edition and scope | [ISO](https://www.iso.org/standard/63712.html) |
| ISO/IEC/IEEE 15288 | standard | Current systems life-cycle companion | [ISO](https://www.iso.org/standard/81702.html) |
| ISO/IEC/IEEE 29148 | standard | Current requirements engineering reference | [ISO](https://www.iso.org/standard/72089.html) |
| ISO/IEC/IEEE 42010:2022 | standard | Current architecture description standard | [ISO](https://www.iso.org/standard/74393.html) |
| ISO/IEC 25010:2023 | standard | Current product quality model | [ISO](https://www.iso.org/standard/78176.html) |
| ISO/IEC 33000 family | standard / assessment | Current process assessment family; assessment is not self-assertion | [ISO](https://www.iso.org/standard/54175.html) |
| ISO/IEC/IEEE 14764:2022 | standard | Current maintenance guidance | [ISO](https://www.iso.org/standard/80705.html) |
| ISO/IEC/IEEE 10007 | standard | Current configuration management guidance | [ISO](https://www.iso.org/standard/70400.html) |
| ISO/IEC/IEEE 29119 | standard family | Current testing family | [ISO](https://www.iso.org/standard/81291.html) |
| ISO/IEC/IEEE 730 | standard | Current quality assurance process reference | [ISO](https://www.iso.org/standard/81875.html) |
| NIST SSDF | framework | Current SP 800-218 v1.1; secure development practices, not proof of security | [NIST](https://csrc.nist.gov/pubs/sp/800/218/final) |
| NIST CSF 2.0 | framework | Current outcomes and governance taxonomy | [NIST](https://www.nist.gov/cyberframework) |
| NIST AI RMF | framework | Current 1.0; AI risk governance, not model validation alone | [NIST](https://www.nist.gov/itl/ai-risk-management-framework) |
| SLSA 1.2 | framework / provenance | Current target; verify release status before a conformance claim | [SLSA](https://slsa.dev/spec/v1.2/) |
| SPDX | standard / format | Current SBOM and license/security exchange | [SPDX](https://spdx.dev/specifications/) |
| CycloneDX / VEX | standard / formats | Current SBOM plus vulnerability-exploitability assertions | [CycloneDX](https://cyclonedx.org/specification/overview/) |
| OpenTelemetry | framework / specification | Current telemetry APIs and semantic conventions | [OpenTelemetry](https://opentelemetry.io/docs/specs/otel/) |
| DORA | metric framework | Current research metric family; do not optimize one metric alone | [DORA](https://dora.dev/research/) |
| SPACE | metric framework | Current research model; not individual ranking | [ACM Queue](https://queue.acm.org/detail.cfm?id=3454124) |
| FinOps Framework | framework / method | Current cloud financial accountability guidance | [FinOps](https://www.finops.org/framework/) |
| SCI / ISO 21031 | metric / standard | Current carbon-intensity measurement; record boundaries and factors | [SCI](https://sci.greensoftware.foundation/) / [ISO](https://www.iso.org/standard/85066.html) |
| OpenGitOps | framework / principles | Current declarative/reconciled operations principles | [OpenGitOps](https://opengitops.dev/) |
| CMMI | framework / appraisal | Current product family; appraisal level is not a quality guarantee | [ISACA CMMI](https://cmmiinstitute.com/) |
| Scrum Guide | method framework | Current 2020 guide; not a life-cycle or compliance standard | [Scrum Guide](https://scrumguides.org/scrum-guide.html) |
| Safety profiles | profile category | Context-dependent: IEC 61508, ISO 26262, IEC 62304, DO-178C, EN 50128 | [IEC functional safety](https://www.iec.ch/functionalsafety) / [ISO 26262](https://www.iso.org/standard/68383.html) |

## Registry rules

- Record exact edition, publication date, adoption status, scope, and access date for conformance work.
- Do not call a framework a standard, a method a metric, or a metric a gate.
- Historical editions support migration and provenance but cannot silently satisfy a current requirement.
- A URL proves discoverability only. Conformance requires applicable evidence and an authority with the right scope.
