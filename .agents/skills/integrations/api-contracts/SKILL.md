---
name: api-contracts
category: integrations
maturity: stable
version: 1
description: Define the request and response contracts, versioning rules, and compatibility boundaries for APIs — with explicit consumer obligations.
capabilities:
  - apply api contracts workflow
  - produce api contracts artifact
  - validate api contracts completion criteria
outputs:
  - Api Contracts artifact with findings, decisions, recommendations, and validation notes
sideEffects: []
dependencies: []
stopCondition: Define the request and response contracts, versioning rules, and compatibility boundaries for APIs complete; artifact saved; completion criteria checked.
risk: low
trustTier: 1
maxIterations: 6
---

## Operating Contract

- **Input:** Api Contracts request, relevant context, constraints, and source evidence.
- **Output:** Api Contracts artifact with findings, decisions, recommendations, and validation notes.
- **Side effects:** follow the frontmatter declaration; do not broaden scope without explicit user direction.
- **Dependencies:** declared dependencies, referenced skills, and source materials required by the task.
- **Stop condition:** Define the request and response contracts, versioning rules, and compatibility boundaries for APIs is complete, evidence is captured, and completion criteria are checked.
- **Risk:** use the frontmatter risk classification and call out any escalation.
- **Boundary:** stay within the skill's declared scope, trust tier, and side-effect policy.

# API Contracts

Use this skill when the request and response surfaces need to be pinned down precisely. It should define what callers send, what they receive, and how the contract can evolve without surprising consumers.

## Contract

- Input: API contract brief, consumer context, and compatibility constraints.
- Output: contract shape, versioning guidance, and compatibility notes.
- Scope: define the contract, not the implementation.
- Rule: keep the request and response shapes minimal and explicit.
- Rule: call out backward compatibility expectations before the first change lands.
- Rule: name the versioning strategy when the contract is expected to evolve.

## Steps

1. Identify the consumer's job.
2. Define the request and response shapes.
3. Specify the versioning and compatibility rules.
4. Note any error or pagination conventions that callers must know.

## Completion criteria

- the request and response shapes are named
- the versioning strategy is named
- the compatibility rules are explicit
