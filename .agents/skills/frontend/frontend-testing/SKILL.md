---
name: frontend-testing
category: frontend
maturity: stable
version: 1
description: Frontend testing (Vitest, Testing Library, Playwright, visual testing, Storybook).
capabilities:
  - design frontend test strategy
  - configure unit and integration tests
  - design end-to-end test suites
  - plan visual testing and Storybook workflows
outputs:
  - Frontend testing artifact with findings, decisions, recommendations, and validation notes
sideEffects: []
dependencies: []
stopCondition: Frontend testing design complete; artifact saved; completion criteria checked.
risk: low
trustTier: 1
maxIterations: 6
---

# Frontend Testing

Use this skill when designing the test strategy for a frontend application — unit tests, integration tests, end-to-end tests, visual regression, and Storybook workflows.

## Contract

- Input: component library, user flows, CI environment, and quality requirements.
- Output: test strategy with test tiers, tool configuration, coverage targets, and execution plan.
- Scope: design testing architecture and conventions; not writing all test cases.
- Rule: test user-visible behavior, not implementation details.
- Rule: prioritize tests that catch regressions in critical user journeys.
- Rule: keep tests fast, isolated, and deterministic.

## Process

### 1. Define test tiers
- **Unit:** pure functions, utilities, hooks, and isolated components.
- **Integration:** component composition, context providers, and API boundary mocks.
- **E2E:** critical user journeys across routes and real browser behavior.
- **Visual:** UI regression via screenshots, Chromatic, or Playwright visual comparisons.

**Completion criterion:** test tiers defined with scope and ownership per tier.

### 2. Configure test runners
- Set up Vitest or Jest for unit/integration tests with jsdom or happy-dom.
- Configure Playwright or Cypress for E2E with browser matrix (Chromium, Firefox, WebKit).
- Set up Storybook for component isolation and interaction testing.

**Completion criterion:** test runner configuration documented with CI integration.

### 3. Write testing conventions
- Define file naming (`*.test.ts`, `*.spec.tsx`), directory structure, and test grouping.
- Establish mocking policy: MSW for network, jest.mock for modules, fake timers for time.
- Document accessibility assertions (jest-axe, Playwright a11y checks).

**Completion criterion:** testing conventions documented with examples.

### 4. Plan visual testing
- Define Storybook stories per component and interaction state.
- Set up visual regression workflow with baseline management.
- Plan screenshot testing for responsive breakpoints and themes.

**Completion criterion:** visual testing workflow documented with toolchain.

### 5. Define coverage and quality gates
- Set coverage thresholds for critical paths (not necessarily 100% everywhere).
- Configure CI to fail on flaky tests, accessibility violations, or visual regressions.
- Plan test data strategy: factories, fixtures, MSW handlers, and seed data.

**Completion criterion:** coverage targets, quality gates, and test data strategy documented.

## Rules

- Rule: test behavior the user experiences, not component internals.
- Rule: keep tests independent; no shared mutable state between tests.
- Rule: use Testing Library queries that match how users perceive the UI.
- Rule: run unit tests on every commit; E2E on PR merge to main or on schedule.
- Rule: quarantine and fix flaky tests immediately; never accept flakiness as normal.
- Rule: pair visual testing with behavior tests; screenshots alone do not prove correctness.

## Completion Criteria

- test tiers are defined with scope and ownership
- test runner configuration is documented with CI integration
- testing conventions are documented with examples
- visual testing workflow is documented with toolchain
- coverage targets, quality gates, and test data strategy are documented
