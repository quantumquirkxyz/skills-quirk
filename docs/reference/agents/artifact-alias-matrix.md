# Artifact Alias Matrix

Canonical routing IDs are stable; colloquial names are input aliases only.

| Alias | Canonical skill ID | Canonical artifactType | Legacy artifactType aliases |
|---|---|---|---|
| maintenance | `project/software-maintenance-evolution` | `MaintenanceArtifact` | `maintenance-artifact` |
| SDD, spec-driven | `project/spec-driven-development` | `SpecDrivenArtifact` | `spec-driven-artifacts` |
| PRD | `product/prod-prd-writing` | `ProductRequirementsArtifact` | `prd` |
| OKR | `product/prod-okr-planning` | `OkrArtifact` | `okr` |
| AB, A/B | `product/prod-ab-testing` | `ExperimentArtifact` | `ExperimentArtifact` |
| project management | `professional/professional-project-management` | `ProjectPlanArtifact` | `project-plan-artifact` |
| project assessment | `project/project-development` | `ProjectAssessmentArtifact` | `project-assessment` |
| viability | `project/project-viability` | `ViabilityArtifact` | `viability-artifact` |
| documentation guidance | `project/docs-management` | `DocumentationGuidanceArtifact` | `documentation-guidance-artifact` |
| artifact analysis | `project/analyze-artifacts` | `ArtifactAnalysisReport` | `artifact-analysis-report` |
| brainstorming | `product/brainstorming` | `BrainstormingArtifact` | `brainstorming` |
| make project | `project/make-project` | `MakeProjectArtifact` | `project` |

`ArchitectureArtifact` is a distinct output of `engineering/architecture-evaluation`; `ProjectAssessmentArtifact` is the classification output of `project/project-development`. The valid union is `project-assessment-or-architecture.schema.json`; consumers must discriminate on `artifactType` and never infer one from the other.

Adapters may read legacy aliases and normalize them to the canonical value before schema validation. New producers MUST emit canonical values.

## Audited Skill Coverage

Every audited skill has a unique colloquial alias for input routing; aliases never become artifact IDs.

| Alias | Canonical skill ID |
|---|---|
| loop engineering | `loop/loop-engineering` |
| retry policy | `loop/retry-backoff` |
| docs management | `project/docs-management` |
| make project | `project/make-project` |
| project development | `project/project-development` |
| project viability | `project/project-viability` |
| requirements engineering | `project/requirements-engineering` |
| spec driven development | `project/spec-driven-development` |
| to spec | `project/to-spec` |
| to tickets | `project/to-tickets` |
| analyze artifacts | `project/analyze-artifacts` |
| performance testing | `qa/performance-testing` |
| QA automation | `qa/qa-automation` |
| manual QA | `qa/qa-manual-testing` |
| security testing | `qa/qa-security-testing` |
