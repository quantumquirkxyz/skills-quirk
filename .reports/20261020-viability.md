# Project Viability Assessment

**Repository:** skills-quirk (`/home/quantumquirkxyz/skills-quirk`)
**Date:** 2026-10-20
**Assessed against:** CONTEXT.md, docs/adr/, automated baseline

## Pre-flight Summary

- CONTEXT.md: present (56 lines, vocabulary + maintenance rule) — no gap.
- docs/adr/: present with 5 ADRs — no gap, but ADR-004 status is stale (see Viability).
- references/: evaluation-criteria, report-template, subagent-prompts, health-baseline, edge-cases, integration-points all present.
- Assessment confidence: **High** for structure and governance (all signals machine-verified); **Medium** for domain intent (267 skills, only 5 ADRs).

## Executive Summary

| Dimension | Categorical rating | Numeric score (1–5) | One-line reason | Confidence |
|-----------|--------------------|---------------------|-----------------|------------|
| Viability | Conditional | 3 | Every gate is green, but ADR-004 describes a v2.0 release that was superseded by 3.0.0, and one platform module is orphaned. | High |
| Functionality | Partial | 2 | ADR-001 claims every skill emits a typed artifact; 216/266 skills declare no outputs at all. | High |
| Scalability | Bounded | 2 | 227/266 skills have an empty `capabilities` list, so capability-based routing and composition have almost no edges to work with. | High |

Overall posture: the bundle is structurally sound and self-validating, but its declared v2 contract is realized in a minority of skills; viability is conditional on either completing that contract or formally retiring it.

## Delta from Previous Assessment

- Previous report: N/A for viability. `artifacts/audit/skills-quirk-improvement-report.md` (2026-10-20) is a bounded P0 slice over two scripts, not a comparable assessment.
- Score deltas: N/A (first viability assessment).

## Viability

The project's stated goal — a portable, validated skills bundle — is achievable with the current boundaries: 266 canonical skills, a generated compatibility view, and 22/22 platform checks green. The blockers are governance, not architecture: an unreconciled release ADR, a duplicated ADR tree, and a consequence claim in ADR-005 that the current code no longer reproduces.

### Findings

- **ADR-004 is stale against the shipped version.** It records "Release v2.0" with status *Proposed*, while `VERSION`, `package.json:3` and `registry.yaml` all read 3.0.0. Citation: `docs/adr/ADR-004-release-v2.0.md:3,7`. Confidence: High. Risk: High.
- **Two ADR trees exist.** `docs/reference/adr/ADR-001..004` are byte-identical copies of `docs/adr/ADR-001..004`, and the tree omits `005-skills-grade-elevation.md`. Two sources of truth for the same decisions. Citation: `docs/reference/adr/` vs `docs/adr/005-skills-grade-elevation.md`. Confidence: High. Risk: Medium.
- **ADR-005's consequence claim does not reproduce.** It states "All 12 skills now score 85+ (grade B minimum, 10 at grade A)"; sampled core skills score 61–96, with `grilling` 61, `skill-audit` 62, `project-viability` 67, `improve-codebase-architecture` 69. Citation: `docs/adr/005-skills-grade-elevation.md:22-27`; `quality-scorer.mjs <skill>` output. Confidence: High. Risk: Medium.
- **Orphaned module.** `.agents/skills/platform/a2a-router.mjs` (A2A runtime, 100+ lines) has zero references in `package.json`, `check-all.mjs`, tests, workflows, or docs. Citation: `.agents/skills/platform/a2a-router.mjs:1-12`. Confidence: High. Risk: Medium (abandoned seam, not a broken path).
- **The frontmatter contract is mostly empty.** 227/266 `SKILL.md` declare `capabilities: ""`, 216 declare `outputs: ""`, 166 declare `fixturesPath: ""`, 12 declare `sideEffects: ""`. Citation: repo-wide frontmatter scan; `skill-creator` scores 2/10 on `artifactSchema`. Confidence: High. Risk: Medium.

### Recommendations

| Recommendation | Impact | Effort | Priority | Risk |
|----------------|--------|--------|----------|------|
| Resolve ADR-004 (mark superseded by 3.0.0, or restore the v2.0 decision record) | High | Low | P0 | Medium |
| Delete `docs/reference/adr/` or regenerate it from `docs/adr/` including ADR-005 | Medium | Low | P1 | Low |
| Re-verify or soften ADR-005's grade claim against current scorer output | Medium | Low | P1 | Low |
| Decide the fate of `a2a-router.mjs`: wire it into `package.json` + docs, or delete it | Medium | Low | P1 | Low |

## Functionality

The repo does what its own gates say it does — 472 tests pass, 22/22 checks pass, symlink view has 0 dangling links. What it does not do is what ADR-001 says every skill does: emit a typed artifact. The gap is systematic, not accidental: the scorer rewards `outputs`/`artifactType`, and most skills leave those fields empty while still passing validation.

### Findings

- **ADR-001 is contradicted at scale.** "Every skill emits a typed JSON artifact" vs 216/266 skills with `outputs: ""`. Validation passes because the schema tolerates empty strings. Citation: `docs/adr/ADR-001-artifact-first-design.md:7-9`; `schema/` + `manifest.schema.json:14`. Confidence: High. Risk: Medium.
- **ADR-005's elevation was a 12-skill slice, not a bundle-wide change.** Only 21/266 skills have `scripts/`, 38/266 have `references/`, 25/266 have a `## Why` section, and 10/266 mention `record-execution.mjs`. Citation: repo-wide directory scan. Confidence: High. Risk: Medium.
- **Sample scores span two grades.** `review-pr` 96, `to-spec` 93, `ask-to` 92, `to-tickets` 92, `improve-codebase-architecture` 69, `project-viability` 67, `skill-audit` 62, `grilling` 61. Citation: `quality-scorer.mjs`. Confidence: High. Risk: Medium.
- **Lockfile never leaves `working-tree`.** All 266 `skills-lock.json` entries record `revision: "working-tree"`, so the hash pins content but not provenance, while ADR-005 claims the lockfile was synchronized. Citation: `skills-lock.json` (266/266 entries). Confidence: High. Risk: Low.
- **Test coverage is structural, not behavioral.** 472 passing tests across 44 files assert projections, versions, symlinks, and script contracts; no test executes a skill's workflow end-to-end. Citation: `tests/*.test.mjs`, `.agents/skills/platform/tests/` (42 files). Confidence: Medium. Risk: Medium.

### Recommendations

| Recommendation | Impact | Effort | Priority | Risk |
|----------------|--------|--------|----------|------|
| Either populate `outputs`/`capabilities` for skills that claim artifacts, or amend ADR-001 to scope artifact-first to the core set | High | Medium | P0 | Medium |
| Add a validation rule that rejects empty `outputs` on skills declaring an `artifactType` | High | Low | P1 | Low |
| Set a real `revision`/`sourceType` for released lockfile entries | Medium | Low | P2 | Low |
| Add one end-to-end fixture that executes a skill's steps, not just its text | Medium | Medium | P2 | Medium |

## Scalability

Adding a skill is mechanically cheap (one folder, one lockfile hash, one regeneration), and locality of change is good. What does not scale is the semantic layer: 45 categories and 266 skills share 5 ADRs and mostly-empty capability lists, so the graph that should connect them is sparse by construction.

### Findings

- **Empty capabilities produce an empty graph.** `skill-graph.mjs:30` documents "Empty capability sets produce no edges"; with 227/266 skills empty, capability routing covers roughly 39 skills. Citation: `.agents/skills/platform/skill-graph.mjs:29-30,276`. Confidence: High. Risk: High.
- **Platform tooling is the real mass.** 36,038 of 41,233 `.mjs` LOC sit under `.agents/skills/platform/` (87%), with 61 parent-directory imports and 42 test files in one directory. Citation: LOC scan. Confidence: High. Risk: Medium.
- **Onboarding needs a regeneration step the contributor cannot skip.** A new or edited skill requires `skills-lock.json` plus `scripts/sync-registry.mjs --write` projections; `tests/projection-consistency.test.mjs` and `version-consistency.test.mjs` fail otherwise. Citation: `AGENTS.md` commands; `tests/`. Confidence: High. Risk: Low.
- **Domain coverage is thin relative to category growth.** 45 categories (including recent `graphic-design`, `physics`, `math`, `web3`) are governed by 5 ADRs, none of which covers category boundaries. Citation: `registry.yaml` categories vs `docs/adr/` (5 files). Confidence: Medium. Risk: Medium.

### Recommendations

| Recommendation | Impact | Effort | Priority | Risk |
|----------------|--------|--------|----------|------|
| Backfill `capabilities` for the skills that participate in routing (start with the 12 core + delivery/routing) | High | Medium | P1 | Medium |
| Add an ADR for category boundaries and the routing graph | Medium | Low | P2 | Low |
| Track a ceiling on `platform/` growth (e.g., split validators from runtime) before it exceeds 50k LOC | Medium | Medium | P2 | Medium |

## Validation Notes

- Quality gate passed: **Yes.** Uncited findings: 0. Two sub-agent claims were rejected as not reproducible and replaced with measured values: "no skills have `scripts/`" (actual: 21) and "no skills score ≥85" (actual: 96/93/92/92 sampled).
- All findings cited: **Yes** (path + line where applicable, or a described machine scan).
- Conflict resolution applied: **Yes.** Viability rated Conditional while Functionality rated Partial — no conflict: goals are reachable, delivery of the declared contract is incomplete. Ratings left separate, not reranked.
- Pre-flight gaps addressed: **Yes.** No missing inputs; ADR-004 staleness recorded as a finding rather than a gap.
- Numeric score consistency: **Yes.** Conditional=3, Partial=2, Bounded=2, each backed by ≥2 material findings.
- Automated baseline: `check-all.mjs` 22/22 pass (254 skills, 0 warnings, 0 errors); `npm test` 472 pass / 0 fail (73.7s); 5 CI workflows; 266 symlinks, 0 dangling; git tree clean; 0 third-party runtime deps.

## Next Steps

Choose one path:

- Address the top findings via `/implement` (P0: ADR-004 reconciliation; P1: duplicate ADR tree, ADR-005 claim, `a2a-router.mjs`, empty-`outputs` validation rule).
- Sharpen the project model via `/grill-with-docs` or `/domain-modeling` (category boundaries, capability vocabulary).
- Revisit ADRs via `/docs-management`.
## Remediation Applied (post-assessment, same day)

**P0/P1 slice** — implemented after the assessment:

- ADR-004 marked **Superseded** by v3.0.0.
- `docs/reference/adr/` reduced to the installer template README; the four duplicate records were removed and every pointer repointed to `docs/adr/`.
- ADR-005 consequences corrected: re-measured scores (61–96), slice-scoped elevation, documented lockfile convention.
- `a2a-router.mjs` deleted (orphan, zero references).
- `validate-skills.mjs` now reports `artifactOutputDebt` (216 skills, sampled examples) and promotes it to errors under `--strict`, preserving the documented `totalWarnings: 0` invariant.

**P2 items** — resolved:

- **Lockfile provenance:** `revision: "working-tree"` turns out to be the correct convention for authored skills (there is no upstream revision; the hash is the pin), so instead of fabricating commit SHAs the shape is now documented in `docs/how-to/release.md#lockfile-provenance` and enforced by `validate-skills.mjs` plus a test.
- **End-to-end execution:** the task runner already executed one shipped task; the suite now runs *every* shipped task (3) end to end in a sandbox and asserts pass, cleanup, and zero forbidden-path violations.
- **Growth ceiling:** `policy/platform-growth-budget.json` records a 40,000 LOC ceiling (measured 36,146) with a split-validators-from-runtime remediation, enforced by a test.

**Follow-up completed:** all 223 skills that declared an `artifactType` without a
non-empty `outputs` contract were backfilled (156 from their explicit Contract
output and 67 with a bounded artifact fallback). `validate-skills.mjs --strict`
now reports `artifactOutputDebt.count: 0`. The growth budget no longer has a
calendar expiry; it is reviewed on explicit threshold, release-boundary, and
measurement/remediation-change triggers.

Validation after remediation: `npm test` 479 pass / 0 fail; `check-all.mjs` 22/22, 0 warnings, 0 errors.
