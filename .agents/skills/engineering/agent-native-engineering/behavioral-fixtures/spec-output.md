# Metadata
- Skill: agent-native-engineering
- Identifier: checkout-risk-assessment

# Problem Statement
An agent-generated checkout change lacks a reviewed specification and clear quality gates.

# Goals
- Make required behavior and verification explicit before implementation.

# Non-goals
- Implement the checkout change or publish a pull request.

# Functional Requirements
- Record scope, acceptance criteria, and blocking quality gates.

# Acceptance Criteria
- The assessment identifies one blocker and names the independent validation step.

# Risks and Open Questions
- Risk: payment-provider behavior is not covered by local tests.
- Open question: which sandbox contract version is authoritative?
