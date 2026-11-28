# Seed Bundle

This bundle contains starter skills to get you up and running quickly.

## Skills Included

- **integration-playground** – Local playground for testing and developing skills.
- **testing-framework** – Standardized testing utilities for skill validation.

## Usage

```bash
# Template a new skill
node .agents/skills/platform/skill-lab.mjs template --domain integration

# Validate all skills
node .agents/skills/platform/skill-lab.mjs validate

# Generate a dependency graph
node .agents/skills/platform/skill-lab.mjs graph

# Run metrics
node .agents/skills/platform/skill-lab.mjs metrics

# Evolve a skill
node .agents/skills/platform/skill-evolver.mjs integration-playground --target-version 2
```

## Setup

Legacy destructive setup, for a disposable target only:

```bash
bash scripts/setup-quirk-skills.sh /path/to/target-repo /path/to/skills-quirk
```

The script replaces bundle-managed paths. For normal first installation, use the dry-run sync and adoption flow in [docs/how-to/installation.md](../../docs/how-to/installation.md).

## Contributing

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for guidelines.
