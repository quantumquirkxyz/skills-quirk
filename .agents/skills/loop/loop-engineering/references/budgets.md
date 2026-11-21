# Loop Budgets, Nudges, and Ledger Format

Companion reference for `loop-engineering`. The executable contract is
`.agents/skills/platform/loop-runner.mjs`; this file records its real field names,
defaults, and evidence format so a plan does not invent a parallel vocabulary.

## Budget fields

Skill language uses intent names; the runner uses the field names below. Pass the
runner names to `runLoop({ budget })`.

| Intent name | Runner field | Default | Meaning |
|---|---|---|---|
| `maxIterations` | `stepLimit` | `Infinity` | Maximum steps executed. `0` is legal and executes nothing. |
| `maxCost` | `costLimit` | `Infinity` | Abstract cost units; charged even when a step throws. |
| `maxWallTimeMs` | `wallTimeLimitMs` | `Infinity` | Wall-clock ceiling in milliseconds. |
| format-error tolerance | `maxConsecutiveFormatErrors` | `3` | Consecutive malformed/failed steps before exit. |
| repeat tolerance | `repeatThreshold` | `3` | Identical action+args+result occurrences before halt (minimum 2). |
| repeat scope | `repeatWindow` | `12` | Sliding window used for repeat detection. |
| ping-pong scope | `pingPongWindow` | `12` | Sliding window used for A-B-A-B detection. |

Budgets are checked before each step executes, and may never be relaxed
mid-loop. A loop already at its step limit stops before spending another step.

## Choosing values

Budgets are safety rails, not performance targets. Start tight and widen only with
evidence that progress is real:

| Loop shape | Suggested starting point |
|---|---|
| One-shot repair (single finding, known fix) | `stepLimit: 4`, `repeatThreshold: 2` |
| Review-fix loop (bounded set of findings) | `stepLimit: 12`, `repeatThreshold: 3`, `repeatWindow: 12` |
| Test-fix loop (failing suite, converging) | `stepLimit: 8`, `maxConsecutiveFormatErrors: 2` |
| Polling loop (external status) | `stepLimit` sized to the poll budget, `exemptActions: [<poll action>]` |
| Fan-out / dispatch loop | `stepLimit` = planned work items + 2 reconciliation steps |

When the work is open-ended, declare a wall-time or cost ceiling rather than an
unbounded `stepLimit`. `Infinity` is a valid default for the runner but is not a
valid *plan* for an agent loop.

## Nudge taxonomy

Every escalation is a structured object
`{ type, severity, message, instruction }`; the caller routes on `severity`.

| `type` | Severity sequence | Meaning | Required response |
|---|---|---|---|
| `repeat` | `warning` → `backoff` → `block` | Same action+args+result recurring inside `repeatWindow` | Stop retrying; change the approach or escalate |
| `ping-pong` | `warning` → `block` | A-B-A-B oscillation | Make the next step depend on the last result |
| `format-error` | `warning` → `block` | Malformed or failed step | Regenerate a well-formed step; only the first error message is retained |

A `block` nudge accompanies a terminal exit; do not suppress it or restart the same
loop unchanged.

## Exit statuses and mapping

The runner emits exactly these `exitStatus` values:

| Runner `exitStatus` | When | Map the skill `status` to |
|---|---|---|
| `completed` | Step iterator finished normally | `completed` (only after external verification) |
| `limits-exceeded` | Step, cost, or wall-time budget exhausted | `budget-exceeded` |
| `repeated-action` | Identical step repeated to `repeatThreshold` | `repeated-action` |
| `ping-pong` | A-B-A-B detected | `repeated-action` with the ping-pong pattern recorded |
| `format-errors` | `maxConsecutiveFormatErrors` reached | `validation-failed` |

`blocked`, `needs-approval`, `stale-input`, and `superseded` are skill-level
statuses raised by the caller before or around the loop; the runner does not emit
them. `completed` from the runner means the iterator ended, not that the outcome
is correct: verify the desired state outside the model before reporting success.

## Ledger format

Default path: `.scratch/loop-ledger.jsonl` (session-scoped paths are preferred for
parallel fleets). The ledger is append-only and never compacted.

One JSON line per step (`type` is `step`, or `step-error` when the step failed):

```json
{
  "type": "step",
  "seq": 0,
  "ts": "<ISO-8601>",
  "loopId": "<loop id>",
  "action": "<action name>",
  "args": {},
  "argsHash": "<sha256 of canonical args>",
  "resultSignature": "<sha256 of canonical result or error>",
  "stepHash": "<sha256 of action + argsHash + resultSignature>",
  "status": "ok",
  "cost": 1,
  "wallTimeMs": 12,
  "error": "<message, only when status is error>"
}
```

The final line has `type: "summary"` and records `loopId`, `exitStatus`, `steps`,
`cost`, `wallTimeMs`, and `nudgeCount`. A payload may be summarized; the fact that
the step happened is never removed.

The runner does not compute a progress measure. Record it in the step verdict
(your own field) or in the summary the caller keeps; the ledger hashes what
executed, it does not judge whether it advanced the task.

## Progress evidence

A change is not progress. Record at least one external measure per iteration
(test count, failing-test delta, bytes reduced, items remaining) and use it to
decide whether to continue. If the measure cannot improve, stop rather than spend
the remaining budget proving it.
