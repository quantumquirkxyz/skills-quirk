# Skill risk tiers T0–T3

Source: `docs/research/2026-10-12-laboratorio-de-skills-estado-del-arte/08-backlog-priorizado.md` (`BL-45`) and `07-roadmap-fases.md` (`M0.6`).

These tiers classify the operational risk of a canonical skill. They are separate from the existing frontmatter `trustTier` field; `trustTier` describes trust posture, while these T0–T3 tiers describe required controls for execution and publication.

| Tier | Scope | Required controls |
|---|---|---|
| T0 — Documentation/read-only | Skills that only explain, summarize, inspect, or write no project state. | Structural validation, lockfile hash, semantic audit. |
| T1 — Local mutation | Skills that edit files, generate artifacts, or run local deterministic commands. | T0 controls + side-effect declaration + approval/justification for mutation. |
| T2 — Network/untrusted input | Skills that fetch web content, query external APIs, or consume MCP/network data. | T1 controls + documented “Manejo de contenido no confiable” + tool-risk budget compliance. |
| T3 — External authority/destructive | Skills that can mutate issue trackers, PRs, deployments, containers, databases, credentials, or other agents. | T2 controls + explicit allowlist, rollback/incident notes, and human approval for irreversible operations. |

## Initial assignment rule

Until every `SKILL.md` has an explicit tier field or generated manifest assignment, derive the initial tier from allowed tools and declared side effects:

1. Start at T0.
2. Move to T1 when `sideEffects` includes local writes or generated manifests allow `Edit`, `Write`, `Bash`, or equivalent local mutation.
3. Move to T2 when tools include `WebFetch`, `WebSearch`, `mcp__*`, `github`, or any network/untrusted-input source.
4. Move to T3 when a skill can perform external mutation, destructive local/container/database changes, credential-bearing operations, or sub-agent orchestration with side effects.

This rule is intentionally conservative. If a skill fits multiple tiers, use the highest tier.
