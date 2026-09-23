---
name: skill-dependency-graph
category: skill-dev
maturity: stable
version: 1
description: Build a dependency graph that exposes central Skills, cycles, and unnecessary coupling — use when analyzing Skill modularity.
capabilities:
  - apply skill dependency graph workflow
  - produce skill dependency graph artifact
  - validate skill dependency graph completion criteria
outputs:
  - Skill Dependency Graph artifact with findings, decisions, recommendations, and validation notes
sideEffects: []
dependencies: []
stopCondition: Build a dependency graph that exposes central Skills, cycles, and unnecessary coupling complete; artifact saved; completion criteria checked.
risk: low
trustTier: 1
maxIterations: 6
---

## Operating Contract

- **Input:** Skill Dependency Graph request, relevant context, constraints, and source evidence.
- **Output:** Skill Dependency Graph artifact with findings, decisions, recommendations, and validation notes.
- **Side effects:** follow the frontmatter declaration; do not broaden scope without explicit user direction.
- **Dependencies:** declared dependencies, referenced skills, and source materials required by the task.
- **Stop condition:** Build a dependency graph that exposes central Skills, cycles, and unnecessary coupling is complete, evidence is captured, and completion criteria are checked.
- **Risk:** use the frontmatter risk classification and call out any escalation.
- **Boundary:** stay within the skill's declared scope, trust tier, and side-effect policy.

# Skill Dependency Graph

## Contract

- Input: the canonical Skills directory.
- Output: Mermaid or JSON graph, cycle list, central Skills, and modularity findings.
- Boundary: analyze declared dependencies only; do not rewrite Skill contracts.

Run `node .agents/skills/platform/skill-lab.mjs graph --format mermaid` for a diagram or `--format json` for analysis input. Use incoming-edge counts to identify central Skills and inspect every cycle before adding another dependency.

## Rules

- Rule: analyze declared dependencies, not informal mentions, unless the task explicitly asks for soft links.
- Rule: treat cycles as review findings until proven intentional.
- Rule: distinguish central reusable primitives from accidental coupling.
- Rule: recommend dependency removal only when an alternate contract is clear.

## Completion Criteria

- graph format and source directory are explicit
- cycles and central nodes are listed
- modularity findings include a maintenance recommendation
