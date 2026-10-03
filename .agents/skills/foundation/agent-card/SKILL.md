---
name: agent-card
category: foundation
maturity: stable
version: 1
description: Generates and maintains Agent Cards for A2A (Agent-to-Agent) discovery.
capabilities:
  - generate-agent-card
  - validate-agent-card
  - emit-agent-card-json
  - update-agent-card-index
inputs:
  - "skill-path: relative path to the skill directory (e.g., .agents/skills/{category}/{skill})"
  - "skill-frontmatter: parsed frontmatter from SKILL.md"
outputs:
  - type: object
    description: AgentCard artifact for A2A discovery
    properties:
      agentCard:
        type: object
        description: JSON AgentCard conforming to agent-card-schema.json
        properties:
          name:
            type: string
          description:
            type: string
          url:
            type: string
          version:
            type: string
          capabilities:
            type: object
          authentication:
            type: object
          skills:
            type: array
      markdown:
        type: string
        description: Markdown representation of the Agent Card
      completionCriteriaMet:
        type: boolean
sideEffects:
  - write-files
dependencies: []
stopCondition: Agent Card JSON emitted to platform/agent-cards, index updated, and completion criteria checked.
risk: low
trustTier: 1
maxIterations: 6
modelTier: router
promptVersion: "2.0"
artifactType: plan
evaluators:
  - behavioral
  - regression
  - traceability
  - quality-bar
fixturesPath: .agents/skills/platform/fixtures/behavioral/agent-card.json
diataxis: how-to
tags: [agent-card, a2a, discovery, metadata]
compatibility: [mcp-server, skill-audit, skill-dependency-graph]
approvalRequired: false
approvalFor: []
---

## Contract

- **Input:** skill directory path and its frontmatter.
- **Output:** an AgentCard JSON, Markdown card, and updated index.
- **Scope:** read-only extraction from existing skill metadata; no skill content modification.
- **Rule:** validate the generated card against `agent-card-schema.json` before writing.
- **Rule:** keep the card idempotent — identical input produces identical output.
- **Rule:** do not invent capability flags not grounded in frontmatter.
- Rule: validate against the corresponding JSON schema before emitting the artifact.

## Provenance

| Quality-Bar Question | Evidence |
|---|---|
| **Intent** | Generates and maintains Agent Cards for A2A (Agent-to-Agent) discovery. |
| **Input** | skill directory path and its frontmatter. |
| **Output** | an AgentCard JSON, Markdown card, and updated index. |
| **Side effects** | write-files (JSON card, Markdown summary, index update). |
| **Boundaries** | read-only extraction from existing skill metadata; no skill content modification. |
| **Completion criteria** | Agent Card JSON emitted; schema-validated; index updated; completion criteria checked. |

## Artifact

This skill emits a structured AgentCard JSON and a Markdown card. The JSON is the machine-readable A2A discovery record; the Markdown is the human-readable card summary. Both are emitted together so the index and skill registry stay consistent.

## Process

1. Read skill frontmatter from `.agents/skills/{category}/{skill}/SKILL.md`.
2. Validate the extracted metadata against `agent-card-schema.json`.
3. Emit AgentCard JSON to `.agents/skills/platform/agent-cards/{category}-{skill}.json`.
4. Update `index.json` in the same directory.

## Completion criteria

- the AgentCard JSON is written and schema-valid
- the Markdown card is emitted
- the index is updated with the new card
- completion criteria are explicitly checked

---
@include .agents/skills/platform/contract-base.xml
