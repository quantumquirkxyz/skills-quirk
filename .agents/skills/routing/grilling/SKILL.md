---
name: grilling
category: routing
maturity: stable
version: 1
description: Grill the user relentlessly about a plan, decision, or idea. Use when the user wants to stress-test their thinking, or use docs to sharpen the premise before acting.
capabilities:
  - execute the core process defined in the skill body
  - produce a Markdown artifact or structured result
outputs:
  - Markdown artifact with process steps and completion criteria
sideEffects: []
dependencies: []
stopCondition: All process steps executed; artifact saved; criteria met.
risk: low
trustTier: 1
maxIterations: 6
---

## Contract

- **Input:** problem or task defined by the skill body.
- **Output:** Markdown artifact or structured result with completion criteria met.
- **Side effects:** none (design/review/documentation only unless explicitly stated).
- **Dependencies:** none (self-contained unless linked to other skills).
- **Stop condition:** all process steps completed; artifact saved; criteria checked.
- **Risk:** low.
- **Boundary:** produces reasoning or documentation artifacts; does not modify external systems unless explicitly instructed.


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
