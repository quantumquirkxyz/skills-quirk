# Summary
Add idempotent checkout submission handling.

# Why
Retries can currently create duplicate orders when the client times out.

# Impact
Duplicate requests with the same key now reuse the original order result.

# Validation
Unit tests, checkout integration tests, and independent diff review passed.

# Review Focus
Verify key scope, replay behavior, and failure handling.

# Development
Implemented in the checkout service; no payment-provider configuration changed.
