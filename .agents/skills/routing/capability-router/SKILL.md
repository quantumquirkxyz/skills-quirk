---
name: "capability-router"
category: "routing"
maturity: "stable"
version: "1"
description: "Route work to the best matching Skill using declared capabilities and compatibility — with explicit selection rules."
license: "MIT"
capabilities:
  - apply capability router methods within explicit routing boundaries
  - analyze route work to the best matching skill using declared capabilities and compatibility — with explicit selection rules with assumptions, constraints, and failure modes
  - produce and validate a routing artifact with evidence, decisions, and next steps
outputs:
  - type: object
    name: CapabilityRouterArtifact
    properties:
      result:
        type: object
        description: "Selected skill, rationale, candidate matches, side effects, blockers, risk level, and next consumer"
      required: [result]
sideEffects: []
dependencies: []
stopCondition: "Route work to the best matching Skill using declared capabilities and compatibility complete; structured result returned; per-step completion criteria checked."
risk: "low"
trustTier: "1"
maxIterations: "6"
promptVersion: "2.0"
artifactType: "plan"
modelTier: "router"
evaluators: ["behavioral", "regression"]
fixturesPath: tests/skill-output-migration-routing-skill-dev.test.mjs
diataxis: "how-to"
tags: ["routing"]
compatibility: []
approvalRequired: false
approvalFor: []
---

## Contract

### Purpose
Route work to the best matching quirk Skill from the registry using declared capabilities, compatibility, and explicit selection rules — rather than relying on memory. This is a quirk Method routing seam: every routing decision must produce an auditable CapabilityRouterArtifact.

### Input schema
| Field | Type | Required | Description |
|---|---|---|---|
| `request` | string | yes | The user's task description, with intent and required artifact type. |
| `availableContext` | object | no | Project state, prior artifacts, spec references, and open blockers. |
| `registry` | object | no | The discovered skill inventory (name, category, capabilities, compatibility). |

### Output schema
| Field | Type | Required | Description |
|---|---|---|---|
| `selectedSkill` | string | yes | The canonical skill selected to handle the work. |
| `rationale` | string | yes | Explicit selection rationale citing capability match, confidence level, and any rule overrides. |
| `candidates` | array[object] | yes | Each candidate with skill name, matchType (`exact`, `keyword`, `graph-neighborhood`), score, prerequisites. |
| `sideEffects` | array[string] | yes | Declared side effects of the selected skill (mutations, file writes, network calls). |
| `blockers` | array[string] | no | Blockers identified during routing that must be resolved before handoff. |
| `risk` | enum[low, medium, high, critical] | yes | Risk assessment of the routing decision itself. |
| `nextConsumer` | string | yes | Who or what consumes the artifact afterward. |

### Scope boundaries
- In scope: selecting among quirk Skills declared in `.agents/skills/` and `.kilo/skills/`, recording selection evidence, and handing off to the next consumer.
- Out of scope: executing the selected skill's body, modifying skill source files, or routing work outside the quirk Skills registry.
- Out of scope: resolving merge conflicts, writing production code, or changing git state unless a delegated skill explicitly owns that seam.

### Explicit rules
- Exact and keyword matches always outrank graph neighborhood activation; the graph re-ranks candidates and never replaces direct matching.
- Record in the CapabilityRouterArtifact which candidates came from keyword/seed matching and which were activated by the graph neighborhood.
- Prefer the thinnest Skill that can finish the work; use neighborhood activation only to break near-ties and to pull declared prerequisites.
- Documented standards override defaults; explicit project rules take precedence.
- If blocked by missing context or dependencies, surface the blocker before proceeding.
- Never commit unless explicitly asked; route to `implement` or `opencode-implement` for code changes.

## Guardrails

### Routing boundaries
- A routing decision ends at the selected skill's contract boundary; do not assume the target skill performs work outside its declared `capabilities` and `sideEffects`.
- If no skill matches with confidence >= 0.7, return a "no confident match" result with candidates and rationale instead of forcing a selection.
- Respect `stopCondition` and `maxIterations`; do not loop past six routing iterations without a selection or explicit blocker.

### Conflict handling when multiple skills match
- When multiple skills match with comparable scores, prefer exact match > keyword match > graph-neighborhood activation.
- Within the same matchType, prefer the skill with fewer declared sideEffects (lower trust risk) and thinner scope.
- If still tied, fall back to a human-readable rationale in the artifact and surface the ambiguity to the user rather than guessing.
- Record every candidate considered and the tie-break rule applied in the CapabilityRouterArtifact.

## Provenance

| Question | Answer |
|---|---|
| What is the source of truth? | The user's request, originating spec/issue, and the skill's declared outputs in frontmatter. |
| What is in scope? | Work covered by the skill's acceptance criteria and completion rules; quirk Skills vocabulary applied per CONTEXT.md. |
| What is explicitly out of scope? | Files, behaviors, and decisions outside the skill's declared boundary; execution of the target skill's body. |
| Who or what consumes this artifact afterward? | The next skill in the workflow (e.g., implement, subagent-swarm, work-item-router) or the user directly. |
| What evidence proves it is done? | CapabilityRouterArtifact with selectedSkill, rationale, candidates, sideEffects, blockers, risk, nextConsumer; per-step completion criteria met; validation passed. |
| What risk remains? | Subjective judgment calls on near-tie matches, missing context, external dependency failures, stale skill registry entries. |

- **quirk Skills**: the canonical skills live in `.agents/skills/` as `<domain>/<skill>/SKILL.md` directories; `.claude/skills/` is a generated compatibility view of relative symlinks regenerated by bundle tooling and never hand-edited.
- **quirk Method**: artifact-first design, state-machine workflows, and shift-left quality gates applied to routing decisions.
- **canonical skill**: a skill whose SKILL.md is the only source of truth for skill content.
- **provenance**: the artifact's lifecycle record — who/what consumes it, what evidence proves completion, and what risk remains.

## Steps

1. **Parse the task intent and required artifact type.**
   - Extract the user's request intent, required artifact type, and any explicit constraints.
   - Identify the domain (routing, frontend, backend, data, etc.) from keywords and context.
   - Completion criteria: intent and artifact type are documented in the routing artifact; domain classification recorded.

2. **Match against declared capabilities and side effects.**
   - Scan the skill registry for skills whose `capabilities`, `category`, and `tags` overlap the parsed intent.
   - Flag each skill's declared `sideEffects` and `dependencies` for risk assessment.
   - Completion criteria: candidate list built with match type (`exact`, `keyword`, or `graph-neighborhood`) and score per candidate.

3. **Ask `skill-graph.mjs` to rank the candidate set.**
   - Run `node .agents/skills/platform/skill-graph.mjs rank "<query>" --json`, or read the persisted graph at `.agents/skills/platform/graph/skill-graph.json`.
   - Apply graph neighborhood activation only to break near-ties and to pull declared prerequisites; never to replace exact/keyword matching.
   - Completion criteria: ranked candidate list persisted; graph-activated candidates marked distinctly from keyword/seed matches.

4. **Select the thinnest matching Skill.**
   - Prefer the thinnest Skill that can finish the work within its declared boundary.
   - Respect `stopCondition` and `maxIterations` (6); stop when a selection is made or a blocker is surfaced.
   - Completion criteria: `selectedSkill` recorded with rationale citing capability match, confidence, and rule overrides.

5. **Handle conflicts and surface blockers.**
   - When multiple skills match, apply tie-break rules: exact > keyword > graph-neighborhood; then fewer sideEffects; then thinner scope.
   - If no skill matches with confidence >= 0.7, return a "no confident match" result instead of forcing a selection.
   - Surface any blockers or missing dependencies before proceeding.
   - Completion criteria: tie-break rule applied documented; blockers listed; confidence below threshold handled explicitly.

6. **Produce and validate the CapabilityRouterArtifact.**
   - Emit the structured artifact with selectedSkill, rationale, candidates, sideEffects, blockers, risk, nextConsumer.
   - Validate against the output schema; record validation status.
   - Completion criteria: artifact returned and validated; nextConsumer identified or work handed off; residual risks documented.

## References

- `skill-graph.mjs` — ranks the candidate skill set and maintains the skill neighborhood graph used for near-tie breaking.
- `dag-scheduler.mjs` — schedules dependent skills across the DAG after routing selects the entry skill.
- `subagent-swarm` — coordinates multiple agent sub-roles (architect, implementer, reviewer, tester) once routing hands off work.
- `work-item-router` — enforces work-item governance preflight before specs, tickets, or project boards are routed to a skill.
- `capability-router` — this skill; the routing seam that selects the best matching quirk Skill using declared capabilities and compatibility.

## Examples

**Scenario: route a "add a React form validation" request.**

1. Parse intent: domain = frontend, artifact type = component + validation logic, required skill category = frontend.
2. Match capabilities: `react` (component structure and state seams), `frontend-design` (production-grade interfaces), `styling` (CSS/Tailwind).
3. Rank with `skill-graph.mjs rank "React form validation" --json`: `react` scores highest (exact capability match on component structure and state seams); `frontend-design` is a keyword match; `styling` is a graph-neighborhood activation.
4. Select thinnest: `react` — it directly owns component structure and state seams with the fewest sideEffects.
5. Emit artifact:
   - selectedSkill: `react`
   - rationale: "Exact capability match on component structure and state seams; thinner scope than frontend-design; graph-neighborhood candidates reserved for prerequisites only."
   - candidates: [{skill: react, matchType: exact, score: 0.95}, {skill: frontend-design, matchType: keyword, score: 0.6}, {skill: styling, matchType: graph-neighborhood, score: 0.4}]
   - sideEffects: []
   - blockers: []
   - risk: low
   - nextConsumer: `react` skill implementation or the user.

## Completion

Per-step completion criteria:
1. Intent and artifact type documented in the routing artifact; domain classification recorded.
2. Candidate list built with match type and score per candidate.
3. Ranked candidate list persisted; graph-activated candidates marked distinctly from keyword/seed matches.
4. `selectedSkill` recorded with rationale citing capability match, confidence, and rule overrides.
5. Tie-break rule applied documented; blockers listed; confidence below threshold handled explicitly.
6. Artifact returned and validated; nextConsumer identified or work handed off; residual risks documented.

A generic checklist is not sufficient — each step above must be satisfied before routing is complete.
---
@include .agents/skills/platform/contract-base.xml
