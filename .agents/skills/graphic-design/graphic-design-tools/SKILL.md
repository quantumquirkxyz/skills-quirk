---
name: graphic-design-tools
category: graphic-design
maturity: experimental
version: 1
description: Connect graphic design tools — Figma, Adobe Creative Cloud, Canva, and local production tools — to agent workflows with explicit authentication, scopes, and safety boundaries.
capabilities:
  - evaluate tool integration options and scopes
  - define authentication and access policy
  - specify tool use cases and data flow
  - document safety boundaries and fallback behavior
  - produce graphic design tools integration artifact
outputs:
  - Graphic Design Tools artifact with tool selection, authentication design, use-case mapping, and safety boundaries
sideEffects:
  - write-files
dependencies: []
stopCondition: Graphic design tools integration plan complete; tool selection, authentication, use cases, and safety boundaries explicit.
risk: medium
trustTier: 3
maxIterations: 6
---

## Operating Contract

- **Input:** Graphic design tool integration request, tool inventory, team workflow, and security constraints.
- **Output:** Graphic Design Tools artifact with tool selection, authentication design, use-case mapping, and safety boundaries.
- **Side effects:** writes integration plans and configuration documentation to local files.
- **Dependencies:** none.
- **Stop condition:** Graphic design tools integration plan complete; tool selection, authentication, use cases, and safety boundaries explicit.
- **Risk:** medium because this skill proposes tool connections that may require API access and credentials.
- **Boundary:** designs the integration plan and documentation; does not provision API keys or execute external tool calls.

# Graphic Design Tools

Use this skill when the workflow needs to connect graphic design tools to agent or team automation. It should evaluate Figma, Adobe Creative Cloud, Canva, and local production tools against the team workflow, then define explicit authentication, scopes, data flow, and safety boundaries before any integration is built.

## Contract

- Input: tool inventory, team workflow, security constraints, and integration goals.
- Output: graphic design tools artifact covering tool selection, authentication, use-case mapping, data flow, and safety boundaries.
- Scope: design the integration plan and documentation; do not provision credentials or execute external API calls.
- Rule: start with the smallest useful integration, not the broadest possible API access.
- Rule: require explicit owner approval before any integration writes, publishes, or modifies files in external systems.
- Rule: document fallback behavior when the external tool is unavailable.

## Steps

### 1. Inventory the tool landscape

- List current tools: Figma, Adobe CC (Photoshop, Illustrator, InDesign, XD), Canva, Sketch, Affinity, Penpot, or local tools.
- Identify how each tool is currently used: design, review, handoff, production, asset management.
- Identify pain points and automation opportunities.

**Completion criterion:** tool inventory and current workflow summary saved.

### 2. Evaluate integration options per tool

For each tool, document:
- **Figma:** plugin API, REST API, MCP server, variables, components, auto layout, design tokens.
- **Adobe CC:** UXP automation, Adobe I/O, REST APIs per app, Firefly generative APIs.
- **Canva:** Canva Button, API, MCP server, brand kit, design automation.
- **Local tools:** CLI automation, file watching, export pipelines, batch processing.
- **Open alternatives:** Penpot (open-source Figma alternative), GIMP, Inkscape, Scribus.

**Completion criterion:** integration options per tool documented with scope and limitations.

### 3. Define authentication and access policy

- Choose authentication method per tool: OAuth, service account, API key, personal access token.
- Define minimum scopes required for each use case.
- Document credential storage, rotation, and audit requirements.
- Define who can approve new integrations and revoke access.

**Completion criterion:** authentication design and access policy saved.

### 4. Map use cases and data flow

- For each use case: describe input, processing, output, and owner.
- Examples: design-to-code handoff, asset export, brand token sync, batch image processing, design review automation.
- Define data residency and retention rules for design files and exported assets.
- Define rate limits, retry behavior, and backoff strategy.

**Completion criterion:** use-case map and data flow diagram saved.

### 5. Design safety boundaries

- Define what the integration must never do: overwrite production files without approval, delete source files, publish without review.
- Define approval gates: human review required for publishing, brand-critical changes, and external sharing.
- Define audit logging: what is logged, where, and for how long.
- Define incident response: what happens on quota exhaustion, API change, or unauthorized access.

**Completion criterion:** safety boundaries and fallback behavior saved.

### 6. Specify implementation path

- Order integrations by value and risk: start with read-only, then supervised write, then autonomous write.
- Define validation steps for each integration.
- Define rollback procedure if an integration misbehaves.

**Completion criterion:** implementation path with validation and rollback saved.

## Completion criteria

- tool inventory and current workflow are documented
- integration options per tool are documented
- authentication and access policy are defined
- use cases and data flow are mapped
- safety boundaries and fallback behavior are defined
- implementation path with validation and rollback is defined

## References

- `../../foundation/mcp-server/SKILL.md` — MCP server design and tool exposure
- `../../integrations/api-contracts/SKILL.md` — API contracts and versioning
- `references/domain.md` — graphic design tool landscape and API patterns
- `references/figma-integration.md` — Figma plugin API, REST API, and MCP patterns
- `references/adobe-integration.md` — Adobe I/O, UXP, and Creative Cloud APIs
- `references/canva-integration.md` — Canva API, MCP server, and brand kit patterns
