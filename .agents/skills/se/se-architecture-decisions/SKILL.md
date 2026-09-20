---
name: se-architecture-decisions
category: skill-dev/sandbox
maturity: experimental
version: 1
description: Record and evaluate architecture decisions (ADR format) — context, decision, consequences, trade-offs — with a review step.
capabilities:
  - apply se architecture decisions workflow
  - produce se architecture decisions analysis artifact
  - validate se architecture decisions completion criteria
outputs:
  - Se Architecture Decisions artifact with completed sections, evidence, and limitations
sideEffects: []
dependencies: []
stopCondition: Record and evaluate architecture decisions (ADR format) complete; required sections present; completion criteria checked.
risk: low
trustTier: 1
maxIterations: 6
---

## Operating Contract

- **Input:** Se Architecture Decisions request, problem context, constraints, and available evidence.
- **Output:** Se Architecture Decisions artifact with completed analysis, decisions, recommendations, and limitations.
- **Side effects:** follow the frontmatter declaration; do not change systems unless explicitly authorized.
- **Dependencies:** declared dependencies, source material, and domain references required by the task.
- **Stop condition:** Record and evaluate architecture decisions (ADR format) is complete, required sections are present, and completion criteria are checked.
- **Risk:** use the frontmatter risk classification and call out any escalation.
- **Boundary:** stay within the skill's declared scope and side-effect policy.

# Architecture Decisions

Document and evaluate a **software architecture decision** using the ADR format — context, decision, consequences — with an explicit trade-off review.

## When to use

- The user needs to record or review a major architecture choice.
- A decision has long-lasting impact (language, framework, database model, deployment model).
- A team needs a durable explanation of why a system is shaped a certain way.

## Process

1. Title — short, unique identifier.
2. Status — proposed / accepted / deprecated / superseded.
3. Context — what problem, constraints, and forces led to this decision? Use leading words.
4. Decision — what we decided, with the decision stated as positive (not negative) behaviour.
5. Consequences — positive, negative, and neutral. Explicit trade-offs.
6. Alternatives considered — with brief evaluation of each.
7. Review — adversarial pass: what assumption could turn wrong? What is the rollback / change path if the decision is superseded?
8. Deliver — artifact: ADR document with all sections present; no vague language.

## Rules

- Rule: record one architecture decision per ADR.
- Rule: state the decision positively and concretely.
- Rule: list alternatives and explain why they were rejected.
- Rule: include consequences across operability, cost, performance, security, and maintainability when relevant.
- Rule: define a review trigger or supersession condition for decisions likely to age.
