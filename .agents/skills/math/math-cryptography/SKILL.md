---
name: math-cryptography
category: skill-dev/sandbox
maturity: experimental
version: 1
description: Analyse cryptographic constructions — symmetric, asymmetric, hashing, MACs, zero-knowledge — with security reductions, hardness assumptions, and attack analysis.
capabilities:
  - apply math cryptography workflow
  - produce math cryptography analysis artifact
  - validate math cryptography completion criteria
outputs:
  - Math Cryptography artifact with completed sections, evidence, and limitations
sideEffects: []
dependencies: []
stopCondition: Analyse cryptographic constructions complete; required sections present; completion criteria checked.
risk: low
trustTier: 1
maxIterations: 6
---

## Operating Contract

- **Input:** Math Cryptography request, problem context, constraints, and available evidence.
- **Output:** Math Cryptography artifact with completed analysis, decisions, recommendations, and limitations.
- **Side effects:** follow the frontmatter declaration; do not change systems unless explicitly authorized.
- **Dependencies:** declared dependencies, source material, and domain references required by the task.
- **Stop condition:** Analyse cryptographic constructions is complete, required sections are present, and completion criteria are checked.
- **Risk:** use the frontmatter risk classification and call out any escalation.
- **Boundary:** stay within the skill's declared scope and side-effect policy.

# Cryptographic Analysis

Analyse or design a **cryptographic construction** with explicit hardness assumptions, security reductions, and attack analysis.

## When to use

- The user wants a cryptographic protocol reviewed or designed.
- A security-critical component needs formal analysis.
- Key exchange, signatures, MACs, encryption, or ZK proofs are involved.

## Process

1. Identify the primitive type — symmetric encryption (block ciphers, stream ciphers), asymmetric (RSA, ECC, lattice-based), hash (collision-resistant, preimage), MAC / HMAC, signatures, key exchange, ZK proofs.
2. State hardness assumptions — DLP, CDH, DDH, RSA,factoring, LWE, SIS; quantify security level in bits.
3. Security goal — IND-CPA, IND-CCA, EUF-CMA, collision resistance, etc.
4. Attack analysis — birthday (hash), meet-in-the-middle, side-channel, replay, forward secrecy, oracle attacks.
5. Protocol design — if designing: use a well-known construction; do not invent primitives. Specify parties, messages, randomness sources, and secrets.
6. Deliver — artifact: primitive, hardness assumption, security goal, attack surface, and a security verdict (strong / moderate / weak / broken).

## Rules

- Rule: prefer standard, reviewed constructions over invented primitives.
- Rule: state security goals and attacker capabilities before evaluating a scheme.
- Rule: name hardness assumptions and estimated security level.
- Rule: include randomness, key management, side-channel, and replay considerations.
- Rule: mark any informal proof or missing reduction as a limitation.
