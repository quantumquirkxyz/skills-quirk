# Automatic Refinement Agent Graph

## Graph

```text
preflight
  -> grill-agent
  -> research-agent
  -> domain-agent -> graph-skill-routing -> selected domain Skills
  -> brainstorm-agent
  -> synthesis
  -> critic-agent
  -> bounded correction
  -> verifier-agent
  -> refined-awaiting-review
```

The four independent-analysis roles may run concurrently. `synthesis`, `critic-agent`, correction, and `verifier-agent` are ordered barriers. The orchestrator is the sole merge owner and never substitutes one role for another.

## DelegationBrief

Every lease carries `schemaVersion`, `operationId`, `parentOperationId`, `runId`, `roleId`, `wave`, `objective`, `inputDigest`, `sourceDigests`, `outputSchema`, `toolGuidance`, `boundaries`, `stopCondition`, `effortBudget`, `authorityPolicy`, `leaseExpiry`, `redactionPolicy`, and `nextOwner`.

## Typed Handoff

```json
{
  "operationId": "op-...",
  "parentOperationId": null,
  "roleId": "research-agent",
  "wave": "independent-analysis",
  "status": "succeeded",
  "summary": "bounded claim summary",
  "artifactRef": "artifact://...",
  "evidenceRefs": ["evidence://..."],
  "inputDigest": "sha256:...",
  "outputDigest": "sha256:...",
  "verifierRef": null,
  "nextOwner": "orchestrator",
  "validation": {"schema": "passed", "integrity": "passed"}
}
```

Missing fields reject the handoff. `blocked`, `cancelled`, `validation-failed`, and `outcome-unknown` handoffs must explain the reason and never masquerade as success.

## Skill/Subagent Boundary

Canonical Skills provide methods, prerequisites, schemas, and safety policy. Subagents are leased role executions that consume a brief and return a handoff. Domain routing may select Skills, but only the orchestrator may schedule the mandatory roles. A routed Skill is not proof that its corresponding subagent executed.
