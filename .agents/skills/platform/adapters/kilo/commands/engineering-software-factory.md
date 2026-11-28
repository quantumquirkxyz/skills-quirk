---
description: "Engineer the system that builds code — foreman agent, separate validator, different-model critic, observability views, MCP wiring, context window management, convergence tuning."
---
# software-factory

When to use: Engineer the system that builds code — foreman agent, separate validator, different-model critic, observability views, MCP wiring, context window management, convergence tuning.

## Workflow

1. Design the foreman role: name the factory, choose model tier, set max concurrency, batch size, and split policy
2. Configure the validator: define validatorRole, quality threshold, and pass criteria
3. Select the critic model: choose a different model tier than the factory workers
4. Wire MCP connections: list serverId, transport, and capabilities for each MCP server the factory needs
5. Define observability views: list viewId, metric, and sink for each observability target
6. Set convergence rules: list ruleId, trigger, and action for each convergence rule
7. Emit the FactoryDesign artifact as JSON and Markdown

## Deliverables

- factory-design artifact

## Guardrails

- risk: medium; trust tier: 3; approval required: yes
- side effects: write-files
- isolation: worktree; model tier: reasoning

Stop when: Software factory design complete with foreman, validator, critic, MCP wiring, observability, and convergence rules
