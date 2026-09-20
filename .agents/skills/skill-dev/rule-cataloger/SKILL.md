---
name: rule-cataloger
description: Extract and classify rules across Skills by type, frequency, and application area; use when auditing the repository's shared guidance.
version: 1
capabilities:
  - extract-skill-rules
  - classify-rule-types
  - rank-rule-frequency
inputs:
  - skills-directory
outputs:
  - rule-catalog
  - frequency-report
  - application-area-summary
dependencies: []
sideEffects: []
stopCondition: Every discovered rule is listed with its source Skill, type, and frequency.
risk: low
trustTier: 2
---

# Rule Cataloger

## Contract

- Input: the canonical Skills directory.
- Output: rules with source Skills, frequency, type, and application area.
- Boundary: infer categories conservatively and preserve the raw rule text for review.

Run `node .agents/skills/platform/skill-lab.mjs rules --json`. Review inferred categories as a starting point, then refine application areas from the Skill sections (implementation, testing, documentation) before publishing the catalog.

## Rules

- Rule: preserve raw rule text and source path before normalizing categories.
- Rule: distinguish hard rules, preferences, warnings, and completion criteria.
- Rule: report extractor gaps when rules exist in Markdown but the catalog is empty.
- Rule: group repeated rules by meaning, not only by exact wording.

## Steps

1. Run the rule extraction command against the canonical Skills directory.
2. Compare extractor output against a sample of manually observed `Rule:` lines.
3. Classify rules by type, source domain, and action area.
4. Identify duplicated, conflicting, or under-specified rules.
5. Publish the catalog with caveats about extraction coverage.

## Completion Criteria

- every reported rule has source Skill and type
- extractor blind spots are documented
- high-frequency or conflicting rules are highlighted
