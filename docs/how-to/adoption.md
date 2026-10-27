# quirk Skills Adoption Guide

Use this guide to install this skills bundle into a new or existing project repository.

## Adoption Flow

```mermaid
flowchart TD
    A[Dry-run or install bundle] --> B[Review changed paths]
    B --> C[Specialize CONTEXT.md]
    C --> D[Configure tracker docs]
    D --> E[Run validation]
    E --> F[Start normal work]
```

1. Copy or sync `.agents/skills/`, `.claude/skills/`, `docs/reference/agents/`, `docs/reference/adr/README.md`, `docs/how-to/`, `docs/explanation/`, `AUTHORSHIP.md`, `CONTEXT.md`, `skills-lock.json`, `skills.json`, and `.env.template` into the target repo.
2. Prefer the safe dry-run sync from the source checkout: `node .agents/skills/platform/sync-bundle.mjs /path/to/target-repo` before `--write`.
3. Use `scripts/install-quirk-skills.sh` only for greenfield targets where replacing bundle-managed paths is acceptable.
4. Configure `docs/reference/agents/issue-tracker.md` and `docs/reference/agents/triage-labels.md` for the project's real tracker and labels.
5. Update `CONTEXT.md` with project-specific language. Do not copy domain vocabulary from another repo.
6. Run `work-item-router` before workflow skills whenever tracker governance or ownership may have changed.
7. Run the validation commands in this guide.
8. Start normal work through `ask-to` for ambiguous routing or the canonical feature flow for a claimed work item.

## Prompt-free installation

For optional, selective installation through the open Agent Skills CLI, follow [Installation Options](installation-options.md). That procedure is separate from full-bundle sync: first verify discovery of the nested canonical skills, then verify the target agent installation. Do not assume the external CLI installs quirk governance documents or the full harness.

## Installation Prompts

The repository `README.md` contains two AI-agnostic prompts:

- Use the greenfield prompt when you are bootstrapping a repository that has no prior local context.
- Use the existing-repo prompt when the target repository already has ADRs, a `CONTEXT.md`, and documentation that must remain untouched.

## Required Repo Files

| File | Purpose |
|---|---|
| `AUTHORSHIP.md` | Authorship, naming, and integrity rules |
| `.agents/AGENTS.md` | Agent instructions for the local skills bundle |
| `.agents/skills/` | Canonical skill definitions |
| `.claude/skills/` | Compatibility symlinks to canonical skills |
| `skills-lock.json` | SHA-256 hashes for canonical `SKILL.md` files |
| `skills.json` | Portable skills manifest for agent discovery |
| `.env.template` | Optional reproducible environment template |
| `CONTEXT.md` | Repository-local domain vocabulary |
| `docs/reference/adr/README.md` | ADR entry point |
| `docs/reference/agents/index.md` | Governance index for work-item skills |
| `docs/explanation/quirk-method.md` | Method vocabulary and quality bar |
| `docs/explanation/provenance.md` | Origin, redesign, retired-name record |
| `docs/reference/agents/work-item-format.md` | Metadata shape for specs, tickets, PRs |
| `docs/reference/agents/skill-templates.md` | Artifact template map |

## Validation Commands

Run from the target repo root:

```bash
node .agents/skills/platform/check-all.mjs
```

Expected result: `status: "pass"`, `failed: 0`, `totalWarnings: 0`, and `totalErrors: 0`.

## First Project Run

### Standard feature

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

### Bug fix

```mermaid
flowchart LR
    A[ask-to] --> B[diagnosing-bugs]
    B --> C[tdd]
    C --> D[implement]
    D --> E[publish-open-pr]
    E --> F[review-pr]
```

### Operations

```mermaid
flowchart LR
    A[release-management] --> B[deployment]
    B --> C[observability]
    C --> D[observability]
```

## Specialization Rules

- Keep skill names stable unless the target repo has a strong reason to fork them.
- Specialize through `CONTEXT.md`, ADRs, issue tracker docs, validation commands, and stack-specific skills.
- Do not embed another repo's domain terms, branch names, issue numbers, or examples.
- Preserve `AUTHORSHIP.md`, `docs/explanation/quirk-method.md`, and `docs/explanation/provenance.md` unless intentionally forking the method.
- Add new skills only when the behavior is repeatedly useful and cannot be expressed cleanly through existing skills.
- Prefer scenario fixtures under `evaluate-skill/scenarios/` before changing core workflow skills.
- Treat `compatibility only` skills as transitional. Keep them only when the alias is still used externally, and add a concrete migration or retirement note in provenance before the next release that touches the surrounding area.

## Readiness Checklist

- [ ] `setup-quirk-skills` has run or equivalent docs exist.
- [ ] `docs/reference/adr/` exists with at least one ADR recording a design decision
- [ ] `CONTEXT.md` exists, names only this repo's domain, and references `docs/reference/adr/`
- [ ] `docs/reference/agents/issue-tracker.md` reflects the actual tracker.
- [ ] `docs/reference/agents/triage-labels.md` matches actual label strings.
- [ ] `skills-lock.json` matches all local `SKILL.md` hashes.
- [ ] `.claude/skills` has a symlink for every canonical skill.
- [ ] Scenario evaluation passes.
- [ ] Semantic audit passes.
- [ ] Behavioral fixtures pass.
- [ ] Any real use of the bundle is captured under `tooling/case-studies/` when it changes the method.

## Maintenance Cadence

| Check | When to run |
|---|---|
| `check-all.mjs` | After every skill edit |
| `audit-semantics.mjs` | Before publishing the bundle |
| `evaluate-scenarios.mjs` | After changing routing, templates, or workflow skills |
