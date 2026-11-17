---
name: "resolving-merge-conflicts"
category: "delivery"
maturity: "stable"
version: "1"
description: "Use when you need to resolve a conflicted or blocked branch state: in-progress git merge/rebase conflicts, PR branch corrections, or other branch-state blockers that need deliberate resolution."
license: "MIT"
capabilities:
  - apply resolving merge conflicts methods within explicit delivery boundaries
  - analyze use when you need to resolve a conflicted or blocked branch state: in-progress git merge/rebase conflicts, pr branch corrections, or other branch-state blockers that need deliberate resolution with assumptions, constraints, and failure modes
  - produce and validate a delivery artifact with evidence, decisions, and next steps
outputs:
  - type: object
    name: ResolvingMergeConflictsArtifact
    properties:
      result:
        type: object
        description: "Resolution artifact path, per-file conflict decisions with intent preservation and trade-offs, and validation status"
      required: [result]
sideEffects:
  - write-code
  - commit-git
  - continue-merge-or-rebase

dependencies: []
stopCondition: "The branch merge/rebase is fully complete, no conflict markers remain, checks have passed, and the resolution artifact is saved and validated."
risk: "medium"
trustTier: "3"
maxIterations: "6"
promptVersion: "2.0"
artifactType: "delivery"
modelTier: "reasoning"
evaluators: ["behavioral", "regression"]
fixturesPath: ".agents/skills/platform/fixtures/behavioral/resolving-merge-conflicts.json"
diataxis: "how-to"
tags: ["delivery"]
compatibility: []
approvalRequired: true
approvalFor: ["write-code", "commit-git", "continue-merge-or-rebase"]
---

## Vocabulary

The following terms are defined in [CONTEXT.md](../../../../CONTEXT.md) and used throughout this skill:

- **quirk Skills**: Canonical skills live in `.agents/skills/` as `<domain>/<skill>/SKILL.md` directories; they are the only source of truth for skill content.
- **quirk Method**: The bundle's method applied to work in this repo: artifact-first design, state-machine workflows, and shift-left quality gates.
- **canonical skill**: The authoritative, committed version of a skill in `.agents/skills/`; `.claude/skills/` is a generated compatibility view of relative symlinks and is never hand-edited.
- **provenance**: The evidence chain showing where a change came from, what decisions were made, and why — required for every conflict resolution artifact produced by this skill.

## Contract

### Input schema

| Field | Type | Required | Description |
|---|---|---|---|
| branchName | string | yes | The conflicted branch or the branch being merged/rebased. |
| mergeOrRebaseState | string | yes | Either "merge" or "rebase" describing the in-progress operation. |
| conflictedFiles | array[string] | yes | Files containing conflict markers (`<<<<<<<`, `=======`, `>>>>>>>`). |
| sourceBranch | string | no | The branch being merged in (for merge) or rebased onto (for rebase). |
| userIntent | string | no | The user's stated intent for the resolution, if known. |

### Output schema

| Field | Type | Required | Description |
|---|---|---|---|
| resolutionArtifact | string | yes | Path to the saved `ResolvingMergeConflictsArtifact` JSON/Markdown pair. |
| conflictDecisions | array | yes | Per-conflict decision records (file, conflictMarker, resolution, intentPreserved, tradeOff). |
| validationStatus | object | yes | Checks run, checks passed, and mergeComplete flag. |

### Rules about preserving intent

- Rule: inspect branch state and conflict source before editing any file.
- Rule: preserve both intents where the conflicting changes are compatible; combine them rather than choosing one side.
- Rule: where intents genuinely conflict, document the trade-off explicitly and do not silently discard either side.
- Rule: never discard unrelated user changes while resolving conflicts; only resolve the conflicting hunks.
- Rule: run the relevant checks after resolution and before committing.
- Rule: finish the merge or rebase process completely; do not leave the branch half-resolved.

## Provenance

| Question | Answer |
|---|---|
| What is the source of truth? | The user's request, originating spec/issue, and the skill's declared outputs |
| What is in scope? | Work covered by the skill's acceptance criteria and completion rules |
| What is explicitly out of scope? | Files, behaviors, and decisions outside the skill's declared boundary |
| Who or what consumes this artifact afterward? | The next skill in the workflow, CI, or the user |
| What evidence proves it is done? | Completion criteria met, artifact saved, validation passed, merge/rebase complete |
| What risk remains? | Subjective judgment calls, missing context, or external dependency failures |
| Evidence requirements for conflict resolution | For every resolved conflict: the file path, the conflict markers removed, the resolution applied, which intent(s) were preserved, and any trade-off documented. The artifact must show `mergeComplete: true` only when `git status` reports a clean tree and no conflict markers remain. |
| Risk assessment: losing changes | Medium risk. Resolving conflicts by taking one side ("ours" or "theirs") can silently discard changes from the other branch. The artifact must record which side was kept and why, so reviewers can verify no intent was lost. |

## Steps

### Step 1: Inspect branch state and conflict source

1. Confirm an in-progress merge or rebase: `git status` shows "You have unmerged paths" or "rebase in progress".
2. List conflicted files: `git diff --name-only --diff-filter=U`.
3. Identify the conflict source: which branch(es) introduced conflicting changes to each hunk.
4. Record the branch names, operation type (merge/rebase), and conflicted file list in the artifact.

**Completion criteria for Step 1:**
- [ ] `git status` confirms an in-progress merge or rebase.
- [ ] All conflicted files are enumerated.
- [ ] The source of each conflict (branch/hunk) is identified.
- [ ] Branch state is recorded in the resolution artifact.

### Step 2: Preserve both intents where compatible

1. Open each conflicted file and read the conflict markers (`<<<<<<<`, `=======`, `>>>>>>>`).
2. Determine the intent of each side: what change was being made and why.
3. Where both intents are compatible, combine them into a single coherent result rather than picking one side.
4. Remove all conflict markers from the resolved file.

**Completion criteria for Step 2:**
- [ ] Every conflict hunk has been reviewed for intent on both sides.
- [ ] Compatible intents are combined; no conflict markers remain in resolved files.
- [ ] The combined result compiles/passes syntax checks where applicable.

### Step 3: Document trade-offs where intents conflict

1. Where the two intents cannot both be satisfied, record the conflict explicitly.
2. Document which intent was kept, which was deferred or changed, and the reasoning.
3. Add the trade-off note to the `conflictDecisions` array in the artifact (`tradeOff` field).
4. Do not silently discard either side without a recorded justification.

**Completion criteria for Step 3:**
- [ ] Every genuinely conflicting intent has a recorded trade-off decision.
- [ ] No conflict was resolved by silent deletion of one side.
- [ ] The `tradeOff` field is populated for each decision where intents could not both be preserved.

### Step 4: Run checks after resolution

1. Run the project's lint, typecheck, and test commands relevant to the changed files.
2. Confirm `git diff --check` reports no whitespace or conflict-marker residue.
3. Record the checks run and their pass/fail status in `validationStatus`.

**Completion criteria for Step 4:**
- [ ] Lint and typecheck pass on resolved files.
- [ ] Relevant tests pass.
- [ ] `git diff --check` is clean (no conflict markers or whitespace errors).
- [ ] `validationStatus.checksRun` is true and `checksPassed` is true.

### Step 5: Finish the merge/rebase process completely

1. Stage resolved files: `git add <resolved-files>`.
2. For a merge: complete with `git merge --continue` (or `git commit` if no editor is needed).
3. For a rebase: complete with `git rebase --continue`.
4. Confirm `git status` reports a clean working tree and no in-progress operation.
5. Set `validationStatus.mergeComplete` to true in the artifact.

**Completion criteria for Step 5:**
- [ ] All resolved files are staged.
- [ ] `git merge --continue` or `git rebase --continue` ran successfully.
- [ ] `git status` shows a clean tree with no unmerged paths.
- [ ] No merge/rebase is left in progress.
- [ ] `validationStatus.mergeComplete` is true.

## Guardrails

- Never discard unrelated user changes while resolving conflicts; resolve only the conflicting hunks.
- Run checks (lint, typecheck, tests) before committing the resolution.
- Complete the merge or rebase process fully; never leave the branch half-resolved with unmerged paths.
- Record every conflict decision in the artifact so reviewers can verify intent preservation.
- Do not broaden scope beyond the conflicted branch and its resolution without explicit direction.

## Artifact

Emit `ResolvingMergeConflictsArtifact` as both:
- JSON: `.agents/skills/platform/artifacts/resolving-merge-conflicts/{identifier}.json`
- Markdown view: same filename with `.md` extension

The artifact must include:
- `resolutionArtifact` — path/identifier of the saved artifact.
- `conflictDecisions` — array of `{ file, conflictMarker, resolution, intentPreserved, tradeOff }`.
- `validationStatus` — `{ checksRun, checksPassed, mergeComplete }`.

## References

- `gitops` — declarative sync and drift detection for branch state management.
- `devops-ci-cd-pipeline` — build, test, security scan, and deployment gates that run after resolution.
- `pr-operations` — branch, diff, validation, reviewer, label, comment, and publication evidence for the resolved branch.
- `review-pr` — formal pull-request review against a fixed point; separation of Standards and Spec findings.
- `branch` workflow — short-lived branches, small PRs, CI gating, and merge-to-trunk discipline.

## Examples

### Example: Resolving a merge conflict in `src/config.js`

**Before (conflicted state):**

```
git status
# You have unmerged paths.
#   (fix conflicts and run "git merge --continue")
# Unmerged paths:
#   (use "git add <file>..." to mark resolution)
#       both modified:   src/config.js

[ours: HEAD]
const API_TIMEOUT = 5000;
[conflict separator]
const API_TIMEOUT = 10000;
[theirs: feature/slow-network]
```

**Analysis:**

- `HEAD` (main branch) sets `API_TIMEOUT` to `5000` ms — intent: fail fast on slow responses.
- `feature/slow-network` sets `API_TIMEOUT` to `10000` ms — intent: tolerate slower networks.

**Resolution (both intents preserved where possible):**

The maintainer decides a single timeout value is needed. After discussion, `7500` ms is chosen as a compromise, with the trade-off documented:

```
const API_TIMEOUT = 7500;
```

**Artifact entry:**

```json
{
  "file": "src/config.js",
  "conflictMarker": "ours ... separator ... theirs (feature/slow-network)",
  "resolution": "const API_TIMEOUT = 7500;",
  "intentPreserved": "neither fully; compromise value chosen",
  "tradeOff": "main's 5000 ms fail-fast and feature's 10000 ms tolerance both partially sacrificed; documented in PR description"
}
```

**After:**

```
git add src/config.js
git merge --continue
git status
# On branch main
# nothing to commit, working tree clean
```

## Completion

Per-step completion criteria:

- [ ] Step 1: branch state confirmed, conflicted files enumerated, conflict sources identified, recorded in artifact.
- [ ] Step 2: every conflict hunk reviewed, compatible intents combined, no conflict markers remain.
- [ ] Step 3: conflicting intents have recorded trade-off decisions; nothing silently discarded.
- [ ] Step 4: lint, typecheck, and tests pass; `git diff --check` clean; `validationStatus` populated.
- [ ] Step 5: files staged, merge/rebase continued to completion, `git status` clean, `mergeComplete: true`.

Explicit branch-state rule: the branch must not be left half-resolved. `validationStatus.mergeComplete` may only be `true` when `git status` reports a clean tree and no merge/rebase is in progress.

- the skill's completion criteria are explicitly checked
- the artifact is saved and validated
- any blockers or skipped validations are documented
- the next consumer is identified or the work is handed off
---
@include .agents/skills/platform/contract-base.xml
```

## P0/P1 Workflow Controls

- Accept optional `operationId`/`idempotencyKey`, `fixedPoint`, and explicit scope; reject conflicts outside that scope.
- `dryRun` computes conflict inventory and compensation plan without writing files, staging, committing, or pushing. Approval is separate for each mutation.
- Persist a common snapshot and checkpoints before resolution, after each file group, and after validation; include exact command evidence.
- On crash or unknown git result, reconcile index, worktree, branch, and fixed point before retrying. Never repeat an uncertain merge or commit blindly.
- Terminal statuses are `planned`, `completed`, `blocked`, `needs-approval`, `outcome-unknown`, `validation-failed`, and `rolled-back`; rollback restores only operation-owned changes.
