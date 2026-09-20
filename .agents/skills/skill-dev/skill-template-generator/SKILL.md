---
name: skill-template-generator
category: skill-dev
maturity: sandbox
version: 1
description: Generate an interactive, contract-complete Skill template in the sandbox — use when starting a new Skill with the lab's scaffolding.
capabilities:
  - apply skill template generator workflow
  - produce skill template generator artifact
  - validate skill template generator completion criteria
outputs:
  - Skill Template Generator artifact with findings, decisions, recommendations, and validation notes
sideEffects:
  - write-files
dependencies: []
stopCondition: Generate an interactive, contract-complete Skill template in the sandbox complete; artifact saved; completion criteria checked.
risk: low
trustTier: 2
maxIterations: 6
---

## Operating Contract

- **Input:** Skill Template Generator request, relevant context, constraints, and source evidence.
- **Output:** Skill Template Generator artifact with findings, decisions, recommendations, and validation notes.
- **Side effects:** follow the frontmatter declaration; do not broaden scope without explicit user direction.
- **Dependencies:** declared dependencies, referenced skills, and source materials required by the task.
- **Stop condition:** Generate an interactive, contract-complete Skill template in the sandbox is complete, evidence is captured, and completion criteria are checked.
- **Risk:** use the frontmatter risk classification and call out any escalation.
- **Boundary:** stay within the skill's declared scope, trust tier, and side-effect policy.

# Skill Template Generator

## Contract

- Input: skill name, domain, description, and optional capability list.
- Output: a non-overwriting sandbox Skill, completed frontmatter, and validation command.
- Boundary: generate only under `.skill-sandbox/`; promotion remains a separate decision.

Use `node .agents/skills/platform/skill-lab.mjs template <name> --domain <domain>` to create a safe starting point in `.skill-sandbox/`. Ask for the problem, users, capabilities, outputs, dependencies, and risk before generating; never overwrite an existing template.

Validate the result with `node .agents/skills/platform/skill-lab.mjs validate .skill-sandbox/<name> --json`, then promote only after the sandbox checks pass.

## Rules

- Rule: generate into `.skill-sandbox/` only.
- Rule: ask for problem, users, capabilities, outputs, dependencies, side effects, and risk before scaffolding.
- Rule: include a concrete stop condition and at least one validation path in the template.
- Rule: never overwrite an existing sandbox Skill without explicit user direction.

## Completion Criteria

- sandbox path is created or identified safely
- generated frontmatter is complete enough for validation
- validation command and promotion checklist are provided
