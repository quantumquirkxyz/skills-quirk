# Tool-risk debt budget

Source: `docs/research/2026-10-12-laboratorio-de-skills-estado-del-arte/06-especificaciones-sdd.md` (`SPEC-01` and `SPEC-06`).

The bundle currently carries known tool-risk debt. The gate now treats that debt as a capped budget instead of report-only output:

- Budget file: `policy/tool-risk-budget.json`
- Enforced by: `node .agents/skills/platform/check-all.mjs`
- Current baseline: **84 error-severity findings**, **0 warnings**
- Current dominant class: `untrusted-input-needs-documented-handling`

## Decreasing budget

| Phase | Error budget | Meaning |
|---|---:|---|
| Fase 0 | 84 | Existing debt is visible, capped, and no regression is allowed. |
| Fase 1 | 20 | First remediation batch documents untrusted content handling. |
| Fase 2 | 10 | Operational security gate tightens before model-backed evals. |
| Release target | 0 | No error-severity tool-risk debt remains. |

To tighten the gate, reduce `policy/tool-risk-budget.json.budgets.errors` after remediation lands and the measured count is at or below the new target.

## Operator rule

Do not raise the budget to make a failing change pass. A budget increase is a security exception and requires a dated ADR or incident note explaining why the risk is accepted.
