# Project/Product Applicability Matrix

This matrix is the routing contract for the integrated project, product, and professional skills. Capabilities are contextual requirements; `dependencies` remain only for strict acyclic prerequisites.

| Skill | Software-delivery trigger | Required handoff | Default authority | Read-only default |
|---|---|---|---|---|
| `make-project` | Board governs software changes | board fixed point -> `to-spec`/`to-tickets`, governance owner | board mutation approval | no |
| `professional-project-management` | Plan governs software milestones | project plan -> requirements/spec/tickets | planning authority only | yes |
| `project-development` | Software-shaped project | requirements digest -> `ArchitectureArtifact` | assessment only | yes |
| `project-viability` | Viability recommendation affects delivery | `code-review` evidence -> named requirements/architecture/tickets consumer | report only | yes |
| `requirements-engineering` | Requirements change software behavior | `requirements-artifact` -> architecture/testing/tickets | requirements approval only | yes |
| `to-spec` | Spec describes software change | `requirements-artifact` -> `to-tickets` | issue publication approval | no |
| `to-tickets` | Tickets change software | `ticket-artifact` -> `implement`/approved fleet | ticket publication approval | no |
| `spec-driven-development` | SDD governs software work | requirements -> architecture -> tickets -> implement/verify | artifact approval | no |
| `analyze-artifacts` | Consistency gates a software work item | analysis report -> named owner/repair consumer | analysis only | yes |
| `docs-management` | Docs encode software decisions or gates | docs/ADR guidance -> owner/review | documentation guidance | yes |
| `software-maintenance-evolution` | Maintenance changes software or release | maintenance artifact -> requirements/architecture/release | proposal and approval | yes |
| `prod-prd-writing` | PRD implies software delivery | requirements artifact -> requirements/spec | product approval | no |
| `prod-okr-planning` | OKR initiatives govern software | OKR -> project management/release/observability | planning only | yes |
| `prod-ab-testing` | Experiment exposes software behavior | experiment -> testing/observability/release | exposure approval | yes |
| `brainstorming` | Selected idea enters engineering | discovery -> requirements, architecture, or experiment | discovery only | yes |

## Handoff Envelope

Every cross-skill handoff carries `schemaVersion`, `artifactType`, `artifactId`, `operationId`, `traceId`, `sourceArtifacts`, `sourceDigests`, `fixedPoint`, `producer`, `nextConsumer`, `status`, `owner`, `approvals`, `evidence`, `blockers`, and `risks`. A legacy `spec` or `ticket` projection may remain readable, but canonical producers emit `requirements-artifact` and `ticket-artifact`.

## Bypasses

`CLEAR_SPEC`, documentation/research-only work, and project-board-only work remain valid semantic bypasses. They skip only inapplicable engineering stages; they do not bypass a required preflight once software change is confirmed.

## Fixture Coverage

`tests/project-product-routing-contracts.test.mjs` covers every listed skill with a positive metadata contract, adjacent negative conditions for board-only/read-only/missing digest, and ambiguous discovery handoff behavior. Existing migration fixtures continue to validate output envelopes.
