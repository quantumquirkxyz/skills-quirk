---
name: graphic-design-accessibility
description: "Design inclusive graphic artifacts — WCAG-compliant visuals, colorblind-safe palettes, readable typography, and assistive-technology-compatible layouts for print and digital."
---

# Graphic Design Accessibility

## Purpose

Ensure graphic design is accessible to people with disabilities by applying WCAG principles, colorblind-safe palettes, readable typography, and inclusive layout patterns to visual artifacts.

## When to Use

- User asks for accessible design, colorblind-safe palette, or WCAG-compliant graphics
- Designing inclusive infographics, presentations, or print materials
- Auditing existing visuals for accessibility compliance
- Need readable typography or assistive-technology-compatible layouts

## Workflow

1. **Audit design against accessibility criteria** from `references/wcag-criteria.md`
2. **Select accessible color palette** from `references/colorblind-palettes.md`
3. **Define readable typography** from `references/typography-accessibility.md`
4. **Specify alternative text and descriptions** from `references/alt-text.md`
5. **Validate** with `scripts/validate_accessibility.py`
6. **Deliver accessible design specification** with compliance report

## Bundled Resources

- `references/wcag-criteria.md` — WCAG 2.1/2.2 Level AA requirements for visual design
- `references/colorblind-palettes.md` — Colorblind-safe palettes and simulation methods
- `references/typography-accessibility.md` — Readable typography guidelines
- `references/alt-text.md` — Alternative text and ARIA best practices
- `references/inclusive-patterns.md` — Inclusive design patterns for various disabilities
- `assets/accessible-templates/` — HTML templates demonstrating accessible design
- `scripts/validate_accessibility.py` — Automated WCAG compliance checker
