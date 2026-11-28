# Execution schemas v1

These Draft 2020-12 schemas define the Phase 1A execution records. Every document uses `schemaVersion: "1.0"`; UUIDs, SHA-256 values and RFC 3339 timestamps follow the repository conventions.

- `execution-envelope.schema.json` is the aggregate execution record and references the other four records by relative schema URI.
- `execution-evidence-record.schema.json` preserves authority, provenance, result and limitations.
- `execution-side-effect-record.schema.json` records declared or observed effects without storing secrets.
- `execution-replay-record.schema.json` records replay mode, verdict and differences.
- `execution-scorecard.schema.json` records criterion-level verdicts and evidence references.

Schemas are structural; authority, digest correctness, approval semantics and replay ordering remain workflow responsibilities, as established by the evidence policy.
