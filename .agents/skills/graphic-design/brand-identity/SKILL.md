---
name: brand-identity
category: graphic-design
maturity: stable
version: 1
description: Design brand identity systems — logo, color, typography, imagery, iconography, voice, and usage rules — with explicit consistency, scalability, and governance.
capabilities:
  - define brand strategy and positioning
  - design logo system and variations
  - establish color palette and typography system
  - document imagery and iconography style
  - produce brand identity artifact with governance rules
outputs:
  - Brand Identity artifact with strategy, logo system, color palette, typography, imagery rules, and usage governance
sideEffects: []
dependencies: []
stopCondition: Brand identity design complete; strategy, visual system, and usage rules explicit; governance named.
risk: low
trustTier: 1
maxIterations: 6
---

## Operating Contract

- **Input:** Brand strategy brief, audience, market context, and any existing visual assets.
- **Output:** Brand Identity artifact with strategy, logo system, color palette, typography, imagery rules, and usage governance.
- **Side effects:** none; this skill is read-only analysis and documentation.
- **Dependencies:** none.
- **Stop condition:** Brand identity design complete; strategy, visual system, and usage rules explicit; governance named.
- **Risk:** low.
- **Boundary:** designs the identity system and rules; does not produce final brand assets or connect to external tools.

# Brand Identity

Use this skill when a brand needs a coherent visual and verbal identity system. It should translate strategy into explicit logo, color, typography, imagery, iconography, and usage rules that scale across channels.

## Contract

- Input: brand strategy brief, audience, market context, and existing visual assets.
- Output: brand identity artifact covering strategy, logo system, color, typography, imagery, iconography, and usage governance.
- Scope: design the identity system and rules; do not produce final production assets.
- Rule: anchor the identity to strategy first, aesthetics second.
- Rule: define minimum clear space, sizing, and context rules for every logo variation.
- Rule: specify prohibited uses and common misuse patterns explicitly.

## Steps

### 1. Define brand strategy and positioning

- State brand purpose, values, and personality.
- Define audience segments and their expectations.
- Identify competitive positioning and differentiation.
- Document tonal voice and messaging pillars.

**Completion criterion:** brand strategy and positioning saved.

### 2. Design the logo system

- Define primary logo, wordmark, and symbol marks.
- Specify logo variations: horizontal, stacked, icon-only, monochrome.
- Define minimum clear space around each logo variation.
- Specify minimum size for digital and print use.
- Provide do and don't examples for logo usage.

**Completion criterion:** logo system with variations and clear-space rules saved.

### 3. Establish the color palette

- Define primary, secondary, and accent colors with values.
- Specify color formats: HEX, RGB, CMYK, Pantone, OKLCH.
- Provide contrast ratios for text-on-background pairs.
- Define neutral palette: grays, off-whites, and near-blacks.
- Specify color usage hierarchy and prohibited combinations.

**Completion criterion:** color palette with values, formats, and usage hierarchy saved.

### 4. Define typography system

- Select primary and secondary typefaces.
- Define scale: display, headline, subhead, body, caption.
- Specify weights, line heights, letter spacing, and paragraph spacing.
- Document licensing and embedding rules.
- Specify fallback fonts for digital and print.

**Completion criterion:** typography system with scale and licensing saved.

### 5. Define imagery and iconography style

- Describe photography style: subject, lighting, composition, color grading.
- Describe illustration style: line weight, color, detail level.
- Define iconography system: grid, stroke width, corner radius, color usage.
- Specify image treatments and prohibited stock photo characteristics.

**Completion criterion:** imagery and iconography style guide saved.

### 6. Document usage governance

- Define co-branding rules and minimum clear space.
- Specify background contexts where the logo and colors must adapt.
- List prohibited uses: stretching, recoloring, adding effects, placing on busy backgrounds without contrast.
- Define approval workflow for new applications and exceptions.

**Completion criterion:** usage governance and approval workflow saved.

## Completion criteria

- brand strategy and positioning are explicit
- logo system with variations and clear-space rules is defined
- color palette with values and formats is defined
- typography system with scale and licensing is defined
- imagery and iconography style is documented
- usage governance and approval workflow are named

## References

- `../../foundation/codebase-design/SKILL.md` — durable module and seam design
- `../../frontend/design-system/SKILL.md` — design tokens and component systems
- `references/domain.md` — brand identity terminology and frameworks
- `references/logo-systems.md` — logo classification and variation patterns
- `references/brand-governance.md` — approval workflows and governance structures
