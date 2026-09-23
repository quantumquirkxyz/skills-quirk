---
name: web3-governance
category: web3
maturity: stable
version: 2
description: Design and audit on-chain and off-chain governance — token voting, delegation, quadratic voting, timelock, multisig, oSnap, Zodiac, EIP-7702 delegation — with attack vectors and resilience analysis.
capabilities:
  - design on-chain / off-chain governance flows (Governor Bravo v2, oSnap, Zodiac)
  - analyse token concentration, delegation markets, and quorum mechanics
  - audit timelock, multisig, guardian, and emergency pause patterns
  - model capture, bribery, apathy, and rushed-execution risks
outputs:
  - Governance design or audit report (actors, lifecycle, token distribution, attack vectors, resilience)
sideEffects: []
dependencies: []
stopCondition: Governance model documented; attack vectors assessed; resilience recommendations made.
risk: low
trustTier: 1
maxIterations: 6
---

# Web3 Governance Design

Design or audit a **Web3 governance system** — token voting, delegation, on-chain execution, oSnap, Zodiac, EIP-7702 — with attack vectors and resilience analysis.

## When to use

- A protocol needs governance designed or audited.
- Token voting or delegation mechanisms need analysis.
- DAO constitution, multiphase governance, or on-chain execution is being designed.
- oSnap (snapshot-based execution) or Zodiac (modular governance) modules are being evaluated.

## Process

### 1. Identify governance type

Name the category and specific mechanism:

- **On-chain token voting:** Governor Bravo v2, OpenZeppelin Governor; quorum, voting delay, timelock.
- **Off-chain signal → on-chain execution:** Snapshot + oSnap; safe non-custodial execution.
- **Delegation markets:** delegation to delegates, delegation markets (e.g., Delegated.vote), revocable delegation.
- **Multisig / guardian:** Gnosis Safe, Zodiac modules (delay, arbitration, custom roles).
- **Hybrid:** off-chain signalling with on-chain execution via timelock and multisig.

**Completion criterion:** governance type and mechanism named.

### 2. Define actors and roles

- **Proposers:** who can submit proposals? Thresholds, whitelist, or open?
- **Voters:** token holders, delegates, or representatives? Delegation mechanics?
- **Executors:** who executes after timelock? Multisig, governor, or automatic?
- **Guardians / emergency council:** who can pause or veto? Under what conditions?

**Completion criterion:** actor list with permissions and escalation paths.

### 3. Proposal lifecycle

Define each phase with explicit rules:

- **Temperature check / signalling:** informal consensus before on-chain proposal.
- **Proposal creation:** queuing, quorum, voting delay.
- **Voting:** duration, quorum, threshold, abstain / against / for options.
- **Timelock:** delay between vote end and execution; emergency cancel window.
- **Execution:** automatic vs manual; who signs the transaction?

**Completion criterion:** lifecycle phases with parameters and failure paths.

### 4. Token distribution and delegation

- **Distribution:** concentration vs dispersion; largest holder %; exchange holdings.
- **Delegation:** direct voting vs delegated; delegate reputation; delegation revocation.
- **Quorum design:** fixed vs dynamic quorum (e.g., quorum + 1, or quorum = max(prev, threshold)).
- **Voter apathy:** how does low turnout affect legitimacy and attack surface?

**Completion criterion:** token distribution and delegation mechanics assessed.

### 5. Attack vectors and resilience

- **Vote buying / bribery:** decentralised bribery (darkboard, OTC), delegation markets, flash loans.
- **Plutocracy / whale dominance:** single-holder veto; governance token concentration.
- **Low turnout attacks:** quorum manipulation; last-minute whale vote.
- **Executive attack:** multisig override; guardian centralisation.
- **Rushed execution:** short timelock + whale vote = rug pull risk.
- **Fork rights:** can the community fork if governance is captured?

**Completion criterion:** attack vectors documented with likelihood and impact.

### 6. Resilience and override mechanisms

- **Constitutional clauses:** what decisions require supermajority or cannot be changed?
- **Fork rights:** how does the community exit a captured governance?
- **Social legitimacy:** off-chain signalling, forum consensus, community norms.
- **Transparency:** proposal discussions, vote records, execution trails.

**Completion criterion:** resilience mechanisms and exit paths documented.

### 7. Deliver

Artifact: governance type, actors, proposal lifecycle, token distribution, attack vectors, resilience assessment, and recommendations.

**Completion criterion:** artifact complete; recommendations explicit.

## Rules

- Rule: define who can propose, vote, veto, execute, and emergency-pause decisions.
- Rule: analyze token concentration, delegation, turnout, and quorum together.
- Rule: include timelock, upgrade, multisig, guardian, and oSnap/Zodiac powers in the threat model.
- Rule: separate social legitimacy from on-chain enforceability.
- Rule: identify capture, bribery, apathy, and rushed-execution risks.
- Rule: document EIP-7702 delegation if used for governance accounts.
