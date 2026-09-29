---
name: graphic-design-foundations
category: graphic-design
maturity: stable
version: 1
description: Design graphic artifacts — posters, social graphics, editorial layouts, packaging, signage — with explicit composition, color, typography, and production constraints.
capabilities:
  - analyze brief and audience constraints
  - define composition, hierarchy, and visual flow
  - select color systems and typography pairs
  - specify print and digital production requirements
  - produce graphic design artifact with rationale
outputs:
  - Graphic Design Foundations artifact with layout directions, color palette, typography system, and production notes
sideEffects: []
dependencies: []
stopCondition: Graphic design foundations complete; layout, color, and typography decisions explicit; production requirements named.
risk: low
trustTier: 1
maxIterations: 6
---

## Operating Contract

- **Input:** Graphic design request, brief, audience, channel, and brand constraints.
- **Output:** Graphic Design Foundations artifact with layout directions, color palette, typography system, and production notes.
- **Side effects:** none; this skill is read-only analysis and documentation.
- **Dependencies:** none.
- **Stop condition:** Graphic design foundations complete; layout, color, and typography decisions explicit; production requirements named.
- **Risk:** low.
- **Boundary:** designs visual direction and production requirements; does not execute production files or connect to external tools.

# Graphic Design Foundations

Use this skill when a visual artifact needs a deliberate graphic design foundation before production. It should translate brief, audience, and channel into explicit layout, color, typography, and production decisions.

## Contract

- Input: visual brief, audience description, distribution channel, and any brand constraints.
- Output: graphic design artifact covering composition, hierarchy, color, typography, and production requirements.
- Scope: define the visual direction and constraints; do not produce final production files.
- Rule: anchor every decision to the brief and audience, not generic aesthetic trends.
- Rule: separate digital and print production constraints explicitly.
- Rule: call out accessibility requirements such as contrast, readability, and color-blind-safe palettes when relevant.

## Steps

### 1. Clarify the brief and constraints

- Identify the artifact type: poster, social graphic, editorial spread, packaging, signage, presentation deck, or report cover.
- Identify the audience: demographic, technical literacy, cultural context, and accessibility needs.
- Identify the channel: print, digital, screen, outdoor, or multi-channel.
- Identify brand constraints: existing palette, typography, logo usage, tone, and prohibited styles.

**Completion criterion:** brief summary saved with artifact type, audience, channel, and brand constraints.

### 2. Define composition and visual hierarchy

- Choose a layout structure: grid-based, modular, editorial, asymmetric, or centered.
- Define focal point and reading order.
- Allocate space for headline, body, imagery, and calls to action.
- Specify margins, bleed, and safe zones for print; padding and responsive breakpoints for digital.

**Completion criterion:** composition map or description saved.

### 3. Design the color system

- Define primary, secondary, and accent roles.
- Specify color format: HEX, RGB, CMYK, Pantone, OKLCH.
- Provide contrast ratios for text-on-background pairs where readability matters.
- Provide color-blind-safe alternatives if the palette relies on hue distinction.

**Completion criterion:** color palette with roles, values, and accessibility notes saved.

### 4. Select typography

- Pair display and body typefaces.
- Define scale: headline, subhead, body, caption, and metadata sizes.
- Specify weights, line heights, and letter spacing.
- Note licensing and embedding constraints for print and web.

**Completion criterion:** typography system with scale and licensing notes saved.

### 5. Specify production requirements

- Digital: resolution, color space, file format, compression, and maximum file size.
- Print: bleed, trim, color space, resolution, paper stock, and finishing.
- Handoff: layers, naming conventions, and asset formats for production teams.

**Completion criterion:** production requirements and handoff notes saved.

## Completion criteria

- brief and constraints are explicit
- composition and hierarchy are described
- color palette is defined with accessibility notes
- typography system is defined with licensing notes
- production requirements are explicit for the chosen channel

## References

- `../../frontend/styling/SKILL.md` — design tokens and CSS color systems
- `../../accessibility/accessibility-design/SKILL.md` — inclusive visual design
- `references/domain.md` — graphic design terminology, color science, and production standards
