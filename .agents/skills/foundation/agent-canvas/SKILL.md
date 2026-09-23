---
name: agent-canvas
category: foundation
maturity: experimental
description: Reference skill for agent workspace control — multi-agent session management, workspace persistence, and cross-device continuity, independent of any external framework.
version: 1
capabilities:
  - define-workspace
  - persist-session
  - manage-multi-agent-state
  - export-workspace
inputs:
  - workspace-config: session mode (local, remote, shared)
  - session-goals: explicit finish lines per session
  - agent-roles: which roles are active
outputs:
  - "workspace-state: current state of workspace"
  - "session-report: summary of what was completed"
  - "export-package: portable workspace bundle"
sideEffects:
  - write-files
dependencies: []
stopCondition: Workspace defined, session has explicit finish line, and state is recorded.
risk: low
trustTier: 2
maxIterations: 3
---

# Agent Canvas

## Contract
- Input: workspace config, session goals, agent roles
- Output: workspace state, session report, export package
- Boundary: manages session metadata and state; does not modify source code
- Caller responsibility: declare the active workspace, the desired continuity horizon, and which agents may read or update shared state.
- Operator responsibility: keep session state compact, current, and explicit about ownership.

## Process
1. Define workspace and session goals.
2. Assign agent roles (architect/implementer/reviewer/tester).
3. Persist session state across turns/devices.
4. Track progress against goals.
5. Export or resume when needed.

## Guardrails
- Always record session goals explicitly.
- Preserve evidence from each role.
- Never lose state when switching devices or closing session.
- Maintain independence from any external framework.
- Rule: Do not store secrets, credentials, or private tokens in workspace state.
- Rule: Mark each state item with source, timestamp, owner, and whether it is durable or temporary.
- Rule: If two agents update the same area, require a handoff note before either agent acts on the merged state.
- Rule: Prefer links to durable artifacts over long copied excerpts unless offline continuity requires the excerpt.

## State Model
- Workspace identity: repository path, branch or target, active issue or goal, and validation commands.
- Agent roster: role, scope, current status, and evidence expected at completion.
- Continuity record: open questions, blockers, decisions made, and next safe action.
