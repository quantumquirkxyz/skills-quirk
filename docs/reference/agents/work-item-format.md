# Work Item Format

Canonical metadata shape for specs, tickets, and linked PRs.

## Metadata

Every tracker-backed work item may carry these native GitHub properties:

- `assignees` — GitHub logins assigned to the issue.
- `labels` — repository labels.
- `milestone` — milestone title or `null`.
- `projects` — GitHub Projects titles the issue belongs to.
- `relationships.parent` — parent issue number.
- `relationships.subIssues` — child issue numbers.
- `relationships.blockedBy` — prerequisite issue numbers.
- `relationships.blocking` — issues this item blocks.
- `relationships.related` — related issue references; preserve explicitly when no native generic mutation is available.
- `development.branch` — issue-linked development branch (`name`, optional `base`).
- `development.pullRequest` — existing PR reference used for verification/handoff.
- `fields.work_type`
- `fields.repo_scope`
- `fields.phase`
- `fields.priority`
- `fields.risk`
- `fields.sprint`
- `fields.release_train`
- `todo`

The machine-readable contract is `.agents/skills/platform/schemas/work-item-metadata.schema.json`.

## GitHub surface mapping

| GitHub issue surface | Canonical property | Mutation path |
|---|---|---|
| Assignees | `assignees[]` | `gh issue edit --add-assignee` |
| Labels | `labels[]` | `gh issue edit --add-label` |
| Projects | `projects[]` | `gh issue edit --add-project` |
| Milestone | `milestone` | `gh issue edit --milestone` |
| Relationships: parent/sub-issues | `relationships.parent/subIssues` | `gh issue edit --parent/--add-sub-issue` |
| Relationships: dependencies | `relationships.blockedBy/blocking` | `gh issue edit --add-blocked-by/--add-blocking` |
| Development branch | `development.branch` | `gh issue develop` |
| Project V2 custom fields | `fields.*` | `make-project` / Project V2 item-field mutation |

GitHub **Views** are project-level configuration, not issue-level metadata. Create or update views through `make-project`; do not pretend a view can be assigned directly to an individual issue.

Existing pull-request linkage and generic “related” relationships must be verified using the supported GitHub surface available to the caller. The metadata applicator never fabricates an unsupported mutation.

## Rules

- Specs default to `spec` and `ready-for-agent` with `fields.work_type = Epic`.
- Tickets default to `ready-for-agent` plus justified labels inherited from the source spec or parent issue.
- Preserve linked issue or PR metadata as the source of truth.
- Preserve assignee, milestone, project and relationship intent across ticket decomposition unless the user explicitly changes it.
- Blocking edges in a `TicketArtifact` and GitHub `blocked by` relationships must agree.
- A development branch is created only after explicit write approval; planning remains dry-run by default.
- Project V2 fields are applied only after the issue is on the intended project.
- Do not invent conflicting tracker metadata in downstream comments or handoff notes.

## Tracker coupling

- `to-spec` writes the spec using this shape.
- `to-tickets` preserves this shape across each ticket and emits blocker relationships.
- `make-project` owns Project V2 board fields and views.
- `scripts/apply-issue-metadata.mjs` plans and, with `--write`, applies native issue metadata and issue-linked development branches.
- `plan-review-fixes` and `implement-review-fixes` keep the same source metadata aligned with review loops.
