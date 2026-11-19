# Skill Output Integration Contract (Pilot)

Status: experimental. This guide is additive and does not supersede canonical domain schemas or existing skill-local templates.

## Source of truth

- Preserve `schemas/software-engineering/*.schema.json` artifacts and their lifecycle statuses. Do not replace them with execution-result statuses.
- For presentation only, map the canonical artifact through `normalizeLifecycleArtifact` in `scripts/normalize-skill-artifact.mjs`.
- Validate the resulting presentation record with `validateSkillOutput` and render it using `renderSkillOutput`.
- Preserve the complete canonical artifact separately for downstream consumers. A Markdown rendering is not a lossless serialization.
- Never infer test results, approvals, fixed points, source digests, or provenance from a generated summary.

## Pilot route

| Skill | Canonical output | Presentation target | Verification |
| --- | --- | --- | --- |
| `to-spec` | Spec issue and associated work-item metadata | GitHub issue | Acceptance criteria, source issue, non-goals |
| `to-tickets` | Ticket artifacts | GitHub issues | Traceability to spec and dependencies |
| `review-pr` | VerificationArtifact with Standards/Spec axes | PR review/comment | Exact diff fixed point and both axes |
| `plan-review-fixes` | Review repair plan | Markdown or issue | Finding IDs and intended remedy |
| `implement-review-fixes` | Implementation/verification evidence | PR progress | Actual checks, skipped reasons |
| `publish-open-pr` | PR body and validation report | GitHub PR | Linked work, validation, rollback |
| `ship-subissue` | Completion and handoff artifacts | Issue/PR progress | Approval and merge evidence |

This is a mapping specification, **not** a claim that each skill has been migrated.

## Publication safety

1. Generate a preview by default; remote writes require explicit approval.
2. Bind each operation to a stable `target` and `idempotencyKey` scoped to the repository.
3. Implement `findByKey`, `create`, and `update` with authenticated provider APIs and a per-key concurrency guard.
4. On timeouts or ambiguous errors, reconcile the remote state before retrying. Do not blindly duplicate comments.
5. Respect rate limits, permission failures, and cancellation; do not retry authentication/authorization failures.
6. Keep credentials and secret-bearing tool responses out of Markdown and logs.

The generic `publishSkillOutput` helper deliberately does **not** provide a production GitHub client or concurrency lock. These must be implemented and tested before enabling automated publication.

## Review gates

- `node --test tests/skill-output.test.mjs tests/skill-publication.test.mjs`
- `node .agents/skills/platform/check-all.mjs`
- `npm test`
- Compare generated issue, PR, and review Markdown with existing skill-local templates and behavioral fixtures.
- Rebuild generated skill registry and lockfiles only if canonical `SKILL.md` files change.

## Migration rule

Migrate one pilot skill at a time. Retain existing skill-local templates and authoritative schemas, add adapter tests, then compare the old and new output against a golden fixture. A failed or skipped verification cannot become a clean success. Only expand to the next skill after the pilot meets these gates.
