# Simple validation

**Goal:** validate a new Skill before promotion.

1. Generate a template:
   `node .agents/skills/platform/skill-lab.mjs template greeting --domain documentation`
2. Inspect `.skill-sandbox/greeting/SKILL.md`.
3. Validate it:
   `node .agents/skills/platform/skill-lab.mjs validate .skill-sandbox/greeting --json`
4. Promote only after the report is `pass`.
