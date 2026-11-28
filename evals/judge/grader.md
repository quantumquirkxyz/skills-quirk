# Judge Contract

This is the contract any LLM-as-judge must satisfy to be used by `evals/run-behavioral.mjs`.
The runner never assumes a provider: it loads `judge.config.json`, resolves the judge mode,
and calls one criterion at a time.

## Rules

1. **ONE criterion per judge call.** Batching criteria into a single call is the main producer of
   unexplainable failures: a single aggregate verdict cannot say which criterion failed, so the
   rubric stops being actionable. The runner enforces one call per judge assertion, and a rubric
   item is never split across calls.
2. **Output schema.** Every call returns exactly:
   ```json
   { "text": "<the judge's reasoning in its own words>", "passed": true, "evidence": "<the quoted span that decided it>" }
   ```
   `evidence` is mandatory — a verdict without a quotable span is not an explanation, it is a vibe.
   The runner records all three fields next to the assertion id so a failure can be re-audited.
3. **Ambiguity policy.** If the evidence is ambiguous, pass — *unless* the criterion says strict.
   Strict criteria are the narrow set where a false pass is expensive (a promotion blocker, a
   declared side-effect boundary, a published-artifact requirement). Everything else defaults to
   pass so that the harness does not manufacture failures it cannot justify.
4. **One score per rubric level, never adjectives.** A criterion states what a level 4, 2, and 0
   look like in observable terms. "4 = excellent" is not a criterion and is rejected at fixture
   validation time.
5. **Blind the arms.** The judge receives the transcript and the artifact, never a label saying
   which arm is `with-skill` and which is `baseline`. Labels leak the expected answer.

## Bias: style dominates position

Measured in the reference study (arXiv 2604.23178), style bias in LLM-as-judge ranges from
**0.10 to 0.76** — an order of magnitude above position bias, which is why the ordering of two
candidates gets so much attention and style gets so little. Practical consequences:

- The judge scores **rubric levels**, not prose quality. A polished transcript that misses a
  contract section fails; a terse one that hits every level passes.
- Keep the judge input bounded: send the artifact and the tool-call summary, not the whole raw
  transcript, so length and formatting stop dominating the verdict.
- Never let the judge compare two arms directly. Two one-sided calls are less biased than one
  comparative call, and they survive a re-run.
- If a rubric item's pass rate differs wildly between the two arms with the same underlying
  defect, suspect style bias before believing the delta.

## Model snapshot pinning

`judge.config.json` pins the judge snapshot:

```json
{
  "judgeModel": "claude-sonnet-4-5",
  "judgeProvider": "anthropic",
  "apiKeyEnv": "ANTHROPIC_API_KEY",
  "temperature": 0.1,
  "pinnedSnapshot": true
}
```

- `pinnedSnapshot: true` means the model identifier refers to a frozen snapshot, not a moving
  alias. When the provider re-points the alias, the calibration below is void and must be redone.
- **Calibration numbers belong to one judge snapshot.** A TPR of 0.94 measured on
  `claude-sonnet-4-5` says nothing about `gpt-5-mini`. Record the snapshot with every calibration
  run and with every reported number.
- `temperature: 0.1` is deliberate: the judge is a measuring instrument, and a creative judge is
  not reproducible.

## Calibration gate

Before the judge is allowed to decide anything that matters:

| Requirement | Threshold |
|---|---|
| Human-labelled calibration items | 30–50 |
| True positive rate (catches a real defect) | >= 0.90 |
| True negative rate (passes a clean artifact) | >= 0.90 |
| Cohen's kappa against the human labels | >= 0.6 |

Kappa is reported alongside the two rates because two rates can both look fine while the judge
agrees with the human only by accident on the easy majority class.

**Iterate the RUBRIC, not the judge.** When the judge disagrees with a human label, the first
suspect is the rubric wording: an ambiguous criterion produces flaky verdicts no matter how good
the model is. In the reference study, rewriting a single rubric element moved the true negative
rate from **0.41 to 0.88** without touching the judge. Changing the model is the last resort, and
it voids the calibration.

Calibration log format (one line per run, kept with the results):

```json
{"date":"2026-10-10","judgeModel":"claude-sonnet-4-5","snapshot":"2025-09-01","items":38,"tpr":0.94,"tnr":0.91,"kappa":0.72,"rubricVersion":"1","notes":"rewrote if-2 levels after 3 ambiguous items"}
```

## Provider interface

`--judge` reads `judge.config.json` and posts one chat-completion request per criterion to the
configured provider, expecting a JSON object with `text`, `passed`, and `evidence`.

- If `apiKeyEnv` is unset or empty in the environment, the runner **falls back to `--mock-judge`**
  and says so in its output. Mock mode echoes the rubric item and passes it; it exists so CI can
  smoke-test the scorer without a key, and its output is never evidence.
- API keys are read from the environment and never printed, logged, or written to disk by this
  harness.
- Any transport or parse failure follows the ambiguity policy in rule 3.
