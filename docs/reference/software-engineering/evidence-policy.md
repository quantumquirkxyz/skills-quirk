# Evidence Policy

> **Status:** Phase 0 policy | **Owner:** quirk Skills maintainers | **Scope:** evidence claims produced by quirk Skills and related work items | **Last reviewed:** 2026-11-17 | **Review cadence:** quarterly and after a material gate change

## Evidence hierarchy

Use the strongest available authority and preserve weaker observations as qualified evidence rather than silently upgrading them:

1. **Shipped artifact evidence:** immutable source, build output, SBOM, signed provenance, test report, deployment record, or production observation with identity and digest.
2. **Controlled replay:** deterministic fixture, isolated integration run, reproducible benchmark, or approved staging observation with environment and inputs recorded.
3. **Historical reference:** prior approved baseline, incident record, release note, or archived standard edition. Historical evidence is not current proof without a compatibility decision.
4. **External authority:** applicable standard, regulator, vendor documentation, or independent assessor. Authority establishes the rule, not implementation conformance.
5. **Analyst inference:** reasoned interpretation, hypothesis, or mapping. Useful for planning; never sufficient for a pass claim alone.

Every evidence item must preserve provenance: producer, timestamp, subject identity, version/digest, environment, scope, method/tool version, inputs, result, limitations, and reviewer/authority where applicable. Redact secrets while retaining enough identity to reproduce the claim.

## Verdict semantics

| Verdict | Meaning | Required behavior |
|---|---|---|
| `PASS` | Declared acceptance criteria are met by complete, applicable evidence | Name criteria, evidence IDs, authority, and residual limitations. |
| `FAIL` | Evidence demonstrates a violated criterion or unacceptable risk | Record the failed criterion, observed impact, and owner for remediation. |
| `BLOCKED` | Work cannot proceed because a required dependency, authority, environment, or input is unavailable | Do not infer success; record the unblock condition. |
| `NOT-RUN` | The check was intentionally not executed | State why and whether the omission is acceptable for the profile. |
| `AUDIT-INCOMPLETE` | Some evidence was collected, but coverage, independence, or traceability is insufficient for a complete audit | Preserve partial findings and list exact missing evidence. |

## No claim without evidence

- No claim of implementation, execution, conformance, security, safety, compatibility, or production readiness without a supporting evidence reference.
- “No finding” is not “absence”; state the search boundary and coverage.
- Static analysis does not prove runtime behavior; a test result does not prove all paths; a standard citation does not prove conformance.
- Unknown, unverified, stale, truncated, contradictory, or analyst-inferred observations remain qualified in the final artifact.
- A reviewer may reject a `PASS` when evidence is not independently reproducible, is outside the declared scope, or lacks provenance.
