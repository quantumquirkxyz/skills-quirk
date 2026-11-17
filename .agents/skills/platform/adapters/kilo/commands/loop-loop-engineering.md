---
description: "Design bounded agent loops with termination contracts, progress detection, verification outside the model, and escalation policy — so loops end with a verdict, not a timeout."
---
# loop-engineering

When to use: Design bounded agent loops with termination contracts, progress detection, verification outside the model, and escalation policy — so loops end with a verdict, not a timeout.

## Workflow

1. **Declare the termination contract.** Before the first iteration, fix maxIterations, maxCost, maxWallTimeMs, and the degenerate-loop thresholds (repeatThreshold, repeatWindow). Pick values from `references/budgets.md`
2. **Wire the ledger.** Point `ledgerPath` at `.scratch/loop-ledger.jsonl` or a session-scoped path. The runner appends one hashed JSON line per step in a finally block, so an interrupted run keeps its state
3. **Run the loop through `runLoop`.** Pass an async iterator of step verdicts and `onNudge` to receive structured escalations. The runner charges cost, detects exact repeats and ping-pong, checks the desired state predicate each iteration,...
4. **Verify outside the model.** Confirm progress with the predicate plus an independent measure; never trust the model's self-report that work is done
5. **Route on the verdict.** `completed` hands `submission` to the caller. `limits-exceeded`, `repeated-action`, `ping-pong`, `no-progress`, and `blocker-escalated` each mean the loop stopped for a declared reason - read the final nudge bef...
6. **Record the artifact.** Save the verdict as `LoopEngineeringVerdict` at `.agents/skills/platform/artifacts/loop-engineering/{id}.json` and keep the ledger beside it as execution evidence

## Deliverables

- loop-engineering artifact

## Guardrails

- risk: low; trust tier: 2; approval required: yes
- side effects: write-temp-file
- isolation: none; model tier: reasoning

Stop when: Loop terminated with typed verdict; progress measure confirmed or blocker escalated
