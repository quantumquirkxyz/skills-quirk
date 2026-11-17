---
name: "math-cryptography"
category: "math"
maturity: "stable"
version: "2"
description: "Analyse cryptographic constructions — symmetric, asymmetric, hashing, MACs, zero-knowledge — with NIST post-quantum standards (FIPS 203 ML-KEM, FIPS 204 ML-DSA, FIPS 205 SLH-DSA), formally verified implementations, constant-time discipline, side-channel countermeasures, machine-checked security reductions (EasyCrypt/F*), and KAT vectors."
license: "MIT"
capabilities:
  - apply math cryptography methods within explicit math boundaries
  - analyze analyse cryptographic constructions — symmetric, asymmetric, hashing, macs, zero-knowledge — with security reductions, hardness assumptions, and attack analysis with assumptions, constraints, and failure modes
  - produce and validate a math artifact with evidence, decisions, and next steps
outputs: "math artifact containing the scoped result, supporting evidence, validation status, and residual risks required by this skill's contract."
sideEffects: []
dependencies: []
stopCondition: "Cryptographic analysis complete; security verdict stated; attack surface documented; assumptions listed; NIST PQ default applied; KAT vectors verified; constant-time discipline confirmed."
risk: "medium"
trustTier: "3"
maxIterations: "6"
promptVersion: "2.0"
artifactType: "math"
modelTier: "reasoning"
evaluators: ["behavioral", "regression"]
fixturesPath: "evals/behavioral/math-cryptography.json"
fixtures:
  kat-vectors:
    description: "Known Answer Test vectors for ML-KEM-768, ML-DSA-65, SLH-DSA-SHA256"
    source: "NIST CAVP"
  constant-time:
    description: "Verify no secret-dependent branches or memory accesses in assembly"
    tool: "ct-verif / constant-time analyzer"
  spectre-v1:
    description: "Spectre v1 check on assembly code"
    tool: "spectre-v1 analyzer"
  side-channel:
    description: "Masking and fault injection countermeasures verified"
    tool: "masking/fault-injection verifier"
diataxis: "how-to"
tags: ["math"]
compatibility: ["sec-cryptography-applied", "integrations/auth"]
approvalRequired: "true"
approvalFor: ["write-files"]
---

## Contract

- Input: skill invocation with the user's request and available context.
- Output: a structured artifact or guidance aligned to the skill's declared outputs.
- Scope: stay within the skill's declared boundaries; do not broaden without explicit direction.
- Rule: follow the skill's completion criteria and stop condition exactly.

## Provenance

| Question | Answer |
|---|---|
| What is the source of truth? | The user's request, originating spec/issue, and the skill's declared outputs |
| What is in scope? | Work covered by the skill's acceptance criteria and completion rules |
| What is explicitly out of scope? | Files, behaviors, and decisions outside the skill's declared boundary |
| Who or what consumes this artifact afterward? | The next skill in the workflow or the user |
| What evidence proves it is done? | Completion criteria met, artifact saved, validation passed |
| What risk remains? | Subjective judgment calls, missing context, or external dependency failures


## Artifact

Emit `MathCryptographyArtifact` as both:
- JSON: `.agents/skills/platform/artifacts/math-cryptography/{identifier}.json`
- Markdown view: same filename with `.md` extension


# NIST Post-Quantum Standards

- Default KEM: FIPS 203 ML-KEM-768 (NIST security level 3)
- Default signature: FIPS 204 ML-DSA-65 (NIST security level 3)
- Stateless hash-based signature: FIPS 205 SLH-DSA-SHA256
- No other PQ algorithms permitted without explicit justification and risk approval.
- Hybrid classical/PQ constructions allowed only as transition layer; PQ component must be NIST-approved.

# Deprecated Classical Algorithms

- ECDSA: deprecated after 2030, disallowed after 2035 (NIST IR 8547)
- EdDSA: deprecated after 2030, disallowed after 2035 (NIST IR 8547)
- RSA ≥112-bit: deprecated after 2030, disallowed after 2035 (NIST IR 8547)
- Migration required for all deprecated algorithms; document deprecation triggers and rollback.

# Formally Verified Implementations

- Require formally verified implementations where available:
  - libcrux (formally verified ML-KEM, ML-DSA, X25519, X448)
  - libjade (formally verified X25519)
  - HACL* (F*-verified cryptographic library)
- Machine-checked proofs must be referenced in artifact; informal proofs marked as limitation.

# Constant-Time Discipline

- No secret-dependent branches or memory accesses.
- Constant-time required for all secret operations (key generation, encapsulation, signing, decapsulation, verification).
- Verify at assembly level; assembly must not introduce secret-dependent control flow or data-dependent memory access patterns.

# Side-Channel Countermeasures

- Masking: Boolean/arithmetic masking required for side-channel exposed implementations.
- Fault injection verification: redundant computation, infection barriers, and fault detectors required.
- Countermeasures verified by dedicated fixtures; results recorded in artifact.

# Security Reductions

- Security reductions traceable to EasyCrypt/F* machine-checked proofs.
- Cite the specific EasyCrypt/F* proof artifact and security notion (IND-CPA, IND-CCA, EUF-CMA, etc.).
- Informal reductions only permitted when no machine-checked proof exists; mark as limitation with migration plan.

# KAT Vectors

- Known Answer Test vectors required for ML-KEM-768, ML-DSA-65, SLH-DSA-SHA256 parameter sets.
- Vectors sourced from NIST CAVP; include expected encaps/decapsulate, sign/verify outputs.
- KAT verification mandatory before any implementation is accepted.

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
- Rule: include crypto-agility and post-quantum migration analysis: algorithm identifiers, hybrid negotiation, downgrade resistance, key/certificate rotation, ciphertext/signature inventory, and deprecation triggers.
- Rule: threat-model quantum, classical, side-channel, fault, nonce/replay, oracle, implementation, supply-chain, and key-compromise attackers; state trust boundaries and least-privilege key use.
- Rule: require adversarial/property/fuzz fixtures for round-trip and authentication properties, malformed encodings, nonce uniqueness, transcript binding, invalid-curve/padding cases, and hybrid downgrade attempts.
- Rule: provide a rollback/safety case for parameter or algorithm changes, including compatibility window, revocation, recovery keys, evidence gates, and verifiable stop conditions when assumptions or randomness quality are unknown.
- Rule: record provenance for standards, reductions, parameter sets, implementations, test vectors, and source claims; never present a proof or experiment as executed when it was only designed.

# Quality Gates

- All primitives must use NIST-approved algorithms (FIPS 203 ML-KEM, FIPS 204 ML-DSA, FIPS 205 SLH-DSA).
- Constant-time verification mandatory (no secret-dependent branches or memory accesses).
- Security reductions must reference machine-checked proofs (EasyCrypt/F*).
- KAT vectors verified for ML-KEM-768, ML-DSA-65, SLH-DSA-SHA256.
- Deprecated classical algorithms flagged for migration (ECDSA, EdDSA, RSA ≥112-bit).

## Completion

- the skill's completion criteria are explicitly checked
- the artifact is saved and validated
- any blockers or skipped validations are documented
- the next consumer is identified or the work is handed off
- quality gates all passed or explicitly documented as blocked
---
@include .agents/skills/platform/contract-base.xml
