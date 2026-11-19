// Pure, dependency-free presentation of a validated skill output envelope.
// This renderer does not publish remotely or replace domain-specific schemas.
const statuses = new Set(['success', 'partial', 'blocked', 'failed', 'cancelled', 'unknown']);
const checkStatuses = new Set(['passed', 'failed', 'skipped']);
const required = ['schemaVersion', 'artifactType', 'artifactId', 'operationId', 'status', 'title', 'summary', 'sourceRefs', 'evidence', 'validation', 'nextActions', 'payload'];

export function validateSkillOutput(record) {
  if (!record || typeof record !== 'object' || Array.isArray(record)) throw new TypeError('Skill output must be an object');
  for (const key of required) if (!(key in record)) throw new Error('Missing field: ' + key);
  if (record.schemaVersion !== '1.0') throw new Error('Unsupported schemaVersion');
  for (const key of ['artifactType', 'artifactId', 'operationId', 'title', 'summary'])
    if (typeof record[key] !== 'string' || !record[key].trim()) throw new Error('Invalid field: ' + key);
  if (!statuses.has(record.status)) throw new Error('Invalid status');
  const allowed = new Set([...required, 'scope', 'assumptions', 'decisions', 'findings', 'risks', 'generatedAt', 'provenance', 'publication']);
  for (const key of Object.keys(record)) if (!allowed.has(key)) throw new Error('Unexpected field: ' + key);
  for (const key of ['scope', 'assumptions', 'decisions', 'findings', 'risks']) {
    if (key in record && (!Array.isArray(record[key]) || record[key].some(x => typeof x !== 'string'))) throw new Error('Invalid array: ' + key);
  }
  if ('publication' in record && (!record.publication || typeof record.publication !== 'object' || Array.isArray(record.publication))) throw new Error('Invalid publication');
  if ('provenance' in record && (!record.provenance || typeof record.provenance !== 'object' || Array.isArray(record.provenance))) throw new Error('Invalid provenance');
  for (const key of ['sourceRefs', 'evidence', 'nextActions']) {
    if (!Array.isArray(record[key]) || record[key].some(x => typeof x !== 'string' || !x.trim())) throw new Error('Invalid array: ' + key);
  }
  if ('generatedAt' in record && (typeof record.generatedAt !== 'string' || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/.test(record.generatedAt) || Number.isNaN(Date.parse(record.generatedAt)))) throw new Error('Invalid generatedAt');
  if ('publication' in record) {
    for (const key of Object.keys(record.publication)) if (!['target','idempotencyKey'].includes(key)) throw new Error('Unexpected publication field: ' + key);
    if ('target' in record.publication && (typeof record.publication.target !== 'string' || !/^(issue|pr):[1-9]\d*$/.test(record.publication.target))) throw new Error('Invalid publication target');
    if ('idempotencyKey' in record.publication && (typeof record.publication.idempotencyKey !== 'string' || !record.publication.idempotencyKey.trim())) throw new Error('Invalid publication idempotencyKey');
  }
  if (!Array.isArray(record.validation)) throw new Error('Invalid validation');
  for (const item of record.validation) {
    if (!item || typeof item !== 'object' || Array.isArray(item) || typeof item.check !== 'string' || !item.check.trim() || !checkStatuses.has(item.status)) throw new Error('Invalid validation item');
    for (const key of Object.keys(item)) if (!['check','status','reason'].includes(key)) throw new Error('Unexpected validation field: ' + key);
    if ('reason' in item && typeof item.reason !== 'string') throw new Error('Invalid validation reason');
    if (item.status === 'skipped' && (!item.reason || !item.reason.trim())) throw new Error('Skipped validation requires reason');
  }
  if (record.validation.some(x => x.status === 'failed') && record.status === 'success') throw new Error('Failed validation cannot yield success');
  if (record.validation.some(x => x.status === 'skipped') && record.status === 'success') throw new Error('Skipped validation cannot yield unqualified success');
  if (!record.payload || typeof record.payload !== 'object' || Array.isArray(record.payload)) throw new Error('Invalid payload');
  if (record.status === 'success' && ['deployment', 'implementation', 'security-review', 'publication', 'verification-artifact'].includes(record.artifactType) && record.validation.length === 0) throw new Error('High-risk success requires validation evidence');
  return record;
}

const safe = value => String(value).replace(/\\/g, '\\\\').replace(/([*_`\[\]<>|])/g, '\\$1').replace(/\r?\n/g, ' ');
const payloadSection = (record) => {
  const entries = Object.entries(record.payload);
  if (!entries.length) return '';
  return '\n## Artifact details\n\n' + entries.map(([key, value]) =>
    '### ' + safe(key) + '\n\n' +
    (Array.isArray(value) ? (value.length ? value.map(x => '- ' + safe(typeof x === 'string' ? x : JSON.stringify(x))).join('\n') : '_None_') :
      safe(typeof value === 'string' ? value : JSON.stringify(value))) + '\n'
  ).join('\n');
};
const sections = (label, items) => items?.length ? '\n## ' + label + '\n\n' + items.map(x => '- ' + safe(x)).join('\n') + '\n' : '';

export function renderSkillOutput(record, surface = 'file') {
  validateSkillOutput(record);
  if (!['file', 'issue', 'pr', 'comment'].includes(surface)) throw new Error('Unsupported surface');
  const r = record;
  const header = '# ' + safe(r.title) + '\n\n' + '**Status:** ' + safe(r.status) + ' | **Artifact:** ' + safe(r.artifactId) + ' | **Operation:** ' + safe(r.operationId) + '\n\n' + safe(r.summary) + '\n';
  const checks = r.validation.length ? '\n## Validation\n\n' + r.validation.map(x => '- ' + safe(x.check) + ': **' + x.status + '**' + (x.reason ? ' — ' + safe(x.reason) : '')).join('\n') + '\n' : '';
  const body = header + payloadSection(r) + sections('Sources', r.sourceRefs) + sections('Scope', r.scope) + sections('Assumptions', r.assumptions) + sections('Decisions', r.decisions) + sections('Findings', r.findings) + sections('Evidence', r.evidence) + checks + sections('Risks', r.risks) + sections('Next actions', r.nextActions);
  if (surface === 'comment') return body.replace(/^# /, '### ').replace(/\n## /g, '\n#### ').replace(/\n### (?!#)/g, '\n##### ');
  if (surface === 'issue') return body.replace('## Artifact details', '## Requirements and acceptance');
  if (surface === 'pr') return body.replace('## Artifact details', '## Changes and implementation');
  return body;
}
