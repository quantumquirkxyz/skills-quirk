---
name: skill-sandbox
category: skill-dev
maturity: stable
version: 1
description: Create, test, and iterate on experimental skills in an isolated environment without affecting the canonical skills bundle.
capabilities:
  - apply skill sandbox workflow
  - produce skill sandbox artifact
  - validate skill sandbox completion criteria
outputs:
  - Skill Sandbox artifact with findings, decisions, recommendations, and validation notes
sideEffects: []
dependencies: []
stopCondition: Create, test, and iterate on experimental skills in an isolated environment without affecting the canonical skills bundle complete; artifact saved; completion criteria checked.
risk: low
trustTier: 1
maxIterations: 6
---

## Operating Contract

- **Input:** Skill Sandbox request, relevant context, constraints, and source evidence.
- **Output:** Skill Sandbox artifact with findings, decisions, recommendations, and validation notes.
- **Side effects:** follow the frontmatter declaration; do not broaden scope without explicit user direction.
- **Dependencies:** declared dependencies, referenced skills, and source materials required by the task.
- **Stop condition:** Create, test, and iterate on experimental skills in an isolated environment without affecting the canonical skills bundle is complete, evidence is captured, and completion criteria are checked.
- **Risk:** use the frontmatter risk classification and call out any escalation.
- **Boundary:** stay within the skill's declared scope, trust tier, and side-effect policy.

# Skill Sandbox

Use this skill to safely experiment with creating new skills or modifying existing ones without risking the integrity of the canonical skills bundle.

## Contract

- Input: skill concept, desired capabilities, test scenarios, and validation criteria
- Output: experimental skill directory, test results, validation report, and promotion recommendation
- Scope: isolated experimentation that does not affect .agents/skills/ or .claude/skills/
- Rule: all experimentation occurs in a dedicated sandbox directory structure
- Rule: skills can only be promoted to canonical after passing all validation checks
- Rule: experimental skills follow the same naming conventions and structure as canonical skills

## Process

### 1. Initialize Sandbox Environment

Create an isolated workspace for skill experimentation:
- Create directory `.skill-sandbox/<skill-name>/` for the experimental skill
- Set up the basic skill structure with SKILL.md file
- Initialize with templates from `skill-creator` and `writing-great-skills`
- Configure local validation that points to sandbox copies of validation scripts

### 2. Develop Experimental Skill

Iteratively build the skill following these principles:
- Start with a clear concept and defined capabilities
- Use `skill-creator` to generate the initial SKILL.md structure
- Apply `writing-great-skills` principles for clarity and predictability
- Define explicit inputs, outputs, dependencies, and side effects
- Create test scenarios that validate expected behavior
- Document the skill following the established style guide

### 3. Test in Isolation

Validate the experimental skill without affecting the main bundle:
- Run `evaluate-skill` against the experimental skill using sandboxed scenario fixtures
- Execute `validate-skills.mjs` and `audit-semantics.mjs` on the sandbox skill only
- Check for proper declaration of capabilities, inputs, outputs, and sideEffects
- Verify that the skill follows the stopCondition and risk assessment guidelines
- Test that the skill produces expected artifacts when given sample inputs

### 4. Validate Against Standards

Ensure the experimental skill meets quality benchmarks:
- Compare against similar canonical skills for consistency
- Verify proper use of quirk vocabulary from CONTEXT.md and quirk-method.md
- Check that artifact templates (if any) follow established patterns
- Confirm that dependencies are correctly declared and resolvable
- Validate that the skill manifest conforms to the platform schema

### 5. Make Promotion Decision

Determine if the skill is ready for the canonical bundle:
- If skill addresses a repeatedly useful behavior not covered by existing skills
- If skill has clear boundaries and doesn't overlap significantly with existing skills
- If skill passes all validation checks with no warnings or errors
- If skill includes proper documentation and examples
- If skill follows the principle of progressive disclosure

## Completion Criteria

- The experimental skill has been created in `.skill-sandbox/<skill-name>/`
- The skill has been tested using isolated validation scripts
- A validation report has been generated showing pass/fail status
- A promotion recommendation has been made with explicit rationale
- If promoted, the skill has been moved to `.agents/skills/` and `.claude/skills/` updated
- If not promoted, feedback has been provided for improvement

## Sandbox Directory Structure

```
.skill-sandbox/
├── <skill-name>/
│   ├── SKILL.md
│   ├── references/          # Optional: skill-owned artifact templates
│   └── scripts/             # Optional: skill-specific helper scripts
├── validations/             # Copies of validation scripts configured for sandbox
├── scenarios/               # Test scenarios for evaluating the skill
└── behavioral-fixtures/     # Expected output formats for the skill
```

## Guardrails

- Never modify `.agents/skills/` or `.claude/skills/` directly from this skill
- Always use the isolated validation scripts when testing experimental skills
- Clear the sandbox directory after promotion or abandonment to prevent clutter
- Do not promote skills that duplicate existing functionality without clear improvement
- Experimental skills must declare their experimental nature in documentation until promoted
