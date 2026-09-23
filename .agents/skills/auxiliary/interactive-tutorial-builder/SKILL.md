---
name: interactive-tutorial-builder
category: auxiliary
maturity: experimental
description: Generate a focused tutorial with goals, exercise inputs, expected outputs, and checkpoints for any Skill; use when teaching or onboarding someone to a Skill.
version: 1
capabilities:
  - generate-skill-tutorial
  - derive-learning-goals
  - create-tutorial-checkpoints
inputs:
  - skill-name
  - learner-context
outputs:
  - interactive-tutorial
  - exercise
  - checkpoint
dependencies:
  - skill-tutor
sideEffects: []
stopCondition: The learner has a runnable exercise and a checkable checkpoint derived from the target Skill contract.
risk: low
trustTier: 2
---

# Interactive Tutorial Builder

## Contract

- Input: a Skill name and learner context.
- Output: learning goals, exercise, expected outputs, checkpoint, and response space.
- Boundary: generate instructional scaffolding; the learner remains responsible for executing the Skill.

Run `node .agents/skills/platform/skill-lab.mjs tutorial <skill-name>`. Adapt the generated exercise to the learner's context, keep the target Skill's stop condition intact, and require evidence at the checkpoint.

## Rules

- Rule: derive learning goals from the target Skill's actual contract, not from its name alone.
- Rule: keep the exercise small enough to complete in one sitting.
- Rule: include expected output shape and at least one checkable checkpoint.
- Rule: preserve the target Skill's boundaries and side-effect policy.

## Steps

1. Read the target Skill contract and identify the learner's context.
2. Generate the tutorial scaffold with `skill-lab.mjs tutorial`.
3. Adapt the scenario, exercise input, and checkpoint to the learner.
4. Add evidence requirements and common failure hints.
5. Verify that the exercise still teaches the target Skill rather than a neighboring skill.

## Completion Criteria

- learning goals are explicit
- exercise inputs and expected outputs are concrete
- checkpoint evidence is checkable
