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

- All 12 skills now score 85+ (grade B minimum, 10 at grade A)
- check-all.mjs passes 10/10 with 0 warnings, 0 errors
- Lockfile updated to reflect new hashes
- skills-lock.json synchronized with SKILL.md content

## Alternatives Considered

- Leave skills at current grades: rejected — degrades overall bundle quality score
- Mass migration script: rejected — low signal, no Why sections or references
