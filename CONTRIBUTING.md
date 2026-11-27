# Contributing to Quirk Skills

This document outlines how to contribute to the quirk Skills bundle.

## Getting Started

1. Clone the repository
2. Run `node .agents/skills/platform/check-all.mjs`
3. Read `docs/how-to/adoption.md` and use the dry-run sync/adoption flow when working against another repository
4. Check `docs/how-to/skill-style.md`

## Development Workflow

### Creating a New Skill

```bash
node .agents/skills/platform/skill-lab.mjs template my-skill --domain testing
```

This creates a new skill in `.skill-sandbox/my-skill/`.

### Validating Your Skill

```bash
node .agents/skills/platform/skill-lab.mjs validate .skill-sandbox/my-skill
```

### Testing Your Skill

```bash
node .agents/skills/platform/skill-lab.mjs playground --output /tmp/test
```

## Quality Gates

Before submitting:

1. Run `node .agents/skills/platform/check-all.mjs`
2. Verify `node .agents/skills/platform/validate-skills.mjs`
3. Check `node .agents/skills/platform/audit-semantics.mjs`
4. Confirm `node .agents/skills/platform/evaluate-scenarios.mjs`

## Skill Evolution

To evolve an existing skill:

```bash
node .agents/skills/platform/skill-evolver.mjs <skill-name>
```

## Contribution Process

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run all validation checks
5. Submit a pull request
6. Ensure the CI workflow passes

## Code of Conduct

- Preserve existing repository conventions
- Surface uncertainty and failures explicitly
- Use the `work-item-router.mjs` for routing
- Follow the skill style guide
- Include validation evidence in artifacts

## Questions?

Check `docs/reference/agents/` and `docs/how-to/` for more documentation.

## Release metadata for mergeable changes

All tracked content intended for merge must update release metadata in the same change. Update `VERSION`, add a bullet under `CHANGELOG.md`'s `## [Unreleased]`, and synchronize `package.json`, `registry.yaml`, `skills.json`, the README badge, and `.claude-plugin/plugin.json` to the exact `VERSION`. Choose MAJOR, MINOR, or PATCH according to the release policy in `docs/how-to/release.md`.

Run the canonical checks before submitting:

```bash
node scripts/check-release-metadata.mjs
node --test tests/version-consistency.test.mjs tests/release-metadata-update.test.mjs
```

Do not edit generated projections directly. After canonical metadata is complete, run `node scripts/sync-registry.mjs --write`, review its output, and run the generated drift checks. A generated-only regeneration may use `RELEASE_METADATA_EXEMPTION=generated-only`; a non-shipping emergency maintenance change requires `RELEASE_METADATA_EXEMPTION=emergency-maintenance` and `RELEASE_METADATA_EXEMPTION_REASON`. These are the only exemptions.

For a release, finalize the Unreleased notes, run `node .agents/skills/platform/check-all.mjs`, commit the scoped canonical and regenerated files, create tag `v<version>`, and push the branch and tag. Contributors must not commit or push as part of validation-only work.
