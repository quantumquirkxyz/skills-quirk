# Skill Creator Scripts

These scripts are bundled with this skill so it is self-contained when the bundle
is installed into another repository. Run them from this skill directory
(`.agents/skills/skill-dev/skill-creator/`):

- `scripts/interview_skill.py` runs the guided interview and can emit skill data.
- `scripts/init_skill.py` creates a skill directory from scratch or from interview results.
- `scripts/package_skill.py` validates a skill directory before promotion.
- `scripts/research_helpers.py` provides reusable research and naming helpers.

The interview reads `templates/interview_questions.yaml` and
`templates/proposal_templates.yaml`. `interview_skill.py` requires PyYAML
(`python3 -m pip install pyyaml`); the other scripts use the standard library only.
