---
name: skill-performance-metrics
category: skill-dev
maturity: experimental
version: 1
description: Summarize Skill execution duration, success rate, and available run evidence — use when measuring Skill performance from logs and records.
capabilities:
  - apply skill performance metrics workflow
  - produce skill performance metrics artifact
  - validate skill performance metrics completion criteria
outputs:
  - Skill Performance Metrics artifact with findings, decisions, recommendations, and validation notes
sideEffects: []
dependencies: []
stopCondition: Summarize Skill execution duration, success rate, and available run evidence complete; artifact saved; completion criteria checked.
risk: low
trustTier: 1
maxIterations: 6
---

## Operating Contract

- **Input:** Skill Performance Metrics request, relevant context, constraints, and source evidence.
- **Output:** Skill Performance Metrics artifact with findings, decisions, recommendations, and validation notes.
- **Side effects:** follow the frontmatter declaration; do not broaden scope without explicit user direction.
- **Dependencies:** declared dependencies, referenced skills, and source materials required by the task.
- **Stop condition:** Summarize Skill execution duration, success rate, and available run evidence is complete, evidence is captured, and completion criteria are checked.
- **Risk:** use the frontmatter risk classification and call out any escalation.
- **Boundary:** stay within the skill's declared scope, trust tier, and side-effect policy.

# Skill Performance Metrics

## Contract

- Input: an execution-record directory.
- Output: sample count, explicit duration availability, average duration, success rate, and cognitive-complexity estimates.
- Boundary: report only available evidence; missing duration data is not zero.

Run `node .agents/skills/platform/skill-lab.mjs metrics`. Use enough execution records to avoid drawing conclusions from one run; report missing duration data instead of treating it as zero.

## Rules

- Rule: report sample size before averages or rates.
- Rule: separate missing duration data from zero-duration executions.
- Rule: group results by Skill, status, and tool where the records allow it.
- Rule: do not infer quality from speed alone.

## Completion Criteria

- sample size and missing-data caveats are explicit
- success and failure counts are reported
- duration metrics are based only on records that contain duration evidence
