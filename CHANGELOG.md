# Changelog

All notable changes to `quirk Skills` are recorded here.

This project follows semantic versioning once releases are cut:

- `MAJOR` for breaking workflow or artifact contract changes.
- `MINOR` for new skills, new validators, new scenarios, or compatible workflow extensions.
- `PATCH` for documentation fixes, template clarifications, and non-breaking validator fixes.

## [Unreleased]

### Fixed

- Remediated all 84 error-severity tool-risk findings: web-derived content is
  explicitly treated as untrusted, mutating skills declare approval gates, and
  the MCP exposure exception is documented. The enforced budget is now zero.
- `skill-run-recorder.mjs` treated `sink: 'memory'` as a relative file path, so
  tests appended JSONL to a tracked root `memory` file. The no-op sentinel is
  now checked first, a regression test pins it, and the accidental file is no
  longer tracked.
- `run-skill-task.mjs` now measures durations with `performance.now()` and
  anchors `completedAt` to `startedAt`, so a backwards wall-clock step cannot
  produce a trace that completes before it starts.
- `.claude-plugin/plugin.json` metadata version is back in sync with `VERSION`;
  both Claude manifests are pinned by the version-consistency test.

### Added

- `docs-links.mjs`: gating check for relative Markdown links, with support for
  fenced examples, inline code, anchors, and external URLs. Broken links and
  links that escape the repository fail the gate.

### Changed

- `fix-compatibility-view.mjs` now validates the full view contract: one
  relative directory symlink per canonical skill, no domain aliases, no direct
  `SKILL.md` targets, and no missing skills. The view is repaired to 266/266.
- Native Cursor, Gemini, Copilot, OpenCode, and Windsurf views are now ignored,
  on-demand projections instead of 1,270 committed symlinks. Generate them with
  `npm run views:native`; the committed `.claude/skills/` view remains intact.
- Current documentation counts are 254 bundle / 266 repository skills and 1532
  adapters; removed-research references now point at stable documents.
- Removed obsolete platform notes and the one-off 249-skill migration report;
  generated runtime traces, artifacts, mocks, and temporary memory output are
  excluded from the working tree.

## [3.0.0] - 2026-10-19

Version 3.0.0 rolls up the accumulated Unreleased work into a single
major bundle release: the 2026 ecosystem gap analysis (agentskills.io
compliance, agent-native primitives, self-improvement, context
engineering, and ecosystem distribution) plus aligned bundle metadata.

### Release

- `VERSION`, `package.json`, `registry.yaml`, `skills.json`, and the
  README badge now agree on `3.0.0`.
- Registry projections (`CATALOG.md`, `llms.txt`,
  `.claude-plugin/marketplace.json`, and the generated site data) are
  regenerated from the updated registry.
- Added the 3.0.0 gap analysis and v4 roadmap in
  `docs/research/2026-10-19-skill-lab-v3-gap-analysis-and-v4-roadmap.md`.

### Fixed

- `skill-run-recorder.mjs` now clamps session event timestamps to be
  monotonic, so a backwards wall-clock step (for example an NTP
  correction) cannot emit a trace that fails the integrity check. A
  deterministic injected-clock regression test covers the case.

### Added

- `agentskills-compliance.mjs`: validates every shippable SKILL.md
  against the open Agent Skills specification (name/description rules,
  license/compatibility/allowed-tools constraints) and the progressive
  disclosure budgets (~100-token preload, <500-line body). Wired into
  `check-all.mjs` as a report-only audit.
- `project-agent-paths.mjs`: generates the native skill views for
  Cursor (`.cursor/skills/`), Gemini CLI (`.gemini/skills/`), GitHub
  Copilot (`.github/skills/`), OpenCode (`.opencode/skills/`), and
  Windsurf (`.windsurf/skills/`) as relative symlink farms, with
  drift repair, alongside the existing Claude Code view.
- Runtime hooks: `hooks/tool-risk-guard.mjs` (PreToolUse, enforces
  `policy/tool-risk.yaml` fail-closed: undeclared tools are denied,
  approval-gated tools ask) and `hooks/session-context.mjs`
  (SessionStart navigation layer), registered in `hooks/hooks.json`.
- `generate-subagents.mjs`: generates the six Claude Code subagent
  definitions (`.claude/agents/`: architect, explorer, reviewer,
  tester, implementer, doc-writer) with tool scoping derived from the
  tool-risk policy.
- `trace-improver.mjs`: turns recorded execution traces into typed,
  evidence-carrying skill-improvement proposals (blocked-rate,
  iteration-pinch, schema-drift, quality-bar, dominant-blocker,
  slow-tail diagnoses).
- `trajectory-eval.mjs`: evaluates recorded trajectories against each
  skill's declared state machine (result enum, maxIterations,
  duration window, side-effect coverage, model tier, schema flag).
- `benchmark-harness.mjs`: Terminal-Bench-style measurement layer
  over the task fixtures - repetition (pass@k), median/p95 duration,
  and a persistent benchmark history.
- `trust-registry.mjs`: pre-install trust scoring for third-party
  skills (provenance, prompt-injection, tool poisoning, obfuscation,
  signature verification, policy alignment) with trusted /
  review-required / blocked verdicts.
- `marketplace-export.mjs`: exports the bundle in the standard
  agentskills.io form (stringified `metadata` map, joined
  `compatibility`, derived `allowed-tools`) plus a hash-carrying
  `index.json` for community registries.
- Five new skills: `context-compaction` (compaction runbook),
  `agent-memory` (NOW.md/MEMORY.md external memory),
  `skill-composition` (producer-consumer chain contracts),
  `browser-automation` (computer-use with approval gates), and
  `spec-driven-development` (constitution + specify/plan/tasks,
  Spec Kit compatible).

### Changed

- `check-all.mjs` runs the agentskills.io compliance audit
  in-process and the native-view, trajectory, trace-improvement,
  and benchmark reports as runtime-evidence checks.
- `lockfile-maintenance` now declares its `write-files` side effect
  (the trajectory evaluator caught the undeclared lockfile write).
- `skill-audit` and `skill-testing-framework` declare the
  `write-files` side effect for the scripts they execute;
  `skill-audit` raises `maxIterations` to the observed 8.

## [2.5.0] - 2026-10-12

Implements the first Fase 0 security and quality hardening items from
`docs/research/2026-10-12-laboratorio-de-skills-estado-del-arte/`.

### Added

- Published the tool-risk debt budget in `policy/tool-risk-budget.json`, with a
  schema and documented decreasing targets from the current 84-error baseline to
  zero.
- Added a canonical-skill policy rule that rejects dynamic-context execution
  syntax, hooks, and settings that could run before the model evaluates a skill.
- Documented T0–T3 skill risk tiers and the quality debt inventory that drives
  the D/F remediation backlog.

### Changed

- `check-all.mjs` now treats tool-risk as a budgeted gate: existing measured
  debt is capped, and any regression over budget fails the full local gate.
- The recorder demo test now asserts cleanup of the trace directory written by
  its own run, so unrelated residual `/tmp/quirk-skill-runs-demo-*` directories
  no longer make the test fail.

## [2.4.2] - 2026-10-11

Twelve review findings from the fix round are closed: the CI workflow could not
fail, the behavioral eval counted failures it never displayed, the traceability
gate audited a set it had already skipped, the supply-chain scanner scanned the
wrong tree with no way to see the rest, the local gate left four new CLIs
unwired, three duplicate legacy fixtures and one dead citation survived in the
bundle, two artifact schemas were missing, and runtime artifacts were tracked
that belonged to `.gitignore`.

The completeness audit that followed it ran four fix agents concurrently over
CI, fixtures, graph and traceability. CI is Node-20 clean, the behavioral
fixture corpus is named and counted consistently, the skill graph rebuilds
byte-identically, the behavioral runner validates its grounding paths, and the
traceability manual backlog is closed: every one of the 60 contract clauses now
resolves to a fixture that literally cites its clause id.

### Fixed

- **`validate.yml` can now actually fail** (review finding 1) — the job declared
  no shell, so every gate ran under GitHub's default `bash -e {0}` without
  `pipefail`, and each gate piped through `tee "$(mktemp)"`, whose exit status
  replaced the command's: a fully red gate reported green. The job now sets
  `defaults: run: shell: bash`, and every run block that pipes through `tee`
  opens with `set -o pipefail`, so the pipeline exit status is the command's.
  The step list is also consolidated: seven overlapping per-tool steps are
  replaced by one **Run full local gate** step that runs
  `check-all.mjs`, which is the single authoritative gate.
- **The behavioral eval reports the failures it counts** (review finding 2) —
  `aggregateArm` never incremented `entry.failed`, so `rateOf` divided by zero,
  reported `null`, and the Markdown report showed only passing assertions while
  a run could in fact contain failed ones. The else branch now increments
  `failed`, `renderMarkdown` prints a **Failed assertions** section with
  per-assertion trial evidence and judge notes, and the header line carries the
  total failed-assertion count. The module is also importable now: the CLI
  dispatch runs only when the file is the entry point, so
  `tests/run-behavioral-aggregate.test.mjs` can exercise the scoring internals
  without re-running the CLI. `syntheticTranscript` honours
  `artifact_min_lines` as well as `artifact_min_words`.
- **The traceability gate audits the critical set before skipping it** (review
  finding 3) — the critical-set audit ran *after* a `clauses.length === 0`
  `continue`, so a critical skill that declared no clauses at all was skipped
  before it was ever counted. The audit now runs before the skip, and the skip
  is narrowed to non-critical skills, which legitimately declare no clauses yet.
- **A citation fragment must anchor its own clause** (review finding 3) —
  `evals/behavioral/tdd.json#TDD-1` resolves as long as the file mentions
  `TDD-1` anywhere, so a typo'd or copy-pasted anchor is undetectable. A fragment
  that is not the citing clause's own id now fails with the new
  `check-fragment-mismatch` class, and the remediation vocabulary in
  `--fix-hint` names the repair.
- **The supply-chain scanner now scans the tree it claims to** (review finding
  4) — `DEFAULT_PATH` was `platform/`, so `.agents/AGENTS.md` (an active
  instruction path under OWASP AST02) was out of scope, and
  `collectSkillFiles` silently dropped every root-level file of a root without
  a `SKILL.md`. The default root is now `.agents`, root-level files are scanned,
  and a new `--deep` flag widens the scan into skill-bundled working
  directories (`fixtures`, `tests`, `evals`, `agent-cards`, `traces`,
  `artifacts`, `golden`), which stay skipped by default.
- **The local gate wires the four CLIs that were left unwired** (review finding
  5) — `check-all.mjs` now gates on `validate-traceability.mjs`,
  `security-scan-skills.mjs --strict`, `evals/run-routing.mjs --check`,
  `loop-runner.mjs --demo`, and `idempotency.mjs --demo` (run against a
  `mkdtemp` intents directory so no scratch state lands in the tree). The four
  report-only audits (`context-budget-auditor`, `cost-ledger`,
  `validate-spec-compliance`, `skill-graph build`) are now consumed in-process
  from a single shared manifest built with one walk of the skills tree, instead
  of each spawning a subprocess that re-walked and re-parsed the whole bundle.
  The DAG gate is active: `dag-scheduler.mjs --check` runs against the
  committed `workflows/default-dag.json` and is no longer skipped.
- **Three duplicate legacy fixtures removed** (review finding 6) —
  `delivery-implement-review-fixes.json`, `foundation-subagent-swarm.json`, and
  `delivery-plan-review-fixes.json` duplicated canonical fixtures and are gone;
  `subagent-swarm`'s `fixturesPath` is repointed at the canonical
  `subagent-swarm.json`, and the `delegation-brief` frontmatter guard's
  exception list now admits `fixturesPath` alongside `clauses`, `reloadPolicy`,
  and `license`.
- **Stale `docs/agents/` citations repointed** (review finding 7) —
  `to-tickets`, `make-project`, `governance-index.md`, `setup-quirk-skills`,
  `code-review`, `review-pr`, `skill-tutor`, and `skill-promoter` cited the
  pre-move paths; their link targets now point into `docs/reference/agents/`.
- **`implement-schema.json` and `publish-open-pr-schema.json` exist** (review
  finding 8) — the `implement` and `publish-open-pr` skills emitted structured
  artifacts with no schema to validate them against. Both schemas are declared
  with their required properties, and `tests/schemas.test.mjs` pins them with
  positive and negative cases plus a proof that the skills citing them resolve
  the paths.
- **Runtime artifacts are untracked, not committed** (review finding 9) —
  `.gitignore` now ignores `traces/*.jsonl`, `state/*.json`, and `.scratch/`.
  The tracked traces and the tracked `state/standard-feature.json` are removed
  from the index while remaining on disk; `traces/README.md` and
  `traces/schema.json` stay tracked.
- **`platform/workflows/default-dag.json` exists** (review finding 10) — the
  canonical ticket DAG for the standard-feature flow, with blocking edges drawn
  from the documented transition order and no edge implied by another, so the
  over-coupling linter has nothing to report. `dag-scheduler --check` on it
  exits 0.
- **`loop:demo` and `idempotency:demo` npm scripts exist** (review finding 11) —
  both demos are now wired as gating entries in `check-all.mjs` as well as in
  `package.json`.
- **The last dead citation is closed** (review finding 12) —
  `project/to-spec/SKILL.md:156` cited `docs/agents/issue-tracker.md` inline
  with no link target at all. It now points at
  `docs/reference/agents/issue-tracker.md`.

### Completeness-audit fixes

- **`validate.yml` registry step no longer uses `require`** — the step called
  `node -e "const r=require('./registry.yaml')"` on a JSON-content file, which
  can only work through Node's CommonJS `.yaml`-extension experiment; under the
  pinned Node 20 runner it is a hard failure. The step now reads the file with
  `fs.readFileSync` and parses it with `JSON.parse`, failing with an explicit
  `registry.yaml unparseable:` message when the content is not JSON.
- **`check-all.mjs` expands its test globs in-process and gates the root
  suite** — `node --test` only expanded glob patterns from Node 21 onward, so the
  pinned Node 20 runner treated the literal `*.test.mjs` argument as a filename
  and the suite never ran. `listTestFiles`/`testArgs` read the directory, filter
  on `.test.mjs`, sort, and hand `node --test` explicit existing paths, with no
  shell and no glob dependency. The same helper now wires the **root** test suite
  (`tests/*.test.mjs`) in as a gating entry — it previously ran only when invoked
  by hand — reported with a skip reason when the directory is empty so the gate
  cannot silently lose it.
- **The behavioral fixture count pin is no longer stale** —
  `.agents/skills/platform/tests/run-behavioral-aggregate.test.mjs` pinned the
  corpus at 12 files in three places while the suite had grown to 20. The pin
  follows the suite and the CLI's own `behavioural fixtures: N file(s)` line.
- **`skill-graph.mjs` persists deterministically** — the tracked
  `platform/graph/skill-graph.json` carried a `generatedAt` timestamp, so a
  `git diff --exit-code` drift gate against it could never be clean. The
  timestamp is now printed to stdout only and stripped from the file,
  `auditSkills` defaults to `save: false`, and skills are sorted by path before
  serialisation, so consecutive rebuilds are byte-identical and the file stays
  drift-clean. This closes the `generatedAt` known limitation recorded in the
  round above.
- **The behavioral runner validates its grounding paths** — a fixture's
  `grounding` entry cites bundle material as
  `<repo-relative path>[#anchor][ (annotation)]`; only the path part was ever
  resolved, and nothing checked it at all outside the CLI. `validateFixture` is
  now exported and async and resolves every repo-relative grounding path,
  skipping URLs and absolute paths that are deliberately not repo-relative.
  A dead grounding path is a fixture schema error instead of a silently
  misdirecting reference.
- **The registry's inner `version` is tested** — `scripts/sync-registry.mjs`
  falls back to the inner `version` field when `bundleVersion` is absent, so
  both fields are load-bearing, but only `bundleVersion` was pinned.
  `tests/version-consistency.test.mjs` now asserts the inner `version` as well,
  so the two fields cannot drift apart or away from `VERSION`.

### Traceability backlog closed

- **The manual-clause backlog goes from 8 to 0** — `validate-traceability.mjs`
  now reports 60 contract clauses across 18 skills with 60 resolved, 0 manual and
  0 pending. The eight clauses that were still `manual` (`CODE-REVIEW-2/3/4`,
  `IMPLEMENT-2/3/4`, `TO-SPEC-2/3`) stayed manual only because their paired
  fixtures exercised the guardrail without citing the clause id. Each of
  `evals/behavioral/{code-review,implement,to-spec}.json` now carries a `cites`
  array naming every clause it exercises plus a citation on the exact assertion
  or judge that enforces it — axis separation and findings-only for
  `code-review`, the stop-before-publication and tracer-bullet rules plus the
  approval gate for `implement`, and placeholder honesty and
  synthesis-over-interview for `to-spec` — and each clause's `check:` is
  repointed at `evals/behavioral/<skill>.json#<CLAUSE-ID>`, so the fragment is
  the clause's own id.
- **Eight new behavioral fixtures close the same backlog for the skills that
  had none** — `review-fix-loop`, `analyze-artifacts`, `ship-subissue`,
  `evaluate-skill-clauses`, `side-effect-auditor`, `skill-audit-clauses`,
  `skill-optimizer` and `skill-promoter` each declare their contract clauses and
  cite them from assertions and negative controls. The corpus is 20 fixtures.
- **The backlog gate now proves the closure instead of documenting it** —
  `.agents/skills/platform/tests/traceability-manual-backlog.test.mjs` no longer
  ships an eight-entry `DOCUMENTED_MANUAL_BACKLOG` map that made `manual` the
  expected outcome. The map is empty, a new test re-reads each of the eight
  closed citations from its own fixture and asserts both that the fixture still
  cites the id and that the clause's `check:` is not `manual`, so a fixture edit
  that drops a citation fails the gate instead of reopening the backlog.

### Known limitations

- **`security-scan-skills.mjs --deep` reports 5 high findings that are
  intentional test-fixture true positives.** The scanner has **no inline
  suppression, exemption, or baseline mechanism** (the only `ignore` pattern in
  it is the prompt-injection detector's own regex), so the patterns the test
  files deliberately plant cannot be annotated away. They are:
  `tests/agent-cards-signing.test.mjs:91` (a `/BEGIN PRIVATE KEY/` assertion
  that *proves* verification rejects a key block) and
  `tests/security-scan-skills.test.mjs:142,146,154,177` (`pyyaml==5.3.1` literals
  and injection sample strings that *prove* the rules fire). This is deliberate
  and documented, not a regression: `--deep` is not wired into any gate, so the
  default scan and `--strict` — the gating mode — stay clean at 0 findings, and
  a new test pins that contract, including the exact count, files, and rules that
  may fire under `--deep`.
- **`evaluate-fixtures.mjs --fixture-dir` now accepts a bare leaf name.** A bare
  name like `behavioral` used to resolve against the caller's working directory
  and evaluate zero fixtures (a 0/0 FAIL with no diagnostic). It is now resolved
  against the fixtures root; the full path form and the default are unchanged.
- **Markdown link text with `docs/agents/` labels survives in
  `.agents/skills/index.md`** and in several skill bodies. The link *targets* are
  all correct and resolve; only the human-readable label text still names the
  pre-move path. Cosmetic and non-breaking.

### Changed

- **`skills-lock.json` re-locked** against the edited tree — 9 skills updated
  (`setup-quirk-skills`, `code-review`, `review-pr`, `subagent-swarm`,
  `make-project`, `to-spec`, `to-tickets`, `skill-promoter`, `skill-tutor`),
  258 entries matching the 258 canonical `SKILL.md` files, dry-run clean after
  the write.
- **Seven legacy behavioral fixtures renamed to match their skill field** — the
  corpus at `.agents/skills/platform/fixtures/behavioral/` carried
  domain-prefixed filenames that disagreed with the `skill` field of the fixture
  they held. `backend-microservices`, `foundation-agent-canvas`,
  `foundation-context-engine`, `foundation-domain-modeling`,
  `foundation-observability`, `project-project-viability` and
  `delivery-diagnosing-bugs` are now `microservices`, `agent-canvas`,
  `context-engine`, `domain-modeling`, `observability`, `project-viability` and
  `diagnosing-bugs`. A new test pins the rename map so a legacy name cannot come
  back, and the four affected `fixturesPath` frontmatter values are repointed at
  the canonical files.
- **`core-triggers.json` merged into per-skill fixtures and deleted** — the
  shared multi-skill trigger corpus is gone; its cases live in the per-skill
  files they exercise. The corpus now carries 219 unique fixture ids with no
  id shared across files.
- **The duplicate-skills premise is corrected: depth-1 `implement` and
  `implement-review-fixes` are symlinks, not duplicates** — the completeness
  audit recorded two extra skills at the bundle root that would need deletion.
  Both entries are git symlinks (index mode `120000`) pointing at their
  `delivery/` counterparts, so they are the same skill reached by two paths and
  not duplicate content. Nothing was deleted and the skill counts are unchanged
  at 246 bundle skills and 258 canonical `SKILL.md` files.
- **`skills-lock.json` re-locked again after the completeness audit** — 22 skills
  updated (`code-review`, `implement`, `review-fix-loop`, `review-pr`, `tdd`,
  `agent-canvas`, `context-engine`, `domain-modeling`, `observability`,
  `subagent-swarm`, `analyze-artifacts`, `to-spec`, `to-tickets`, `ask-to`,
  `publish-open-pr`, `ship-subissue`, `work-item-router`, `evaluate-skill`,
  `side-effect-auditor`, `skill-audit`, `skill-optimizer`, `skill-promoter`),
  no entries added or removed, dry-run clean after the write.
- **checkpoints runtime is gitignored** — `.gitignore` now also ignores
  `.agents/skills/platform/checkpoints/*.jsonl`, matching the existing
  `traces/` and `state/` runtime rules.

### Validation

```bash
node .agents/skills/platform/check-all.mjs            # status pass: 17/17 gating (root-test suite now gating), 4 report-only pass, 1 skip (memory-index)
node .agents/skills/platform/validate-skills.mjs      # 0 errors, 0 warnings (246 bundle skills)
node .agents/skills/platform/audit-semantics.mjs      # 0 errors, 0 warnings (258 skill files, 688 markdown files)
node .agents/skills/platform/validate-traceability.mjs # 60 clauses, 60 resolved, 0 manual, 0 pending, exit 0
node .agents/skills/platform/validate-spec-compliance.mjs  # 0 errors
node .agents/skills/platform/security-scan-skills.mjs      # clean (default and --strict)
node .agents/skills/platform/security-scanner.mjs          # clean
node evals/run-routing.mjs --check                            # 0 errors, 0 warnings
node evals/run-behavioral.mjs --all                           # 20 fixtures, 0 failed
node .agents/skills/platform/evaluate-fixtures.mjs            # 243/259 (93.8%) PASS
node .agents/skills/platform/evaluate-fixtures.mjs --fixture-dir behavioral --threshold 0.8  # 219/219 PASS
node .agents/skills/platform/evaluate-behavioral-fixtures.mjs  # PASS
node .agents/skills/platform/evaluate-scenarios.mjs            # PASS
node --test tests/*.test.mjs                                  # 6/6
node --test .agents/skills/platform/tests/*.test.mjs          # 291/291
node .agents/skills/platform/dag-scheduler.mjs --check .agents/skills/platform/workflows/default-dag.json  # exit 0
node .agents/skills/platform/dependency-graph.mjs            # exit 0
node .agents/skills/platform/skill-graph.mjs build           # sha256-identical across two rebuilds; git status clean for the graph file
node .agents/skills/platform/quality-scorer.mjs --minimum-score 60  # exit 0
node .agents/skills/platform/skill-lab.mjs cost              # exit 0
node .agents/skills/platform/context-budget-auditor.mjs      # exit 0
```

The exact CI registry step (`node -e "const fs=require('fs');let r;try{r=JSON.parse(fs.readFileSync('registry.yaml','utf8'))}..."`)
exits 0, and `validate.yml` parses as YAML.

## [2.4.1] - 2026-10-10

Closing the fixtures-coverage gap. Three remediation streams landed their content (evals
citations, hoisted load-bearing rules, reproducible agent cards) and a fourth wired the
canonical behavioral fixtures; the validator still measured fixtures only at the per-skill
directory, so 68 correctly-covered skills were warned. This release fixes the measurement,
wires the two stragglers, and hardens the fixture evaluator.

### Fixed

- **`validate-skills.mjs` measures behavioral fixtures at the canonical central location** —
  the "risk skill has no behavioral-fixtures directory" warning checked only for a non-empty
  `<skillDir>/behavioral-fixtures/` directory, while the bundle's dominant convention is the
  central corpus at `.agents/skills/platform/fixtures/behavioral/<skill>.json` (94 files versus
  a handful of per-skill directories). The warning now fires only when a skill has neither a
  non-empty local directory nor an existing central fixture file, so 68 correctly-covered
  skills are no longer warned. The warning category name and message prefix are unchanged.
- **`evaluate-fixtures.mjs` no longer crashes on the security corpus** — with its default
  `--fixture-dir`, entries in `fixtures/security/skill-poisoning-baseline.json` carry
  `files`/`class`/`rule` and no `skill` field, which made `resolveSkillPath` throw
  `ERR_INVALID_ARG_TYPE` on `path.join(undefined)` before any result was printed. Fixtures
  without a resolvable `skill` are now skipped with an explicit, surfaced note count
  (16 entries in the default corpus) and the run completes. The corpus file is unchanged; it is
  consumed by `security-scan-skills.mjs`, not by this evaluator.
- **`--fixture-dir` accepts a leaf fixture directory** — pointing it at
  `.agents/skills/platform/fixtures/behavioral` used to evaluate zero fixtures (the loader only
  globbed `<dir>/behavioral`, `<dir>/regression`, `<dir>/security` children). The loader now
  detects a leaf directory that carries fixture JSON directly.
- **`validate-traceability.mjs --fix-hint` always publishes its remediation vocabulary** — with
  the evals backlog closed (0 pending citations) the hint mode printed only
  "No errors - nothing to remediate.", hiding the class catalog. It now prints
  "Remediation by class:" with the full legend before that line, so the mode stays a usable
  reference in a clean repository.

### Changed

- **61 canonical behavioral fixtures wired into 60 skills' `fixturesPath`** — the behavioral
  fixtures corpus now holds 94 files (222 evaluated assertions). 58 skills were pointed at
  `.agents/skills/platform/fixtures/behavioral/<skill>.json` by the fixtures stream, and the two
  stragglers left on `fixturesPath: ""` (`make-project`, `web3-smart-contracts`) — both of which
  do have fixtures — are now wired to the same canonical spelling.
- **Agent-card corpus made reproducible** — 246/246 cards regenerate byte-identically, 6 stale
  platform cards pruned, the `mcp-server` card recovered, and `skills.json` aligned to 2.4.0.
- **`skills-lock.json` re-locked** against the edited tree (258 entries matching 258 canonical
  `SKILL.md` files; clean dry-run after the write).

### Validation

```bash
node .agents/skills/platform/check-all.mjs            # status pass, 10/10 gating checks, 0 errors, 0 warnings
node .agents/skills/platform/validate-skills.mjs      # 246 skills, 0 errors, 0 warnings
node .agents/skills/platform/audit-semantics.mjs      # 258 skills, 0 errors, 0 warnings (no load-bearing findings)
node .agents/skills/platform/security-scanner.mjs     # pass, 0 findings
node .agents/skills/platform/security-scan-skills.mjs # clean, 0 findings
node .agents/skills/platform/security-scan-skills.mjs --strict  # clean, 0 findings
node .agents/skills/platform/validate-spec-compliance.mjs  # 258 skills, 0 errors, 0 warnings, bodies within 500 lines
node .agents/skills/platform/validate-traceability.mjs     # exit 0 - 60 clauses, 10 resolved, 50 manual, 0 pending, 0 errors
node evals/run-routing.mjs --check                    # 10 fixtures, 151 rows, 41 negative controls, 0 errors, 0 warnings
node evals/run-behavioral.mjs --all                   # 12 fixtures, 0 broken schema, 0 crashed (mock judge)
node .agents/skills/platform/evaluate-fixtures.mjs    # 246/262 pass (93.9%), 16 skipped without a skill field
node .agents/skills/platform/evaluate-fixtures.mjs --fixture-dir .agents/skills/platform/fixtures/behavioral --threshold 0.8  # 222/222 pass
node .agents/skills/platform/evaluate-behavioral-fixtures.mjs  # 4 fixtures, 0 errors, 0 warnings
node .agents/skills/platform/evaluate-scenarios.mjs   # 8 scenarios, 0 errors, 0 warnings
node --test tests/*.test.mjs                          # 6/6 pass
node --test .agents/skills/platform/tests/*.test.mjs  # 217/217 pass
node .agents/skills/platform/quality-scorer.mjs --minimum-score 60  # pass
node .agents/skills/platform/dependency-graph.mjs     # 246 skills, 1 dependency edge, 0 cycles
node .agents/skills/platform/skill-graph.mjs build    # 246 nodes / 60 edges (depends-on 1, compatible 49, handoff 10)
node .agents/skills/platform/skill-lab.mjs cost       # report, exit 0
node .agents/skills/platform/context-budget-auditor.mjs  # report, exit 0
```

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
