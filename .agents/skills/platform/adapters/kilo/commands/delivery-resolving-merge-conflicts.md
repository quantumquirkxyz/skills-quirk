---
description: "Use when you need to resolve a conflicted or blocked branch state: in-progress git merge/rebase conflicts, PR branch corrections, or other branch-state blockers that need deliberate resolution."
---
# resolving-merge-conflicts

When to use: Use when you need to resolve a conflicted or blocked branch state: in-progress git merge/rebase conflicts, PR branch corrections, or other branch-state blockers that need deliberate resolution.

## Workflow

1. Confirm an in-progress merge or rebase: `git status` shows "You have unmerged paths" or "rebase in progress"
2. List conflicted files: `git diff --name-only --diff-filter=U`
3. Identify the conflict source: which branch(es) introduced conflicting changes to each hunk
4. Record the branch names, operation type (merge/rebase), and conflicted file list in the artifact
5. Open each conflicted file and read the conflict markers (`<<<<<<<`, `=======`, `>>>>>>>`)
6. Determine the intent of each side: what change was being made and why
7. Where both intents are compatible, combine them into a single coherent result rather than picking one side
8. Remove all conflict markers from the resolved file

## Deliverables

- delivery artifact

## Guardrails

- risk: medium; trust tier: 3; approval required: yes
- side effects: write-code, commit-git, continue-merge-or-rebase
- isolation: worktree; model tier: reasoning

Stop when: The branch merge/rebase is fully complete, no conflict markers remain, checks have passed, and the resolution artifact is saved and validated.
