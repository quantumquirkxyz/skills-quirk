---
name: "workflow-fixture-author"
category: "skill-dev"
maturity: "stable"
version: "1"
description: "Author deterministic scenario and behavioral fixtures for skills so routing, contracts, outputs, side effects, and refusal boundaries can be tested before promotion."
license: "MIT"
capabilities:
  - apply workflow fixture author methods within explicit skill-dev boundaries
  - analyze author deterministic scenario and behavioral fixtures for skills so routing, contracts, outputs, side effects, and refusal boundaries can be tested before promotion with assumptions, constraints, and failure modes
  - produce and validate a skill-dev artifact with evidence, decisions, and next steps
outputs: "fixture artifact containing the scoped result, supporting evidence, validation status, and residual risks required by this skill's contract."
sideEffects: []
dependencies: []
stopCondition: "Fixtures cover the requested skill behavior and either pass the relevant validator or list exact follow-up fixes."
risk: "low"
trustTier: "2"
maxIterations: "6"
promptVersion: "2.0"
artifactType: "skill-dev-fixture"
modelTier: "fast"
evaluators: ["behavioral", "regression"]
fixturesPath: tests/skill-output-migration-routing-skill-dev.test.mjs
diataxis: "how-to"
tags: ["skill-dev"]
compatibility: []
approvalRequired: false
approvalFor: []
---

## Vocabulary

- **quirk Skills**: The canonical skills authored in `.agents/skills/` as `<domain>/<skill>/SKILL.md` directories; they are the only source of truth for skill content.
- **quirk Method**: The bundle's method applied to work in this repo: artifact-first design, state-machine workflows, and shift-left quality gates.
- **canonical skill**: A skill that lives in `.agents/skills/` and is tracked by `skills-lock.json`; compatibility-view symlinks under `.claude/skills/` are generated and must not be hand-edited.
- **provenance**: The evidence chain linking an artifact to its source inputs, decisions, and validation status, recorded per skill so downstream consumers can verify what changed and why.

## Contract

### Input schema

| Field | Type | Required | Description |
|---|---|---|---|
| targetSkill | string | yes | Canonical skill name or path under `.agents/skills/` whose behavior the fixtures will exercise. |
| coverageRequirements | string[] | no | Explicit coverage areas to target (routing, contracts, outputs, side effects, refusal boundaries, etc.). |
| existingFixtureDir | string | no | Directory path of existing neighboring fixtures to mirror for naming, schema, and assertion style. |
| validatorName | string | no | Name of the validator to run against the new fixtures (e.g. `skill-testing-framework`, `skill-quality-gate`). |

### Output schema

| Field | Type | Required | Description |
|---|---|---|---|
| fixtureFiles | string[] | yes | Paths to scenario/behavioral fixture files added or updated under `evals/behavioral/`. |
| coverageReport | object | yes | Mapping of contract areas to coverage status (covered / gap / skipped). |
| validationResult | object | yes | Validator name, pass/fail status, failure details, and any follow-up fixes. |
| artifact | object | yes | Emitted `WorkflowFixtureAuthorArtifact` JSON at `.agents/skills/platform/artifacts/workflow-fixture-author/{identifier}.json`. |

### Explicit rules about fixture behavior testing

- Fixtures must test observable behavior, not the private chain of reasoning used to reach it.
- Assertions must be deterministic; avoid expectations that depend on current dates, external network state, or model style unless explicitly controlled.
- Every behavioral fixture must forbid placeholders and require exact sections or fields that matter.
- Include at least one normal path and one boundary or refusal path for any skill that performs mutations or external coordination.
- Preserve existing fixture formats and naming conventions.
- When a fixture encodes a side effect, assert both the allowed operation and the condition that makes it safe.

## Provenance

| Question | Answer |
|---|---|
| What is the source of truth? | The target skill's `SKILL.md`, its declared contract, outputs, side effects, and stop condition, plus `skills-lock.json` hash records |
| What is in scope? | Fixture coverage for the target skill's routing, contracts, outputs, side effects, and refusal boundaries; validation against the nearest available validator |
| What is explicitly out of scope? | Files, behaviors, and decisions outside the target skill's declared boundary; hand-editing generated compatibility-view symlinks under `.claude/skills/` |
| Who or what consumes this artifact afterward? | `skill-testing-framework`, `skill-quality-gate`, `evaluate-skill`, `skill-sandbox`, `lockfile-maintenance`, and downstream promotion workflows |
| What evidence proves it is done? | Per-step completion criteria met, fixture files saved at `fixturesPath`, coverage report recorded, validation result documented, `WorkflowFixtureAuthorArtifact` emitted |
| What risk remains? | Incomplete fixture coverage leaves routing, side-effect, or refusal boundaries unverified; validator unavailability means coverage claims rest on static inspection alone; hand-edited lockfile mismatches fail the semantic audit |

### Evidence requirements for fixture coverage

- Each coverage area claimed as "covered" must cite at least one fixture file with deterministic assertions.
- Each coverage area claimed as "gap" must name the missing contract area and list recommended follow-up fixtures.
- Each skipped validation must record the reason and the nearest validator that would apply.
- Incomplete coverage is a blocking risk for promotion: `skill-quality-gate` will reject skills whose declared behaviors lack fixture evidence.

## Artifact

Emit `WorkflowFixtureAuthorArtifact` as both:
- JSON: `.agents/skills/platform/artifacts/workflow-fixture-author/{identifier}.json`
- Markdown view: same filename with `.md` extension

## Guardrails

- Deterministic assertions only: no assertions that depend on current dates, wall-clock time, or non-deterministic ordering unless explicitly seeded and controlled.
- No network dependencies: fixtures must not require live external services, DNS, HTTP endpoints, or remote model calls; mock or stub at the boundary instead.
- No model-style dependencies: do not assert on specific model output phrasing, token counts, or stylistic preferences; assert on structural and behavioral contract fields only.
- Observable behavior testing: assert on what the skill produces (fixture files, coverage report, validation result, emitted artifact), not on the internal reasoning chain.
- Preserve existing formats: do not rename, re-schema, or reorder fields in existing fixture files; match neighboring fixture naming and assertion style.
- Side-effect safety: any fixture encoding a side effect must assert both the allowed operation and the precondition that makes it safe.
- Lockfile integrity: adding or modifying a skill SKILL.md requires re-locking the corresponding `skills-lock.json` hash before the semantic audit can pass.

## Rules

- Rule: read the target skill contract before writing fixtures so expected behavior matches declared inputs, outputs, side effects, and stop condition.
- Rule: include at least one normal path and one boundary or refusal path for any skill that performs mutations or external coordination.
- Rule: make assertions deterministic; avoid expectations that depend on current dates, external network state, or model style unless they are explicitly controlled.
- Rule: fixtures should test observable behavior, not the private chain of reasoning used to reach it.
- Rule: preserve existing fixture formats and naming conventions.
- Rule: when a fixture encodes a side effect, assert both the allowed operation and the condition that makes it safe.
- Rule: run or identify the nearest validator after adding fixtures and report failures without diluting the test.
- Rule: start scenario fixtures from `references/scenario-fixture-template.json` unless an existing neighboring fixture is more specific.
- Rule: start behavioral fixtures from `references/behavioral-fixture-template.md` and replace every placeholder before validation.

## Workflow

### Step 1: Inspect the target skill and nearby existing fixtures
Read the target skill's `SKILL.md` frontmatter, contract, rules, provenance, steps, references, and completion sections. List existing fixtures in the same skill directory and under `evals/behavioral/` to infer naming, schema, and assertion style. Check `skills-lock.json` for the target skill's hash entry.

**Completion criteria**: Target skill contract is documented; existing fixture naming/schema/assertion style is identified; lockfile hash entry location is noted.

### Step 2: Derive fixture coverage from the skill's contract
Map each declared input, output, side effect, stop condition, and rule to a coverage area. Classify each as normal path, boundary path, or refusal path. Identify which areas already have fixture coverage and which are gaps.

**Completion criteria**: Coverage matrix covers every contract area; each area is labeled covered/gap/skipped with justification.

### Step 3: Draft scenarios
Draft scenario fixtures for happy path, ambiguous input, unsafe mutation, and completion evidence as appropriate. Start from `references/scenario-fixture-template.json` unless a neighboring fixture is more specific. Each scenario must include route, phrase, side-effect, and reference checks where relevant.

**Completion criteria**: Scenario files exist for each coverage area; no placeholders remain; each scenario has deterministic assertions.

### Step 4: Draft behavioral expectations
Draft behavioral fixtures forbidding placeholders and requiring exact sections or fields that matter. Start from `references/behavioral-fixture-template.md`. Specify the exact behavior the skill must exhibit for each scenario.

**Completion criteria**: Behavioral fixtures replace every placeholder; exact required sections/fields are enumerated; expectations are observable, not reasoning-based.

### Step 5: Add or update fixture files
Write scenario and behavioral fixture files to the correct location under `evals/behavioral/` (default `fixturesPath`). Match existing naming conventions. Do not hand-edit `.claude/skills/` compatibility-view symlinks.

**Completion criteria**: Fixture files are saved at the declared `fixturesPath`; naming matches neighbors; compatibility views are left untouched.

### Step 6: Run the relevant fixture validator
Run `skill-testing-framework` against the new fixtures, or `skill-quality-gate` if a broader gate applies. Use `skill-sandbox` if local execution is unsafe. If no validator can run locally, explain why and identify the nearest validator for CI.

**Completion criteria**: Validator result is recorded (pass/fail with details); or an explicit reason is documented for why validation could not run locally.

### Step 7: Summarize coverage added, validation result, and remaining gaps
Produce a summary of which contract areas gained coverage, which remain gaps, the validation outcome, and any follow-up fixes. Emit the `WorkflowFixtureAuthorArtifact` JSON and Markdown view.

**Completion criteria**: Summary lists added coverage, validation result, remaining gaps, and follow-up fixes; artifact is emitted in both JSON and Markdown.

## References

- `references/scenario-fixture-template.json` - scenario fixture skeleton for route, phrase, side-effect, and reference checks.
- `references/behavioral-fixture-template.md` - behavioral fixture skeleton for required sections and forbidden placeholder checks.
- `skill-testing-framework` - validates skill structure, contracts, dependencies, anti-patterns, and isolated execution before promotion.
- `skill-quality-gate` - runs the skill bundle quality gate across schema, lockfile, semantic, routing, placeholder, rule, metadata, and side-effect checks.
- `evaluate-skill` - evaluates a skill against fixed scenarios for routing, completion, and artifact validity.
- `skill-sandbox` - creates, tests, and iterates on experimental skills in an isolated environment without affecting the canonical skills bundle.
- `lockfile-maintenance` - maintains `skills-lock.json` by detecting missing, stale, extra, or mismatched skill entries and updating hashes.

## Examples

### Example: Fixture authoring for a routing skill

Target skill: `capability-router` (routes work to the best matching Skill using declared capabilities and compatibility).

**Step 1 - Inspect**: Read `capability-router/SKILL.md`. Declared inputs: task description, available skills, compatibility constraints. Declared outputs: selected skill, confidence, rationale. Existing fixtures under `evals/behavioral/capability-router/` include `routing-happy-path.json` and `routing-no-match.json`.

**Step 2 - Derive coverage**: Coverage areas: exact capability match (normal), partial capability match (boundary), no compatible skill (refusal), ambiguous skill names (boundary). Gaps: ambiguous skill names has no fixture.

**Step 3 - Draft scenarios**: Create `evals/behavioral/capability-router/routing-ambiguous-skill.json` with route checks for two similarly named skills, phrase checks for overlapping keywords, side-effect checks (no mutation), and reference checks to `capability-router` contract.

**Step 4 - Draft behavioral expectations**: Create `evals/behavioral/capability-router/routing-ambiguous-skill.md` requiring exact fields `selectedSkill`, `confidence`, `rationale`; forbid placeholders like `TODO` or `<fill-in>`; require `confidence` to be a number between 0 and 1.

**Step 5 - Add files**: Write both fixture files to `evals/behavioral/capability-router/`. Match existing snake_case naming. Do not touch `.claude/skills/` symlinks.

**Step 6 - Run validator**: Run `skill-testing-framework` against `capability-router`. Result: pass for happy path and no-match; fail for ambiguous-skill until `confidence` threshold rule is clarified. Record failure detail.

**Step 7 - Summarize**: Coverage added: ambiguous-skill scenario. Validation: 2 pass, 1 fail (follow-up: clarify confidence threshold). Emit `WorkflowFixtureAuthorArtifact` at `.agents/skills/platform/artifacts/workflow-fixture-author/capability-router-ambiguous.json`.

## Completion

- Step 1 complete: target skill contract documented; existing fixture naming/schema/assertion style identified; lockfile hash entry noted.
- Step 2 complete: coverage matrix covers every contract area; each area labeled covered/gap/skipped with justification.
- Step 3 complete: scenario files exist for each coverage area; no placeholders remain; deterministic assertions present.
- Step 4 complete: behavioral fixtures replace every placeholder; exact required sections/fields enumerated; expectations are observable.
- Step 5 complete: fixture files saved at declared `fixturesPath`; naming matches neighbors; compatibility views untouched.
- Step 6 complete: validator result recorded (pass/fail with details); or explicit reason documented for why validation could not run locally.
- Step 7 complete: summary lists added coverage, validation result, remaining gaps, and follow-up fixes; artifact emitted in JSON and Markdown.
- The skill's completion criteria are explicitly checked.
- The artifact is saved and validated.
- Any blockers or skipped validations are documented.
- The next consumer is identified or the work is handed off.
---
@include .agents/skills/platform/contract-base.xml
