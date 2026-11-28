import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const read = (relative) => fs.readFileSync(path.join(root, relative), 'utf8');
const governance = [
  'Never finish work as one commit when there are two or more independently reviewable logical units',
  'A single commit is allowed only for one inseparable unit',
  'Commit messages',
  'separate effects with separate approvals and checkpoints',
  'exact commit before push',
  'operationId',
  'branch',
  'SHA',
  'never blindly retry',
];

test('root and shared contract carry commit and push governance', () => {
  for (const file of ['AGENTS.md', '.agents/skills/platform/contract-base.xml']) {
    const source = read(file);
    for (const rule of governance) assert.match(source, new RegExp(rule.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'), `${file}: ${rule}`);
  }
});

test('implementation authority does not push and publication validates exact SHA', () => {
  const implement = read('.agents/skills/delivery/implement/SKILL.md');
  assert.doesNotMatch(implement, /sideEffects:\n(?:  - .*\n)*  - push-branch/);
  assert.match(implement, /never push from implement/);
  const publish = read('.agents/skills/routing/publish-open-pr/SKILL.md');
  assert.match(publish, /push is a separate approved effect/);
  assert.match(publish, /exact commit SHA/);
});

test('worker and prototype exceptions remain no-push boundaries', () => {
  assert.match(read('.agents/skills/routing/worktree-swarm/SKILL.md'), /must not .* push/);
  assert.match(read('.agents/skills/routing/parallel-issue-fleet/SKILL.md'), /Workers never push/);
  assert.match(read('.agents/skills/delivery/prototype/SKILL.md'), /Never push from this skill/);
});
