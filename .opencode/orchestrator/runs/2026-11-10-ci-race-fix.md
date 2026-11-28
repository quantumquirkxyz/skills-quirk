# run: ci-race-fix status: active
request: Fix CI-only/flaky failure where skills-json-consistency mutates site/src/skills.json while projection-consistency reads generated projections in parallel — acceptance: deterministic 610+ test pass, check-all pass, CI green on pushed SHA, minimal scoped commit.
base: main @ b6a4a83
| id | kind | status | complexity | model | session | worktree/branch | validated_commit | rounds | depends_on |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| isolate-projection-tests | implementation | progress | normal | default | ses_e387aad61ffeJ5Bw8D5d8HxlMA | /home/quantumquirxyz/.local/share/opencode/worktree/d110f0/ci-race-fix | — | 0 | — |
| review | verification | pending | normal | reviewer | — | — | — | 0 | isolate-projection-tests |
| final-gate | verification | pending | normal | default | — | — | — | 0 | review |
| ci-evidence | verification | pending | normal | default | — | — | — | 0 | final-gate |
## Findings
- CI commit b6a4a834 failed `generated artifacts agree on projected skill counts`; local run passed.
- skills-json-consistency.test.mjs mutates the tracked site JSON during tests; node:test may run files concurrently.
- Baseline audit also failed on the same pushed SHA.
