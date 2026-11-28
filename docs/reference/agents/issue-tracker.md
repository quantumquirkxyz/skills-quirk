# Issue Tracker

## Tracker

GitHub Issues in `quantumquirkxyz/skills-quirk` are the issue tracker for this repo.

## Workflow

- Create and update issues with `gh issue`.
- Publish linked work items in issue order when a skill expects tracker-backed handoff.
- Use `gh pr` for PR publication and review metadata when a skill hands off to code review or shipment.

## Native GitHub issue metadata

Use the canonical shape from `work-item-format.md` for the issue sidebar and development linkage. The supported mutation surfaces are:

- Assignees, labels, milestone, project membership, parent/sub-issues, blocked-by/blocking relationships: `gh issue edit`.
- Issue-linked development branch: `gh issue develop`.
- Project V2 fields and views: `make-project`; these are project-level data, not issue sidebar fields.
- Existing PR linkage and generic related-issue references: verify with the available GitHub API/UI; do not fabricate unsupported mutations.

`node bin/skills-quirk.js issue-meta --repo owner/repo --issue <n> --metadata <file>` is dry-run by default. Add `--write` only after reviewing the generated argv plan and obtaining the required mutation approval.

## Defaults

- Default tracker labels for spec publication: `spec`, `ready-for-agent`.
- Default tracker labels for tickets: `ready-for-agent` plus any justified area or priority labels inherited from the source spec.
- Keep assignees, labels, milestones, project items, relationships, development branches, and Project fields aligned with the canonical work-item format.

## Wayfinding operations

- `to-spec` publishes one spec issue after refinement and architecture/design (or approved not-applicable) handoff.
- `to-tickets` publishes tracer-bullet tickets with explicit blockers and architecture/design provenance.
- `implement` creates validated local commits only; it does not push or create PRs.
- `publish-open-pr` publishes a prepared local branch as a PR and hands it to the trunk-based guard.
- `ship-subissue` merges a clean subissue PR and closes the linked issue when needed, then hands the reviewed commit to release-management.
- `release-management` requires explicit approval and release-candidate provenance, owner, rollback, canary, and CI gates before handing off to deployment.

## Notes

- PRs are not treated as a general request surface unless a skill explicitly says so.
