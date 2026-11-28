# Case Studies

Real-world examples of how quirk skills were applied in practice.

## Case Study 1: Internal Skills Hardening

**Date**: 2026-09-20
**Context**: A team needed to harden their internal skills before sharing them externally.

**Approach**:
1. Used `skill-lab.mjs validate` to check all skills
2. Ran `audit-semantics.mjs` to find semantic issues
3. Used `skill-evolver.mjs` to bump versions and add missing sections
4. Created `seed/` bundle with starter skills

**Result**: 
- All 183 skills passed validation
- 0 errors, 0 warnings
- New skills added to seed bundle

**Files**:
- [Internal Skills Hardening](0001-internal-skills-hardening.md)
