---
description: "Analyse cryptographic constructions — symmetric, asymmetric, hashing, MACs, zero-knowledge — with NIST post-quantum standards (FIPS 203 ML-KEM, FIPS 204 ML-DSA, FIPS 205 SLH-DSA), formally verified implementations, constant-time discipline, side-channel countermeasures, machine-checked security reductions (EasyCrypt/F*), and KAT vectors."
---
# math-cryptography

When to use: Analyse cryptographic constructions — symmetric, asymmetric, hashing, MACs, zero-knowledge — with NIST post-quantum standards (FIPS 203 ML-KEM, FIPS 204 ML-DSA, FIPS 205 SLH-DSA), formally verified implementations, constant-time discipline, side-channel countermeasures, machine-checked security reductions (EasyCrypt/F*), and KAT vectors.

## Workflow

1. Identify the primitive type — symmetric encryption (block ciphers, stream ciphers), asymmetric (RSA, ECC, lattice-based), hash (collision-resistant, preimage), MAC / HMAC, signatures, key exchange, ZK proofs
2. State hardness assumptions — DLP, CDH, DDH, RSA,factoring, LWE, SIS; quantify security level in bits
3. Security goal — IND-CPA, IND-CCA, EUF-CMA, collision resistance, etc
4. Attack analysis — birthday (hash), meet-in-the-middle, side-channel, replay, forward secrecy, oracle attacks
5. Protocol design — if designing: use a well-known construction; do not invent primitives. Specify parties, messages, randomness sources, and secrets
6. Deliver — artifact: primitive, hardness assumption, security goal, attack surface, and a security verdict (strong / moderate / weak / broken)

## Deliverables

- math artifact

## Guardrails

- risk: medium; trust tier: 3; approval required: yes
- side effects: none
- isolation: none; model tier: reasoning

Stop when: Cryptographic analysis complete; security verdict stated; attack surface documented; assumptions listed; NIST PQ default applied; KAT vectors verified; constant-time discipline confirmed.
