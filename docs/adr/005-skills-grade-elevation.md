# ADR-005: Skills Grade Elevation

## Status

Accepted

## Context

After the v2.0.0 modernization, 12 core skills remained at grade B/C/D. The quality-scorer.mjs v2 exposes 13 dimensions:
frontmatterCompleteness, bodyDepth, sections, assets, behavioralSpec, safety, promptVersioning, modelTierAlignment,
artifactSchema, progressiveDisclosure, observability, regressionCoverage, diataxisCompleteness.

Common gaps: missing references/, scripts/, Why sections, observability paragraphs, and regression fixtures.

## Decision

Elevate the 12 core skills to grade A/B by adding:
- references/ with domain-specific reference files
- scripts/ with validation/template scripts
- Why sections explaining rationale
- Observability paragraphs referencing record-execution.mjs
- Regression fixtures in platform/fixtures/regression/
- Diátaxis sections (Process, Reference, Why)

## Consequences

- The elevation covered a slice, not the bundle: 21/266 skills have `scripts/`,
  38/266 have `references/`, 25/266 have a `## Why` section, and 10/266 reference
  `record-execution.mjs`.
- The original "all 12 skills now score 85+" claim does not reproduce bundle-wide.
  Re-measured 2026-10-20 with `quality-scorer.mjs`: `review-pr` 96, `to-spec` 93,
  `ask-to` 92, `to-tickets` 92 (grade A) versus
  `improve-codebase-architecture` 69, `project-viability` 67, `skill-audit` 62,
  `grilling` 61 (grade D).
- `check-all.mjs` passed 10/10 with 0 warnings and 0 errors at the time; the gate
  now runs 22 checks and reports 22/22 with 0 warnings and 0 errors.
- Lockfile hashes were refreshed. Every entry records `sourceType: "local"` and
  `revision: "working-tree"`, the documented convention for authored skills — the
  hash is the pin (see `docs/how-to/release.md#lockfile-provenance`). The shape is
  now enforced by `validate-skills.mjs`.

## Alternatives Considered

- Leave skills at current grades: rejected — degrades overall bundle quality score
- Mass migration script: rejected — low signal, no Why sections or references
