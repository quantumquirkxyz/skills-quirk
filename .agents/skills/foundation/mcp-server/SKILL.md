---
name: mcp-server
description: Define an MCP server to connect dynamic context (issues, PRs, traces, docs) to the quirk flow, enabling agent access to external data sources securely.
version: 1
capabilities:
  - define-mcp-server
  - connect-context-sources
  - index-dynamic-data
  - expose-tools-to-agent
inputs:
  - server-config: MCP server configuration (name, endpoint)
  - sources: List of external sources (github issues, PR descriptions, docs, traces)
  - access-policy: Read-only or supervised-write
outputs:
  - mcp-server-definition: Configured server spec
  - context-index: Index of available sources
  - tool-list: Tools exposed to agent
  - connection-test: Validation of connection
stopCondition: Server configured, sources indexed, and agent can query context through MCP tools.
risk: medium
trustTier: 3
maxIterations: 3
---

# MCP Server

## Contract
- Input: server config, source list, access policy
- Output: server definition, index, tools, connection test
- Boundary: defines connection; does not write to external sources

## Process
1. Define server name and endpoint.
2. List and validate sources.
3. Configure access (read-only default).
4. Index sources.
5. Expose tools to agent.
6. Test connection.

## Guardrails
- Default to read-only access.
- Verify source authenticity.
- Preserve provenance of indexed data.
- Never expose secrets in server definition.
