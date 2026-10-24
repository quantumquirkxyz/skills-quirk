# Project Viability Assessment

**Repository:** `/home/quantumquirkxyz/skills-quirk`
**Date:** 2026-10-24
**Assessed against:** `CONTEXT.md`, `docs/adr/`

## Pre-flight Summary

- `CONTEXT.md`: present and non-empty.
- `docs/adr/`: present with 5 ADRs.
- Assessment confidence: **High**; the repository has current context, ADRs, CI, and a passing automated suite.

## Executive Summary

| Dimension | Categorical rating | Numeric score | One-line reason | Confidence |
|---|---:|---:|---|---|
| Viability | Conditional | 3 | Goals are achievable, but bundle-wide quality and platform-growth constraints remain. | High |
| Functionality | Complete | 4 | 523 tests pass and the repository gates validate projections, artifacts, workflows, and fixtures. | High |
| Scalability | Bounded | 3 | The capability graph is sparse and platform tooling has exceeded its declared 40,000-LOC ceiling. | High |

**Overall posture:** Conditional: the project is functional and viable for continued maintenance, but architectural investment is required before unconstrained growth.

## Delta from Previous Assessment

- Previous report: `.reports/20261020-viability.json`
- Changes since last assessment: ADR-004 is now explicitly superseded by v3.0.0; artifact-output debt and lockfile provenance checks are covered by current gates; the full test corpus now reports 523 passing tests. The platform measurement is now 40,686 LOC, above the 40,000-LOC budget.
- Score deltas: viability `3 → 3`; functionality `2 → 4`; scalability `2 → 3`.

## Viability

The project shape matches `CONTEXT.md`: it is a canonical Skills bundle with platform tooling, compatibility projections, and validation infrastructure. ADR-004’s former release contradiction is resolved, but ADR-005 itself documents that elevation covered only a slice of the bundle, leaving a material maintainability constraint. The declared platform growth budget is exceeded, so viability is conditional on either splitting the platform or revising the measured architecture through an explicit decision.

### Findings

- The repository has coherent bundle boundaries, a CLI entry point, canonical skills, projections, schemas, and CI workflows (`CONTEXT.md:3-10`, `bin/skills-quirk.js:40-56`, `.github/workflows/validate.yml`). **Confidence: High. Risk: Low.**
- ADR-005 records that elevation covered a slice rather than the whole bundle and that several quality dimensions remain sparse (`docs/adr/005-skills-grade-elevation.md:27-35`). **Confidence: High. Risk: Medium.**
- Platform tooling is measured at 40,686 LOC against the declared 40,000-LOC ceiling (`policy/platform-growth-budget.json:3-10`; `health-baseline: platform LOC=40,686`). **Confidence: High. Risk: High.**

### Recommendations

| Recommendation | Impact | Effort | Priority | Risk |
|---|---|---|---|---|
| Split platform validators from runtime before increasing the growth ceiling. | High | High | P1 | High |
| Reconcile ADR-005’s slice-scoped quality claims with a tracked bundle-wide plan. | Medium | Low | P1 | Medium |

## Functionality

The implementation currently satisfies the repository’s executable quality contract. The full test corpus passes, including workflow state transitions, artifact schemas, behavioral fixtures, security scans, projections, and end-to-end task execution. Confidence is high because the evidence is automated, although this is validation of the bundle’s contracts rather than proof of every external consumer scenario.

### Findings

- `node --test .agents/skills/platform/tests/*.test.mjs tests/*.test.mjs` passes **523 tests, 0 failures** (`health-baseline: test-suite=523/523`). **Confidence: High. Risk: Low.**
- The gate exercises artifact output debt, workflow guards/checkpoints, projections, fixtures, security samples, and shipped tasks (`.agents/skills/platform/check-all.mjs:108-120`; `.agents/skills/platform/tests/`). **Confidence: High. Risk: Low.**
- Version and projection consistency are enforced and pass for the 3.0.0 release (`tests/version-consistency.test.mjs:1-20`; `tests/projection-consistency.test.mjs:1-20`). **Confidence: High. Risk: Low.**

### Recommendations

| Recommendation | Impact | Effort | Priority | Risk |
|---|---|---|---|---|
| Preserve the current gate as a release requirement and add consumer-level smoke fixtures where integrations matter. | Medium | Medium | P2 | Low |

## Scalability

The architecture has useful seams: canonical skill content is projected into multiple consumer views, and workflow state is externalized and replayable (`docs/adr/ADR-001-artifact-first-design.md:9-18`; `docs/adr/ADR-002-state-machine-workflows.md:9-18`). Growth is nevertheless bounded by sparse capability relationships and the over-budget platform directory. The current graph build reports 255 nodes and 97 edges (`health-baseline: skill-graph=255 nodes/97 edges`), limiting reuse and cross-skill routing signal.

### Findings

- The skill graph contains 255 nodes but only 97 edges, while empty capabilities do not contribute graph edges (`.agents/skills/platform/skill-graph.mjs:29-30`; `health-baseline: skill-graph=255/97`). **Confidence: High. Risk: High.**
- Platform tooling has crossed its 40,000-LOC growth ceiling; the policy explicitly calls for splitting validators and runtime before raising it (`policy/platform-growth-budget.json:5-10`). **Confidence: High. Risk: High.**
- Externalized artifacts and replayable state machines provide clear extension seams for downstream consumers (`docs/adr/ADR-001-artifact-first-design.md:9-18`; `docs/adr/ADR-002-state-machine-workflows.md:9-18`). **Confidence: High. Risk: Low.**

### Recommendations

| Recommendation | Impact | Effort | Priority | Risk |
|---|---|---|---|---|
| Backfill meaningful capabilities/dependencies for routing participants and measure graph connectivity as a release signal. | High | Medium | P1 | High |
| Split platform tooling into validator and runtime modules. | High | High | P1 | High |

## Validation Notes

- Quality gate passed: **Yes**; the independent test run passed 523/523. `check-all.mjs` exceeded the 120-second execution window in this session, so its aggregate result was not independently captured.
- All findings cited: **Yes**; 0 uncited findings.
- Conflict resolution applied: **Yes**; the most restrictive dimension governs the overall Conditional posture; Viability and Functionality were not merged or reranked.
- Pre-flight gaps addressed: **Yes**; no required pre-flight files were missing.
- Numeric score consistency: **Yes**; Conditional/Complete/Bounded map to 3/4/3.
- Automated baseline signals: 267 `SKILL.md` files; 40,686 platform JS LOC; 255 graph nodes/97 edges; 6 CI workflows; 523 tests passing; root dependency audit could not run because no root lockfile exists, while runtime dependencies are built-in Node modules.

## Next Steps

Based on the assessment:

- Viability: **Conditional** (score: 3)
- Functionality: **Complete** (score: 4)
- Scalability: **Bounded** (score: 3)

Recommended next step: **`/codebase-design`** — split the over-budget platform and strengthen capability-graph seams before broad growth.

Choose:

1. Address the top findings via `/implement` or `/codebase-design`.
2. Sharpen the project model via `/grill-with-docs` or `/domain-modeling`.
3. Revisit ADRs via `/docs-management`.
4. Abandon or pause the assessment.
