# Changelog

All notable changes to `quirk Skills` are recorded here.

This project follows semantic versioning once releases are cut:

- `MAJOR` for breaking workflow or artifact contract changes.
- `MINOR` for new skills, new validators, new scenarios, or compatible workflow extensions.
- `PATCH` for documentation fixes, template clarifications, and non-breaking validator fixes.

## Unreleased

### Added

- Added `work-item-router.mjs` - routes work items to appropriate skills based on input analysis and repository context.
- Added `setup-quirk-skills.sh` - initializes the bundle in target repos with sandbox setup and seed skills.
- Added `.env.template` - environment configuration template for reproducible environments.
- Added `docs/videos/README.md` - video tutorial references and links (following  framework pattern).
- Added `seed/` bundle - starter skills (`integration-playground`, `testing-framework` in seed/) for faster onboarding.
- Added `.github/workflows/validate.yml` - comprehensive CI workflow with validation, audit, metrics, and graph generation.
- Added `CONTRIBUTING.md` - contribution guidelines with development workflow and quality gates.
- Added `.generated-notes.md` - tracking document for skill creation decisions and improvements.
- Added `skill-evolver.mjs` - skill evolution tool with version management and section analysis.
- Added `project-viability` skill - evaluates project viability, functionality, and scalability against CONTEXT.md and ADRs with parallel sub-agents.

### Changed

- Enhanced `skill-lab.mjs` with improved `graph()` (dependency visualization with central skills and modularity findings), `metrics()` (skill complexity tracking), `rules()` (rule cataloging), and `pr-check()` (PR change detection). Added guardrail: "Never write outside the sandbox or the target skill file." Added `evolve`, `work-item`, and recursive graph outputs.
- Added `work-item-router.mjs` integration - connects work routing with the skill lab; updated to load skills recursively.
- Updated `.github/workflows/validate.yml` references to match the current bundle (skills-lock, audit-semantics).
- Enhanced `agent-observability` contract (version 1, preserved body) with new capabilities and audit outputs.
- Added `.agents/adr/` entry point (`README.md`) and first decision record (`0001-bundle-integration.md`).

## 0.1.0 - 2026-08-27

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

Expected release checks:

```bash
node .agents/skills/platform/check-all.mjs
```
