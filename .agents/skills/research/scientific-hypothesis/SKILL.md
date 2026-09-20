---
name: scientific-hypothesis
category: skill-dev/sandbox
maturity: experimental
version: 1
description: Formulate testable scientific hypotheses — null/alternative, variables, controls, falsifiability — with explicit variables and statistical plan.
capabilities:
  - apply scientific hypothesis workflow
  - produce scientific hypothesis analysis artifact
  - validate scientific hypothesis completion criteria
outputs:
  - Scientific Hypothesis artifact with completed sections, evidence, and limitations
sideEffects: []
dependencies: []
stopCondition: Formulate testable scientific hypotheses complete; required sections present; completion criteria checked.
risk: low
trustTier: 1
maxIterations: 6
---

## Operating Contract

- **Input:** Scientific Hypothesis request, problem context, constraints, and available evidence.
- **Output:** Scientific Hypothesis artifact with completed analysis, decisions, recommendations, and limitations.
- **Side effects:** follow the frontmatter declaration; do not change systems unless explicitly authorized.
- **Dependencies:** declared dependencies, source material, and domain references required by the task.
- **Stop condition:** Formulate testable scientific hypotheses is complete, required sections are present, and completion criteria are checked.
- **Risk:** use the frontmatter risk classification and call out any escalation.
- **Boundary:** stay within the skill's declared scope and side-effect policy.

# Scientific Hypothesis Design

Formulate a **scientific hypothesis** that is testable, falsifiable, and tied to measurable variables with controls.

## When to use
- The user wants to design a study, experiment, or observation.
- A claim needs to become a testable prediction.
- A research proposal needs hypothesis formulation.

## Process
1. Problem — the phenomenon to explain.
2. Hypothesis — null (H₀) and alternative (H₁); clearly stated predictions.
3. Variables — independent, dependent, control, confounding; define each with measurement method.
4. Design — experiment vs observation; randomisation; controls; blinding; sample size (power analysis).
5. Statistics — test selection (t-test, ANOVA, chi-square, regression), significance level (α), effect size, confidence intervals.
6. Deliver — artifact with H₀/H₁, variables, design, statistical plan, and limitations.

## Rules

- Rule: make the hypothesis falsifiable with an observable prediction.
- Rule: define operational measurements for every variable.
- Rule: identify confounders and controls before choosing statistical tests.
- Rule: distinguish exploratory analysis from confirmatory hypothesis testing.
- Rule: include limitations, ethical constraints, and data-quality risks.

## Completion Criteria

- H0 and H1 are stated clearly
- variables and measurement methods are defined
- study design and statistical test are justified
- limitations and confounders are explicit
