// Normalize existing lifecycle artifacts for human-readable output without
// changing the canonical domain artifact or its lifecycle semantics.
const lifecycleToExecution = Object.freeze({
  draft: 'partial', 'in-progress': 'partial', ready: 'partial',
  approved: 'partial', rejected: 'blocked', blocked: 'blocked',
  completed: 'success', superseded: 'cancelled', expired: 'blocked',
});
export function normalizeLifecycleArtifact(artifact, {title, summary, validation = [], nextActions = []} = {}) {
  if (!artifact || typeof artifact !== 'object' || Array.isArray(artifact)) throw new TypeError('Artifact must be an object');
  const status = lifecycleToExecution[artifact.status];
  if (!status) throw new Error('Unsupported lifecycle status: ' + artifact.status);
  for (const key of ['artifactType', 'artifactId', 'operationId']) {
    if (typeof artifact[key] !== 'string' || !artifact[key].trim()) throw new Error('Missing canonical artifact field: ' + key);
  }
  if (typeof title !== 'string' || !title.trim() || typeof summary !== 'string' || !summary.trim()) {
    throw new Error('A presentation title and summary are required');
  }
  const references = artifact.sourceArtifacts ?? [];
  if (!Array.isArray(references)) throw new Error('Invalid sourceArtifacts');
  const evidence = artifact.evidence ?? [];
  if (!Array.isArray(evidence)) throw new Error('Invalid evidence');
  const formatEvidence = item => typeof item === 'string' ? item : JSON.stringify(item);
  return {
    schemaVersion: '1.0', artifactType: artifact.artifactType,
    artifactId: artifact.artifactId, operationId: artifact.operationId,
    status, title, summary, sourceRefs: references,
    evidence: evidence.map(formatEvidence), validation, nextActions,
    payload: artifact.payload ?? {},
    provenance: {
      traceId: artifact.traceId, sourceDigests: artifact.sourceDigests,
      producer: artifact.producer, owner: artifact.owner,
      nextConsumer: artifact.nextConsumer,
      lifecycleStatus: artifact.status,
    },
  };
}
