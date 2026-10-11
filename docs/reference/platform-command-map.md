# Platform command map

> Reference for the platform tooling of this repository. Every row maps a symptom
> to one exact command, the output that command prints, and the exit code it
> returns, so a broken bundle can be triaged without reading the tool sources.
> This is a description, not a tutorial: it assumes you know why you are here and
> only need the command and its reading.

Every command below runs from the repository root, which is the root all platform
tools use. Exit codes follow the platform convention: `0` success, `1` a real
failure the caller must act on, `2` a usage or I/O error that never touched the
bundle, and `3` the divergence verdict of a replay or verifier.

## Gate and drift

| Symptom | Command | Expected output | Exit code |
| --- | --- | --- | --- |
| The gate fails and I do not know what | `node .agents/skills/platform/check-all.mjs` | JSON report. Read `checks[]` for the gating commands with their `status` and `code`, `reportChecks[]` for report-only audits that never flip the gate, `skippedChecks[]` for checks with no input on this tree, and `summary` for `failed`, `totalErrors`, `totalWarnings`, and `skillsEvaluated`. A failing check also prints its stdout and stderr after the report. | `0` every gating check passed; `1` at least one failed |
| A `SKILL.md` changed and the lockfile drifted | `node .agents/skills/skill-dev/lockfile-maintenance/scripts/update-lockfile.mjs --write` | JSON with `mode: "write"`, `status: "drift"`, the `added`, `updated`, and `removed` skill ids, and `changed`. Run it once without `--write` first to see the drift without touching the file. | `0` written; the dry run exits `1` while drift exists and `0` when the lockfile is clean |
| Broken or absolute symlinks under `.claude/skills/` | `node .agents/skills/platform/fix-compatibility-view.mjs --write` | JSON or text report of the repairs it applied to the generated compatibility view, one entry per repaired link. | `0` view clean or every repair applied; `1` a repair failed or the view is unreadable; `2` usage error |
| The projections are out of sync | `node scripts/sync-registry.mjs --write && node scripts/generate-site-data.mjs --write` | `sync-registry` rewrites `registry.yaml`, `CATALOG.md`, `llms.txt`, and the marketplace manifest; `generate-site-data` rewrites `site/src/skills.json`. Both print `Wrote <path>` per artifact, and a dry run without `--write` prints `Would write <path>` instead. | `0` written; `1` an I/O error stopped the run |
| I want to see the state of the bundle | `node .agents/skills/platform/scripts/build-skill-dashboard.mjs --write` | One static HTML page at `.agents/skills/platform/dashboard/index.html` plus one card per skill under `.agents/skills/platform/skill-cards/`. Without `--write` it is a dry run that prints what it would write and the bundle totals. | `0` dry run or written; `1` write failure; `2` usage error |

## Finding and routing a skill

| Symptom | Command | Expected output | Exit code |
| --- | --- | --- | --- |
| I want to find the skill for a task | `node .agents/skills/platform/scripts/search-skills.mjs "review a pull request"` | Ranked hits, one per line: position, `<domain>/<name>`, score, and the truncated description. `--limit N` bounds the list, `--json` emits the machine-readable ranking, `--explain` adds the matched terms and their contribution. | `0` ranked, including a query that matches nothing |
| The keyword search misses and I want graph reach | `node .agents/skills/platform/skill-graph.mjs rank "review a pull request"` | The same seed scoring the MCP server uses: exact name matches, then per-token hits over name, capabilities, and description, propagated over the typed edges. `--limit N` bounds the list. | `0` ranked |
| I want routing from an agent client | MCP server `route_task` | The server routes a natural-language task through the shared graph and returns the top matches (`limit`, default 3, maximum 10). `allowHighTrust` opts in to skills above trust tier 3. | protocol response; tool errors surface as server errors |
| Routing sends the request to the wrong skill | `node evals/run-routing.mjs --check` | Validation of every CSV in `evals/routing/`: the prompts, the expected skill, the negative controls, and the metric thresholds. A row that fails names the CSV and the prompt. | `0` every CSV valid and inside thresholds; `1` a validation error or threshold breach |
| I need more negative controls for a skill | `node .agents/skills/platform/scripts/generate-hard-negatives.mjs --skill delivery/code-review` | Proposed negative rows drawn from the prompts of the adjacent skills, three per skill by default. `--write` appends them to the routing CSV, `--min N` changes the count, `--routing <dir>` points at another fixture directory. | `0` dry run or written; `1` write failure; `2` usage error |

## Trust and security

| Symptom | Command | Expected output | Exit code |
| --- | --- | --- | --- |
| A new skill looks suspicious | `node .agents/skills/platform/scripts/skill-lint-security.mjs .agents/skills/<domain>/<skill>` | Per skill: a verdict, a risk score, the findings of the supply-chain scanner, and the undeclared side-effect checks (write, network, shell, approval, trust-tier mismatch, credential mixing). `--json` emits the report. | `0` verdict `install`; `1` verdict `review`; `2` verdict `quarantine` or usage error |
| I want the whole bundle scanned before I trust it | `node .agents/skills/platform/security-scan-skills.mjs --strict` | Findings grouped by file with severity, rule, and an evidence line, then a total per severity. `--json` emits the same with `byRule` and `summary`. `--deep` adds the skill-bundled working directories. | `0` no high or critical finding; `1` at least one with `--strict`; `2` usage or I/O error |
| I want to know whether a skill obeys the tool policy | `node .agents/skills/platform/check-tool-risk-policy.mjs --skill delivery/code-review` | Per skill: the declared risk and trust tier, the tools the runtime manifest allows and denies, and every policy violation with the rule that fired. `--json` emits the report, `--policy <path>` uses a different policy file. | `0` clean; `1` policy violated, or warnings too with `--strict`; `2` usage or unreadable policy |

## Runtime manifests and execution

| Symptom | Command | Expected output | Exit code |
| --- | --- | --- | --- |
| The runtime manifests are stale | `node .agents/skills/platform/scripts/build-runtime-manifests.mjs --write && node .agents/skills/platform/validate-runtime-manifests.mjs --check` | The generator rewrites one manifest per skill plus their README and reports the count per role, isolation, agent, and model tier. The validator then checks schema, coverage, and hash freshness against the current frontmatter. | generator `0` written, `1` write failure, `2` usage; validator `0` pass, `1` errors exist, `2` usage |
| I want to reproduce a recorded run | `node .agents/skills/platform/scripts/replay-skill-run.mjs --verify .agents/skills/platform/skill-runs/<run>.jsonl` | The reconstructed trace plus the format invariants: lifecycle order, one `run.completed`, a declared skill per trace, unique span ids, parents that exist. `--compare a.jsonl b.jsonl` diffs two traces field by field. | `0` verified and identical; `1` failure; `2` usage; `3` divergence or an unverifiable trace |
| I want to run a declared task in a sandbox | `node .agents/skills/platform/scripts/run-skill-task.mjs <task-id>` | The task plan, the per-step verdicts, and the artifacts the run produced. `<task-id>` is either a task id under `platform/tasks/` or a task file; `--list` shows the available tasks, `--verbose` adds per-step detail. | `0` pass; `1` fail or error; `2` usage or schema error; `3` blocked by the allowlist |
| I want to regenerate the downstream adapters | `node .agents/skills/platform/scripts/generate-adapters.mjs --write` | One file per skill per runtime plus one README per runtime and the bundle-wide MCP manifest; the report counts the adapters and the stale files it pruned. `--runtime` and `--skill` narrow the run. | `0` dry run or written; `2` usage or I/O error |

## Cost, context, and workflow debugging

| Symptom | Command | Expected output | Exit code |
| --- | --- | --- | --- |
| I want to see what a run cost | `node .agents/skills/platform/cost-ledger.mjs --json` | Token, duration, and estimated dollar totals grouped per skill or per day, from the recorded traces and the shipped cost model. `--since` bounds the window, `--no-estimate` suppresses the dollar figures. | `0` report printed; `2` usage or I/O error |
| I want the cost view from the lab CLI | `node .agents/skills/platform/skill-lab.mjs cost --by-skill` | The same ledger behind the lab command surface, with `--by-day` and `--since` as alternatives and `--json` for the machine-readable form. | `0` report printed |
| I want to launch real A-B evaluations | `node evals/harness/run-ab.mjs --fixture evals/behavioral/<skill>.json --dry-run` | Arm plan only: the fixture, the two arms (`with-skill` and `baseline`), the trial count, and the provider and model that would run. `--dry-run` never touches the network; dropping it launches the paired sessions and hands both arms to the behavioral scorer. | `0` run or dry run completed; `1` validation, key, or arm failure; `2` usage or I/O error |
| A workflow is stuck and I want to know why | `node .agents/skills/platform/workflow-state-machine.mjs <workflow> replay` | The checkpoint journal folded back into a state object. Folding the journal reproduces the persisted snapshot exactly; a guard decision that disagrees with the recorded one is reported as a `divergence`. `--to` and `--from` fold a prefix, and `legal-events` prints what is legal from the folded state. | `0` ok or no journal; `1` usage; `3` divergence |
| A loop will not terminate | `node .agents/skills/platform/loop-runner.mjs --demo --json` | The demo loops with their typed exits, showing how the budget and format-error ceilings are hit: `exitStatus`, `submission`, `budgetSpent` (steps, cost, wall time), and `nudges`. | `0` demo ran; `1` a loop misbehaved in the demo |
| A retry may have doubled an effect | `node .agents/skills/platform/idempotency.mjs --demo` | The narrated effect sandwich: a claim recorded before the effect, the outcome committed after it, and a retry that finds only a claim reported as outcome-unknown instead of re-executing. | `0` demo ran |
| I want to measure the context the bundle costs | `node .agents/skills/platform/context-budget-auditor.mjs --no-write` | Per-skill token estimates, a ranking of the largest skills, and the bundle total, with `--compare` diffing against the stored snapshot and `--top n` sizing the ranking. | `0` report printed; `2` usage or I/O error |
| I want the spec-conformance verdict | `node .agents/skills/platform/validate-spec-compliance.mjs --json` | Per-skill conformance to the skill specification frontmatter contract, with each rule that failed and the skill that failed it. | `0` no errors; `1` at least one error; `2` usage or I/O error |

## Conventions every tool shares

- The root is the working directory; pass `--root <dir>` where a tool accepts it.
- JSON reports are printed to stdout with two-space indentation, so they can be
  piped into a file without post-processing.
- Dry runs are the default for anything that writes. `--write` is the explicit
  opt-in, and a dry run reports what would change rather than changing it.
- Report-only audits run inside the gate and print their findings, but they never
  flip its verdict; only the gating checks decide the exit code.
- Generated directories such as `dashboard/`, `skill-cards/`, `manifests/`, and
  `adapters/` are pure functions of the bundle, so re-running a generator over
  unchanged content writes byte-identical bytes.
