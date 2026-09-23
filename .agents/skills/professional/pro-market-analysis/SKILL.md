---
name: pro-market-analysis
category: skill-dev/sandbox
maturity: stable
version: 1
description: Conduct professional market research — TAM/SAM/SOM, competitor analysis, pricing, and trend forecasting — with source citation, data quality checks, and decision framing.
capabilities:
  - apply pro market analysis workflow
  - produce pro market analysis analysis artifact
  - validate pro market analysis completion criteria
outputs:
  - Pro Market Analysis artifact with completed sections, evidence, and limitations
sideEffects: []
dependencies: []
stopCondition: Conduct professional market research complete; required sections present; completion criteria checked.
risk: low
trustTier: 1
maxIterations: 6
---

## Operating Contract

- **Input:** Pro Market Analysis request, problem context, constraints, and available evidence.
- **Output:** Pro Market Analysis artifact with completed analysis, decisions, recommendations, and limitations.
- **Side effects:** follow the frontmatter declaration; do not change systems unless explicitly authorized.
- **Dependencies:** declared dependencies, source material, and domain references required by the task.
- **Stop condition:** Conduct professional market research is complete, required sections are present, and completion criteria are checked.
- **Risk:** use the frontmatter risk classification and call out any escalation.
- **Boundary:** stay within the skill's declared scope and side-effect policy.

# Professional Market Research

Conduct **market analysis** — TAM/SAM/SOM, competitor mapping, pricing analysis, trend forecasting — with explicit sources and data quality checks.

## When to use
- The user needs market sizing for a business plan.
- A competitive landscape needs mapping.
- A pricing or go-to-market strategy needs data.

## Process
1. Scope — market definition, geography, time horizon.
2. TAM / SAM / SOM — total, serviceable, obtainable; justify with data sources.
3. Competitors — direct / indirect / substitutes; mapping with positioning and pricing.
4. Pricing — price points, cost structure, willingness-to-pay signals.
5. Trends — technology, regulation, demographic, macroeconomic; sources (reports, news, data APIs).
6. Data quality — primary vs secondary; date; bias; missing data acknowledged.
7. Deliver — Markdown report with sections, source citations, and a recommendation (enter / niche / avoid / watch).

## Rules

- Rule: define market boundaries before estimating size.
- Rule: cite data sources and dates for every quantitative estimate.
- Rule: separate TAM, SAM, and SOM assumptions.
- Rule: include direct competitors, substitutes, and non-consumption alternatives.
- Rule: state confidence level and missing data instead of overfitting a precise number.

## Completion Criteria

- market scope and geography are explicit
- sizing assumptions and sources are traceable
- competitor and pricing analysis are included
- recommendation is tied to evidence quality
