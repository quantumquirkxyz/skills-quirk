---
adr: 0001
status: accepted
date: 2026-09-20
---

# Bundle Integration: Portable Skills + Router + Dynamic Context

## Context
The canonical bundle (`.agents/skills/`) needs a portable manifest (`skills.json`), an installation script (`setup-quirk-skills.sh`), a work-item router (`work-item-router.mjs`), and new foundation skills (`agent-canvas`, `context-engine`, `mcp-server`, `subagent-swarm`) to support multi-agent and dynamic-context workflows.

## Decision
- Add `skills.json` as the portable manifest.
- Add `work-item-router.mjs` with recursive skill loading and keyword-based routing.
- Add `setup-quirk-skills.sh` for target-repo installation.
- Add `agent-canvas`, `context-engine`, `mcp-server`, and `subagent-swarm` under `.agents/skills/foundation/`.
- Keep `agent-observability` updated (version 1, new capabilities, preserved contract).

## Consequences
- Router now finds skills at any depth (not just first-level directories).
- `testing-framework` referenced by router is only in `seed/`; router changed to `testing` (canonical skill) to avoid broken references.
- `agent-observability` contract preserved; only metadata updated.
- `.agents/adr/` now contains a real decision record (this file) instead of an empty directory.

## Alternatives
- Static flat router: rejected because it misses `foundation/*` skills.
- No manifest (`skills.json`): rejected because portable installation (`setup-quirk-skills.sh`) requires it.
