# Review Fix Plan — Canonical Comment Shape

Use this shape for the PR comment that `implement-review-fixes` executes. One plan
per review pass. Keep the two axes separate; never collapse Standards and Spec
into a single severity ranking.

```markdown
## Review Fix Plan

- Status: planned
- PR: #<number> (<head> → <base>)
- Fixed point: <commit sha or ref>
- Review source: <review-pr run / command, or "conversation output">
- Plan digest: <sha256 of this comment body, once finalized>

### Standards

No planned fixes

### Spec

- [ ] S1 — <finding summary>
  - Source: <file:line | rule | spec section>
  - Target: <file or symbol>
  - Fix: <smallest change that resolves the finding>
  - Validate: <command or observable check>
  - Blocker: <yes|no>

### Deferred / Not Actionable

- <finding> — <why it is not in this plan; who owns it>

### Scope Guard

- Files this plan may touch: <paths>
- Out of scope: <paths or behaviors>
- Next consumer: implement-review-fixes
```

## Rules

- Blockers first: spec correctness, failing behavior, hard standards, then design smells.
- Each checklist item must be independently implementable and verifiable.
- A partially fixed finding stays only if the remaining gap is actionable and testable.
- If an axis has no findings, keep the heading and write `No planned fixes`.
- Do not include advisory findings unless they must land before `ship-subissue`.
- If a `## Review Fix Plan` comment already exists, post a superseding comment
  that links the earlier one instead of duplicating items.
- Post multi-line comments with `gh pr comment <number> --body-file <file>`.

## Good / Bad Examples

Good item:

```markdown
- [ ] S1 — `parseLimit` accepts negative values
  - Source: src/api/limits.ts:41 (review-pr, Standards)
  - Target: `parseLimit`
  - Fix: reject values < 1 and return a typed error
  - Validate: `node --test tests/limits.test.mjs`
  - Blocker: no
```

Bad item (not executable):

```markdown
- [ ] Clean up the validation layer and make it more robust
```
