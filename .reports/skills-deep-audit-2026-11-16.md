# Skills Deep Audit — 2026-11-16

**Alcance:** auditoría estática de todas las skills canónicas descubiertas bajo .agents/skills/ (excluye el directorio técnico platform cuando no es una skill). No se modifican SKILL.md, lockfiles ni proyecciones.

**Método y evidencia:** se leyó cada SKILL.md y su frontmatter; las ausencias señaladas son observables, no inferencias de ejecución. “Completa” significa metadata maturity: stable y contrato presente; “experimental/legacy/partial” conserva la clasificación declarada o la ausencia de clasificación. Las recomendaciones son propuestas, no cambios aplicados.

## Fuentes documentadas

- Repositorio: [Contexto](../CONTEXT.md), [índice de agentes](../docs/reference/agents/index.md), [evolución 2026](../docs/reference/agents/engineering-evolution-2026.md), [plan estratégico](../docs/reference/agents/strategic-implementation-plan-2026.md), [guía de estilo](../docs/how-to/skill-style.md).
- [OpenAI — Harness engineering (2026)](https://openai.com/index/harness-engineering/).
- [OpenAI — Testing Agent Skills Systematically with Evals (2026)](https://developers.openai.com/blog/eval-skills).
- [OWASP — AI Agent and MCP Security](https://owasp.github.io/DevSecOpsGuideline/2-Process/2-2-Develop/2-2-5-AI-Agent-and-MCP-Security/).
- [LangChain — State of Agent Engineering (2026)](https://www.langchain.com/state-of-agent-engineering).

## Criterio de madurez

- **Estable:** frontmatter declara maturity: stable; no implica que los evaluadores hayan pasado.
- **Experimental:** frontmatter declara experimental o el skill pertenece a una superficie explícitamente experimental del repositorio.
- **Legacy:** frontmatter declara legacy o el nombre/documentación indica compatibilidad histórica.
- **Parcial:** no hay clasificación válida o faltan campos contractuales verificables.

## Inventario individual

### accessibility-design

- **Path canónico:** `.agents/skills/accessibility/accessibility-design/SKILL.md`
- **Dominio:** `accessibility`
- **Propósito/trigger real:** Design accessible interfaces — semantics, focus management, keyboard flows, contrast, and assistive-technology compatibility — with inclusive interaction patterns.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P3**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### accessibility-testing

- **Path canónico:** `.agents/skills/accessibility/accessibility-testing/SKILL.md`
- **Dominio:** `accessibility`
- **Propósito/trigger real:** Test web interfaces for accessibility compliance — automated scans, manual keyboard navigation, screen reader validation — with explicit barrier detection and remediation evidence.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P3**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### accessibility

- **Path canónico:** `.agents/skills/accessibility/accessibility/SKILL.md`
- **Dominio:** `accessibility`
- **Propósito/trigger real:** Design inclusive products — WCAG compliance, assistive technology support, keyboard navigation, color contrast — with explicit user access guarantees.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P3**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### agent-orchestration

- **Path canónico:** `.agents/skills/ai/agent-orchestration/SKILL.md`
- **Dominio:** `ai`
- **Propósito/trigger real:** Design agent orchestration — multi-agent patterns, tool use, memory, handoffs, evaluation — with explicit coordination boundaries and observability.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P3**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar fixturesPath en frontmatter en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### ai-ml-pipeline

- **Path canónico:** `.agents/skills/ai/ai-ml-pipeline/SKILL.md`
- **Dominio:** `ai`
- **Propósito/trigger real:** Design ML pipelines — data ingestion, preprocessing, training, evaluation, deployment, monitoring — with reproducibility, fairness, and version control.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P3**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### ai-model-evaluation

- **Path canónico:** `.agents/skills/ai/ai-model-evaluation/SKILL.md`
- **Dominio:** `ai`
- **Propósito/trigger real:** Evaluate ML / LLM models — accuracy, fairness, robustness, explainability, drift — with explicit metrics, subgroup analysis, and failure-mode reporting.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P3**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### ai-prompt-engineering

- **Path canónico:** `.agents/skills/ai/ai-prompt-engineering/SKILL.md`
- **Dominio:** `ai`
- **Propósito/trigger real:** Design, evaluate, and refine prompts for LLMs (GPT-4, Claude, Llama, Mistral) with chain-of-thought, few-shot, RAG, and evaluation metrics.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P3**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; reglas de permisos
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, reglas de permisos en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### ai-time-series-forecasting

- **Path canónico:** `.agents/skills/ai/ai-time-series-forecasting/SKILL.md`
- **Dominio:** `ai`
- **Propósito/trigger real:** Design and evaluate time-series forecasting — ARIMA, Prophet, NeuralProphet, LSTM, Transformer — with stationarity analysis, seasonality, exogenous variables, and backtest.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P3**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### llm-eval

- **Path canónico:** `.agents/skills/ai/llm-eval/SKILL.md`
- **Dominio:** `ai`
- **Propósito/trigger real:** Design LLM evaluation harnesses — benchmark design, model comparison, automated evals — with reproducible scoring, confidence intervals, and regression detection.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P3**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; reglas de permisos
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, reglas de permisos en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### llm-fine-tuning

- **Path canónico:** `.agents/skills/ai/llm-fine-tuning/SKILL.md`
- **Dominio:** `ai`
- **Propósito/trigger real:** Fine-tune LLMs — LoRA, QLoRA, full fine-tuning, data preparation, evaluation, deployment — with reproducibility, efficiency, and safety controls.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P3**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### llmops

- **Path canónico:** `.agents/skills/ai/llmops/SKILL.md`
- **Dominio:** `ai`
- **Propósito/trigger real:** LLMOps (deployment, monitoring, A/B testing, prompt management, cost optimization, evaluation pipelines)
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P3**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; reglas de permisos
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, reglas de permisos en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### mlops

- **Path canónico:** `.agents/skills/ai/mlops/SKILL.md`
- **Dominio:** `ai`
- **Propósito/trigger real:** MLOps (feature stores, model registry, data versioning, pipeline orchestration, monitoring, retraining)
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P3**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### multimodal-prompting

- **Path canónico:** `.agents/skills/ai/multimodal-prompting/SKILL.md`
- **Dominio:** `ai`
- **Propósito/trigger real:** Multimodal prompting (vision, audio, video, image generation, vision-language models)
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P3**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, reglas de permisos, fixturesPath en frontmatter en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### prompt-template-library

- **Path canónico:** `.agents/skills/ai/prompt-template-library/SKILL.md`
- **Dominio:** `ai`
- **Propósito/trigger real:** Prompt template library (versioned templates, A/B testing, composition, evaluation)
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P3**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, reglas de permisos, fixturesPath en frontmatter en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### rag-pipeline

- **Path canónico:** `.agents/skills/ai/rag-pipeline/SKILL.md`
- **Dominio:** `ai`
- **Propósito/trigger real:** Design RAG pipelines — retrieval, chunking, embedding, reranking, generation — with explicit data flow, latency budgets, and evaluation seams.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P3**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; reglas de permisos
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, reglas de permisos en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### structured-output

- **Path canónico:** `.agents/skills/ai/structured-output/SKILL.md`
- **Dominio:** `ai`
- **Propósito/trigger real:** Structured output for LLMs (JSON mode, function calling, constrained decoding, validation)
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P3**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, reglas de permisos, fixturesPath en frontmatter en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### execution-policy

- **Path canónico:** `.agents/skills/auxiliary/execution-policy/SKILL.md`
- **Dominio:** `auxiliary`
- **Propósito/trigger real:** Decide whether a Skill action is allowed, requires approval, or must stop.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P1**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: evidence-based evals, bounded workflows, provenance and resilient agent handoffs.

### integration-playground

- **Path canónico:** `.agents/skills/auxiliary/integration-playground/SKILL.md`
- **Dominio:** `auxiliary`
- **Propósito/trigger real:** Create a disposable fixture environment for safely exercising Skills against local APIs, data, and files; use when testing a Skill with isolated local fixtures.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P3**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### interactive-tutorial-builder

- **Path canónico:** `.agents/skills/auxiliary/interactive-tutorial-builder/SKILL.md`
- **Dominio:** `auxiliary`
- **Propósito/trigger real:** Generate a focused tutorial with goals, exercise inputs, expected outputs, and checkpoints for any Skill; use when teaching or onboarding someone to a Skill.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P3**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### setup-quirk-skills

- **Path canónico:** `.agents/skills/auxiliary/setup-quirk-skills/SKILL.md`
- **Dominio:** `auxiliary`
- **Propósito/trigger real:** Configure this repo for the engineering skills — set up its issue tracker, triage label vocabulary, and domain doc layout. Run once before first use of the other engineering skills.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P3**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### api-gateway

- **Path canónico:** `.agents/skills/backend/api-gateway/SKILL.md`
- **Dominio:** `backend`
- **Propósito/trigger real:** API gateway (Kong, Envoy, AWS API Gateway, rate limiting, auth, routing).
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P1**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** reglas de permisos
- **Qué actualizaría exactamente:** Completar reglas de permisos en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: evidence-based evals, bounded workflows, provenance and resilient agent handoffs.

### backend-architecture

- **Path canónico:** `.agents/skills/backend/backend-architecture/SKILL.md`
- **Dominio:** `backend`
- **Propósito/trigger real:** Shape backend systems — REST/gRPC APIs, service contracts, data flow, state management, error handling — with explicit seams and caller responsibilities.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P2**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; fallback o recuperación; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, fallback o recuperación, reglas de permisos en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### backend-caching

- **Path canónico:** `.agents/skills/backend/backend-caching/SKILL.md`
- **Dominio:** `backend`
- **Propósito/trigger real:** Design backend caching strategies — cache keys, TTLs, invalidation, stale-while-revalidate, and cache coherence — with explicit consistency and failure trade-offs.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P2**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, reglas de permisos en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### backend-queues

- **Path canónico:** `.agents/skills/backend/backend-queues/SKILL.md`
- **Dominio:** `backend`
- **Propósito/trigger real:** Design backend queues and background job systems — durability, retries, ordering, idempotency, and backpressure — with explicit delivery guarantees.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P2**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** fallback o recuperación; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar fallback o recuperación, reglas de permisos, fixturesPath en frontmatter en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### caching-advanced

- **Path canónico:** `.agents/skills/backend/caching-advanced/SKILL.md`
- **Dominio:** `backend`
- **Propósito/trigger real:** Advanced caching strategies (Redis, Memcached, CDN, cache invalidation, stampede prevention).
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P2**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; reglas de permisos
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, reglas de permisos en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### distributed-tracing

- **Path canónico:** `.agents/skills/backend/distributed-tracing/SKILL.md`
- **Dominio:** `backend`
- **Propósito/trigger real:** Distributed tracing (OpenTelemetry, W3C TraceContext, sampling, instrumentation).
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P2**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### event-driven-architecture

- **Path canónico:** `.agents/skills/backend/event-driven-architecture/SKILL.md`
- **Dominio:** `backend`
- **Propósito/trigger real:** Event-driven architecture (Kafka, NATS, EventBridge, choreography vs orchestration).
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P2**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** timeout/deadline explícito; fallback o recuperación; reglas de permisos
- **Qué actualizaría exactamente:** Completar timeout/deadline explícito, fallback o recuperación, reglas de permisos en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### grpc-connect

- **Path canónico:** `.agents/skills/backend/grpc-connect/SKILL.md`
- **Dominio:** `backend`
- **Propósito/trigger real:** gRPC and Connect (protobuf, ConnectRPC, grpc-gateway, streaming, code generation).
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P2**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** fallback o recuperación; reglas de permisos
- **Qué actualizaría exactamente:** Completar fallback o recuperación, reglas de permisos en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### microservices

- **Path canónico:** `.agents/skills/backend/microservices/SKILL.md`
- **Dominio:** `backend`
- **Propósito/trigger real:** Design microservice architectures — service decomposition, inter-service communication, data ownership, resilience patterns — with explicit boundaries and failure isolation.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P2**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** fallback o recuperación; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar fallback o recuperación, reglas de permisos, fixturesPath en frontmatter en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### rate-limiting

- **Path canónico:** `.agents/skills/backend/rate-limiting/SKILL.md`
- **Dominio:** `backend`
- **Propósito/trigger real:** Rate limiting and throttling (token bucket, sliding window, distributed rate limiting, API protection).
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P2**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** timeout/deadline explícito; fallback o recuperación; reglas de permisos
- **Qué actualizaría exactamente:** Completar timeout/deadline explícito, fallback o recuperación, reglas de permisos en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### serverless

- **Path canónico:** `.agents/skills/backend/serverless/SKILL.md`
- **Dominio:** `backend`
- **Propósito/trigger real:** Serverless architecture (Lambda, Functions, FaaS, event-driven, cold starts, scaling, cost).
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P2**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** fallback o recuperación; reglas de permisos
- **Qué actualizaría exactamente:** Completar fallback o recuperación, reglas de permisos en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### service-mesh

- **Path canónico:** `.agents/skills/backend/service-mesh/SKILL.md`
- **Dominio:** `backend`
- **Propósito/trigger real:** Service mesh (Istio, Linkerd, Cilium, mTLS, traffic splitting, observability).
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P2**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; fallback o recuperación; reglas de permisos
- **Qué actualizaría exactamente:** Completar idempotencia explícita, fallback o recuperación, reglas de permisos en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### websockets

- **Path canónico:** `.agents/skills/backend/websockets/SKILL.md`
- **Dominio:** `backend`
- **Propósito/trigger real:** WebSockets and real-time (Socket.IO, WS, SSE, pub/sub, scaling, reconnection, backpressure).
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P2**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; política de reintentos/cancelación; reglas de permisos
- **Qué actualizaría exactamente:** Completar idempotencia explícita, política de reintentos/cancelación, reglas de permisos en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### cms-access-control

- **Path canónico:** `.agents/skills/cms/cms-access-control/SKILL.md`
- **Dominio:** `cms`
- **Propósito/trigger real:** Design CMS access control — roles, permissions, editorial workflows, and publishing boundaries — with explicit least-privilege and auditability.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P3**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### cms-architecture

- **Path canónico:** `.agents/skills/cms/cms-architecture/SKILL.md`
- **Dominio:** `cms`
- **Propósito/trigger real:** Design content management systems — content models, editorial workflows, publishing pipelines, localization — with schema evolution and multi-channel delivery.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P3**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, reglas de permisos en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### cms-content-strategy

- **Path canónico:** `.agents/skills/cms/cms-content-strategy/SKILL.md`
- **Dominio:** `cms`
- **Propósito/trigger real:** Design CMS content strategy — content models, taxonomy, governance, lifecycle, and multi-channel publishing — with explicit editorial ownership.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P3**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### localization

- **Path canónico:** `.agents/skills/cms/localization/SKILL.md`
- **Dominio:** `cms`
- **Propósito/trigger real:** Design internationalization (i18n) and localization (l10n) — string management, locale handling, RTL support, cultural adaptation — so the product works across languages and regions.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P3**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### compiler-design

- **Path canónico:** `.agents/skills/compilers/compiler-design/SKILL.md`
- **Dominio:** `compilers`
- **Propósito/trigger real:** Design compiler pipelines — lexing, parsing, ASTs, type checking, IR, optimization, and code generation — with correctness and modularity.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P3**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### compiler-testing

- **Path canónico:** `.agents/skills/compilers/compiler-testing/SKILL.md`
- **Dominio:** `compilers`
- **Propósito/trigger real:** Test compilers and interpreters — parser tests, semantic tests, IR validation, golden tests, and regression checks — with explicit oracle design.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P3**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### compilers

- **Path canónico:** `.agents/skills/compilers/compilers/SKILL.md`
- **Dominio:** `compilers`
- **Propósito/trigger real:** Design and implement compilers and interpreters — lexer, parser, AST, type checking, code generation, optimization — with correctness and modularity.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P3**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### cs-algorithms

- **Path canónico:** `.agents/skills/cs/cs-algorithms/SKILL.md`
- **Dominio:** `cs`
- **Propósito/trigger real:** Design and analyse algorithms — correctness proof, complexity analysis (time and space), and stability — with explicit proof of invariants and termination.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P3**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### cs-complexity-analysis

- **Path canónico:** `.agents/skills/cs/cs-complexity-analysis/SKILL.md`
- **Dominio:** `cs`
- **Propósito/trigger real:** Analyze algorithmic complexity — time, space, amortized cost, and lower bounds — with explicit assumptions and proof sketches.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P3**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### cs-computability

- **Path canónico:** `.agents/skills/cs/cs-computability/SKILL.md`
- **Dominio:** `cs`
- **Propósito/trigger real:** Analyze computability questions — decidability, reductions, recognizability, and undecidability proofs — with formal problem transformations.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P3**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### cs-data-structures

- **Path canónico:** `.agents/skills/cs/cs-data-structures/SKILL.md`
- **Dominio:** `cs`
- **Propósito/trigger real:** Design and analyze data structures — arrays, trees, heaps, hash tables, graphs, and balanced variants — with operation costs and invariants.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P3**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### data-catalog

- **Path canónico:** `.agents/skills/data/data-catalog/SKILL.md`
- **Dominio:** `data`
- **Propósito/trigger real:** Data catalog (metadata management, discovery, classification, data mesh, governance).
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P2**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### data-contracts

- **Path canónico:** `.agents/skills/data/data-contracts/SKILL.md`
- **Dominio:** `data`
- **Propósito/trigger real:** Design data contracts — schema evolution, producer-consumer agreements, schema registry, breaking change detection — with explicit compatibility rules and versioning.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P2**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; reglas de permisos
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, reglas de permisos en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### data-etl-pipeline

- **Path canónico:** `.agents/skills/data/data-etl-pipeline/SKILL.md`
- **Dominio:** `data`
- **Propósito/trigger real:** Design ETL / ELT pipelines — extraction, transformation, load — with reproducible steps, schema evolution, quality checks, and observability.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P2**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### data-lineage

- **Path canónico:** `.agents/skills/data/data-lineage/SKILL.md`
- **Dominio:** `data`
- **Propósito/trigger real:** Data lineage (end-to-end tracing, impact analysis, column-level lineage, governance).
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P2**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### data-quality

- **Path canónico:** `.agents/skills/data/data-quality/SKILL.md`
- **Dominio:** `data`
- **Propósito/trigger real:** Design data quality frameworks — Great Expectations, Soda, checks, observability, contracts — with explicit SLAs, freshness rules, and incident response for bad data.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P2**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### data-streaming

- **Path canónico:** `.agents/skills/data/data-streaming/SKILL.md`
- **Dominio:** `data`
- **Propósito/trigger real:** Design streaming data pipelines — Kafka, Kinesis, Pub/Sub, Flink — with event schemas, stream processing, and real-time analytics.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P2**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### data-versioning

- **Path canónico:** `.agents/skills/data/data-versioning/SKILL.md`
- **Dominio:** `data`
- **Propósito/trigger real:** Data versioning (DVC, lakeFS, delta tables, snapshotting, reproducibility).
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P2**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### data-warehouse-modeling

- **Path canónico:** `.agents/skills/data/data-warehouse-modeling/SKILL.md`
- **Dominio:** `data`
- **Propósito/trigger real:** Design analytical warehouse schemas — star / snowflake / OBT — with dimension, fact, and bridge tables; partitioning; indexing; and query optimization.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P2**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### feature-store

- **Path canónico:** `.agents/skills/data/feature-store/SKILL.md`
- **Dominio:** `data`
- **Propósito/trigger real:** Feature store (online/offline, feature engineering, serving, monitoring, drift).
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P2**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### semantic-layer

- **Path canónico:** `.agents/skills/data/semantic-layer/SKILL.md`
- **Dominio:** `data`
- **Propósito/trigger real:** Design a semantic layer — dbt, Cube, metrics, dimensions, measures, self-service analytics — with explicit business logic, governance, and query optimization.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P2**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### stream-processing

- **Path canónico:** `.agents/skills/data/stream-processing/SKILL.md`
- **Dominio:** `data`
- **Propósito/trigger real:** Stream processing (Flink, Kafka Streams, RisingWave, windowing, state, exactly-once).
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P2**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** política de reintentos/cancelación; fallback o recuperación; reglas de permisos
- **Qué actualizaría exactamente:** Completar política de reintentos/cancelación, fallback o recuperación, reglas de permisos en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### db-migrations

- **Path canónico:** `.agents/skills/db/db-migrations/SKILL.md`
- **Dominio:** `db`
- **Propósito/trigger real:** Plan database migrations — schema changes, backfills, compatibility windows, and rollback strategy — with explicit application and data safety checks.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P3**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; fallback o recuperación; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, fallback o recuperación, reglas de permisos en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### db-nosql-modeling

- **Path canónico:** `.agents/skills/db/db-nosql-modeling/SKILL.md`
- **Dominio:** `db`
- **Propósito/trigger real:** Design NoSQL data models — document, key-value, wide-column, graph, time-series — with access pattern analysis, consistency requirements, and schema evolution.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P3**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### db-query-optimization

- **Path canónico:** `.agents/skills/db/db-query-optimization/SKILL.md`
- **Dominio:** `db`
- **Propósito/trigger real:** Optimize database queries — indexing, query plans, cardinality, joins, and execution trade-offs — with explainable reasoning and measurement.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P3**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### db-relational-design

- **Path canónico:** `.agents/skills/db/db-relational-design/SKILL.md`
- **Dominio:** `db`
- **Propósito/trigger real:** Design relational schemas — entities, relations, keys, indexes, constraints — with normalisation, performance, and migration planning.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P3**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### code-review

- **Path canónico:** `.agents/skills/delivery/code-review/SKILL.md`
- **Dominio:** `delivery`
- **Propósito/trigger real:** Analyze a repository or requested code scope for logical correctness, behavior, architecture, risks, and maintainability, returning evidence-backed findings without editing source files.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P0**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; provenance; reglas de permisos
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: least-agency, prompt-injection resistance, auditable approvals and replayable safety fixtures.

### contribution-workflow-optimizer

- **Path canónico:** `.agents/skills/delivery/contribution-workflow-optimizer/SKILL.md`
- **Dominio:** `delivery`
- **Propósito/trigger real:** Inspect changed Skills and recommend contribution improvements across standards, docs, tests, and examples; use when eva
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P1**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: evidence-based evals, bounded workflows, provenance and resilient agent handoffs.

### diagnosing-bugs

- **Path canónico:** `.agents/skills/delivery/diagnosing-bugs/SKILL.md`
- **Dominio:** `delivery`
- **Propósito/trigger real:** >-
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P1**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: evidence-based evals, bounded workflows, provenance and resilient agent handoffs.

### implement-review-fixes

- **Path canónico:** `.agents/skills/delivery/implement-review-fixes/SKILL.md`
- **Dominio:** `delivery`
- **Propósito/trigger real:** Apply a plan-review-fixes remediation plan through implement, validate each finding, and hand off a traceable implementation result.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P0**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** timeout/deadline explícito; fallback o recuperación; reglas de permisos
- **Qué actualizaría exactamente:** Completar timeout/deadline explícito, fallback o recuperación, reglas de permisos en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** plan-review-fixes,implement,review-pr,resolving-merge-conflicts.
- **Tendencia 2026 que justifica el cambio:** 2026: least-agency, prompt-injection resistance, auditable approvals and replayable safety fixtures.

### implement

- **Path canónico:** `.agents/skills/delivery/implement/SKILL.md`
- **Dominio:** `delivery`
- **Propósito/trigger real:** Implement a piece of work based on a spec or set of tickets, or build a scoped fix that can be handed off for publication. This skill stops at the implemented, validated branch.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P0**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** tdd.
- **Tendencia 2026 que justifica el cambio:** 2026: least-agency, prompt-injection resistance, auditable approvals and replayable safety fixtures.

### loop-budget

- **Path canónico:** `.agents/skills/delivery/loop-budget/SKILL.md`
- **Dominio:** `delivery`
- **Propósito/trigger real:** Keep an agent loop inside its declared budget and end it with a typed verdict instead of a runaway process. Use when a repair, polling, or fan-out loop must declare step/cost/wall-time budgets up front, detect degenerate repetition and ping-pong, and exit with {exitStatus, submission, budgetSpent, nudges}.
- **Estado actual:** **experimental**; evidencia: frontmatter maturity: experimental
- **Prioridad:** **P0**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; fallback o recuperación; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, fallback o recuperación, reglas de permisos, fixturesPath en frontmatter en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: least-agency, prompt-injection resistance, auditable approvals and replayable safety fixtures.

### plan-review-fixes

- **Path canónico:** `.agents/skills/delivery/plan-review-fixes/SKILL.md`
- **Dominio:** `delivery`
- **Propósito/trigger real:** Convert review-pr findings on a GitHub PR into a concrete remediation plan and post that plan as PR comments. Use after
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P0**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** timeout/deadline explícito; fallback o recuperación; reglas de permisos
- **Qué actualizaría exactamente:** Completar timeout/deadline explícito, fallback o recuperación, reglas de permisos en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: least-agency, prompt-injection resistance, auditable approvals and replayable safety fixtures.

### prototype

- **Path canónico:** `.agents/skills/delivery/prototype/SKILL.md`
- **Dominio:** `delivery`
- **Propósito/trigger real:** Build a throwaway prototype to answer a design question. Use when the user wants to sanity-check whether a state model or interaction shape actually works.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P1**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: evidence-based evals, bounded workflows, provenance and resilient agent handoffs.

### research

- **Path canónico:** `.agents/skills/delivery/research/SKILL.md`
- **Dominio:** `delivery`
- **Propósito/trigger real:** Investigate a question against high-trust primary sources and capture the findings as a Markdown file in the repo. Use w
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P0**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: least-agency, prompt-injection resistance, auditable approvals and replayable safety fixtures.

### resolving-merge-conflicts

- **Path canónico:** `.agents/skills/delivery/resolving-merge-conflicts/SKILL.md`
- **Dominio:** `delivery`
- **Propósito/trigger real:** Use when you need to resolve a conflicted or blocked branch state: in-progress git merge/rebase conflicts, PR branch corrections, or other branch-state blockers that need deliberate resolution.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P0**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; política de reintentos/cancelación; fallback o recuperación; reglas de permisos
- **Qué actualizaría exactamente:** Completar idempotencia explícita, política de reintentos/cancelación, fallback o recuperación, reglas de permisos en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: least-agency, prompt-injection resistance, auditable approvals and replayable safety fixtures.

### review-fix-loop

- **Path canónico:** `.agents/skills/delivery/review-fix-loop/SKILL.md`
- **Dominio:** `delivery`
- **Propósito/trigger real:** Orchestrate the PR repair loop: run review-pr, use plan-review-fixes when findings exist, use implement-review-fixes to apply them, and repeat until the PR is clean or blocked. This skill coordinates the loop only.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P0**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; fallback o recuperación; reglas de permisos
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, fallback o recuperación, reglas de permisos en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** review-pr,plan-review-fixes,implement-review-fixes.
- **Tendencia 2026 que justifica el cambio:** 2026: least-agency, prompt-injection resistance, auditable approvals and replayable safety fixtures.

### review-pr

- **Path canónico:** `.agents/skills/delivery/review-pr/SKILL.md`
- **Dominio:** `delivery`
- **Propósito/trigger real:** Review a pull request against the fixed point the user supplies, separating Standards and Spec findings into distinct ax
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P0**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: least-agency, prompt-injection resistance, auditable approvals and replayable safety fixtures.

### tdd

- **Path canónico:** `.agents/skills/delivery/tdd/SKILL.md`
- **Dominio:** `delivery`
- **Propósito/trigger real:** Test-driven development. Use when the user wants to build features or fix bugs test-first, mentions "red-green-refactor
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P1**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: evidence-based evals, bounded workflows, provenance and resilient agent handoffs.

### testing

- **Path canónico:** `.agents/skills/delivery/testing/SKILL.md`
- **Dominio:** `delivery`
- **Propósito/trigger real:** Shape the test strategy for a project so behavior is verified at the right seams and at the right level.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P1**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: evidence-based evals, bounded workflows, provenance and resilient agent handoffs.

### webapp-testing

- **Path canónico:** `.agents/skills/delivery/webapp-testing/SKILL.md`
- **Dominio:** `delivery`
- **Propósito/trigger real:** Choose the right test seam for a web app and describe how to verify it at unit, integration, and end-to-end levels.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P1**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: evidence-based evals, bounded workflows, provenance and resilient agent handoffs.

### backup-disaster-recovery

- **Path canónico:** `.agents/skills/devops/backup-disaster-recovery/SKILL.md`
- **Dominio:** `devops`
- **Propósito/trigger real:** Design backup and disaster recovery — RPO/RTO, backup strategies, restore testing, cross-region — with explicit recovery objectives and validation.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P2**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### chaos-engineering

- **Path canónico:** `.agents/skills/devops/chaos-engineering/SKILL.md`
- **Dominio:** `devops`
- **Propósito/trigger real:** Design chaos engineering — fault injection, GameDays, resilience validation — with explicit steady-state hypotheses, blast radius controls, and safety rails.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P2**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### cost-optimization

- **Path canónico:** `.agents/skills/devops/cost-optimization/SKILL.md`
- **Dominio:** `devops`
- **Propósito/trigger real:** Design FinOps strategies — rightsizing, spot instances, committed use, budgets, showback/chargeback — with cost visibility and optimisation guardrails.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P2**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; reglas de permisos
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, reglas de permisos en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### devops-ci-cd-pipeline

- **Path canónico:** `.agents/skills/devops/devops-ci-cd-pipeline/SKILL.md`
- **Dominio:** `devops`
- **Propósito/trigger real:** Design CI/CD pipelines — build, test, security scan, deploy, rollback — with reproducible steps, environment parity, and deployment gates.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P2**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### devops-feature-flags

- **Path canónico:** `.agents/skills/devops/devops-feature-flags/SKILL.md`
- **Dominio:** `devops`
- **Propósito/trigger real:** Design feature flag systems — gradual rollouts, A/B experiments, kill switches, targeting rules — with lifecycle management and operational runbooks.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P2**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### devops-k8s-orchestration

- **Path canónico:** `.agents/skills/devops/devops-k8s-orchestration/SKILL.md`
- **Dominio:** `devops`
- **Propósito/trigger real:** Design and configure Kubernetes orchestration — cluster architecture, deployment strategies, service mesh, observability, auto-scaling, security policies — with reproducible infrastructure.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P2**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### devops-terraform-iac

- **Path canónico:** `.agents/skills/devops/devops-terraform-iac/SKILL.md`
- **Dominio:** `devops`
- **Propósito/trigger real:** Design infrastructure as code — Terraform / Pulumi / CloudFormation — for reproducible, version-controlled, auditable cloud infrastructure.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P2**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### gitops

- **Path canónico:** `.agents/skills/devops/gitops/SKILL.md`
- **Dominio:** `devops`
- **Propósito/trigger real:** Design GitOps workflows — ArgoCD, Flux, declarative sync, drift detection, progressive delivery — with explicit reconciliation and safety boundaries.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P2**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### incident-response

- **Path canónico:** `.agents/skills/devops/incident-response/SKILL.md`
- **Dominio:** `devops`
- **Propósito/trigger real:** Design incident response — runbooks, war rooms, postmortems, blameless culture — with explicit severity taxonomy, escalation paths, and communication rules.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P2**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### secret-management

- **Path canónico:** `.agents/skills/devops/secret-management/SKILL.md`
- **Dominio:** `devops`
- **Propósito/trigger real:** Design secret management — Vault, SOPS, SealedSecrets, rotation, external secrets — with encryption, access control, and auditability.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P2**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### docs-adrs

- **Path canónico:** `.agents/skills/docs/docs-adrs/SKILL.md`
- **Dominio:** `docs`
- **Propósito/trigger real:** Create and maintain Architecture Decision Records — context, decision, consequences, alternatives, status — with periodic review.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P3**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### docs-knowledge-base

- **Path canónico:** `.agents/skills/docs/docs-knowledge-base/SKILL.md`
- **Dominio:** `docs`
- **Propósito/trigger real:** Maintain a repository knowledge base — glossary, durable references, indexed guidance, and consumer-oriented navigation — with explicit update rules.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P3**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### docs-technical-writing

- **Path canónico:** `.agents/skills/docs/docs-technical-writing/SKILL.md`
- **Dominio:** `docs`
- **Propósito/trigger real:** Write technical documentation — clear explanations, examples, warnings, and procedural guidance — with audience-aware structure and maintenance rules.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P3**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### agent-native-engineering

- **Path canónico:** `.agents/skills/engineering/agent-native-engineering/SKILL.md`
- **Dominio:** `engineering`
- **Propósito/trigger real:** AI-Native Engineer skill stack: spec literacy, context engineering, orchestration, and quality ownership — plan with agents, maintain AGENTS.md, run agents in parallel, review diffs line by line, own quality gates.
- **Estado actual:** **experimental**; evidencia: frontmatter maturity: experimental
- **Prioridad:** **P0**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** spec-driven-development,to-tickets,implement,review-pr.
- **Tendencia 2026 que justifica el cambio:** 2026: least-agency, prompt-injection resistance, auditable approvals and replayable safety fixtures.

### improve-codebase-architecture

- **Path canónico:** `.agents/skills/engineering/improve-codebase-architecture/SKILL.md`
- **Dominio:** `engineering`
- **Propósito/trigger real:** Scan a codebase for deepening opportunities and present candidates as a visual HTML report, then grill through the selected one.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P3**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### software-factory

- **Path canónico:** `.agents/skills/engineering/software-factory/SKILL.md`
- **Dominio:** `engineering`
- **Propósito/trigger real:** Engineer the system that builds code — foreman agent, separate validator, different-model critic, observability views, MCP wiring, context window management, convergence tuning.
- **Estado actual:** **experimental**; evidencia: frontmatter maturity: experimental
- **Prioridad:** **P0**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** agent-native-engineering,mcp-server,observability.
- **Tendencia 2026 que justifica el cambio:** 2026: least-agency, prompt-injection resistance, auditable approvals and replayable safety fixtures.

### finance-corporate-val

- **Path canónico:** `.agents/skills/finance/finance-corporate-val/SKILL.md`
- **Dominio:** `finance`
- **Propósito/trigger real:** Corporate valuation — DCF, multiples, sum-of-parts, scenario analysis — with explicit assumptions, sensitivity, and cross-checks.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P3**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### finance-dcf

- **Path canónico:** `.agents/skills/finance/finance-dcf/SKILL.md`
- **Dominio:** `finance`
- **Propósito/trigger real:** Discounted Cash Flow — forecast, WACC, terminal value, sensitivity — with explicit assumptions, cross-check against multiples, and a valuation range.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P3**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### finance-portfolio-theory

- **Path canónico:** `.agents/skills/finance/finance-portfolio-theory/SKILL.md`
- **Dominio:** `finance`
- **Propósito/trigger real:** Modern Portfolio Theory — efficient frontier, CAPM, APT, risk attribution, and performance measurement — with explicit assumptions and regime analysis.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P3**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### agent-canvas

- **Path canónico:** `.agents/skills/foundation/agent-canvas/SKILL.md`
- **Dominio:** `foundation`
- **Propósito/trigger real:** Reference skill for agent workspace control — multi-agent session management, workspace persistence, and cross-device continuity, independent of any external framework.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P1**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: evidence-based evals, bounded workflows, provenance and resilient agent handoffs.

### agent-card

- **Path canónico:** `.agents/skills/foundation/agent-card/SKILL.md`
- **Dominio:** `foundation`
- **Propósito/trigger real:** Generates and maintains Agent Cards for A2A (Agent-to-Agent) discovery.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P0**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos
- **Qué actualizaría exactamente:** Completar timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación, reglas de permisos en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: least-agency, prompt-injection resistance, auditable approvals and replayable safety fixtures.

### agent-memory

- **Path canónico:** `.agents/skills/foundation/agent-memory/SKILL.md`
- **Dominio:** `foundation`
- **Propósito/trigger real:** Maintain external agent memory: structured notes persisted outside the context window (NOW.md for the working thread, MEMORY.md for durable facts) so context can compact or reset while knowledge survives across sessions.
- **Estado actual:** **experimental**; evidencia: frontmatter maturity: experimental
- **Prioridad:** **P0**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** context-pack,context-compaction,handoff,docs-knowledge-base.
- **Tendencia 2026 que justifica el cambio:** 2026: least-agency, prompt-injection resistance, auditable approvals and replayable safety fixtures.

### agent-observability

- **Path canónico:** `.agents/skills/foundation/agent-observability/SKILL.md`
- **Dominio:** `foundation`
- **Propósito/trigger real:** Capture redacted execution records, traces, and quality signals for skill runs with structured data for analysis. Enables full audit of decisions made during agent execution.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P1**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: evidence-based evals, bounded workflows, provenance and resilient agent handoffs.

### api-design

- **Path canónico:** `.agents/skills/foundation/api-design/SKILL.md`
- **Dominio:** `foundation`
- **Propósito/trigger real:** Design a small, durable API seam — with a deep backend and explicit caller contract boundaries.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P1**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: evidence-based evals, bounded workflows, provenance and resilient agent handoffs.

### codebase-design

- **Path canónico:** `.agents/skills/foundation/codebase-design/SKILL.md`
- **Dominio:** `foundation`
- **Propósito/trigger real:** Shared vocabulary for designing deep modules. Use when the user wants to design or improve a module's interface, find depth, or define a clean seam.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P1**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: evidence-based evals, bounded workflows, provenance and resilient agent handoffs.

### context-compaction

- **Path canónico:** `.agents/skills/foundation/context-compaction/SKILL.md`
- **Dominio:** `foundation`
- **Propósito/trigger real:** Run the context compaction discipline for long agent sessions: summarize the working set, clear stale tool results, and re-initiate a fresh window without losing the thread or the durable artifacts.
- **Estado actual:** **experimental**; evidencia: frontmatter maturity: experimental
- **Prioridad:** **P0**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; criterios de cierre en el cuerpo.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos; stopCondition en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** context-pack,handoff,loop-budget.
- **Tendencia 2026 que justifica el cambio:** 2026: least-agency, prompt-injection resistance, auditable approvals and replayable safety fixtures.

### context-engine

- **Path canónico:** `.agents/skills/foundation/context-engine/SKILL.md`
- **Dominio:** `foundation`
- **Propósito/trigger real:** Manage dynamic context for agent execution using retrieval-augmented generation patterns, updating the working context from sources beyond static CONTEXT.md (issues, PRs, docs, execution traces).
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P0**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** context-pack,agent-memory,agent-observability.
- **Tendencia 2026 que justifica el cambio:** 2026: least-agency, prompt-injection resistance, auditable approvals and replayable safety fixtures.

### domain-modeling

- **Path canónico:** `.agents/skills/foundation/domain-modeling/SKILL.md`
- **Dominio:** `foundation`
- **Propósito/trigger real:** Build and sharpen a project's domain model. Record the execution traceId and link the artifact to the originating issue for review replay. Use when the user wants to pin down domain terminology or a ubiquitous language boundary.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P1**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: evidence-based evals, bounded workflows, provenance and resilient agent handoffs.

### mcp-server

- **Path canónico:** `.agents/skills/foundation/mcp-server/SKILL.md`
- **Dominio:** `foundation`
- **Propósito/trigger real:** Define an MCP server that exposes quirk Skills as tools, resources, and prompts to external LLM agents via the Model Context Protocol.
- **Estado actual:** **partial**; evidencia: frontmatter maturity: beta
- **Prioridad:** **P0**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: least-agency, prompt-injection resistance, auditable approvals and replayable safety fixtures.

### observability

- **Path canónico:** `.agents/skills/foundation/observability/SKILL.md`
- **Dominio:** `foundation`
- **Propósito/trigger real:** Define the logs, metrics, traces, and alerts needed to understand a system in production — with SLIs, SLOs, dashboards, alert rules, and incident runbooks.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P1**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: evidence-based evals, bounded workflows, provenance and resilient agent handoffs.

### skill-composition

- **Path canónico:** `.agents/skills/foundation/skill-composition/SKILL.md`
- **Dominio:** `foundation`
- **Propósito/trigger real:** Compose skills into chains and workflows with explicit contracts: declare the producer-consumer edges between skills, verify artifact compatibility at each edge, and keep the chain inside a declared budget.
- **Estado actual:** **experimental**; evidencia: frontmatter maturity: experimental
- **Prioridad:** **P0**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** artifact-handoff,loop-budget,analyze-artifacts,work-item-router.
- **Tendencia 2026 que justifica el cambio:** 2026: least-agency, prompt-injection resistance, auditable approvals and replayable safety fixtures.

### subagent-swarm

- **Path canónico:** `.agents/skills/foundation/subagent-swarm/SKILL.md`
- **Dominio:** `foundation`
- **Propósito/trigger real:** Coordinate multiple agent sub-roles (architect, implementer, reviewer, tester) in parallel or sequential swarm mode, with clear handoff contracts and evidence recording.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P0**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** verify-delegation.
- **Tendencia 2026 que justifica el cambio:** 2026: least-agency, prompt-injection resistance, auditable approvals and replayable safety fixtures.

### verify-delegation

- **Path canónico:** `.agents/skills/foundation/verify-delegation/SKILL.md`
- **Dominio:** `foundation`
- **Propósito/trigger real:** Blackbox-verify a delegated worker's claim before it is accepted, using the artifact, the declared success criteria, and the tools needed to re-check them - never the worker's implementation narrative.
- **Estado actual:** **experimental**; evidencia: frontmatter maturity: experimental
- **Prioridad:** **P0**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** subagent-swarm.
- **Tendencia 2026 que justifica el cambio:** 2026: least-agency, prompt-injection resistance, auditable approvals and replayable safety fixtures.

### astro

- **Path canónico:** `.agents/skills/frontend/astro/SKILL.md`
- **Dominio:** `frontend`
- **Propósito/trigger real:** Astro framework (islands architecture, content-focused sites, SSR/SSG, view transitions).
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P3**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, reglas de permisos en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### design-system

- **Path canónico:** `.agents/skills/frontend/design-system/SKILL.md`
- **Dominio:** `frontend`
- **Propósito/trigger real:** Define and evolve reusable UI tokens, components, and usage rules as a coherent system.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P3**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### frontend-design

- **Path canónico:** `.agents/skills/frontend/frontend-design/SKILL.md`
- **Dominio:** `frontend`
- **Propósito/trigger real:** Shape frontend work into a clear visual system, interaction model, and implementation seam — with explicit state and motion boundaries.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P3**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### frontend-testing

- **Path canónico:** `.agents/skills/frontend/frontend-testing/SKILL.md`
- **Dominio:** `frontend`
- **Propósito/trigger real:** Frontend testing (Vitest, Testing Library, Playwright, visual testing, Storybook).
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P3**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### mobile

- **Path canónico:** `.agents/skills/frontend/mobile/SKILL.md`
- **Dominio:** `frontend`
- **Propósito/trigger real:** Shape mobile projects around device constraints, platform seams, offline behavior, and push notifications — with explicit performance and resilience boundaries for React Native, Expo, and Capacitor.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P3**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### nextjs

- **Path canónico:** `.agents/skills/frontend/nextjs/SKILL.md`
- **Dominio:** `frontend`
- **Propósito/trigger real:** Shape Next.js projects around routes, server/client seams, and data flow that stay deep rather than tangled.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P3**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### react

- **Path canónico:** `.agents/skills/frontend/react/SKILL.md`
- **Dominio:** `frontend`
- **Propósito/trigger real:** Design React component structure and state seams — with composability, testability, and clear data flow.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P3**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### remix

- **Path canónico:** `.agents/skills/frontend/remix/SKILL.md`
- **Dominio:** `frontend`
- **Propósito/trigger real:** Remix framework (loaders, actions, nested routes, progressive enhancement).
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P3**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** timeout/deadline explícito; política de reintentos/cancelación; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar timeout/deadline explícito, política de reintentos/cancelación, reglas de permisos, fixturesPath en frontmatter en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### state-management

- **Path canónico:** `.agents/skills/frontend/state-management/SKILL.md`
- **Dominio:** `frontend`
- **Propósito/trigger real:** Modern state management (Zustand, Jotai, signals, Redux Toolkit, server state).
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P3**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### styling

- **Path canónico:** `.agents/skills/frontend/styling/SKILL.md`
- **Dominio:** `frontend`
- **Propósito/trigger real:** Modern CSS (Tailwind v4, Panda CSS, CSS modules, CVA, design tokens).
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P3**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### graph-skill-routing

- **Path canónico:** `.agents/skills/graph/graph-skill-routing/SKILL.md`
- **Dominio:** `graph`
- **Propósito/trigger real:** Dependency-aware skill retrieval: expand prerequisite closure, topologically order skills, and route work through a typed skill graph — never return a skill in isolation when execution depends on unretrieved skills.
- **Estado actual:** **experimental**; evidencia: frontmatter maturity: experimental
- **Prioridad:** **P1**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** skill-graph-engineering,capability-router.
- **Tendencia 2026 que justifica el cambio:** 2026: evidence-based evals, bounded workflows, provenance and resilient agent handoffs.

### skill-graph-engineering

- **Path canónico:** `.agents/skills/graph/skill-graph-engineering/SKILL.md`
- **Dominio:** `graph`
- **Propósito/trigger real:** Build typed skill dependency graphs (dependency, workflow, semantic, alternative edges), DAG compilation, and local repair operators (Rebind, InsertPrereq, Substitute, Rewire, Bypass) for skill orchestration.
- **Estado actual:** **experimental**; evidencia: frontmatter maturity: experimental
- **Prioridad:** **P1**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** skill-dependency-graph,skill-composition.
- **Tendencia 2026 que justifica el cambio:** 2026: evidence-based evals, bounded workflows, provenance and resilient agent handoffs.

### brand-identity

- **Path canónico:** `.agents/skills/graphic-design/brand-identity/SKILL.md`
- **Dominio:** `graphic-design`
- **Propósito/trigger real:** Design brand identity systems — logo, color, typography, imagery, iconography, voice, and usage rules — with explicit consistency, scalability, and governance.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P3**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, reglas de permisos en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### design-system-visual

- **Path canónico:** `.agents/skills/graphic-design/design-system-visual/SKILL.md`
- **Dominio:** `graphic-design`
- **Propósito/trigger real:** Design visual design systems — tokens, components, patterns, and documentation — with explicit hierarchy, accessibility, and cross-channel consistency.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P3**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### graphic-design-accessibility

- **Path canónico:** `.agents/skills/graphic-design/graphic-design-accessibility/SKILL.md`
- **Dominio:** `graphic-design`
- **Propósito/trigger real:** Design inclusive graphic artifacts — WCAG-compliant visuals, colorblind-safe palettes, readable typography, and assistive-technology-compatible layouts for print and digital.
- **Estado actual:** **partial**; evidencia: no hay maturity válida; se clasifica parcial
- **Prioridad:** **P3**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; criterios de cierre en el cuerpo.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos; fixturesPath en frontmatter; stopCondition en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** siguiente skill/usuario según Provenance; dependencias explícitas no declaradas.
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### graphic-design-advertising

- **Path canónico:** `.agents/skills/graphic-design/graphic-design-advertising/SKILL.md`
- **Dominio:** `graphic-design`
- **Propósito/trigger real:** Design advertising creatives — social ads, display ads, email banners, campaign visuals — with explicit brand consistency, format specifications, and conversion-focused layout rules.
- **Estado actual:** **partial**; evidencia: no hay maturity válida; se clasifica parcial
- **Prioridad:** **P3**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; criterios de cierre en el cuerpo.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos; fixturesPath en frontmatter; stopCondition en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** siguiente skill/usuario según Provenance; dependencias explícitas no declaradas.
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### graphic-design-data-viz

- **Path canónico:** `.agents/skills/graphic-design/graphic-design-data-viz/SKILL.md`
- **Dominio:** `graphic-design`
- **Propósito/trigger real:** Design data visualizations — charts, infographics, dashboards — with explicit readability, accessibility, color, typography, and production rules.
- **Estado actual:** **partial**; evidencia: no hay maturity válida; se clasifica parcial
- **Prioridad:** **P3**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; criterios de cierre en el cuerpo.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; reglas de permisos; fixturesPath en frontmatter; stopCondition en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, reglas de permisos en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** siguiente skill/usuario según Provenance; dependencias explícitas no declaradas.
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### graphic-design-editorial

- **Path canónico:** `.agents/skills/graphic-design/graphic-design-editorial/SKILL.md`
- **Dominio:** `graphic-design`
- **Propósito/trigger real:** Design editorial layouts — magazines, books, reports, long-form content — with explicit grid systems, typography hierarchy, and production-ready pagination.
- **Estado actual:** **partial**; evidencia: no hay maturity válida; se clasifica parcial
- **Prioridad:** **P3**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; criterios de cierre en el cuerpo.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos; fixturesPath en frontmatter; stopCondition en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** siguiente skill/usuario según Provenance; dependencias explícitas no declaradas.
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### graphic-design-foundations

- **Path canónico:** `.agents/skills/graphic-design/graphic-design-foundations/SKILL.md`
- **Dominio:** `graphic-design`
- **Propósito/trigger real:** Design graphic artifacts — posters, social graphics, editorial layouts, packaging, signage — with explicit composition, color, typography, and production constraints.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P3**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### graphic-design-motion

- **Path canónico:** `.agents/skills/graphic-design/graphic-design-motion/SKILL.md`
- **Dominio:** `graphic-design`
- **Propósito/trigger real:** Design motion graphics and UI animations — microinteractions, transitions, Lottie, CSS animations — with explicit timing, easing, choreography, and performance rules.
- **Estado actual:** **partial**; evidencia: no hay maturity válida; se clasifica parcial
- **Prioridad:** **P3**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; criterios de cierre en el cuerpo.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; reglas de permisos; fixturesPath en frontmatter; stopCondition en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, reglas de permisos en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** siguiente skill/usuario según Provenance; dependencias explícitas no declaradas.
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### graphic-design-packaging

- **Path canónico:** `.agents/skills/graphic-design/graphic-design-packaging/SKILL.md`
- **Dominio:** `graphic-design`
- **Propósito/trigger real:** Design physical packaging — dielines, structure, materials, regulatory labels — with production-ready specifications.
- **Estado actual:** **partial**; evidencia: no hay maturity válida; se clasifica parcial
- **Prioridad:** **P3**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; criterios de cierre en el cuerpo.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos; fixturesPath en frontmatter; stopCondition en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** siguiente skill/usuario según Provenance; dependencias explícitas no declaradas.
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### graphic-design-photo-direction

- **Path canónico:** `.agents/skills/graphic-design/graphic-design-photo-direction/SKILL.md`
- **Dominio:** `graphic-design`
- **Propósito/trigger real:** Direct photography and image retouching — art direction, lighting, composition, color grading, and post-production workflows for brand and product imagery.
- **Estado actual:** **partial**; evidencia: no hay maturity válida; se clasifica parcial
- **Prioridad:** **P3**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; criterios de cierre en el cuerpo.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos; fixturesPath en frontmatter; stopCondition en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** siguiente skill/usuario según Provenance; dependencias explícitas no declaradas.
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### graphic-design-project-management

- **Path canónico:** `.agents/skills/graphic-design/graphic-design-project-management/SKILL.md`
- **Dominio:** `graphic-design`
- **Propósito/trigger real:** Manage graphic design projects — briefs, iterations, reviews, asset handoff, versioning, and delivery — with explicit scope, timelines, and quality gates.
- **Estado actual:** **experimental**; evidencia: frontmatter maturity: experimental
- **Prioridad:** **P3**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### graphic-design-tools

- **Path canónico:** `.agents/skills/graphic-design/graphic-design-tools/SKILL.md`
- **Dominio:** `graphic-design`
- **Propósito/trigger real:** Connect graphic design tools — Figma, Adobe Creative Cloud, Canva, and local production tools — to agent workflows with explicit authentication, scopes, and safety boundaries.
- **Estado actual:** **experimental**; evidencia: frontmatter maturity: experimental
- **Prioridad:** **P3**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, reglas de permisos, fixturesPath en frontmatter en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### api-contracts

- **Path canónico:** `.agents/skills/integrations/api-contracts/SKILL.md`
- **Dominio:** `integrations`
- **Propósito/trigger real:** Define the request and response contracts, versioning rules, compatibility boundaries, OpenAPI/JSON Schema, and breaking change detection for APIs — with explicit consumer obligations.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P2**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** timeout/deadline explícito; fallback o recuperación; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar timeout/deadline explícito, fallback o recuperación, fixturesPath en frontmatter en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### auth

- **Path canónico:** `.agents/skills/integrations/auth/SKILL.md`
- **Dominio:** `integrations`
- **Propósito/trigger real:** Design authentication and authorization as a small, explicit seam — with OAuth2/OIDC, MFA, passkeys, JWT, session management, and clear caller and operator responsibilities.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P2**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; política de reintentos/cancelación; fallback o recuperación
- **Qué actualizaría exactamente:** Completar idempotencia explícita, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### browser-automation

- **Path canónico:** `.agents/skills/integrations/browser-automation/SKILL.md`
- **Dominio:** `integrations`
- **Propósito/trigger real:** Automate browser and computer-use tasks with a safety rail: declarative page objectives, Playwright-based execution, human review gates for irreversible actions, and screenshots as verifiable evidence.
- **Estado actual:** **experimental**; evidencia: frontmatter maturity: experimental
- **Prioridad:** **P0**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** webapp-testing,qa-security-testing.
- **Tendencia 2026 que justifica el cambio:** 2026: least-agency, prompt-injection resistance, auditable approvals and replayable safety fixtures.

### issue-operations

- **Path canónico:** `.agents/skills/integrations/issue-operations/SKILL.md`
- **Dominio:** `integrations`
- **Propósito/trigger real:** Manage issue tracker operations with scoped target resolution, duplicate checks, mutation evidence, and rollback notes for create, update, comment, label, link, assign, and close actions.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P2**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; fallback o recuperación; reglas de permisos
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, fallback o recuperación, reglas de permisos en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** siguiente skill/usuario según Provenance; dependencias explícitas no declaradas.
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### payments

- **Path canónico:** `.agents/skills/integrations/payments/SKILL.md`
- **Dominio:** `integrations`
- **Propósito/trigger real:** Design payment flows as a high-trust seam with explicit failure, reconciliation, webhooks, idempotency, PCI DSS, and rollback posture — with Stripe, Adyen, or equivalent.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P2**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** timeout/deadline explícito; reglas de permisos
- **Qué actualizaría exactamente:** Completar timeout/deadline explícito, reglas de permisos en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### pr-operations

- **Path canónico:** `.agents/skills/integrations/pr-operations/SKILL.md`
- **Dominio:** `integrations`
- **Propósito/trigger real:** Manage pull request operations with branch, diff, validation, reviewer, label, comment, and publication evidence while keeping merge decisions explicit.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P2**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** siguiente skill/usuario según Provenance; dependencias explícitas no declaradas.
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### search

- **Path canónico:** `.agents/skills/integrations/search/SKILL.md`
- **Dominio:** `integrations`
- **Propósito/trigger real:** Design search behavior, indexing, relevance, and retrieval seams — with Elasticsearch, Algolia, Meilisearch, OpenSearch, synonyms, ranking, analytics, and autocomplete.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P2**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### iot-embedded

- **Path canónico:** `.agents/skills/iot/iot-embedded/SKILL.md`
- **Dominio:** `iot`
- **Propósito/trigger real:** Design embedded/IoT systems — firmware, sensors, edge computing, device connectivity, OTA updates — with reliability, security, and constrained resource awareness.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P3**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; fallback o recuperación; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, fallback o recuperación, reglas de permisos en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### loop-engineering

- **Path canónico:** `.agents/skills/loop/loop-engineering/SKILL.md`
- **Dominio:** `loop`
- **Propósito/trigger real:** Design bounded agent loops with termination contracts, progress detection, verification outside the model, and escalation policy — so loops end with a verdict, not a timeout.
- **Estado actual:** **experimental**; evidencia: frontmatter maturity: experimental
- **Prioridad:** **P0**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; fallback o recuperación; reglas de permisos
- **Qué actualizaría exactamente:** Completar idempotencia explícita, fallback o recuperación, reglas de permisos en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: least-agency, prompt-injection resistance, auditable approvals and replayable safety fixtures.

### retry-backoff

- **Path canónico:** `.agents/skills/loop/retry-backoff/SKILL.md`
- **Dominio:** `loop`
- **Propósito/trigger real:** Retry-with-backoff patterns for agent actions: exponential backoff with jitter, idempotency keys, circuit breakers, and a retry decision table — retry tool errors, never retry hallucinated calls.
- **Estado actual:** **experimental**; evidencia: frontmatter maturity: experimental
- **Prioridad:** **P1**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** fallback o recuperación; reglas de permisos
- **Qué actualizaría exactamente:** Completar fallback o recuperación, reglas de permisos en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** loop-budget.
- **Tendencia 2026 que justifica el cambio:** 2026: evidence-based evals, bounded workflows, provenance and resilient agent handoffs.

### math-computation-reproducible

- **Path canónico:** `.agents/skills/math/math-computation-reproducible/SKILL.md`
- **Dominio:** `math`
- **Propósito/trigger real:** Make mathematical computations reproducible — SymPy, Mathematica, Magma, Sage, Julia — with versioned environments (Docker/Conda/Nix), scripts, and result archival.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P3**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### math-computational

- **Path canónico:** `.agents/skills/math/math-computational/SKILL.md`
- **Dominio:** `math`
- **Propósito/trigger real:** Solve numerical and symbolic math problems (root finding, integration, ODEs, symbolic manipulation) with stable algorithms and explicit error analysis.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P3**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### math-cryptography

- **Path canónico:** `.agents/skills/math/math-cryptography/SKILL.md`
- **Dominio:** `math`
- **Propósito/trigger real:** Analyse cryptographic constructions — symmetric, asymmetric, hashing, MACs, zero-knowledge — with security reductions, hardness assumptions, and attack analysis.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P3**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### math-formal-proof

- **Path canónico:** `.agents/skills/math/math-formal-proof/SKILL.md`
- **Dominio:** `math`
- **Propósito/trigger real:** Develop formal mathematical proofs in proof assistants (Lean 4, Coq, Isabelle, Agda) with literate programming, tactic-driven construction, and verification.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P3**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### math-grant-structure

- **Path canónico:** `.agents/skills/math/math-grant-structure/SKILL.md`
- **Dominio:** `math`
- **Propósito/trigger real:** Structure mathematics grant proposals (NSF, ERC, Simons, MSCA) — aims, broader impacts, budget, timeline, reviewer expectations — with concrete templates.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P3**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### math-linear-algebra

- **Path canónico:** `.agents/skills/math/math-linear-algebra/SKILL.md`
- **Dominio:** `math`
- **Propósito/trigger real:** Solve and analyse linear algebra problems — matrix decompositions (LU, QR, SVD, eigendecomposition), linear systems, and applications in ML, graphics, and optimisation.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P3**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### math-literature-track

- **Path canónico:** `.agents/skills/math/math-literature-track/SKILL.md`
- **Dominio:** `math`
- **Propósito/trigger real:** Track mathematics literature across arXiv, MathSciNet, zbMATH, journal alerts, and citation graphs to keep a researcher current without drowning in papers.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P3**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### math-optimization

- **Path canónico:** `.agents/skills/math/math-optimization/SKILL.md`
- **Dominio:** `math`
- **Propósito/trigger real:** Formulate and solve optimization problems (linear, convex, non-convex, combinatorial) — model, choose solver, verify optimality, report sensitivity.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P3**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### math-paper-collaboration

- **Path canónico:** `.agents/skills/math/math-paper-collaboration/SKILL.md`
- **Dominio:** `math`
- **Propósito/trigger real:** Manage mathematical paper collaboration — Overleaf / GitHub / arXiv integration, citation tracking, version control, reproducible computation links, and co-author coordination.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P3**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### math-presentation-beamer

- **Path canónico:** `.agents/skills/math/math-presentation-beamer/SKILL.md`
- **Dominio:** `math`
- **Propósito/trigger real:** Design mathematics presentations — Beamer slides with TikZ diagrams, colour accessibility, speaker notes, and audience-level adjustments — for seminars, conferences, or lectures.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P3**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### math-probability-models

- **Path canónico:** `.agents/skills/math/math-probability-models/SKILL.md`
- **Dominio:** `math`
- **Propósito/trigger real:** Build probability models — distributions, stochastic processes (Markov, Brownian, Poisson), inference — with explicit assumptions and sanity checks.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P3**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### math-pure-proofs

- **Path canónico:** `.agents/skills/math/math-pure-proofs/SKILL.md`
- **Dominio:** `math`
- **Propósito/trigger real:** Write and verify pure-math proofs (number theory, algebra, analysis, combinatorics) with rigorous step-by-step reasoning and explicit proof strategies.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P3**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### math-teaching-problem-set

- **Path canónico:** `.agents/skills/math/math-teaching-problem-set/SKILL.md`
- **Dominio:** `math`
- **Propósito/trigger real:** Design and grade math problem sets and exams — difficulty progression, rubric, anti-cheating variants, accessibility, and LaTeX layout.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P3**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### networking-protocols

- **Path canónico:** `.agents/skills/networking/networking-protocols/SKILL.md`
- **Dominio:** `networking`
- **Propósito/trigger real:** Analyze network protocols — packet formats, handshakes, congestion control, routing, and transport behavior — with explicit timing and failure assumptions.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P3**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; fallback o recuperación; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, fallback o recuperación, reglas de permisos, fixturesPath en frontmatter en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### networking-security

- **Path canónico:** `.agents/skills/networking/networking-security/SKILL.md`
- **Dominio:** `networking`
- **Propósito/trigger real:** Design network security — segmentation, firewalls, VPNs, TLS, authentication, and threat boundaries — with explicit trust zones.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P1**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: evidence-based evals, bounded workflows, provenance and resilient agent handoffs.

### networking

- **Path canónico:** `.agents/skills/networking/networking/SKILL.md`
- **Dominio:** `networking`
- **Propósito/trigger real:** Design and analyze network infrastructure — TCP/IP, routing, DNS, load balancing, firewalls, VPNs, network security — with explicit assumptions about latency, bandwidth, and failure modes.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P3**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### os-kernel

- **Path canónico:** `.agents/skills/os/os-kernel/SKILL.md`
- **Dominio:** `os`
- **Propósito/trigger real:** Design and analyze operating system internals — process management, memory management, file systems, scheduling, system calls, concurrency — with explicit resource accounting and failure boundaries.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P3**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### os-memory

- **Path canónico:** `.agents/skills/os/os-memory/SKILL.md`
- **Dominio:** `os`
- **Propósito/trigger real:** Design operating system memory systems — virtual memory, paging, allocation, swapping, and protection — with explicit resource accounting and locality assumptions.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P1**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: evidence-based evals, bounded workflows, provenance and resilient agent handoffs.

### os-processes

- **Path canónico:** `.agents/skills/os/os-processes/SKILL.md`
- **Dominio:** `os`
- **Propósito/trigger real:** Design operating system process management — scheduling, signals, process states, concurrency, and inter-process communication — with explicit isolation boundaries.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P3**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### physics-astro

- **Path canónico:** `.agents/skills/physics/physics-astro/SKILL.md`
- **Dominio:** `physics`
- **Propósito/trigger real:** Model astrophysical systems — stellar structure, orbital dynamics, cosmology, gravitational waves — with physical scales, order-of-magnitude estimates, and scaling laws.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P3**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### physics-career-postdoc

- **Path canónico:** `.agents/skills/physics/physics-career-postdoc/SKILL.md`
- **Dominio:** `physics`
- **Propósito/trigger real:** Navigate physics career transitions — postdoc applications, faculty applications, letters of recommendation, research statements, teaching statements, grant applications (NSF CAREER, DOE, ERC, Simons), and negotiation.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P3**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### physics-classical

- **Path canónico:** `.agents/skills/physics/physics-classical/SKILL.md`
- **Dominio:** `physics`
- **Propósito/trigger real:** Solve classical mechanics problems — Newton's laws, Lagrangian, Hamiltonian, rigid body, orbital — with free-body diagrams, energy accounting, and dimensional checks.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P3**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### physics-data-analysis-root

- **Path canónico:** `.agents/skills/physics/physics-data-analysis-root/SKILL.md`
- **Dominio:** `physics`
- **Propósito/trigger real:** Analyse experimental physics data with ROOT, pandas, uproot, NumPy — calibration, systematic errors, statistical inference, result archival — with reproducible scripts.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P3**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### physics-experimental-notebook

- **Path canónico:** `.agents/skills/physics/physics-experimental-notebook/SKILL.md`
- **Dominio:** `physics`
- **Propósito/trigger real:** Maintain experimental physics lab notebooks — measurements, calibration, error analysis, FAIR data principles, reproducibility — with digital and physical structure.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P3**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### physics-literature-search

- **Path canónico:** `.agents/skills/physics/physics-literature-search/SKILL.md`
- **Dominio:** `physics`
- **Propósito/trigger real:** Track physics literature — arXiv (hep-th, cond-mat, astro-ph, gr-qc, quant-ph, nucl-th, physics.*), INSPIRE-HEP, NASA ADS, Web of Science, citation alerts — with domain filters.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P3**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### physics-quantum

- **Path canónico:** `.agents/skills/physics/physics-quantum/SKILL.md`
- **Dominio:** `physics`
- **Propósito/trigger real:** Model quantum systems (states, operators, measurement, entanglement) and perform calculations using Dirac notation, with checks against limits and known results.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P3**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### physics-reproducibility-archive

- **Path canónico:** `.agents/skills/physics/physics-reproducibility-archive/SKILL.md`
- **Dominio:** `physics`
- **Propósito/trigger real:** Make physics research reproducible and archive it — Zenodo DOI, GitHub + container (Docker/Apptainer), data preservation, code review, and open-science compliance for journals and funders.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P3**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### physics-simulation-setup

- **Path canónico:** `.agents/skills/physics/physics-simulation-setup/SKILL.md`
- **Dominio:** `physics`
- **Propósito/trigger real:** Set up reproducible physics simulations — Monte Carlo (GEANT4), molecular dynamics (LAMMPS), DFT (VASP, Quantum ESPRESSO), quantum dynamics (QuTiP) — with containers, parameter files, and verification.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P3**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### physics-talk-design

- **Path canónico:** `.agents/skills/physics/physics-talk-design/SKILL.md`
- **Dominio:** `physics`
- **Propósito/trigger real:** Design physics talks — seminars, conference presentations, posters, public outreach — with audience-level adjustments, timing, visual conventions, and accessibility.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P3**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### physics-thermo

- **Path canónico:** `.agents/skills/physics/physics-thermo/SKILL.md`
- **Dominio:** `physics`
- **Propósito/trigger real:** Model thermodynamic systems — first and second law, heat engines, entropy, phase transitions — with energy accounting and efficiency bounds.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P3**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### physics-writing-revtex

- **Path canónico:** `.agents/skills/physics/physics-writing-revtex/SKILL.md`
- **Dominio:** `physics`
- **Propósito/trigger real:** Write physics papers using RevTeX / APS / IOP / AIP formatting, with figure conventions, citation styles, and submission package preparation.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P3**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### brainstorming

- **Path canónico:** `.agents/skills/product/brainstorming/SKILL.md`
- **Dominio:** `product`
- **Propósito/trigger real:** Facilitate structured, inclusive brainstorming that turns an ambiguous problem into prioritized, testable ideas.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P3**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### prod-ab-testing

- **Path canónico:** `.agents/skills/product/prod-ab-testing/SKILL.md`
- **Dominio:** `product`
- **Propósito/trigger real:** Design A/B tests — hypothesis, control/treatment, randomization, metrics, statistical power, duration — with valid inference and rollback rules.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P3**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### prod-okr-planning

- **Path canónico:** `.agents/skills/product/prod-okr-planning/SKILL.md`
- **Dominio:** `product`
- **Propósito/trigger real:** Design OKR cycles — Objectives, Key Results, initiatives — with measurable outcomes, quarterly cadences, and team alignment.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P3**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### prod-prd-writing

- **Path canónico:** `.agents/skills/product/prod-prd-writing/SKILL.md`
- **Dominio:** `product`
- **Propósito/trigger real:** Write Product Requirement Documents (PRDs) — problem statement, goals, user stories, acceptance criteria, success metrics, timeline — with stakeholder alignment.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P3**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### pro-market-analysis

- **Path canónico:** `.agents/skills/professional/pro-market-analysis/SKILL.md`
- **Dominio:** `professional`
- **Propósito/trigger real:** Conduct professional market research — TAM/SAM/SOM, competitor analysis, pricing, and trend forecasting — with source citation, data quality checks, and decision framing.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P3**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### professional-communication

- **Path canónico:** `.agents/skills/professional/professional-communication/SKILL.md`
- **Dominio:** `professional`
- **Propósito/trigger real:** Improve professional communication — status updates, stakeholder messages, expectations, and escalation — with clarity and precision.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P3**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### professional-project-management

- **Path canónico:** `.agents/skills/professional/professional-project-management/SKILL.md`
- **Dominio:** `professional`
- **Propósito/trigger real:** Manage professional projects — scope, milestones, risks, dependencies, and stakeholder alignment — with explicit planning and tracking artifacts.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P3**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### analyze-artifacts

- **Path canónico:** `.agents/skills/project/analyze-artifacts/SKILL.md`
- **Dominio:** `project`
- **Propósito/trigger real:** Analyze the spec, plan, and ticket artifacts of one work item for consistency: conflicts, gaps, ambiguities, and dead references, each marked [NEEDS CLARIFICATION] when the artifacts cannot resolve it. Use when a spec and its tickets drifted apart, before to-tickets slices work, or when review-pr needs a spec-side verdict. Never edits the artifacts it reads.
- **Estado actual:** **experimental**; evidencia: frontmatter maturity: experimental
- **Prioridad:** **P1**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: evidence-based evals, bounded workflows, provenance and resilient agent handoffs.

### docs-management

- **Path canónico:** `.agents/skills/project/docs-management/SKILL.md`
- **Dominio:** `project`
- **Propósito/trigger real:** Keep repository documentation, ADRs, and durable context aligned with the current project shape — with explicit consumer rules.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P1**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: evidence-based evals, bounded workflows, provenance and resilient agent handoffs.

### make-project

- **Path canónico:** `.agents/skills/project/make-project/SKILL.md`
- **Dominio:** `project`
- **Propósito/trigger real:** Use when the user wants a new board in GitHub Projects, or another skill needs one — create the project, wire its fields, and preserve tracker semantics.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P0**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: least-agency, prompt-injection resistance, auditable approvals and replayable safety fixtures.

### project-development

- **Path canónico:** `.agents/skills/project/project-development/SKILL.md`
- **Dominio:** `project`
- **Propósito/trigger real:** Evaluate a project's shape, agent fit, and architectural starting point — before the main workflow begins.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P1**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: evidence-based evals, bounded workflows, provenance and resilient agent handoffs.

### project-viability

- **Path canónico:** `.agents/skills/project/project-viability/SKILL.md`
- **Dominio:** `project`
- **Propósito/trigger real:** Evaluate whether a project is viable, functional, and scalable by analyzing its codebase against CONTEXT.md and ADRs. Use when the user wants a structured assessment of project health, architectural soundness, and growth boundaries before committing to further work.
- **Estado actual:** **partial**; evidencia: no hay maturity válida; se clasifica parcial
- **Prioridad:** **P0**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: least-agency, prompt-injection resistance, auditable approvals and replayable safety fixtures.

### spec-driven-development

- **Path canónico:** `.agents/skills/project/spec-driven-development/SKILL.md`
- **Dominio:** `project`
- **Propósito/trigger real:** Run spec-driven development (SDD): a constitution for repo-local rules, then specify, plan, and tasks as durable artifacts, then implement against them - compatible with GitHub Spec Kit's /specify, /plan, /tasks workflow.
- **Estado actual:** **experimental**; evidencia: frontmatter maturity: experimental
- **Prioridad:** **P0**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** to-spec,to-tickets,grill-with-docs,implement,analyze-artifacts,docs-adrs.
- **Tendencia 2026 que justifica el cambio:** 2026: least-agency, prompt-injection resistance, auditable approvals and replayable safety fixtures.

### to-spec

- **Path canónico:** `.agents/skills/project/to-spec/SKILL.md`
- **Dominio:** `project`
- **Propósito/trigger real:** Turn the current conversation into a spec and publish it to the project issue tracker - no interview, just synthesis of what is already known.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P0**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: least-agency, prompt-injection resistance, auditable approvals and replayable safety fixtures.

### to-tickets

- **Path canónico:** `.agents/skills/project/to-tickets/SKILL.md`
- **Dominio:** `project`
- **Propósito/trigger real:** Break a plan, spec, or the current conversation into a set of tracer-bullet tickets, each declaring its blocking edges, and publish the smallest claimable slices.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P0**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** timeout/deadline explícito; fallback o recuperación; reglas de permisos
- **Qué actualizaría exactamente:** Completar timeout/deadline explícito, fallback o recuperación, reglas de permisos en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: least-agency, prompt-injection resistance, auditable approvals and replayable safety fixtures.

### performance-testing

- **Path canónico:** `.agents/skills/qa/performance-testing/SKILL.md`
- **Dominio:** `qa`
- **Propósito/trigger real:** Design and execute performance tests — load, stress, soak, spike — to validate latency, throughput, and resource consumption under realistic conditions.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P2**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### qa-automation

- **Path canónico:** `.agents/skills/qa/qa-automation/SKILL.md`
- **Dominio:** `qa`
- **Propósito/trigger real:** Design and implement automated test suites — unit, integration, e2e — with proper coverage, maintainability, and CI integration.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P2**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### qa-manual-testing

- **Path canónico:** `.agents/skills/qa/qa-manual-testing/SKILL.md`
- **Dominio:** `qa`
- **Propósito/trigger real:** Perform manual test sessions — exploratory checks, edge cases, accessibility, and user-visible regressions — with explicit reproduction notes.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P2**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### qa-security-testing

- **Path canónico:** `.agents/skills/qa/qa-security-testing/SKILL.md`
- **Dominio:** `qa`
- **Propósito/trigger real:** Test security posture — auth flows, authorization boundaries, injection paths, session handling, and misconfiguration checks — with adversarial scenarios.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P1**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: evidence-based evals, bounded workflows, provenance and resilient agent handoffs.

### quant-backtest

- **Path canónico:** `.agents/skills/quant/quant-backtest/SKILL.md`
- **Dominio:** `quant`
- **Propósito/trigger real:** Run a backtest with full audit hygiene — biases, costs, out-of-sample, regime splits — and produce a verdict on whether a strategy is robust.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P3**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### quant-credit-risk

- **Path canónico:** `.agents/skills/quant/quant-credit-risk/SKILL.md`
- **Dominio:** `quant`
- **Propósito/trigger real:** Model credit risk — PD, LGD, EAD, expected loss, loss distribution, credit VaR — with default correlation and portfolio-level risk aggregation.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P3**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### quant-derivatives-pricing

- **Path canónico:** `.agents/skills/quant/quant-derivatives-pricing/SKILL.md`
- **Dominio:** `quant`
- **Propósito/trigger real:** Price and calibrate derivatives (options, exotics, structured products) — Black-Scholes, trees, Monte Carlo — with Greeks, model risk, and calibration validation.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P3**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### quant-factors

- **Path canónico:** `.agents/skills/quant/quant-factors/SKILL.md`
- **Dominio:** `quant`
- **Propósito/trigger real:** Define, test, and stress-test a quantitative factor (momentum, value, carry, quality) with explicit universe, signal, weighting, and statistical checks.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P3**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### quant-market-micro

- **Path canónico:** `.agents/skills/quant/quant-market-micro/SKILL.md`
- **Dominio:** `quant`
- **Propósito/trigger real:** Analyse market microstructure — order book dynamics, price formation, execution costs (slippage, spread, impact), and optimal execution strategies.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P3**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### quant-portfolio-opt

- **Path canónico:** `.agents/skills/quant/quant-portfolio-opt/SKILL.md`
- **Dominio:** `quant`
- **Propósito/trigger real:** Construct and optimise portfolios — mean-variance, Black-Litterman, risk-parity, factor — with explicit objectives, constraints, and robustness checks.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P3**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### quant-risk-modeling

- **Path canónico:** `.agents/skills/quant/quant-risk-modeling/SKILL.md`
- **Dominio:** `quant`
- **Propósito/trigger real:** Model market/portfolio/credit risk (VaR, CVaR, drawdown, stress) with explicit distributions, assumptions, and validation against historical stress events.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P3**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### github-project-analysis

- **Path canónico:** `.agents/skills/research/github-project-analysis/SKILL.md`
- **Dominio:** `research`
- **Propósito/trigger real:** Research comparable projects exclusively on GitHub and analyze their structure, decisions, and reusable patterns for an active project.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P3**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### research-data-archiving

- **Path canónico:** `.agents/skills/research/research-data-archiving/SKILL.md`
- **Dominio:** `research`
- **Propósito/trigger real:** Archive research data — metadata, storage, preservation, provenance, and reuse planning — with reproducibility and access controls.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P3**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### research-literature-review

- **Path canónico:** `.agents/skills/research/research-literature-review/SKILL.md`
- **Dominio:** `research`
- **Propósito/trigger real:** Review research literature — search strategy, screening, synthesis, citation tracking, and evidence grading — with transparent inclusion criteria.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P1**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: evidence-based evals, bounded workflows, provenance and resilient agent handoffs.

### scientific-hypothesis

- **Path canónico:** `.agents/skills/research/scientific-hypothesis/SKILL.md`
- **Dominio:** `research`
- **Propósito/trigger real:** Formulate testable scientific hypotheses — null/alternative, variables, controls, falsifiability — with explicit variables and statistical plan.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P3**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### artifact-handoff

- **Path canónico:** `.agents/skills/routing/artifact-handoff/SKILL.md`
- **Dominio:** `routing`
- **Propósito/trigger real:** Transfer structured artifacts between Skills and sessions — with explicit provenance and consumer expectations.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P1**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: evidence-based evals, bounded workflows, provenance and resilient agent handoffs.

### ask-to

- **Path canónico:** `.agents/skills/routing/ask-to/SKILL.md`
- **Dominio:** `routing`
- **Propósito/trigger real:** Ask which skill or flow fits your situation. A router over the skills in this repo that recommends the next step after governance preflight.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P1**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; reglas de permisos
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, reglas de permisos en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** context-pack.
- **Tendencia 2026 que justifica el cambio:** 2026: evidence-based evals, bounded workflows, provenance and resilient agent handoffs.

### capability-router

- **Path canónico:** `.agents/skills/routing/capability-router/SKILL.md`
- **Dominio:** `routing`
- **Propósito/trigger real:** Route work to the best matching Skill using declared capabilities and compatibility — with explicit selection rules.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P1**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: evidence-based evals, bounded workflows, provenance and resilient agent handoffs.

### context-pack

- **Path canónico:** `.agents/skills/routing/context-pack/SKILL.md`
- **Dominio:** `routing`
- **Propósito/trigger real:** Build a minimal fresh context pack with ordered reads and provenance — for scoped, high-signal handoff.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P1**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: evidence-based evals, bounded workflows, provenance and resilient agent handoffs.

### grill-me

- **Path canónico:** `.agents/skills/routing/grill-me/SKILL.md`
- **Dominio:** `routing`
- **Propósito/trigger real:** A relentless interview to sharpen a plan or design.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P1**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: evidence-based evals, bounded workflows, provenance and resilient agent handoffs.

### grill-with-docs

- **Path canónico:** `.agents/skills/routing/grill-with-docs/SKILL.md`
- **Dominio:** `routing`
- **Propósito/trigger real:** A relentless interview to sharpen a plan or design, while creating docs (ADRs and glossary) as we go.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P0**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: least-agency, prompt-injection resistance, auditable approvals and replayable safety fixtures.

### grill

- **Path canónico:** `.agents/skills/routing/grill/SKILL.md`
- **Dominio:** `routing`
- **Propósito/trigger real:** >-
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P1**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: evidence-based evals, bounded workflows, provenance and resilient agent handoffs.

### grilling

- **Path canónico:** `.agents/skills/routing/grilling/SKILL.md`
- **Dominio:** `routing`
- **Propósito/trigger real:** Grill the user relentlessly about a plan, decision, or idea. Use when the user wants to stress-test their thinking, or use docs to sharpen the premise before acting.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P1**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: evidence-based evals, bounded workflows, provenance and resilient agent handoffs.

### handoff

- **Path canónico:** `.agents/skills/routing/handoff/SKILL.md`
- **Dominio:** `routing`
- **Propósito/trigger real:** Compact the current conversation into a handoff document for another agent to pick up — with explicit continuity and ownership notes.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P0**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** timeout/deadline explícito; fallback o recuperación; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar timeout/deadline explícito, fallback o recuperación, reglas de permisos, fixturesPath en frontmatter en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: least-agency, prompt-injection resistance, auditable approvals and replayable safety fixtures.

### knowledge-curator

- **Path canónico:** `.agents/skills/routing/knowledge-curator/SKILL.md`
- **Dominio:** `routing`
- **Propósito/trigger real:** Keep context, ADRs, registry entries, and research coherent over time — with refresh and provenance discipline.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P0**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: least-agency, prompt-injection resistance, auditable approvals and replayable safety fixtures.

### parallel-issue-fleet

- **Path canónico:** `.agents/skills/routing/parallel-issue-fleet/SKILL.md`
- **Dominio:** `routing`
- **Propósito/trigger real:** Orchestrate a dependency-aware fleet of issue agents in isolated local worktrees or dedicated VM-pool slots, with portable worker profiles, durable checkpoints, bounded concurrency, validation, and owned-resource cleanup.
- **Estado actual:** **experimental**; evidencia: frontmatter maturity: experimental
- **Prioridad:** **P0**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; fallback o recuperación; provenance; reglas de permisos
- **Qué actualizaría exactamente:** Completar idempotencia explícita, fallback o recuperación, provenance, reglas de permisos en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** to-tickets,implement,publish-open-pr,review-pr,ship-subissue.
- **Tendencia 2026 que justifica el cambio:** 2026: least-agency, prompt-injection resistance, auditable approvals and replayable safety fixtures.

### publish-open-pr

- **Path canónico:** `.agents/skills/routing/publish-open-pr/SKILL.md`
- **Dominio:** `routing`
- **Propósito/trigger real:** Use when the user wants to publish a finished subissue as an open GitHub pull request from an already-prepared issue branch — with scoped, auditable publication.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P0**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** timeout/deadline explícito; fallback o recuperación; reglas de permisos
- **Qué actualizaría exactamente:** Completar timeout/deadline explícito, fallback o recuperación, reglas de permisos en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: least-agency, prompt-injection resistance, auditable approvals and replayable safety fixtures.

### ship-subissue

- **Path canónico:** `.agents/skills/routing/ship-subissue/SKILL.md`
- **Dominio:** `routing`
- **Propósito/trigger real:** Use when a finished subissue already has a clean PR and you need to merge it, mark it as completed, and close the linked issue — with release discipline.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P0**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** timeout/deadline explícito; fallback o recuperación; reglas de permisos
- **Qué actualizaría exactamente:** Completar timeout/deadline explícito, fallback o recuperación, reglas de permisos en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: least-agency, prompt-injection resistance, auditable approvals and replayable safety fixtures.

### triage

- **Path canónico:** `.agents/skills/routing/triage/SKILL.md`
- **Dominio:** `routing`
- **Propósito/trigger real:** Move issues and external PRs through a state machine of triage roles — categorise, verify, grill if needed, and write ag
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P0**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: least-agency, prompt-injection resistance, auditable approvals and replayable safety fixtures.

### wayfinder

- **Path canónico:** `.agents/skills/routing/wayfinder/SKILL.md`
- **Dominio:** `routing`
- **Propósito/trigger real:** Plan a huge chunk of work — more than one agent session can hold — as a map of decision tickets on your issue tracker, with staged decomposition and durable scope boundaries.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P1**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: evidence-based evals, bounded workflows, provenance and resilient agent handoffs.

### work-item-router

- **Path canónico:** `.agents/skills/routing/work-item-router/SKILL.md`
- **Dominio:** `routing`
- **Propósito/trigger real:** Force reading the canonical work-item governance index before routing specs, tickets, project boards, or publication flows.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P1**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: evidence-based evals, bounded workflows, provenance and resilient agent handoffs.

### worktree-swarm

- **Path canónico:** `.agents/skills/routing/worktree-swarm/SKILL.md`
- **Dominio:** `routing`
- **Propósito/trigger real:** Create isolated local git worktrees and launch one local coding agent per open GitHub issue in the current repository.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P0**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; política de reintentos/cancelación; fallback o recuperación; provenance; reglas de permisos
- **Qué actualizaría exactamente:** Completar idempotencia explícita, política de reintentos/cancelación, fallback o recuperación, provenance en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: least-agency, prompt-injection resistance, auditable approvals and replayable safety fixtures.

### cloud-security

- **Path canónico:** `.agents/skills/sec/cloud-security/SKILL.md`
- **Dominio:** `sec`
- **Propósito/trigger real:** Cloud security (AWS, GCP, Azure, IAM, KMS, security groups, compliance, posture management)
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P1**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: evidence-based evals, bounded workflows, provenance and resilient agent handoffs.

### compliance

- **Path canónico:** `.agents/skills/sec/compliance/SKILL.md`
- **Dominio:** `sec`
- **Propósito/trigger real:** Compliance (SOC2, ISO27001, GDPR, HIPAA, PCI DSS, audits, evidence, remediation)
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P1**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: evidence-based evals, bounded workflows, provenance and resilient agent handoffs.

### container-security

- **Path canónico:** `.agents/skills/sec/container-security/SKILL.md`
- **Dominio:** `sec`
- **Propósito/trigger real:** Container security (Docker, Kubernetes, image scanning, runtime security, pod security policies)
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P1**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: evidence-based evals, bounded workflows, provenance and resilient agent handoffs.

### incident-forensics

- **Path canónico:** `.agents/skills/sec/incident-forensics/SKILL.md`
- **Dominio:** `sec`
- **Propósito/trigger real:** Incident forensics (evidence collection, timeline reconstruction, root cause, reporting)
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P1**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: evidence-based evals, bounded workflows, provenance and resilient agent handoffs.

### sec-cryptography-applied

- **Path canónico:** `.agents/skills/sec/sec-cryptography-applied/SKILL.md`
- **Dominio:** `sec`
- **Propósito/trigger real:** Apply cryptography — encryption at rest / in transit, digital signatures, key management, MACs, TLS/PKI, HSM, secure enclaves — with implementation guidance and anti-patterns.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P1**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: evidence-based evals, bounded workflows, provenance and resilient agent handoffs.

### sec-privacy-engineering

- **Path canónico:** `.agents/skills/sec/sec-privacy-engineering/SKILL.md`
- **Dominio:** `sec`
- **Propósito/trigger real:** Design privacy-protecting systems — GDPR / CCPA / HIPAA compliance, data minimisation, anonymisation, consent management, data retention, breach notification — with explicit privacy impact assessments.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P1**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: evidence-based evals, bounded workflows, provenance and resilient agent handoffs.

### sec-security-audit

- **Path canónico:** `.agents/skills/sec/sec-security-audit/SKILL.md`
- **Dominio:** `sec`
- **Propósito/trigger real:** Audit software/security posture — code review, dependency scanning, secret detection, access control, audit logging — with explicit findings and remediation priorities.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P1**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: evidence-based evals, bounded workflows, provenance and resilient agent handoffs.

### sec-threat-modeling

- **Path canónico:** `.agents/skills/sec/sec-threat-modeling/SKILL.md`
- **Dominio:** `sec`
- **Propósito/trigger real:** Design and document threat models for software / systems — assets, threats, vulnerabilities, mitigations — using STRIDE or ATT&CK frameworks.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P1**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: evidence-based evals, bounded workflows, provenance and resilient agent handoffs.

### secret-management-security

- **Path canónico:** `.agents/skills/sec/secret-management-security/SKILL.md`
- **Dominio:** `sec`
- **Propósito/trigger real:** Secrets management (Vault, KMS, rotation, injection, external secrets operator)
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P1**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: evidence-based evals, bounded workflows, provenance and resilient agent handoffs.

### supply-chain-security

- **Path canónico:** `.agents/skills/sec/supply-chain-security/SKILL.md`
- **Dominio:** `sec`
- **Propósito/trigger real:** Design supply chain security — SBOM, Sigstore, SLSA, provenance, signing — with explicit trust tiers, artifact verification, and incident response for compromised dependencies.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P1**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: evidence-based evals, bounded workflows, provenance and resilient agent handoffs.

### zero-trust

- **Path canónico:** `.agents/skills/sec/zero-trust/SKILL.md`
- **Dominio:** `sec`
- **Propósito/trigger real:** Design zero trust architecture — identity, per-request auth, microsegmentation, policy — with explicit trust tiers, continuous verification, and least-privilege enforcement.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P1**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: evidence-based evals, bounded workflows, provenance and resilient agent handoffs.

### evaluate-skill

- **Path canónico:** `.agents/skills/skill-dev/evaluate-skill/SKILL.md`
- **Dominio:** `skill-dev`
- **Propósito/trigger real:** Evaluate a Skill against fixed scenarios for routing, completion, and artifact validity.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P1**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: evidence-based evals, bounded workflows, provenance and resilient agent handoffs.

### lockfile-maintenance

- **Path canónico:** `.agents/skills/skill-dev/lockfile-maintenance/SKILL.md`
- **Dominio:** `skill-dev`
- **Propósito/trigger real:** Maintain the skills lockfile by detecting missing, stale, extra, or mismatched skill entries and updating hashes only after the corresponding SKILL.md files are resolved.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P0**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** siguiente skill/usuario según Provenance; dependencias explícitas no declaradas.
- **Tendencia 2026 que justifica el cambio:** 2026: least-agency, prompt-injection resistance, auditable approvals and replayable safety fixtures.

### rule-cataloger

- **Path canónico:** `.agents/skills/skill-dev/rule-cataloger/SKILL.md`
- **Dominio:** `skill-dev`
- **Propósito/trigger real:** Extract and classify rules across Skills by type, frequency, and application area; use when auditing the repository's shared guidance.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P1**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: evidence-based evals, bounded workflows, provenance and resilient agent handoffs.

### side-effect-auditor

- **Path canónico:** `.agents/skills/skill-dev/side-effect-auditor/SKILL.md`
- **Dominio:** `skill-dev`
- **Propósito/trigger real:** Audit skill side-effect, risk, trust tier, dependency, and boundary metadata against the actual workflow so mutating skills declare their operational authority honestly.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P1**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** siguiente skill/usuario según Provenance; dependencias explícitas no declaradas.
- **Tendencia 2026 que justifica el cambio:** 2026: evidence-based evals, bounded workflows, provenance and resilient agent handoffs.

### skill-audit

- **Path canónico:** `.agents/skills/skill-dev/skill-audit/SKILL.md`
- **Dominio:** `skill-dev`
- **Propósito/trigger real:** Audit the Skills bundle, lockfile, symlink parity, and contract drift — with actionable maintenance output.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P0**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: least-agency, prompt-injection resistance, auditable approvals and replayable safety fixtures.

### skill-creator

- **Path canónico:** `.agents/skills/skill-dev/skill-creator/SKILL.md`
- **Dominio:** `skill-dev`
- **Propósito/trigger real:** Interactive interview and collaborative design tool that helps users define, research, name, generate, and validate complete Codex skills with SKILL.md, scripts, references, assets, ADRs, and traceability.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P0**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: least-agency, prompt-injection resistance, auditable approvals and replayable safety fixtures.

### skill-dependency-graph

- **Path canónico:** `.agents/skills/skill-dev/skill-dependency-graph/SKILL.md`
- **Dominio:** `skill-dev`
- **Propósito/trigger real:** Build a dependency graph that exposes central Skills, cycles, and unnecessary coupling — use when analyzing Skill modularity.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P1**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: evidence-based evals, bounded workflows, provenance and resilient agent handoffs.

### skill-diff-analyzer

- **Path canónico:** `.agents/skills/skill-dev/skill-diff-analyzer/SKILL.md`
- **Dominio:** `skill-dev`
- **Propósito/trigger real:** Compare Skill versions and explain contract, dependency, and behavior impact — use when assessing changes between two Skills.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P1**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: evidence-based evals, bounded workflows, provenance and resilient agent handoffs.

### skill-optimizer

- **Path canónico:** `.agents/skills/skill-dev/skill-optimizer/SKILL.md`
- **Dominio:** `skill-dev`
- **Propósito/trigger real:** Optimize a quirk Skill's model-facing description against routing fixtures with a propose-only reflective loop. Use when a Skill routes wrong, fires too rarely or too often, or when evaluate-skill or skill-quality-gate reports a routing regression. Emits a diff-shaped proposal with (skill, version, fixture) evidence; the human applies it. Not for body edits or metadata repair.
- **Estado actual:** **experimental**; evidencia: frontmatter maturity: experimental
- **Prioridad:** **P1**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: evidence-based evals, bounded workflows, provenance and resilient agent handoffs.

### skill-performance-metrics

- **Path canónico:** `.agents/skills/skill-dev/skill-performance-metrics/SKILL.md`
- **Dominio:** `skill-dev`
- **Propósito/trigger real:** Summarize Skill execution duration, success rate, and available run evidence — use when measuring Skill performance from logs and records.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P1**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: evidence-based evals, bounded workflows, provenance and resilient agent handoffs.

### skill-promoter

- **Path canónico:** `.agents/skills/skill-dev/skill-promoter/SKILL.md`
- **Dominio:** `skill-dev`
- **Propósito/trigger real:** Promote validated experimental skills from the sandbox to the canonical skills bundle.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P0**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: least-agency, prompt-injection resistance, auditable approvals and replayable safety fixtures.

### skill-quality-gate

- **Path canónico:** `.agents/skills/skill-dev/skill-quality-gate/SKILL.md`
- **Dominio:** `skill-dev`
- **Propósito/trigger real:** Run and interpret the skill bundle quality gate across schema, lockfile, semantic, routing, placeholder, rule, metadata, and side-effect checks before promotion or publication.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P1**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** siguiente skill/usuario según Provenance; dependencias explícitas no declaradas.
- **Tendencia 2026 que justifica el cambio:** 2026: evidence-based evals, bounded workflows, provenance and resilient agent handoffs.

### skill-sandbox

- **Path canónico:** `.agents/skills/skill-dev/skill-sandbox/SKILL.md`
- **Dominio:** `skill-dev`
- **Propósito/trigger real:** Create, test, and iterate on experimental skills in an isolated environment without affecting the canonical skills bundle.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P1**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: evidence-based evals, bounded workflows, provenance and resilient agent handoffs.

### skill-template-generator

- **Path canónico:** `.agents/skills/skill-dev/skill-template-generator/SKILL.md`
- **Dominio:** `skill-dev`
- **Propósito/trigger real:** Generate an interactive, contract-complete Skill template in the sandbox — use when starting a new Skill with the lab's scaffolding.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P0**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: least-agency, prompt-injection resistance, auditable approvals and replayable safety fixtures.

### skill-testing-framework

- **Path canónico:** `.agents/skills/skill-dev/skill-testing-framework/SKILL.md`
- **Dominio:** `skill-dev`
- **Propósito/trigger real:** Validate Skill structure, contracts, dependencies, anti-patterns, and isolated execution — use when checking a Skill before promotion.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P0**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: least-agency, prompt-injection resistance, auditable approvals and replayable safety fixtures.

### skill-tutor

- **Path canónico:** `.agents/skills/skill-dev/skill-tutor/SKILL.md`
- **Dominio:** `skill-dev`
- **Propósito/trigger real:** Interactive tutorial that guides users through creating their first quirk skill using structured worksheets and hands-on
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P1**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** siguiente skill/usuario según Provenance; dependencias explícitas no declaradas.
- **Tendencia 2026 que justifica el cambio:** 2026: evidence-based evals, bounded workflows, provenance and resilient agent handoffs.

### workflow-fixture-author

- **Path canónico:** `.agents/skills/skill-dev/workflow-fixture-author/SKILL.md`
- **Dominio:** `skill-dev`
- **Propósito/trigger real:** Author deterministic scenario and behavioral fixtures for skills so routing, contracts, outputs, side effects, and refusal boundaries can be tested before promotion.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P1**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: evidence-based evals, bounded workflows, provenance and resilient agent handoffs.

### writing-great-skills

- **Path canónico:** `.agents/skills/skill-dev/writing-great-skills/SKILL.md`
- **Dominio:** `skill-dev`
- **Propósito/trigger real:** Reference for writing and editing skills well — the vocabulary and principles that make a skill predictable.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P1**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: evidence-based evals, bounded workflows, provenance and resilient agent handoffs.

### interaction-design

- **Path canónico:** `.agents/skills/ux/interaction-design/SKILL.md`
- **Dominio:** `ux`
- **Propósito/trigger real:** Design user interactions — task flows, screen states, transitions, error states, feedback patterns — so the interface guides users predictably.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P3**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### ux-accessibility

- **Path canónico:** `.agents/skills/ux/ux-accessibility/SKILL.md`
- **Dominio:** `ux`
- **Propósito/trigger real:** Design accessible UX — keyboard navigation, focus order, semantics, contrast, and assistive-technology support — with inclusive interaction patterns.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P3**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### ux-prototyping

- **Path canónico:** `.agents/skills/ux/ux-prototyping/SKILL.md`
- **Dominio:** `ux`
- **Propósito/trigger real:** Prototype user experiences — wireframes, interactive mockups, and rapid validation — with explicit experiment goals and iteration criteria.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P3**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### ux-research

- **Path canónico:** `.agents/skills/ux/ux-research/SKILL.md`
- **Dominio:** `ux`
- **Propósito/trigger real:** Conduct user research — interviews, surveys, usability testing, personas, journey mapping — to ground design decisions in real user behavior.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P3**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### web3-consensus

- **Path canónico:** `.agents/skills/web3/web3-consensus/SKILL.md`
- **Dominio:** `web3`
- **Propósito/trigger real:** Analyse and compare consensus mechanisms — PoW, PoS, BFT, DA, based sequencing — with security properties, finality guarantees, MEV, and economic incentive alignment.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P3**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### web3-defi

- **Path canónico:** `.agents/skills/web3/web3-defi/SKILL.md`
- **Dominio:** `web3`
- **Propósito/trigger real:** Analyse DeFi protocols — AMMs, lending, stablecoins, derivatives, intents, solver networks — across protocol mechanics, economic security, MEV protection, and composability risks.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P3**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; política de reintentos/cancelación; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, política de reintentos/cancelación, reglas de permisos, fixturesPath en frontmatter en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### web3-governance

- **Path canónico:** `.agents/skills/web3/web3-governance/SKILL.md`
- **Dominio:** `web3`
- **Propósito/trigger real:** Design and audit on-chain and off-chain governance — token voting, delegation, quadratic voting, timelock, multisig, oSnap, Zodiac, EIP-7702 delegation — with attack vectors and resilience analysis.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P3**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### web3-l2-scaling

- **Path canónico:** `.agents/skills/web3/web3-l2-scaling/SKILL.md`
- **Dominio:** `web3`
- **Propósito/trigger real:** Analyse Layer-2 scaling solutions — Rollups (optimistic, ZK), validiums, based sequencing, shared sequencing — with security assumptions, data availability, and cost trade-offs.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P3**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### web3-smart-contracts

- **Path canónico:** `.agents/skills/web3/web3-smart-contracts/SKILL.md`
- **Dominio:** `web3`
- **Propósito/trigger real:** Design and review smart contracts — security, gas optimization, upgradeability, account abstraction, EIP-7702 — with an adversarial review step.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P3**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### web3-tokenomics

- **Path canónico:** `.agents/skills/web3/web3-tokenomics/SKILL.md`
- **Dominio:** `web3`
- **Propósito/trigger real:** Design token economics — supply, emission, incentives, governance, LST/LRT, restaking, points systems — with economic sustainability checks and adversarial stress tests.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P3**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### xr-development

- **Path canónico:** `.agents/skills/xr/xr-development/SKILL.md`
- **Dominio:** `xr`
- **Propósito/trigger real:** Design and build extended reality (AR/VR/MR) experiences — 3D interaction, spatial computing, headset development, immersive UX — with performance, comfort, and accessibility as first-class concerns.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P3**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### xr-interaction-design

- **Path canónico:** `.agents/skills/xr/xr-interaction-design/SKILL.md`
- **Dominio:** `xr`
- **Propósito/trigger real:** Design XR interactions — spatial input, comfort, locomotion, hand tracking, and feedback — with clear constraints on immersion and usability.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P3**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

### xr-performance

- **Path canónico:** `.agents/skills/xr/xr-performance/SKILL.md`
- **Dominio:** `xr`
- **Propósito/trigger real:** Optimize XR performance — frame rate, motion-to-photon latency, asset budgets, and thermal constraints — with comfort-aware trade-offs.
- **Estado actual:** **stable**; evidencia: frontmatter maturity: stable
- **Prioridad:** **P3**; base: riesgo, efectos laterales y centralidad observables en metadata/nombre.
- **Fortalezas:** propósito explícito; salida declarada; stop condition declarada.
- **Gaps concretos:** idempotencia explícita; timeout/deadline explícito; política de reintentos/cancelación; fallback o recuperación; reglas de permisos; fixturesPath en frontmatter
- **Qué actualizaría exactamente:** Completar idempotencia explícita, timeout/deadline explícito, política de reintentos/cancelación, fallback o recuperación en frontmatter/Contract; añadir fixture negativa y actualizar lockfile/proyecciones sólo mediante scripts.
- **Dependencias/consumidores afectados:** .
- **Tendencia 2026 que justifica el cambio:** 2026: reproducibility, interoperability, accessibility and domain-specific quality baselines.

## Resumen ejecutivo

Se inventariaron **261 skills canónicas** desde el filesystem. La principal fortaleza transversal es la presencia extendida de contratos, provenance y metadatos de evaluación; el principal riesgo transversal es que la declaración de un evaluator/fixture no demuestra ejecución ni cobertura. El plan 2026 del repositorio exige separar PASS, FAIL, BLOCKED y NOT RUN, priorizar least agency, trazabilidad, loops reanudables e idempotencia, y no presentar el backlog como implementación.

### Conteos por prioridad

| Prioridad | Conteo |
|---|---:|
| P0 | 40 |
| P1 | 56 |
| P2 | 42 |
| P3 | 123 |

### Conteos por dominio

| Dominio | Conteo |
|---|---:|
| accessibility | 3 |
| ai | 13 |
| auxiliary | 4 |
| backend | 13 |
| cms | 4 |
| compilers | 3 |
| cs | 4 |
| data | 11 |
| db | 4 |
| delivery | 15 |
| devops | 10 |
| docs | 3 |
| engineering | 3 |
| finance | 3 |
| foundation | 14 |
| frontend | 10 |
| graph | 2 |
| graphic-design | 12 |
| integrations | 7 |
| iot | 1 |
| loop | 2 |
| math | 13 |
| networking | 3 |
| os | 3 |
| physics | 12 |
| product | 4 |
| professional | 3 |
| project | 8 |
| qa | 4 |
| quant | 7 |
| research | 4 |
| routing | 17 |
| sec | 11 |
| skill-dev | 18 |
| ux | 4 |
| web3 | 6 |
| xr | 3 |

### Conteos por madurez

| Estado | Conteo |
|---|---:|
| experimental | 18 |
| partial | 9 |
| stable | 234 |

## Top 25 acciones por impacto/riesgo

1. Ejecutar baseline reproducible: check-all, routing, behavioral, security, traceability y context audit; conservar logs y estados NOT RUN.
2. Añadir fixtures positivas y negativas a routers y gobernanza.
3. Formalizar permisos read/local-write/remote-write/deploy/merge/publication.
4. Requerir aprobación explícita en transiciones privilegiadas.
5. Añadir pruebas de prompt injection en docs, issues, MCP y referencias web.
6. Versionar contratos y schemas sin hacer obligatorios campos bundle-only para clientes externos.
7. Definir run_id, trace_id, attempt y work_item_id en artifacts y telemetry.
8. Añadir idempotency scope y deduplicación a skills mutantes.
9. Añadir timeout, cancelación y bounded retries a loops y flotas.
10. Probar crash/resume, replay y duplicación de side effects.
11. Validar DAGs, ciclos y convergencia determinista de fan-out.
12. Hacer explícitos fallback, escalado humano y estados BLOCKED.
13. Auditar fixtures declaradas contra fixtures realmente existentes.
14. Ejecutar evaluadores y publicar baseline/candidate, no sólo metadata.
15. Añadir traceability requirement → artifact → validation a skills de proyecto y entrega.
16. Redactar secretos y PII en observabilidad, memoria y handoffs.
17. Verificar symlink/path traversal y destinos desconocidos en instaladores.
18. Medir latencia, retries, coste y footprint de contexto antes de optimizar.
19. Mantener compatibility view generada sólo con scripts de sincronización.
20. Introducir pilotos cross-project en TypeScript, Python, ML, IoT y blockchain.
21. Definir owners y consumidores por skill de alta centralidad.
22. Separar stable de experimental en catálogos y release notes.
23. Crear fixtures de accesibilidad, seguridad y no-acción para dominios aplicables.
24. Añadir revisión trimestral de dependencias/protocolos y ruta de deprecación.
25. Cerrar gaps individuales listados arriba por lotes de riesgo, no por reescritura masiva.

## Matriz de cambios por fases

| Fase | Objetivo | Skills afectadas | Gate |
|---|---|---|---|
| W0 | Inventario, lockfile, catálogo, baseline ejecutable | Todas (261) | 100% inventario; PASS/FAIL/BLOCKED/NOT RUN |
| W1 | Contratos, schemas, triggers y fixtures | routing, project, delivery, skill-dev | regresión y no-acción |
| W2 | Least agency, seguridad y supply chain | sec, integrations, platform, skill-dev | cero side effects no autorizados |
| W3 | Contexto, memoria, handoff y provenance | foundation, routing | golden scenarios conservan restricciones |
| W4 | Graphs, loops, retries, replay e idempotencia | graph, loop, fleet, swarm, delivery | no duplicación en crash/resume |
| W5 | Portabilidad e instalación | auxiliary, platform, foundation | install/upgrade idempotentes y rollback |
| W6 | Observabilidad, benchmark y promoción | evaluation, observability, qa | scorecard reproducible |
| W7 | Pilotos cross-project | dominios técnicos | matriz soportada documentada |

## Qué NO cambiaría

- No editaría ningún SKILL.md automáticamente por esta auditoría.
- No cambiaría nombres canónicos, aliases, lockfile o symlinks sin ADR, migración y regeneración oficial.
- No convertiría todas las skills en una plantilla idéntica ni impondría un framework monolítico.
- No declararía PASS basándome sólo en frontmatter o en la existencia de fixtures.
- No añadiría dependencias externas obligatorias sin evidencia de valor y compatibilidad.
- No mezclaría skills estables con experimentales en claims de release.

## Riesgos de migración y orden de ejecución

1. Congelar inventario y registrar commit/Node; ejecutar W0 sin mutaciones.
2. Migrar primero routers, governance, evaluators y quality gates; sus contratos son consumidores centrales.
3. Aplicar seguridad y approval boundaries antes de habilitar loops paralelos o publicación.
4. Migrar context/memory/handoff con redacción y provenance antes de persistir más estado.
5. Añadir idempotencia y replay a loops/graphs; probar crash, timeout, cancelación y overlap.
6. Actualizar fixtures y schemas junto con cada cambio; regenerar lockfile/proyecciones con scripts.
7. Ejecutar gates completos y conservar evidencia; cualquier NOT RUN queda explícito.
8. Pilotar en proyectos representativos, publicar notas de migración y mantener rollback/deprecación.

**Riesgos principales:** cambios de contrato rompen consumidores; campos obligatorios afectan clientes Agent Skills; retries pueden duplicar writes; telemetría puede filtrar secretos; sincronización incorrecta rompe compatibility view; clasificación de madurez puede confundirse con validación funcional.

## Validación de cobertura

- Skills enumeradas en secciones individuales: **261**
- Skills descubiertas por filesystem: **261**
- Resultado: **PASS**
- Ruta del informe: .reports/skills-deep-audit-2026-11-16.md
