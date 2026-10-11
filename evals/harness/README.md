# A/B Runner (Layer 1 real sessions)

`run-ab.mjs` is the bridge between the paired-eval protocol described in
[`../README.md`](../README.md) and a provider that can actually run a session.
`../run-behavioral.mjs` scores transcripts that some harness already recorded;
this runner is the harness that records them, so a with-skill versus baseline
delta can be measured instead of assumed.

Nothing here re-implements scoring. The two recorded arms are handed to
`run-behavioral.mjs`, and every assertion, `pass^k` curve, cost delta, and
verdict in the report comes from that scorer's own exported functions.

## Two modes of the same Layer 1 question

| | Manual mode (`run-behavioral.mjs`) | Harness mode (`run-ab.mjs`) |
|---|---|---|
| Who runs the agent | an external agent harness (Claude Code, Codex, a human) | this runner, one child process per arm per trial |
| What the operator supplies | `--fixture` plus a recorded transcript per arm | `--fixture` plus provider configuration |
| Isolation of a session | whoever recorded it decides | enforced: fresh temp workspace and fresh process, no carry-over |
| What it proves | the scorer works, and the recording says X | the scorer works, and the two arms really differed by Y |
| Typical use | re-scoring a stored recording, CI smoke test | a real A/B measurement before a skill is promoted |
| Network | none | one provider call per turn |

Both modes emit the same report shape, because both call the same
`runFixture`/`buildDelta`/`verdictFor`/`obsolescenceSignal`/`renderMarkdown`
functions. A `--dry-run` harness plan and a scored manual run are therefore
directly comparable.

## The protocol this runner enforces

The five rules from [`../README.md`](../README.md) ("Protocol: with skill vs
without skill") are enforced here rather than left to discipline:

1. **Two arms per trial.** `with-skill` and `baseline` both run for every trial.
   The baseline never sees the skill, in neither its system prompt nor its
   workspace.
2. **A fresh isolated session per arm and per trial.** Each session is a child
   process with its own temporary workspace (`mkdtemp` under the system temp
   directory), seeded with only that arm's material. No messages, artifacts, or
   files carry from one session into the next, and workspaces are deleted once
   their record has been read (`--keep-workspaces` keeps them for debugging).
3. **The same model snapshot in both arms.** Both arms are served by one
   resolved model, endpoint, and temperature. After recording, the snapshots the
   two arms actually received are compared, and a mismatch aborts the run with a
   protocol-violation error instead of publishing what would be a model
   comparison wearing a skill's name.
4. **At least 3 trials per arm.** `--trials` accepts 3 or more; anything lower is
   refused. Without `--trials`, the runner uses `max(3, fixture.trials)`.
5. **`pass^k` and cost recorded.** Token counts and duration come from the
   provider's usage block, cost from `estimateCost` with an explicit price table
   (`--price-in` / `--price-out`, or the built-in approximate list prices), and
   `pass^k` for `k = 1..recorded trials` is computed by the scorer. When no price
   is configured, `costUsd` stays null rather than being invented.

## Running

```bash
# validate a fixture and print the plan: no provider session, no report, exit 0
node evals/harness/run-ab.mjs --fixture evals/behavioral/to-spec.json --dry-run
node evals/harness/run-ab.mjs --fixture evals/behavioral/to-spec.json --dry-run --json

# a real A/B run (needs the configured key in the environment)
node evals/harness/run-ab.mjs --fixture evals/behavioral/to-spec.json

# override the snapshot, the endpoint, or the pricing
node evals/harness/run-ab.mjs --fixture evals/behavioral/to-spec.json \
  --model claude-sonnet-4-5 --endpoint https://api.anthropic.com/v1/messages \
  --price-in 0.003 --price-out 0.015

# replace the built-in loop with an external harness for either arm
node evals/harness/run-ab.mjs --fixture evals/behavioral/to-spec.json \
  --with-cmd "claude -p --output-format json"
```

Provider configuration is read from
[`../judge/judge.config.json`](../judge/judge.config.json) (`judgeModel`,
`judgeProvider`, `endpoint`, `apiKeyEnv`, `temperature`), and every field can be
overridden with a flag. `--dry-run` prints the resolved plan, so the exact
snapshot, session count, and tool set a run will use can be checked before any
call is made.

### Flags

| Flag | Effect |
|---|---|
| `--fixture <file.json>` | the fixture to run (required for anything but `--help`) |
| `--trials <n>` | trials per arm; 3 is the floor, and the default is `max(3, fixture.trials)` |
| `--model <id>` / `--provider <id>` / `--endpoint <url>` | override the resolved model snapshot |
| `--api-key-env <VAR>` | name the environment variable that holds the key |
| `--price-in <usd/1k>` / `--price-out <usd/1k>` | exact token prices instead of the approximate table |
| `--judge` / `--mock-judge` | force the judge mode (otherwise: live when the key is present, mock when it is not) |
| `--out <dir>` | report directory |
| `--json` | emit the report as JSON on stdout, progress on stderr |
| `--quiet` | suppress the per-session progress lines |
| `--keep-workspaces` | keep the per-arm temporary workspaces after the run |
| `--arm-timeout <ms>` | per-session timeout of the arm child process (default 600 000) |
| `--dry-run` | validate and print the plan; no network, no report |

### The provider key

The key is read from the environment variable *named* by the resolved
`apiKeyEnv` (default `ANTHROPIC_API_KEY`), and is handed to each arm child
through its environment only. It is never printed, never logged, and never
written to disk: not into the plan, the record, the transcript, or the report.
When the variable is empty, a real run stops with a clear error and `--dry-run`
still succeeds, because CI has no key and must still be able to validate a
fixture.

### `--with-cmd` / `--baseline-cmd`

These flags replace the built-in loop for one arm with an operator-supplied
command. The parent still creates the fresh workspace, writes the plan
(`AB_PLAN`), and expects a record at `AB_RECORD`; the command also receives
`AB_ARM`, `AB_TRIAL`, `AB_SKILL`, `AB_WORKSPACE`, `AB_TOOLS`, `AB_MAX_TURNS`, and
the model configuration. This is the seam for a real agent runtime that records
its own session, and it keeps the isolation and scoring rules of this runner.

## What an arm session looks like

- The **baseline** arm receives the fixture prompt plus the fixture context.
- The **with-skill** arm receives the same task, plus the canonical `SKILL.md`
  body injected as an instruction block, and a copy of that file in its
  workspace. Only `SKILL.md` is loaded: a skill's `references/` tree stays
  unloaded until the skill asks for it, which is the progressive-disclosure
  behaviour a real harness has.
- The agent may use local deterministic tools for at most 5 turns. Every tool
  call is recorded, including the ones that were refused.
- The final answer becomes the arm's artifact and the last `message` event in
  the transcript.

## Transcript format

The runner writes newline-delimited JSON, one file per arm, using only the six
event types the scorer understands, so its recordings are indistinguishable from
hand-recorded ones:

```json
{"type":"session","skill":"routing/ship-subissue","mode":"with-skill","trial":1,"model":"claude-sonnet-4-5","ts":"2026-10-11T05:00:00.000Z"}
{"type":"message","role":"user","content":"<prompt plus fixture context>"}
{"type":"message","role":"assistant","content":"<assistant text>","turn":1}
{"type":"tool_call","name":"read","input":{"path":"context/notes.md"},"id":"call_1","turn":1,"rejected":false}
{"type":"tool_result","name":"read","toolUseId":"call_1","ok":true,"rejected":false,"reason":null,"content":"<output>","turn":1}
{"type":"artifact","path":"evals/results/harness/artifacts/<skill>-<ts>-with-skill-trial-1.md","sha256":"<hex>","bytes":1234,"text":"<final answer>"}
{"type":"end","status":"completed","tokens":{"input":1600,"output":570},"costUsd":0.0355,"costEstimated":true,"durationMs":265,"turns":2,"harness":"evals/harness/run-ab.mjs"}
```

`{"type":"trial","index":2}` separates trials inside one file. Trial grouping,
token, cost, and duration totals are all read back by
`loadTranscript`/`runFixture` from `../run-behavioral.mjs`.

## Tools and allowlists

| Tool | What it does | Boundary |
|---|---|---|
| `read` | reads a UTF-8 text file inside the arm workspace | rejects binary content, truncates at 20 000 bytes |
| `list` | lists a directory inside the arm workspace | capped at 200 entries |
| `grep` | searches workspace files for a pattern | capped at 50 matches, skips binary files |
| `shell` | runs one allowlisted command | see below |

The `shell` tool never starts a shell. A command is tokenised by this runner
(quote-aware), must contain no metacharacter or expansion, must begin with an
allowlisted binary and its fixed leading arguments, and every file operand must
resolve inside the arm workspace:

| Allowed command | Notes |
|---|---|
| `node --check <file>` | syntax check only |
| `ls [path]` | |
| `cat <file>` | |
| `grep <pattern> <file>` | |

Anything else — `rm`, `git`, `curl`, `gh`, a pipe, a redirection, a `$(...)`
substitution, or an operand pointing outside the workspace — is refused and
recorded in the transcript as a rejected `tool_call` with its reason, rather than
being silently dropped. A refusal is evidence: the transcript shows the arm tried
something the sandbox would not allow.

## Reports

A real run writes, into `evals/results/harness/` (override with `--out`):

- `<skill>-<ts>.with-skill.jsonl` and `<skill>-<ts>.baseline.jsonl` — the two
  recorded arms,
- `artifacts/<skill>-<ts>-<arm>-trial-<n>.md` — the final answer of each session,
- `<skill>-<ts>.report.json` and `<skill>-<ts>.report.md` — the scorer's report,
  plus a `harness` block with the session count, the resolved model and its
  pricing source, the trials recorded per arm, the failed sessions with their
  error, and the protocol flags this run actually applied.

The report's verdict is one of `keep`, `keep-with-justification`,
`regression-zero-delta-at-positive-cost`, `regression-negative-delta`,
`no-effect`, or `not-applicable`. Zero delta at positive cost is the failure mode
that doc-shape checks cannot see: the skill loads, consumes context and tokens,
and changes nothing observable.

## `--dry-run` is the CI mode

`--dry-run` validates the fixture against the scorer's schema, resolves the
provider and judge configuration, and prints the plan (as JSON with `--json`):
session count, arms and their injected material, model snapshot, tool set, shell
allowlist, cost pricing, and output paths. It makes no network call, starts no
child process, and writes no report, so it exits 0 on a clean fixture even with
no key present. That is what CI should run; a real A/B run is an operator action.

## Known limitations

- Judge assertions still go through [`../judge/grader.md`](../judge/grader.md).
  Without a key they are echoed rather than graded, and the report says so: the
  verdict then rests on the deterministic assertions alone.
- The built-in tool set is deliberately small and deterministic. It exists to
  give an arm something real to inspect, not to be a coding environment; use
  `--with-cmd` for a full agent runtime.
- Cost is an estimate unless the provider returns its own figure. The table of
  approximate list prices is overridable, and an unknown model reports
  `costUsd: null` rather than a guessed number.
- The runner inherits the scorer's limits: `pass^k` is an upper bound when
  trials share a failure cause, and Wilson intervals are wide at 3 trials, which
  is why 3 is a floor and not a target.

## References

- [`../README.md`](../README.md) — the Layer 1 protocol, `pass^k`, and the
  cost-first reporting rules this runner enforces.
- [`../run-behavioral.mjs`](../run-behavioral.mjs) — the paired scorer whose
  functions this runner calls.
- [`../judge/judge.config.json`](../judge/judge.config.json) — the pinned judge
  snapshot that also supplies the default provider configuration.
- [`../../.agents/skills/platform/tests/ab-harness.test.mjs`](../../.agents/skills/platform/tests/ab-harness.test.mjs) —
  the deterministic test suite for the arms, the loop, the allowlist, and the
  transcript format.
