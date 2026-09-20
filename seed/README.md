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

To initialize a new repository with this bundle:

```bash
bash scripts/setup-quirk-skills.sh /path/to/target-repo
```

This creates the sandbox, installs skills, and creates seed skills.

## Contributing

See [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines.
