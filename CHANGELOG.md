# Changelog

All notable changes to `quirk Skills` are recorded here.

This project follows semantic versioning once releases are cut:

- `MAJOR` for breaking workflow or artifact contract changes.
- `MINOR` for new skills, new validators, new scenarios, or compatible workflow extensions.
- `PATCH` for documentation fixes, template clarifications, and non-breaking validator fixes.

## Unreleased

### Added

- Added workflow operation skills for issue tracker and pull request mutations with explicit evidence and safety boundaries.
- Added skill-dev maintenance skills for lockfile maintenance, quality gates, workflow fixtures, and side-effect audits.
- Added 3 scenario fixtures covering operation boundaries, release quality, fixture quality, and side-effect quality.

### Changed

- Updated the generated skill inventory, skills map, README validation notes, and provenance records to match the current canonical bundle.

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
