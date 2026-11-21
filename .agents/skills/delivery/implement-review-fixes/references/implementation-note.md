# Implementation Note — Canonical Completion Shape

Post one completion comment after the plan's findings have terminal results. The
comment is the handoff artifact that the next `review-pr` pass reads.

```markdown
## Review Fix Implementation

- Status: implemented | partially-implemented | blocked | needs-approval
- PR: #<number>
- Plan: <link or digest of the `## Review Fix Plan` comment>
- Fixed point: <commit sha or ref>
- Implementation artifact: <path or response reference>

### Finding Results

| Finding | Result | Evidence | Notes |
|---|---|---|---|
| S1 | applied | `node --test tests/limits.test.mjs` | — |
| S2 | deferred | — | requires schema migration; owner: <name> |
| S3 | outcome-unknown | retry after reconcile | checkpoint recorded |

### Validation

- Commands run: <exact commands>
- Tests: <passed / failed / skipped with counts>
- Checks skipped: <name and reason>
- Coverage / mutation / security evidence: <result or not-run with reason>

### Scope Notes

- Files changed: <paths>
- Files intentionally untouched: <paths>
- Scope changes or plan deviations: <none | description>

### Blockers

- <blocker, owner, and next action, or "none">

### Next Consumer

- review-pr (re-review the same fixed point)
```

## Rules

- Report every finding exactly once with a terminal result: `applied`, `deferred`,
  `validation-failed`, or `outcome-unknown`.
- Never claim `applied` from a transcript or self-attestation; include the command
  and observed result.
- Disclose skipped checks and partial suites. They cannot produce `completed`.
- If a finding could not be applied because the plan is stale or the branch is
  conflicted, say so and route to `plan-review-fixes` or
  `resolving-merge-conflicts`; do not improvise around the plan.
- Record the checkpoint key (`planDigest + findingId + fixedPoint`) for any
  `outcome-unknown` result so a retry can reconcile instead of repeating.
