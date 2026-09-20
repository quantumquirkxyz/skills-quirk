---
name: networking-protocols
category: networking
maturity: stable
version: 1
description: Analyze network protocols — packet formats, handshakes, congestion control, routing, and transport behavior — with explicit timing and failure assumptions.
capabilities:
  - analyze protocol behavior
  - reason about handshakes and packet flow
  - diagnose timing and failure modes
outputs:
  - protocol analysis with message flow, assumptions, timing, and failure cases
sideEffects: []
dependencies: []
stopCondition: Protocol state, message flow, and failure assumptions are explicit.
risk: low
trustTier: 1
maxIterations: 6
---

# networking-protocols

Use this skill when analyzing packet formats, handshakes, transport behavior, routing interactions, congestion control, or protocol-level failure scenarios.

## Contract

- Input: protocol, actors, message sequence, network assumptions, captures/logs if available, and observed behavior.
- Output: protocol explanation, state machine or flow, timing assumptions, and likely failure modes.
- Scope: protocol mechanics and network behavior; infrastructure design belongs to the networking skill.
- Boundary: distinguish what the protocol guarantees from what an implementation happens to do.

## Rules

- Rule: identify actors, state, and message direction before explaining behavior.
- Rule: separate transport, session, application, and routing concerns.
- Rule: call out retransmission, timeout, ordering, fragmentation, and congestion effects when relevant.
- Rule: use packet captures or logs as evidence, not as a substitute for a protocol model.
- Rule: state security assumptions such as authentication, encryption, and downgrade resistance.

## Steps

1. Define endpoints, intermediaries, protocol layer, and expected state transitions.
2. Trace the normal message flow and handshake.
3. Identify timing, retry, congestion, and ordering behavior.
4. Compare observed packets or logs against expected flow.
5. Analyze failure cases: loss, reordering, MTU, DNS, routing, TLS, and connection resets.
6. Summarize root cause candidates or design implications.

## Completion Criteria

- message flow and state transitions are clear
- timing and retry assumptions are documented
- observed evidence is tied to protocol behavior
- failure modes and security assumptions are explicit
