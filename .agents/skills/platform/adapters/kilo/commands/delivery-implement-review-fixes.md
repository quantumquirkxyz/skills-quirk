---
description: "Apply a plan-review-fixes remediation plan through implement, validate each finding, and hand off a traceable implementation result."
---
# implement-review-fixes

When to use: Apply a plan-review-fixes remediation plan through implement, validate each finding, and hand off a traceable implementation result.

## Workflow

1. Identify the PR and branch
2. Read the current plan
3. Validate the plan against the current diff
4. Implement scoped fixes
5. Validate
6. Report completion on the PR

## Deliverables

- review artifact

## Guardrails

- risk: medium; trust tier: 3; approval required: yes
- side effects: write-code, commit-git, push-branch, post-pr-comment
- isolation: worktree; model tier: reasoning

Stop when: Validate the plan and branch preconditions, apply or defer every in-scope finding exactly once, validate the resulting changes, save an ImplementReviewFixesArtifact, and identify the next consumer.
