---
name: "skill-promoter"
category: "skill-dev"
maturity: "stable"
version: "1"
description: "Promote validated experimental skills from the sandbox to the canonical skills bundle."
capabilities: ""
outputs: ""
sideEffects:
  - write-files
  - create-symlink
  - update-lockfile

dependencies: []
stopCondition: "Promote validated experimental skills from the sandbox to the canonical skills bundle complete; artifact saved; completion criteria checked."
risk: "medium"
trustTier: "3"
maxIterations: "6"
promptVersion: "2.0"
artifactType: "pull-request"
modelTier: "reasoning"
evaluators: ["behavioral", "regression"]
fixturesPath: ""
diataxis: "how-to"
tags: ["skill-dev"]
compatibility: []
approvalRequired: "true"
approvalFor: ["write-files", "create-symlink", "update-lockfile"]
---

## Contract

- Input: skill name, validation report, and promotion criteria
- Output: promoted skill in canonical bundle, updated symlinks, updated lockfile, and promotion report
- Scope: stay within the skill's declared boundaries; do not broaden without explicit direction.
- Rule: documented standards override defaults; explicit project rules take precedence.
- Rule: promotion is blocked while any validator warning is open; warnings block promotion only, never the general gate.
- Rule: if blocked by missing context or dependencies, surface the blocker before proceeding.

## Provenance

| Question | Answer |
|---|---|
| What is the source of truth? | The user's request, originating spec/issue, and the skill's declared outputs |
| What is in scope? | Work covered by the skill's acceptance criteria and completion rules |
| What is explicitly out of scope? | Files, behaviors, and decisions outside the skill's declared boundary |
| Who or what consumes this artifact afterward? | The next skill in the workflow or the user |
| What evidence proves it is done? | Completion criteria met, artifact saved, validation passed |
| What risk remains? | Subjective judgment calls, missing context, or external dependency failures


## Artifact

Emit `SkillPromoterArtifact` as both:
- JSON: `.agents/skills/platform/artifacts/skill-promoter/{identifier}.json`
- Markdown view: same filename with `.md` extension


# 
# 
# Skill Promoter

Use this skill to promote validated experimental skills from the sandbox to the canonical skills bundle.


## Process

### 1. Validate Sandbox Skill

Before promotion, ensure the skill is ready:
- Run validation scripts on the sandbox skill
- Check for any warnings or errors in the validation report
- Verify that the skill follows the skill-style-guide
- Confirm that the skill has clear boundaries and distinct capabilities
- Ensure the skill includes proper documentation and examples

### 2. Warning Gate (Blocking)

Promotion fails when open warnings exist:
- Run `node .agents/skills/platform/validate-skills.mjs` and read the `warnings` array from its JSON output.
- If `warnings` is non-empty, promotion is BLOCKED: do not create the canonical skill directory, do not create the `.claude/skills/<skill-name>` symlink, and do not update `skills-lock.json`.
- A blocked promotion stops with status `blocked-warnings`, lists every open warning (skill name plus warning text) in the SkillPromoterArtifact, and hands the list back for repair.
- Promotion resumes only after every warning is resolved and `validate-skills.mjs` re-runs with an empty `warnings` array, or after an explicit human sign-off per warning is recorded in the artifact.
- Errors (validators exiting non-zero) block promotion as before; warnings alone never fail `check-all.mjs`, but they always fail promotion.

### 3. Prepare for Promotion

Get the skill ready for the canonical bundle:
- Create the skill directory in .agents/skills/
- Copy the SKILL.md and any associated files (references/, scripts/)
- Ensure the skill follows the exact structure expected by canonical skills
- Verify that dependencies are correctly declared and resolvable in the main bundle

### 4. Update Canonical Bundle

Move the skill to its permanent location:
- Copy the skill directory to .agents/skills/<skill-name>/
- Create the symlink in .claude/skills/<skill-name> pointing to ../../.agents/skills/<skill-name>
- Update skills-lock.json with the skill's information and hash
- Run the full validation suite (check-all.mjs) to ensure nothing is broken

### 5. Record Provenance

Document the skill's journey:
- Add an entry to docs/agents/provenance.md documenting the promotion
- Include the skill name, promotion date, and rationale
- Note any influences from the sandbox experimentation phase
- Update the skills-map.md if the skill represents a new category

### 6. Verify Promotion

Confirm the promotion was successful:
- Run check-all.mjs to ensure the bundle is still valid
- Verify that the skill can be invoked and functions correctly
- Check that the .claude/skills/ symlink works properly
- Confirm that the skill appears in the skills registry

## Completion

- the skill's completion criteria are explicitly checked
- the artifact is saved and validated
- any blockers or skipped validations are documented
- the next consumer is identified or the work is handed off
---
@include .agents/skills/platform/contract-base.xml