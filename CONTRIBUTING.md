# Contributing to Quirk Skills

This document outlines how to contribute to the quirk Skills bundle.

## Getting Started

1. Clone the repository
2. Run `bash scripts/setup-quirk-skills.sh .`
3. Read `docs/agents/adoption-guide.md`
4. Check `docs/agents/skill-style-guide.md`

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

Check `docs/agents/` for more documentation.
See `docs/videos/` for tutorials.
