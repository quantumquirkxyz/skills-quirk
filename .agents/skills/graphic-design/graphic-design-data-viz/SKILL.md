---
name: graphic-design-data-viz
description: "Design data visualizations — charts, infographics, dashboards — with explicit readability, accessibility, color, typography, and production rules."
---

# Graphic Design Data Viz

## Purpose

Generate publication-quality data visualizations from datasets or raw data. Produce charts, infographics, and dashboards as self-contained SVG/HTML artifacts that are readable, accessible, and production-ready.

## When to Use

Use this skill when the user asks to:
- Visualize data (tabular, CSV, JSON, raw arrays)
- Create charts, plots, or infographics
- Build dashboards or data story layouts
- Improve an existing visualization for readability or accessibility

## Workflow

1. **Analyze dataset and key message**
   Identify the data structure, dimensions, measures, and the core insight to communicate. Note audience, medium (print, web, presentation), and constraints (size, interactivity).

2. **Select optimal chart type**
   Consult `references/chart-types.md` and choose the visualization form that best matches the data shape and message. Justify the choice.

3. **Define visual language**
   - **Palette**: Choose an accessible scheme from `references/color-palettes.md`. Prefer colorblind-safe palettes unless otherwise specified.
   - **Typography**: Apply size hierarchy and font choices from `references/typography-for-charts.md`.
   - **Accessibility**: Enforce criteria from `references/accessibility-criteria.md` (contrast, patterns, text alternatives).

4. **Generate self-contained artifact**
   Produce a single HTML file with inline CSS and SVG. Use a template from `assets/chart-templates/` as a starting point if the chart type matches. The artifact must require no external dependencies.

5. **Run validation**
   Execute `scripts/validate_chart.py <artifact.html>` and resolve all issues before delivery.

6. **Deliver artifact with rationale**
   Provide the HTML file and a brief explanation of the chart type choice, palette rationale, and any accessibility accommodations.

## Resources

### references/
Documentation loaded into context to inform the visualization design decisions.

- `chart-types.md` — Chart type matrix: best use cases, limitations, variants, accessibility notes for 11 common forms.
- `color-palettes.md` — Accessible palette catalog with hex codes, contrast ratios, and colorblind-safe notes.
- `typography-for-charts.md` — Font selection, size hierarchy, readability rules, and number formatting guidance.
- `accessibility-criteria.md` — WCAG criteria applied specifically to data visualizations.

### assets/chart-templates/
Self-contained HTML templates with inline CSS and SVG. Copy and adapt for production artifacts.

- `stat-card.html` — Single metric card with embedded sparkline.
- `bar-chart.html` — Responsive bar chart with ARIA labels and pattern-fill fallbacks.
- `dashboard.html` — Mixed dashboard combining stat cards, a bar chart, and a Sankey-style flow diagram.

### scripts/
Executable code run directly to validate artifacts.

- `validate_chart.py` — Automated checks for contrast, labels, viewBox, and ARIA attributes. Outputs PASS/FAIL with specific issues.
