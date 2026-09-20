---
name: grilling
category: routing
maturity: stable
version: 1
description: Grill the user relentlessly about a plan, decision, or idea. Use when the user wants to stress-test their thinking, or use docs to sharpen the premise before acting.
capabilities:
  - apply grilling workflow
  - produce grilling artifact
  - validate grilling completion criteria
outputs:
  - Grilling artifact with findings, decisions, recommendations, and validation notes
sideEffects: []
dependencies: []
stopCondition: Grill the user relentlessly about a plan, decision, or idea complete; artifact saved; completion criteria checked.
risk: low
trustTier: 1
maxIterations: 6
---

## Operating Contract

- **Input:** Grilling request, relevant context, constraints, and source evidence.
- **Output:** Grilling artifact with findings, decisions, recommendations, and validation notes.
- **Side effects:** follow the frontmatter declaration; do not broaden scope without explicit user direction.
- **Dependencies:** declared dependencies, referenced skills, and source materials required by the task.
- **Stop condition:** Grill the user relentlessly about a plan, decision, or idea is complete, evidence is captured, and completion criteria are checked.
- **Risk:** use the frontmatter risk classification and call out any escalation.
- **Boundary:** stay within the skill's declared scope, trust tier, and side-effect policy.

Interview me relentlessly about every aspect of this until we reach a shared understanding. Walk down each branch of the decision tree, resolving dependencies between decisions one-by-one. For each question, provide your recommended answer.

Ask the questions one at a time, waiting for feedback on each question before continuing. Asking multiple questions at once is bewildering.

If a *fact* can be found by exploring the environment (filesystem, tools, etc.), look it up rather than asking me. The *decisions*, though, are mine — put each one to me and wait for my answer.

Do not act on it until I confirm we have reached a shared understanding.

## Rules

- Rule: ask exactly one main question at a time.
- Rule: provide a recommended answer with each question so the user has a concrete foil.
- Rule: investigate discoverable facts directly before asking the user.
- Rule: keep decisions with the user, even when facts are discoverable.
- Rule: stop grilling when the plan is coherent enough to act or when a blocker requires outside input.

## Completion Criteria

- assumptions, dependencies, and trade-offs have been surfaced
- the user has confirmed the shared understanding
- next action is named but not executed unless the user asks for it
