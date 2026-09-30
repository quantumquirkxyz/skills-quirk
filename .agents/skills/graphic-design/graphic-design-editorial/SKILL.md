---
name: graphic-design-editorial
description: "Design editorial layouts — magazines, books, reports, long-form content — with explicit grid systems, typography hierarchy, and production-ready pagination."
---

# Graphic Design Editorial

## Purpose

Design editorial layouts for print and digital publications. Provide production-ready pagination specifications with explicit grid systems, typographic hierarchy, and image treatment.

## When to Use

Use this skill when the user asks for:
- Editorial design or magazine layout
- Book design or book chapter layout
- Report layout or long-form content design
- Pagination systems or page composition
- Typography hierarchy for publications
- Print production specifications for editorial content

## Workflow

1. Analyze content type and audience
2. Select grid system and layout approach from `references/grid-systems.md`
3. Define typography hierarchy from `references/typography-hierarchy.md`
4. Specify image treatment and captions from `references/image-treatment.md`
5. Define print production specs from `references/print-production.md`
6. Deliver paginated layout specification with rationale

## Resources

### references/
- `grid-systems.md` — Modular grids, grid selection by content type, margins and gutters, digital vs print considerations, intentional grid-breaking
- `typography-hierarchy.md` — Type scales, font pairing, leading/tracking/kerning, drop caps, pull quotes, running headers
- `image-treatment.md` — Image placement, captions, image-to-text ratios, CMYK conversion, accessibility alt text
- `print-production.md` — Page sizes, bleed and safety margins, color modes, resolution requirements, PDF export and preflight

### assets/editorial-templates/
- `magazine-spread.html` — Self-contained HTML/CSS magazine spread demonstrating grid, typography hierarchy, and image placeholders
- `book-chapter.html` — Self-contained HTML/CSS book chapter layout with running headers, footnotes, and drop caps

### scripts/
- `validate_editorial.py` — Validates HTML editorial templates for heading hierarchy, font scale consistency, readable line lengths, image alt attributes, and WCAG AA color contrast
