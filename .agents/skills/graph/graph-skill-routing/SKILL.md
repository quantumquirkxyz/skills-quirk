---
name: "graph-skill-routing"
category: "graph"
maturity: "experimental"
version: "1"
description: "Dependency-aware skill retrieval: expand prerequisite closure, topologically order skills, and route work through a typed skill graph — never return a skill in isolation when execution depends on unretrieved skills."
license: "MIT"
capabilities:
  - expand the prerequisite closure of root skills through declared dependency edges up to a depth limit
  - compute overlap-based edge weights between skills from shared prerequisites, artifacts, and tags
  - topologically order skills into a dependency-respecting execution sequence using Kahn's algorithm seeded by reverse Personalized PageRank
  - verify acyclicity of the skill subgraph and surface cycles as blockers
  - emit a RoutingResult with ordered skill list, closure, dependency edges, and confidence
inputs:
  type: object
  properties:
    query:
      type: string
      description: "The user task or work item to route through the skill graph."
    skillGraph:
      type: object
      description: "Typed skill graph: nodes are canonical quirk Skills, edges are prerequisite/dependency relations declared in each skill's frontmatter."
    rootSkill:
      type: string
      description: "The canonical skill identified as the entry point for the work."
    depthLimit:
      type: integer
      minimum: 1
      description: "Maximum dependency expansion depth for the prerequisite closure."
  required: [query, skillGraph, rootSkill, depthLimit]
outputs:
  - type: object
    name: RoutingResultArtifact
    properties:
      result:
        type: object
        description: "Routing result with ordered skill list, prerequisite closure, dependency edges, and confidence"
      required: [result]
sideEffects: []
dependencies:
  - "skill-graph-engineering"
  - "capability-router"
stopCondition: "Prerequisite closure expanded and skills topologically ordered with verified dependency-respecting sequence"
risk: "low"
trustTier: "2"
maxIterations: 4
promptVersion: "2.0"
artifactType: "graph-routing"
modelTier: "router"
evaluators:
  - behavioral
  - regression
fixturesPath: "evals/behavioral/graph-skill-routing.json"
diataxis: "how-to"
tags:
  - graph
  - graph-routing
  - dependency-aware
  - skill-routing
  - graph-engineering
  - retrieval
compatibility:
  - routing/capability-router
  - graph/skill-graph-engineering
  - graph/skill-composition-dag
approvalRequired: false
approvalFor: []
---

## Normative Rules

- Never return a skill in isolation: `orderedSkills` must include the root and its complete declared prerequisite closure within `depthLimit`.
- Interpret edge `A -> B` as “B is a prerequisite of A”; B must precede A in the execution order.
- Verify acyclicity before ordering; cycles are blockers and must never produce an invalid sequence.
- Respect `depthLimit`; do not include prerequisites beyond it. Missing declarations and low confidence are surfaced as blockers or ambiguity, not guessed away.
- Produce a topological order with prerequisites before dependents; use the defined ranking only to break ties within a valid topological layer.

# Graph Skill Routing

## Why

Skills do not execute in isolation. A quirk Skill such as `implement` or `opencode-implement` routinely depends on `work-item-router` for governance preflight, `capability-router` for skill selection, `artifact-handoff` for producer-consumer contracts, and `review-pr` for quality review before publication. Returning only the entry skill leaves its prerequisites unretrieved, so the workflow stalls at the first missing dependency.

Dependency-aware routing treats the registry of canonical skills as a typed graph: nodes are skills, edges are declared `dependencies` and `compatibility` relations. Routing a work item means (1) finding the root skill for the query, (2) expanding its prerequisite closure, (3) ordering the closure topologically so every skill runs after the skills it depends on, and (4) emitting an auditable `RoutingResult`. This is the graph-engineering seam of the quirk Method: artifact-first design, state-machine workflows, and shift-left quality gates applied to skill retrieval.

## Contract

### Input schema

| Field | Type | Required | Description |
|---|---|---|---|
| `query` | string | yes | The user task or work item to route through the skill graph. |
| `skillGraph` | object | yes | Typed skill graph; nodes are canonical quirk Skills, edges are declared prerequisite/dependency relations. |
| `rootSkill` | string | yes | The canonical skill identified as the entry point for the work. |
| `depthLimit` | integer | yes | Maximum dependency expansion depth for the prerequisite closure (>= 1). |

### Output schema

| Field | Type | Required | Description |
|---|---|---|---|
| `orderedSkills` | array[string] | yes | Dependency-respecting execution sequence (prerequisites before dependents). |
| `prerequisiteClosure` | array[string] | yes | Root skills plus all transitively required prerequisites within the depth limit. |
| `dependencyEdges` | array[object] | yes | Edges within the closure with overlap-based weights and relation type. |
| `confidence` | number | yes | Routing confidence in [0, 1]. |
| `blockers` | array[string] | no | Blockers such as cycles or missing prerequisite declarations. |
| `nextConsumer` | string | no | Who or what consumes the RoutingResult next. |

### Scope boundaries

- In scope: closure expansion, topological ordering, dependency-edge weighting, and emission of the RoutingResult artifact for quirk Skills.
- Out of scope: executing the selected skills' bodies, modifying skill source files, or routing work outside the quirk Skills registry.
- Out of scope: resolving merge conflicts, writing production code, or changing git state unless a delegated skill explicitly owns that seam.

### Explicit rules

- Never return a skill in isolation: every skill in `orderedSkills` must have its declared prerequisites present in `prerequisiteClosure`.
- Edge direction: an edge `A -> B` means `B` is a prerequisite of `A`; `B` must precede `A` in `orderedSkills`.
- Overlap-based edge weight: `weight(A, B) = Jaccard(prerequisites(A), prerequisites(B))` blended with shared `artifacts` and `tags` overlap; weights break near-ties in ordering and seed ranking.
- Reverse Personalized PageRank: seed the PageRank vector on the root skills, run it on the transposed graph so skills depended on by many reachable skills rank higher; use the scores to order within topological layers.
- Respect `depthLimit`: do not expand prerequisites beyond it; skills outside the limit are excluded from the closure.
- Verify acyclicity before ordering; report cycles as blockers rather than producing an invalid sequence.
- If confidence < 0.7, surface ambiguity in the artifact instead of forcing a selection.

## Provenance

| Question | Answer |
|---|---|
| What is the source of truth? | The user's request, originating spec/issue, each skill's declared `dependencies`/`compatibility` in frontmatter, and the persisted skill graph. |
| What is in scope? | Work covered by the skill's acceptance criteria and completion rules; quirk Skills vocabulary applied per CONTEXT.md. |
| What is explicitly out of scope? | Files, behaviors, and decisions outside the skill's declared boundary; execution of the target skill's body. |
| Who or what consumes this artifact afterward? | The next skill in the workflow (e.g., `implement`, `subagent-swarm`, `work-item-router`) or the user directly. |
| What evidence proves it is done? | RoutingResult with `orderedSkills`, `prerequisiteClosure`, `dependencyEdges`, `confidence`; every completion criterion checked; validation passed. |
| What risk remains? | Stale skill registry entries, missing `dependencies` declarations on skills, subjective near-tie ordering, and cycles introduced by new skill registrations. |

- **quirk Skills**: the canonical skills live in `.agents/skills/` as `<domain>/<skill>/SKILL.md` directories; `.claude/skills/` is a generated compatibility view of relative symlinks regenerated by bundle tooling and never hand-edited.
- **quirk Method**: artifact-first design, state-machine workflows, and shift-left quality gates applied to graph-based skill retrieval.
- **canonical skill**: a skill whose SKILL.md is the only source of truth for skill content.
- **provenance**: the artifact's lifecycle record — who/what consumes it, what evidence proves completion, and what risk remains.

## Artifact

Emit the `RoutingResult` as JSON for machine consumption and Markdown for human review.

### JSON example

```json
{
  "orderedSkills": ["work-item-router", "capability-router", "artifact-handoff", "implement"],
  "prerequisiteClosure": ["work-item-router", "capability-router", "artifact-handoff", "implement", "review-pr"],
  "dependencyEdges": [
    { "from": "implement", "to": "work-item-router", "weight": 0.62, "relation": "prerequisite" },
    { "from": "implement", "to": "capability-router", "weight": 0.48, "relation": "prerequisite" },
    { "from": "capability-router", "to": "artifact-handoff", "weight": 0.33, "relation": "compatibility" },
    { "from": "implement", "to": "review-pr", "weight": 0.29, "relation": "prerequisite" }
  ],
  "confidence": 0.88,
  "blockers": [],
  "nextConsumer": "implement"
}
```

### Markdown example

```markdown
# RoutingResult

Query: "add server-side validation to the user import flow"

Root skill: implement
Depth limit: 3

## Execution sequence (prerequisites first)

1. work-item-router — governance preflight before any spec/ticket work
2. capability-router — selects implement and its prerequisites
3. artifact-handoff — producer-consumer contract at each edge
4. implement — writes the validation code
5. review-pr — quality review before publication

## Dependency edges

| From | To | Weight | Relation |
|---|---|---|---|
| implement | work-item-router | 0.62 | prerequisite |
| implement | capability-router | 0.48 | prerequisite |
| capability-router | artifact-handoff | 0.33 | compatibility |
| implement | review-pr | 0.29 | prerequisite |

Confidence: 0.88 | Blockers: none | Next consumer: implement
```

## Algorithm Details

### Prerequisite closure expansion

1. Seed the frontier with `rootSkill`.
2. For each skill on the frontier, read its declared `dependencies` and `compatibility` entries; each entry naming another canonical skill is a dependency edge.
3. Add each prerequisite to the closure and push it onto the frontier if `depth < depthLimit`.
4. De-duplicate skills so a skill reached through multiple paths appears once in the closure.
5. Missing prerequisite declarations are recorded in `blockers`; expansion continues with that limitation recorded.

### Topological ordering

1. Build the subgraph induced by `prerequisiteClosure` using edges whose `from` and `to` are both in the closure.
2. Run Kahn's algorithm: repeatedly emit skills with zero in-degree (no un-ordered prerequisites).
3. Within each zero-in-degree layer, order by reverse Personalized PageRank score (skills depended on by more reachable skills go first), then by overlap-based edge weight to the root skill.
4. If any skills remain un-emitted, a cycle exists; record it in `blockers` and do not emit an invalid `orderedSkills`.

### Dependency edges

- Every edge carries `from`, `to`, `weight`, and `relation` (`prerequisite` or `compatibility`).
- Edge weight: `weight(A, B) = 0.6 * Jaccard(deps(A), deps(B)) + 0.2 * Jaccard(artifacts(A), artifacts(B)) + 0.2 * Jaccard(tags(A), tags(B))`.
- Only edges within the closure are emitted; dangling edges to skills outside the depth limit are omitted.

### Overlap-based edge weights

- Jaccard overlap of declared prerequisite sets identifies skills that share requirements — these cluster in the same execution layer.
- Shared `artifactType` values (e.g., two skills both emitting `plan`) increase weight; shared `tags` increase weight weakly.
- Weights are deterministic given the same skill graph, so routing is reproducible across sessions.

## Workflow

1. **Parse the query.** Extract intent, required artifact type, and constraints from the user's request. Record them in the RoutingResult draft. Completion criteria: intent and artifact type documented.

2. **Find root skills.** Use `routing/capability-router` to match the query against declared `capabilities`, `category`, and `tags`; the highest-confidence exact match becomes `rootSkill`. If no match reaches confidence >= 0.7, return candidates with a "no confident match" note. Completion criteria: `rootSkill` recorded with rationale.

3. **Expand the prerequisite closure.** Walk declared `dependencies`/`compatibility` from `rootSkill` up to `depthLimit` using reverse traversal (follow who depends on a skill as well as who it depends on, per SkillTrace Reverse Personalized PageRank). Completion criteria: closure contains root plus all reachable prerequisites within the limit; no skill beyond `depthLimit` included.

4. **Topologically order.** Run Kahn's algorithm on the closure subgraph, breaking layer ties with reverse Personalized PageRank scores and overlap-based weights; verify acyclicity first. Completion criteria: `orderedSkills` is a permutation of `prerequisiteClosure` and every prerequisite precedes its dependents.

5. **Emit the RoutingResult.** Write the JSON and Markdown artifacts, record `confidence`, `blockers`, and `nextConsumer`. Validate against the output schema. Completion criteria: artifact returned and validated; next consumer identified or ambiguity surfaced.

## Safety Notes

A skill is emitted only when its declared prerequisites are present in `prerequisiteClosure`; missing prerequisites within `depthLimit` are added before emission. A cycle in the skill subgraph is a blocker, so the emitted sequence preserves dependency direction only after acyclicity is verified.
- **Depth limits:** expansion stops at `depthLimit`, with any excluded prerequisites recorded as a limitation.
- **Confidence floor:** routing confidence below 0.7 is surfaced as ambiguity rather than forced selection.
- **Closure completeness:** every output skill is accompanied by its closure; an entry skill alone is invalid.

## Completion criteria

- [ ] Query parsed; intent, artifact type, and constraints documented in the RoutingResult draft.
- [ ] `rootSkill` selected via `routing/capability-router` with rationale; confidence >= 0.7 or ambiguity surfaced.
- [ ] Prerequisite closure expanded through declared `dependencies`/`compatibility` up to `depthLimit`; de-duplicated.
- [ ] Subgraph verified acyclic; cycles, if any, listed in `blockers`.
- [ ] `orderedSkills` topologically ordered: every prerequisite precedes its dependents; layer ties broken by reverse Personalized PageRank and overlap-based weight.
- [ ] `dependencyEdges` emitted with `from`, `to`, `weight`, `relation` for every intra-closure edge.
- [ ] `confidence` in [0, 1] recorded; `nextConsumer` identified or ambiguity noted.
- [ ] RoutingResult emitted as JSON and Markdown; validated against the output schema.

---
@include .agents/skills/platform/contract-base.xml