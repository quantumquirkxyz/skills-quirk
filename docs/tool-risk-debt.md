# Tool-risk debt budget

Source: `SPEC-01` and `SPEC-06` from the 2026-10-12 research pack, which is no longer shipped in this repository. This page and `policy/tool-risk-budget.json` are the current operating source of truth.

The previously reported tool-risk debt is remediated. The gate keeps the budget as a fail-closed regression guard:

- Budget file: `policy/tool-risk-budget.json`
- Enforced by: `node .agents/skills/platform/check-all.mjs`
- Current baseline: **0 error-severity findings**, **0 warnings**
- Current dominant class: `untrusted-input-needs-documented-handling`

## Decreasing budget

| Phase | Error budget | Meaning |
|---|---:|---|
| Fase 0 | 84 | Historical baseline before remediation. |
| Fase 1 | 20 | First remediation batch documents untrusted content handling. |
| Fase 2 | 10 | Operational security gate tightens before model-backed evals. |
| Release target | 0 | No error-severity tool-risk debt remains. |

The current budget is zero. Do not raise it to make a failing change pass; any exception requires a dated ADR or incident note.

## Operator rule

Do not raise the budget to make a failing change pass. A budget increase is a security exception and requires a dated ADR or incident note explaining why the risk is accepted.
