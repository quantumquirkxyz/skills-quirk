# Installation of quirk Skills

> Complete guide for installing and synchronizing the quirk Skills bundle in any repository. Includes installation methods, adoption flow, first steps, specialization rules, readiness checklist, and maintenance.

```text
[ PORT  ] INSTALLATION
```

## 1. Overview

quirk Skills is a portable workflow system designed to be installed in any repository and specialized through CONTEXT.md, ADRs, issue tracker configuration, and stack-specific skills. The bundle is delivered as a set of files that are copied or synchronized into the target repository.

Installation places three fundamental elements in the target repository:

| Element | Description |
|---|---|
| **Canonical skills** | Canonical `SKILL.md` files with SHA-256 lockfile hashes |
| **Compatibility view** | Symlinks in .claude/skills/ for consumers expecting that layout |
| **Method documentation** | `CONTEXT.md`, `docs/reference/agents/`, `docs/how-to/`, `docs/explanation/`, `AUTHORSHIP.md`, and ADR references to specialize the bundle |

After installation, the repository is ready to run the canonical flow: ask-to -> grill-with-docs -> to-spec -> to-tickets -> implement -> publish-open-pr -> review-pr -> ship-subissue.

## 2. Prerequisites

Before installing the bundle, verify that the target repository meets the following:

- **Git** available in PATH (git --version must work).
- **Node.js** 18+ installed (required to run check-all.mjs and other platform scripts).
- **Bash** available as shell (installation scripts use bash).
- Write permissions in the target repository root directory.
- The target repository must be a valid Git repository (git rev-parse --git-dir must work).

> **Note:** gh (GitHub CLI) is not required for bundle installation, but it is required to run publishing and operations skills such as publish-open-pr and ship-subissue.

## 3. Installation methods

Use the method that matches the target repository's risk profile.

### 3.1 Safe sync from a local checkout (recommended)

This is the default path for any real project. The first command is a dry run and writes nothing.

```bash
git clone https://github.com/quantumquirkxyz/skills-quirk.git
cd skills-quirk
node .agents/skills/platform/check-all.mjs
node .agents/skills/platform/sync-bundle.mjs /path/to/target-repo
node .agents/skills/platform/sync-bundle.mjs /path/to/target-repo --write
```

If the dry run reports conflicts, inspect them before using `--force`. Existing repositories should preserve their own `README.md`, `CONTEXT.md`, ADRs, and product documentation unless the user explicitly approves broader adoption changes.

### 3.2 Greenfield installer

Use the shell installer only for a new or disposable target where replacing bundle-managed paths is acceptable:

```bash
git clone https://github.com/quantumquirkxyz/skills-quirk.git
bash skills-quirk/scripts/install-quirk-skills.sh /path/to/new-target-repo /path/to/skills-quirk
```

The installer replaces target paths when they already exist. Do not use it as the default update path for established repositories.

### 3.3 Advanced installer usage

```bash
bash scripts/install-quirk-skills.sh <destination-repo-path> [source-repo-path]
```

| Parameter | Description |
|---|---|
| `<destination-repo-path>` | Path of the repository where the bundle will be installed. |
| `[source-repo-path]` | Path of the source repository. If omitted, the script directory is used. |

## 4. Installed files

The safe sync and greenfield installer copy the bundle-managed files needed for agent discovery and validation:

| File / Directory | Purpose |
|---|---|
| `.agents/AGENTS.md` | Local instructions for the Agent Skills bundle directory. |
| `.agents/skills/` | Canonical skills with `SKILL.md` entrypoints and platform scripts. |
| `.claude/skills/` | Compatibility view exposing canonical skills to Claude-style consumers. |
| `docs/reference/agents/` | Work-item, routing, issue-tracker, and provenance reference. |
| `docs/reference/adr/README.md` | ADR entry point for documenting architectural decisions. |
| `docs/how-to/` | Adoption, installation, release, and workflow guides. |
| `docs/explanation/` | quirk Method and provenance explanations. |
| `AUTHORSHIP.md` | Authorship, naming, and integrity rules. |
| `CONTEXT.md` | Repository-local vocabulary to specialize after install. |
| `skills-lock.json` | SHA-256 hashes for canonical skills. |
| `skills.json` | Portable skills manifest for agent discovery. |
| `.env.template` | Optional environment template for reproducible setup. |

### Installed bundle layers

```mermaid
flowchart LR
    A[Canonical skill] --> B[SKILL.md]
    A --> C[skills-lock.json]
    D[Compatibility view] --> E[.claude/skills symlinks]
    E --> A
    F[CONTEXT.md] --> G[Local vocabulary]
    H[docs/reference/agents] --> I[Work-item governance]
```

| Layer | Components | Purpose |
|---|---|---|
| **Skills** | `.agents/skills/`, `.claude/skills/`, `skills-lock.json` | Canonical definitions and compatibility view |
| **Method** | `CONTEXT.md`, `docs/reference/agents/`, `docs/how-to/`, `docs/explanation/` | Local vocabulary, adoption guides, and governance |
| **Execution** | `check-all.mjs`, `sync-bundle.mjs`, `work-item-router.mjs` | Validation, synchronization, and routing |
| **Quality** | `quality-scorer.mjs`, `security-scanner.mjs`, `dependency-graph.mjs` | Scoring, security, and dependency analysis |

## 5. Adoption flow

After copying the files, specialize the target repository:

```mermaid
flowchart TD
    A[Dry-run or install bundle] --> B[Review changed paths]
    B --> C[Specialize CONTEXT.md]
    C --> D[Configure tracker docs]
    D --> E[Run validation]
    E --> F[Start normal work]
```

Flow steps:

1. **Copy or synchronize** the bundle files with the safe sync path, or use the installer for greenfield targets.
2. **Review changed paths** with `git status --short`; established repositories should not lose local docs or ADRs.
3. **Configure** `docs/reference/agents/issue-tracker.md` and `docs/reference/agents/triage-labels.md` for the project's real tracker and labels.
4. **Update `CONTEXT.md`** with repository-specific vocabulary. Do not copy domain vocabulary from another repo.
5. **Run validation** from the target root: `node .agents/skills/platform/check-all.mjs`.
6. **Start normal work** through `ask-to` for ambiguous routing or the canonical flow for a claimed work item.

## 6. First execution in the project

Once adoption is complete, the repository is ready to run workflows. The flow depends on the task type:

### 6.1 Standard feature flow

```mermaid
flowchart LR
    A[ask-to] --> B[grill-with-docs]
    B --> C[to-spec]
    C --> D[to-tickets]
    D --> E[implement]
    E --> F[publish-open-pr]
    F --> G[review-pr]
    G --> H{clean?}
    H -->|no| I[review-fix-loop]
    I --> G
    H -->|yes| J[ship-subissue]
```

This flow applies to new features. Work goes through planning, specification, division into tickets, implementation, PR opening, review, and eventual shipping.

### 6.2 Bug fix flow

```mermaid
flowchart LR
    A[ask-to] --> B[diagnosing-bugs]
    B --> C[tdd]
    C --> D[implement]
    D --> E[publish-open-pr]
    E --> F[review-pr]
```

For bug fixes, diagnosing-bugs is incorporated for problem isolation and tdd for test-driven development.

### 6.3 Operations flow

```mermaid
flowchart LR
    A[release-management] --> B[deployment]
    B --> C[observability]
    C --> D[observability]
```

For release, deployment, and monitoring activities, the operations flow is used with focus on release management, deployment, and observability.

## 7. Specialization rules

Specializing the bundle for a specific repository is governed by the following rules:

- **Keep skill names stable** unless the target repository has a strong reason to fork them.
- **Specialize through CONTEXT.md**, ADRs, issue tracker documentation, validation commands, and stack-specific skills.
- **Do not embed** domain terms, branch names, issue numbers, or examples from another repository.
- **Preserve** AUTHORSHIP.md, docs/explanation/quirk-method.md, and docs/explanation/provenance.md unless intentionally forking the method.
- **Add new skills** only when the behavior is repeatedly useful and cannot be cleanly expressed through existing skills.
- **Prefer scenario fixtures** under evaluate-skill/scenarios/ before changing central workflow skills.
- **Treat compatibility-only skills** as transitional. Keep them only when the alias is still used externally, and add a concrete migration or retirement note in provenance before the next release touching the surrounding area.

## 8. Readiness checklist

Before considering installation complete, verify the following:

- [ ] setup-quirk-skills has run or equivalent documents exist.
- [ ] docs/reference/adr/ exists with at least one ADR recording a design decision.
- [ ] CONTEXT.md exists, names only this repository domain, and references docs/reference/adr/.
- [ ] docs/reference/agents/issue-tracker.md reflects the project actual tracker.
- [ ] docs/reference/agents/triage-labels.md matches the actual label strings.
- [ ] skills-lock.json matches all local SKILL.md hashes.
- [ ] .claude/skills/ has one symlink per canonical skill.
- [ ] Scenario evaluation passes.
- [ ] Semantic audit passes.
- [ ] Behavioral fixtures pass.
- [ ] Any real use of the bundle is captured under tooling/case-studies/ when the method changes.

## 9. Maintenance cadence

The bundle requires periodic validations to maintain its integrity:

| Verification | When to run |
|---|---|
| check-all.mjs | After each skill edit |
| audit-semantics.mjs | Before publishing the bundle |
| evaluate-scenarios.mjs | After changing routing, templates, or workflow skills |

### Full validation

Run from the repository root directory:

```bash
node .agents/skills/platform/check-all.mjs
```

Expected result: status: pass.

The full gate covers structure, semantic health, 8 scenario fixtures, 4 behavioral fixtures, syntax checks, shell template checks, and platform tests.

## 10. Post-installation steps

After copying the bundle files, complete the following steps to prepare the repository for normal work:

### 10.1 Run setup-quirk-skills

```bash
bash scripts/setup-quirk-skills.sh
```

This script configures the initial bundle structure in the target repository.

### 10.2 Configure the issue tracker

Edit the following files to reflect the project actual configuration:

```bash
docs/reference/agents/issue-tracker.md
docs/reference/agents/triage-labels.md
docs/reference/agents/domain.md
```

- issue-tracker.md: defines the tracking tool (GitHub Issues, Jira, etc.) and navigation conventions.
- triage-labels.md: documents the triage labels used by the team.
- domain.md: describes the project domain documentation structure.

### 10.3 Update CONTEXT.md

Edit CONTEXT.md to include repository-specific vocabulary:

- Project domain terms.
- Boundaries and naming conventions.
- References to docs/reference/adr/.
- Any local rules that must be visible to skills.

Do not copy domain vocabulary from another repository. Each project must have its own CONTEXT.md.

### 10.4 Run validation

```bash
node .agents/skills/platform/check-all.mjs
```

Confirm the result is status: pass.

### 10.5 Verify routing flow

Run the work-item router before any workflow skill when the tracker configuration may have changed:

```bash
node scripts/work-item-router.mjs
```

This ensures routing uses the updated tracker configuration.

### 10.6 Start the standard flow

Use ask-to for ambiguous routing or the canonical flow for a claimed work-item:

1. **ask-to** — determines which skill to use.
2. **grill-with-docs** — refines the plan with questions and documentation.
3. **to-spec** — publishes the specification.
4. **to-tickets** — breaks down into traceable tickets.
5. **implement** — implements each ticket.
6. **publish-open-pr** — opens the PR.
7. **review-pr** — reviews against Standards and Spec.
8. **review-fix-loop** — applies corrections if there are findings.
9. **ship-subissue** — merges and closes the issue when the review is clean.

## 11. Additional notes

### Existing repositories with ADRs

If the target repository already has ADRs and an established CONTEXT.md, use the synchronization flow instead of a clean install:

```bash
node .agents/skills/platform/sync-bundle.mjs /path/to/target-repo
```

To apply changes:

```bash
node .agents/skills/platform/sync-bundle.mjs /path/to/target-repo --write
```

### Dry-run synchronization

Before applying changes, run a dry-run to preview the impact:

```bash
node .agents/skills/platform/sync-bundle.mjs /path/to/target-repo
```

This shows which files would change without modifying them.

## 12. Resources

| Resource | Location |
|---|---|
| **Adoption guide** | adoption.md |
| **Bundle architecture** | ../reference/wiki/Architecture.md |
| **quirk method** | docs/explanation/quirk-method.md |
| **Governance** | ../reference/wiki/Governance.md |
| **Skills catalog** | docs/reference/agents/skill-inventory.md |
| **Skills map** | docs/reference/agents/skills-map.md |
| **Provenance** | docs/explanation/provenance.md |
| **Issue tracker** | docs/reference/agents/issue-tracker.md |
| **Triage labels** | docs/reference/agents/triage-labels.md |
| **Domain** | docs/reference/agents/domain.md
