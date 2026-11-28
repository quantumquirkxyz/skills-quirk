---
description: "Analyze a repository or requested code scope for logical correctness, behavior, architecture, risks, and maintainability, returning evidence-backed findings without editing source files."
---
# code-review

When to use: Analyze a repository or requested code scope for logical correctness, behavior, architecture, risks, and maintainability, returning evidence-backed findings without editing source files.

## Workflow

1. Read `CONTEXT.md`, repository `AGENTS.md`, ADRs, package manifests, and project entrypoints
2. Translate the user's request into an explicit objective and scope
3. Build a repository map: applications, libraries, services, data flows, external boundaries, tests, scripts, and configuration
4. Trace relevant behavior end to end. For a full audit, prioritize public entrypoints, critical paths, failure paths, persistence, integrations, and startup/build paths
5. Compare behavior with the objective, specifications, documented conventions, and observable contracts
6. Inspect tests and identify uncovered behavior, weak assertions, and regression risks
7. Report findings with severity, kind, exact location, evidence, impact, cause when supported, and recommendation
8. State inspected areas, uninspected areas, assumptions, and limitations

## Deliverables

- repository-audit artifact

## Guardrails

- risk: medium; trust tier: 3; approval required: yes
- side effects: post-pr-comment
- isolation: worktree; model tier: reasoning

Stop when: Repository or scoped audit complete; evidence-backed structured result returned; limitations and completion criteria checked.
