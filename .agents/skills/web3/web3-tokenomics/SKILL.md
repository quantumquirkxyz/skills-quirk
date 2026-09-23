---
name: web3-tokenomics
category: web3
maturity: stable
version: 2
description: Design token economics — supply, emission, incentives, governance, LST/LRT, restaking, points systems — with economic sustainability checks and adversarial stress tests.
capabilities:
  - design supply mechanics (emission, vesting, burn, buyback, mint/burn)
  - model incentive alignment (staking, liquidity, restaking, points)
  - evaluate governance tokenomics (voting, quorum, delegation, capture)
  - stress-test sustainability (demand shock, inflation, regulatory risk)
outputs:
  - Tokenomics design report (supply, incentives, governance, stress tests, sustainability verdict)
sideEffects: []
dependencies: []
stopCondition: Tokenomics designed; stress tests completed; sustainability verdict explicit.
risk: low
trustTier: 1
maxIterations: 6
---

# Tokenomics Design

Design the **economics of a token** — supply schedule, incentives, governance, LST/LRT, restaking, points systems — and stress-test it for sustainability and attack surfaces.

## When to use

- A project needs a token economy designed or audited.
- The user wants to understand a token's sustainability or compare token models.
- A governance or incentive mechanism needs economic analysis.
- LST, LRT, or restaking economics need evaluation.

## Process

### 1. Define purpose and type

State the token's core purpose: medium of exchange, governance, staking/reward, utility access, security (staking to secure network), restaking, or hybrid. Name the token type: fungible (ERC-20 / similar), non-fungible (NFT), or a hybrid.

**Completion criterion:** purpose and token type explicit.

### 2. Supply mechanics

Specify:

- **Initial supply** — genesis amount, mint mechanism, pre-mint / initial distribution.
- **Max supply / cap** — hard cap, soft cap, or uncapped (inflationary).
- **Emission schedule** — linear decay, exponential, or event-triggered (block rewards, staking yield, points).
- **Burn / buyback** — how tokens leave circulation; is it automatic or manual?
- **Vesting** — team / investor / ecosystem lockups; linear, cliff, or schedule.
- **Mint / burn flexibility** — can supply expand or contract in response to demand?

**Completion criterion:** initial supply, cap, emission, vesting all present with numerical values.

### 3. Incentive design

Name who earns tokens, how, and for what behaviour:

- **Validators / stakers:** yield rate, slashing conditions, unbonding period.
- **LST holders:** stETH, rETH yield; rebasing vs non-rebasing; depeg risk.
- **LRT participants:** restaking yield, AVS rewards, slashing risk (eigenLayer, Symbiotic).
- **Restakers / operators:** operator economics, delegation, slashing across AVSs.
- **Users:** rewards for participation, discounts, rebates, points systems.
- **Liquidity providers:** rewards, impermanent loss, lockup, fee sharing.
- **Treasury / ecosystem:** funding mechanism (fee capture, inflation share, grants).

**Completion criterion:** each participant class has an explicit reward mechanism and risk (slashing, lockup, impermanent loss).

### 4. Governance

Describe who decides protocol changes, parameter updates, treasury use. Include:

- Voting mechanism (token-weighted, quadratic, delegated, time-weighted, conviction).
- Quorum requirements.
- Execution mechanism (timelock, multi-sig, direct execution, oSnap, Zodiac).
- Governance attacks — vote-buying, low-turnout capture, delegation markets, flash loan voting.

**Completion criterion:** voting mechanism, quorum, execution, and at least one governance attack scenario documented.

### 5. Economic stress tests

Test for sustainability:

- **Demand shock:** what if token price falls 90%? Do incentives collapse?
- **Inflation spiral:** does emission outpace adoption?
- **Governance capture:** can a single actor acquire veto or proposal rights?
- **Value capture:** does the protocol actually capture value (fees, burns), or is it purely speculative?
- **Regulatory risk:** is the token a security under major jurisdictions?
- **LST/LRT depeg:** what happens if stETH depegs or an AVS slashes restakers?
- **Points inflation:** do points systems create unsustainable reward expectations?

**Completion criterion:** each stress scenario described; the weakest point named.

### 6. Deliver

Markdown artifact: purpose, supply, incentives, governance, stress tests, and a **sustainability verdict** — sustainable, fragile, speculative, or unsustainable.

**Completion criterion:** deliverable present; verdict is honest and supported by stress tests.

## Rules

- Rule: define value capture explicitly; a token that does not capture value is a speculative instrument.
- Rule: separate security token economics from utility token economics.
- Rule: include LST, LRT, and restaking risks when applicable.
- Rule: document vesting schedules and unlock cliffs; they are material to price discovery.
- Rule: prefer sustainable emission over high initial inflation with cliffs.
