---
name: "software-factory"
category: "engineering"
maturity: "experimental"
version: "1"
description: "Engineer the system that builds code — foreman agent, separate validator, different-model critic, observability views, MCP wiring, context window management, convergence tuning."
license: "MIT"
capabilities:
  - design a software factory where a foreman agent orchestrates code-writing agents between a human and the factory
  - separate validator agent from the code-writer so the machine never reviews its own output
  - select a different-model critic to independently assess factory behavior against a quality bar
  - wire MCP connections and observability views with context window management
  - tune convergence rules and decide when an agent acts, checks, escalates, or hands back
inputs:
  - factoryConfig: {type: object, required: true, description: "Factory configuration with factory name, model tier, and max concurrency"}
  - foremanSpec: {type: object, required: true, description: "Foreman agent specification with role, batch size, and split policy"}
  - validatorConfig: {type: object, required: true, description: "Validator agent configuration with role, quality threshold, and pass criteria"}
  - mcpConnections: {type: array, required: true, description: "MCP server connections with server id, transport, and capabilities"}
  - observabilityTargets: {type: array, required: true, description: "Observability targets with view id, metric, and sink"}
outputs:
  - type: object
    name: FactoryDesign
    properties:
      FactoryDesign:
        type: object
        required: [foremanRole, validatorRole, criticModel, mcpConnections, observabilityViews, convergenceRules]
        properties:
          foremanRole:
            type: string
          validatorRole:
            type: string
          criticModel:
            type: string
          mcpConnections:
            type: array
            items:
              type: object
              properties:
                serverId:
                  type: string
                transport:
                  type: string
                capabilities:
                  type: array
                  items:
                    type: string
          observabilityViews:
            type: array
            items:
              type: object
              properties:
                viewId:
                  type: string
                metric:
                  type: string
                sink:
                  type: string
          convergenceRules:
            type: array
            items:
              type: object
              properties:
                ruleId:
                  type: string
                trigger:
                  type: string
                action:
                  type: string
                  enum: [act, check, escalate, handBack]
sideEffects: ["write-files"]
dependencies:
  - agent-native-engineering
  - mcp-server
  - agent-observability
stopCondition: "Software factory design complete with foreman, validator, critic, MCP wiring, observability, and convergence rules"
risk: "medium"
trustTier: "3"
maxIterations: 5
promptVersion: "2.0"
artifactType: "factory-design"
modelTier: "reasoning"
evaluators: ["behavioral", "regression", "quality-bar"]
fixturesPath: "evals/behavioral/software-factory.json"
diataxis: "how-to"
tags: ["engineering", "software-factory", "agent-factory", "foreman", "validator", "critic", "mcp", "observability"]
compatibility: ["engineering/agent-native-engineering", "engineering/verification-engineering", "foundation/mcp-server"]
approvalRequired: true
approvalFor: ["write-files"]
---

# Software Factory

## Why

Why software factories matter: stop writing code and start engineering the factory that writes code. A software factory is the system that builds software — the foreman agent between the human and the factory, the separate validator that never reviews its own output, the different-model critic that independently judges behavior, the MCP wiring that connects tools, the observability views that show what the factory is doing, and the convergence rules that decide when to stop.

The quirk Method treats agent-native engineering as a discipline: engineer the system, not the artifact. The foreman splits work into batches, routes to code-writing agents, and hands finished work to the validator. The validator checks against pass criteria. The critic, running a different model tier, re-evaluates so the same model does not grade itself. Observability surfaces batch pass rates, context window pressure, and MCP call latency so a human can see convergence or divergence. When a run stops converging, simplify the factory rather than adding agents.

This is how quirk Skills are meant to be used: canonical skill design with explicit provenance, declared inputs and outputs, and a stop condition.

## Contract

- Input: factory config, foreman spec, validator config, MCP connections, observability targets (typed object schema)
- Output: FactoryDesign with foremanRole, validatorRole, criticModel, mcpConnections, observabilityViews, convergenceRules
- Scope: design only; emit a FactoryDesign artifact as JSON and Markdown. No runtime agent execution.
- Rule: The foreman agent sits between the human and the factory; code-writing agents never talk directly to the human.
- Rule: The validator is separate from the code-writer; the machine never reviews its own output.
- Rule: The critic runs a different model than the factory workers.
- Rule: MCP connections and observability views are declared, not improvised.
- Rule: Convergence rules decide act / check / escalate / handBack; simplify when a run stops converging.
- Rule: Documented standards override defaults; explicit project rules take precedence.

## Rules

- Foreman agent between human and factory: the foreman owns the batch loop, splits work by the declared split policy, and routes finished work to the validator; humans speak to the foreman, not to code-writing agents.
- Separate validator from code-writer: the validator checks output against pass criteria and a quality threshold; it never generates code and never reviews its own output.
- Different-model critic: the critic runs on a different model tier than the factory workers and independently assesses factory behavior against the quality bar.
- Observability views: declare viewId, metric, and sink for each view; surface batch pass rates, context window usage, MCP latency, and convergence state.
- MCP wiring: declare serverId, transport, and capabilities for each connection; keep wiring explicit and reviewable.
- Context window management: track token usage per batch, split when approaching limits, and simplify context before converging.
- Convergence tuning: each convergence rule declares a trigger and an action (act, check, escalate, handBack); stop when rules converge or simplify the factory when they do not.

## Implementation rationale

The foreman sits between the human and the factory, owns the batch loop, and routes finished work to the validator. The validator checks pass criteria without generating or reviewing its own output, while a different-model critic independently assesses the quality bar. Observability records batch pass rates, context usage, MCP latency, and convergence state. Each convergence rule records a trigger and one of the actions act, check, escalate, or handBack; non-converging runs are simplified.

## Provenance

| Question | Answer |
|---|---|
| What is the source of truth? | The user's request, the originating spec/issue, and the skill's declared outputs |
| What is in scope? | Work covered by the skill's acceptance criteria and completion rules |
| What is explicitly out of scope? | Runtime agent execution, code generation, deployment, and infrastructure provisioning |
| Who or what consumes this artifact afterward? | The next quirk Skill in the workflow (e.g., engineering/agent-native-engineering, foundation/mcp-server, foundation/observability) or the user |
| What evidence proves it is done? | Completion criteria met, FactoryDesign artifact saved and validated |
| What risk remains? | Subjective judgment calls on critic model selection, missing MCP server capabilities, context window mis-estimation |

## Artifact

Emit `FactoryDesign` as both:
- JSON: `.agents/skills/platform/artifacts/software-factory/{identifier}.json`
- Markdown view: same filename with `.md` extension

The artifact must contain the full typed output object and include provenance (source, inputs consumed, evaluator results).

## Load-Bearing Rules

- The foreman owns routing between human, writers, and validator; writers never self-approve.
- The validator is independent and never generates or reviews its own output.
- The critic uses a different model tier and remains read-only.
- MCP wiring, observability, context budgets, and convergence actions are explicit and reviewable.

## P0/P1 Factory Controls

### Capability matrix and authority

| Role/tool | Authority | Boundary | Evidence |
|---|---|---|---|
| Foreman | Plan, lease, route, stop | Cannot implement, validate, or self-approve | signed plan, source digests |
| Writer | Declared files/tools and task | Cannot review, publish, or widen paths | typed handoff, artifact digest |
| Validator | Independent checks and replay | Cannot repair or approve its own verdict | verdict, replay IDs |
| Critic | Different model, read-only challenge | Cannot mutate factory state | independent findings |
| Human | Named approval/escalation | No implicit or transitive approval | scoped approval with expiry |

MCP capabilities are least-privilege and non-transitive. Approval propagation binds to operation, paths, origin, quota, lease, and expiry. Source digests identify exact inputs; they do not authorize execution.

### Runtime safety and states

Declare quotas for concurrency, tokens, cost, wall time, calls, bytes, retries, and context pressure. Leases include holder, scope, heartbeat, expiry, and idempotency key. Canonical states are `planned`, `leased`, `running`, `awaiting-approval`, `validating`, `criticizing`, `succeeded`, `failed`, `blocked`, `cancelled`, `crashed`, `resumable`, and `expired`. A kill switch revokes leases and prevents new effects. Crash/resume starts at the last committed checkpoint and reports outcome-unknown for uncertain writes.

Observability stores redacted bounded records with retention/deletion deadlines, trace IDs, source digests, approvals, and state transitions. Replay tests cover duplicate work, timeout, crash before/after commit, lease expiry, auth/origin/path failures, redaction, and kill switch. No convergence claim is valid without independent validator and critic evidence.

## Implementation notes

The workflow applies the foreman, independent validator, different-model critic, explicit observability and MCP wiring, context tracking, and convergence actions described above.

## Workflow

1. Design the foreman role: name the factory, choose model tier, set max concurrency, batch size, and split policy.
2. Configure the validator: define validatorRole, quality threshold, and pass criteria.
3. Select the critic model: choose a different model tier than the factory workers.
4. Wire MCP connections: list serverId, transport, and capabilities for each MCP server the factory needs.
5. Define observability views: list viewId, metric, and sink for each observability target.
6. Set convergence rules: list ruleId, trigger, and action for each convergence rule.
7. Emit the FactoryDesign artifact as JSON and Markdown.

## Guardrails

- Keep the code-writing machine away from reviewing it: the validator and critic are separate from the code-writer and run different models.
- Decide when an agent acts, checks, escalates, or hands back: convergence rules declare the action; humans own escalation and handBack.
- Simplify when a run stops converging: reduce batch size, tighten pass criteria, or switch the critic model before adding more agents.
- No runtime execution: this skill produces a design artifact; it does not start agents, call MCP servers, or write production code.

## Completion criteria

- Foreman role designed with factoryName, modelTier, maxConcurrency, batchSize, and splitPolicy
- Validator configured with validatorRole, qualityThreshold, and passCriteria
- Critic model selected, different from factory worker model
- MCP connections wired with serverId, transport, and capabilities
- Observability views defined with viewId, metric, and sink
- Convergence rules set with ruleId, trigger, and action
- FactoryDesign artifact saved as JSON and Markdown
- Blockers or skipped validations documented

---
@include .agents/skills/platform/contract-base.xml
