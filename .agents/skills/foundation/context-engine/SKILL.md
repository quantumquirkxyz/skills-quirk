---
name: context-engine
description: Manage dynamic context for agent execution using retrieval-augmented generation patterns, updating the working context from sources beyond static CONTEXT.md (issues, PRs, docs, execution traces).
version: 1
capabilities:
  - retrieve-context
  - index-context
  - update-context
  - query-context
inputs:
  - query: The context needed (topic, domain, recent changes)
  - sources: List of sources to index (files, issues, PR descriptions, traces)
  - refresh-interval: How often to re-index (default: per session)
outputs:
  - context-result: Retrieved and synthesized context
  - context-index: Updated index of sources
  - context-changes: Changes detected since last update
  - query-answer: Direct answer to query from synthesized context
stopCondition: Context retrieved, indexed, and answer provided with explicit source attribution.
risk: low
trustTier: 2
maxIterations: 5
---

# Context Engine

## Contract
- Input: query and source list
- Output: synthesized context, index, changes, answer with attribution
- Boundary: reads only; updates working context; does not modify source files

## Process
1. Parse query and identify relevant sources.
2. Retrieve content from sources (files, issues, PRs, traces).
3. Index and synthesize.
4. Detect changes since last index.
5. Provide answer with source attribution.

## Guardrails
- Always attribute sources.
- Do not fabricate sources.
- Preserve original vocabulary from CONTEXT.md.
- Update index only with verified changes.
