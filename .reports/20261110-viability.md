# Project Viability Assessment

**Repository:** /home/quantumquirkxyz/skills-quirk
**Date:** 2026-11-10
**Assessed against:** CONTEXT.md, docs/adr/

## Pre-flight Summary

- CONTEXT.md: present — impact: none
- docs/adr/: present with 5 ADRs (ADR-004 superseded) — impact: none
- Assessment confidence: High — gate evidence, CI config, and prior assessments available

## Executive Summary

| Dimension | Categorical rating | Numeric score (1–5) | One-line reason | Confidence |
|-----------|--------------------|---------------------|-----------------|------------|
| Viability | Conditional | 3 | Goals align with structure, but platform LOC is at 94.7% of its ceiling and the npm-channel removal is uncommitted/unvalidated in CI | High |
| Functionality | Complete | 5 | Post-removal docs, manifests, and workflows are mutually consistent; gate 22/22 PASS, ~520 tests green | High |
| Scalability | Bounded | 3 | Platform tooling near LOC ceiling and sparse skill graph (255 nodes / 97 edges) constrain growth | High |

Overall posture: Conditional — the bundle is functional and internally consistent after the prompt-only installation decision, but architectural investment (platform split, graph connectivity) and CI evidence for the current change set are required before unconstrained growth.

## Delta from Previous Assessment

- Previous report: `.reports/20261024-viability.json`
- Previous date: 2026-10-24
- Changes since last assessment: npm installation/publication channel removed (2026-11-10); workflows `external-readiness` and `skills-cli-interop` deleted; `package:verify` tarball gate deleted; registry `npmPackage`/`npxCommand` removed; docs (README, how-to, wiki) moved to prompt-only installation; Epic #6 deleted; CLI help and `issue-meta` docs corrected to `node bin/skills-quirk.js`.
- Score deltas: viability: 3 → 3; functionality: 4 → 5; scalability: 3 → 3

## Viability

Rated **Conditional (3)**. CONTEXT.md goals (portable canonical bundle installed by prompt, validated by a shift-left gate) match the actual module boundaries: `.agents/skills/` canonical tree, `.claude/skills/` compatibility view, `scripts/` projections, CI gates. Two conditions prevent a Viable rating: the platform tooling is at 94.7% of its declared LOC ceiling, and the current change set is uncommitted with no CI evidence yet.

### Findings

- Platform module near LOC ceiling: 37,875 LOC = 94.7% of `maxLoc` 40,000, over the declared 90% review trigger. Confidence: High. Risk: Medium.
- ADR-005 grade elevation covers a slice (21/266 skills with `scripts/`, 38/266 with `references/`), not the bundle. Confidence: High. Risk: Medium.
- npm channel removal is an active uncommitted change set (package.json, 3 modified + 2 deleted workflows) with no CI run yet — code-review evidence-gap. Confidence: High. Risk: High.
- Compatibility-view drift risk (`.claude/skills/` symlinks): partially mitigated — `check-all.mjs` enforces symlink parity in the 22/22 gate. Confidence: Medium. Risk: Low.

### Recommendations

| Recommendation | Impact | Effort | Priority | Risk |
|----------------|--------|--------|----------|------|
| Push the change set and confirm the 11 remaining workflows (validate, release, distribution-matrix) pass on it | High | Low | P0 | Low |
| Split platform validators from runtime before raising the 40k ceiling | High | High | P1 | High |
| Reconcile ADR-005 claims with a tracked bundle-wide quality plan | Medium | Low | P1 | Medium |

## Functionality

Rated **Complete (5)**. The documented installation/distribution story now matches the repository end to end after the 2026-11-10 removal: README, `docs/how-to/installation*.md`, `release.md`, wiki, `package.json`, `release.yml`, and the registry manifests all agree on prompt-only installation. The local gate passes 22/22 with zero warnings/errors and ~520 tests green (one MCP stdio timeout flake passes on rerun).

### Findings

- Prompt-only installation is consistently documented across README.md:340-341, docs/how-to/installation-options.md:3-9, docs/how-to/release.md:45, and enforced by absence of `bin`/`files`/`publishConfig` in package.json. Confidence: High. Risk: Low.
- CHANGELOG.md:29-30 records the removal explicitly; implementation-status and strategic plan were reconciled the same day. Confidence: High. Risk: Low.
- skills-lock.json provenance shape (`local`/`working-tree`) holds for all entries; version consistency is enforced by tests/version-consistency.test.mjs. Confidence: High. Risk: Low.
- No CI evidence yet for this change set; functionality claims rest on the local gate only. Confidence: High. Risk: Medium.

### Recommendations

| Recommendation | Impact | Effort | Priority | Risk |
|----------------|--------|--------|----------|------|
| Run the CI suite on the change set and attach run links to implementation-status | High | Low | P0 | Low |
| Keep the current gate as a release requirement; add consumer-level smoke fixtures for the prompt flow | Medium | Medium | P2 | Low |

## Scalability

Rated **Bounded (3)**. Typed artifacts (ADR-001), replayable state machines (ADR-002), and explicit body budgets give real extension seams, but two structural limits remain: platform tooling approaching its LOC ceiling, and a sparse skill graph where empty capability sets produce no edges (255 nodes / 97 edges).

### Findings

- Platform LOC 37,875/40,000 (94.7%); policy says split validators from runtime instead of raising `maxLoc`. Confidence: High. Risk: Medium.
- Skill graph sparsity (255 nodes, 97 edges; `skill-graph.mjs:30` empty capability sets produce no edges) limits graph-based routing value. Confidence: High. Risk: Medium.
- ADR coverage is 5 records (one superseded); architectural decisions beyond those are undocumented. Confidence: Medium. Risk: Low.
- Body-budget enforcement (500 lines / ~5,000 tokens per SKILL.md) keeps per-skill growth bounded — positive. Confidence: High. Risk: Low.

### Recommendations

| Recommendation | Impact | Effort | Priority | Risk |
|----------------|--------|--------|----------|------|
| Backfill meaningful capabilities/dependencies and measure graph connectivity as a release signal | High | Medium | P1 | High |
| Split platform tooling into validators/ and runtime/ modules | High | High | P1 | High |
| Record new architectural decisions as ADRs as the bundle grows | Medium | Low | P2 | Low |

## Validation Notes

- Quality gate passed: Yes — all findings cite CONTEXT.md, an ADR, a code location, or a baseline signal; ratings internally consistent; no unresolved cross-dimension conflict (the viability "compat view drift" risk is mitigated by the gate's symlink-parity check, noted rather than dropped).
- All findings cited: Yes — 0 uncited findings.
- Conflict resolution applied: Yes — viability's Conditional governs overall posture; functionality's Complete does not override it (most restrictive dimension wins).
- Pre-flight gaps addressed: N/A — no gaps.
- Numeric score consistency: Yes — Conditional↔3, Complete↔5, Bounded↔3.
- Automated baseline signals: loc≈127k (48.1k JS/MJS + 79.1k MD; platform 37,875); module_count≈16 top-level dirs / 36 categories; dependency_health=Healthy (0 root deps, site locked); ci_present=true (11 workflows); test_loc_ratio=0.10; coverage_pct=N/A; cross_import_count≈4 deep cross-dir imports; god_module_candidates=[.agents/skills/platform @94.7% ceiling]; config_drift=Minor (active change set); iac_without_adr=[].
- Code-review evidence incorporated: 6 findings (2 medium confirmed defects — fixed during this session; 1 low CHANGELOG staleness — fixed; 1 low CI evidence gap — open; 2 info).

## Next Steps

Ask the user to choose one path:

- Address the top findings via `/implement` or `/codebase-design`.
- Sharpen the project model via `/grill-with-docs` or `/domain-modeling`.
- Revisit ADRs via `/docs-management`.
- Abandon or pause the assessment.
