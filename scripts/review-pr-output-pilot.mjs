// Explicit review-pr pilot: preserve the canonical artifact and opt in to
// publication only with an injected adapter and caller approval.
import {renderLifecycleArtifact} from './render-lifecycle-artifact.mjs';
import {publishSkillOutput} from './publish-skill-output.mjs';

export async function presentReviewArtifact(artifact, {
  title, summary, validation, nextActions = [], target,
  idempotencyKey, adapter, approved = false, dryRun = true,
} = {}) {
  if (typeof target !== 'string' || !/^pr:[1-9]\d*$/.test(target)) {
    throw new Error('Review pilot requires an explicit PR target');
  }
  if (typeof idempotencyKey !== 'string' || !idempotencyKey.trim()) {
    throw new Error('Review pilot requires a stable idempotency key');
  }
  if (!Array.isArray(validation)) throw new Error('Review pilot requires explicit validation results');
  if (artifact?.producer !== 'review-pr' || artifact?.artifactType !== 'verification-artifact') {
    throw new Error('Review pilot accepts only canonical review-pr verification artifacts');
  }
  const {presentation} = renderLifecycleArtifact(artifact, {
    title, summary, validation, nextActions, surface:'pr',
  });
  const record={...presentation,publication:{target,idempotencyKey}};
  return publishSkillOutput(record,adapter,{approved,dryRun});
}
