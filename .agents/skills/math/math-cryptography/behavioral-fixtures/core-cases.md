# Cryptography Fixture

## Positive case
Given a threat model, protocol specification, security parameter, and approved primitives, analyze confidentiality and authenticity claims with assumptions, reductions, and reproducible test vectors.

## Boundary and refusal
If the primitive, nonce policy, adversary model, or key-management authority is unspecified, return `BLOCKED` and request the missing specification rather than selecting a construction.

## Negative control
Do not claim security from algorithm names alone, reuse nonces in an example, or present an informal intuition as a proof.
