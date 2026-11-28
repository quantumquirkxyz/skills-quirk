---
description: "Manage dynamic context for agent execution using retrieval-augmented generation patterns, updating the working context from sources beyond static CONTEXT.md (issues, PRs, docs, execution traces)."
---
# context-engine

When to use: Manage dynamic context for agent execution using retrieval-augmented generation patterns, updating the working context from sources beyond static CONTEXT.md (issues, PRs, docs, execution traces).

## Workflow

1. Parse query and identify relevant sources
2. Retrieve content from sources (files, issues, PRs, traces)
3. Index and synthesize
4. Detect changes since last index
5. Validate the artifact, write both views, and record the terminal state

## Deliverables

- foundation artifact

## Guardrails

- risk: low; trust tier: 2; approval required: yes
- side effects: write-files
- isolation: worktree; model tier: fast

Stop when: A ContextEngineArtifact is validated and emitted, or a terminal state is recorded: completed, blocked, stale-input, validation-failed, or budget-exceeded.
