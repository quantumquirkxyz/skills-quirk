---
name: resolving-merge-conflicts
category: delivery
maturity: stable
version: 1
description: "Use when you need to resolve a conflicted or blocked branch state: in-progress git merge/rebase conflicts, PR branch corrections, or other branch-state blockers that need deliberate resolution."
capabilities:
  - apply resolving merge conflicts workflow
  - produce resolving merge conflicts artifact
  - validate resolving merge conflicts completion criteria
outputs:
  - Resolving Merge Conflicts artifact with findings, decisions, recommendations, and validation notes
sideEffects:
  - write-code
  - commit-git
  - continue-merge-or-rebase
dependencies: []
stopCondition: "Use when you need to resolve a conflicted or blocked branch state: in-progress git merge/rebase conflicts, PR branch corrections, or other branch-state blockers that need deliberate resolution complete; artifact saved; completion criteria checked."
risk: medium
trustTier: 3
maxIterations: 6
---

## Operating Contract

- **Input:** Resolving Merge Conflicts request, relevant context, constraints, and source evidence.
- **Output:** Resolving Merge Conflicts artifact with findings, decisions, recommendations, and validation notes.
- **Side effects:** follow the frontmatter declaration; do not broaden scope without explicit user direction.
- **Dependencies:** declared dependencies, referenced skills, and source materials required by the task.
- **Stop condition:** Use when you need to resolve a conflicted or blocked branch state: in-progress git merge/rebase conflicts, PR branch corrections, or other branch-state blockers that need deliberate resolution is complete, evidence is captured, and completion criteria are checked.
- **Risk:** use the frontmatter risk classification and call out any escalation.
- **Boundary:** stay within the skill's declared scope, trust tier, and side-effect policy.

1. **See the current state** of the branch. Check git history, the conflicting files, and whether the block came from a merge/rebase, from changes made while answering review requests on a PR branch, or from a branch-side correction needed to keep the PR moving.

2. **Find the primary sources** for each conflict. Understand deeply why each change was made, and what the original intent was. Read the commit messages, the PR and review-request history, the review comments, and the original issues/tickets.

3. **Resolve each hunk.** Preserve both intents where possible. Where incompatible, pick the one matching the branch goal and note the trade-off. Prefer the most reasonable correction that preserves the PR's changes and surrounding intent. Do **not** invent new behaviour. Always resolve; never `--abort`.

4. Discover the project's **automated checks** and run them — typically typecheck, then tests, then format. Fix anything the branch-state resolution broke.

5. **Finish the branch-state resolution.** Stage everything and commit. If rebasing, continue the rebase process until all commits are rebased.

6. **Do not merge the PR here.** This skill resolves the branch-side problem only; PR merge/close happens in the dedicated ship workflow after the branch is clean.

## Rules

- Rule: inspect branch state and conflict source before editing files.
- Rule: preserve both intents where compatible and document trade-offs where they are not.
- Rule: never discard unrelated user changes while resolving conflicts.
- Rule: run the relevant checks after resolution and before committing.
- Rule: finish the merge or rebase process completely; do not leave the branch half-resolved.
