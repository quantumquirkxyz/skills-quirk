---
name: structured-output
category: ai
maturity: stable
version: 1
description: Structured output for LLMs (JSON mode, function calling, constrained decoding, validation)
capabilities:
  - design JSON mode prompts with schema, examples, and format instructions
  - implement function and tool calling with contracts and retry discipline
  - apply constrained decoding with grammars, regex, or stop tokens
  - validate structured output with schema, type, and business rule checks
  - define fallback, retry, and escalation discipline for parse failures
outputs:
  - Output schema (JSON Schema or TypeScript)
  - Prompt and contract (system, user, function, format instructions)
  - Validation harness (unit, integration, contract, property)
  - Retry and fallback discipline (code, circuit breaker, pager)
sideEffects: []
dependencies: []
stopCondition: Structured output green on acceptance suite with validation harness.
risk: low
trustTier: 1
maxIterations: 6
---

## Contract

- **Input:** task description, output schema, acceptance criteria, edge cases.
- **Output:** output schema + prompt + validation harness + retry discipline.
- **Side effects:** may call LLM APIs during validation.
- **Dependencies:** LLM with JSON or function calling support.
- **Stop condition:** structured output green on acceptance suite with validation harness.
- **Risk:** low — design and validation only; no production traffic.
- **Boundary:** designs and validates structured output; does not deploy to production.

# Structured Output

Produce reliable, parseable structured output from LLMs with validation and fallback.

## Process

### 1. Output schema
Define: JSON Schema or TypeScript type; required, optional, enum, format.
Examples: minimal, typical, edge, error; examples with schema.

**Completion criterion:** output schema with examples and validation rules.

### 2. Prompt and contract
System: intent, constraints, format instructions, schema.
User: task, inputs, examples, output format.
Function: name, description, parameters with type and enum.
Format: JSON, Markdown, list, or type.

**Completion criterion:** prompt and contract with schema, function, format instructions.

### 3. Constrained decoding
Grammar: context-free or regex; production rules for schema.
Stop tokens: EOS, eot, end of JSON, end of function.
Retry: exponential backoff, retry budget, circuit breaker, pager.

**Completion criterion:** grammar or regex with stop tokens and retry discipline.

### 4. Validation harness
Unit: schema, type, format, required, enum.
Integration: end-to-end with LLM and contract.
Property: multiple examples with schema and edge cases.
Business: business rule, semantic check, human approval.

**Completion criterion:** validation harness with unit, integration, property, business checks.

### 5. Retry and fallback
Parse failure: retry with repair, fallback to simpler model, circuit breaker, pager.
Fallback: simpler output, human, template, or rule.
Retry: exponential backoff, retry budget, circuit breaker, pager.

**Completion criterion:** retry and fallback discipline with retry, fallback, circuit breaker, pager.

## Rules

- No structured output accepted without validation green.
- No grammar accepted without coverage on edge cases.
- No retry discipline accepted without circuit breaker and pager.
- No fallback accepted without human or template escalation.
