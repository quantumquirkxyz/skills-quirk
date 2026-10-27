# Internal Documentation Maintenance

This guide describes how to update repository-internal documentation without changing the public README or generated skill projections.

## Sources of truth

1. Read the root `AGENTS.md` and `.agents/AGENTS.md` before editing.
2. Read [Agent Skills Index](index.md) for governance routing and [Skill Conflict Matrix](conflict-matrix.md) when multiple skills match.
3. Use [Work Item Format](work-item-format.md) for specs, tickets, and PR metadata; preserve existing tracker values.
4. Treat `.agents/skills/` as canonical and `.claude/skills/` as generated compatibility links. Never edit generated projections by hand.
5. Follow [Generated Views](../../how-to/generated-views.md) when canonical registry or skill content changes.

## Documentation-only change procedure

1. Inventory affected Markdown files and trace links relative to the containing file.
2. Confirm each destination exists on the target branch; do not replace a broken link with an assumed path.
3. Keep prose consistent with [quirk Method](../../explanation/quirk-method.md), [Provenance](../../explanation/provenance.md), and [Skill Style Guide](../../how-to/skill-style.md).
4. Scope changes to internal documentation; do not modify `README.md`, canonical skills, lockfiles, or generated files unless the task explicitly expands scope.
5. Review diffs for stale names, duplicate guidance, malformed relative paths, and unsupported claims.
6. Run `node .agents/skills/platform/check-all.mjs` in a checkout before claiming the full repository gate passed. If unavailable, report validation as not run.

## Commit discipline

Use focused English commits, for example `docs: add internal maintenance guidance` and `docs: link maintenance guide from agent index`. Preserve reviewable history and avoid unrelated changes.
