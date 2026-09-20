---
name: web3-l2-scaling
category: skill-dev/sandbox
maturity: experimental
version: 1
description: Analyse Layer-2 scaling solutions — Rollups (optimistic, ZK), validiums, state channels — with security assumptions, data availability, and cost trade-offs.
capabilities:
  - apply web3 l2 scaling workflow
  - produce web3 l2 scaling analysis artifact
  - validate web3 l2 scaling completion criteria
outputs:
  - Web3 L2 Scaling artifact with completed sections, evidence, and limitations
sideEffects: []
dependencies: []
stopCondition: Analyse Layer-2 scaling solutions complete; required sections present; completion criteria checked.
risk: low
trustTier: 1
maxIterations: 6
---

## Operating Contract

- **Input:** Web3 L2 Scaling request, problem context, constraints, and available evidence.
- **Output:** Web3 L2 Scaling artifact with completed analysis, decisions, recommendations, and limitations.
- **Side effects:** follow the frontmatter declaration; do not change systems unless explicitly authorized.
- **Dependencies:** declared dependencies, source material, and domain references required by the task.
- **Stop condition:** Analyse Layer-2 scaling solutions is complete, required sections are present, and completion criteria are checked.
- **Risk:** use the frontmatter risk classification and call out any escalation.
- **Boundary:** stay within the skill's declared scope and side-effect policy.

# Layer-2 Scaling Analysis

Analyse a **Layer-2 scaling solution** — rollups, validiums, state channels — for security assumptions, throughput, cost, and trade-offs vs L1.

## When to use

- The user wants to choose or build on an L2 solution.
- An L2 protocol needs an architecture review.
- Cost / throughput comparison between L1 and L2 is needed.

## Process

1. Classify — Optimistic Rollup (Arbitrum, Optimism), ZK Rollup (zkSync, StarkNet, Polygon zkEVM), Validium (StarkEx), State Channels (Lightning Network), Plasma.
2. Architecture — where is the state? Who is the sequencer/validator? How is dispute resolution handled?
3. Data availability — on-chain (calldata, blobs) vs off-chain DA; trade-off (cost vs trust assumption).
4. Security assumptions — honest verifier assumption, ZK soundness, fraud proof window (7 days for Optimistic); slashing conditions.
5. Throughput & cost — TPS ceiling; cost per transaction (L1 settlement vs L2 execution); compare to L1.
6. Composability — can L2 contracts call each other? Is cross-L2 communication needed?
7. Deliver — artifact: L2 type, architecture, security assumptions, throughput/cost, and a recommendation based on use case (high security = ZK, high throughput = validium, maximum compatibility = optimistic).

## Rules

- Rule: classify the L2 before comparing cost, trust, or security assumptions.
- Rule: state data-availability model and sequencer trust explicitly.
- Rule: include withdrawal, bridge, fraud-proof, validity-proof, and upgrade risks.
- Rule: separate throughput claims from finality and settlement guarantees.
- Rule: match recommendation to use-case priorities rather than generic L2 rankings.
