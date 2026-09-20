---
name: ship-subissue
category: routing
maturity: stable
version: 1
description: Use when a finished subissue already has a clean PR and you need to merge it, mark it as completed, and close the linked issue — with release discipline.
capabilities:
  - apply ship subissue workflow
  - produce ship subissue artifact
  - validate ship subissue completion criteria
outputs:
  - Ship Subissue artifact with findings, decisions, recommendations, and validation notes
sideEffects:
  - merge-pull-request
  - close-issue
  - update-project
dependencies: []
stopCondition: Use when a finished subissue already has a clean PR and you need to merge it, mark it as completed, and close the linked issue complete; artifact saved; completion criteria checked.
risk: high
trustTier: 4
maxIterations: 6
---

## Operating Contract

- **Input:** Ship Subissue request, relevant context, constraints, and source evidence.
- **Output:** Ship Subissue artifact with findings, decisions, recommendations, and validation notes.
- **Side effects:** follow the frontmatter declaration; do not broaden scope without explicit user direction.
- **Dependencies:** declared dependencies, referenced skills, and source materials required by the task.
- **Stop condition:** Use when a finished subissue already has a clean PR and you need to merge it, mark it as completed, and close the linked issue is complete, evidence is captured, and completion criteria are checked.
- **Risk:** use the frontmatter risk classification and call out any escalation.
- **Boundary:** stay within the skill's declared scope, trust tier, and side-effect policy.

# Ship Subissue

Merge one approved repository-local subissue PR, including a corrective subissue PR, mark the subissue as completed, and close out the linked issue when needed.
Use the canonical work-item format in [`docs/agents/work-item-format.md`](../../../../docs/agents/work-item-format.md) when deciding what metadata to preserve: linked-issue labels and milestone are the source of truth, and the completion note should not introduce conflicting tracker metadata.

## Workflow

1. Confirm the target.
   - Read the open PR with `gh pr view`.
   - Confirm the PR still belongs to the current branch and subissue.
   - Confirm the linked issue reference is clear.
   - Confirm the branch is clean and no conflicted branch state remains from merge/rebase or review-request follow-up work; if it is conflicted, return to `resolving-merge-conflicts` before shipping.
2. Confirm review is clean.
   - Only proceed if the last `review-pr` pass was clean on both Standards and Spec.
   - If review is not clean, stop and return to `review-fix-loop`.
3. Merge the PR.
   - Use `gh pr merge <number>` with the repository's accepted merge strategy.
   - Delete the branch if the repository convention allows it.
4. Close or complete the issue.
   - If the workflow uses an explicit completion state, update it to reflect that the subissue is done.
   - If GitHub does not auto-close the linked issue, close it with `gh issue close <number> --comment "Merged in PR #<number>."`
   - Do not guess the issue number.
5. Record completion.
   - Leave a short note on the PR or issue summarizing the merge and completion state.

## Guardrails

- Never merge with unresolved review findings.
- Never mark an issue complete unless the linked reference is clear.
- Never delete the branch before the merge has succeeded.
