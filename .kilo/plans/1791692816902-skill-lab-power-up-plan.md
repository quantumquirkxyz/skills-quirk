# Skill Lab Power-Up Plan — skills-quirk

Goal: evolve this repository from a well-governed *skill bundle* into a **measured, interoperable,
sandboxed, observable agent-skill platform** — without breaking the existing Layer 0 gate or the
canonical-source rule.

Baseline facts verified in-repo (2026-10-11):

- Canonical skills: `.agents/skills/**/SKILL.md`; compatibility view `.claude/skills/` exists as symlinks.
- Integrity: `skills-lock.json` (hash/revision/sourceType), `schema/registry.schema.json`.
- Full gate: `node .agents/skills/platform/check-all.mjs` (structural + security + routing check).
- Evals are **two layers** (`evals/README.md`): Layer 0 structural, Layer 1 behavioral.
- Layer 1 today: `evals/routing/*.csv` (10 files, ~161 rows, includes `negative-control` category) and
  `evals/behavioral/*.json` (21 fixtures); runners `run-routing.mjs`, `run-behavioral.mjs`.
- **Critical limitation**: `run-behavioral.mjs` "never calls a model" — it *scores already recorded
  transcripts*. Judge needs `JUDGE_API_KEY`, else silently falls back to `mock` mode. So behavioral
  evidence depends on manual human capture.
- MCP runtime exists: `.agents/skills/platform/mcp-server/server.mjs` (tools `list_skills`, `get_skill`,
  `get_artifact_schema`, `a2a_discover`, `a2a_invoke`, dynamic `skill_<name>` tools + resources + prompts),
  but there is **no protocol-level MCP test suite**.
- Known drift: `package.json`/`registry.yaml` = `2.4.2` while `skills.json` = `2.4.1`.

External signals (research, to 2026-10-10): MCP as universal connector / gateway mesh
(https://modelcontextprotocol.io/introduction, https://github.com/decocms/mesh); skills as versioned
software (https://github.com/open-gitagent/gitagent); FSM enforcement over prose
(https://github.com/Alfredvc/aharness); final-state evals (https://www.swebench.com/);
prompt/description optimization (https://dspy.ai/); observability as a category
(https://github.com/langwatch/langwatch); prompt-injection/OWASP risk
(https://owasp.org/www-project-top-10-for-large-language-model-applications/, https://github.com/cfitzgerald-pd/skillcop);
context bloat (https://straion.com/).

---

## Phase 1 — Hygiene & honest reporting (low risk, unblocks everything)

### 1.1 Version alignment
- Update `skills.json` to `2.4.2` (or the single source chosen by the repo's version-consistency rule).
- Confirm `tests/version-consistency.test.mjs` / `scripts/check-version-consistency.mjs` pass.
- Decision: `package.json` is the single source of truth; all other projections derive from it.

### 1.2 Report honesty
- Ensure every report produced by `check-all.mjs` and `evals/*` prints a mode banner:
  `Layer 0` vs `Layer 1`, and `judge: mock | real` (mock already detected at `run-behavioral.mjs` around
  the `JUDGE_API_KEY` fallback — make it loud, not silent).
- Add a line to report headers: "no model was invoked" whenever mode is mock/structural.

### 1.3 Generated-view documentation
- Document in `AGENTS.md`/README that `.claude/skills/` is a generated symlink view, who regenerates it,
  and whether it is committed on purpose. Resolve the ambiguity found during exploration.

**Validation**: `node .agents/skills/platform/check-all.mjs` green; version test green; manual diff of
report headers shows the banner.

---

## Phase 2 — Layer 1 real runner (the highest-value gap)

### 2.1 Runner contract
- New `evals/run-record.mjs`: orchestrates an *external* agent harness to produce transcripts.
  It must not implement its own agent loop. It must support:
  - `--provider anthropic|openai|local|command` (a `--command` escape hatch for any CLI harness, e.g. Kilo/Claude Code/OpenHands).
  - `--model <id>` pinned per run, echoed into the transcript.
  - `--arm with-skill|baseline`, `--fixture <path>`, `--trials N` (default 3), `--trials-keep N`.
- Transcript JSONL schema (extend existing): `trialIndex`, `arm`, `skill`, `skillVersion`, `skillHash`,
  `model`, `provider`, `prompt`, `artifacts[]`, `toolCalls[]`, `usage {inputTokens,outputTokens}`,
  `durationMs`, `costUsd`, `startedAt`.
- Pin `skillHash` from `skills-lock.json` so a run is reproducible against a specific skill revision.

### 2.2 Isolation rules (mirror `evals/README.md` protocol)
- Fresh session per trial; never reuse a session across arms or trials.
- Baseline arm = identical prompt, skill content withheld, same model snapshot.
- Grounding: for skills that post to GitHub (to-spec, review-pr, publish-open-pr, ship-subissue) the
  runner must run in `--dry-run`/fixture mode only — never against the live tracker.
- Redaction pass before persisting: strip tokens/keys from `toolCalls` inputs/outputs.

### 2.3 Judge hardening
- Keep Anthropic-compatible endpoint, but fail loudly if `JUDGE_API_KEY` absent unless `--mock-judge`
  is explicit (remove the silent fallback for CI runs).
- Persist `judge {mode, model, provider, criteria[]}` in every report.

### 2.4 Gate integration (staged, non-blocking first)
- Add `evals/run-routing.mjs --check` and behavioral smoke (`--all --mock-judge`) to `check-all.mjs` if not already.
- Add an optional `--behavioral <recordings-dir>` mode: it only fails when real recordings exist.
- New CI workflow `.github/workflows/behavioral-evals.yml` (manual `workflow_dispatch` + schedule), gated
  on secrets availability; it must not fail main CI when secrets are absent.

**Validation**: one fixture (`to-spec`) recorded through `--command` with 3 trials both arms → report shows
`pass^1` and `pass^k` curve, token/duration delta, and `judge: real`. Re-running on the same locked
skill hash reproduces the same scores.

---

## Phase 3 — Routing intelligence

### 3.1 Coverage expansion
- Auto-generate hard negatives from adjacent skills: for skill X, sample prompts from skills sharing a
  domain/capability and mark `should_trigger=false`. New script `evals/generate-hard-negatives.mjs`.
- Target: every skill in `skill-dev`, `routing`, `project`, `delivery` has a CSV; coverage report lists gaps.

### 3.2 Confusion matrix + regression
- Extend routing report with a pairwise confusion matrix over the CSV set (expected-skill × selected-skill).
- Add `--baseline <previous-report.json>` to compute a routing delta, and fail CI on regression beyond a
  configured threshold (default: any previously-passing row that now fails).

### 3.3 Routing diff on PRs
- Extend `.github/workflows/prompt-regression.yml` to comment on PRs that change any `description` or
  frontmatter fields with before/after routing results for affected skills.

**Validation**: `node evals/run-routing.mjs --check` passes; the confusion matrix identifies at least one
concrete description overlap that is then fixed in a follow-up skill edit (with lockfile re-lock).

---

## Phase 4 — MCP contract layer + packaging

### 4.1 Protocol test suite
- New `tests/mcp/` using stdio handshake against `server.mjs`:
  - `initialize` → capabilities snapshot test (tools/resources/prompts lists).
  - `tools/list` golden snapshot; fail on drift without an intentional update.
  - `tools/call` for `list_skills`, `get_skill`, `a2a_discover`, and one dynamic `skill_<name>` tool.
  - Error paths: unknown tool, unknown skill name, malformed args → JSON-RPC error shape.
- Add `--snapshot-update` flag, documented as the only way to accept a breaking MCP change.

### 4.2 Security policy at the MCP boundary
- Enforce the documented rule (from `.agents/skills/foundation/mcp-server/SKILL.md`): skills with
  `trustTier > 3` are never exposed unless in an explicit allow-list. Add a failing test.
- Add a test asserting no tool response contains content matching a secret pattern (reuse
  `security-scan-skills.mjs` patterns).

### 4.3 Package as a distributable MCP server
- `packages/skill-lab-mcp/` with its own `package.json` (`bin` entry → `server.mjs`), README with
  copy-paste config snippets for Claude Code, Cursor/VS Code, and Kilo.
- Keep the canonical implementation in `.agents/skills/platform/mcp-server/` and have the package be a
  thin wrapper (no duplicated logic), so the lockfile/canonical rule stays intact.

**Validation**: `node --test tests/mcp/*.test.mjs` passes; a snapshot-drift test fails when a tool is
removed and passes after `--snapshot-update`; `npx`-style install smoke test runs `tools/list`.

---

## Phase 5 — Runtime manifests & portability

### 5.1 Compatibility matrix
- Add `schemas/skill-compatibility.schema.json` declaring per-skill runtime targets:
  `portable` (Agent Skills-style minimal fields) vs `runtime-specific` (`hooks`, `paths`, `sideEffects`,
  `trustTier`, `effort`, `model`).
- New script `scripts/check-skill-compatibility.mjs`: fails if a skill marked `portable` uses a
  runtime-only field; warns when a skill declares a target it cannot satisfy.
- Emit the matrix into `registry.yaml` and `CATALOG.md` via the existing `sync-registry.mjs` path.

### 5.2 Runtime manifest generation
- `scripts/build-runtime-manifests.mjs` → `dist/manifests/<skill>.json` derived strictly from frontmatter:
  `role`, `isolation`, `maxTurns`, `tools.allow/deny`, `approval_required`, `verification.commands`,
  `observability.events`. Never hand-edit `dist/`.
- Validate with `schemas/runtime-manifest.schema.json`.

### 5.3 Adapters (generated, not authored)
- `scripts/generate-adapters.mjs` producing from manifests:
  - `.claude/agents/*.md` subagent candidates (tool allowlists, skill preload, `isolation: worktree` where mutating).
  - OpenAI Agents SDK JSON specs (`dist/adapters/openai-agents/`).
  - MCP tool/resource/prompt listing (reuse `server.mjs` discovery, no parallel implementation).
- Rule: adapters are projections. Any capability must exist in the canonical skill first.

**Validation**: compatibility check green; `dist/manifests` regenerates deterministically (`--check` mode);
adapter generation is idempotent (second run produces no diff).

---

## Phase 6 — Sandbox, evals-as-tasks, observability

### 6.1 Skill sandbox runner
- `evals/run-sandbox.mjs`: run a skill fixture inside an ephemeral `git worktree` (default) or a temp dir,
  with `--no-network`, then assert **final state**, not transcript text:
  - expected artifacts exist and match schema,
  - forbidden paths untouched,
  - verification commands exit 0,
  - declared side effects match the observed file/network/command log.
- Cleanup and isolation verification (worktree removed, no leaked processes).

### 6.2 Mini task bench (SWE-bench-style)
- `fixtures/tasks/<id>/` with `repo/` snapshot, `prompt.md`, `expected-state.json`, `validate.sh`.
- Runner scores: resolved / tests-pass / forbidden-edit / review-clean / cost / duration.
- Seed with 3–5 tasks derived from this repo's own history (e.g. regenerate projections, fix a broken
  symlink view, re-lock a hash) so the bench measures *this* Skill Lab.

### 6.3 Observability & replay
- Normalize on the existing `record-execution.mjs` / `audit-trail.mjs` / `otel-skill-instrumentation.mjs`;
  define one JSONL event taxonomy in `docs/reference/agents/skill-run-schema.md`:
  `route.started`, `route.selected`, `context.loaded`, `tool.called`, `artifact.created`,
  `gate.executed`, `verification.result`, `handoff.created`, `failure.classified`.
- `evals/replay-skill-run.mjs`: re-run a recorded run against the same locked skill and diff artifacts.
- Optional exporter to OTel/LangWatch shape (no runtime dependency in core).

**Validation**: one sandbox run of a mutating skill completes, asserts final state, cleans up; replay of
that run reproduces identical artifacts; `record-execution.mjs` output validates against the new schema.

---

## Cross-cutting rules (apply to every phase)

1. Canonical source rule: only `.agents/skills/**/SKILL.md` is authored. `.claude/skills/`, `dist/`,
   `CATALOG.md`, `llms.txt`, marketplace JSON and lockfile hashes are regenerated, never hand-edited.
2. Any `SKILL.md` edit requires `skills-lock.json` re-lock and a full gate run.
3. Nothing may post to the live issue tracker or open real PRs from CI.
4. New scripts must be dependency-free Node (`.mjs`) consistent with the existing platform style, and must
   be registered in `check-all.mjs` as report-only first, blocking only after a stable baseline exists.
5. Every new check needs a unit test under `tests/` and a fixture under the relevant `fixtures/` tree.

## Risks & mitigations

| Risk | Mitigation |
|---|---|
| Behavioral runner cost/API flakiness blocks CI | Secrets-gated separate workflow; mock mode remains the default; blocking only optional |
| Layer 0 false confidence ("green means it works") | Loud mode banners (Phase 1.2); docs already warn — make runtimes enforce it |
| Adapters drift from canonical skills | Adapters generated from manifests only; `--check` idempotency gate |
| MCP surface grows unsafe | trustTier allow-list + secret-pattern test + snapshot gate |
| Sandbox runner leaks state | worktree/temp-dir cleanup + post-run isolation assertions |
| Version drift (already present) | Single source of truth + existing consistency test extended to all projections |

## Out of scope

- Rewriting the existing canonical skills' content or collapsing domains.
- Replacing the lockfile/registry/sync architecture.
- Multi-tenant or hosted deployment of the Skill Lab.
- Building a bespoke agent loop (runners orchestrate external harnesses only).

## Open questions for the user

1. Default provider/model for `run-record.mjs`: Anthropic API via `--command` wrapper (recommended), or a
   specific coding-agent CLI harness you already use?
2. Should Phase 4.1 MCP snapshot drift be blocking or report-only for the first release?
3. Preferred sandbox backend default: ephemeral `git worktree` (recommended, no Docker dependency) or Docker?
