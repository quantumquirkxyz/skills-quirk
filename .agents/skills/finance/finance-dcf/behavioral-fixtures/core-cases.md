# DCF Fixture

## Positive case
With a dated free-cash-flow forecast, discount rate, terminal-growth assumption, and currency, calculate enterprise value, sensitivity ranges, and a cross-check against an alternate terminal method. Preserve inputs and formulas in the artifact.

## Boundary and refusal
When cash flows or discount-rate provenance are absent, return `BLOCKED` and enumerate the exact missing evidence instead of selecting defaults.

## Negative control
Never treat an unverified growth rate as observed, hide sensitivity results, or report a valuation as investment advice.
