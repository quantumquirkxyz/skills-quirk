---
name: agent-canvas
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
  - workspace-state: current state of workspace
  - session-report: summary of what was completed
  - export-package: portable workspace bundle
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
