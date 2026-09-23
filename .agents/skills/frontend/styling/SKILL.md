---
name: styling
category: frontend
maturity: stable
version: 1
description: Modern CSS (Tailwind v4, Panda CSS, CSS modules, CVA, design tokens).
capabilities:
  - design styling architecture
  - configure utility-first and component CSS
  - create design token system
  - plan CVA and variant patterns
outputs:
  - Styling artifact with findings, decisions, recommendations, and validation notes
sideEffects: []
dependencies: []
stopCondition: Styling design complete; artifact saved; completion criteria checked.
risk: low
trustTier: 1
maxIterations: 6
---

# Styling

Use this skill when designing the styling architecture for a frontend project — utility-first CSS, CSS modules, component variants, design tokens, and theme systems.

## Contract

- Input: brand system, component library, design requirements, and team conventions.
- Output: styling architecture with tool choices, token definitions, and component styling strategy.
- Scope: design styling system and conventions; not pixel-perfect component implementation.
- Rule: define design tokens as the single source of truth for colors, spacing, typography, and motion.
- Rule: prefer scoped styles to prevent leakage; keep specificity predictable.
- Rule: align utility classes and component variants to the same token set.

## Process

### 1. Choose styling approach
- Evaluate utility-first (Tailwind v4, Panda CSS), CSS modules, CSS-in-JS, or hybrid.
- Consider team familiarity, bundle size, runtime cost, and DX.
- Document the chosen approach and why alternatives were rejected.

**Completion criterion:** styling approach selected with rationale.

### 2. Define design tokens
- Catalog tokens: colors (semantic and primitive), spacing scale, typography scale, shadows, radii, z-index, motion.
- Choose token format (CSS custom properties, JSON, Style Dictionary) and build pipeline.
- Define light/dark mode and theme switching strategy.

**Completion criterion:** token catalog defined with format and theme strategy.

### 3. Configure build tooling
- Set up PostCSS, Tailwind v4 config, Panda CSS config, or CSS modules pipeline.
- Define content sources for purging unused styles.
- Configure source maps, minification, and vendor prefixing.

**Completion criterion:** build tooling configured with content sources documented.

### 4. Design component variants with CVA
- Identify components with visual variants (size, intent, shape, density).
- Implement variant API using class-variance-authority or framework equivalent.
- Document compound variant rules and slot patterns.

**Completion criterion:** variant API designed for key components with type safety noted.

### 5. Plan theming and responsive behavior
- Define breakpoint strategy and responsive token variants.
- Plan dark mode, high contrast mode, and forced-colors support.
- Document CSS containment and performance considerations.

**Completion criterion:** theme, responsive, and accessibility styling strategy documented.

## Rules

- Rule: keep design tokens semantic; avoid hard-coded values in component styles.
- Rule: use utility classes for one-off styling; reserve component classes for repeated patterns.
- Rule: scope styles to prevent leakage in CSS modules or use utility discipline in utility-first.
- Rule: document the style decision authority and change process for the token system.
- Rule: verify contrast ratios for text and interactive elements in all themes.
- Rule: avoid deep selector nesting; keep specificity flat and predictable.

## Completion Criteria

- styling approach is selected with rationale
- design token catalog is defined with format and theme strategy
- build tooling is configured with content sources documented
- variant API is designed for key components
- theme, responsive, and accessibility styling strategy is documented
