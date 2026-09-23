---
name: subagent-swarm
category: foundation
maturity: experimental
description: Coordinate multiple agent sub-roles (architect, implementer, reviewer, tester) in parallel or sequential swarm mode, with clear handoff contracts and evidence recording.
version: 1
capabilities:
  - define-subagent-roles
  - assign-tasks-to-subagents
  - collect-subagent-evidence
  - merge-subagent-outputs
  - resolve-subagent-conflicts
inputs:
  - "swarm-mode: parallel or sequential (default: sequential)"
  - "roles: architect, implementer, reviewer, tester (default: implementer, reviewer)"
  - "task-spec: The spec or ticket being processed"
  - "handoff-contract: Requirements for evidence between roles"
outputs:
  - "swarm-plan: Task assignment and sequence"
  - "subagent-evidence: Evidence from each subagent"
  - "merged-output: Final result combining all subagent contributions"
  - "conflict-resolution: Any conflicts and their resolution"
sideEffects: []
dependencies: []
stopCondition: All roles completed with valid evidence, conflicts resolved, and merged output validated.
risk: medium
trustTier: 3
maxIterations: 3
---

# Subagent Swarm

## Contract
- Input: swarm mode, roles, task spec, handoff contract
- Output: swarm plan, subagent evidence, merged output, conflict resolution
- Boundary: does not replace individual skills; orchestrates them with roles

## Process
1. Define roles and mode (parallel/sequential).
2. Create swarm plan with task assignments.
3. Execute roles (parallel or sequential).
4. Collect evidence from each role.
5. Resolve conflicts (if any).
6. Merge outputs with evidence.
7. Validate final output against handoff contract.

## Guardrails
- Each subagent must record evidence independently.
- Conflicts must be resolved with explicit reasoning.
- Never merge outputs without validating evidence.
- Preserve context between role handoffs.
- Rule: Assign one owner for final integration even when work is parallelized.
- Rule: Do not let a subagent operate outside its declared role boundary without an explicit handoff.
- Rule: If outputs conflict, preserve both claims and the evidence used to choose between them.
- Rule: Stop the swarm when validation evidence is missing for a required role instead of fabricating completion.

## Contracts Per Role

### architect
- Input: spec/task description
- Output: architecture proposal, module boundaries, dependency map
- Boundary: proposes changes; does not implement code

### implementer
- Input: architecture proposal + task spec
- Output: code changes, tests, validation evidence
- Boundary: writes within sandbox/target; preserves conventions

### reviewer
- Input: implementation + evidence
- Output: review findings (standards/spec), repair plan if needed, clean evidence
- Boundary: read-only analysis of code and evidence; proposes fixes; does not merge

### tester
- Input: implementation + test assertions
- Output: test suite, coverage report, execution log
- Boundary: does not modify source beyond fixtures; surfaces failures with evidence
