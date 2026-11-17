---
description: "Run a reproducible, composable Skill-bundle quality gate with policy-as-code severities, baseline deltas, security and agentic evaluations, mutation/property/adversarial checks, SARIF/attestations, and fail-closed verdicts."
---
# skill-quality-gate

When to use: Run a reproducible, composable Skill-bundle quality gate with policy-as-code severities, baseline deltas, security and agentic evaluations, mutation/property/adversarial checks, SARIF/attestations, and fail-closed verdicts.

## Workflow

1. Freeze scope and compute the reproducibility manifest before running commands
2. Validate policy, baseline freshness, fixture inventory, gate DAG, and contract include
3. Run independent root gates in isolation, then dependants in topological order with bounded timeout and cancellation
4. Run behavioral, security, agentic, mutation, property, and adversarial fixtures; preserve redacted traces and counterexamples
5. Replay the complete scoped graph twice using the same seed and compare normalized results, counts, findings, hashes, and statuses
6. Compare against the named baseline and classify every delta; stop on stale or unexplained evidence
7. Generate and read back SARIF, attestation, manifest, and evidence ledger; verify all digests and references
8. Apply warnings budget and fail-closed verdict rules; map findings to exact paths and repair priority. A bundle is ready with warnings only when policy explicitly permits those non-blocking findings and records them

## Deliverables

- skill-dev artifact

## Guardrails

- risk: low; trust tier: 1; approval required: no
- side effects: none
- isolation: none; model tier: reasoning

Stop when: Every required gate is terminal or explicitly BLOCKED/NOT-RUN; policy, baseline, replay, artifact integrity, evidence ledger, SARIF, and attestation checks are complete; verdict is fail-closed.
