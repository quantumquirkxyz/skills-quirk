# Skill Inventory

This page records the inventory contract for the quirk Skills bundle without duplicating the generated catalog by hand.

## Current Counts

- Canonical `SKILL.md` files: 266.
- Public projection count: 254 bundle skills excluding 12 platform skills.
- Source of truth: `.agents/skills/`, `skills-lock.json`, `registry.yaml`, and the registry generator.

## Inventory Sources

| Source | Purpose |
|---|---|
| [`../../../CATALOG.md`](../../../CATALOG.md) | Generated human-readable catalog grouped by category. |
| [`../../how-to/generated-views.md`](../../how-to/generated-views.md) | Explains generated projections and compatibility views. |
| [`skills-map.md`](skills-map.md) | Maintained map for agent routing and governance references. |
| `../../../skills-lock.json` | Hash lockfile for canonical `SKILL.md` integrity. |

## Maintenance Rule

Do not maintain a full 258-row skill table by hand in this file. Regenerate projections from the registry and filesystem, then use this page as the stable pointer to the generated inventory sources.
