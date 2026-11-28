# Software Engineering Artifact Contracts

Phase 1 contracts use JSON Schema Draft 2020-12 under `schemas/software-engineering/`.

## Compatibility

- `schemaVersion` is currently `1.0`; consumers must reject unsupported major versions and may accept later minor versions only when their required fields remain compatible.
- Every artifact carries the same envelope identity and lineage fields: schema version, artifact type, artifact and operation IDs, trace ID, source artifacts and digests, fixed point, producer/owner routing, evidence, approvals, blockers, risks, and lifecycle timestamps.
- `status` is a closed vocabulary: `draft`, `in-progress`, `ready`, `approved`, `rejected`, `blocked`, `completed`, `superseded`, or `expired`. Producers must not emit unknown values.
- Artifact payloads are intentionally composable objects. Consumers should validate the envelope and preserve unknown payload members for forward compatibility.
- `artifactType` is a per-file constant. The twelve workflow artifact schemas describe payload-bearing artifacts; `gate-result`, `provenance-record`, and `workflow-status` provide shared control-plane records.
- `expiresAt` may be null when an artifact has no expiry. Timestamps use RFC 3339 date-time strings.
- JSON Schema validation is structural only. Evidence authority, digest correctness, approval semantics, and workflow ordering remain responsibilities of the consuming workflow.
