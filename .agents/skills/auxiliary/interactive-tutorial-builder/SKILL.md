---
name: "interactive-tutorial-builder"
category: "auxiliary"
maturity: "stable"
description: "Generate a focused tutorial with goals, exercise inputs, expected outputs, and checkpoints for any Skill; use when teaching or onboarding someone to a Skill."
license: "MIT"
version: "1"
capabilities:
  - apply interactive tutorial builder methods within explicit auxiliary boundaries
  - analyze generate a focused tutorial with goals, exercise inputs, expected outputs, and checkpoints for any skill; use when teaching or onboarding someone to a skill with assumptions, constraints, and failure modes
  - produce and validate a auxiliary artifact with evidence, decisions, and next steps
inputs:
  type: object
  properties:
    skillName:
      type: string
      description: "The name of the quirk Skill to teach."
    learnerContext:
      type: object
      properties:
        role:
          type: string
          description: "The learner's role (e.g. agent, maintainer, contributor)."
        experienceLevel:
          type: string
          enum: ["novice", "competent", "expert"]
          description: "Assumed prior familiarity with quirk Skills and the quirk Method."
        priorSkills:
          type: array
          items:
            type: string
          description: "Skills the learner has already completed."
        goal:
          type: string
          description: "What the learner wants to achieve with this Skill."
  required: ["skillName", "learnerContext"]
outputs:
  - type: object
    name: InteractiveTutorialBuilderArtifact
    properties:
      result:
        type: object
        description: "Learning goals, exercise scenario/input/expected output, checkpoint, and response space derived from the target Skill contract"
      required: [result]
dependencies: []
sideEffects: []
stopCondition: "The learner has a runnable exercise and a checkable checkpoint derived from the target Skill contract."
risk: "low"
trustTier: "2"
promptVersion: "2.0"
artifactType: "auxiliary"
modelTier: "fast"
evaluators: ["behavioral", "regression"]
fixturesPath: tests/skill-output-migration-auxiliary-cms-compilers-cs-db.test.mjs
diataxis: "how-to"
tags: ["auxiliary"]
compatibility: []
approvalRequired: false
approvalFor: []
maxIterations: "6"
---

## Contract

**Input schema** (`inputs`):
- `skillName` (string): The name of the quirk Skill to teach. Must match a canonical skill in `.agents/skills/` or `.kilo/skills/`.
- `learnerContext` (object): Context about who is learning and why.
  - `role` (string): The learner's role (e.g. agent, maintainer, contributor).
  - `experienceLevel` (enum: novice | competent | expert): Assumed prior familiarity with quirk Skills and the quirk Method.
  - `priorSkills` (string[]): Skills the learner has already completed.
  - `goal` (string): What the learner wants to achieve with this Skill.

**Output schema** (`outputs`):
- `learningGoals` (string[]): Measurable goals derived from the target Skill contract, not from its name alone.
- `exercise` (object):
  - `scenario` (string): Concrete scenario the learner will work through.
  - `input` (object): The exercise input the learner must supply.
  - `expectedOutput` (object): The expected output shape the learner's output is checked against.
- `checkpoint` (object):
  - `name` (string): Name of the checkpoint.
  - `criteria` (string[]): Checkable conditions that determine success.
  - `verification` (string): How the learner verifies the checkpoint.
- `responseSpace` (object):
  - `promptTemplate` (string): Prompt template the learner uses to run the exercise.
  - `constraints` (string[]): Constraints the learner must respect.

**Rules about instructional scaffolding:**
- Rule: derive learning goals from the target Skill's actual contract, not from its name alone.
- Rule: keep the exercise small enough to complete in one sitting.
- Rule: include expected output shape and at least one checkable checkpoint.
- Rule: preserve the target Skill's boundaries and side-effect policy.
- Rule: the learner remains responsible for executing the Skill; the tutorial only provides scaffolding.
- Rule: documented standards override defaults; explicit project rules take precedence.
- Rule: if blocked by missing context or dependencies, surface the blocker before proceeding.

## Provenance

| Question | Answer |
|---|---|
| What is the source of truth? | The user's request, originating spec/issue, and the skill's declared outputs |
| What is in scope? | Work covered by the skill's acceptance criteria and completion rules |
| What is explicitly out of scope? | Files, behaviors, and decisions outside the skill's declared boundary |
| Who or what consumes this artifact afterward? | The next skill in the workflow or the user |
| What evidence proves it is done? | Completion criteria met, artifact saved, validation passed |
| What risk remains? | Subjective judgment calls, missing context, or external dependency failures |

**Evidence requirements:**
- The target Skill contract must be read before generating any tutorial content; every learning goal must cite the specific contract rule it derives from.
- The generated tutorial artifact (JSON and Markdown view) must be saved under `.agents/skills/platform/artifacts/interactive-tutorial-builder/{identifier}.json` (and `.md`).
- Validation must pass against the skill's own completion criteria before the tutorial is handed to the learner.
- Any skipped validation or blocker must be documented in the artifact.

**Risk assessment — tutorial accuracy:**
- If the target Skill contract is stale or incorrect, the tutorial will teach incorrect behavior; always verify the contract against the canonical skill file.
- If the learner's context is inaccurate, the exercise may be too easy or too hard; default to `novice` when experience level is unknown.
- Tutorials must not drift into teaching a neighboring skill; each step must verify the exercise still teaches the target Skill.

## Artifact

Emit `InteractiveTutorialBuilderArtifact` as both:
- JSON: `.agents/skills/platform/artifacts/interactive-tutorial-builder/{identifier}.json`
- Markdown view: same filename with `.md` extension

## Guardrails

- **Learner responsibility**: The tutorial provides instructional scaffolding only; the learner remains responsible for executing the Skill and accepting its outcomes.
- **Exercise size**: Keep the exercise small enough to complete in one sitting; if it cannot, split it into multiple tutorials.
- **Expected output shape**: Every exercise must declare an explicit expected output shape and at least one checkable checkpoint.
- **Skill boundary preservation**: Preserve the target Skill's boundaries and side-effect policy; do not teach behavior outside the Skill's declared contract.

# Interactive Tutorial Builder


## Steps

### 1. Read the target Skill contract and identify the learner's context.

**Guidance**: Open the canonical SKILL.md for `skillName` (in `.agents/skills/` or `.kilo/skills/`). Extract its input schema, output schema, rules, steps, and completion criteria. Map `learnerContext` against those requirements: if `experienceLevel` is `novice`, simplify terminology and add definitions; if `competent` or `expert`, reference AGENTS.md vocabulary such as "quirk Skills", "quirk Method", "canonical skill", and "provenance" directly.

**Completion criteria**:
- The target Skill's SKILL.md has been read and its contract (inputs, outputs, rules, steps, completion) is recorded.
- `learnerContext` is normalized: `role`, `experienceLevel`, `priorSkills`, and `goal` are all populated (defaults applied where missing).
- A traceable mapping exists from each planned learning goal to a specific rule or section of the target Skill contract.

### 2. Generate the tutorial scaffold.

**Guidance**: Build the initial tutorial structure from the contract: one learning goal per contract rule, one exercise scenario per goal, and one checkpoint per exercise. Use `skill-tutor` conventions for worksheet-style instruction and `skill-creator` conventions for artifact shape. Do not execute the Skill; only generate scaffolding.

**Completion criteria**:
- `learningGoals` is non-empty and each goal cites the contract rule it derives from.
- `exercise.scenario`, `exercise.input`, and `exercise.expectedOutput` are populated for every goal.
- `checkpoint` includes `name`, `criteria`, and `verification`.
- `responseSpace.promptTemplate` and `responseSpace.constraints` are defined.

### 3. Adapt the scenario, exercise input, and checkpoint to the learner.

**Guidance**: Tailor the generated scaffold to `learnerContext`. For a `novice`, add worked examples and simpler inputs; for an `expert`, use the canonical skill's real-world parameters. Ensure the scenario is achievable in one sitting and stays within the target Skill's boundary — it must not require a neighboring skill to complete.

**Completion criteria**:
- The scenario matches the learner's `experienceLevel` and `goal`.
- The exercise input is concrete and executable by the learner alone.
- The checkpoint criteria are checkable without external context beyond what the learner has.
- The exercise does not require capabilities outside the target Skill's declared boundary.

### 4. Add evidence requirements and common failure hints.

**Guidance**: Document what evidence proves the learner completed the exercise (artifact saved, validation passed, checkpoint met). List common failure modes from the target Skill's risk section and how to avoid them. This becomes the `Provenance` and risk section of the tutorial artifact.

**Completion criteria**:
- Evidence requirements are listed: what must be saved, validated, and shown.
- Common failure hints are included, drawn from the target Skill's `risk` and `stopCondition`.
- Any blocker or skipped validation is documented explicitly.

### 5. Verify that the exercise still teaches the target Skill rather than a neighboring skill.

**Guidance**: Cross-check the completed tutorial against the target Skill contract one final time. Confirm the exercise maps to the Skill's own contract, not to `skill-creator`, `skill-sandbox`, `skill-quality-gate`, or `subagent-swarm` unless those are explicitly the target. Confirm `approvalRequired` and `fixturesPath` are consistent with the target Skill's declarations.

**Completion criteria**:
- Every learning goal traces back to the target Skill contract.
- No step requires a neighboring skill unless the target Skill itself declares that dependency.
- The tutorial artifact is saved as JSON and Markdown view under the artifacts directory.
- Validation against completion criteria passes.

## Completion

- Step 1 complete: target Skill contract read; learner context normalized; goal-to-contract mapping recorded.
- Step 2 complete: tutorial scaffold generated with learning goals, exercise, checkpoint, and response space.
- Step 3 complete: scenario, input, and checkpoint adapted to the learner's context and experience level.
- Step 4 complete: evidence requirements and common failure hints documented.
- Step 5 complete: verified the exercise teaches the target Skill, not a neighboring skill; artifact saved and validated.
- The artifact is saved and validated against the skill's own completion criteria.
- Any blockers or skipped validations are documented.
- The next consumer is identified or the work is handed off.

## References

- `skill-tutor`: Interactive tutorial that guides users through creating their first quirk skill using structured worksheets and hands-on exercises.
- `skill-creator`: Guide for creating effective skills that extend Kilo's capabilities with specialized knowledge, workflows, or tool integrations.
- `skill-sandbox`: Create, test, and iterate on experimental skills in an isolated environment without affecting the canonical skills bundle.
- `skill-quality-gate`: Run and interpret the skill bundle quality gate across schema, lockfile, semantic, routing, placeholder, rule, metadata, and side-effect checks before promotion or publication.
- `subagent-swarm`: Coordinate multiple agent sub-roles (architect, implementer, reviewer, tester) in parallel or sequential swarm mode, with clear handoff contracts and evidence recording.

## Examples

**Teaching the `capability-router` Skill:**

- `skillName`: `capability-router`
- `learnerContext`: `{ role: "agent", experienceLevel: "novice", priorSkills: [], goal: "route work to the best matching Skill using declared capabilities" }`
- `learningGoals`:
  1. "Read a target Skill's declared capabilities and compatibility boundaries."
  2. "Select the best matching Skill for a given task using explicit selection rules."
  3. "Document the selection rationale as provenance for the handoff."
- `exercise`:
  - `scenario`: "A user asks to 'analyze my repository for security issues' but has not specified which domain. Route this to the correct Skill."
  - `input`: `{ task: "analyze my repository for security issues", availableSkills: ["sec-security-audit", "sec-threat-modeling", "code-review"] }`
  - `expectedOutput`: `{ selectedSkill: "sec-security-audit", rationale: string, compatibility: "exact" }`
- `checkpoint`:
  - `name`: "Capability selection verified"
  - `criteria`: ["selectedSkill matches one of availableSkills", "rationale cites declared capabilities", "compatibility is one of exact/partial/none"]
  - `verification`: "Run the exercise input through the capability-router Skill and compare its output to expectedOutput."
- `responseSpace`:
  - `promptTemplate`: "Using the capability-router Skill, select the best match for: {{task}} among {{availableSkills}}. Return selectedSkill, rationale, and compatibility."
  - `constraints`: ["Do not invent skills not in availableSkills", "Do not teach sec-security-audit; only route to it"]

@include .agents/skills/platform/contract-base.xml
