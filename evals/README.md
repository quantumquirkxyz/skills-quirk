# Behavioral Eval Harness

This directory holds the **behavioral** evaluation layer for the quirk Skills bundle:
routing (does the right skill fire?) and paired with/without-skill comparison (does the skill
change what the agent produces, and at what cost?).

It exists because the bundle's current checks are *structural*, and structural checks cannot
answer the questions that decide whether a skill is worth shipping.

## The two layers — read this before citing any number

| Layer | What it is | What it proves | What it cannot prove |
|---|---|---|---|
| **Layer 0 — structural gates** | `.agents/skills/platform/fixtures/**`, `evaluate-scenarios.mjs`, `evaluate-behavioral-fixtures.mjs`, `validate-skills.mjs`, `audit-semantics.mjs`, `check-all.mjs` | A `SKILL.md` contains the expected phrases, sections, frontmatter keys, symlink parity, and a matching lock hash | Nothing about runtime behavior. These checks read **documentation text**; no model is invoked, so "the fixture passes" means "the docs are shaped right", never "the skill works" |
| **Layer 1 — behavioral evals** | this directory (`routing/`, `behavioral/`, `judge/`, the two runners) | Trigger rate, false-positive rate against adjacent skills, artifact delta with/without the skill, reliability (`pass^k`), and cost (tokens / duration / $) | Nothing about doc shape — it assumes Layer 0 is green first |

Rule: **never report a Layer 0 result as skill behavior.** When someone says "evaluate-skill is
green", the honest sentence is "its documentation fixtures pass". A claim like "`to-spec` routes
correctly" needs a Layer 1 routing CSV recording, and "`to-spec` improves specs" needs a paired
behavioral run.

## Protocol: with skill vs without skill

Every behavioral case runs twice, as two recorded transcripts:

- `with-skill` — the agent has the skill (loaded / named in the prompt).
- `baseline` (`without-skill`) — the same agent, same model snapshot, same task, **without** the
  skill, in a **fresh isolated session**. No carry-over of prior messages, artifacts, or context.

Rules:

- **Fresh isolated session per case.** A reused session imports the previous task's context and
  makes the baseline look better or worse than it really is.
- **Authoring context masks gaps.** If you generate the case in the session where you are
  *writing* the skill, the agent effectively already has the skill in its context, so the
  baseline stops being a baseline. Author fixtures in one session; record transcripts in a
  separate, clean one.
- Compare against the **same model snapshot** across both arms. A delta measured across two
  different models is a model comparison, not a skill effect.
- Run **at least 3 trials** per arm before believing a delta (see `pass^k` below).
- Hold out a split of the prompts from description tuning (see
  [`references/paired-eval-protocol.md`](../.agents/skills/skill-dev/references/paired-eval-protocol.md)).

## The four success categories

Each judge criterion is tagged to one category (OpenAI's eval-skills taxonomy). Report them
separately; they fail independently and averaging them hides which one broke.

| Category | Question | Where it lands |
|---|---|---|
| **outcome** | Is the task actually done? | `goalCompletion` rubric + deterministic artifact assertions |
| **process** | Did it follow the skill's steps and order? | `instructionFollowing` rubric |
| **style** | Does it follow the skill's conventions (shape, tone, vocabulary, boundaries)? | `instructionFollowing` rubric, style items |
| **efficiency** | What did it cost to get that result? | tokens / duration / `$` from the transcript |

## `pass^k` — why `pass^1` is not enough

`pass^1` is "did it work once?". For a multi-step workflow, the useful number is `pass^k`: the
probability that **k consecutive attempts all succeed** (τ-bench, arXiv 2406.12045).

Worked example, `trials = 5`, per-trial pass rate `p = 0.8`:

| k | Independent-trial estimate | What it means operationally |
|---|---|---|
| 1 | 0.80 | "usually works" |
| 2 | 0.64 | one retry is usually enough |
| 3 | 0.51 | coin flip to get three clean runs in a row |
| 5 | 0.33 | about one attempt in three yields a clean five-run streak |

A skill with `pass^1 = 0.8` and `pass^5 = 0.33` is not a skill an operator can schedule; it is a
skill an operator must babysit. Report `pass^1` **and** the whole `pass^k` curve, and treat
`pass^trials` as the promotion gate for risky skills. The runner emits the curve for
`k = 1..recorded trials`, so a short recording yields a short curve rather than a number the data
cannot support.

Estimator used here: with `n` trials recorded, `pass^k` = (number of size-`k` subsets in which
every trial passed) / C(n, k). It is exact for the recorded trials and deliberately conservative
at `k = n` — `pass^5` is `1` only when all five trials passed. It cannot see correlated failure
either: three trials that fail for the same underlying reason count as three independent
failures, so treat `pass^k` as an upper bound when the failure modes share a cause.

## Cost-first reporting

**Pass rate is never reported alone.** Every run also reports, per arm:

- input/output tokens,
- wall-clock duration,
- cost in USD when the transcript carries it.

Decision rule:

| Delta (with − baseline) | Cost | Verdict |
|---|---|---|
| `> 0` | within budget | keep |
| `> 0` | over budget | justify explicitly, or fix the prompt/artifact |
| `= 0` | `> 0` | **regression** — the skill is paid for and delivers nothing |
| `< 0` | any | **regression** — the skill makes the agent worse |

"Zero delta at positive cost" is the failure mode that phrase-checking cannot see: the skill loads,
consumes context and tokens, and changes nothing observable.

## Transcript recording format

The harness never calls a model. An agent harness records a run, and the runners score the
recording. Both formats are newline-delimited JSON (JSONL).

### Routing recording (`--record`)

One line per routing decision:

```json
{"ts":"2026-10-10T20:14:03.221Z","skill_expected":"skill-audit","skill_selected":"skill-audit","query_ref":"evals/routing/skill-audit.csv#4","triggered":true}
```

| Field | Meaning |
|---|---|
| `ts` | ISO-8601 timestamp of the decision (`tsv` accepted as an alias) |
| `skill_expected` | skill that *should* have been selected for that prompt |
| `skill_selected` | skill the agent actually selected (`""`/`null` = no skill triggered) |
| `query_ref` | `<csv path>#<row>` — 1-based **data** row index, header excluded |
| `triggered` | optional bool; when absent it is derived from the CSV row |

`query_ref` is the join key: it lets the scorer recover `should_trigger` and `category` from the
CSV, so the recording cannot drift from the fixture.

### Behavioral transcript

One JSONL file per arm (`with-skill` and `baseline`):

```json
{"type":"session","skill":"to-spec","mode":"with-skill","trial":1,"model":"<provider/model snapshot>","ts":"2026-10-10T20:00:00.000Z"}
{"type":"message","role":"user","content":"<the prompt>"}
{"type":"tool_call","name":"read","input":{"path":"docs/reference/agents/work-item-format.md"}}
{"type":"artifact","path":"evals/results/artifacts/to-spec-with-trial-1.md","sha256":"<hex>","bytes":2410}
{"type":"end","status":"completed","tokens":{"input":18200,"output":3100},"costUsd":0.0412,"durationMs":214000}
```

Recognized `type` values: `session`, `message`, `tool_call`, `tool_result`, `artifact`, `end`.
`end` carries the cost/duration totals; `session.model` pins the model snapshot. The **final
artifact path** is the last `artifact` event's `path`, or `--artifact <path>` on the command line.

## Running

```bash
# Layer 1: routing
node evals/run-routing.mjs --check                              # validate every CSV (CI gate)
node evals/run-routing.mjs --export                             # one prompt per line, JSONL, for any harness
node evals/run-routing.mjs --export --skill to-spec             # filter one skill
node evals/run-routing.mjs --record evals/results/run-001.jsonl # score a real recording
node evals/run-routing.mjs --mock                               # synthetic recording + full scorer path (CI smoke)

# Layer 1: behavioral (deterministic graders only, no API key needed)
node evals/run-behavioral.mjs --fixture evals/behavioral/to-spec.json \
  --with evals/results/to-spec-with.jsonl --baseline evals/results/to-spec-base.jsonl

# with an LLM judge (needs the configured apiKeyEnv to be set)
node evals/run-behavioral.mjs --fixture evals/behavioral/to-spec.json \
  --with evals/results/to-spec-with.jsonl --baseline evals/results/to-spec-base.jsonl --judge

# every fixture in mock mode; exits non-zero only on a broken fixture schema
node evals/run-behavioral.mjs --all
```

`--mock` output is a **scorer smoke test**, never evidence about a model or a skill. It exists so
CI can prove the scorer still works after a refactor.

## Authoring routing prompts

Per [`../.agents/skills/skill-dev/references/paired-eval-protocol.md`](../.agents/skills/skill-dev/references/paired-eval-protocol.md)
and the Anthropic skill-creator guidance:

- **Realistic and messy.** Real prompts carry file paths, lowercase typing, abbreviations, typos,
  and backstory. `fix the thing in src/foo.ts` is a real prompt; `Review a pull request.` is not.
- **No trivially-simple one-step prompts.** A prompt like "write a hello world function" is
  answered identically with or without any skill, so it measures nothing about the skill and
  dilutes the trigger rate. Every row must be a prompt where loading the skill plausibly changes
  the outcome.
- **≥ 12 rows per skill**, with **≥ 2 negative controls**.
- **Category mix**: `explicit` (names the skill), `implicit` (describes the work, skill not
  named), `contextual` (embeds the request in repo state / backstory), `negative-control`
  (names an *adjacent bundle skill* that must **not** trigger the skill under test).
- Negative controls name a real adjacent skill, e.g. for `skill-audit`: "audita los side-effects
  declarados de esta skill" is a negative control for `skill-audit` and a positive for
  `side-effect-auditor`. Pick the neighbour from the bundle, not from memory: `--check` errors when
  a negative control names no adjacent bundle skill at all, and it warns when a hyphenated token is
  one or two edits away from a real skill name (the usual typo).

## Directory layout

```
evals/
  README.md                        this file
  routing/<domain>-<skill>.csv     routing prompts, header: should_trigger,category,prompt
  behavioral/<skill>.json          paired scenario fixtures (rubric + assertions)
  judge/grader.md                  the judge contract (one criterion per call)
  judge/judge.config.json          pinned judge snapshot (model, provider, apiKeyEnv, temperature)
  results/.gitkeep                 keeps the directory; recordings and mock output land here
  results/mock/                    regenerated by `--all` (scorer smoke-test material)
  run-routing.mjs                  routing scorer / CSV validator / exporter
  run-behavioral.mjs               paired behavioral scorer
```

## Known limitations

- No LLM API key is available in CI. Deterministic assertions always run locally; judge
  assertions fall back to `--mock-judge`, which echoes the rubric items instead of grading them.
- `pass^k` is an upper bound when trials share failure causes; the subset estimator counts
  correlated failures as independent ones.
- The routing CSVs are a **pilot** covering 10 skills. Bundle-wide routing claims need the
  remaining skills covered.
- Cost numbers are only as good as what the recording harness emits in `end`.

## References

- Anthropic, *skill-creator* (skill authoring and eval guidance)
- OpenAI, *Eval skills* blog (outcome / process / style / efficiency; pass^k; with-vs-without)
- τ-bench, arXiv 2406.12045 (pass^k)
- arXiv 2606.17819 (skill gains driven largely by instruction-following; two rubric axes)
- arXiv 2604.23178 (style bias 0.10–0.76, dominant over position bias, in LLM-as-judge)
- arXiv 2609.17394 (record the `(skill, version, fixture)` triple per run)
