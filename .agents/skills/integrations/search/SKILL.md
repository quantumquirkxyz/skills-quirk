---
name: search
category: integrations
maturity: stable
version: 2
description: Design search behavior, indexing, relevance, and retrieval seams — with Elasticsearch, Algolia, Meilisearch, OpenSearch, synonyms, ranking, analytics, and autocomplete.
capabilities:
  - design search architecture (full-text, vector, hybrid)
  - plan indexing, synonyms, language analysis, and relevance tuning
  - define ranking, boosting, personalization, and business rules
  - evaluate search observability, analytics, and A/B testing
outputs:
  - Search design document (architecture, indexing, ranking, synonyms, analytics, observability)
sideEffects: []
dependencies: []
stopCondition: Search design complete; indexing and ranking strategy explicit; analytics plan named.
risk: low
trustTier: 1
maxIterations: 6
---

# Search

Use this skill when the system needs retrieval that users can trust. It should define the retrieval seam, indexing shape, relevance controls, and observability so search stays understandable and adjustable.

## Contract

- Input: search brief, retrieval context, corpus characteristics, and relevance constraints.
- Output: search design covering architecture, indexing, ranking, synonyms, analytics, and observability.
- Scope: design search behavior, not the full implementation.
- Rule: keep retrieval and presentation concerns separate.
- Rule: make indexing and ranking tradeoffs explicit.
- Rule: note how relevance can be tuned without rewriting the whole flow.

## Process

### 1. Choose the search architecture

- **Full-text search:** Elasticsearch, OpenSearch, Meilisearch; inverted index, BM25 scoring.
- **Vector search:** Pinecone, Weaviate, Qdrant, Milvus; embedding-based similarity search.
- **Hybrid search:** combined full-text + vector; reciprocal rank fusion (RRF) or weighted scoring.
- **Managed SaaS:** Algolia, Typesense Cloud; hosted search with built-in relevance tuning.

**Completion criterion:** architecture named with rationale.

### 2. Design the indexing strategy

- **Document model:** what fields are searchable, filterable, sortable, facetable?
- **Language analysis:** tokenizers, analyzers, stemming, stop words, n-grams.
- **Synonyms:** explicit, one-way, multi-way; domain-specific synonym management.
- **Index lifecycle:** rollover, shrink, force merge, snapshot/restore; index templates.

**Completion criterion:** indexing strategy and field mapping named.

### 3. Define ranking and relevance

- **Text relevance:** BM25, TF-IDF, field-length normalization; query-time boosting.
- **Business ranking:** popularity, recency, personalization, business rules; function score queries.
- **Personalization:** user history, click-through data, collaborative filtering.
- **Context-aware:** location, device, time, user segment; dynamic boosting.

**Completion criterion:** ranking strategy and boosting rules named.

### 4. Design query features

- **Autocomplete:** prefix matching, edge n-grams, completion suggester; debounce and minChars.
- **Faceted search:** aggregations, filters, ranges; facet ordering and exclusion filters.
- **Typo tolerance:** fuzzy matching, edit distance, phonetic matching; per-field tolerance.
- **Highlighting:** search term highlighting, snippets; boundary scanners and fragment size.
- **Pagination:** offset vs search-after; deep pagination trade-offs; cursor-based pagination.

**Completion criterion:** query features and pagination strategy named.

### 5. Plan synonyms and language

- **Synonym management:** synonym graphs, word dictionaries, context-aware synonyms.
- **Multi-language:** per-language analyzers, language detection, per-field language boosting.
- **Stop words:** common word removal, protected words, per-language stop word lists.

**Completion criterion:** synonym and language strategy named.

### 6. Observability and analytics

- **Search analytics:** popular queries, zero-result queries, click-through rate, conversion rate.
- **Relevance metrics:** NDCG, MAP, MRR; offline evaluation with labeled queries.
- **A/B testing:** ranking variants, relevance tuning, query rewriting experiments.
- **Monitoring:** query latency, error rate, index health, node saturation, queue depth.

**Completion criterion:** analytics and monitoring plan named.

### 7. Scalability and resilience

- **Scaling:** sharding, replicas, routing; load balancing across nodes.
- **Caching:** query cache, request cache, result cache; cache invalidation strategy.
- **Rate limiting:** query complexity limits, per-user quotas, burst protection.
- **Failover:** cluster awareness, cross-cluster replication, disaster recovery.

**Completion criterion:** scalability and resilience strategy named.

## Completion criteria

- the search architecture is named
- the indexing and field mapping strategy is explicit
- ranking and relevance controls are named
- query features (autocomplete, facets, typo tolerance) are designed
- synonym and language strategy is explicit
- analytics, A/B testing, and monitoring are planned
- scalability and resilience strategy is named

## References

- `../../backend/backend-architecture/SKILL.md` — API design for search endpoints
- `../../data/data-warehouse-modeling/SKILL.md` — data modeling for search
- `../../qa/qa-automation/SKILL.md` — search testing strategy
