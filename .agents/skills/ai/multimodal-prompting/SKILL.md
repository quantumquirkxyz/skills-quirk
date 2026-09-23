---
name: multimodal-prompting
category: ai
maturity: stable
version: 1
description: Multimodal prompting (vision, audio, video, image generation, vision-language models)
capabilities:
  - design vision prompts with image, OCR, diagram, and chart understanding
  - craft audio and video prompts with transcription, captioning, and event understanding
  - implement image generation with composition, style, and batch discipline
  - combine modalities with chain-of-thought, cot, and RAG
  - define acceptance criteria for each modality with human and machine checks
  - specify fallback and escalation for modality failures
outputs:
  - Prompt library (text, image, audio, video with specs)
  - Generation contract (pipeline, batch, retry, approval)
  - Validation suite (acceptance, edge, fallback, escalation)
  - Fallback and escalation discipline (code, circuit breaker, pager)
sideEffects: []
dependencies: []
stopCondition: Each modality green on acceptance suite with validation and fallback.
risk: low
trustTier: 1
maxIterations: 6
---

## Contract

- **Input:** task description, modality specs, acceptance criteria, edge cases.
- **Output:** prompt library + generation contract + validation suite + fallback discipline.
- **Side effects:** may call LLM or generation APIs during validation.
- **Dependencies:** multimodal model endpoints, generation APIs.
- **Stop condition:** each modality green on acceptance suite with validation and fallback.
- **Risk:** low — design and validation only; no production traffic.
- **Boundary:** designs and validates multimodal prompts; does not deploy to production.

# Multimodal Prompting

Compose prompts and contracts for vision, audio, video, and image generation with discipline.

## Process

### 1. Modality specs
Vision: image size, format, color space, resolution, compression; chart, diagram, document.
Audio: sample rate, channels, format, duration, noise floor, transcript.
Video: frame rate, resolution, duration, codec, keyframe interval; event, action, scene.
Image generation: size, format, style, subject, background, composition.

**Completion criterion:** modality specs with acceptance and edge cases.

### 2. Prompt design
Vision: intent, image, OCR, diagram, chart, focus, attention.
Audio: intent, transcript, event, focus, attention.
Video: intent, event, action, scene, focus, attention.
Image generation: intent, style, composition, subject, background, reference.

**Completion criterion:** prompt design with examples and acceptance.

### 3. Chain-of-thought and RAG
Chain-of-thought: reasoning with image, audio, video, generation.
RAG: retrieval from image, audio, video, generation corpus.
Composition: prompt chain, retrieval, generation, validation.

**Completion criterion:** chain-of-thought or RAG with composition and validation.

### 4. Validation suite
Acceptance: human check, machine check, acceptance metric.
Edge: edge cases with acceptance and edge checks.
Fallback: fallback with acceptance and escalation checks.
Escalation: human, circuit breaker, pager.

**Completion criterion:** validation suite with acceptance, edge, fallback, escalation checks.

### 5. Fallback and escalation
Parse failure: retry with repair, fallback to simpler model, circuit breaker, pager.
Fallback: simpler output, human, template, or rule.
Retry: exponential backoff, retry budget, circuit breaker, pager.

**Completion criterion:** fallback and escalation discipline with retry, fallback, circuit breaker, pager.

## Rules

- No modality accepted without acceptance suite green.
- No generation contract accepted without edge cases green.
- No fallback accepted without escalation path tested.
- No human check omitted for high-stakes or safety-critical modalities.
