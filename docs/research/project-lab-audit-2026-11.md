# Skills Laboratory Audit — 2026-11-21

## Scope

This audit covered the canonical bundle under `.agents/skills/`, generated
compatibility and discovery projections, platform executables, tests, routing
evals, security scans, and external Skills guidance. The repository contained
270 canonical skills (the `platform` directory is infrastructure), 285 tracked
skill-related directories including compatibility aliases, 716 automated tests,
and 13 routing fixture files.

## Baseline findings and repairs

| Finding | Impact | Repair |
|---|---|---|
| 218 `SKILL.md` files contained empty Markdown headings (`#`, `#`). | Noise and wasted activation tokens; poor progressive disclosure. | Removed empty headings and redundant blank lines without changing substantive instructions. |
| Seven Graphic Design skills, Project Viability, Feature Flag, Context Compaction, Verify Delegation, and four Auxiliary skills omitted required quirk metadata fields. | Inconsistent routing, scoring, runtime manifests, and governance. | Added category, maturity, version, risk, trust tier, stop condition, capabilities, or iteration bounds as applicable. |
| `skill-creator` documented scripts and templates that were not shipped at the skill path. | Fresh installations could not execute the documented workflow. | Moved the scripts into the canonical skill, added both YAML templates, and updated the script README and architecture documentation. |
| Review-fix and loop skills referenced missing companion references. | Agents could not produce or consume the promised handoff shapes. | Added canonical review-plan, implementation-note, and loop-budget references. |
| `publish-open-pr` referenced a missing `render_pr_bundle.py`. | Publication workflow stopped before PR preparation. | Added a read-only renderer that gathers git state and optional `gh` issue metadata; it never pushes or mutates a PR. |
| Agent Card skill referenced a missing `a2a-router.mjs`; generated URLs pointed at `quirk/example`. | Discovery and invocation routing were broken or misleading. | Added a read-only A2A router with list/discover/invoke commands and corrected generated URLs to this repository. |
| Generated projections became stale after canonical edits. | Gate reported false drift and runtime manifest errors. | Regenerated lockfile, catalog, llms index, marketplace, site data, runtime manifests, adapters, agent cards, and skill search index. |
| Loop reference described fields the runner did not emit (`progressMeasure`) and omitted actual ledger fields. | Agents could implement incompatible loop consumers. | Reconciled the reference with `loop-runner.mjs`, including exact budget names, statuses, nudges, and ledger shape. |

## External comparison

The comparison used the official [Agent Skills specification](https://agentskills.io/specification)
and current [Claude Code Skills documentation](https://code.claude.com/docs/en/skills).

### Confirmed alignment

- Every canonical skill has a `SKILL.md` and valid `name`/description surface.
- Names are lowercase kebab case and match their skill directories.
- Main bodies are below the recommended 500-line limit; the one oversized body
  (`quant-backtest`, approximately 5,148 tokens) is within the line limit but is
  a candidate for reference extraction.
- The bundle uses progressive disclosure through `references/`, `assets/`, and
  `scripts/`, matching the standard's recommended structure.
- Claude-compatible symlinks are generated rather than hand-authored.
- High-risk skills are not exposed through MCP by default; approval and trust
  metadata are explicit in the quirk extension layer.

### Differences that are intentional extensions

The official standard requires only `name` and `description` and treats extra
metadata as client-defined. Quirk metadata (`risk`, `trustTier`, `sideEffects`,
`outputs`, `stopCondition`, fixtures, and approval fields) is therefore an
extension, not a standard violation. It is useful for governed multi-agent
execution, but consumers that only implement the standard will ignore it.

Claude Code additionally supports invocation controls, allowed tools, forked
context, dynamic context, and path activation. The bundle currently models
some invocation controls but should not assume those Claude-only fields work in
Codex, OpenAI Agents, Cursor, or MCP consumers. Adapters must continue to
translate rather than copy unsupported frontmatter blindly.

## Remaining improvement backlog

1. Replace the 61 generic `outputs: a structured artifact...` declarations with
   skill-specific schemas or explicit prose. They pass current non-strict gates,
   but reduce downstream handoff precision.
2. Split `quant-backtest` into a concise activation contract plus references for
   validation statistics and regulatory detail.
3. Add executable tests for the new A2A router and PR renderer, including missing
   index/card, malformed JSON, unavailable `gh`, and shell-injection-shaped issue
   values. The implementations are read-only and use argument arrays, but direct
   regression coverage is still valuable.
4. Add a reference-integrity checker that distinguishes intentionally external
   project files (`CONTEXT.md`, `MEMORY.md`, `package-lock.json`) from genuinely
   missing skill-local resources. The current manual scan found 10 actionable
   missing local references before this audit and several context-dependent ones.
5. Add a supported-version policy for external documentation refreshes. Current
   external docs are cited by URL; future changes should record retrieval date,
   affected skills, and the compatibility decision rather than copying vendor
   text into every skill.

## Evidence

- `node .agents/skills/platform/check-all.mjs`: 24/24 checks passed; zero errors.
- `node --test .agents/skills/platform/tests/*.test.mjs tests/*.test.mjs`: 716 passed.
- Routing eval: 203 rows, 60 negative controls, zero errors.
- Documentation links: 1,600 Markdown files and 2,077 local links, pass.
- Security scanners: zero critical/high/medium/low findings.
- Strict skill validation: 270 skills, zero warnings/errors.
