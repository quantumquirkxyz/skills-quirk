---
name: ux-prototyping
category: ux
maturity: stable
version: 1
description: Prototype user experiences — wireframes, interactive mockups, and rapid validation — with explicit experiment goals and iteration criteria.
capabilities:
  - scope UX prototypes
  - choose fidelity and validation method
  - plan feedback loops and iteration criteria
outputs:
  - prototype plan with hypothesis, fidelity, tasks, feedback method, and success criteria
sideEffects: []
dependencies: []
stopCondition: Prototype goal, fidelity, validation method, and iteration criteria are explicit.
risk: low
trustTier: 1
maxIterations: 6
---

# ux-prototyping

Use this skill when planning or reviewing a UX prototype meant to answer a question about flow, usability, comprehension, layout, or interaction behavior.

## Contract

- Input: product question, target users, workflow, uncertainty, constraints, and available validation time.
- Output: prototype plan with fidelity, tasks, feedback method, success criteria, and iteration plan.
- Scope: prototype design and validation; production implementation belongs to frontend or delivery skills.
- Boundary: prototype only the uncertainty that matters; avoid making high-fidelity artifacts for low-fidelity questions.

## Rules

- Rule: state the hypothesis or design question before choosing tools or fidelity.
- Rule: choose fidelity based on what must be learned, not what looks impressive.
- Rule: define user tasks and success signals before collecting feedback.
- Rule: separate observed behavior from participant preference.
- Rule: decide in advance what evidence will cause iteration, abandonment, or implementation.

## Steps

1. Identify the decision the prototype must inform.
2. Define audience, scenario, core task, and risky assumptions.
3. Choose fidelity: sketch, wireframe, clickable mock, coded prototype, or service simulation.
4. Build the smallest artifact that can test the assumption.
5. Plan feedback collection, prompts, metrics, and note-taking.
6. Summarize findings and next iteration criteria.

## Completion Criteria

- prototype question and hypothesis are explicit
- fidelity matches the learning goal
- user tasks and success criteria are defined
- feedback and iteration plan is documented
