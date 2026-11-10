# Release Checklist

Use this checklist before publishing a new quirk Skills version.

```mermaid
flowchart TD
    A[Start release] --> B[Pre-release checks]
    B --> C[Commit and tag]
    C --> D[Release]
    D --> E[Post-release validation]
    E --> F[Add case study if needed]
```

## Pre-release

- [ ] Update `VERSION`.
- [ ] Update `CHANGELOG.md`.
- [ ] Update `../explanation/provenance.md` for new, renamed, or retired skills.
- [ ] Update `../reference/agents/skills-map.md` if routing changed.
- [ ] Add or update scenarios for workflow changes.
- [ ] Add or update behavioral fixtures for artifact-template changes.
- [ ] Run `node .agents/skills/platform/check-all.mjs` — full structural, semantic, and security gate.
- [ ] Run `node scripts/generate-site-data.mjs --check` — site drift verification (skills-to-site consistency).
- [ ] Run quality scorer domain consistency check.
- [ ] Run prompt regression tests (`node .agents/skills/platform/scripts/test-prompt-regression.mjs --check`).
- [ ] Verify install script hash (`sha256sum scripts/setup-quirk-skills.sh`).
- [ ] Verify no project-specific vocabulary leaked into reusable docs.
- [ ] Commit only scoped release files.
- [ ] Tag as `v<version>`.
- [ ] Push branch and tag.

## Lockfile provenance

`skills-lock.json` pins content and origin for every canonical skill. Two fields
carry the provenance contract, and `validate-skills.mjs` rejects anything else:

| Field | Allowed values | Meaning |
|---|---|---|
| `sourceType` | `local`, `upstream` | Whether the skill is authored here or imported. |
| `revision` | `working-tree` for `local`; the upstream commit or tag for `upstream` | Where the bytes came from. |

- `local` entries always record `revision: "working-tree"`: the hash is the pin
  and there is no upstream revision to name. Do not substitute a commit SHA — it
  would claim provenance the skill does not have.
- A release pins the bundle by tag (`v<version>`) plus the per-skill hash.
- `update-lockfile.mjs` writes the `local` / `working-tree` shape; change an
  `upstream` entry only together with the import that produced it.

## Release

The tag-triggered workflow is `.github/workflows/release.yml`. It validates version equality, runs the full suite and gate (including site drift, quality scorer, prompt regression, and install hash verification), and then creates the GitHub Release. **There is no npm publication: skills are distributed through the prompt-based installation flow documented in the README.**

- [ ] Commit only scoped release files.
- [ ] Tag as `v<version>`.
- [ ] Push branch and tag.
- [ ] Publish release notes from `CHANGELOG.md`.

**Distribution note:** Skills are not published to npm. They are consumed via prompt-based installation (see README). The workflow enforces this by rejecting any release that would alter the npm/install surface.

## Post-release

- [ ] Sync one target repo using dry-run first.
- [ ] Run the target repo validation commands.
- [ ] Add a case study if the release exposed a method change.