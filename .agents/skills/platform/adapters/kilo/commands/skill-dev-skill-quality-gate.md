---
description: "Run a reproducible skill-bundle quality gate with manifests, source hashes, deterministic replay, adversarial injection checks, warnings-as-errors, SARIF/attestation, and baseline comparison."
---
# skill-quality-gate

When to use: Run a reproducible skill-bundle quality gate with manifests, source hashes, deterministic replay, adversarial injection checks, warnings-as-errors, SARIF/attestation, and baseline comparison.

## Workflow

1. Identify changed skills and metadata files from the user's scope; hash the exact files and baseline
2. Discover repository validation scripts under the skills platform directory without executing untrusted content
3. Run structural, lockfile, semantic, routing, placeholder, rule, metadata, side-effect, security/injection, SARIF, and attestation checks when available
4. Execute the scoped gate twice with deterministic normalization and compare outputs
5. Inspect warnings and promote release-impacting warnings to failures under warnings-as-errors
6. Compare findings, counts, hashes, and statuses with the named baseline; explain or block on drift
7. Map failures to skill paths and likely repairs; preserve redacted evidence only
8. Return `PASS`, `FAIL`, `BLOCKED`, or `NOT-RUN` with readiness and exact command outcomes

## Deliverables

- skill-dev artifact

## Guardrails

- risk: low; trust tier: 1; approval required: no
- side effects: none
- isolation: none; model tier: reasoning

Stop when: Scoped validators and replay are executed or explicitly blocked, warnings-as-errors is applied, SARIF/attestation and baseline delta are emitted, and readiness is PASS, FAIL, BLOCKED, or NOT-RUN.
