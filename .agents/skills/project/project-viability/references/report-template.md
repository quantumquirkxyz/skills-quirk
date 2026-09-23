# Report Template

Use this structure when writing `.reports/<YYYYMMDD>-viability.md`.

```markdown
# Project Viability Assessment

**Repository:** <repo name or path>
**Date:** <YYYY-MM-DD>
**Assessed against:** CONTEXT.md, docs/adr/

## Executive Summary

| Dimension | Rating | One-line reason |
|-----------|--------|-----------------|
| Viability | Viable / Conditional / Not viable | <reason> |
| Functionality | Complete / Partial / Broken | <reason> |
| Scalability | Scalable / Bounded / Fragile | <reason> |

## Viability

<2-4 sentences summarizing the rating.>

### Findings

- <Finding with citation: file path, ADR path, or CONTEXT.md section.>
- <Finding with citation.>

### Recommendations

1. <Highest-priority action.>

## Functionality

<2-4 sentences summarizing the rating.>

### Findings

- <Finding with citation.>
- <Finding with citation.>

### Recommendations

1. <Highest-priority action.>

## Scalability

<2-4 sentences summarizing the rating.>

### Findings

- <Finding with citation.>
- <Finding with citation.>

### Recommendations

1. <Highest-priority action.>

## Next Steps

Ask the user to choose one path:

- Address the top findings via `/implement` or `/codebase-design`.
- Sharpen the project model via `/grill-with-docs` or `/domain-modeling`.
- Revisit ADRs via `/docs-management`.
- Abandon or pause the assessment.
```
