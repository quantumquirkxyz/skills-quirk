# Review Fix Plan
- Add an idempotency-key test for duplicate checkout requests.
- Re-run the integration gate after the test passes.

Status: planned
PR: checkout-retry-safety
Source review: checkout-diff-review
Severity: high
Scope guard: Change checkout submission and tests only; do not alter payment-provider configuration.
