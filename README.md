![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.0-green.svg)

# quirk Skills

`quirk Skills` is a **repository-local engineering workflow** for taking software projects from rough intent to reviewed, validated delivery.

The bundle follows the `quirk` method: clarify before building, preserve project context, cut work into claimable slices, review through separate Standards and Spec axes, repair through explicit plans, and ship only after evidence is clean.

When a PR branch is conflicted, the review-repair flow first routes that branch-state problem through `resolving-merge-conflicts`, then returns to `review-pr` / `review-fix-loop`, and only ships once the branch is clean and review is clean.

## Table of Contents

- [What This Is](#what-this-is)
- [Core Flow](#core-flow)
- [Method](#method)
- [Official Documentation](#official-documentation)
- [Validate](#validate)
- [Versioning](#versioning)
- [Distribution](#distribution)
- [Install In Any Repo](#install-in-any-repo)
- [Authorship](#authorship)

## What This Is

> A portable skills stack for standard project development. Copy or adapt into project repositories, then specialize through each repo's own `CONTEXT.md`, ADRs, issue tracker configuration, validation commands, and stack-specific skills.

| Location | Role |
|---|---|
| `.agents/skills/` | Canonical skill definitions |
| `.claude/skills/` | Compatibility view (symlinks) |


## Core Flow

```mermaid
flowchart TD
    A[setup-quirk-skills] --> B[work-item-router]
    B --> C[ask-to]
    C --> D[grill-with-docs]
    D --> E[to-spec]
    E --> F[to-tickets]
    F --> G[implement]
    G --> H[publish-open-pr]
    H --> I[review-pr]
    I --> J{findings?}
    J -->|yes| K[review-fix-loop]
    K --> I
    J -->|no| L[ship-subissue]
```

## Method

The method is documented in:

| Document | Purpose |
|---|---|
| [AUTHORSHIP.md](AUTHORSHIP.md) | Authorship and integrity |
| [quirk method](docs/agents/quirk-method.md) | Method vocabulary and quality bar |
| [provenance](docs/agents/provenance.md) | Origin and redesign status |
| [adoption guide](docs/agents/adoption-guide.md) | Installation and sync |
| [skill templates](docs/agents/skill-templates.md) | Artifact templates map |
| [stack matrix](docs/agents/stack-matrix.md) | Stack-specific skills |
| [skill style guide](docs/agents/skill-style-guide.md) | Editing and authoring rules |
| [Skill Lab toolkit](docs/agents/skill-lab.md) | Skill lab reference |
| [release checklist](docs/agents/release-checklist.md) | Pre/post-release gates |
| [multi-agent protocol](docs/agents/multi-agent-protocol.md) | Multi-session handoff rules |

## Official Documentation

For a portable, AI-agnostic installation and usage path, start here:

> Start here for installation, templates, and the full skills inventory.

| Document | Purpose |
|---|---|
| [Adoption guide](docs/agents/adoption-guide.md) | Installation and sync |
| [Skill templates](docs/agents/skill-templates.md) | Scaffolding reference |
| [Skills map](docs/agents/skills-map.md) | Full inventory |

### Installation Flow

```mermaid
flowchart TD
    A[Clone or sync bundle] --> B[Run setup-quirk-skills]
    B --> C[Configure issue tracker and domain docs]
    C --> D[Run check-all]
    D --> E[Start with ask-to]
```

### Review and Shipping Flow

```mermaid
flowchart TD
    A[review-pr] -->|findings| B[plan-review-fixes]
    B --> C[implement-review-fixes]
    C --> D[review-pr again]
    D -->|clean| E[ship-subissue]
    C -->|branch conflicted| F[resolving-merge-conflicts]
    F --> D
```

### Standard Feature Flow

```mermaid
sequenceDiagram
    participant U as User or AI agent
    participant A as ask-to
    participant G as grill-with-docs
    participant S as to-spec
    participant T as to-tickets
    participant I as implement
    participant P as publish-open-pr
    participant R as review-pr
    participant F as review-fix-loop
    participant M as ship-subissue

    U->>A: Ask what to do next
    A->>G: Route to plan sharpening
    G->>S: Publish spec
    S->>T: Split into tickets
    T->>I: Implement each ticket
    I->>P: Open PR
    P->>R: Review PR
    R-->>F: If fixes are needed
    F->>R: Re-review until clean
    R-->>M: When clean
```

## Validate

Run the local gate from the repo root:

```bash
node .agents/skills/platform/check-all.mjs
```

Expected result: `status: "pass"`.

## Versioning

The current version is recorded in [VERSION](VERSION). Release changes are recorded in [CHANGELOG.md](CHANGELOG.md).

## Distribution

### Dry-run sync

```bash
node .agents/skills/platform/sync-bundle.mjs /path/to/target-repo
```

### Apply sync

```bash
node .agents/skills/platform/sync-bundle.mjs /path/to/target-repo --write
```

## Install In Any Repo

The bundle is designed to be copied into another repository and then specialized there.

## AI-Agnostic Prompts

Use one of these prompts when you want an AI-agnostic IDE to install or sync this skills bundle into another repository.

### 1. Greenfield repository, no prior context

```text
You are going to install the quirk Skills bundle into this repository from scratch.

REPO_UPSTREAM = <url of the canonical skills repo>  # for example, https://github.com/quantumquirkxyz/skills-quirk

## Objective
Bring this repository into a valid quirk Skills state with the canonical bundle installed, local context documented, and the repo ready for normal work.

## What you must not touch
- Any existing ADRs or files under `docs/adr/`
- Any repository documentation that is already established and unrelated to the bundle bootstrap
- Anything that is not needed to install, configure, or validate the skills bundle

## Allowed scope
1. `.agents/skills/**`
2. `.claude/skills/**`
3. `skills-lock.json`
4. `CONTEXT.md`
5. `README.md` only if needed to add a short install or usage entry point
6. `docs/agents/**` only if the repository does not already have the quirk documentation surface and it must be created as part of the bootstrap

## Steps
1. Clone the upstream into a temporary directory with `git clone --depth 1 <REPO_UPSTREAM> <temp-dir>`.
2. Verify that the upstream contains `.agents/skills/**`, `.claude/skills/**`, `skills-lock.json`, and the expected docs surface.
3. Compare the local repo with the upstream bundle and identify any missing skills, renamed skills, or local-only additions.
4. Copy the canonical bundle into the local repo, preserving symlinks and lockfile hashes.
5. Create or update `CONTEXT.md` so it describes only this repository's local vocabulary and setup.
6. Update `README.md` only if it needs a short installation or usage entry point for the new repository.
7. Run the bundle validation commands and confirm the working tree is clean for the intended scope.

## Final checks
- `git status` must show only the expected bundle files and the local context/docs files you intentionally changed.
- No ADR file under `docs/adr/` should be modified unless the user explicitly requested it.
- The result should be a repository that can be used by an AI-agnostic IDE without extra hidden setup.
```

### 2. Existing repository with ADRs and local context

```text
You are going to synchronize the quirk Skills bundle in this repository with the canonical upstream.

REPO_UPSTREAM = <url of the canonical skills repo>  # for example, https://github.com/quantumquirkxyz/skills-quirk

## Objective
Update the skills implementation so it matches the upstream bundle while preserving the repository's own documentation, ADRs, and local context.

## What you must not touch
- `docs/adr/**` and any ADR content
- `CONTEXT.md`
- `README.md`
- Any repository documentation outside the skills bundle scope
- Any project files unrelated to the skills bundle

## Allowed scope
1. `.agents/skills/**`
2. `.claude/skills/**`
3. `skills-lock.json`
4. Optional: `.agents/AGENTS.md` only if the upstream bundle includes it and it differs

## Steps
1. Clone the upstream into a temporary directory with `git clone --depth 1 <REPO_UPSTREAM> <temp-dir>`.
2. Inspect the differences between local and upstream before editing anything.
3. Replace the canonical skills tree, compatibility view, and lockfile with the upstream versions, preserving symlinks.
4. Do not rewrite repository docs or ADRs to make the sync fit; keep the bundle change narrowly scoped to the skills bundle only.
5. Validate the sync and confirm that only the allowed paths changed.

## Final checks
- `git status --short` must show only `.agents/skills/`, `.claude/skills/`, `skills-lock.json`, and any explicitly allowed optional file.
- `docs/adr/**`, `CONTEXT.md`, and `README.md` must remain untouched.
- If any protected path changes, revert only that part before finishing.
```

### Quick start

```bash
bash scripts/install-quirk-skills.sh /path/to/target-repo
```

### One-line installer

```bash
curl -fsSL https://raw.githubusercontent.com/quantumquirkxyz/skills-quirk/main/scripts/install-quirk-skills.sh | bash -s -- /path/to/target-repo
```

If you already have a local checkout of this bundle, use:

```bash
bash scripts/install-quirk-skills.sh /path/to/target-repo
```

If you prefer to inspect first and then install from a clone:

```bash
git clone https://github.com/quantumquirkxyz/skills-quirk.git
cd skills-quirk
bash scripts/install-quirk-skills.sh /path/to/target-repo
```

The installer copies these bundle files:

| File | Purpose |
|---|---|
| `.agents/skills/` | Canonical skill definitions |
| `.claude/skills/` | Compatibility symlinks |
| `docs/agents/` | Governance and method docs |
| `docs/adr/README.md` | ADR entry point |
| `CONTEXT.md` | Repository-local vocabulary |
| `skills-lock.json` | Canonical skill hashes |

### After installation

1. Run `setup-quirk-skills` in the target repo.
2. Follow the [adoption guide](docs/agents/adoption-guide.md) to set the issue tracker, domain docs, and validation commands.
3. Use `ask-to` or the standard flow to route work.

## Authorship

Copyright (c) 2026 Jhuomar Boskoll Quintero.

The project is MIT licensed. See [LICENSE](LICENSE).
