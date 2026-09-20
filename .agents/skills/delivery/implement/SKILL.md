---
name: implement
category: delivery
maturity: stable
version: 1
description: Implement a piece of work based on a spec or set of tickets, or build a scoped fix that can be handed off for publication. This skill stops at the implemented, validated branch.
capabilities:
  - apply implement workflow
  - produce implement artifact
  - validate implement completion criteria
outputs:
  - Implement artifact with findings, decisions, recommendations, and validation notes
sideEffects: []
dependencies: []
stopCondition: Implement a piece of work based on a spec or set of tickets, or build a scoped fix that can be handed off for publication complete; artifact saved; completion criteria checked.
risk: low
trustTier: 1
maxIterations: 6
---

## Operating Contract

- **Input:** Implement request, relevant context, constraints, and source evidence.
- **Output:** Implement artifact with findings, decisions, recommendations, and validation notes.
- **Side effects:** follow the frontmatter declaration; do not broaden scope without explicit user direction.
- **Dependencies:** declared dependencies, referenced skills, and source materials required by the task.
- **Stop condition:** Implement a piece of work based on a spec or set of tickets, or build a scoped fix that can be handed off for publication is complete, evidence is captured, and completion criteria are checked.
- **Risk:** use the frontmatter risk classification and call out any escalation.
- **Boundary:** stay within the skill's declared scope, trust tier, and side-effect policy.

Implement the work described by the user in the spec or tickets.

Follow the issue workflow in `AGENTS.md` for branch creation and publication handoff.
When the work comes from a spec or ticket set that expects a dedicated issue branch, create a new branch from the current branch before editing, so it inherits the current branch state and history. Name the branch formally from the issue reference, for example `feat/issue-28-consolidate-simulation-notebook-runtime-entry-points`, unless the user or spec explicitly names a different branch. After the local branch is ready, push the same branch name to `origin` so it is available for review and publication.

Use /tdd where possible, at pre-agreed seams.

Run typechecking regularly, single test files regularly, and the full test suite once at the end.

## Contract

- Input: one ticket or spec, the current repo state, and explicit acceptance criteria.
- Output: code changes plus validation evidence that the criteria are met locally.
- Scope: execute the approved work; do not reopen spec decisions unless the ticket is blocked by a real defect or missing dependency.
- Rule: a ticket is ready to execute only when its acceptance criteria are concrete and its blockers are resolved.
- Rule: if the work needs a new seam, make the seam choice explicit before coding.
- Rule: break the work into minimal vertical slices (tracer bullets) that are independently implementable and verifiable. For each slice: implement the slice, validate it locally, and commit the changes with a conventional commit message before proceeding to the next slice.
- Rule: make the implementation commits on the dedicated issue branch using conventional commit formatting.
- Rule: keep the issue branch local first, then push it to `origin` before handing off to `publish-open-pr`.
- Rule: do not open, publish, or merge a PR here; this skill stops at the implemented, validated branch.

## Completion criteria

- the acceptance criteria are satisfied in the repo state
- validation ran at the appropriate seam and at the appropriate breadth
- the implementation note captures what changed and what was verified
- any skipped validation is explicitly justified
- the work is committed on the dedicated issue branch with conventional commit messages
