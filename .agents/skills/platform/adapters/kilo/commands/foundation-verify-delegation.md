---
description: "Black-box verify a delegated worker claim from the artifact, fixed-point inputs, success criteria, and independently reproducible read-only checks; never trust the worker narrative."
---
# verify-delegation

When to use: Black-box verify a delegated worker claim from the artifact, fixed-point inputs, success criteria, and independently reproducible read-only checks; never trust the worker narrative.

## Workflow

1. Inspect claim: validate the brief, schema, boundaries, stop condition, expiry, and caller authority
2. Gather evidence: compute and freeze the fixed-point digest; verify artifact existence, type, path containment, SHA-256, schema, ownership, and no unexpected files
3. Verify against fixed point: compare artifact digest, tool versions, revision, and expiry window against the snapshot
4. Check capability inventory: reject commands not explicitly allowed; strip worker transcript and implementation context from the verifier context
5. Run negative tests: meet the negative-test minimum against observable assertions mapped from success criteria
6. Compare digest: recheck artifact digest and side effects after execution; hidden writes, undeclared network access, changed files, or output drift produce `FAIL`, `BLOCKED`, or `OUTCOME-UNKNOWN`
7. Emit verdict: bounded `VerificationVerdict` JSON + Markdown, transcript-free; issue refusal when evidence is insufficient

## Deliverables

- agent artifact

## Guardrails

- risk: medium; trust tier: 3; approval required: no
- side effects: none
- isolation: none; model tier: reasoning

Stop when: Black-box verification complete; evidence reviewed; capability inventory confirmed; fixed-point digest matches; refusal issued when evidence insufficient.
