## Summary
Define a software factory design with a foreman, independent validator, critic, MCP wiring, observability, and convergence rules.

## Why
Worker agents need controlled routing and an independent quality bar instead of reviewing their own output.

## Impact
Adds a reviewable FactoryDesign artifact and makes escalation visible without executing agents.

## Validation
Checked required roles, different critic model, declared MCP capabilities, observability metrics, and typed convergence actions.

## Review Focus
Confirm validator independence, critic separation, and that the scope excludes runtime execution.

## Development
Design-only change; no production code or infrastructure was run.
