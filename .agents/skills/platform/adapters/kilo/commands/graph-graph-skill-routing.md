---
description: "Dependency-aware skill retrieval: expand prerequisite closure, topologically order skills, and route work through a typed skill graph — never return a skill in isolation when execution depends on unretrieved skills."
---
# graph-skill-routing

When to use: Dependency-aware skill retrieval: expand prerequisite closure, topologically order skills, and route work through a typed skill graph — never return a skill in isolation when execution depends on unretrieved skills.

## Workflow

1. **Parse the query.** Extract intent, required artifact type, and constraints from the user's request. Record them in the RoutingResult draft. Completion criteria: intent and artifact type documented
2. **Find root skills.** Use `routing/capability-router` to match the query against declared `capabilities`, `category`, and `tags`; the highest-confidence exact match becomes `rootSkill`. If no match reaches confidence >= 0.7, return candi...
3. **Expand the prerequisite closure.** Walk declared `dependencies`/`compatibility` from `rootSkill` up to `depthLimit` using reverse traversal (follow who depends on a skill as well as who it depends on, per SkillTrace Reverse Personalize...
4. **Topologically order.** Run Kahn's algorithm on the closure subgraph, breaking layer ties with reverse Personalized PageRank scores and overlap-based weights; verify acyclicity first. Completion criteria: `orderedSkills` is a permutatio...
5. **Emit the RoutingResult.** Write the JSON and Markdown artifacts, record `confidence`, `blockers`, and `nextConsumer`. Validate against the output schema. Completion criteria: artifact returned and validated; next consumer identified or...

## Deliverables

- graph-routing artifact

## Guardrails

- risk: low; trust tier: 2; approval required: no
- side effects: none
- isolation: none; model tier: router

Stop when: Prerequisite closure expanded and skills topologically ordered with verified dependency-respecting sequence
