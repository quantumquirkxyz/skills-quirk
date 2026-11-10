# run: follow-up-hardening status: active
request: Complete CI evidence/fix, release hardening, security policy, quality-score coherence, installation integrity documentation, and safe cleanup — acceptance: green CI on exact pushed commit; validated gates; five requested areas complete without npm distribution.
base: main @ 0f5feb4
| id | kind | status | complexity | model | session | worktree/branch | validated_commit | rounds | depends_on |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| site-drift | implementation | completed | normal | default | ses_e3936eb29ffeN7oXTESoCy12ju | /home/quantumquirkxyz/.local/share/opencode/worktree/d110f0/site-drift | a66aed2 | 2 + escalation | — |
| quality-score | implementation | completed | complex | default | ses_e3936eaffffeR5t2BMS85CpynW | /home/quantumquirxyz/.local/share/opencode/worktree/d110f0/quality-score | 3fbf2f6 | 1 | — |
| security-policy | implementation | completed | normal | default | ses_e3936eafaffegJBCUzwKO2ip9m | /home/quantumquirxyz/.local/share/opencode/worktree/d110f0/security-policy | 661e6aa | 1 | — |
| install-integrity-docs | implementation | completed | normal | default | ses_e3936eadbffePs4XACnHcEevzl | /home/quantumquirxyz/.local/share/opencode/worktree/d110f0/install-integrity-docs | 351801c | 1 | — |
| release-hardening | implementation | pending | complex | configured | — | — | — | 0 | site-drift, quality-score, install-integrity-docs |
| final-verification | verification | pending | normal | configured | — | — | — | 0 | site-drift, quality-score, security-policy, install-integrity-docs, release-hardening |
| cleanup | verification | pending | normal | configured | — | — | — | 0 | final-verification |
## Decisions
- 2026-11-10: Use six narrow work items plus final verification; generated-site drift and scorer coherence precede release hardening because release depends on both.
- 2026-11-10: Normalize quality score to /100 only if implementation can preserve raw score evidence and compatibility; otherwise report a blocker.
- 2026-11-10: Do not delete worktrees or `.opencode` state until ownership and recoverability are checked.
## Findings & risks
- CI run 42875534443 failed because site/src/skills.json is stale; 25/255 skills have capabilities in canonical source but not projection.
- Local gate currently passes 22/22 but does not detect site projection drift.
- Existing scorer has theoretical max 105 while labeling output /100; domain evaluator duplicates scoring logic.
- Prompt-only install docs lack explicit post-install validation commands.

- Quality-score implementer reports normalized /100, rawTotal/maxRawScore evidence, canonical scorer reuse, and 9 new tests; SHA not yet reported, so delivery remains unvalidated pending review.

- Review: site delivery needs confirmation that --check is wired into local check-all; scorer has blocking relative-path CLI bootstrap bug; security policy has unsupported contact/SLAs, incorrect skills.json hash claim, and version wording.

- Review: scorer has no blocking source issues; generated report artifact must be removed. Install docs rework addresses greenfield manifest and local-vs-upstream wording. Site drift requires gate wiring, full-field comparison, stable ordering, and regression coverage.
