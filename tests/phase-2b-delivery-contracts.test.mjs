import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const files = {
  publish: '.agents/skills/routing/publish-open-pr/SKILL.md',
  loop: '.agents/skills/delivery/review-fix-loop/SKILL.md',
  ship: '.agents/skills/routing/ship-subissue/SKILL.md',
};
const read = (name) => fs.readFileSync(path.join(root, files[name]), 'utf8');
const states = ['planned', 'completed', 'blocked', 'needs-approval', 'outcome-unknown', 'stale-input', 'validation-failed', 'budget-exceeded', 'repeated-action', 'superseded', 'rolled-back'];

test('Phase 2B aligns state, fixed-point, approval, and idempotency contracts', () => {
  for (const name of Object.keys(files)) {
    const source = read(name);
    assert.match(source, /Phase 2B Output Alignment/);
    for (const state of states) assert.match(source, new RegExp('`' + state + '`'), `${name}: ${state}`);
    assert.match(source, /fixedPoint/);
    assert.match(source, /operationId/);
    assert.match(source, /idempotency key/i);
    assert.match(source, /outcome-unknown/);
    assert.match(source, /approval/i);
    assert.match(source, /authority/i);
  }
});

test('Phase 2B declares separate effect authority and approvals', () => {
  assert.match(read('publish'), /approvalFor: \[push-branch, create-pull-request\]/);
  assert.match(read('publish'), /owns only `push-branch` and `create-pull-request`/);
  assert.match(read('loop'), /approvalFor: \[write-code, commit-git, push-branch, post-pr-comment\]/);
  assert.match(read('loop'), /Push, merge, issue closure, and release approval are not granted/);
  assert.match(read('ship'), /approvalFor: \[merge-pull-request, update-project, close-issue\]/);
  assert.match(read('ship'), /owns exactly one approved merge, one project completion update, and one linked issue closure/);
});

test('ship-subissue preserves ReleaseCandidateArtifact schema consumer and authority boundary', () => {
  const source = read('ship');
  assert.match(source, /ReleaseCandidateArtifact/);
  assert.match(source, /schemas\/software-engineering\/release-candidate-artifact\.schema\.json/);
  assert.match(source, /`nextConsumer: deployment` as required by the schema/);
  assert.match(source, /release-management.*next workflow owner/);
  assert.match(source, /does not grant release or deployment authority/);
});

test('unknown effects are reconciled before replay in every Phase 2B contract', () => {
  for (const name of Object.keys(files)) {
    const source = read(name);
    assert.match(source, /reconcile/i, `${name}: reconciliation`);
    assert.match(source, /never (?:an )?automatic replay|never replay|never duplicate|never blindly retry/i, `${name}: replay guard`);
  }
});
