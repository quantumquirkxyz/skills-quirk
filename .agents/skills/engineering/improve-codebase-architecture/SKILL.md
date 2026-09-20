---
name: improve-codebase-architecture
description: Scan a codebase for deepening opportunities and present candidates as a visual HTML report, then grill through the selected one.
version: 1
capabilities:
  - scan-codebase
  - detect-deepening-opportunities
  - generate-html-report
  - grill-candidate
inputs:
  - target: Path to repository or directory
  - depth-threshold: Minimum depth metric to flag (default: 3)
  - output-format: html or json (default: html)
outputs:
  - html-report: Visual report of architecture candidates
  - candidates: List of modules/files with deepening recommendations
  - selected-candidate: The module chosen for improvement
stopCondition: Report generated and a candidate is selected or explicitly deferred.
risk: low
trustTier: 2
maxIterations: 3
---

# Improve Codebase Architecture

## Contract
- Input: codebase path and depth threshold
- Output: HTML/JSON report with deepening candidates, plus selected candidate
- Boundary: analysis only; no automatic rewrites
- Caller responsibility: provide the repository path, any scope exclusions, and whether generated reports may be written to disk.
- Operator responsibility: explain the scoring signals and keep recommendations traceable to concrete files or modules.

## Process
1. Scan the target directory for module structures.
2. Compute depth and dependency metrics.
3. Identify candidates with high complexity or shallow interfaces.
4. Generate HTML/JSON report.
5. Present candidates; user selects one or defers.
6. If selected, initiate a grilling session for the module.

## Guardrails
- Do not rewrite source code.
- Surface all candidates clearly; selection is user-controlled.
- Preserve existing conventions.
- Rule: Skill must include a Contract section with Input, Output, and Boundary.
- Rule: Treat architecture scores as prompts for investigation, not as automatic refactoring orders.
- Rule: Do not recommend a rewrite without naming the narrower seam that failed first.
- Rule: If the scan cannot inspect a language or build graph, mark that evidence gap in the report.
- Rule: When a candidate is selected, hand off to `grill-me` or `codebase-design` before implementation.

## Report Requirements
- Include the files or modules inspected, the heuristic used, and the reason each candidate matters.
- Separate confirmed problems from suspected deepening opportunities.
- Preserve enough evidence for a reviewer to reproduce the candidate list without rerunning the full scan.
