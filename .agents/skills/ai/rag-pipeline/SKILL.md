---
name: rag-pipeline
category: skill-dev/sandbox
maturity: stable
version: 1
description: Design RAG pipelines — retrieval, chunking, embedding, reranking, generation — with explicit data flow, latency budgets, and evaluation seams.
capabilities:
  - design retrieval architecture (vector, keyword, hybrid)
  - define chunking strategy (size, overlap, document-aware splitting)
  - select embedding model and dimension budget
  - configure reranking (cross-encoder, late interaction, LLM rerank)
  - orchestrate generation with grounded prompts and citation
outputs:
  - RAG architecture document (components, data flow, latency budget)
  - Chunking and embedding configuration
  - Reranking and generation configuration
  - Evaluation plan (retrieval recall, answer faithfulness, latency)
sideEffects: []
dependencies: []
stopCondition: Architecture documented; chunking and embedding config defined; evaluation plan complete.
risk: medium
trustTier: 3
maxIterations: 6
---

## Contract

- **Input:** corpus description, query patterns, quality requirements, latency target.
- **Output:** RAG architecture + chunking config + reranking config + evaluation plan.
- **Side effects:** none.
- **Dependencies:** vector store, embedding model, reranker, LLM.
- **Stop condition:** architecture saved; chunking and embedding config defined; evaluation plan complete.
- **Risk:** medium — retrieval and generation quality directly affect user trust; requires validation.
- **Boundary:** designs pipeline; does not index data or run inference unless explicitly executed.

# RAG Pipeline Design

Design a **Retrieval-Augmented Generation (RAG) pipeline** — retrieval, chunking, embedding, reranking, generation — with explicit data flow, latency budgets, and evaluation seams.

## Process

### 1. Define retrieval scope
- Document corpus (size, format, update frequency).
- Query patterns (short factual, long analytical, conversational).
- Latency budget per stage (e.g. retrieval < 100ms, generation < 500ms).
- Grounding requirements (citation, quote extraction, provenance).

**Completion criterion:** retrieval scope and latency budget documented.

### 2. Chunking strategy
- Chunk size (tokens / characters); overlap ratio.
- Splitting logic (sentence, paragraph, section-aware, recursive).
- Metadata preservation (document ID, section, page, timestamp).
- Handling of tables, code blocks, and lists.

**Completion criterion:** chunking rules and metadata schema defined.

### 3. Embedding selection
- Model family (open / proprietary, dense / sparse / late interaction).
- Dimension budget and storage cost.
- Normalisation and pooling strategy.
- Batch indexing and update cadence.

**Completion criterion:** embedding model and dimension budget selected.

### 4. Retrieval configuration
- Retrieval mode (vector, keyword, hybrid with RRF or weighted fusion).
- Top-K recall and filtering (date, source, access control).
- Indexing pipeline (batch / streaming, reindex trigger).

**Completion criterion:** retrieval mode and top-K defined.

### 5. Reranking
- Reranker type (cross-encoder, late interaction, LLM rerank).
- Rerank window size (candidates from retrieval).
- Score threshold and fallback behaviour.
- Latency and cost trade-off.

**Completion criterion:** reranking config and fallback behaviour defined.

### 6. Generation orchestration
- Prompt template (system, context injection, query, citation format).
- Context window management (truncation, compression, multi-hop).
- Output contract (grounded answer, citations, confidence).
- Safety filters (hallucination guard, PII redaction).

**Completion criterion:** generation config and output contract defined.

### 7. Evaluation
- Retrieval metrics (Recall@K, MRR, NDCG).
- Generation metrics (faithfulness, answer relevance, citation accuracy).
- Latency and cost tracking.
- Regression suite (eval set with golden answers).

**Completion criterion:** evaluation plan with metrics and regression suite defined.

## Rules

- Rule: treat the corpus as a first-class input; document its schema, freshness, and ownership.
- Rule: keep chunking deterministic so reindexing produces stable results.
- Rule: measure retrieval recall before adding reranking; reranking improves precision but not recall.
- Rule: expose provenance (document, section, page) at every stage for auditability.
- Rule: define fallback behaviour for empty retrieval, failed reranking, and generation errors.
