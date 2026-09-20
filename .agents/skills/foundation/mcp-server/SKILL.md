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
- Caller responsibility: name the target MCP client, allowed tools, source credentials owner, and whether writes are forbidden or supervised.
- Operator responsibility: document trust boundaries, authentication assumptions, and the validation command for the server definition.

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
- Rule: Treat every exposed tool as an API contract with explicit inputs, outputs, and side effects.
- Rule: Do not grant write-capable tools unless the access policy names the approval path.
- Rule: Keep credentials outside committed config and reference only their expected environment variable names.
- Rule: Include a connection test that proves both positive access and denied access for out-of-scope sources.

## Security Checklist
- Define who operates the server and who consumes its tools.
- Separate read-only context retrieval from mutating integrations.
- Log tool invocation metadata without logging secret values or private payloads.
