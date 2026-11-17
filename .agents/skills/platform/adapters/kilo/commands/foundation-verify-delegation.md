---
description: "Black-box verify a delegated worker claim from the artifact, fixed-point inputs, success criteria, and independently reproducible read-only checks; never trust the worker narrative."
---
# verify-delegation

When to use: Black-box verify a delegated worker claim from the artifact, fixed-point inputs, success criteria, and independently reproducible read-only checks; never trust the worker narrative.

## Workflow

1. Validate the brief, schema, boundaries, stop condition, side-effect policy, expiry, and caller authority
2. Compute and freeze the fixed-point digest; verify artifact existence, type, path containment, SHA-256, schema, ownership, and no unexpected files or mutations
3. Build the capability inventory and reject commands not explicitly allowed. Strip worker transcript and implementation context from the verifier context
4. Map every success criterion to an observable assertion, command, expected result, evidence digest, and coverage denominator. Criteria without an observable check are refused
5. Execute the applicable checks and record complete command provenance. Do not infer execution from a worker report, log fragment, or green summary
6. Run the negative-test minimum: at least two independent negative tests for a mutating artifact, and at least one for a read-only artifact. At least one must target the claimed success boundary and one must target an integrity or scope fa...
7. Run an independent verifier/replay from the same fixed point with disjoint context, identity, and evidence collection. Replay must be deterministic or record allowed variance and comparison rules
8. Run the full applicable suite. A partial suite is explicitly `PARTIAL`; omitted tests are `NOT-RUN` with reasons and cannot be counted as green

## Deliverables

- agent artifact

## Guardrails

- risk: medium; trust tier: 3; approval required: yes
- side effects: write-temp-file, write-verdict-artifact, emit-redacted-evidence
- isolation: none; model tier: reasoning

Stop when: Stop after every applicable criterion, integrity check, mandatory negative test, and independent replay has an evidence record, or return a typed non-pass state explaining each NOT-RUN or refusal reason.
