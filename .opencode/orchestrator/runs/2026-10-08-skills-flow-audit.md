# run: skills-flow-audit   status: active
request: Audit the whole skills flow end-to-end for errors, fix what is broken, investigate what else needs updating — acceptance: CI can actually fail; all 254 canonical skills visible to all tooling; generated artifacts provably consistent with the canonical set; the installed npm package works; gates stop polluting the working tree.

base: `main` @ `02a1064` (tracks `origin/main`)

| id | kind | status | complexity | model | session | worktree/branch | validated_commit | rounds | depends_on |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| (plan) | decomposition | pending | — | — | — | — | — | — | — |

## Decisions

- 2026-10-08: Run the audit read-only first (no worktrees, no plan approval needed) — the user asked to *find* errors, and dispatching implementers before the findings are agreed would burn rework.
- 2026-10-08: Split exploration 4 ways by concern rather than by directory, so each `explore` agent owned one coherent failure surface: pipeline integrity, parity/docs/hygiene, platform tooling + flow map, tests/CI/packaging.
- 2026-10-08: **Falsified two of my own pre-audit conclusions.** (a) `validate-skills.mjs`'s walk is recursive — the 12-skill gap is *solely* the `ignored = new Set(['platform'])` at `:10`, not a nesting assumption. (b) `.agents/skills/implement` is a symlink to `delivery/implement`, not a depth-1 skill; the depth histogram is 248×2, 6×3, 0×1. Both corrections are now in `learnings.md`. (rejected: keeping my initial framing, which would have produced the wrong fix — a rewrite of the walk instead of removing the ignore set.)

## Findings & risks

Findings carry `file:line` evidence in `learnings.md` ("Known defects"). The load-bearing ones:

1. **CI cannot fail.** `validate.yml:35` requests `cache: "npm"` with no root lockfile → Setup Node.js fails and all 17 gates skip (the current red run). Every gate is piped through `tee` under GitHub's default `bash -e` (no pipefail) → exit status is tee's 0 even if the pipeline is fixed. `quality-report.yml:25` has `|| true`.
2. **The live CI failure is 7 absolute symlinks** in `.claude/skills/` (`graphic-design-*` → `/home/quantumquirkxyz/...`), tracked as mode 120000 and unusable in any clone.
3. **Discovery is duplicated 4+ times and 5 of 6 implementations skip `platform/`** → 242 vs 254. Divergent counts reach every projection (229 site, 241 cards, 234 CATALOG header) and **no gate compares any two**.
4. **`registry.yaml` is JSON parsed as YAML** → `sync-registry.mjs` returns `{}`; `npm run sync --write` is currently a **regression, not a refresh**. Any regen before this is fixed corrupts committed artifacts.
5. **The installed package is broken**: `bin/skills-quirk.js:9` resolves the bundle from `process.cwd()` (the consumer's dir), `files[]` omits `skills-lock.json`/`.claude/`/`docs/` which shipped code requires, and `llms.txt:11` advertises `npx skills-quirk add` — a command that does not exist.
6. **A green `npm test` always leaves the tree dirty** — `workflow-state-machine.mjs:7` STATE_DIR is unoverridable, `record-execution.mjs` appends traces, and `.gitignore`'s only platform rule is dead (253 files tracked under an ignored path).

### Risks

- **R1 — Making CI able to fail may turn the repo red on latent failures nothing has ever executed.** No drift gate, schema validation, or bundle-level score/security gate has ever actually run in CI. Fixing the plumbing can surface a wall of pre-existing failures that is not a regression from my change but will still look like one.
- **R2 — The regen diff is enormous** (CATALOG.md 47KB, llms.txt 55KB, ~250 agent cards) and mechanical. A reviewer must still be able to judge it. Sequencing it behind the parser fix is mandatory.
- **R3 — Removing the `platform` ignore amplifies the `.claude/` category-symlink problem** from 32 links to 38, and changes what the backfill emits. Symlink repair must land before or with discovery, not after.
- **R4 — `security`/`score` are single-skill tools wired as bundle-level npm scripts.** "Fix" could mean either rewriting them to be bundle-wide or adding an aggregate. Different scopes; needs a default.
- **R5 — Owner decisions cannot be defaulted**: (a) 73 skills categorized `skill-dev/sandbox` while living in `ai/ backend/ data/ …`; (b) 32 undocumented `.claude/skills/` category symlinks including the `research` skill-vs-category name collision; (c) version alignment (VERSION 2.0.0 / CHANGELOG 2.1.0 / package.json 1.0.0 / marketplace.json absent); (d) root `AGENTS.md` missing while `.agents/AGENTS.md` routes to it.
- **R6 — `skill-evolver.mjs:184` never re-locks.** Auto-relocking in a validator would hide genuine drift; not auto-relocking means `evolve` is a footgun. Needs a decision, not a patch.

### Repo pollution from my own audit (must be cleaned before closure)

- `.agents/skills/platform/traces/2026-10-08.jsonl` — untracked, created by my gate runs. My `rm` was denied by shell permissions; a sub-agent must remove it.
- `.agents/skills/platform/state/standard-feature.json` — was modified by `npm test`; I already restored it with `git checkout --` (my own residue only).
