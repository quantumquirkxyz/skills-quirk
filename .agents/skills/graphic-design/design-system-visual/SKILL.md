---
name: design-system-visual
category: graphic-design
maturity: stable
version: 1
description: Design visual design systems — tokens, components, patterns, and documentation — with explicit hierarchy, accessibility, and cross-channel consistency.
capabilities:
  - define design tokens and token taxonomy
  - specify component patterns and states
  - document accessibility requirements per component
  - define cross-channel adaptation rules
  - produce visual design system artifact
outputs:
  - Visual Design System artifact with token taxonomy, component patterns, accessibility rules, and cross-channel guidelines
sideEffects: []
dependencies: []
stopCondition: Visual design system design complete; tokens, components, accessibility, and adaptation rules explicit.
risk: low
trustTier: 1
maxIterations: 6
---

## Operating Contract

- **Input:** Visual design system request, brand constraints, platform targets, and accessibility requirements.
- **Output:** Visual Design System artifact with token taxonomy, component patterns, accessibility rules, and cross-channel guidelines.
- **Side effects:** none; this skill is read-only analysis and documentation.
- **Dependencies:** none.
- **Stop condition:** Visual design system design complete; tokens, components, accessibility, and adaptation rules explicit.
- **Risk:** low.
- **Boundary:** designs the visual system and rules; does not implement components or connect to external tools.

# Design System Visual

Use this skill when a product or brand needs a coherent visual design system. It should translate brand and accessibility requirements into explicit design tokens, component patterns, and cross-channel adaptation rules.

## Contract

- Input: brand constraints, platform targets (web, mobile, print, outdoor), accessibility requirements, and existing visual assets.
- Output: visual design system artifact with token taxonomy, component patterns, accessibility rules, and cross-channel guidelines.
- Scope: define the visual system and rules; do not implement production components.
- Rule: start from brand tokens before defining component-specific values.
- Rule: define component states explicitly: default, hover, focus, active, disabled, error, loading, empty.
- Rule: specify accessibility requirements for each component and token where interaction or readability matters.

## Steps

### 1. Define token taxonomy

- **Global tokens:** raw values for color, typography, spacing, elevation, motion.
- **Alias tokens:** semantic names mapped to global tokens.
- **Component tokens:** component-specific mappings from alias tokens.
- Specify format: JSON, CSS custom properties, Figma variables, or design-token JSON.

**Completion criterion:** token taxonomy with examples saved.

### 2. Specify color system

- Define color roles: primary, secondary, accent, neutral, semantic.
- Provide values for each role in all required formats.
- Define opacity scale for overlays and disabled states.
- Specify dark mode mappings if applicable.

**Completion criterion:** color system with token names and values saved.

### 3. Specify typography scale

- Define type scale: display, h1–h6, body, small, caption.
- Specify font family, weight, line height, letter spacing, and paragraph spacing for each level.
- Define responsive scale if platform requires it.

**Completion criterion:** typography scale with token names and values saved.

### 4. Define spacing and layout

- Define spacing scale: base unit and multiples.
- Define grid system: columns, gutters, margins.
- Define breakpoints for responsive behavior.
- Define container max-widths.

**Completion criterion:** spacing and layout system saved.

### 5. Define component patterns and states

- Document patterns for: buttons, inputs, cards, navigation, modals, tables, alerts.
- For each pattern: anatomy, content guidelines, spacing, states, and accessibility notes.
- Specify elevation and shadow tokens for layered surfaces.

**Completion criterion:** component pattern catalog with states saved.

### 6. Document accessibility requirements

- For each component and token: specify contrast, focus indicator, keyboard behavior, and screen reader treatment.
- Document color-blind-safe alternatives.
- Document motion preferences: reduced motion defaults.

**Completion criterion:** accessibility requirements documented per component and token.

### 7. Define cross-channel adaptation rules

- Digital: screen-specific adaptations, interaction states, responsive behavior.
- Print: static adaptations, color space conversion, layout constraints.
- Outdoor: high-contrast adaptations, simplified messaging, size constraints.

**Completion criterion:** cross-channel adaptation rules saved.

## Completion criteria

- token taxonomy is defined with examples
- color system is defined with values and formats
- typography scale is defined with values and formats
- spacing and layout system is defined
- component patterns with states are documented
- accessibility requirements are documented per component and token
- cross-channel adaptation rules are defined

## References

- `../../frontend/design-system/SKILL.md` — reusable UI tokens and component systems
- `../../accessibility/accessibility-design/SKILL.md` — inclusive visual design
- `../../graphic-design/graphic-design-foundations/SKILL.md` — composition, color, typography foundations
- `references/domain.md` — design token taxonomy and component pattern libraries
- `references/token-formats.md` — design token interchange formats
