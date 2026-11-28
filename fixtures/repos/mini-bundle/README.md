# mini-bundle

A deterministic miniature repository used as a task seed by
`.agents/skills/platform/scripts/run-skill-task.mjs`. It is intentionally tiny
and version-pinned: three files that all have to agree with each other.

```text
.agents/skills/delivery/review-pr/SKILL.md   reduced copy of the canonical skill
skills-lock.json                            lock entry with the hash of that file
schema/review-findings-schema.json          copy of the bundle schema
fixtures/behavioral/review-pr.json          reduced evaluator fixture
.claude/skills/review-pr                    relative link into the canonical bundle
```

The lockfile hash is the SHA-256 of the exact bytes of the reduced `SKILL.md`,
which is what `.agents/skills/skill-dev/lockfile-maintenance/scripts/update-lockfile.mjs`
computes over a working tree. That is what makes the lockfile-integrity task
start from a clean state: the same script reports drift once the task edits the
skill file, and reports clean again after the repair.

This fixture lives outside `.agents/skills/` on purpose. Anything named
`SKILL.md` inside `.agents/skills/` is counted as a bundle skill by the repo
tooling, and the audit that pins the 254 bundle / 266 repo skill counts would
treat a fixture skill as a real one.

Regenerate the lock entry after editing the reduced skill file:

```bash
node -e "const fs=require('node:fs');const c=require('node:crypto');const h=c.createHash('sha256').update(fs.readFileSync('fixtures/repos/mini-bundle/.agents/skills/delivery/review-pr/SKILL.md')).digest('hex');fs.writeFileSync('fixtures/repos/mini-bundle/skills-lock.json',JSON.stringify({skills:{'review-pr':{hash:h,revision:'working-tree',sourceType:'local'}}},null,2)+'\n')"
```
