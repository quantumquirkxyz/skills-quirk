---
name: prompt-template-library
category: ai
maturity: stable
version: 1
description: Prompt template library (versioned templates, A/B testing, composition, evaluation)
capabilities:
  - manage versioned templates with promotion and rollback
  - design A/B tests for templates with acceptance criteria
  - compose templates with partials, conditionals, and loops
  - evaluate templates with acceptance, property, and regression checks
  - define fallback and escalation for template failures
outputs:
  - Template manifest (version, spec, promotion, rollback)
  - A/B experiment spec (hypothesis, variants, success criteria, duration)
  - Composition library (partials, conditionals, loops)
  - Evaluation suite (acceptance, property, regression, report)
  - Fallback and escalation discipline (code, circuit breaker, pager)
sideEffects: []
dependencies: []
stopCondition: Templates green on acceptance suite with evaluation and fallback.
risk: low
trustTier: 1
maxIterations: 6
---

## Contract

- **Input:** task description, template spec, acceptance criteria, edge cases.
- **Output:** template manifest + A/B spec + composition library + evaluation suite + fallback discipline.
- **Side effects:** may call LLM APIs during validation.
- **Dependencies:** LLM with JSON or function calling support.
- **Stop condition:** templates green on acceptance suite with evaluation and fallback.
- **Risk:** low — design and validation only; no production traffic.
- **Boundary:** designs and validates templates; does not deploy to production.

# Prompt Template Library

Manage, compose, test, and evaluate prompt templates with discipline.

## Process

### 1. Template manifest
Version: semver or git sha; spec: intent, inputs, outputs, format, acceptance.
Promotion: staged to production after acceptance green.
Rollback: prior tagged version with reproduction and reconciliation.

**Completion criterion:** template manifest with version, spec, promotion, rollback.

### 2. A/B experiment
Hypothesis: template variant improves acceptance metric.
Traffic split: staged ramp; success criteria; duration; sample size.
Guardrail: latency, cost, error rate must stay within budgets.

**Completion criterion:** experiment spec with hypothesis, variants, success criteria, duration.

### 3. Composition library
Partials: reusable prompt, system, instruction, example.
Conditionals: if, elif, else, switch, inline, macro.
Loops: for, foreach, while, map, filter, reduce.
Composition: partials, conditionals, loops with validation.

**Completion criterion:** composition library with partials, conditionals, loops, validation.

### 4. Evaluation suite
Acceptance: human check, machine check, acceptance metric.
Property: multiple examples with template and edge cases.
Regression: prior version with acceptance and edge checks.
Report: metrics, failure mode, edge case, recommendation.

**Completion criterion:** evaluation suite with acceptance, property, regression, report.

### 5. Fallback and escalation
Parse failure: retry with repair, fallback to simpler model, circuit breaker, pager.
Fallback: simpler output, human, template, or rule.
Retry: exponential backoff, retry budget, circuit breaker, pager.

**Completion criterion:** fallback and escalation discipline with retry, fallback, circuit breaker, pager.

## Rules

- No template accepted without acceptance suite green.
- No composition accepted without property checks green.
- No A/B lift accepted without guardrail metrics green.
- No fallback accepted without escalation path tested.
