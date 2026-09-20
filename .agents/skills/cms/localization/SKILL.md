---
name: localization
category: cms
maturity: stable
version: 1
description: Design internationalization (i18n) and localization (l10n) — string management, locale handling, RTL support, cultural adaptation — so the product works across languages and regions.
capabilities:
  - apply localization workflow
  - produce localization artifact
  - validate localization completion criteria
outputs:
  - Localization artifact with findings, decisions, recommendations, and validation notes
sideEffects: []
dependencies: []
stopCondition: Design internationalization (i18n) and localization (l10n) complete; artifact saved; completion criteria checked.
risk: low
trustTier: 1
maxIterations: 6
---

# localization

Design internationalization (i18n) and localization (l10n) — string management, locale handling, RTL support, cultural adaptation — so the product works across languages and regions.

## Goals
- Externalize all user-facing strings from code
- Support locale-aware formatting (dates, numbers, currencies)
- Handle RTL layouts and bidirectional text
- Integrate translation workflow with the development process

## Contract

### Input
A product or feature to localize: supported locales, content volume, RTL requirements.

### Output
A localization specification with:
- String extraction and management strategy
- Locale formatting rules
- RTL adaptation plan
- Translation workflow integration

## i18n vs. l10n

| Concern | i18n (internationalization) | l10n (localization) |
|---|---|---|
| What | Code structure | Cultural adaptation |
| Who | Developers | Translators, local teams |
| When | Before shipping | Per locale |
| Examples | String IDs, ICU, format APIs | Translation, dates, currency |

## Steps

1. **Audit user-facing strings** — extract from code, templates, DB
2. **Choose a framework** — ICU MessageFormat, gettext, Fluent
3. **Define locale hierarchy** — en → en-GB → en-AU
4. **Handle formatting** — dates (Intl.DateTimeFormat), numbers, currencies
5. **Adapt UI** — text expansion (±30%), RTL layout, icons
6. **Integrate translations** — TMS integration, glossary, placeholders
7. **Test** — pseudolocalization, native speaker review

## Rules

- Rule: externalize all user-facing strings and preserve placeholders with translator context.
- Rule: handle pluralization, gender, date/time, currency, number, and collation rules by locale.
- Rule: design for text expansion, RTL, bidirectional text, and locale-specific layouts.
- Rule: separate source-language content governance from per-locale adaptation.
- Rule: include pseudolocalization and native-speaker review in validation.

## References
- `../cms-architecture/SKILL.md` — content localization
- `../../frontend/frontend-design/SKILL.md` — RTL design
- `../../accessibility/accessibility/SKILL.md` — language in a11y
