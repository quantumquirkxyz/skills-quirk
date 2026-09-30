---
name: graphic-design-packaging
description: "Design physical packaging — dielines, structure, materials, regulatory labels — with production-ready specifications."
---

# Graphic Design Packaging

## Purpose

Design physical packaging from product brief to production-ready dieline and artwork specifications. Covers structural design, material selection, dieline creation, color management for print, and regulatory compliance.

## When to Use

Use this skill when the user asks for packaging design, dieline, box design, label design, blister pack, product packaging, structural design, or production-ready packaging specifications.

## Workflow

1. **Define product, dimensions, and production constraints**
   - Confirm product dimensions, weight, fragility, shelf requirements, and production capabilities.

2. **Select packaging structure**
   - Review `references/package-structures.md` for common structures, material suggestions, and industry use cases.
   - Choose the structure that fits the product and production constraints.

3. **Design dieline and artwork**
   - Follow standards in `references/dieline-standards.md` for bleed, safety zones, glue tabs, fold lines, registration marks, and export settings.
   - Reference SVG templates in `assets/dieline-templates/` as starting points.

4. **Apply production colors**
   - Use CMYK, Pantone spot colors, and ICC profiles per `references/color-management-packaging.md`.
   - Ensure dot gain, trapping, and proofing requirements are addressed.

5. **Validate dieline and regulatory compliance**
   - Check `references/regulatory-labels.md` for required markings, label placements, and material declarations.
   - Run `scripts/validate_dieline.py` against the SVG dieline to catch structural issues before production.

6. **Deliver technical specifications + vector dieline**
   - Package all outputs: vector dieline (SVG/AI/EPS), material spec, color guide, and regulatory checklist.

## Bundled Resources

### references/
- `package-structures.md` — Common packaging structures with materials and use cases.
- `dieline-standards.md` — Bleed, safety zones, glue tabs, fold lines, registration marks, and software conventions.
- `material-selection.md` — Paper, plastic, glass, and sustainable material guidance with cost and print compatibility.
- `regulatory-labels.md` — EU, US, and general regulatory labeling requirements and placement.
- `color-management-packaging.md` — CMYK, Pantone, spot colors, ICC profiles, dot gain, trapping, and proofing.

### assets/dieline-templates/
- `folding-carton.svg` — Regular slotted container with bleed, glue tab, fold lines, safety zone, and registration marks.
- `rigid-box.svg` — Set-up box base and lid with cut lines, fold lines, glue areas, bleed, and safety zones.

### assets/material-swatches/
- `kraft-board.txt` — Kraft paper appearance and color values.
- `coated-white.txt` — Coated white board description and color values.
- `recycled-gray.txt` — Recycled board description and color values.

### scripts/
- `validate_dieline.py` — Validates SVG dielines for structural completeness, safety zones, bleed, and reasonable dimensions.
