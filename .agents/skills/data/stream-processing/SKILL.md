---
name: stream-processing
category: data
maturity: stable
version: 1
description: Stream processing (Flink, Kafka Streams, RisingWave, windowing, state, exactly-once).
capabilities:
  - design stream processing topologies (Flink, Kafka Streams, RisingWave)
  - define windowing strategies (tumbling, sliding, session, global)
  - manage state ( RocksDB, in-memory, tiered storage)
  - implement exactly-once semantics and fault tolerance
outputs:
  - Stream topology diagram
  - Windowing and state design
  - Exactly-once semantics plan
sideEffects: []
dependencies: []
stopCondition: Topology diagram saved; windowing strategy defined; exactly-once plan documented.
risk: medium
trustTier: 3
maxIterations: 6
---

## Contract

- **Input:** stream sources, processing logic, state requirements, delivery guarantees.
- **Output:** stream topology + windowing design + exactly-once plan.
- **Side effects:** may consume from and produce to streams when executed.
- **Dependencies:** streaming platform (Kafka, Pulsar, Kinesis), state store.
- **Stop condition:** topology saved; windowing defined; exactly-once plan documented.
- **Risk:** medium — state corruption or duplicate processing risks; requires testing.
- **Boundary:** designs stream jobs; execution requires approval.

# Stream Processing

Design **stream processing** — Flink, Kafka Streams, RisingWave, windowing, state management, and exactly-once semantics.

## Process

### 1. Source and sink analysis
- Sources: Kafka topics, Kinesis streams, Pulsar, IoT hubs.
- Sinks: databases, data lakes, object stores, downstream streams.
- Schema: Avro, Protobuf, JSON, Parquet; schema registry usage.

**Completion criterion:** source/sink inventory saved.

### 2. Processing topology
- Stateless: filter, map, flatMap, enrich.
- Stateful: aggregations, joins, pattern detection.
- Branching: fan-out, side outputs, branching streams.

**Completion criterion:** topology diagram saved (ASCII / Mermaid).

### 3. Windowing strategies
- Tumbling: fixed-size, non-overlapping windows.
- Sliding: overlapping windows with slide interval.
- Session: activity-based windows with gap timeout.
- Global: all-data window for bounded streams.

**Completion criterion:** windowing strategy saved with justification.

### 4. State management
- Keyed state: value state, list state, map state, reduction state.
- State backend: RocksDB (disk), in-memory (fast, limited), tiered.
- State TTL: retention, cleanup, recovery.
- Checkpointing: synchronous vs asynchronous, barrier alignment.

**Completion criterion:** state design saved.

### 5. Exactly-once semantics
- Checkpointing: barrier-based, consistent snapshots.
- Two-phase commit: for sinks that support it (Kafka, transactional DBs).
- Idempotent writes: deduplication keys, upserts.
- Recovery: restore from checkpoint, replay from offsets.

**Completion criterion:** exactly-once plan saved.

### 6. Fault tolerance and scaling
- Parallelism: source, operator, sink parallelism.
- Scaling: rescaling with savepoints, state migration.
- Backpressure handling: buffering, flow control, monitoring.

**Completion criterion:** fault tolerance plan saved.

## Rules

- Rule: choose the processing framework against throughput, state size, and operational complexity.
- Rule: define windowing, state TTL, and checkpointing before scaling.
- Rule: separate stateless processing from stateful processing so scaling is explicit.
- Rule: require idempotent sinks or deduplication for sensitive downstream systems.
- Rule: monitor backpressure, checkpoint lag, and state size as primary operational signals.
