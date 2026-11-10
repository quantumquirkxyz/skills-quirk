# Installation Options: From One Skill to Full Harness

Status: installation guidance reviewed 2026-11-10. Skills are installed **by prompt only** — there is no npm/npx installation channel for this bundle. Re-run the portable distribution workflows for the exact release candidate before publishing.

## Preferred path: prompt-based install

Use one of the prompts preserved verbatim in [README.md → Installation & Sync](../../README.md#installation--sync). Paste the prompt into the AI coding agent working inside the target repository; the agent clones or references this repository, copies the bundle-managed files, and validates the result.

This is the only endorsed installation channel. Do not publish or consume an npm package for skill installation.

## Selective adoption: safe sync from a local checkout

From a local checkout of this repository:

```bash
node .agents/skills/platform/check-all.mjs
node .agents/skills/platform/sync-bundle.mjs /path/to/target-repo          # dry run
node .agents/skills/platform/sync-bundle.mjs /path/to/target-repo --write  # apply
```

The dry run writes nothing. Existing repositories should preserve their own `README.md`, `CONTEXT.md`, ADRs, and product documentation unless the user explicitly approves broader adoption changes.

## Managed lifecycle: dry-run-first CLI

Run the CLI from this checkout with `node bin/skills-quirk.js <command>` (it is not installed globally):

```bash
node bin/skills-quirk.js adopt            # preview conflicts and planned files, no writes
node bin/skills-quirk.js adopt --write    # apply only if the preview reports no conflicts
```

The `adopt` command routes to the repository's `sync-bundle.mjs` synchronizer. A successful write creates `.agents/quirk-install.json`, which records hashes of bundle-managed files and compatibility links. That manifest enables three additional lifecycle commands:

```bash
node bin/skills-quirk.js verify-install       # detect missing/modified managed files
node bin/skills-quirk.js upgrade              # preview changed managed files and backup plan
node bin/skills-quirk.js upgrade --write      # back up changed managed files, then upgrade
node bin/skills-quirk.js rollback             # preview restoration of the latest pre-upgrade state
node bin/skills-quirk.js rollback --write     # restore exact backed-up bytes if no post-upgrade drift exists
node bin/skills-quirk.js uninstall            # preview conservative removal
node bin/skills-quirk.js uninstall --write    # remove only unchanged managed files/links
```

`upgrade --write` stores changed managed files and the previous install manifest under `.agents/quirk-backups/<timestamp>/` before replacement. `rollback --write` restores that exact pre-upgrade state only when the current managed installation has not drifted after the upgrade; pre-existing local drift remains visible after restoration. `uninstall --write` refuses to remove a managed path that has been edited or replaced by the host project. Compatibility-view conflicts block before any copy begins.

The `adopt` command refuses overlapping source/target directories and destination symlink traversal, detects differing existing bundle-managed files, and preserves already-correct compatibility links. It deliberately does **not** copy the source repository's `README.md`, `CONTEXT.md`, `LICENSE`, `VERSION`, or `CHANGELOG.md` into a consuming project. Create or edit project-specific `CONTEXT.md` separately. The legacy `install` and `add quirk-skills` commands remain available but are destructive or interactive: do not substitute them for safe adoption. The managed lifecycle is exercised by the repository test suite and the portable distribution matrix; use the dry-run modes first in established repositories.

## Managed/full bundle installation

The repository has **different** distribution mechanisms, and they are not interchangeable:

| Mode | Intended outcome | Caveat |
|---|---|---|
| Prompt-based install (README) | Full bundle plus governance docs into the target repository | Review the agent's plan before it writes |
| `node .agents/skills/platform/sync-bundle.mjs <target>` from a quirk checkout | Inspect managed bundle sync | Dry-run before using `--write`; review changed paths |
| `bash scripts/install-quirk-skills.sh <target> <source>` | Copy bundle-managed files to a greenfield project | Replaces pre-existing managed paths; never run unreviewed against an established project |
| `bash scripts/setup-quirk-skills.sh <target> <source>` | Copy bundle and prompt for tracker settings | Interactive and replaces paths; do not use as a non-interactive unattended installer |

For full harness adoption, follow [Adoption Guide](adoption.md) and [Generated Views](generated-views.md). Execute check-all only from a complete checkout with the needed toolchain and dependencies; a selective skill installation is **not** expected to contain all scripts.

## Acceptance tests for installability

In a clean disposable repo with no existing agent files:

1. Paste the README install prompt into an AI coding agent; capture the plan it proposes before any write.
2. Apply the install and verify `SKILL.md` frontmatter, companion references, `skills-lock.json` hashes, and `.claude/skills/` symlink parity.
3. Try repeat install/update; check for overwrites, broken symlinks and stale assets.
4. Test isolation from pre-existing `CONTEXT.md`, `AGENTS.md`, `docs/`, and user skills in an **existing project fixture**; no data should disappear unexpectedly.
5. Repeat on supported operating systems and agents; classify each combination as PASS, FAIL, or NOT RUN.
6. Only after validation, publish a verified one-line install recommendation.

Avoid `curl | sh` installers, unreviewed `--all` selections, and unpinned arbitrary scripts. Treat installation as a supply-chain security boundary.

## References

- [Adoption Guide](adoption.md)
- [Installation of quirk Skills](installation.md)
- [Agent Skills interoperability spec](https://agentskills.io/)
