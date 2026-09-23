---
name: {{NAME}}
category: {{CATEGORY}}
maturity: {{MATURITY}}
version: {{VERSION}}
description: {{DESCRIPTION}}
capabilities:

outputs:

sideEffects: []
dependencies: []
stopCondition: {{STOP_CONDITION}}
risk: {{RISK}}
trustTier: {{TRUST_TIER}}
maxIterations: {{MAX_ITERATIONS}}
---

## Operating Contract

- **Input:** {{INPUT_DESCRIPTION}}
- **Output:** {{OUTPUT_DESCRIPTION}}
- **Side effects:** follow the frontmatter declaration; do not broaden scope without explicit user direction.
- **Dependencies:** declared dependencies, referenced skills, and source materials required by the task.
- **Stop condition:** {{STOP_CONDITION_DETAILS}} is complete, evidence is captured, and completion criteria are checked.
- **Risk:** use the frontmatter risk classification and call out any escalation.
- **Boundary:** stay within the skill's declared scope, trust tier, and side-effect policy.

# {{NAME}}

{{LONG_DESCRIPTION}}

## Contract

- Input: {{INPUT_DETAILS}}
- Output: {{OUTPUT_DETAILS}}
- Scope: {{SCOPE}}
- Rule: Las skills generadas deben ser compatibles con el método quirk
- Rule: Las skills deben seguir el principio de divulgación progresiva
- Rule: Las skills deben tener contratos explícitos y claros

## Structured Skill Creation Process

This skill guides you through creating a skill using fill-in-the-blank worksheets that ensure you address all critical aspects of skill design.

### Phase 1: Skill Conception Worksheet

Complete this worksheet to explore and validate your skill concept.

#### Worksheet 1.1: Core Concept Definition
```
Skill Name (proposed): ________________________________
One-sentence description: ________________________________________________________
________________________________________________________

What specific problem does this solve? ___________________________________________
________________________________________________________

Is this a new capability or improvement to existing? [ ] New  [ ] Improvement
If improvement, which existing skill(s) does it relate to? ________________________
________________________________________________________
```

#### Worksheet 1.2: Use Case Validation
```
List 3 concrete use cases where this skill would be valuable:
1. _________________________________________________________
2. _________________________________________________________
3. _________________________________________________________

Who are the primary users/agent types that would benefit?
_________________________________________________________

What would happen if this skill didn't exist? (Describe the workaround complexity)
_________________________________________________________
_________________________________________________________

How do you know this addresses a repeatedly useful behavior?
_________________________________________________________
```

#### Worksheet 1.3: Capability Definition
```
List the specific capabilities this skill will provide (use - capability-name format):
- _________________________________________________
- _________________________________________________
- _________________________________________________

For each capability, specify:
Capability: ________________________
  Inputs required: ________________________________________
  Outputs produced: _______________________________________

Capability: ________________________
  Inputs required: ________________________________________
  Outputs produced: _______________________________________
```

### Phase 2: Skill Design Worksheets

#### Worksheet 2.1: Skill Contract Design
```
Description (following quirk skill-style-guide):
_________________________________________________________
_________________________________________________________
_________________________________________________________

Explicit Inputs (what the skill consumes):

Explicit Outputs (what the skill produces):
- ________________________________________
- ________________________________________
- ________________________________________

Dependencies (minimal and intentional):
  - referencias-externas (why: referencias-externas dependency)
Side Effects (honest repository modifications):
  - actualización-de-referencias
Stop Condition (clear, checkable completion criteria):
_________________________________________________________
_________________________________________________________

Risk Level (honest assessment): [ ] low  [ ] medium  [ ] high
Justification: ___________________________________________
```

#### Worksheet 2.2: Skill Body Structure Plan
```
Approach: [ ] step-based  [ ] reference-based  [ ] hybrid

What goes in SKILL.md (essential procedural instructions):
_________________________________________________________
_________________________________________________________

What goes in references/ (detailed reference material):
_________________________________________________________
_________________________________________________________

How does this skill integrate with work-item system (if relevant):
_________________________________________________________
_________________________________________________________
```

#### Worksheet 2.3: Evaluatability Design Plan
```
How will this skill be tested with evaluate-skill system?

Scenario Fixtures needed (describe expected routes):
_________________________________________________________
_________________________________________________________

Behavioral Fixtures needed (expected output formats):
_________________________________________________________
_________________________________________________________
```

### Phase 3: Skill Generation and Validation

#### Worksheet 3.1: Skill Generation
```
Follow these steps to generate your skill:
1. Create directory: .skill-sandbox/<your-skill-name>/
2. Create SKILL.md with proper YAML frontmatter from Worksheet 2.1
3. Create references/ directory and add any needed templates
4. Set up basic scripts/ and assets/ directories if needed
5. Add helpful TODO comments guiding completion

Use the templates in this skill's references/ as starting points.
```

#### Worksheet 3.2: Validation Integration
```
Create validation artifacts for your skill:

Scenario Fixtures (in .skill-sandbox/<skill-name>/scenarios/):
- [ ] Basic functionality test scenario
- [ ] Edge case scenario  
- [ ] Error condition scenario

Behavioral Fixtures (in .skill-sandbox/<skill-name>/behavioral-fixtures/):
- [ ] Expected output format for primary artifact
- [ ] Expected output format for secondary artifact (if applicable)

Run validation:
- node .skill-sandbox/validations/validate-sandbox-skills.mjs
- node .agents/skills/platform/evaluate-scenarios.mjs (when scenarios ready)
- node .agents/skills/platform/evaluate-behavioral-fixtures.mjs (when fixtures ready)
```

## Skill Template Structure

When generating a new skill using the worksheets, this structure is produced:

```
.skill-sandbox/<skill-name>/
├── SKILL.md
├── references/
│   ├── [artifact-templates-as-needed]
│   └── [example-outputs-as-needed]
├── scripts/
│   └── [helper-scripts-as-needed]
└── assets/
    └── [output-assets-as-needed]
```

## Worksheet Templates and Examples

This skill provides templates and examples to help you fill out the worksheets effectively.

### Example: Completed Worksheet 1.1 (for a hypothetical "{{EXAMPLE_SKILL_NAME}}" skill)
```
Skill Name (proposed): {{EXAMPLE_SKILL_NAME}}
One-sentence description: {{EXAMPLE_ONE_SENTENCE_DESC}}

What specific problem does this solve? {{EXAMPLE_PROBLEM_SOLVED}}

Is this a new capability or improvement to existing? [x] New  [ ] Improvement
If improvement, which existing skill(s) does it relate to? N/A
```

### Example: Completed Worksheet 2.1 (for the same skill)
```
Description (following quirk skill-style-guide):
{{EXAMPLE_DESCRIPTION}}

Explicit Inputs (what the skill consumes):
- {{EXAMPLE_INPUT_1}}
- {{EXAMPLE_INPUT_2}}
- {{EXAMPLE_INPUT_3}}

Explicit Outputs (what the skill produces):
- {{EXAMPLE_OUTPUT_1}}
- {{EXAMPLE_OUTPUT_2}}
- {{EXAMPLE_OUTPUT_3}}
- {{EXAMPLE_OUTPUT_4}}

Dependencies (minimal and intentional):
- {{EXAMPLE_DEPENDENCY_1}} (why: {{EXAMPLE_DEPENDENCY_1_WHY}})
- {{EXAMPLE_DEPENDENCY_2}} (why: {{EXAMPLE_DEPENDENCY_2_WHY}})

Side Effects (honest repository modifications):
- {{EXAMPLE_SIDE_EFFECT}}

Stop Condition (clear, checkable completion criteria):
{{EXAMPLE_STOP_CONDITION}}

Risk Level (honest assessment): [x] low  [ ] medium  [ ] high
Justification: {{EXAMPLE_JUSTIFICATION}}
```

## Integration with Evaluation System

All skills created with this creator should be designed to work with the evaluate-skill system:

### Scenario Fixtures
- Create JSON scenario files that define expected routes through skills for common {{EXAMPLE_USE_CASE_LOWER}} tasks
- Include static assertions for validating that the skill produces correct {{EXAMPLE_OUTPUT_TYPE}}
- Follow the format used in evaluate-skill/scenarios/

### Behavioral Fixtures
- Create markdown files defining expected output formats for {{EXAMPLE_OUTPUT_TYPE}}
- Include required sections (recommendation, rationale, change analysis) and forbid placeholder text
- Follow the format used in evaluate-skill/behavioral-fixtures/

## Completion Criteria

The user has completed this skill when:

- They have filled out all worksheets with specific, actionable information
- They have generated a complete skill template in the sandbox from their completed worksheets
- They have validated the skill concept using sandbox validation tools
- They have outlined how the skill integrates with the evaluation system
- They have a clear plan for iterating on the skill based on validation feedback

## Guardrails

- Always validate skill concepts against existing skills to prevent duplication
- Design skills to be minimal and focused - prefer creating multiple small skills over one large one
- Ensure skills can be tested in isolation using the sandbox environment
- Follow the quirk method principles rigorously in skill design
- Consider how the skill fits into larger workflows before creating it
- Remember that predictability is the root virtue - design for consistent behavior
- Use the worksheets to ensure explicit, checkable decisions at each step