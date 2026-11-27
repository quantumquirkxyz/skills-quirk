# Multi-agent Protocol

Use this protocol when more than one agent or session works on the same project.

```mermaid
flowchart TD
    A[Agent A owns work item] --> B[Handoff to Agent B]
    B --> C{Names source artifact?}
    C -->|no| D[Stop: handoff incomplete]
    C -->|yes| E{Names next consumer?}
    E -->|no| D
    E -->|yes| F{Names status?}
    F -->|no| D
    F -->|yes| G{Names validation evidence?}
    G -->|no| D
    G -->|yes| H{Names unresolved blockers?}
    H -->|no| D
    H -->|yes| I[Continue]
    I --> J{Conflicting branch/ticket?}
    J -->|yes| K[Stop and reconcile ownership]
    J -->|no| L[Proceed]
    L --> M{Plan stale?}
    M -->|yes| N[Rerun measurement step]
    M -->|no| O[Execute plan]
```

## Rules

- One agent owns one work item at a time.
- Every handoff names the source artifact, next consumer, current status, validation evidence, and unresolved blockers.
- Do not duplicate work already claimed in the tracker.
- Do not merge review, repair, and ship responsibilities into one opaque action.
- A subagent may investigate or review, but the main agent owns final synthesis and user-facing state.
- A work item is not claimable until its owner, scope, and next consumer are recorded in the tracker or handoff artifact.
- If two sessions discover a new overlap not covered by the matrix, pause mutation, record the overlap in `conflict-matrix.md`, and resume only after a primary rule exists.
- If a handoff is incomplete, keep the work with the current owner rather than letting another agent infer intent from the branch name or issue title.

## Standard Handoffs

| Producer | Consumer | Artifact |
|---|---|---|
| `grill-with-docs` | `automatic-refinement` | Clarified decisions, glossary/ADR updates |
| `automatic-refinement` | `architecture-evaluation` / `codebase-design` | Refinement artifact with explicit next consumer |
| `architecture-evaluation` / `codebase-design` | `to-spec` | Approved architecture/design artifact or approved not-applicable rationale |
| `to-tickets` | `parallel-issue-fleet` | TicketArtifact with validated DAG waves |
| `parallel-issue-fleet` | `implement` | Per-issue isolated environment and immutable issue context |
| `parallel-issue-fleet` | `publish-open-pr` | FleetRunArtifact with validated branches and ImplementArtifact references |
| `to-tickets` | `implement` | Claimable ticket with architecture/design provenance |
| `review-pr` | `plan-review-fixes` | Standards and Spec findings |
| `plan-review-fixes` | `implement-review-fixes` | Review Fix Plan PR comment |
| `implement-review-fixes` | `review-pr` | Implementation note and validation |
| `implement` | `publish-open-pr` | Validated local commit and exact fixed point; no remote publication |
| `publish-open-pr` | `trunk-based-workflow` | Pushed branch and opened PR with CI evidence |
| `trunk-based-workflow` | `review-pr` | Passing pre-merge guard |
| `review-pr` | `ship-subissue` | Clean review state |
| `ship-subissue` | `release-management` | Merged commit and release-candidate inputs |
| `release-management` | `deployment` | Approved release candidate with provenance, owner, rollback, canary, and CI gates |
| `deployment` | `observability` / `sre` | Deployment result and health signals |
| `worktree-swarm` | `implement` | Per-issue worktree, issue context, and local agent manifest |

## Conflict Handling

| Situation | Rule |
|---|---|
| Two agents touch same branch or ticket | Stop and reconcile ownership |
| Plan is stale | Rerun the measurement step before editing |
| Validation fails after repair | Keep PR in review-fix-loop, do not ship |
| New overlap appears and no primary rule exists | Stop routing, update the conflict matrix, then resume with an explicit primary |
