---
name: pr-operations
category: integrations
maturity: stable
version: 1
description: Manage pull request operations with branch, diff, validation, reviewer, label, comment, and publication evidence while keeping merge decisions explicit.
capabilities:
  - resolve pull request targets
  - create pull requests from validated branches
  - update PR metadata and discussion
  - request reviews and apply labels safely
  - report publication and review readiness evidence
outputs:
  - Pull request operation summary with PR URLs, branch names, diff scope, validation evidence, actions taken, and remaining review risks
sideEffects:
  - create-pull-request
  - update-pull-request
  - post-pr-comment
  - request-review
  - label-pull-request
dependencies:
  - execution-policy
stopCondition: Requested PR actions are completed or explicitly skipped, target PRs are identified, and validation or readiness evidence is reported.
risk: medium
trustTier: 3
maxIterations: 6
---

## Operating Contract

- **Input:** pull request request, repository context, branch names, target base, diff or validation evidence, and any desired metadata changes.
- **Output:** pull request operation summary with PR URL, branch/base pair, title/body/comment changes, reviewer or label changes, and validation evidence.
- **Side effects:** create or update PRs, comment on PRs, request reviews, or change labels only within the requested repository and target branch pair.
- **Dependencies:** use `execution-policy` when merge, publication, reviewer notification, or external coordination authority is unclear.
- **Stop condition:** the requested PR operation is completed or blocked with a precise reason and the current PR state is known.
- **Risk:** medium because PR operations affect review queues and can notify collaborators.
- **Boundary:** do not merge, close, delete branches, force-push, or change protected-branch settings unless another explicit workflow authorizes it.

## Rules

- Rule: resolve the repository, head branch, base branch, and target PR before applying any PR mutation.
- Rule: read the diff or branch status before creating or materially updating a PR body so the description matches the actual change.
- Rule: include validation evidence in PR creation or update summaries; if validation was skipped, state why.
- Rule: avoid duplicate PRs by searching for an open PR with the same head/base pair before creating a new one.
- Rule: do not request reviewers or teams unless the user, CODEOWNERS, project workflow, or existing PR convention supports that notification.
- Rule: never merge a PR from this skill; hand off merge decisions to the user or the repository's release workflow.
- Rule: after mutation, return stable URLs, PR number, branch pair, and any review-blocking conditions.
- Rule: use `references/pr-operation-summary-template.md` when creating or materially updating a PR.
- Rule: consult `references/pr-provider-guidelines.md` before translating generic PR operations into GitHub, GitLab, Bitbucket, or Forgejo actions.

## Workflow

1. Identify the repository, head branch, base branch, and desired operation: create, update title, update body, comment, label, request review, mark ready, or report status.
2. Inspect current PR state or search for an existing PR matching the branch pair.
3. Inspect the relevant diff, recent commits, and validation evidence when the operation changes the PR narrative or review readiness.
4. Draft the exact PR title, body, comment, labels, or review requests before applying them.
5. Apply only the requested PR mutations and avoid combining unrelated review coordination work.
6. Re-read or verify the PR after mutation when tooling allows it.
7. Summarize the final PR state, including what changed, what was validated, and what remains for reviewers.

## References

- `references/pr-operation-summary-template.md` - reusable PR operation summary format.
- `references/pr-provider-guidelines.md` - provider-specific mapping notes and merge-safety boundaries.

## Completion Criteria

- the PR target is resolved to a stable URL or a clear skipped reason
- branch pair, title/body/comment changes, labels, and reviewer changes are listed
- validation evidence is included or explicitly marked unavailable
- no merge or destructive branch action occurred unless separately authorized
- follow-up review risks are concise and actionable
