---
description: "Build typed skill dependency graphs (dependency, workflow, semantic, alternative edges), DAG compilation, and local repair operators (Rebind, InsertPrereq, Substitute, Rewire, Bypass) for skill orchestration."
---
# skill-graph-engineering

When to use: Build typed skill dependency graphs (dependency, workflow, semantic, alternative edges), DAG compilation, and local repair operators (Rebind, InsertPrereq, Substitute, Rewire, Bypass) for skill orchestration.

## Workflow

1. **Register skills.** Load the skill registry; validate each entry against the canonical skill schema (name, version, category, capabilities, inputs, outputs, dependencies). Reject duplicates
2. **Declare dependencies.** Add dependency declarations; classify each edge as `dependency`, `workflow`, `semantic`, or `alternative` with a `role` of `state`, `data`, or `order`
3. **Build the graph.** Construct `nodes[]` and `edges[]`; assign `status` (`registered`) and compute `reachable` from entry nodes
4. **Verify properties.** Check acyclicity (DFS cycle detection), reachability (from entry nodes to goal-required nodes), goal completeness (all `requiredCapabilities` covered by reachable nodes emitting `acceptedOutputs`), and executabilit...
5. **Compile the DAG.** Produce `topologicalOrder[]` and `levels[][]`; set `dag.executable` only when all properties hold
6. **Emit repair plan.** When a property fails, apply the minimal local repair operator
7. **Emit artifacts.** Write `skill-graph.json` and `skill-graph.md` with provenance

## Deliverables

- skill-graph artifact

## Guardrails

- risk: low; trust tier: 2; approval required: no
- side effects: none
- isolation: none; model tier: reasoning

Stop when: Typed skill graph compiled into executable DAG with verified acyclicity, reachability, and goal completeness
