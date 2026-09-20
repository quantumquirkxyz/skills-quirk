---
name: web3-defi
category: skill-dev/sandbox
maturity: experimental
version: 1
description: Analyse DeFi protocols — AMMs, lending, stablecoins, derivatives — across protocol mechanics, economic security, and composability risks.
capabilities:
  - apply web3 defi workflow
  - produce web3 defi analysis artifact
  - validate web3 defi completion criteria
outputs:
  - Web3 Defi artifact with completed sections, evidence, and limitations
sideEffects: []
dependencies: []
stopCondition: Analyse DeFi protocols complete; required sections present; completion criteria checked.
risk: low
trustTier: 1
maxIterations: 6
---

## Operating Contract

- **Input:** Web3 Defi request, problem context, constraints, and available evidence.
- **Output:** Web3 Defi artifact with completed analysis, decisions, recommendations, and limitations.
- **Side effects:** follow the frontmatter declaration; do not change systems unless explicitly authorized.
- **Dependencies:** declared dependencies, source material, and domain references required by the task.
- **Stop condition:** Analyse DeFi protocols is complete, required sections are present, and completion criteria are checked.
- **Risk:** use the frontmatter risk classification and call out any escalation.
- **Boundary:** stay within the skill's declared scope and side-effect policy.

# DeFi Protocol Analysis

Analyse a **DeFi protocol** — AMM, lending, stablecoin, or derivative — for mechanics, economic security, composability, and regulatory posture.

## When to use

- The user wants to understand, build on, or invest in a DeFi protocol.
- A protocol needs an economic or security due-diligence pass.
- A quant or portfolio strategy involves DeFi as an asset class or venue.

## Process

### 1. Classify the protocol type

Name the category and specific protocol:

- **AMM:** Uniswap, Curve, Balancer; bonding curve, fee tiers, concentrated liquidity.
- **Lending / borrowing:** Aave, Compound, Morpho; supply / borrow rates, utilisation curves.
- **Stablecoins:** over-collateralised (DAI), partially (LUSD), algorithmic (logic vs reserve).
- **Derivatives / structured:** GMX, dYdX, Perp; synthetic vs physically-settled.
- **Yield aggregators:** Yearn, Convex; strategy composition, fee sharing.

**Completion criterion:** category and protocol named; brief mechanism described.

### 2. Core mechanics

- **State variables:** what state does the protocol hold? (Reserves, collateral, positions.)
- **Invariant:** what mathematical invariant holds? (x·y=k, utilisation U = borrows/supply, etc.)
- **Mechanisms:** arbitrage, liquidation, fee distribution — state each with its trigger.
- **Parameters:** fee tiers, collateral factors, liquidation thresholds, rate models.

**Completion criterion:** invariant, mechanisms, and parameters all stated.

### 3. Economic security

- **TVL:** total value locked; source and meaning (TVL ≠ value; can be inflated).
- **Collateral:** over-collateralisation ratio; worst-case if collateral drops 50%.
- **Oracle:** how is price obtained? Chainlink? TWAP? Univ3? What if it fails?
- **Attack surface:** oracle manipulation, insolvency cascade, liquidation spiral, governance attack.

**Completion criterion:** TVL, collateral ratio, oracle, and at least one attack surface documented.

### 4. Composability and systemic risk

- **Composability:** does it call other protocols? Can a reentrancy or price-manipulation cascade occur?
- **Contagion:** if one major protocol fails (UST-style), what is the contagion path?
- **Fee sustainability:** are