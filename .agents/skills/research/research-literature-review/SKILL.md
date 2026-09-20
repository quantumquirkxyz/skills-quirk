---
name: research-literature-review
category: research
maturity: stable
version: 1
description: Review research literature — search strategy, screening, synthesis, citation tracking, and evidence grading — with transparent inclusion criteria.
capabilities:
  - design literature search protocols
  - screen and synthesize evidence
  - track citations, provenance, and evidence quality
outputs:
  - literature review protocol or synthesis with search strategy, inclusion criteria, and evidence grading
sideEffects: []
dependencies: []
stopCondition: Search strategy, screening criteria, synthesis, and evidence limitations are explicit.
risk: low
trustTier: 1
maxIterations: 6
---

# research-literature-review

Use this skill when planning or performing a literature review, evidence scan, related-work section, systematic screening, or research synthesis.

## Contract

- Input: research question, domain, databases/sources, time range, inclusion/exclusion criteria, and desired review depth.
- Output: search protocol, screened evidence set, synthesis, limitations, and citation/provenance notes.
- Scope: literature review process; primary-source web lookup should follow the research skill when live sources are needed.
- Boundary: distinguish evidence found, evidence excluded, and evidence not searched.

## Rules

- Rule: state the research question before choosing search terms.
- Rule: document databases, queries, dates searched, and inclusion/exclusion criteria.
- Rule: screen titles/abstracts and full text consistently against the criteria.
- Rule: grade evidence quality and relevance separately.
- Rule: preserve citation provenance so claims can be traced back to sources.

## Steps

1. Define the research question, scope, and review type.
2. Choose databases, sources, keywords, synonyms, and citation-chaining strategy.
3. Run and record searches with dates and query strings.
4. Screen results using explicit inclusion and exclusion criteria.
5. Extract claims, methods, population/context, results, and limitations.
6. Synthesize themes, disagreements, gaps, and confidence level.

## Completion Criteria

- research question and search strategy are documented
- screening criteria and exclusions are transparent
- synthesis separates findings from limitations
- citations and provenance are traceable
