---
name: "skill-graph-engineering"
category: "graph"
maturity: "experimental"
version: "1"
description: "Build typed skill dependency graphs (dependency, workflow, semantic, alternative edges), DAG compilation, and local repair operators (Rebind, InsertPrereq, Substitute, Rewire, Bypass) for skill orchestration."
license: "MIT"
capabilities:
  - construct a typed SkillGraph from a skill registry, dependency declarations, and a goal specification
  - classify edges as dependency, workflow, semantic, or alternative, each with a state/data/order role
  - compile a typed graph into an executable DAG with verified acyclicity, reachability, and goal completeness
  - apply local repair operators (Rebind, InsertPrereq, Substitute, Rewire, Bypass) bounded to the affected subgraph
  - emit a SkillGraph artifact as JSON plus a Markdown summary with a repair plan and executability verdict
inputs:
  - type: object
    name: SkillGraphBuildInput
    properties:
      skillRegistry: { type: "array", items: { type: "object", description: "Canonical skill entries with name, version, category, capabilities, inputs, outputs, dependencies" } }
      dependencyDeclarations: { type: "array", items: { type: "object", description: "Declared edges between skills: source, target, edgeType, role, condition" } }
      goalSpecification: { type: "object", properties: { goalId: { type: "string" }, requiredCapabilities: { type: "array", items: { type: "string" } }, acceptedOutputs: { type: "array", items: { type: "string" } } } }
    required: [skillRegistry, dependencyDeclarations, goalSpecification]
outputs:
  - type: object
    name: SkillGraph
    properties:
      nodes: { type: "array", items: { type: "object" } }
      edges: { type: "array", items: { type: "object" } }
      dag: { type: "object", properties: { topologicalOrder: { type: "array", items: { type: "string" } }, levels: { type: "array", items: { type: "array", items: { type: "string" } } }, executable: { type: "boolean" } } }
      repairPlan: { type: "object", properties: { operators: { type: "array", items: { type: "string" } }, boundedSubgraph: { type: "array", items: { type: "string" } }, verdict: { type: "string" } } }
      executability: { type: "object", properties: { acyclic: { type: "boolean" }, reachable: { type: "boolean" }, goalComplete: { type: "boolean" }, executable: { type: "boolean" }, violations: { type: "array", items: { type: "string" } } } }
    required: [nodes, edges, dag, executability]
sideEffects: []
dependencies:
  - skill-dependency-graph
  - skill-composition
stopCondition: "Typed skill graph compiled into executable DAG with verified acyclicity, reachability, and goal completeness"
risk: "low"
trustTier: "2"
maxIterations: 4
promptVersion: "2.0"
artifactType: "skill-graph"
modelTier: "reasoning"
evaluators: ["behavioral", "regression"]
fixturesPath: evals/behavioral/skill-graph-engineering.json
diataxis: "how-to"
tags: ["graph", "skill-graph", "dependency-graph", "dag", "graph-engineering", "composition"]
compatibility: ["graph/graph-skill-routing", "graph/skill-composition-dag", "graph/skill-conflict-detection"]
approvalRequired: false
approvalFor: []
---

## Normative Rules

- Every edge has exactly one type (`dependency`, `workflow`, `semantic`, or `alternative`) and one role (`state`, `data`, or `order`); undeclared edges are absent.
- Skill nodes are unique; duplicate registrations are rejected, not merged.
- The graph must remain acyclic. Cycles are violations, and any repair introducing one is rejected.
- Reachability is measured from entry nodes to every goal-required node; goal completeness requires every required capability and accepted output to be covered by reachable nodes.
- Repairs are locality-bounded to the affected subgraph, and the graph is re-verified for acyclicity, reachability, goal completeness, and executability after repair.

# Skill Graph Engineering

Build typed skill dependency graphs for skill orchestration in the quirk Skills system. This skill constructs a `SkillGraph` from a skill registry, dependency declarations, and a goal specification; classifies every edge as dependency, workflow, semantic, or alternative with a state/data/order role; compiles the graph into an executable DAG; verifies acyclicity, reachability, and goal completeness; and applies local repair operators (Rebind, InsertPrereq, Substitute, Rewire, Bypass) bounded to the affected subgraph.

## Why — why typed skill graphs matter

quirk Skills route work through declared capabilities, not assumption. Without a typed graph, orchestration drifts: a consumer "just knows" what a producer emitted, cycles creep into dependency chains, and a missing prerequisite is discovered only at runtime. Typed skill graphs matter because:

- **Dependency-aware routing**: the work-item-router and graph routing skills select skills by declared edges and edge roles, not by keyword matching on descriptions.
- **DAG execution**: skill-composition runs skills in topological order; an executable DAG guarantees no skill waits on itself and every input is produced before it is consumed.
- **Local repair**: when a dependency breaks, the graph is repaired in place with one of five operators rather than rebuilt from scratch, keeping the change bounded to the affected subgraph.

This follows the quirk Method: artifact-first, state-machine workflows, shift-left quality gates, and every edge carries a contract.

## Contract — input/output schema, scope, explicit rules

### Input

`SkillGraphBuildInput` — a typed object with:
- `skillRegistry[]`: canonical skill entries (`name`, `version`, `category`, `capabilities[]`, `inputs[]`, `outputs[]`, `dependencies[]`).
- `dependencyDeclarations[]`: declared edges (`source`, `target`, `edgeType`, `role`, `condition?`).
- `goalSpecification`: `goalId`, `requiredCapabilities[]`, `acceptedOutputs[]`.

### Output

`SkillGraph` — a typed object with:
- `nodes[]`: skill nodes with attributes.
- `edges[]`: typed edges (`source`, `target`, `edgeType`, `role`, `condition?`).
- `dag`: `topologicalOrder[]`, `levels[][]`, `executable`.
- `repairPlan`: `operators[]`, `boundedSubgraph[]`, `verdict`.
- `executability`: `acyclic`, `reachable`, `goalComplete`, `executable`, `violations[]`.

### Scope

- Build, verify, compile, and repair a skill graph within a single session.
- Edge types: `dependency`, `workflow`, `semantic`, `alternative`.
- Edge roles: `state`, `data`, `order`.
- Repair operators: `Rebind`, `InsertPrereq`, `Substitute`, `Rewire`, `Bypass`.

### Explicit rules

- Every edge carries exactly one `edgeType` and one `role`; undeclared edges are absent, not inferred.
- A skill node appears once; duplicate registrations are rejected, not merged.
- The graph must be acyclic before compilation; cycles are violations, not execution hints.
- Reachability is measured from entry nodes to every node required by the goal specification.
- Goal completeness requires every `requiredCapability` to be provided by at least one reachable node emitting an `acceptedOutput`.
- Repair is locality-bounded: an operator touches only the nodes and edges in its affected subgraph.

## Provenance — Q&A table

| Question | Answer |
|---|---|
| What is the source of truth? | The skill registry, dependency declarations, and goal specification passed as input |
| What is in scope? | Typed graph construction, edge classification, DAG compilation, property verification, local repair |
| What is explicitly out of scope? | Runtime execution of skills, remote skill discovery, mutation of the skill registry outside this session |
| Who or what consumes this artifact afterward? | graph/graph-skill-routing, graph/skill-composition-dag, graph/skill-conflict-detection, and the orchestration layer |
| What evidence proves it is done? | A SkillGraph whose `executability` reports `acyclic`, `reachable`, `goalComplete`, and `executable` all true, with no violations |
| What risk remains? | A stale skill registry or an undeclared dependency that exists only in runtime behavior |

## Artifact — emit SkillGraph as JSON + Markdown

Emit the `SkillGraph` as two artifacts:

1. **JSON** (`skill-graph.json`): the machine-readable `SkillGraph` object, validated against its declared schema before emission.
2. **Markdown** (`skill-graph.md`): a human-readable summary with a node table, an edge table grouped by `edgeType`, the DAG levels, the executability verdict, and the repair plan.

Every artifact carries provenance: source session, build timestamp, input skill registry version, and the quirk Method version.

## Algorithm Details — node attributes, edge types, DAG properties

### Node attributes

Each node carries: `id` (skill name), `version`, `category`, `capabilities[]`, `inputs[]`, `outputs[]`, `dependencies[]`, `status` (`registered`, `wired`, `executable`, `blocked`), and `reachable` (boolean).

### Edge types

| Edge type | Meaning | Typical role |
|---|---|---|
| `dependency` | Skill A requires skill B's output | `data` |
| `workflow` | Skill A precedes skill B in a sequence | `order` |
| `semantic` | Skill A refines or transforms skill B's concept | `state` |
| `alternative` | Skill B can replace skill A for the same goal | `order` |

Each edge carries exactly one `edgeType` and one `role` (`state`, `data`, or `order`) plus an optional `condition`.

### DAG properties

- **Acyclicity**: no directed cycle exists among dependency, workflow, semantic, or alternative edges.
- **Reachability**: every node required by the goal specification is reachable from an entry node.
- **Goal completeness**: every `requiredCapability` is provided by at least one reachable node; every `acceptedOutput` is emitted by at least one reachable node.
- **Executability**: the graph is acyclic, all reachable nodes have their inputs satisfied by predecessors, and `executable` is true.

## Workflow — register skills, declare dependencies, build graph, verify properties, compile DAG, emit repair plan

1. **Register skills.** Load the skill registry; validate each entry against the canonical skill schema (name, version, category, capabilities, inputs, outputs, dependencies). Reject duplicates.
2. **Declare dependencies.** Add dependency declarations; classify each edge as `dependency`, `workflow`, `semantic`, or `alternative` with a `role` of `state`, `data`, or `order`.
3. **Build the graph.** Construct `nodes[]` and `edges[]`; assign `status` (`registered`) and compute `reachable` from entry nodes.
4. **Verify properties.** Check acyclicity (DFS cycle detection), reachability (from entry nodes to goal-required nodes), goal completeness (all `requiredCapabilities` covered by reachable nodes emitting `acceptedOutputs`), and executability (all inputs of reachable nodes satisfied by predecessors).
5. **Compile the DAG.** Produce `topologicalOrder[]` and `levels[][]`; set `dag.executable` only when all properties hold.
6. **Emit repair plan.** When a property fails, apply the minimal local repair operator:
   - `Rebind`: repoint an edge to a different provider of the same capability.
   - `InsertPrereq`: add a missing prerequisite node before a dependent.
   - `Substitute`: swap a node for an alternative with equivalent outputs.
   - `Rewire`: change an edge's target within the same capability class.
   - `Bypass`: route around a blocked node through an alternative path.
   Record `operators[]`, `boundedSubgraph[]`, and `verdict`.
7. **Emit artifacts.** Write `skill-graph.json` and `skill-graph.md` with provenance.

## Safety Notes — locality-bounded repair, no cycles, goal completeness check

- **Locality-bounded repair**: each operator mutates only its `boundedSubgraph`; no operator rewrites the whole graph.
- **No cycles**: a repair that introduces a cycle is rejected; the graph must remain a DAG after every operator.
- **Goal completeness check**: after repair, re-verify that every `requiredCapability` is still covered by reachable nodes emitting `acceptedOutputs`.
- **Implicit edges**: every edge is declared; an edge that "just exists" in runtime behavior is a violation.
- **Side effects**: none; this skill reads inputs and writes artifacts only.

## Completion criteria

- [ ] SkillGraph built from the skill registry, dependency declarations, and goal specification
- [ ] Every edge typed as `dependency`, `workflow`, `semantic`, or `alternative` with role `state`, `data`, or `order`
- [ ] DAG compiled with `topologicalOrder` and `levels`
- [ ] Acyclicity verified: no directed cycles
- [ ] Reachability verified: every goal-required node reachable from an entry node
- [ ] Goal completeness verified: every `requiredCapability` covered by reachable nodes emitting `acceptedOutputs`
- [ ] Executability verdict emitted: `acyclic`, `reachable`, `goalComplete`, `executable` all true, `violations` empty
- [ ] Repair plan emitted with operators and bounded subgraph when properties fail
- [ ] Artifacts written as JSON + Markdown with provenance
- [ ] No side effects beyond artifact emission
- [ ] No approval required (trust tier 2, risk low)

---
@include .agents/skills/platform/contract-base.xml
