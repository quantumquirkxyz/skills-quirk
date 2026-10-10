# Changelog

All notable changes to `quirk Skills` are recorded here.

This project follows semantic versioning once releases are cut:

- `MAJOR` for breaking workflow or artifact contract changes.
- `MINOR` for new skills, new validators, new scenarios, or compatible workflow extensions.
- `PATCH` for documentation fixes, template clarifications, and non-breaking validator fixes.

## [2.1.0] - 2026-10-10

Wave-0 modernization debt cleanup, integrated on `main`.

### Added

- `tests/version-consistency.test.mjs` — pins `VERSION`, `package.json`, `registry.yaml` (`version` + `bundleVersion`), and the README badge to one semver value
- Root `AGENTS.md` — repository-level operating rules for coding agents, complementing `.agents/AGENTS.md` (bundle scope)
- `wayfinder` completion flow — "Work through the map" section covering ticket claiming, resolution by type, decision recording, fog graduation, and hand-off to `to-spec`
- `skill-evolver` `--verified-evidence <type>:<note>` flag — records human sign-off that upgrades an evidence check from `pending-verification` to `passed` with an audit trail

### Changed

- **Version unification**: `package.json` and `registry.yaml` aligned from `1.0.0` to `2.0.0`, matching `VERSION` and the README badge
- **Manifest schema fix**: `manifest.schema.json` rewritten to the bundle's real frontmatter contract — `name`/`description`/`category` required, quoted scalars, empty strings, inline and block sequences, numeric-or-string versions and trust tiers accepted
- **marketplace / sync-registry fixes**: `scripts/sync-registry.mjs` now parses the registry's actual YAML subset (quoted scalars, inline arrays, block sequences, JSON passthrough), derives each skill's `category` from its real domain folder instead of frontmatter, and reports category mismatches
- **Telemetry fixes**: `record-execution.mjs` / `otel-skill-instrumentation.mjs` now emit real span durations (`startSpan`/`endSpan` with wall-clock timing, idempotent end), estimate token size from artifact content, and give `artifactScore` explicit null semantics
- `skills-lock.json` re-hashed for all 236 modified skills (254 entries total); `CATALOG.md`, `llms.txt`, and `.claude-plugin/marketplace.json` regenerated from the corrected categories
- `approvalRequired` / `model-rules.yaml` parity repaired across the bundle
- Stale documentation paths repaired in `docs/how-to/installation.md`, `docs/reference/agents/skill-inventory.md`, and the `docs/reference/wiki/` pages

### Fixed

- `fixturesPath` resolution: 221 skills that declared nonexistent central fixture paths now carry null semantics (`fixturesPath: ""`), and `validate-skills.mjs` gained a check that any declared `fixturesPath` must resolve to an existing file
- `skill-evolver` version-bump regex handled only unquoted `version: N` and never matched the bundle's quoted `version: "1"`, so real evolutions wrote byte-identical files while reporting success — the regex now preserves the original quoting style
- `quality-scorer.mjs` CLI accepted only `--minimum-score=N`; the space-separated `--minimum-score N` form silently treated the score as the skill path and crashed — both spellings now work, and a missing skill path exits cleanly
- Category cleanup: 65 skills outside `ai/` still declared `category: "skill-dev/sandbox"`; each now declares its real domain folder (`sec`, `quant`, `physics`, `math`, `finance`, `cs`, `data`, `devops`, `db`, `research`, `docs`, `professional`)
- Stray committed build artifact `.agents/skills/project/dist/project-viability.zip` removed from the index and working tree; `*.zip`, `__pycache__/`, and `*.pyc` added to `.gitignore`
- Six platform skills missing from the `.claude/skills/` compatibility view gained symlinks: `feature-flag`, `gate-ci`, `gate-ide`, `gate-post-merge`, `gate-pre-commit`, `trunk-based-workflow`
- `tests/projection-consistency.test.mjs` invariant 1 aligned with the warning contract: validator warnings are advisory (they block promotion via `skill-promoter`, never the general gate), so the test now fails only on unexpected warning categories instead of any advisory backlog

### Validation

```bash
node .agents/skills/platform/check-all.mjs            # 10/10 pass, 68 warnings, 0 errors
node .agents/skills/platform/validate-skills.mjs      # 242 skills, 0 errors, 68 advisory warnings
node .agents/skills/platform/audit-semantics.mjs      # 254 skills, 0 warnings, 0 errors
node .agents/skills/platform/quality-scorer.mjs --minimum-score 60   # 82/100 (skill-creator)
node .agents/skills/platform/security-scanner.mjs     # pass, 0 findings
node --test tests/*.test.mjs                          # 6/6 pass
node --test .agents/skills/platform/tests/*.test.mjs  # 20/20 pass
node .agents/skills/platform/dependency-graph.mjs     # 242 skills, 0 cycles
```

Open advisory backlog (blocks promotion, never the general gate): 68 medium/high-risk skills lack a `behavioral-fixtures` directory — owner suggestion: `skill-dev/` domain owners authoring behavioral fixtures per ADR-005.

## [2.0.0] - 2026-10-03

### Added

- Artifact-first design: 7 JSON schemas for typed artifacts (spec, ticket, review, adr, handoff, agent-card, trunk-based-workflow, feature-flag)
- Externalized `contract-base.xml` shared contract — eliminates ~19K tokens of duplicated boilerplate
- 4 workflow state machines (standard-feature, bug-fix, operations, repair) in YAML
- `workflow-state-machine.mjs` — executable state machine with persistent checkpoints
- 3 LLM-as-judge evaluators: `evaluate-artifact-quality.mjs`, `evaluate-spec-traceability.mjs`, `evaluate-review-effectiveness.mjs`
- 4 shift-left quality gate skills: `gate-ide`, `gate-pre-commit`, `gate-ci`, `gate-post-merge`
- `trunk-based-workflow` skill — short-lived branches, PR size limits, merge discipline
- `feature-flag` skill — short-lived flags, gradual rollouts, kill switches, cleanup discipline
- `mcp-server` skill + functional stdio JSON-RPC 2.0 server exposing 242 skills as MCP tools
- `agent-card` skill + generator producing 241 Agent Cards for A2A discovery
- 25 versioned prompt templates (v1 + v2) for 12 migrated skills
- `model-rules.yaml` — model tier routing by trust tier and artifact type
- `test-prompt-regression.mjs` — prompt regression testing with golden dataset comparison
- Golden dataset: 3 reference traces for regression testing
- 4 ADRs: artifact-first design, state-machine workflows, shift-left gates, release v2.0
- Diátaxis documentation structure: tutorial/, how-to/, reference/, explanation/
- 3 new GitHub Actions workflows: quality-gates.yml, prompt-regression.yml
- `evaluate-skills-by-domain.mjs` — domain-level skill quality evaluation
- `record-execution.mjs` v2 — emits ExecutionTrace conforming to v2 schema
- `generate-agent-cards.mjs` — batch Agent Card generation
- `migrate-skills-to-v2.mjs` — batch migration script for v2 format

### Changed

- All 241 non-platform skills migrated to v2 format with:
  - Extended frontmatter: `modelTier`, `promptVersion`, `artifactType`, `evaluators`, `fixturesPath`, `diataxis`, `tags`, `compatibility`, `approvalRequired`, `approvalFor`
  - Removed `## Operating Contract` block, replaced with `## Contract` + `@include contract-base.xml`
  - Added `## Provenance`, `## Artifact`, `## Completion` sections
  - Typed outputs as JSON schema objects
- `quality-scorer.mjs` v2: 13 dimensions (was 6), 0-100 scoring, new tiers
- `implement` skill: integrates TDD, quality gates (gate-ide, gate-pre-commit, gate-ci), feature flags, trunk-based workflow
- `publish-open-pr` skill: enforces gate-ci before opening PR
- `ask-to` skill: consumes state machine workflows for routing
- `workflow-item-router` skill: updated for Diátaxis doc paths
- Documentation reorganized from flat structure to 4 Diátaxis quadrants (30 files moved)
- Internal links updated across all docs and SKILL.md files
- Lockfile maintenance expanded to cover 254 skills (was 189)
- `audit-semantics.mjs` whitelist expanded to 20+ side effects
- `validate-skills.mjs` parser handles array frontmatter fields

### Removed

- Duplicated `## Operating Contract` blocks from all skills (moved to shared `contract-base.xml`)
- Flat docs/ structure replaced by Diátaxis quadrants

### Validation

```bash
node .agents/skills/platform/check-all.mjs
```

Expected result: 10/10 checks passing, 0 warnings, 0 errors.

## [2.1.0] - 2026-10-03

### Added

- ADR-005: skills grade elevation via references, scripts, Why sections, observability, and regression fixtures
- 12 skills elevated to grade A/B:
  - Grade A (10): implement (97), code-review (91), review-pr (91), ask-to (90), mcp-server (92), to-spec (93), to-tickets (92), tdd (92)
  - Grade B (2): work-item-router (86), agent-card (89), trunk-based-workflow (89), feature-flag (85)
- 12 new regression fixtures in `.agents/skills/platform/fixtures/regression/`
- 12 new reference files across skills (workflow rules, quality gates, routing, MCP spec, A2A, vertical slicing)
- 4 new script templates (validate-implementation, validate-routing-artifact, validate-schema, validate-router-decision)

### Validation

```bash
node .agents/skills/platform/check-all.mjs
```

Expected result: 10/10 checks passing, 0 warnings, 0 errors.


## [1.0.0] - 2026-08-27

Initial quirk-owned skills bundle baseline.

### Added

- Canonical `.agents/skills/` bundle with `.claude/skills/` compatibility links.
- quirk method, authorship, provenance, adoption, and template-standard docs.
- Scenario evaluation fixtures and deterministic scenario runner.
- Semantic audit runner and unified platform validation commands.
- Internal case-study structure.

### Changed

- Person-branded and retired routing names were removed from active workflow routing.
- `review-fix-loop` became the canonical PR remediation loop between `review-pr` and `ship-subissue`.
- Templates were hardened for traceability, metadata, acceptance criteria, validation, and scope boundaries.

### Validation

```bash
node .agents/skills/platform/check-all.mjs
```
