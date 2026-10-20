# Skill Lab Gap Analysis and v4 Roadmap

Date: 2026-10-19 (updated 2026-10-20 after the 3.1 truth pass)
Baseline: `skills-quirk` 3.0.0 (254 shippable skills, 266 repository skills)
Method: internal capability audit, repeated validation runs, external source review
(Agent Skills specification, arXiv routing research, skills.sh, OWASP AST10,
MCP Skills extension, and the repository's own 2026-10-11 research note).

This document separates **verified repository facts** from **external evidence**.
It does not repeat capabilities the lab already ships; those are listed first so
future work does not rebuild them.

---

## 1. Verified baseline

| Signal | Value | Evidence |
|---|---|---|
| Shippable skills | 254 | `validate-skills.mjs` |
| Repository skills | 266 | `audit-semantics.mjs` |
| Full gate | 21/21 gating checks pass | `check-all.mjs` |
| Test suite | 462 tests, 462 pass, 0 flaky | `node --test` (456 platform + 6 root) |
| Documentation links | 1,900 local links, 0 broken | `docs-links.mjs` |
| Compatibility view | 266/266 canonical skills, directory links only | `fix-compatibility-view.mjs` |
| Spec compliance | 0 errors, 0 warnings, all bodies < 500 lines | `validate-spec-compliance.mjs` |
| Security scan | 0 findings in default and `--strict` | `security-scan-skills.mjs` |
| Traceability | 60 clauses, 60 resolved | `validate-traceability.mjs` |
| Routing evals | 203 rows, 60 negative controls, 0 errors | `evals/run-routing.mjs --check` |
| Behavioral evals | 20 fixtures, mock judge | `evals/run-behavioral.mjs --all` |
| Skill graph | 254 nodes, 85 edges | `skill-graph.mjs` |
| Tool-risk debt | 0 error findings, zero-error budget | `policy/tool-risk-budget.json` |
| Quality debt | mean 69.1, median 66, 151 D, 4 F | `docs/quality-debt-inventory.md` |

The lab already implements a large surface most peer projects do not:
schema validation, spec compliance, semantic audit, quality scoring, security
scanning, traceability clauses, routing and behavioral evals, a skill graph,
MCP serving, execution traces, cost accounting, workflow state machines,
idempotency ledgers, loop budgets, generated cross-agent adapters, and a
hash-carrying lockfile. Proposals below assume those stay.

### 3.1 truth pass (2026-10-20)

The first stability pass closed the truth defects that could make the baseline
lie about itself:

- Markdown links are now a gating check: `docs-links.mjs` walks every tracked
  documentation tree, skips fenced examples and external URLs, and fails when a
  relative target is missing or escapes the checkout.
- The `.claude/skills/` compatibility view is repaired and validated as one
  relative directory symlink per canonical skill. Domain aliases, direct
  `SKILL.md` links, dangling links, and missing skills are all rejected.
- Native Cursor, Gemini, Copilot, OpenCode, and Windsurf views were regenerated
  to the 254-skill public projection.
- The accidental root `memory` sink was removed from version control. The
  recorder's `sink: 'memory'` sentinel was being matched after the generic file
  path branch, so tests appended JSONL to a tracked file named `memory`.
- Task traces now measure duration with `performance.now()` and anchor
  `completedAt` to `startedAt`, closing the same backwards-clock class in the
  task harness.
- The two Claude manifests are now pinned to `VERSION`, and the stale 246/258/
  1484 counts and removed research paths were corrected or replaced with stable
  references.

---

## 2. External evidence that matters

### 2.1 Routing collapse is the dominant scaling risk

arXiv 2610.18522 ("Lost in Implicit Routing", Oct 2026) holds tasks and golden
skills fixed while adding irrelevant skills. With 1,000 irrelevant skills,
loaded-skill recall falls from 73.6% to 27.4% and the zero-load rate rises from
9.3% to 51.6%; explicit selection from the same library retains 73.9% recall.
Masking the descriptions of irrelevant skills largely restores loading, but
asking the agent to plan does not match preselection.

Implication: a 254-skill library is already in the regime where discovery must
be engineered, not assumed. The lab has a BM25 index and a routing eval, but no
preselection/masking layer and no large-distractor benchmark.

### 2.2 The portable unit is the skill, not the folder

The Agent Skills specification defines `name`, `description`, optional
`license`, `compatibility`, `metadata`, and experimental `allowed-tools`.
skills.sh and similar installers win adoption by making `add`, `update`, and
cross-agent placement reliable. Peer package managers (skillpm, HappySkills)
add dependency resolution, version pinning, provenance, and conflict detection.

Implication: the lab's `registry.yaml`, `skills.json`, and lockfile are strong
metadata, but there is no install/update/rollback contract and no dependency
resolution. `npx skills-quirk` is declared, not implemented.

### 2.3 Security is moving from scanning to hash-bound approval

OWASP AST10, Snyk ToxicSkills, and the MCP Skills extension converge on the same
mechanism: a manifest lists every supporting file with `{uri, digest, size}`,
and approval binds to the complete digest set. A changed, added, or removed file
revokes approval. The lab records one SHA-256 per skill and scans `SKILL.md` plus
scripts, but approval is bound to a skill name/version, not to its full file set.

Implication: the highest-value security upgrade is a per-file digest manifest
with hash-bound approval, not another pattern rule.

### 2.4 Community pain is operational, not theoretical

Recurring complaints across Reddit, GitHub issues, Hacker News, and practitioner
writeups: skills present but never triggered; no way to see why a skill fired or
did not; stale and orphaned skills; broken references after reorganization;
context bloat; contradictory instructions; and cross-agent portability failures.
These map directly onto observability, lifecycle, conflict detection, and
installation.

### 2.5 Human-gated improvement remains the state of the art

The repository's 2026-10-11 research note already establishes that no frontier
lab ships autonomous self-modifying skills in production. Anthropic's
skill-creator is verification-first; gskill optimizes skill bodies against task
outcomes with human-run pipelines. The lab's propose-only, evidence-gated
posture is correct and should not be relaxed.

---

## 3. Gaps, ranked

### P0 — Stability and truth (must close before adding capability)

1. **Wall-clock ordering — closed.** `skill-runs.test.mjs` reported a timestamp
   regression when the host clock stepped backwards (confirmed in `dmesg`).
   Session timestamps are monotonic, and the task harness now measures elapsed
   time with `performance.now()` and anchors `completedAt` to `startedAt`.
   Deterministic regression tests cover both paths; a repeated-run soak remains
   in the release checklist.
2. **Tracked trace output — closed.** Running the gate appended execution records
   to the tracked root `memory` file because `sink: 'memory'` was interpreted as
   a relative file path. The sentinel is now checked first, a regression test
   pins the behavior, and the accidental file is untracked.
3. **Dead documentation references — closed.** Current docs cite the
   2026-10-19 analysis or name the historical pack explicitly.
   `docs-links.mjs` now fails the gate on a relative link that does not resolve.
4. **Stale generated claims — closed.** Current docs use 254/266 and 1532
   adapters; `tests/projection-consistency.test.mjs` and the version test pin the
   generated surfaces.
5. **Quality debt is untouched.** 151 D-grade and 4 F-grade skills make the mean
   score a weak signal. The D→C template exists but has not been applied in
   batches.
6. **Tool-risk debt — closed.** All error-severity findings were remediated by
   documenting untrusted-input handling and gating declared mutations.
7. **Metadata holes.** All 266 canonical skills now declare evaluators.
   `routing/worktree-swarm` still has no `fixturesPath` declaration despite
   shipping `behavioral-fixtures/`; the `--deep` scanner has no documented
   baseline for intentional test-fixture positives.

### P1 — Capability gaps with direct user value

1. **Per-file digest manifest and hash-bound approval.** Hash every file in a
   skill directory, bind approval to the set, revoke on any change.
2. **Skill versioning and provenance.** Per-skill semver in frontmatter; lockfile
   entries carry source, revision, author, and content digest.
3. **Install/update/rollback contract.** A real CLI surface (`add`, `update`,
   `rollback`, `verify`) with dry-run and cross-agent placement.
4. **Dependency and conflict resolution.** Resolve declared skill dependencies,
   detect overlapping triggers/instructions, and pin versions.
5. **Preselection and masking for routing.** Bench the library with 1,000
   distractors; add explicit selection and description masking as mitigations.
6. **Compositional routing.** A DAG planner for tasks that need several skills;
   evaluate against a CompSkillBench-style suite.
7. **Observability of routing decisions.** Record why a skill was selected or
   rejected, expose it in traces, and add a "why did this not fire?" report.
8. **Lifecycle analytics.** Invocation counts, last-used timestamps, orphan
   detection, and obsolescence checks (base model passes evals without the skill).
9. **Blind A/B and body optimization.** The lab measures descriptions against
   routing labels; it does not measure skill bodies against task outcomes.
10. **Scanning coverage.** Scan frontmatter, references, fixtures, and companion
    files; normalize Unicode and decode obvious obfuscation before matching.

### P2 — Ecosystem and platform

1. Signed release artifacts and an SBOM; publish digests to a verifiable
   location.
2. Registry/marketplace packaging with a stable index and per-skill changelog.
3. Private/team scopes and access control for non-public bundles.
4. A public benchmark leaderboard for routing at scale.
5. Governance participation in the Agent Skills specification.

---

## 4. Roadmap

Each phase ends with a release gate. No phase may raise a security budget to
pass, and no phase may weaken an existing check to ship.

### Phase 3.1 — Stability and truth (1–2 weeks)

- Run a repeated full-gate soak (at least three consecutive clean runs) so a
  backwards clock step cannot hide behind a single green run.
- Resolve the tracked `memory` trace archive: document it or isolate every test
  sink in a temp directory, and add a gate assertion on working-tree cleanliness.
- Restore or redirect the dead research references; add a documentation link
  check to the gate.
- Derive all skill counts from one generated manifest; remove hard-coded counts
  from docs and tests where possible.
- Add `evaluators` to the remaining skills; give `worktree-swarm` a real fixture; add a
  documented `--deep` baseline.
- Refresh the quality inventory with the current scorer; select the first 20
  D/F skills and apply the D→C template.
- Reduce the tool-risk budget from 84 to 0 with documented untrusted-input
  handling and approval gates.

**Exit criteria:** three consecutive clean full gates; zero tracked-file writes
from tests; zero dead doc links; budget reduced and locked; inventory refreshed.

### Phase 3.2 — Provenance and supply chain (2–3 weeks)

- Add `skill-manifest.json` per skill: every file, size, and SHA-256.
- Bind approvals and trace records to the manifest digest set.
- Extend the lockfile with source, revision, author, and manifest root.
- Scan frontmatter, references, fixtures, and companion files; add Unicode
  normalization and baseline support for intentional positives.
- Add a release command that emits an SBOM and a signed digest list (signing can
  be optional for local runs and required for tagged releases).

**Exit criteria:** any file change invalidates approval; a tampered companion
file fails verification; `--deep` is clean against the documented baseline.

### Phase 3.3 — Routing at scale (3–4 weeks)

- Build a 1,000-distractor routing benchmark from real bundle descriptions.
- Add preselection and description masking; compare against the current BM25
  baseline.
- Add conflict detection for overlapping triggers, capabilities, and explicit
  `conflicts-with` declarations.
- Add compositional routing (DAG) with an artifact contract per edge.
- Record selection/rejection reasons in traces and add a routing-debug report.
- Add blind A/B evaluation and an obsolescence check.

**Exit criteria:** top-3 recall does not regress at 1,000 distractors; routing
decisions are explainable from traces; the compositional suite passes its
contract checks.

### Phase 3.4 — Lifecycle and distribution (3–4 weeks)

- Implement `skills-quirk add|update|rollback|verify` with dry-run defaults.
- Resolve dependencies and pin versions; write a lockfile v2 with provenance.
- Add per-skill changelogs and a compatibility matrix.
- Prove install/update across Claude Code, Codex, Cursor, Gemini CLI, and
  OpenCode with a reproducible fixture repository.
- Add usage analytics and orphan/stale reports from traces.

**Exit criteria:** the same lockfile reproduces the same bundle on all five
agents; update refuses to overwrite a skill without evidence; rollback restores
the previous digest set.

### Phase 4.0 — Platform release

Consolidate the phases into a breaking manifest/lockfile contract with a
migration command, publish the benchmark and quality reports, and cut the next
major release. The 4.0 release is justified only when 3.1–3.4 exit criteria are
met, not by feature count.

---

## 5. Stability protocol

1. **Definition of done:** full gate, version consistency, projection
   consistency, docs link check, and a clean working tree.
2. **Flake policy:** a flaky check is quarantined and fixed within 48 hours; it
   is never retried until green.
3. **Determinism:** no test may depend on wall-clock ordering, network access, or
   a shared mutable sink.
4. **Generated artifacts:** one command regenerates projections; CI fails on
   drift instead of auto-committing.
5. **Security budgets:** may only decrease. An increase requires a dated ADR.
6. **Release checklist:** bump all version surfaces, regenerate projections,
   update the changelog, run the gate three times, tag, publish, and verify the
   release artifact.
7. **Rollback:** every release keeps the previous tag and lockfile restorable;
   install/update paths must support rollback before they ship.

---

## 6. Success metrics for v4

| Metric | 3.0.0 | v4 target |
|---|---:|---:|
| Full gate pass rate over 20 runs | 3 post-fix runs clean; soak continuing | 100% |
| Undocumented tracked-file writes from tests | 0 after the 3.1 truth pass | 0 |
| Dead documentation references | 0 after the 3.1 truth pass | 0 |
| Mean quality score | 69.1 | ≥ 80 |
| D/F grade skills | 155 | 0 |
| Tool-risk error findings | 0 after remediation | 0 |
| Skills with behavioral evidence | subset | all T2/T3 |
| Routing top-3 at 1,000 distractors | not measured | ≥ 90% |
| Install/rollback across 5 agents | not implemented | verified |
| Skills with per-file digest manifest | 0 | 254 |

---

## 7. Sources

- Agent Skills specification: <https://agentskills.io/specification>
- Routing collapse: <https://arxiv.org/abs/2610.18522>
- skills.sh ecosystem: <https://skills.sh>
- OWASP Agentic Skills Top 10: <https://owasp.org/www-project-agentic-skills-top-10/>
- MCP Skills extension: <https://modelcontextprotocol.io/extensions/skills/overview>
- Repository research note: `docs/research/2026-10-11-self-improvement-agent-security-multi-agent.md`
- Repository quality debt: `docs/quality-debt-inventory.md`
- Repository tool-risk debt: `docs/tool-risk-debt.md`

External adoption numbers and incident statistics are reported by the cited
sources; they are directional evidence, not measurements of this bundle.
