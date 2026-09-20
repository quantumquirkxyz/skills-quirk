---
name: docs-adrs
category: skill-dev/sandbox
maturity: experimental
version: 1
description: Create and maintain Architecture Decision Records — context, decision, consequences, alternatives, status — with periodic review.
capabilities:
  - apply docs adrs workflow
  - produce docs adrs analysis artifact
  - validate docs adrs completion criteria
outputs:
  - Docs Adrs artifact with completed sections, evidence, and limitations
sideEffects: []
dependencies: []
stopCondition: Create and maintain Architecture Decision Records complete; required sections present; completion criteria checked.
risk: low
trustTier: 1
maxIterations: 6
---

## Operating Contract

- **Input:** Docs Adrs request, problem context, constraints, and available evidence.
- **Output:** Docs Adrs artifact with completed analysis, decisions, recommendations, and limitations.
- **Side effects:** follow the frontmatter declaration; do not change systems unless explicitly authorized.
- **Dependencies:** declared dependencies, source material, and domain references required by the task.
- **Stop condition:** Create and maintain Architecture Decision Records is complete, required sections are present, and completion criteria are checked.
- **Risk:** use the frontmatter risk classification and call out any escalation.
- **Boundary:** stay within the skill's declared scope and side-effect policy.

# ADR Creation

Create an **Architecture Decision Record** (context, decision, consequences, alternatives, status) with an explicit review cycle.

## When to use
- A significant architecture choice is made.
- The team needs a durable explanation of design.
- A decision needs to be revisited over time.

## Process
1. Title, number, date.
2. Status — proposed / accepted / deprecated / superseded.
3. Context — driving forces, constraints, alternatives considered briefly.
4. Decision — positive statement of what was chosen.
5. Consequences — positive, negative, neutral; risks and trade-offs.
6. Alternatives — listed with brief evaluation.
7. Links — related ADRs, PRs, docs.
8. Review — set a review date; document why it might be superseded.
9. Deliver — Markdown artifact in docs/adr/ directory with the full template.

## Rules

- Rule: record one decision per ADR.
- Rule: write the decision as an active choice, not a vague preference.
- Rule: include rejected alternatives and the reason each lost.
- Rule: mark status and supersession links when a decision changes.
- Rule: keep consequences honest across benefits, costs, risks, and operational impact.

## Completion Criteria

- context, decision, alternatives, and consequences are present
- status and date are explicit
- links to related artifacts are included when available
- review or supersession conditions are named
