# Repository Code Audits

Use `code-review` when the goal is to understand whether the current codebase
actually implements a requested behavior or has a logical, architectural, or
maintainability problem.

## Choose the right review

- Use `code-review` for the current repository, a module, or an end-to-end flow.
- Use `review-pr` for a pull-request diff against a fixed point.
- Use `diagnosing-bugs` when a reported symptom needs a reproducible root-cause loop.
- Use `project-viability` for a structured health and scalability assessment.

## Expected audit behavior

The audit reads repository context, entrypoints, relevant modules, tests,
configuration, and documentation before reaching a conclusion. It does not
require a branch comparison and does not modify source files.

Every finding should distinguish confirmed defects, risks, improvements, and
evidence gaps. It should cite a location, explain the evidence and logical
impact, and state limitations when the requested scope could not be fully
inspected.

## Handoff examples

```text
code-review -> diagnosing-bugs
code-review -> testing
code-review -> project-viability
code-review -> improve-codebase-architecture
code-review -> sec-security-audit
code-review -> performance
```

Specialist skills verify the relevant concern independently; an audit risk is
not automatically a confirmed defect in the downstream report.
