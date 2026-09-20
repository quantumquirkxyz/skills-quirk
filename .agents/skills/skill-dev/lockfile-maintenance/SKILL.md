---
name: lockfile-maintenance
category: skill-dev
maturity: stable
version: 1
description: Maintain the skills lockfile by detecting missing, stale, extra, or mismatched skill entries and updating hashes only after the corresponding SKILL.md files are resolved.
capabilities:
  - detect lockfile drift
  - update skill content hashes
  - reconcile missing and extra lock entries
  - validate lockfile consistency
outputs:
  - Lockfile maintenance report with changed entries, removed entries, hash evidence, and validation command results
sideEffects:
  - update-lockfile
dependencies:
  - skill-quality-gate
stopCondition: Lockfile entries match the current skill tree or every drift item has a stated blocker and recommended repair.
risk: low
trustTier: 2
maxIterations: 5
---

## Operating Contract

- **Input:** current skill tree, `skills-lock.json`, and the set of intended skill additions, moves, deletions, or edits.
- **Output:** lockfile maintenance report listing added, updated, removed, and unchanged entries plus validation evidence.
- **Side effects:** update the lockfile only; do not edit skill behavior while performing lock maintenance.
- **Dependencies:** use `skill-quality-gate` after lockfile changes so structural drift does not pass unnoticed.
- **Stop condition:** the lockfile reflects the current canonical skill set, or unresolved drift is isolated with exact paths.
- **Risk:** low because the lockfile is metadata, but incorrect hashes can hide real skill drift.
- **Boundary:** do not normalize, rewrite, or reorder unrelated repository files while maintaining the lockfile.

## Rules

- Rule: enumerate canonical `SKILL.md` files from `.agents/skills` before changing lock data.
- Rule: distinguish content hash drift from path drift, missing entries, and deleted skill entries.
- Rule: update hashes from the exact bytes currently in each `SKILL.md`; do not hash rendered excerpts or generated summaries.
- Rule: remove lock entries only when the corresponding skill path is intentionally absent and no symlink still points to it.
- Rule: preserve existing lockfile schema, indentation, and stable ordering unless the repository's maintenance script defines a different order.
- Rule: prefer `scripts/update-lockfile.mjs` for canonical bundle lock refreshes; inspect its dry-run output before committing changes.
- Rule: run the repository validator after lock updates and report the command, exit status, and any warning.
- Rule: if a lock update follows skill edits, include both the edited skill names and the resulting lock entries in the summary.

## Workflow

1. Read the lockfile and list canonical skill files.
2. Compare lock entries to the filesystem by skill name, path, and hash.
3. Classify drift as missing entry, stale hash, extra entry, moved skill, duplicate name, or malformed metadata.
4. Apply the smallest lockfile change that reconciles the intended tree.
5. Validate the full skill bundle using the repository's available validation commands.
6. Summarize every lockfile mutation and cite remaining drift, if any.

## Script

Use `scripts/update-lockfile.mjs` from this skill directory to reconcile the canonical skill tree with `skills-lock.json`.

```bash
node .agents/skills/skill-dev/lockfile-maintenance/scripts/update-lockfile.mjs --dry-run
node .agents/skills/skill-dev/lockfile-maintenance/scripts/update-lockfile.mjs --write
```

The dry run reports added, updated, and removed lock entries without changing files. The write mode preserves the lockfile schema, sorts skill names, and writes hashes from the exact current `SKILL.md` bytes.

## Completion Criteria

- every canonical skill has a lock entry with a current hash
- deleted or moved skills are reflected intentionally
- validation commands ran and their result is reported
- unrelated lockfile churn is avoided
- remaining drift, if any, includes exact skill names and paths
