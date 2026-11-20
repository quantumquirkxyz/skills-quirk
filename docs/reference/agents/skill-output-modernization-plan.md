# Skill Output Contract and Modernization Plan

Status: implementation in progress; baseline: main, 2026-11-19. The release acceptance gate remains open; not all skills have been migrated.

## Scope and evidence
- Historical baseline: 286 SKILL.md files under .agents/skills, across 39 category directories, from the initial main-tree snapshot. The feature branch recursive Git tree currently contains 285 canonical SKILL.md files; the live inventory command is authoritative for its checked-out revision. Reconcile the one-entry delta before release.
- Reuse .reports/skills-deep-audit-2026-11-16.md; validate its observations against current files before applying edits.
- Preserve AGENTS.md rules: canonical skill files are authoritative; generated .claude/skills views and skills-lock.json are regenerated, not edited manually.
- Existing contracts include schema/skill-run.schema.json, schemas/software-engineering/*.schema.json, and docs/reference/agents/work-item-format.md.
- Existing CI: .github/workflows/skills-ci.yml runs check-all, semantic drift, conflict, provenance, behavioral fixtures, and scenario routing.

## Decision: separate semantics from presentation
Use a versioned canonical result envelope, with typed payloads owned by each skill/domain. Render the same validated result to GitHub issue bodies, PR bodies, comments, Markdown files, and JSON without changing meaning. Avoid forcing prose-only skills into a generic technical report. Preserve existing VerificationArtifact, TicketArtifact, and work-item metadata as specialized payloads, rather than replacing them.

Proposed common fields:
- schemaVersion, artifactType, artifactId, operationId, status (success | partial | blocked | failed | cancelled | unknown), title, summary;
- sourceRefs (issue/PR/commit/spec and digests where available), scope, assumptions, decisions, findings, evidence, validation (commands, pass/fail/skipped, reasons), risks, nextActions, generatedAt;
- payload (skill-owned typed schema), provenance (tool/model/prompt version and run trace where available), publication (target and idempotency key).
Never invent source references, test outcomes, reviewer approval, or confidence. A skipped check cannot be silently represented as a pass. Separate machine-readable data from human-readable views.

## Human-readable rendering rules
- Issue: Problem, Context, Scope/Non-goals, Acceptance criteria, Dependencies, Evidence, Risks, Definition of Done.
- PR: Summary, Linked work, Change list, Validation (passed/failed/skipped), Risk and rollback, Review checklist.
- Review comment: Finding (severity and axis), exact file/line or source, evidence, impact, suggested remedy, verification; keep Standards and Spec axes distinct.
- Progress comment: Status, completed, blocked, next action, trace/reference. Update an existing bot-owned progress comment where feasible to avoid duplicates.
- File: frontmatter/metadata, purpose, source refs, decisions, detailed payload, validation, next steps. JSON is authoritative for structured artifacts; Markdown is a deterministic view.
- Render only relevant sections; do not emit empty headings or template placeholders. Use English for repository-managed content and Conventional Commit messages.

## Phased execution
### Phase 0: baseline and coverage
1. Build a machine-readable inventory of all canonical skills, ownership, side effects, trust tiers, output destinations, schema references, fixtures, and dependencies.
2. Compare the November 16 audit against current content. Classify confirmed defects vs inferred gaps, with path/line evidence.
3. Capture the pre-change output of check-all, npm test, audit:spec, fixture and routing checks; preserve failures separately from regressions.
Exit: 100% inventory; prioritized findings and baseline gate results.

### Phase 1: output contract
1. Specify and version the common envelope and renderer mappings, with backward compatibility for existing domain schemas.
2. Add schema fixtures: valid, missing evidence, malformed status, skipped validation, duplicate publication, and hostile Markdown injection.
3. Add renderer golden tests for issue, PR, review comment, progress comment, Markdown file, and JSON.
Exit: schemas and renderers validate deterministically; compatibility tests pass.

### Phase 2: pilot integrations
1. Pilot to-spec, to-tickets, review-pr, plan-review-fixes, implement-review-fixes, publish-open-pr, ship-subissue, and one read-only research skill.
2. Ensure GitHub-native metadata stays native, not duplicated or fabricated in Markdown.
3. Require source commit pinning, safe Markdown escaping, size limits, idempotent publication, approval gates, and explicit failures.
Exit: end-to-end issue-to-PR fixture passes; no unauthorized remote writes.

### Phase 3: targeted skill hardening
1. Prioritize high-risk side-effecting and workflow-central skills; verify permissions, timeouts, retries, idempotency, cancellation, recovery, and independent verification.
2. Fix documented contract conflicts (for example skill-style trust-tier examples vs declared review-pr tier) based on actual side effects.
3. Add negative/adversarial fixtures before broad skill rewrites; preserve domain-specific outputs and avoid mass template changes without proof.
Exit: zero unresolved P0/P1 issues; affected behavioral and security tests pass.

### Phase 4: staged migration
Migrate remaining skills by domain in small reviewable changes, update registry and lockfile only through scripts, and keep backward compatibility until consumers are migrated. Record per-skill before/after fixture results and release notes.
Exit: 100% skills classified and mapped to output contracts; every changed skill has passing tests.

### Phase 5: publication and regression control
Use small English Conventional Commits (docs:, test:, feat:, fix:, refactor:) on feature branches. Require pull-request CI and independent review before merging into main. A main update must have a traceable English commit message (merge/squash commit included). If any check fails, fix on the branch and rerun; do not declare success or merge with failed/unknown gates. Post-merge monitor main CI and revert or repair regressions with a new English commit.

## Engineering references
- Agent Skills specification: https://agentskills.io/specification
- GitHub Actions security: https://docs.github.com/en/actions/security-for-github-actions/security-guides/security-hardening-for-github-actions
- GitHub pull request templates: https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests
- Conventional Commits: https://www.conventionalcommits.org/en/v1.0.0/
- OWASP LLM/agent guidance: https://genai.owasp.org/
- Existing project references: docs/how-to/skill-style.md, docs/reference/agents/skill-templates.md, .reports/skills-deep-audit-2026-11-16.md.

## Non-goals and constraints
No direct untested mass rewrite of all skills. No automatic merge to main before CI verification. No claims of full behavioral verification from static inspection alone. No editing generated compatibility files by hand.

## Current implementation evidence and acceptance gaps

The feature branch provides a canonical-skill inventory and classification,
a validated presentation envelope, deterministic renderers, a read-only
eight-skill pilot CLI, GitHub comment ownership and idempotency safeguards,
a local-host cross-process publication coordinator, and a simulated
spec-to-review publication fixture. None of these components modifies
canonical skills automatically or authorizes a merge.

| Phase | Evidence available | Acceptance still required |
| --- | --- | --- |
| 0 | Inventory script, classification tests | Audit reconciliation and recorded baseline gate results |
| 1 | Envelope schema, renderer and regression tests | Full six-surface golden coverage and compatibility proof |
| 2 | Eight-skill read-only presentation pilot and e2e fixture | Canonical producer integration and true issue-to-PR workflow fixture |
| 3 | Marker collision checks and local-host lock | P0/P1 closure, multi-host fencing if multi-host publication is enabled |
| 4 | Coverage checker and migration status reporting | Evidence-backed mapping and tests for every canonical skill |
| 5 | Existing PR CI and explicit release gate | Independent review, all gates on final head, user-approved merge and post-merge checks |

Do not change `migrationStatus` to `mapped-and-verified` without a
recorded schema/fixture check for that skill. The strict gate
`node scripts/check-skill-output-coverage.mjs --require-mapped --evidence tests/skill-output-migration-evidence.json` must
pass before claiming the catalog-wide migration complete.

## Evidence-first migration tooling

Run `npm run output:migration-backlog` to generate a deterministic,
risk-prioritized task for every canonical skill. Candidate contract paths
are suggestions, not verified mappings. P1 includes side-effecting and
high-risk skills; P2 includes skills missing output declarations; P3
contains the remaining skills.

The `--require-mapped --evidence` release gate verifies exact canonical
and test fixture SHA-256 digests. `npm run output:verify-fixtures -- FILE`
also executes each pinned Node test file, failing on incomplete coverage,
digest drift, fixture failure, or timeout. This is intentionally stricter
than a frontmatter declaration. The actual evidence manifest must be
populated through completed migrations and real passing tests; no placeholder
manifest is accepted as completion. A reviewer must independently verify
side effects, permissions, trust boundaries and consumer compatibility.
