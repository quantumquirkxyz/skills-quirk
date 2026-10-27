# Installation Options: From One Skill to Full Harness

Status: installation guidance reviewed 2026-10-26. The third-party `skills` CLI commands below follow its published interface; integration with this repository's nested layout has **not** been smoke-tested here. Test against a clean disposable project before recommending a command as verified for quirk Skills.

## Preferred discovery path: Agent Skills CLI

From the **target project** directory, the open ecosystem CLI supports GitHub repository sources:

```bash
# Discover available skills without installing (verify what the CLI finds)
npx skills add quantumquirkxyz/skills-quirk --list

# Interactive project-scoped installation, after reviewing discovered skills
npx skills add quantumquirkxyz/skills-quirk

# Select a specific skill only if the prior --list output includes it
npx skills add quantumquirkxyz/skills-quirk --skill <discovered-skill-name>
```

The repository URL is also an accepted source format:

```bash
npx skills add https://github.com/quantumquirkxyz/skills-quirk --list
```

This avoids copying a prompt into an agent. The CLI may ask which skills, target agent and installation mechanism to use. Do **not** assume that the third-party CLI discovers every skill in `.agents/skills/<domain>/<skill>/SKILL.md`; confirm the `--list` output and an installed `SKILL.md` before adoption. For repository-local (not global) installation, use the default scope. Prefer selected skills over installing the entire large bundle.

Requires a Node.js version supported by the current `skills` CLI (its published package lists Node 22.20+ as of October 2026); the quirk repository's own Node engine requirement is separate. The CLI may collect anonymous install telemetry; set `DISABLE_TELEMETRY=1` to opt out, per its documentation. Pin or review the source revision and audit side effects before using third-party skills in sensitive environments.

## Managed/full bundle installation

The repository has **different** distribution mechanisms, and they are not interchangeable:

| Mode | Intended outcome | Caveat |
|---|---|---|
| `npx skills add ...` | Selective Agent Skills for supported agents | Does not imply quirk governance docs, lockfile, and full harness tools have been installed |
| `node .agents/skills/platform/sync-bundle.mjs <target>` from a quirk checkout | Inspect managed bundle sync | Dry-run before using `--write`; review changed paths |
| `bash scripts/install-quirk-skills.sh <target> <source>` | Copy bundle-managed files to a greenfield project | Replaces pre-existing managed paths; never run unreviewed against an established project |
| `bash scripts/setup-quirk-skills.sh <target> <source>` | Copy bundle and prompt for tracker settings | Interactive and replaces paths; do not use as a non-interactive unattended installer |

For full harness adoption, follow [Adoption Guide](adoption.md) and [Generated Views](generated-views.md). Execute check-all only from a complete checkout with the needed toolchain and dependencies; a selective skill installation is **not** expected to contain all scripts.

## Acceptance tests for installability

In a clean disposable repo with no existing agent files:

1. Run `npx skills add quantumquirkxyz/skills-quirk --list`. Capture exit code, names discovered and tool version.
2. Pick one displayed skill, install locally and verify its `SKILL.md` frontmatter, companion references and expected agent discovery path.
3. Try repeat install/update; check for overwrites, broken symlinks and stale assets.
4. Test isolation from pre-existing `CONTEXT.md`, `AGENTS.md`, `docs/`, and user skills in an **existing project fixture**; no data should disappear unexpectedly.
5. Repeat on supported operating systems and agents; classify each combination as PASS, FAIL, or NOT RUN.
6. Only after validation, publish a verified one-line install recommendation and consider automated CI install smoke tests.

Avoid `curl | sh` installers, unreviewed `--all` selections, and unpinned arbitrary scripts when standard CLI discovery is available. Treat installation as a supply-chain security boundary.

## References

- [Agent Skills CLI reference](https://www.skills.sh/docs/cli)
- [Agent Skills CLI source formats](https://github.com/vercel-labs/skills/blob/main/docs/commands.md)
- [Agent Skills interoperability](https://agentskills.io/)
