---
name: "context-pack"
category: "routing"
maturity: "stable"
version: "1"
description: "Build a minimal fresh context pack with ordered reads and provenance — for scoped, high-signal handoff."
license: "MIT"
capabilities:
  - apply context pack methods within explicit routing boundaries
  - analyze build a minimal fresh context pack with ordered reads and provenance — for scoped, high-signal handoff with assumptions, constraints, and failure modes
  - produce and validate a routing artifact with evidence, decisions, and next steps
outputs:
  - type: object
    name: ContextPackArtifact
    properties:
      result:
        type: object
        description: "Minimal fresh context pack with ordered reads and provenance, next skill, decisions, risks, and blockers"
      required: [result]
sideEffects: []
dependencies: []
stopCondition: "Build a minimal fresh context pack with ordered reads and provenance complete; structured result returned; completion criteria checked."
risk: "low"
trustTier: "1"
maxIterations: "6"
promptVersion: "2.0"
artifactType: "routing"
modelTier: "router"
evaluators: ["behavioral", "regression"]
fixturesPath: tests/skill-output-migration-routing-skill-dev.test.mjs
diataxis: "how-to"
tags: ["routing"]
compatibility: []
approvalRequired: false
approvalFor: []
---

## Vocabulary

Use the repository's authoritative vocabulary when discussing context pack work; do not import terms from unrelated repositories.

- **quirk Skills**: canonical skills stored in `.agents/skills/` as `<domain>/<skill>/SKILL.md` directories; they are the only source of truth for skill content.
- **quirk Method**: the bundle's quirk Method applied to work done in this repo: artifact-first design, state-machine workflows, and shift-left quality gates.
- **canonical skill**: the committed skill content under `.agents/skills/`; `.claude/skills/` is only a generated compatibility view of relative symlinks and is never hand-edited.
- **provenance**: the tracked origin, freshness, and consumer of every fact and file placed into the context pack.
- **compatibility view**: the regenerated `.claude/skills/` directory of relative symlinks that lets Claude-style consumers discover the same canonical skills.

## Contract

- **Input:** a skill invocation with the user's request, any available context, and an optional declared task scope.
  - `taskScope`: what the task is trying to finish, bounded by the skill's declared boundary.
  - `availableContext`: facts, files, or issue text already supplied by the user.
- **Output:** a structured context pack artifact aligned to the skill's declared outputs.
  - `contextPack`: the minimal fresh context pack.
    - `taskScope`: scoped task statement.
    - `smallestAuthoritativeDocs`: ordered reads, durable repo context first, task-specific evidence last.
    - `provenance`: source of truth, freshness check timestamp, provenance integrity flag.
    - `freshness`: whether references were validated, list of stale references if any.
    - `budget`: reads used and reads remaining; never over-collect.
  - `nextSkill`: the thinnest downstream skill that can finish the work.
  - `decisions`: choices made and why smaller alternatives were rejected.
  - `risks`: residual risks and missing context.
  - `blockers`: anything that prevented completion.
- **Scope:** stay within the skill's declared boundaries; do not broaden without explicit direction. Do not draft the routed artifact here — context pack only.
- **Rule:** documented standards override defaults; explicit project rules take precedence.
- **Rule:** if blocked by missing context or dependencies, surface the blocker before proceeding.
- **Rule:** minimal context only — collect the smallest set of facts needed to choose the next skill without reopening the full repo; every additional read must justify its freshness and provenance.
- **Rule:** freshness validation is mandatory; never include a doc whose staleness is unknown.
- **Rule:** provenance tracking is mandatory; every entry in `smallestAuthoritativeDocs` must carry source, freshness check, and integrity flag.

## Provenance

| Question | Answer |
|---|---|
| What is the source of truth? | The user's request, originating spec/issue, and the skill's declared outputs |
| What is in scope? | Work covered by the skill's acceptance criteria and completion rules |
| What is explicitly out of scope? | Files, behaviors, and decisions outside the skill's declared boundary |
| Who or what consumes this context pack afterward? | The next skill in the workflow, the user, or `subagent-swarm` workers who need scoped, high-signal handoff without reopening the full repo |
| What freshness guarantees apply? | Every referenced doc is checked against the canonical committed state before inclusion; stale references are listed explicitly and excluded when they cannot be refreshed |
| What provenance tracking applies? | Each entry records source path, freshness-checked-at timestamp, and provenance integrity flag; unknown integrity fails closed |
| What evidence proves it is done? | Completion criteria met per step, structured result returned, validation passed, freshness/provenance/budget recorded |
| What risk remains? | Subjective judgment calls, missing context, stale references, or external dependency failures |

## Artifact

Return `ContextPackArtifact` as structured output in the current response. Do not write local artifact files unless the user explicitly asks for an export.

Do not over-collect context: stop once the pack contains the smallest set of facts needed to choose the next skill. Every additional read beyond the minimum must be justified by freshness, provenance, and remaining budget.

# Context Pack

Use this skill to select the minimum repo context needed for a task, producing a scoped, high-signal handoff for the next consumer.

## Steps

1. **Identify the task scope and the smallest authoritative docs needed.**
   - Parse the user's request into a concrete task scope bounded by this skill's contract.
   - Identify the smallest set of authoritative docs that can decide the next step: canonical `SKILL.md` files under `.agents/skills/`, `CONTEXT.md`, `AGENTS.md`, work-item governance index at `docs/reference/agents/index.md`, work-item format at `docs/reference/agents/work-item-format.md`, or the originating spec/issue.
   - Prefer canonical skills over the compatibility view (`.claude/skills/` is regenerated; never treat symlinks as source of truth).
   - Reject any doc that is not needed to choose the next skill.
   - **Completion criteria:** task scope is stated; `smallestAuthoritativeDocs` lists only paths required to decide the next skill; every rejected doc is noted in `decisions`.

2. **Order the reads from durable repo context to task-specific evidence.**
   - Read durable repo context first (`.agents/AGENTS.md`, root `AGENTS.md`, `CONTEXT.md`, canonical skill frontmatter and body), then task-specific evidence (originating spec, issue, tickets, related SKILL.md bodies).
   - Order `smallestAuthoritativeDocs` so durable context precedes task-specific evidence.
   - Record reads used against the budget; stop when scope is decided, not when reads are exhausted.
   - **Completion criteria:** reads are ordered durable-first; `budget.readsUsed` and `budget.readsRemaining` are recorded; no read is duplicated.

3. **Record freshness, provenance, and budget in the pack.**
   - For each doc in `smallestAuthoritativeDocs`: verify freshness against canonical committed state, record `freshness.validated`, list any `staleReferences`, and record `provenance` (sourceOfTruth, freshnessCheckedAt, provenanceIntegrity).
   - Record `budget` (readsUsed, readsRemaining).
   - If a reference cannot be refreshed or its integrity is unknown, fail closed: exclude it and record it in `blockers`.
   - **Completion criteria:** every doc has freshness validated or listed as stale; provenance integrity flag is set for every entry; budget is recorded; unknown integrity never slips into the pack silently.

4. **Capture the smallest set of facts needed to choose the next skill without reopening the full repo.**
   - Summarize decisions, risks, and blockers as structured output.
   - Name `nextSkill` — the thinnest skill that can finish the work from this pack alone.
   - Do not draft the routed artifact here.
   - **Completion criteria:** `nextSkill` is named or the pack explicitly states no downstream skill applies; `decisions`, `risks`, and `blockers` are populated; the pack alone is sufficient to hand off.

## Completion

- Step 1: task scope stated; `smallestAuthoritativeDocs` minimal and decision-relevant; rejected docs noted.
- Step 2: reads ordered durable-first; `budget.readsUsed`/`budget.readsRemaining` recorded; no duplicate reads.
- Step 3: every doc freshness-validated or explicitly stale; provenance integrity flag set; budget recorded; unknown integrity fails closed.
- Step 4: `nextSkill` named or no downstream skill applicable; `decisions`, `risks`, `blockers` populated; pack sufficient for handoff.
- The skill's completion criteria are explicitly checked.
- The structured result is returned and validated.
- Any blockers or skipped validations are documented.
- The next consumer is identified or the work is handed off.

## Guardrails

- **Do not over-collect context:** collect only the smallest set of facts needed to choose the next skill; every additional read must justify its freshness, provenance, and budget cost.
- **Freshness validation is mandatory:** never include a doc whose staleness is unknown; stale references are listed explicitly and excluded when they cannot be refreshed.
- **Provenance integrity is mandatory:** every entry carries source path, freshness-checked-at timestamp, and provenance integrity flag; unknown integrity fails closed — exclude and block.
- **No artifact drafting:** context pack produces a routing decision, not the downstream artifact itself.
- **Canonical source only:** use `.agents/skills/` as source of truth; never treat `.claude/skills/` symlinks or other generated views as authoritative.

## References

- `context-engine` — manage dynamic context for agent execution using retrieval-augmented generation patterns; updates working context from sources beyond static CONTEXT.md.
- `context-compaction` — run the context compaction discipline for long agent sessions: summarize the working set, clear stale tool results, and re-initiate a fresh window without losing the thread or durable artifacts.
- `agent-memory` — maintain external agent memory: structured notes persisted outside the context window (NOW.md for the working thread, MEMORY.md for durable facts) so context can compact or reset while knowledge survives across sessions.
- `work-item-router` — force reading the canonical work-item governance index before routing specs, tickets, project boards, or publication flows; use after the context pack names the work-item type.
- `subagent-swarm` — coordinate multiple agent sub-roles in parallel or sequential swarm mode; consumes context packs as scoped, high-signal handoff artifacts.

## Examples

**Code-review task:** A user asks to review a pull request that modifies `src/services/billing.ts`.

1. Task scope: review the billing service PR changes and decide whether to approve, request changes, or route to a specialist.
2. Smallest authoritative docs: `CONTEXT.md` (project vocabulary), `.agents/skills/delivery/code-review/SKILL.md` (review contract), `docs/reference/agents/work-item-format.md` (canonical work-item metadata shape), and the originating PR diff/comments.
3. Order reads: `CONTEXT.md` → `AGENTS.md` → `code-review/SKILL.md` → `work-item-format.md` → PR diff.
4. Record freshness/provenance/budget: each doc checked against canonical committed state; `freshness.validated: true`; `provenance.provenanceIntegrity: true`; `budget.readsUsed: 5`, `budget.readsRemaining: 1`.
5. Capture facts: `nextSkill: code-review`; decisions note that `agent-memory` was skipped because the PR is self-contained; risks note that a downstream dependency in `src/services/payments.ts` was not in scope and is recorded as a blocker.

The pack is returned as structured output; no local artifact file is written unless the user asks for an export.

---
@include .agents/skills/platform/contract-base.xml
