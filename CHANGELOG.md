# Changelog

All notable changes to `quirk Skills` are recorded here.

This project follows semantic versioning once releases are cut:

- `MAJOR` for breaking workflow or artifact contract changes.
- `MINOR` for new skills, new validators, new scenarios, or compatible workflow extensions.
- `PATCH` for documentation fixes, template clarifications, and non-breaking validator fixes.

## [2.4.0] - 2026-10-10

Wave 3 — time-travel over workflows, a memory layout convention, and opt-in signed agent cards.
Three implementation streams landed concurrently and were integrated on `main`.

### Added

- **Workflow checkpoint journal, replay, and fork** (`workflow-state-machine.mjs`) — every
  state-changing command appends a record to
  `.agents/skills/platform/checkpoints/<workflow>.jsonl`, and `replay` walks that journal from
  the beginning to re-derive each decision from the persisted snapshot plus the event log, so a
  run that is restored from state alone reproduces the same guards, the same legal move set, and
  the same history. `fork` starts a new branch from any recorded checkpoint instead of editing
  history in place. Replay-stability verification compares the replayed decisions with the
  recorded ones and reports drift as a failure rather than silently accepting it. A run that
  predates the journal replays as `no-journal` and names the snapshot that stays authoritative.
  The journal is created on demand by the tool and is tracked in git via `.gitkeep`.
- **`memory-index.mjs` + T0/T1 memory layout convention** — a root `MEMORY.md` index over a
  memory tree: root files are T0 (always loaded, with a one-line purpose each), every
  subdirectory is T1 (loaded only when its pointer is followed) and must either carry its own
  `MEMORY.md` or be listed in the root index as unindexed. `build` writes or refreshes the
  generated region between `<!-- memory-index:begin -->` and `<!-- memory-index:end -->`
  markers, preserving everything a curator writes below them; `check` validates the tree and
  reports findings (unindexed root file, orphan index entry, subdir-unaccounted, unbalanced
  markers, token and index-line budget breaches). The convention ships with the bundle as
  documentation and a validator only — it never creates or implies a runtime memory store.
- **Opt-in Ed25519-signed A2A agent cards** (`scripts/generate-agent-cards.mjs`) — signing
  follows the A2A v1.0 protocol: the card is canonicalized with an RFC 8785 subset
  (recursive key sort, no insignificant whitespace, implemented with JSON only — no external
  dependency), the canonical bytes are signed with Ed25519, and the base64url signature is
  embedded as `metadata.signature = {alg, keyId, value, canonicalization, signedAt}`.
  Verification re-canonicalizes the card *without* the signature field, so a re-serialized or
  key-reordered card still verifies while any tampered field fails and names the card. Keys are
  generated with `--gen-key` and are only ever written to explicitly given paths; no key material
  lands in the repository. Default generation remains unsigned and byte-identical, so the
  checked-in corpus never gains a signature field by accident. Trust is by fingerprint: a
  verifier compares `keyId` (`sha256:<16 hex>` of the public key) against a fingerprint it
  already trusts, never against a signature that merely parses.
- **Signed-workflow documentation in `agent-card`** — the skill body documents the signing
  workflow (key generation, `--sign`, `--verify`, trust-by-fingerprint) and states that signing
  is opt-in and that an unsigned card is not a broken card.

### Changed

- `check-all.mjs` registers `memory-index.mjs check .agents/memory` as a report-only check that
  reports `status: skip` with a reason when no memory directory exists, following the same skip
  pattern the gate already uses for `dag-scheduler.mjs`.
- npm scripts `memory:index`, `memory:check`, and `checkpoints:replay` expose the new tools.

### Fixed

- `check-all.mjs` no longer declares a check whose command list is built after the array that
  spreads it, so the gate starts instead of failing on a temporal-dead-zone `ReferenceError`.
- `tests/generate-agent-cards.test.mjs` regenerates cards inside a throwaway corpus copy
  instead of wiping and rewriting the tracked `agent-cards/` directory in place, which raced
  with any concurrent suite reading the same cards (reproduced as an `ENOENT` on
  `agent-cards/README.md` and a missing `delivery-code-review.json` when the two required
  `node --test` commands ran in parallel).

### Validation

```bash
node .agents/skills/platform/check-all.mjs            # status pass, 10/10 gating checks, 0 errors, 73 warnings (68 + 5), 4 report-only, 2 skipped with reason
node .agents/skills/platform/validate-skills.mjs      # 246 skills, 0 errors, 68 advisory warnings
node .agents/skills/platform/audit-semantics.mjs      # 258 skills, 5 load-bearing heuristic warnings, 0 errors
node .agents/skills/platform/security-scanner.mjs     # pass, 0 findings
node .agents/skills/platform/security-scan-skills.mjs # clean, 0 findings
node .agents/skills/platform/security-scan-skills.mjs --strict  # clean, 0 findings
node .agents/skills/platform/validate-spec-compliance.mjs  # 258 skills, 0 errors, 0 warnings, bodies within 500 lines
node .agents/skills/platform/validate-traceability.mjs     # exit 0 - 60 clauses, 3 resolved, 50 manual, 7 pending, 0 errors
node evals/run-routing.mjs --check                    # 10 fixtures, 151 rows, 41 negative controls, 0 errors
node evals/run-behavioral.mjs --all                   # 5 fixtures, 0 broken schema, 0 crashed (mock judge)
node --test tests/*.test.mjs                          # 6/6 pass
node --test .agents/skills/platform/tests/*.test.mjs  # 211/211 pass
node .agents/skills/platform/quality-scorer.mjs --minimum-score 60  # pass
node .agents/skills/platform/dependency-graph.mjs     # 246 skills, 1 dependency edge, 0 cycles
node .agents/skills/platform/skill-graph.mjs build    # 246 nodes / 60 edges (depends-on 1, compatible 49, handoff 10)
node .agents/skills/platform/skill-lab.mjs cost       # report, exit 0
node .agents/skills/platform/context-budget-auditor.mjs  # report, exit 0
node .agents/skills/platform/workflow-state-machine.mjs replay standard-feature  # no-journal (legacy run: snapshot in state/ stays authoritative)
node .agents/skills/skill-dev/lockfile-maintenance/scripts/update-lockfile.mjs --dry-run  # clean, 258 entries, foundation/agent-card relocked
```

Remaining advisory backlog (never blocks the general gate; blocks promotion): 68 medium/high-risk
skills still lack a `behavioral-fixtures` directory, 5 skills carry the load-bearing-position
heuristic warning, and 7 `evals/behavioral` fixtures are not yet landed, so their clauses are
recorded as `pending` warnings by the traceability validator.

## [2.3.0] - 2026-10-10

Wave 2 — guard-gated workflows, idempotent side effects, graph routing, and spec alignment.
Four implementation streams landed concurrently and were integrated on `main`.

### Added

- **Guard-gated workflow transitions** (`workflow-state-machine.mjs`) — a guard is a transition
  predicate, not a prompt instruction: declared per state as `guards: {EVENT: "<expression>"}`
  keyed by the leaving event, and evaluated by a small recursive-descent interpreter
  (no `eval`, no `Function`) over `==`, `!=`, `>=`, `<=`, `>`, `<`, `&&`, `||`, `!`, parentheses,
  string/number/bool literals, dotted context paths, and `len(array) >= n`. Unresolved context
  paths fail closed, so a guard over missing context rejects the event instead of opening it.
  A rejected event returns `{ok:false, reason:"rejected-by-guard", event, legalEvents, guard}`
  with exit code 2, records the rejection plus the remaining legal move set in the state history,
  and re-offers the legal alternatives to the caller. Guards are pure functions of
  (state, context), so a persisted snapshot plus the event log replays to identical decisions.
  The four workflow YAMLs declare the guards and their `context:` defaults; persisted context is
  merged over the YAML defaults on load, so snapshots written before a workflow declared defaults
  still evaluate against a complete context.
- **`platform/idempotency.mjs`** — write intent before executing the effect, commit the outcome
  after: an append-only ledger of intents with claim → execute → commit outcome states,
  re-entrant claim detection, and no silent re-execution of a side effect. Paired with a new
  **effect-sandwich clause** in `contract-base.xml` so any mutating skill records its side effects
  on both sides of the effect.
- **`skill-graph.mjs` + graph-driven routing** — materializes the edges implicit in the flat bundle
  (`dependencies` → depends-on, `compatibility` → compatible, body handoffs → handoff, shared
  capability tokens → capability) and ranks over them with a two-tier scheme: tier-1
  exact/keyword seed hits always outrank tier-2 Personalized PageRank neighborhood activation
  (HippoRAG specificity `1/df(token)` as local IDF; HippoRAG 2's regression on pure-graph retrieval
  is why tier 1 stays primary). `rank`, `neighbors`, and `--compare` commands, plus a `--graph`
  flag on `work-item-router`. The built artifact lives at
  `.agents/skills/platform/graph/skill-graph.json` (246 nodes / 60 edges).
- **`skill-optimizer` skill** — a propose-only GEPA-style reflective loop over a skill's
  model-facing description against routing fixtures: emits a diff-shaped proposal carrying
  `(skill, version, fixture)` evidence, and the human applies it. Never edits bodies, metadata,
  or the lockfile.
- **`analyze-artifacts` skill** — a read-only cross-artifact analyzer for one work item's spec,
  plan, and tickets: reports conflicts, gaps, ambiguities, and dead references, each marked
  `[NEEDS CLARIFICATION]` when the artifacts alone cannot resolve it.
- **Spec-checklist + `[NEEDS-CLARIFICATION]` markers in `to-spec`** — a checklist reference and
  explicit markers instead of invented answers when input is missing.
- **`validate-spec-compliance.mjs`** — an agentskills.io spec-alignment validator over the six
  spec-portable frontmatter fields (`name`, `description`, `license`, `compatibility`,
  `metadata`, `allowed-tools`), a 500-line body-length budget, and a documented divergence note
  for the bundle's own extensions. Registered in CI, npm (`audit:spec`), and `check-all.mjs`
  as a report-only check.

### Changed

- **`license: MIT` on every skill** — 258 SKILL.md files now declare the spec-portable license
  field (239 quoted, 19 plain, matching each file's local frontmatter dialect).
- **`knowledge-curator` and `docs-management`** — memory and knowledge conventions, including
  commit-boundary discipline (what belongs in a commit versus in working memory) and
  flag-and-excise handling that marks stale durable context for removal instead of
  quietly rewriting it.
- **`review-fix-loop`** — a deferred-work section so out-of-scope findings are recorded instead
  of silently dropped.
- **Counts and projections** — the bundle is now 246 consumer-facing skills (plus the 12 platform
  skills, 258 in the repository); `CATALOG.md`, `llms.txt`, `.claude-plugin/marketplace.json`, and
  `site/src/skills.json` regenerated, and `tests/projection-consistency.test.mjs` re-pinned
  from 244/256 to 246/258.
- **`check-all.mjs`** — report-only registrations for the spec-compliance validator and the
  skill-graph build (following the context-budget-auditor pattern), with the graph's node count
  surfaced in the report detail.
- **CI (`.github/workflows/validate.yml`)** — new spec-compliance and skill-routing-graph steps;
  npm scripts `audit:spec` and `graph:skills`.
- **Version unification**: 2.3.0 in `VERSION`, `package.json`, `registry.yaml` (`version` +
  `bundleVersion`), and the README badge.

### Fixed

- **`tests/delegation-brief.test.mjs`** — the frontmatter guard's sanctioned exception list now
  covers the wave-2 `license` key alongside the wave-1 `clauses` / `reloadPolicy` keys, so the
  two body-only skills could take the license field without tripping the pin (17/17 pass).
- **`tests/workflow-state-machine.test.mjs`** — the state-machine tests ran against the ambient
  `.agents/skills/platform/state/` directory, rewriting (and briefly deleting) a tracked runtime
  artifact on every suite run — a known side effect recorded in
  `.opencode/orchestrator/learnings.md`. Each test now gets its own state directory through the
  environment override the machine documents, so the ambient state is never written by tests.
- **`record-execution.mjs` trace timestamps** — the default `execution` argument took two
  independent clock reads for `startedAt`/`completedAt`, so under load the pair could straddle a
  millisecond boundary and `durationMs` (derived from the same pair) disagreed with the recorded
  timestamps. The default pair now comes from a single read; caller-supplied timestamps are
  untouched. This was an intermittent failure of `telemetry.test.mjs` under a loaded full-suite run.
- `skills-lock.json` re-locked at 258 entries (2 new skills, 256 refreshed hashes); the
  stale-hash backlog in `validate-skills.mjs` / `audit-semantics.mjs` is back to zero.

### Validation

```bash
node .agents/skills/platform/check-all.mjs            # status pass, 10/10 gating checks, 0 errors, 73 warnings (68 + 5), 4 report-only, 1 skipped with reason
node .agents/skills/platform/validate-skills.mjs      # 246 skills, 0 errors, 68 advisory warnings
node .agents/skills/platform/audit-semantics.mjs      # 258 skills, 5 load-bearing heuristic warnings, 0 errors
node .agents/skills/platform/security-scan-skills.mjs # clean, 0 findings
node .agents/skills/platform/security-scan-skills.mjs --strict  # clean, 0 findings
node .agents/skills/platform/validate-spec-compliance.mjs  # 258 skills, 0 errors, 0 warnings, bodies within 500 lines
node .agents/skills/platform/validate-traceability.mjs     # exit 0 - 60 clauses, 3 resolved, 50 manual, 7 pending, 0 errors
node evals/run-routing.mjs --check                    # 10 fixtures, 151 rows, 41 negative controls, 0 errors
node evals/run-behavioral.mjs --all                   # 5 fixtures, 0 broken schema, 0 crashed (mock judge)
node --test tests/*.test.mjs                          # 6/6 pass
node --test .agents/skills/platform/tests/*.test.mjs  # 176/176 pass
node .agents/skills/platform/quality-scorer.mjs --minimum-score 60  # 82/100 (skill-creator)
node .agents/skills/platform/dependency-graph.mjs     # 246 skills, 1 dependency edge, 0 cycles
node .agents/skills/platform/skill-graph.mjs build    # 246 nodes / 60 edges (depends-on 1, compatible 49, handoff 10)
node .agents/skills/skill-dev/lockfile-maintenance/scripts/update-lockfile.mjs --dry-run  # clean, 258 entries
```

Remaining advisory backlog (never blocks the general gate; blocks promotion): 68 medium/high-risk
skills still lack a `behavioral-fixtures` directory, 5 skills carry the load-bearing-position
heuristic warning, and 7 `evals/behavioral` fixtures are not yet landed, so their clauses are
recorded as `pending` warnings by the traceability validator.

## [2.2.0] - 2026-10-10

Wave 1 — behavioral evidence, loop budgets, and traceability. Six work streams landed
concurrently and were integrated on `main`.

### Added

- **Behavioral eval harness** (`evals/`) — Layer 1 of the evaluation stack, kept strictly
  separate from Layer 0 structural gates. `evals/run-routing.mjs --check` scores trigger rate
  against 10 routing CSV fixtures (151 rows, 41 negative controls) with a
  `--record` mode and an adjacent-skill confusion matrix;
  `evals/run-behavioral.mjs --all` scores paired with/without-skill runs with a pluggable
  judge (`evals/judge/grader.md` + `judge.config.json`), deterministic assertion kinds, and a
  mock fallback that is labelled as smoke-test-only. Both runners are wired into CI and npm.
  The full protocol is captured in `.agents/skills/skill-dev/references/paired-eval-protocol.md`
  (fresh session per case, pinned model snapshot, author-in-another-session, held-out split,
  analyst pass for non-discriminating assertions, record the triple, deterministic before judge).
  Paired with/without fixtures for `code-review`, `evaluate-skill`, `implement`, `skill-audit`,
  `to-spec` land as `evals/behavioral/*.json`.
- **`loop-runner.mjs`** — a typed agent-loop runner: `stepLimit`, `costLimit`, `maxConsecutiveFormatErrors`,
  `repeatThreshold`, wall-clock budget, degenerate-loop detection (identical action+result repeats,
  ping-pong), an append-only hashed ledger, escalating nudges (warning → backoff → block), and typed
  exits (`completed`, `limits-exceeded`, `format-errors`, `repeat-threshold`, `ping-pong`).
- **`contract-base.xml` ACI rejection policy** — a malformed artifact returns to the agent as a
  structured reason (`{artifactType, schemaErrors[], attempt}`) rather than a discarded run, citing
  the SWE-agent agent-computer-interface retry guardrail.
- **`delivery/loop-budget` skill** — declares step/cost/wall-time budgets up front and ends a loop
  with a typed verdict instead of a runaway process.
- **Contract-clause traceability** — `clauses` (stable ids such as `TO-SPEC-1`) plus `reloadPolicy`
  in SKILL.md frontmatter, a new `validate-traceability.mjs` gate (rules a–f), a CI step, and a
  `reloadPolicy` of `always` for the four governance skills (`work-item-router`, `ask-to`,
  `publish-open-pr`, `ship-subissue`). 16 critical skills declare 54 clauses.
- **`dag-scheduler.mjs`** — ticket DAG scheduling into waves, plus the FLOW over-coupling linter
  (redundant-transitive-edge detection and fan-in limits).
- **`context-budget-auditor.mjs`** — measures the L1 (always-loaded) token budget per domain and
  per skill (11,121 tokens across 256 skills today), with `--compare` against a stored snapshot
  and a long-description truncation warning.
- **`cost-ledger.mjs`** + `cost-model.json` — per-skill run, duration, token and estimated cost
  aggregation that reports **unknown** whenever tokens or tier are unmeasured, never a fabricated
  zero or price.
- **`security-scan-skills.mjs`** — a deterministic skill supply-chain scanner (no moderation model
  in the loop) with a `--strict` mode, a malicious-sample fixture corpus, and a promoter gate.
  Clean on the real bundle: 0 findings.
- **`schemas/delegation-brief.schema.json`** + **`foundation/verify-delegation` skill** — a
  delegation brief declares objective, output format, tool guidance, boundaries, stop condition,
  effort budget, context isolation, and read-only intent; a verdict must evidence every criterion,
  record the negative tests run, and run the full suite before it may pass.
- **OWASP agentic checklist** in `side-effect-auditor` — side effects mapped against the OWASP
  Agentic Top 10 / Agentic Skills Top 10 before a mutating skill is recommended for promotion.
- **`skill-promoter` gate** — the deterministic supply-chain scan blocks promotion.

### Changed

- **Version unification**: 2.2.0 in `VERSION`, `package.json`, `registry.yaml` (`version` +
  `bundleVersion`), and the README badge; `CATALOG.md`, `llms.txt`, `.claude-plugin/marketplace.json`
  and `site/src/skills.json` regenerated at 244 bundle skills.
- **`audit-semantics.mjs` load-bearing heuristic** — warns (never fails) when more than half of a
  skill's hard prohibitions and Guardrails/Rules body lines sit past line 150, because compaction
  keeps only the start of a re-injected skill body. The five currently affected skills are documented
  in the validation report below.
- **`check-all.mjs`** — gained report-only sections for the context budget auditor and cost ledger,
  and a conditional DAG gate that skips with a stated reason when no default ticket DAG exists.
- **`skill-lab.mjs`** — `cost` subcommand and the new scripts (`evals:routing:check`,
  `evals:behavioral:mock`, `audit:context`, `audit:cost`, `scan:skills`, `traceability`).
- **CI (`.github/workflows/validate.yml`)** — added the routing-fixture check, the strict
  supply-chain scan, and `evals/**` / `tests/**` path filters alongside the existing
  traceability step; 22 steps total.
- **Test contracts aligned with wave 1** — `tests/platform.test.mjs` now fails only on unexpected
  warning categories instead of any advisory backlog, `tests/delegation-brief.test.mjs` allows the
  sanctioned `clauses` / `reloadPolicy` frontmatter keys, and `tests/projection-consistency.test.mjs`
  pins 244 bundle / 256 repo skills.

### Fixed

- Three file-cited clauses (`CODE-REVIEW-1`, `IMPLEMENT-1`, `TO-SPEC-1`) now cite the assertion in
  their behavioral fixture that enforces them, turning `check-uncited` errors into resolved coverage.

### Validation

```bash
node .agents/skills/platform/check-all.mjs            # status pass, 10/10 gating checks, 0 errors, 73 warnings (68 + 5), 2 report-only, 1 skipped with reason
node .agents/skills/platform/validate-skills.mjs      # 244 skills, 0 errors, 68 advisory warnings
node .agents/skills/platform/audit-semantics.mjs      # 256 skills, 5 load-bearing heuristic warnings, 0 errors
node .agents/skills/platform/security-scan-skills.mjs # clean, 0 findings
node .agents/skills/platform/validate-traceability.mjs# exit 0 - 54 clauses, 3 resolved, 44 manual, 7 pending, 0 errors
node evals/run-routing.mjs --check                    # 10 fixtures, 151 rows, 41 negative controls, 0 errors
node evals/run-behavioral.mjs --all                   # 5 fixtures, 0 broken schema, 0 crashed (mock judge)
node --test tests/*.test.mjs                          # 6/6 pass
node --test .agents/skills/platform/tests/*.test.mjs  # 93/93 pass
node .agents/skills/platform/quality-scorer.mjs --minimum-score 60  # 82/100 (skill-creator)
node .agents/skills/platform/dependency-graph.mjs     # 244 skills, 1 dependency edge, 0 cycles
node .agents/skills/skill-dev/lockfile-maintenance/scripts/update-lockfile.mjs --dry-run  # clean, 256 entries
```

Remaining advisory backlog (never blocks the general gate; blocks promotion): 68 medium/high-risk
skills still lack a `behavioral-fixtures` directory, 5 skills carry the load-bearing-position
heuristic warning, and 7 `evals/behavioral` fixtures are not yet landed, so their clauses are
recorded as `pending` warnings by the traceability validator.

## [2.1.0] - 2026-10-10


Wave-0 modernization debt cleanup, integrated on `main`.

### Added

- `tests/version-consistency.test.mjs` — pins `VERSION`, `package.json`, `registry.yaml` (`version` + `bundleVersion`), and the README badge to one semver value
- Root `AGENTS.md` — repository-level operating rules for coding agents, complementing `.agents/AGENTS.md` (bundle scope)
- `wayfinder` completion flow — "Work through the map" section covering ticket claiming, resolution by type, decision recording, fog graduation, and hand-off to `to-spec`
- `skill-evolver` `--verified-evidence <type>:<note>` flag — records human sign-off that upgrades an evidence check from `pending-verification` to `passed` with an audit trail

### Changed

- **Version unification**: `package.json` and `registry.yaml` aligned from `1.0.0` to `2.0.0`, matching `VERSION` and the README badge
- **Manifest schema fix**: `manifest.schema.json` rewritten to the bundle's real frontmatter contract — `name`/`description`/`category` required, quoted scalars, empty strings, inline and block sequences, numeric-or-string versions and trust tiers accepted
- **marketplace / sync-registry fixes**: `scripts/sync-registry.mjs` now parses the registry's actual YAML subset (quoted scalars, inline arrays, block sequences, JSON passthrough), derives each skill's `category` from its real domain folder instead of frontmatter, and reports category mismatches
- **Telemetry fixes**: `record-execution.mjs` / `otel-skill-instrumentation.mjs` now emit real span durations (`startSpan`/`endSpan` with wall-clock timing, idempotent end), estimate token size from artifact content, and give `artifactScore` explicit null semantics
- `skills-lock.json` re-hashed for all 236 modified skills (254 entries total); `CATALOG.md`, `llms.txt`, and `.claude-plugin/marketplace.json` regenerated from the corrected categories
- `approvalRequired` / `model-rules.yaml` parity repaired across the bundle
- Stale documentation paths repaired in `docs/how-to/installation.md`, `docs/reference/agents/skill-inventory.md`, and the `docs/reference/wiki/` pages

### Fixed

- `fixturesPath` resolution: 221 skills that declared nonexistent central fixture paths now carry null semantics (`fixturesPath: ""`), and `validate-skills.mjs` gained a check that any declared `fixturesPath` must resolve to an existing file
- `skill-evolver` version-bump regex handled only unquoted `version: N` and never matched the bundle's quoted `version: "1"`, so real evolutions wrote byte-identical files while reporting success — the regex now preserves the original quoting style
- `quality-scorer.mjs` CLI accepted only `--minimum-score=N`; the space-separated `--minimum-score N` form silently treated the score as the skill path and crashed — both spellings now work, and a missing skill path exits cleanly
- Category cleanup: 65 skills outside `ai/` still declared `category: "skill-dev/sandbox"`; each now declares its real domain folder (`sec`, `quant`, `physics`, `math`, `finance`, `cs`, `data`, `devops`, `db`, `research`, `docs`, `professional`)
- Stray committed build artifact `.agents/skills/project/dist/project-viability.zip` removed from the index and working tree; `*.zip`, `__pycache__/`, and `*.pyc` added to `.gitignore`
- Six platform skills missing from the `.claude/skills/` compatibility view gained symlinks: `feature-flag`, `gate-ci`, `gate-ide`, `gate-post-merge`, `gate-pre-commit`, `trunk-based-workflow`
- `tests/projection-consistency.test.mjs` invariant 1 aligned with the warning contract: validator warnings are advisory (they block promotion via `skill-promoter`, never the general gate), so the test now fails only on unexpected warning categories instead of any advisory backlog

### Validation

```bash
node .agents/skills/platform/check-all.mjs            # 10/10 pass, 68 warnings, 0 errors
node .agents/skills/platform/validate-skills.mjs      # 242 skills, 0 errors, 68 advisory warnings
node .agents/skills/platform/audit-semantics.mjs      # 254 skills, 0 warnings, 0 errors
node .agents/skills/platform/quality-scorer.mjs --minimum-score 60   # 82/100 (skill-creator)
node .agents/skills/platform/security-scanner.mjs     # pass, 0 findings
node --test tests/*.test.mjs                          # 6/6 pass
node --test .agents/skills/platform/tests/*.test.mjs  # 20/20 pass
node .agents/skills/platform/dependency-graph.mjs     # 242 skills, 0 cycles
```

Open advisory backlog (blocks promotion, never the general gate): 68 medium/high-risk skills lack a `behavioral-fixtures` directory — owner suggestion: `skill-dev/` domain owners authoring behavioral fixtures per ADR-005.

## [2.0.0] - 2026-10-03

### Added

- Artifact-first design: 7 JSON schemas for typed artifacts (spec, ticket, review, adr, handoff, agent-card, trunk-based-workflow, feature-flag)
- Externalized `contract-base.xml` shared contract — eliminates ~19K tokens of duplicated boilerplate
- 4 workflow state machines (standard-feature, bug-fix, operations, repair) in YAML
- `workflow-state-machine.mjs` — executable state machine with persistent checkpoints
- 3 LLM-as-judge evaluators: `evaluate-artifact-quality.mjs`, `evaluate-spec-traceability.mjs`, `evaluate-review-effectiveness.mjs`
- 4 shift-left quality gate skills: `gate-ide`, `gate-pre-commit`, `gate-ci`, `gate-post-merge`
- `trunk-based-workflow` skill — short-lived branches, PR size limits, merge discipline
- `feature-flag` skill — short-lived flags, gradual rollouts, kill switches, cleanup discipline
- `mcp-server` skill + functional stdio JSON-RPC 2.0 server exposing 242 skills as MCP tools
- `agent-card` skill + generator producing 241 Agent Cards for A2A discovery
- 25 versioned prompt templates (v1 + v2) for 12 migrated skills
- `model-rules.yaml` — model tier routing by trust tier and artifact type
- `test-prompt-regression.mjs` — prompt regression testing with golden dataset comparison
- Golden dataset: 3 reference traces for regression testing
- 4 ADRs: artifact-first design, state-machine workflows, shift-left gates, release v2.0
- Diátaxis documentation structure: tutorial/, how-to/, reference/, explanation/
- 3 new GitHub Actions workflows: quality-gates.yml, prompt-regression.yml
- `evaluate-skills-by-domain.mjs` — domain-level skill quality evaluation
- `record-execution.mjs` v2 — emits ExecutionTrace conforming to v2 schema
- `generate-agent-cards.mjs` — batch Agent Card generation
- `migrate-skills-to-v2.mjs` — batch migration script for v2 format

### Changed

- All 241 non-platform skills migrated to v2 format with:
  - Extended frontmatter: `modelTier`, `promptVersion`, `artifactType`, `evaluators`, `fixturesPath`, `diataxis`, `tags`, `compatibility`, `approvalRequired`, `approvalFor`
  - Removed `## Operating Contract` block, replaced with `## Contract` + `@include contract-base.xml`
  - Added `## Provenance`, `## Artifact`, `## Completion` sections
  - Typed outputs as JSON schema objects
- `quality-scorer.mjs` v2: 13 dimensions (was 6), 0-100 scoring, new tiers
- `implement` skill: integrates TDD, quality gates (gate-ide, gate-pre-commit, gate-ci), feature flags, trunk-based workflow
- `publish-open-pr` skill: enforces gate-ci before opening PR
- `ask-to` skill: consumes state machine workflows for routing
- `workflow-item-router` skill: updated for Diátaxis doc paths
- Documentation reorganized from flat structure to 4 Diátaxis quadrants (30 files moved)
- Internal links updated across all docs and SKILL.md files
- Lockfile maintenance expanded to cover 254 skills (was 189)
- `audit-semantics.mjs` whitelist expanded to 20+ side effects
- `validate-skills.mjs` parser handles array frontmatter fields

### Removed

- Duplicated `## Operating Contract` blocks from all skills (moved to shared `contract-base.xml`)
- Flat docs/ structure replaced by Diátaxis quadrants

### Validation

```bash
node .agents/skills/platform/check-all.mjs
```

Expected result: 10/10 checks passing, 0 warnings, 0 errors.

## [2.1.0] - 2026-10-03

### Added

- ADR-005: skills grade elevation via references, scripts, Why sections, observability, and regression fixtures
- 12 skills elevated to grade A/B:
  - Grade A (10): implement (97), code-review (91), review-pr (91), ask-to (90), mcp-server (92), to-spec (93), to-tickets (92), tdd (92)
  - Grade B (2): work-item-router (86), agent-card (89), trunk-based-workflow (89), feature-flag (85)
- 12 new regression fixtures in `.agents/skills/platform/fixtures/regression/`
- 12 new reference files across skills (workflow rules, quality gates, routing, MCP spec, A2A, vertical slicing)
- 4 new script templates (validate-implementation, validate-routing-artifact, validate-schema, validate-router-decision)

### Validation

```bash
node .agents/skills/platform/check-all.mjs
```

Expected result: 10/10 checks passing, 0 warnings, 0 errors.


## [1.0.0] - 2026-08-27

Initial quirk-owned skills bundle baseline.

### Added

- Canonical `.agents/skills/` bundle with `.claude/skills/` compatibility links.
- quirk method, authorship, provenance, adoption, and template-standard docs.
- Scenario evaluation fixtures and deterministic scenario runner.
- Semantic audit runner and unified platform validation commands.
- Internal case-study structure.

### Changed

- Person-branded and retired routing names were removed from active workflow routing.
- `review-fix-loop` became the canonical PR remediation loop between `review-pr` and `ship-subissue`.
- Templates were hardened for traceability, metadata, acceptance criteria, validation, and scope boundaries.

### Validation

```bash
node .agents/skills/platform/check-all.mjs
```
