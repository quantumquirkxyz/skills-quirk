import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {
  evaluateGates,
  isDuplicateReviewPlan,
  repeatedBlockerCount,
  shipSubissueBlockers,
  validateInstallationReferences,
  validatePublishableArtifact,
  validateScopePaths,
} from '../delivery-integrity.mjs';

const SHA = '0123456789abcdef0123456789abcdef01234567';
const gates = { gateIde: 'pass', gatePreCommit: 'pass', gateCi: 'pass' };

test('skipped mandatory gates are blocked and never passed', () => {
  assert.equal(evaluateGates({ ...gates, gateCi: 'skipped' }).status, 'blocked');
  assert.notEqual(evaluateGates({ ...gates, gateCi: 'skipped' }).status, 'passed');
  assert.equal(evaluateGates({ ...gates, gateIde: 'skipped' }).status, 'partial');
});

test('publishable artifacts reject false gate results and placeholder commits', () => {
  const artifact = { status: 'completed', commitSha: 'placeholder', validation: { acceptanceCriteriaMet: true }, qualityGateResults: gates };
  assert.ok(validatePublishableArtifact(artifact).some((error) => error.includes('commitSha')));
  assert.ok(validatePublishableArtifact({ ...artifact, commitSha: SHA, qualityGateResults: { ...gates, gateCi: 'skipped' } }).length);
  assert.ok(validatePublishableArtifact({ ...artifact, commitSha: SHA }).length === 0);
});

test('scope enforcement rejects paths outside the declared boundary', () => {
  assert.deepEqual(validateScopePaths(['src/a.js', 'tests/unrelated.test.js'], { allowedPrefixes: ['src'] }), ['tests/unrelated.test.js']);
});

test('broken installation links are detected', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'quirk-integrity-'));
  fs.mkdirSync(path.join(root, '.agents', 'skills'), { recursive: true });
  fs.symlinkSync('missing', path.join(root, '.agents', 'skills', 'broken'));
  assert.deepEqual(validateInstallationReferences(root), ['broken symlink: .agents/skills/broken']);
});

test('review plans are idempotent and repeated blockers terminate', () => {
  const plan = { prNumber: 12, sourceReview: { standards: 0, spec: 1 }, items: [{ id: 'S-1' }] };
  assert.equal(isDuplicateReviewPlan([plan], plan), true);
  assert.equal(repeatedBlockerCount([{ key: 'ci-unavailable' }, { key: 'ci-unavailable' }, { key: 'ci-unavailable' }], 'ci-unavailable'), 3);
});

test('ship protection blocks unresolved findings and non-mergeable PRs', () => {
  const blockers = shipSubissueBlockers({
    prState: { state: 'open', mergeable: true }, linkedIssue: { number: 12 },
    standardsFindings: 1, specFindings: 0, gates,
  });
  assert.deepEqual(blockers, ['unresolved Standards findings remain']);
  assert.ok(shipSubissueBlockers({ prState: { state: 'open', mergeable: false }, linkedIssue: { number: 12 }, gates }).length);
});
