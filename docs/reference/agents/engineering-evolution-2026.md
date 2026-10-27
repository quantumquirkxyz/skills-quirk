# Engineering Evolution: Evidence-Based Roadmap (2026–2027)

Status: proposed improvements, not claims of implementation. Last reviewed: 2026-10-26.

## Decision

Evolve existing quirk Method workflows and quality gates before introducing new agent orchestration frameworks. Prioritize observable, reproducible, least-privilege execution and measurable skill behavior. This document is a design backlog; it does not certify that a gate passes.

## Evidence and references

- [OpenAI: Harness engineering (2026)](https://openai.com/index/harness-engineering/) describes repository-local knowledge, execution plans, observable development environments, and automated validation.
- [OpenAI: Testing Agent Skills Systematically with Evals (2026)](https://developers.openai.com/blog/eval-skills) describes regression-oriented skill evaluations.
- [OWASP: AI Agent and MCP Security](https://owasp.github.io/DevSecOpsGuideline/2-Process/2-2-Develop/2-2-5-AI-Agent-and-MCP-Security/) recommends least agency, trust boundaries, and explicit tool permissions.
- [LangChain: State of Agent Engineering (2026)](https://www.langchain.com/state-of-agent-engineering) reports a gap between agent observability and evaluation adoption.

These references inform proposed controls; no external design automatically supersedes repository contracts.

## Baseline: existing capabilities to verify

The repository declares commands for skill validation, semantic auditing, spec compliance, fixture evaluation, routing evaluations, mocked behavioral evaluations, security scanning, traceability, context budgeting, benchmarking, metrics, and workflow replay in `package.json`. Each must be **executed** and have its results retained before describing it as passing. See [Generated Views](../../how-to/generated-views.md) and [Agent Skills Index](index.md).

| Priority | Area | Existing entrypoint | Required evidence before a skill update |
|---|---|---|---|
| P0 | Integrity | `node .agents/skills/platform/check-all.mjs` | Exit code, log, failing check classification |
| P0 | Routing | `npm run evals:routing:check` | Trigger and non-trigger fixtures; false-positive and false-negative cases |
| P0 | Behavior | `npm run evals:behavioral:mock` and `npm run test:fixtures` | Baseline versus candidate results using identical cases |
| P0 | Security | `npm run security` and `npm run scan:skills` | Tool permissions, untrusted input, unauthorized write cases |
| P1 | Traceability | `npm run traceability` | Requirement → artifact → validation mappings |
| P1 | Observability | `npm run metrics` and `npm run benchmark` | Latency, failures, retries, tool calls, and cost where available |
| P1 | Context budgets | `npm run audit:context` | Measured context footprint and truncation behavior |

## Evolution sequence

### Wave 0 — baseline and reproducibility (P0)

Record repository commit, Node version, commands, exit codes, and artifacts. Validate README-excluded scope separately when appropriate; the complete check may still inspect README as a fixture. Compare canonical skills, lockfile, registry, generated catalog, and projection counts. Do not manually repair generated artifacts. Document broken references and their verified destinations.

Acceptance: a repeatable baseline report with explicit pass/fail/not-run states and no invented results.

### Wave 1 — behavioral contracts and regression fixtures (P0)

Prioritize `ask-to`, `work-item-router`, `to-spec`, `to-tickets`, `implement`, `review-pr`, `review-fix-loop`, `evaluate-skill`, and `skill-quality-gate`. Each targeted skill should have positive and negative trigger cases, required output checks, stop conditions, and side-effect boundaries. Run equivalent fixtures before and after each change.

Acceptance: candidate quality is no worse than baseline for required safety/contract cases; any changed behavior is documented.

### Wave 2 — least-agency controls (P0)

Audit permission escalation and untrusted instructions in issue bodies, docs, MCP tool responses, and external references. Separate read-only analysis from local writes, remote publication, merge, and issue closure. Require explicit authorization at trust-boundary transitions; fail closed for unknown destinations and unsafe commands.

Acceptance: negative fixtures show prohibited side effects do not occur; privileged transitions have auditable approval evidence.

### Wave 3 — traceable execution and recovery (P1)

Connect spec acceptance criteria, ticket dependencies, implementation artifacts, tests, review findings, and deployment evidence with durable identifiers. Check idempotency and bounded retries; preserve manual override and escalation for ambiguous or conflicting states.

Acceptance: representative workflow can be replayed and its decisions explained without relying on hidden conversational memory.

### Wave 4 — measurable optimization (P1)

Track success per scenario, regressions, flaky checks, tool-call overhead, recovery rate, and measured token/cost budgets. Only enable parallel execution for independent DAG nodes with isolated state and explicit publication boundaries. Favor incremental refactoring over untested rewrites.

Acceptance: performance claims are supported by reproducible comparisons and never substitute for correctness gates.

## Change protocol

For every candidate skill: identify its canonical `SKILL.md`; read [Skill Style Guide](../../how-to/skill-style.md), [Conflict Matrix](conflict-matrix.md), and relevant fixtures; capture baseline; make one cohesive change; update fixtures; regenerate lockfile and projections using repository scripts when needed; run the full gate; report results; commit a focused English message. If a required tool cannot run, mark validation `NOT RUN` and do not claim verified functional improvement.

## Proposed follow-up investigations

- Determine whether telemetry carries stable trace and attempt IDs across retries without exposing secrets.
- Test prompt-injection and cross-tool data exfiltration fixtures against high-risk skills.
- Determine whether benchmark scoring distinguishes correct completion from successful invocation.
- Review schema/spec compatibility and skill metadata semantics before changing the portable frontmatter.
- Investigate documentation link checking as an automated non-mutating gate.

Avoid treating GitHub Actions, MCP, OpenTelemetry, or any agent framework as mandatory dependencies without an ADR and measured integration value.
