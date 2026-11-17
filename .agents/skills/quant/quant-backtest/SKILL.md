---
name: "quant-backtest"
category: "quant"
maturity: "stable"
version: "2"
description: "Run a reproducible, leakage-resistant backtest with dataset/code provenance, corporate-action fixtures, deterministic replay, and an explicit PASS/FAIL/BLOCKED/NOT-RUN verdict."
license: "MIT"
capabilities:
  - apply quant backtest methods within explicit quant boundaries
  - analyze run a backtest with full audit hygiene — biases, costs, out-of-sample, regime splits — and produce a verdict on whether a strategy is robust with assumptions, constraints, and failure modes
  - produce and validate a quant artifact with evidence, decisions, and next steps
outputs: "reproducible backtest audit with manifest, hashes, bias fixtures, replay evidence, baseline comparison, statistics, and PASS/FAIL/BLOCKED/NOT-RUN verdict."
sideEffects: []
dependencies: []
stopCondition: "Manifest and hashes are recorded, leakage/survivorship/corporate-action checks and deterministic replay are evaluated, baseline comparison is complete or explicitly not-run, and the verdict is PASS, FAIL, BLOCKED, or NOT-RUN."
risk: "low"
trustTier: "1"
maxIterations: "6"
promptVersion: "3.0"
artifactType: "test-strategy"
modelTier: "reasoning"
evaluators: ["behavioral", "regression"]
fixturesPath: ""
diataxis: "how-to"
tags: ["quant"]
compatibility: []
approvalRequired: "false"
approvalFor: []
---

## Contract

- Input: strategy definition, immutable dataset/code references, evaluation window, baseline, and permitted runtime.
- Output: `QuantBacktestArtifact` containing a reproducible manifest, hashes, fixture results, replay evidence, metrics, baseline delta, limitations, and one verdict: `PASS`, `FAIL`, `BLOCKED`, or `NOT-RUN`.
- Scope: produces an audit report; never executes live trading or places orders.
- Rule: warnings are errors for leakage, survivorship, corporate-action, non-determinism, missing hashes, or unexplained baseline drift.
- Rule: if required context, data, code, or dependencies are unavailable, stop with `BLOCKED`; use `NOT-RUN` only when execution was deliberately skipped.
- Rule: documented standards override defaults; explicit project rules take precedence.

## Provenance

| Question | Answer |
|---|---|
| What is the source of truth? | The user's request, originating spec/issue, and the skill's declared outputs |
| What is in scope? | Work covered by the skill's acceptance criteria and completion rules |
| What is explicitly out of scope? | Files, behaviors, and decisions outside the skill's declared boundary |
| Who or what consumes this artifact afterward? | The next skill in the workflow or the user |
| What evidence proves it is done? | Completion criteria met, artifact saved, validation passed |
| What risk remains? | Subjective judgment calls, missing context, or external dependency failures


## Artifact

Emit `QuantBacktestArtifact` as both:
- JSON: `.agents/skills/platform/artifacts/quant-backtest/{identifier}.json`
- Markdown view: same filename with `.md` extension

The JSON must include a reproducible manifest:

```yaml
manifest_version: 1
run_id: <stable identifier>
dataset: { uri: <immutable reference>, sha256: <64 hex>, schema_sha256: <64 hex> }
code: { uri: <revision or bundle>, sha256: <64 hex> }
config_sha256: <64 hex>
seed: <integer>
environment: { runtime: <version>, platform: <version>, dependencies_lock_sha256: <64 hex> }
fixtures: [leakage, survivorship, corporate_actions]
replay: { command: <exact command>, input_sha256: <64 hex>, output_sha256: <64 hex> }
baseline: { name: <name>, result_sha256: <64 hex>, delta: <structured values> }
status: PASS | FAIL | BLOCKED | NOT-RUN
```

Hash every source, transform, configuration, dependency lock, fixture input, and materialized output. Redact secrets without replacing their hash with an unverifiable placeholder.


# 
# 
# Quant Backtest Audit

Take a **strategy** and produce a **backtest result you can defend**. A backtest that can't survive audit is decoration.

## When to use

- The user has a strategy and wants its historical performance.
- A claimed alpha or Sharpe needs independent verification.
- A live-trading decision will be made from the result.

## Process

### 1. Spec the strategy

Capture in writing:

- **Signal(s)** — input → score → decision.
- **Universe** — assets and any filtering rules.
- **Schedule** — rebalance dates, holding period.
- **Sizing** — equal weight, vol-targeted, Kelly-fraction.
- **Costs** — commissions, spread, borrow, impact.

No ambiguity. If a parameter is unspecified, ask.

**Completion criterion:** the strategy could be re-implemented from the spec alone.

### 2. Audit the data and fixtures

- **Leakage fixture:** inject a future-only feature and a timestamp boundary case; the pipeline must reject or score it as unavailable.
- **Survivorship fixture:** include a delisted constituent and a removed symbol; membership must be point-in-time and the name must contribute its delisting return.
- **Corporate-action fixture:** include split, dividend, merger, ticker change, and delisting events; adjusted prices, raw prices, shares, and cash flows must reconcile without double counting.
- **Look-ahead:** features use only records available at the decision timestamp, including publication lag.
- Record provider version, adjustment policy, timezone, calendar, missing-value policy, and every fixture result.

**Completion criterion:** all three mandatory fixtures execute; any warning is an error; missing fixture data is `BLOCKED`.

### 3. Run and replay the backtest

- **Transaction-cost model:** not zero. Commissions + spread + impact estimate.
- **Out-of-sample split:** train / test / walk-forward, not just one backtest window.
- **Benchmark:** explicit (e.g. cap-weighted universe, risk-free, SPY).
- Report: Sharpe, Sortino, max drawdown, Calmar, annualised return, annualised vol, win rate.

- Persist the exact command and input manifest, then run it twice in an isolated environment with the same seed.
- Deterministic replay requires byte-identical normalized trades, positions, cash flows, metrics, and artifact hashes; otherwise status is `FAIL`.
- Compare against a named baseline using the same dates, costs, calendar, and data policy. Explain every material delta.

**Completion criterion:** backtest run; out-of-sample period honoured; all statistics, replay comparison, and baseline delta are present.

### 4. Stress tests

- **Subperiods:** does it survive across decades / regimes (2008, 2020, 2022)?
- **Sectors / geographies:** is the effect localised to one slice?
- **Turnover:** annualised; high turnover often eats alpha.
- **Crowding:** is the strategy correlated with known crowded trades?

**Completion criterion:** each stress test reported; weakest point named.

### 5. Coverage validation

Does VaR 95% cover ~95% of out-of-sample days? If not, recalibrate.

**Completion criterion:** coverage check completed; discrepancy addressed.

### 6. Verdict

Deliver the verdict:

- **Robust:** survives stress tests, stable across subperiods, reasonable turnover, Sharpe > 1 after costs.
- **Weak:** passes some tests but fragile under regime change or high turnover.
- **Fails:** does not survive out-of-sample or stress tests.

**Completion criterion:** verdict stated with evidence; recommendation (deploy / do not deploy / revise).

### 7. Deliver

Markdown artifact: strategy spec, manifest and hashes, fixture evidence, data audit, backtest statistics, deterministic replay, stress tests, baseline comparison, coverage validation, limitations, and verdict with explicit conditions.

**Completion criterion:** report and JSON validate; warnings-as-errors policy is applied; every skipped check is `NOT-RUN` with reason; verdict is honest.

## Completion

- the skill's completion criteria are explicitly checked
- the artifact is saved and validated
- any blockers or skipped validations are documented
- the next consumer is identified or the work is handed off
---
@include .agents/skills/platform/contract-base.xml