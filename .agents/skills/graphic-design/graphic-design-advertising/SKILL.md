---
name: graphic-design-advertising
description: "Design advertising creatives — social ads, display ads, email banners, campaign visuals — with explicit brand consistency, format specifications, and conversion-focused layout rules."
---

# Graphic Design Advertising

## Overview

This skill provides a repeatable workflow and reference library for designing advertising creatives across digital and print channels. It ensures every deliverable is sized correctly, on-brand, conversion-focused, and validated against platform specifications.

## Workflow

1. Define campaign goals and target audience from `references/campaign-strategy.md`
2. Select format and dimensions from `references/ad-formats.md`
3. Design creative layout with brand consistency from `references/brand-consistency.md`
4. Specify copy hierarchy and CTA placement from `references/copy-layout.md`
5. Validate against platform specs with `references/platform-specs.md`
6. Deliver campaign creative specs + variations

## Usage

Trigger this skill when the user asks for:
- Ad design
- Social media ad
- Display ad
- Banner
- Campaign creative
- Marketing visual
- Ad creative

## Reference Documentation

Load the appropriate reference files into context before executing the workflow:

- `references/campaign-strategy.md` — campaign objective mapping, audience alignment, A/B variables, success metrics
- `references/ad-formats.md` — dimensions, file size limits, and aspect ratios for every major ad format
- `references/brand-consistency.md` — template systems, color and typography rules, logo placement, voice and tone
- `references/copy-layout.md` — headline hierarchy, body copy length, CTA design, visual flow and eye-tracking
- `references/platform-specs.md` — Meta, Google Ads, LinkedIn, TikTok, and email client specifications

## Assets

- `assets/ad-templates/social-post.html` — Instagram/LinkedIn post template
- `assets/ad-templates/display-ad.html` — 728x90 leaderboard display ad
- `assets/ad-templates/email-banner.html` — Email header banner template

## Scripts

- `scripts/validate_ad.py` — validates HTML ad templates for dimensions, CTA visibility, WCAG AA contrast, logo placement, and file size estimates.
