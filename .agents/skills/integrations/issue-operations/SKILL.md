---
name: issue-operations
category: integrations
maturity: stable
version: 1
description: Manage issue tracker operations with scoped target resolution, duplicate checks, mutation evidence, and rollback notes for create, update, comment, label, link, assign, and close actions.
capabilities:
  - resolve issue tracker targets
  - create scoped issues from concrete work items
  - update issue metadata and discussion safely
  - capture mutation evidence and follow-up state
outputs:
  - Issue operation summary with target IDs, URLs, actions taken, skipped actions, and validation notes
sideEffects:
  - create-issue
  - update-issue
  - post-comment
  - label-issue
  - assign-issue
  - close-issue
dependencies:
  - execution-policy
stopCondition: Requested issue tracker actions are completed or explicitly skipped, each target issue is identified, and the user receives evidence for every mutation.
risk: medium
trustTier: 3
maxIterations: 6
---

## Operating Contract

- **Input:** issue tracker request, repository or project context, target issue references, requested action, and any text or metadata to apply.
- **Output:** issue operation summary with issue IDs, links, action results, validation notes, and unresolved questions.
- **Side effects:** create, update, comment on, label, assign, link, or close issues only when the requested action is clear.
- **Dependencies:** use `execution-policy` when the requested mutation, target, or authority is ambiguous.
- **Stop condition:** each requested issue action is either applied and evidenced, or skipped with a concrete reason.
- **Risk:** medium because issue tracker mutations affect shared coordination state.
- **Boundary:** do not invent tracker state, do not change unrelated issues, and do not close or reopen issues without a stated reason.

## Rules

- Rule: resolve the tracker, repository or project, and exact issue target before mutating anything.
- Rule: search for existing issues before creating a new one when the work item may already exist.
- Rule: keep the operation narrow; apply only the labels, assignees, milestone, title, body, comments, links, or state changes requested by the user or required by a referenced workflow.
- Rule: preserve the user's language and intent in issue text while making acceptance criteria, blockers, and evidence explicit.
- Rule: never close, reopen, lock, delete, or transfer an issue as a side effect of summarizing or triaging unless the user requested that exact operation.
- Rule: after every mutation, capture the issue number or stable ID, URL, final state, and any API or validation response that proves the action completed.
- Rule: if a partial failure occurs, stop broadening the mutation set and report which issue actions succeeded, which failed, and what remains safe to retry.

## Workflow

1. Identify the issue system and target scope from the user's request, linked work item, repository remote, or project metadata.
2. Normalize the requested operation into one or more explicit actions: create, update body, edit title, comment, label, assign, link, close, reopen, or move state.
3. Perform read-only checks first: confirm the target exists, look for duplicate open issues, and read the current labels, assignees, state, and most recent relevant discussion.
4. Draft the exact mutation content before applying it. For new issues, include a concise title, context, acceptance criteria, validation expectations, and known blockers.
5. Apply the smallest safe mutation set. Avoid bundling unrelated changes into one issue operation when separate evidence would be clearer.
6. Verify the final issue state by reading the target after mutation when the available tool supports it.
7. Return a compact summary with links, IDs, changes made, skipped actions, and recommended next steps.

## Completion Criteria

- every requested issue action has an applied/skipped status
- created or updated issues have stable identifiers and links
- duplicate and target-resolution checks are noted when issue creation or closure was in scope
- risky state changes include the reason for the change
- any remaining manual follow-up is specific enough for another agent or human to execute
