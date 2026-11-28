# ADRs

Architecture Decision Records. Entry point shipped to consuming repositories.

This directory is a **template surface**: the installer copies this README into a
target repository that has no ADR convention yet. It does not hold this
repository's decision records.

Where the records live here:

| Path | Contents |
|---|---|
| `.agents/adr/` | Decisions about the bundle itself (frontmatter format, `adr: NNNN`) |
| `docs/adr/` | Repository-level design records (`ADR-001` … `ADR-005`) |
| `docs/reference/adr/` | This README only |

Rules:
- Record every durable design choice with context, decision, consequences, alternatives, and status.
- Reference `CONTEXT.md` vocabulary.
- Do not publish placeholders.
- Review the record before shipping.

Compatibility view: `.claude/skills/` is maintained as relative symlinks to `.agents/skills/` (see `.agents/AGENTS.md` and `README.md`).
