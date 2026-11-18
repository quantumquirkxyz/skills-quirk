# Software Engineering Knowledge-Area Matrix

> **Status:** Phase 0 baseline | **Owner:** quirk Skills maintainers | **Scope:** documentation only; no canonical skill or generated projection is changed | **Last reviewed:** 2026-11-17 | **Review cadence:** quarterly and on SWEBOK/skill-inventory change

This matrix maps 18 SWEBOK v4.0a areas to **canonical skills**. A mapping means relevance, not completeness or conformance. `Strong` means multiple actionable skills and gates; `Partial` means useful coverage with material omissions; `Gap` means no dedicated seam.

| SWEBOK area | Strength | Representative canonical skills | Gap / next probe |
|---|---|---|---|
| Software requirements | Strong | `project/to-spec`, `project/to-tickets`, `product/prod-prd-writing`, `integrations/api-contracts`, `data/data-contracts`, `ux/ux-research` | Formal requirements validation, safety cases, and traceability depth. |
| Software architecture | Strong | `foundation/codebase-design`, `platform/system-design/system-design`, `engineering/improve-codebase-architecture`, `backend/backend-architecture`, `backend/microservices`, `backend/service-mesh` | Architecture decision quality and quantitative trade-offs. |
| Software design | Strong | `foundation/api-design`, `frontend/react`, `frontend/design-system`, `frontend/state-management`, `db/db-relational-design`, `compilers/compiler-design` | Common design notation and design-level verification. |
| Software construction | Strong | `project/implement`, `delivery/tdd`, `compilers/compilers`, `frontend/styling`, `backend/backend-queues`, `iot/iot-embedded` | Toolchain-specific secure coding and construction standards. |
| Software testing | Strong | `delivery/testing`, `delivery/tdd`, `qa/qa-automation`, `qa/qa-manual-testing`, `frontend/frontend-testing`, `compilers/compiler-testing`, `qa/qa-security-testing` | Model-based, mutation, interoperability, and safety testing. |
| Software maintenance | Partial | `delivery/diagnosing-bugs`, `delivery/review-fix-loop`, `delivery/implement-review-fixes`, `platform/release-management`, `devops/incident-response`, `db/db-migrations` | Maintenance economics, modernization, and end-of-life evidence. |
| Configuration management | Strong | `devops/gitops`, `platform/trunk-based-workflow`, `skill-dev/lockfile-maintenance`, `routing/worktree-swarm`, `integrations/pr-operations` | Baselines, configuration audits, and artifact identity. |
| Engineering management | Strong | `professional/professional-project-management`, `product/prod-okr-planning`, `delivery/loop-budget`, `engineering/software-factory`, `foundation/subagent-swarm`, `routing/wayfinder` | Estimation calibration, earned value, supplier management. |
| Engineering process | Strong | `project/spec-driven-development`, `routing/work-item-router`, `delivery/implement`, `delivery/review-pr`, `platform/quality-gates/gate-ci` | Tailoring and process capability measurement. |
| Models and methods | Strong | `project/spec-driven-development`, `delivery/tdd`, `devops/devops-ci-cd-pipeline`, `foundation/skill-composition`, `graph/skill-graph-engineering`, `routing/grill-me` | Comparative method selection and empirical suitability. |
| Software quality | Strong | `platform/quality-gates/gate-ide`, `platform/quality-gates/gate-pre-commit`, `platform/quality-gates/gate-ci`, `skill-dev/skill-quality-gate`, `delivery/code-review`, `data/data-quality` | Quality models, cost accounting, independent quality authority. |
| Software security | Strong | `sec/sec-security-audit`, `sec/sec-threat-modeling`, `sec/sec-cryptography-applied`, `sec/zero-trust`, `sec/supply-chain-security`, `integrations/auth` | Security assurance cases and disclosure processes. |
| Professional practice | Partial | `professional/professional-communication`, `docs/docs-technical-writing`, `docs/docs-adrs`, `research/research-literature-review`, `foundation/verify-delegation` | Licensing, ethics, competence, accessibility, conflicts. |
| Engineering economics | Partial | `finance/finance-corporate-val`, `finance/finance-dcf`, `devops/cost-optimization`, `product/pro-market-analysis`, `platform/performance/performance` | TCO, cost of delay, option value, benefits realization. |
| Computing foundations | Partial | `cs/cs-algorithms`, `cs/cs-data-structures`, `cs/cs-complexity-analysis`, `os/os-kernel`, `os/os-processes`, `networking/networking-protocols`, `compilers/compilers` | Distributed systems, concurrency, and hardware learning path. |
| Mathematical foundations | Partial | `math/math-pure-proofs`, `math/math-formal-proof`, `math/math-linear-algebra`, `math/math-probability-models`, `math/math-optimization`, `math/math-cryptography` | Formal semantics, discrete math, statistics, numerical analysis. |
| Engineering foundations | Partial | `physics/physics-classical`, `physics/physics-thermo`, `iot/iot-embedded`, `xr/xr-development`, `os/os-kernel`, `networking/networking` | Systems/reliability engineering, human factors, safety engineering. |

## Relevant canonical paths

The Phase 0 relevant inventory is intentionally path-based and excludes unrelated specialist material. It covers more than the requested 178 paths in these maintained groups; the current expansion is 196 paths, and each resolves to `.agents/skills/<path>/SKILL.md`:

```text
accessibility/{accessibility,accessibility-design,accessibility-testing}
ai/{agent-orchestration,ai-ml-pipeline,ai-model-evaluation,ai-prompt-engineering,llm-eval,llm-fine-tuning,llmops,mlops,prompt-template-library,rag-pipeline,structured-output}
backend/{api-gateway,backend-architecture,backend-caching,backend-queues,distributed-tracing,event-driven-architecture,grpc-connect,microservices,rate-limiting,serverless,service-mesh,websockets}
cms/{cms-access-control,cms-architecture,cms-content-strategy,localization}
compilers/{compiler-design,compiler-testing,compilers}
cs/{cs-algorithms,cs-complexity-analysis,cs-computability,cs-data-structures}
data/{data-catalog,data-contracts,data-etl-pipeline,data-lineage,data-quality,data-streaming,data-versioning,data-warehouse-modeling,feature-store,semantic-layer,stream-processing}
db/{db-migrations,db-nosql-modeling,db-query-optimization,db-relational-design}
delivery/{code-review,diagnosing-bugs,implement,implement-review-fixes,loop-budget,plan-review-fixes,prototype,review-fix-loop,review-pr,tdd,testing,webapp-testing}
devops/{backup-disaster-recovery,chaos-engineering,cost-optimization,devops-ci-cd-pipeline,devops-feature-flags,devops-k8s-orchestration,devops-terraform-iac,gitops,incident-response,secret-management}
docs/{docs-adrs,docs-knowledge-base,docs-technical-writing}
engineering/{agent-native-engineering,improve-codebase-architecture,software-factory}
finance/{finance-corporate-val,finance-dcf,finance-portfolio-theory}
foundation/{agent-observability,api-design,codebase-design,context-engine,domain-modeling,mcp-server,observability,skill-composition,subagent-swarm,verify-delegation}
frontend/{design-system,frontend-testing,mobile,nextjs,react,remix,state-management,styling}
graph/{graph-skill-routing,skill-graph-engineering}
integrations/{api-contracts,auth,browser-automation,payments,pr-operations,search}
iot/iot-embedded
loop/{loop-engineering,retry-backoff}
math/{math-computation-reproducible,math-computational,math-cryptography,math-formal-proof,math-linear-algebra,math-optimization,math-paper-collaboration,math-probability-models,math-pure-proofs}
networking/{networking,networking-protocols,networking-security}
os/{os-kernel,os-memory,os-processes}
platform/{deployment,feature-flag,performance/performance,quality-gates/gate-ci,quality-gates/gate-ide,quality-gates/gate-post-merge,quality-gates/gate-pre-commit,release-management,system-design/system-design,trunk-based-workflow}
product/{brainstorming,prod-ab-testing,prod-okr-planning,prod-prd-writing}
professional/{pro-market-analysis,professional-communication,professional-project-management}
project/{analyze-artifacts,docs-management,project-development,project-viability,spec-driven-development,to-spec,to-tickets}
qa/{performance-testing,qa-automation,qa-manual-testing,qa-security-testing}
research/{research-data-archiving,research-literature-review,scientific-hypothesis}
routing/{artifact-handoff,capability-router,context-pack,handoff,knowledge-curator,parallel-issue-fleet,publish-open-pr,ship-subissue,triage,wayfinder,work-item-router}
sec/{cloud-security,compliance,container-security,incident-forensics,sec-cryptography-applied,sec-privacy-engineering,sec-security-audit,sec-threat-modeling,secret-management-security,supply-chain-security,zero-trust}
skill-dev/{evaluate-skill,lockfile-maintenance,side-effect-auditor,skill-audit,skill-dependency-graph,skill-quality-gate,skill-testing-framework,workflow-fixture-author}
ux/{interaction-design,ux-accessibility,ux-research}
web3/{web3-smart-contracts,web3-governance,web3-consensus,web3-defi,web3-tokenomics}
```

Brace groups are documentation shorthand for individual canonical paths. Verify inventory with `rg --files .agents/skills -g 'SKILL.md'` when maintaining this document.

## Sources

- [SWEBOK v4.0a](https://www.computer.org/education/bodies-of-knowledge/software-engineering-v4)
- [quirk context and vocabulary](../../../CONTEXT.md)
- [canonical skill inventory](../agents/skill-inventory.md)
