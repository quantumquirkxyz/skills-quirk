# ADR-001: Artifact-First Design for quirk Skills

## Status
Accepted

## Context
The quirk Skills bundle produces many intermediate artifacts (specs, tickets, review findings, ADRs, handoffs). Historically these were emitted as free-form Markdown with no enforced schema, making them hard to validate, version, or consume downstream.

## Decision
Adopt artifact-first design: every skill emits a typed JSON artifact conforming to a JSON Schema, plus a Markdown view for human readability. The JSON is the source of truth; Markdown is a projection.

## Consequences

### Positive
- Artefactos validables contra esquema antes de pasar al siguiente skill
- Trazabilidad: cada artefacto responde a las 6 preguntas del quality bar
- Versionado posible: el JSON tiene `schemaVersion`, `artifactType`, `createdAt`, `updatedAt`
- Consumible downstream: el siguiente skill lee el JSON, no parsea Markdown

### Negative
- Overhead de mantenimiento: cada artefacto necesita schema + fixture
- Curva de aprendizaje: contributors deben aprender el formato JSON
- Token cost: emitir JSON + Markdown consume más tokens que Markdown solo

## Alternatives Considered

### A: Keep Markdown-only
No implementar schemas. Pros: simplicidad. Cons: no validable, no trazable, no consumible programáticamente.

### B: YAML-based artifacts
Usar YAML en vez de JSON. Pros: más legible. Cons: parseo más frágil, menos soporte de tooling.

### C: Protobuf/Thrift
Schema binary. Pros: eficiencia. Cons: overkill para artifacts de texto, fricción de edición.

## Review
Revisar en 3 meses o cuando se superen 50 skills migradas a v2.

## Related
- ADR-002: State Machine Workflows
- ADR-003: Shift-Left Quality Gates
