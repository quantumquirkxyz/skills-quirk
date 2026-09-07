# Slash Command Map

Generated to make plain slash-command invocations predictable across IDEs and AI clients.

| Alias | Canonical skill | Exposed path(s) | Notes |
|---|---|---|---|
| `implement` | `delivery/implement` | `.claude/skills/implement`, `.claude/skills/delivery/implement` | Primary implementation skill. |
| `review-pr` | `delivery/review-pr` | `.claude/skills/review-pr`, `.claude/skills/delivery/review-pr` | PR review and remediation entry point. |
| `publish-open-pr` | `routing/publish-open-pr` | `.claude/skills/publish-open-pr`, `.claude/skills/routing/publish-open-pr` | Packages a validated branch into a PR. |
| `ship-subissue` | `routing/ship-subissue` | `.claude/skills/ship-subissue`, `.claude/skills/routing/ship-subissue` | Merges and closes after clean review. |
| `ask-to` | `routing/ask-to` | `.claude/skills/ask-to`, `.claude/skills/routing/ask-to` | User-facing router before workflow skills. |
| `plan-review-fixes` | `delivery/plan-review-fixes` | `.claude/skills/plan-review-fixes`, `.claude/skills/delivery/plan-review-fixes` | Converts findings into a PR fix plan. |
| `implement-review-fixes` | `delivery/implement-review-fixes` | `.claude/skills/implement-review-fixes`, `.claude/skills/delivery/implement-review-fixes` | Applies a posted fix plan. |
| `review-fix-loop` | `delivery/review-fix-loop` | `.claude/skills/review-fix-loop`, `.claude/skills/delivery/review-fix-loop` | Orchestrates review/plan/fix cycles. |
| `diagnosing-bugs` | `delivery/diagnosing-bugs` | `.claude/skills/diagnosing-bugs`, `.claude/skills/delivery/diagnosing-bugs` | Structured debugging loop. |

## Compatibility rule
- Use the flat alias when the client only resolves top-level names.
- Use the categorized path when the client understands category trees.
- The bundle now exposes both forms where the flat alias does not collide with a top-level category.
