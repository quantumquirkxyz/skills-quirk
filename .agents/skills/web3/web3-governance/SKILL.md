---
name: web3-governance
category: skill-dev/sandbox
maturity: experimental
version: 1
description: Design and audit on-chain and off-chain governance — token voting, delegation, quadratic voting, timelock, multisig, and attack vectors.
capabilities:
  - apply web3 governance workflow
  - produce web3 governance analysis artifact
  - validate web3 governance completion criteria
outputs:
  - Web3 Governance artifact with completed sections, evidence, and limitations
sideEffects: []
dependencies: []
stopCondition: Design and audit on-chain and off-chain governance complete; required sections present; completion criteria checked.
risk: low
trustTier: 1
maxIterations: 6
---

## Operating Contract

- **Input:** Web3 Governance request, problem context, constraints, and available evidence.
- **Output:** Web3 Governance artifact with completed analysis, decisions, recommendations, and limitations.
- **Side effects:** follow the frontmatter declaration; do not change systems unless explicitly authorized.
- **Dependencies:** declared dependencies, source material, and domain references required by the task.
- **Stop condition:** Design and audit on-chain and off-chain governance is complete, required sections are present, and completion criteria are checked.
- **Risk:** use the frontmatter risk classification and call out any escalation.
- **Boundary:** stay within the skill's declared scope and side-effect policy.

# Web3 Governance Design

Design or audit a **Web3 governance system** — token voting, delegation, on-chain execution — with attack vectors and resilience analysis.

## When to use

- A protocol needs governance designed or audited.
- Token voting or delegation mechanisms need analysis.
- DAO constitution, constitution, or multiphase governance is being designed.

## Process

1. Identify governance type — on-chain (token-weighted vote, quadratic, conviction), off-chain (signal vote → timelock), or hybrid.
2. Define actors — token holders, delegates, multisig signers, core team, foundation.
3. Define proposal lifecycle — temperature check, on-chain vote, quorum, timelock, execution; veto rights.
4. Token distribution analysis — who holds tokens? Concentration vs dispersion; is the distribution stable under voting?
5. Attack vectors — vote buying, plutocracy, low turnout, plutocratic capture, executive attack (multisig override).
6. Resilience — fork rights, constitutional clauses, guardian roles; how can the community override bad governance?
7. Deliver — artifact: governance type, actors, proposal lifecycle, token distribution, attack vectors, and resilience assessment.

## Rules

- Rule: define who can propose, vote, veto, execute, and emergency-pause decisions.
- Rule: analyze token concentration, delegation, turnout, and quorum together.
- Rule: include timelock, upgrade, multisig, and guardian powers in the threat model.
- Rule: separate social legitimacy from on-chain enforceability.
- Rule: identify capture, bribery, apathy, and rushed-execution risks.
