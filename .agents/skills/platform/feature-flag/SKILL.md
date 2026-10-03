---
name: feature-flag
category: platform
description: Design and manage feature flags with short-lived flags, gradual rollouts, kill switches, A/B testing, and cleanup discipline.
artifactType: plan
modelTier: router
tags:
  - feature-flags
  - rollout
  - experimentation
  - kill-switch
compatibility:
  - implement
  - publish-open-pr
  - gate-post-merge
  - observability
outputs:
  - type: object
    description: FeatureFlagArtifact
    schema:
      type: object
      properties:
        name:
          type: string
        purpose:
          type: string
        type:
          type: string
          enum: [release, experiment, kill-switch]
        targetingRules:
          type: array
          items:
            type: string
        rolloutPercentage:
          type: integer
          minimum: 0
          maximum: 100
        cleanupDeadline:
          type: string
          format: date
        status:
          type: string
          enum: [draft, active, completed, cleaned]
        dependencies:
          type: array
          items:
            type: string
stopCondition: Feature flag design and management complete; FeatureFlagArtifact emitted; completion criteria checked.
risk: low
trustTier: 1
maxIterations: 4
fixturesPath: .agents/skills/platform/fixtures/regression/feature-flag.json
---

# Feature Flag

## Why

Short-lived flags prevent tech debt because they force the team to retire the switch at the same time the feature ships. A flag with a 4-week cleanup deadline is a contract, not a suggestion. When flags outlive their purpose they become zombie switches: hidden branching logic that bloats code paths, complicates testing, and obscures intent. By tying every flag to a cleanup deadline and an owner, the team maintains a tight feedback loop between rollout and retirement, keeping the codebase navigable and the deployment pipeline honest.

Use this skill when a project needs to introduce a new feature flag, plan a safe rollout, or retire an existing flag. It keeps flags short-lived, well-targeted, and observable so the codebase does not accumulate dead switches.

## Contract

- Input: feature request, rollout constraints, targeting context, and operational requirements.
- Output: FeatureFlagArtifact in JSON and Markdown.
- Scope: design the flag, its targeting rules, and its lifecycle; execution and verification belong to the consuming pipeline.
- Rule: every flag must have a cleanup deadline of at most 4 weeks.
- Rule: flags default to off for all users; explicit targeting rules are required for any exposure.
- Rule: kill switches must be independently reversible without a redeploy.
- Rule: flag state changes must be observable and auditable.
- Rule: experiment flags must define success metrics and sample size before rollout.
- Rule: no flag may be promoted to production without a named owner and cleanup owner.

## Provenance

| Dimension | Bar |
|---|---|
| Correctness | flag purpose is unambiguous; targeting rules are testable |
| Completeness | cleanup deadline, owner, metrics, and dependencies are recorded |
| Consistency | naming follows project conventions; type taxonomy matches usage |
| Timeliness | flags are retired within the declared cleanup deadline |
| Safety | kill switches are reversible without deploy; rollout limits are enforced |

## Artifact

Emit a `FeatureFlagArtifact` as JSON and a human-readable Markdown summary.

Observability: the artifact must include `traceId`, `owner`, and `cleanupOwner` fields so that flag state changes are auditable. Each flag state transition must emit a record to the observability pipeline with timestamp, actor, and previous state.

### FeatureFlagArtifact Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "FeatureFlagArtifact",
  "type": "object",
  "required": ["name", "purpose", "type", "targetingRules", "rolloutPercentage", "cleanupDeadline", "status", "dependencies"],
  "properties": {
    "name": {
      "type": "string",
      "description": "Unique flag identifier"
    },
    "purpose": {
      "type": "string",
      "description": "Why this flag exists"
    },
    "type": {
      "type": "string",
      "enum": ["release", "experiment", "kill-switch"],
      "description": "Flag purpose category"
    },
    "targetingRules": {
      "type": "array",
      "items": {"type": "string"},
      "description": "Explicit targeting conditions"
    },
    "rolloutPercentage": {
      "type": "integer",
      "minimum": 0,
      "maximum": 100,
      "description": "Percentage of users exposed when active"
    },
    "cleanupDeadline": {
      "type": "string",
      "format": "date",
      "description": "Maximum date before the flag must be retired"
    },
    "status": {
      "type": "string",
      "enum": ["draft", "active", "completed", "cleaned"],
      "description": "Current lifecycle state"
    },
    "dependencies": {
      "type": "array",
      "items": {"type": "string"},
      "description": "Flags or services this flag depends on"
    }
  }
}
```

### Markdown Summary

```markdown
# Feature Flag: {name}

**Purpose:** {purpose}
**Type:** {type}
**Status:** {status}
**Rollout:** {rolloutPercentage}%
**Cleanup Deadline:** {cleanupDeadline}

## Targeting Rules
{targetingRules}

## Dependencies
{dependencies}

## Rollout Plan
1. Start at {rolloutPercentage}% with explicit targeting rules.
2. Observe metrics and error rates for 24-48 hours.
3. Increase in stages to 100% or retire at cleanup deadline.

## Cleanup Plan
- Remove flag code on or before {cleanupDeadline}.
- Delete flag configuration after full rollout is confirmed.
- Verify no dead code remains.
```

## Process

1. Identify flag purpose: classify as release flag, experiment, or operational kill switch.
2. Define targeting rules and rollout plan: specify who gets the flag, at what percentage, and what gates must pass before expansion.
3. Set cleanup deadline: max 4 weeks from activation; record owner and success criteria.
4. Document flag in registry: emit FeatureFlagArtifact with JSON schema and Markdown summary.
5. Verify flag state in gate-post-merge: confirm flag default is off, targeting rules are enforced, and observability is wired.

## Completion criteria

- the flag purpose is classified (release, experiment, or kill-switch)
- targeting rules and rollout percentage are explicit
- cleanup deadline is set and does not exceed 4 weeks
- FeatureFlagArtifact JSON is valid and emitted
- flag is observable and reversible without a redeploy
- gate-post-merge verification confirms flag state and default safety

@include .agents/skills/platform/contract-base.xml
