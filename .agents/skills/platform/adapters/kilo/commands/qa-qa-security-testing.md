---
description: "Run reproducible security tests for authorization drift, adversarial tool and prompt injection, secret exfiltration, session abuse, and configuration exposure with safe evidence."
---
# qa-security-testing

When to use: Run reproducible security tests for authorization drift, adversarial tool and prompt injection, secret exfiltration, session abuse, and configuration exposure with safe evidence.

## Workflow

1. Create the manifest and hash target/code/fixtures/configuration/dependency lock before execution
2. Identify assets, roles, trust boundaries, authorization invariants, and secret-handling assumptions
3. Define positive/negative scenarios for auth, authorization drift, input handling, sessions, tool/prompt injection, exfiltration, and configuration
4. Exercise controlled accounts and synthetic canaries only; record exact command, seed, fixture, and stop-event
5. Replay the run twice in the same isolated environment; require equivalent normalized findings and evidence hashes
6. Compare with a named baseline; new or worsened findings are failures, unexplained differences are blocked
7. Capture only redacted request shape, response metadata, logs, and evidence references
8. Emit SARIF and attestation, rate impact/likelihood/boundary, and define remediation and retest criteria

## Deliverables

- test-strategy artifact

## Guardrails

- risk: low; trust tier: 1; approval required: no
- side effects: none
- isolation: none; model tier: reasoning

Stop when: Scope is authorized, fixtures and replay are recorded, findings are emitted as SARIF plus attestation, baseline drift is evaluated, and status is PASS, FAIL, BLOCKED, or NOT-RUN.
