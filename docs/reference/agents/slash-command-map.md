# Slash Command Map

Generated to keep slash-command invocations predictable across IDEs and AI clients.

| Alias | Canonical skill | Exposed path |
|---|---|---|
| `implement` | `implement` | `.claude/skills/implement` |
| `review-pr` | `review-pr` | `.claude/skills/review-pr` |
| `publish-open-pr` | `publish-open-pr` | `.claude/skills/publish-open-pr` |
| `ship-subissue` | `ship-subissue` | `.claude/skills/ship-subissue` |
| `ask-to` | `ask-to` | `.claude/skills/ask-to` |
| `plan-review-fixes` | `plan-review-fixes` | `.claude/skills/plan-review-fixes` |
| `implement-review-fixes` | `implement-review-fixes` | `.claude/skills/implement-review-fixes` |
| `review-fix-loop` | `review-fix-loop` | `.claude/skills/review-fix-loop` |
| `worktree-swarm` | `worktree-swarm` | `.claude/skills/worktree-swarm` |
| `parallel-issue-fleet` | `parallel-issue-fleet` | `.claude/skills/parallel-issue-fleet` |
| `diagnosing-bugs` | `diagnosing-bugs` | `.claude/skills/diagnosing-bugs` |

## Compatibility rule
- Prefer the flat alias for user-facing slash-command invocations.
- `.claude/skills/` also includes domain compatibility links for consumers that still inspect categorized views; do not treat those domain links as the primary command surface.
