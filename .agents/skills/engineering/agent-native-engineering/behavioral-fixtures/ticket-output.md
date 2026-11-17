# Parent
checkout-risk-assessment

# What to build
Add an idempotency key to checkout submission and document the retry behavior.

# Metadata
- Skill: agent-native-engineering
- Priority: high

# Acceptance criteria
- Repeated keys do not create duplicate orders.
- A failed quality gate blocks handoff.

# Validation
Run unit tests, the checkout integration suite, and an independent diff review.

# Blocked by
Payment sandbox contract confirmation.

# Notes
Keep the change limited to checkout submission and its tests.
