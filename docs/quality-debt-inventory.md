# Quality debt inventory

Source: the 2026-10-12 research pack (executive report and prioritized backlog), which is no longer shipped in this repository. The current debt baseline is maintained here and cross-checked in the [3.0.0 gap analysis](research/2026-10-19-skill-lab-v3-gap-analysis-and-v4-roadmap.md).

The research baseline reports:

- Median quality score: **66/100**
- Mean quality score: **69.1/100**
- Grade distribution concern: **151 skills in grade D**, **4 skills in grade F**
- Only `trunk-based-workflow` reaches tier `STANDARD`
- Weakest dimensions: assets, observability, regression coverage, artifact schema, behavioral spec

## Remediation target

The roadmap target is to move all skills to at least grade C:

1. Fase 0: publish this debt inventory and keep the gate visible.
2. Fase 1: remediate the first 20 D/F skills with a minimum D→C template.
3. Fase 3: remediate two additional batches of 20 skills each.

Minimum D→C template:

- Add explicit observable output or evidence section.
- Add or cite a schema for structured artifacts.
- Add at least one regression fixture or behavioral acceptance clause.
- Declare side effects and untrusted-input handling when relevant.

Refresh this inventory from `node .agents/skills/platform/quality-scorer.mjs` before selecting each remediation batch.
