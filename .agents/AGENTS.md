# Repository Agent Skills

This directory is the repository-local, tool-agnostic Agent Skills bundle. It
is compatible with Codex-style Agent Skills and Claude Code.

- `.agents/skills/` is canonical and version-controlled. Domain directories hold source skills; generated root-level aliases expose the same skills through `.agents/skills/<skill>/SKILL.md` for generic agents.
- Each skill is a self-contained directory with `SKILL.md` and any companion resources.
- `skills-lock.json` records upstream provenance, revisions, and hashes.
- `.claude/skills/` is a compatibility view made of relative symlinks, not the only discovery surface.

Use the root `AGENTS.md` for repository-specific guidance and routing.
