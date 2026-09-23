---
name: agent-orchestration
category: skill-dev/sandbox
maturity: stable
version: 1
description: Design agent orchestration — multi-agent patterns, tool use, memory, handoffs, evaluation — with explicit coordination boundaries and observability.
capabilities:
  - design multi-agent patterns (supervisor, peer, pipeline, router)
  - specify tool use contracts and capabilities per agent
  - design memory architecture (short-term, long-term, shared, episodic)
  - define handoff contracts between agents and escalation paths
  - design evaluation framework for agent coordination quality
outputs:
  - Agent orchestration architecture diagram (text/Markdown)
  - Agent capability matrix and tool registry
  - Handoff contracts and escalation policy
  - Evaluation rubric and observability plan
sideEffects: []
dependencies: []
stopCondition: Architecture diagram saved; capability matrix complete; handoff contracts defined; evaluation rubric present.
risk: low
trustTier: 1
maxIterations: 6
---

## Contract

- **Input:** task description requiring multiple agents, available tools, quality requirements, latency constraints.
- **Output:** orchestration architecture + capability matrix + handoff contracts + evaluation rubric.
- **Side effects:** none — design artifact only.
- **Dependencies:** task context and constraints; references to `subagent-swarm` and `context-engine` for coordination patterns.
- **Stop condition:** architecture documented; agent roles defined; handoff contracts complete; evaluation rubric saved.
- **Risk:** low — design artifact; no infrastructure changes.
- **Boundary:** designs orchestration patterns; does not execute multi-agent workflows unless explicitly instructed.

# Agent Orchestration

Design a **multi-agent orchestration** system with clear coordination boundaries, tool use contracts, memory architecture, and observability.

## Process

### 1. Frame the orchestration problem
- Task decomposition: which parts of the workflow need separate agents?
- Agent count and types: supervisor, specialist workers, validator, synthesizer.
- Latency and throughput requirements: sequential vs parallel execution.
- Failure modes: agent timeout, tool failure, ambiguous output, hallucination.

**Completion criterion:** task decomposition documented; agent count and types defined; latency requirements stated.

### 2. Agent roles and tool use
- Role definition: name, responsibility, success criteria, failure handling.
- Tool allocation: which tools each agent can use; least-privilege principle.
- Tool contracts: input schema, output schema, retry policy, timeout, idempotency.
- Context scoping: what context each agent receives; minimisation to reduce noise and cost.

**Completion criterion:** capability matrix saved with roles, tools, and contracts.

### 3. Memory architecture
- Short-term memory: conversation history, scratchpad, working state within a single agent run.
- Long-term memory: knowledge graph, vector store, file system for cross-session persistence.
- Shared memory: state visible to multiple agents (board, queue, registry).
- Episodic memory: execution traces for debugging and improvement.
- Memory access policy: read/write permissions, retention, summarisation strategy.

**Completion criterion:** memory architecture documented with access policies.

### 4. Coordination patterns and handoffs
- Patterns: supervisor / worker, peer collaboration, pipeline / DAG, router / classifier.
- Handoff contracts: trigger conditions, payload schema, timeout, retry, fallback agent.
- Escalation paths: when to escalate to human or fallback agent; circuit breakers.
- Idempotency: how to handle duplicate or out-of-order messages.

**Completion criterion:** handoff contracts and escalation policy saved.

### 5. Evaluation and observability
- Coordination quality metrics: task completion rate, handoff success rate, agent latency distribution, tool call accuracy.
- End-to-end tracing: span per agent, per tool call, per handoff.
- Logging: structured logs with correlation IDs; redaction of sensitive data.
- Feedback loops: human-in-the-loop checkpoints, self-correction triggers, continuous improvement signals.

**Completion criterion:** evaluation rubric and observability plan saved.

## Rules

- Rule: define explicit handoff contracts with schema, timeout, and fallback; never assume implicit coordination.
- Rule: apply least-privilege tool access per agent; document capability matrix.
- Rule: include circuit breakers and escalation paths for agent failures and ambiguous outputs.
- Rule: instrument every agent run with tracing, structured logging, and quality metrics.
- Rule: document memory access policies (read/write permissions, retention, summarisation) for each memory tier.
