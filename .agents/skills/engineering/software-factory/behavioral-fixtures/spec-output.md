# Software Factory Specification

## Metadata
- Identifier: factory-design
- Owner: platform engineering
- Model tier: reasoning

## Problem Statement
Code-writing agents lack a controlled handoff, independent validation, and visibility into convergence.

## Goals
- Put a foreman between the human and worker agents.
- Separate validation from code generation.
- Expose batch quality and context pressure.

## Non-goals
- Execute agents or deploy infrastructure.
- Generate production code.

## Functional Requirements
- Define foreman batching and split policy.
- Configure a validator with threshold and pass criteria.
- Select a critic model different from worker models.
- Declare MCP connections, observability views, and convergence actions.

## Acceptance Criteria
- FactoryDesign includes foreman, validator, critic, MCP, observability, and convergence fields.
- Every convergence rule uses act, check, escalate, or handBack.
- Runtime execution is explicitly excluded.

## Risks and Open Questions
- Critic quality may vary by model tier.
- MCP capability coverage needs confirmation before implementation.
