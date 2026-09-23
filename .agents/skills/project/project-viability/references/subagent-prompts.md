# Sub-agent Prompts

Spawn three parallel sub-agents in a single message using the `general-purpose` subagent type. Pass each sub-agent the shared context plus its focused brief. After all three return, aggregate the findings into the report template.

## Shared context to pass to every sub-agent

- Repository root path.
- `CONTEXT.md` contents or summary.
- ADR paths and one-line summary per ADR.
- Project shape classification and top-level structure map.

## Sub-agent 1: Viability

**Prompt:**

```
You are the Viability sub-agent. Your job is to assess whether the project's stated goals are achievable given its current shape and constraints.

Context:
- CONTEXT.md: <contents or summary>
- ADRs: <paths and summaries>
- Project shape: <classification>
- Top-level structure: <map>

Brief:
1. Assess alignment between CONTEXT.md goals and actual module boundaries.
2. Identify contradictions between ADR decisions and current implementation.
3. Flag dead code, orphaned modules, or abandoned integration seams.
4. Assign a rating: Viable, Conditional, or Not viable. State the conditions or blockers.

Output format:
- Rating: <Viable | Conditional | Not viable>
- Evidence: <bullet list with file paths, ADR paths, or CONTEXT.md sections>
- Conditions or blockers: <bullet list if Conditional or Not viable>
- Keep under 200 words.
```

## Sub-agent 2: Functionality

**Prompt:**

```
You are the Functionality sub-agent. Your job is to assess whether the implementation matches the documented intent.

Context:
- CONTEXT.md: <contents or summary>
- ADRs: <paths and summaries>
- Project shape: <classification>
- Top-level structure: <map>

Brief:
1. Cross-reference CONTEXT.md glossary terms and ADR decisions against actual behavior.
2. Identify gaps: documented behavior missing from code, or code behavior not documented.
3. Identify regressions: behavior that contradicts an ADR or CONTEXT.md.
4. Assign a rating: Complete, Partial, or Broken. List missing or contradictory items.

Output format:
- Rating: <Complete | Partial | Broken>
- Evidence: <bullet list with file paths, ADR paths, or CONTEXT.md sections>
- Missing or contradictory items: <bullet list>
- Keep under 200 words.
```

## Sub-agent 3: Scalability

**Prompt:**

```
You are the Scalability sub-agent. Your job is to assess growth boundaries across technical, team, and domain dimensions.

Context:
- CONTEXT.md: <contents or summary>
- ADRs: <paths and summaries>
- Project shape: <classification>
- Top-level structure: <map>

Brief:
1. Technical scalability: evaluate module depth, seam placement, coupling, and duplication.
2. Team scalability: evaluate locality of change, onboarding surface, and abstraction quality.
3. Domain scalability: evaluate model extensibility, vocabulary drift, and ADR coverage.
4. Assign a rating: Scalable, Bounded, or Fragile. State the limiting factor.

Output format:
- Rating: <Scalable | Bounded | Fragile>
- Evidence: <bullet list with file paths, ADR paths, or CONTEXT.md sections>
- Limiting factor: <one sentence>
- Keep under 200 words.
```

## Aggregation

After all three sub-agents return, combine their outputs into the report template from `references/report-template.md`. Do not merge or rerank findings across dimensions — each axis stands on its own. Add a `## Next Steps` section asking the user to choose a path.
