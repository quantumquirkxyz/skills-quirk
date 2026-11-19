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
  for (const key of ['sourceRefs', 'evidence', 'nextActions']) {
    if (!Array.isArray(record[key]) || record[key].some(x => typeof x !== 'string' || !x.trim())) throw new Error('Invalid array: ' + key);
  }
  if (!Array.isArray(record.validation)) throw new Error('Invalid validation');
  for (const item of record.validation) {
    if (!item || typeof item.check !== 'string' || !item.check.trim() || !checkStatuses.has(item.status)) throw new Error('Invalid validation item');
    if (item.status === 'skipped' && (!item.reason || !item.reason.trim())) throw new Error('Skipped validation requires reason');
  }
  if (record.validation.some(x => x.status === 'failed') && record.status === 'success') throw new Error('Failed validation cannot yield success');
  if (record.validation.some(x => x.status === 'skipped') && record.status === 'success') throw new Error('Skipped validation cannot yield unqualified success');
  if (!record.payload || typeof record.payload !== 'object' || Array.isArray(record.payload)) throw new Error('Invalid payload');
  return record;
}

const safe = value => String(value).replace(/\\/g, '\\\\').replace(/([*_`\[\]<>|])/g, '\\$1').replace(/\r?\n/g, ' ');
const sections = (label, items) => items?.length ? '\n## ' + label + '\n\n' + items.map(x => '- ' + safe(x)).join('\n') + '\n' : '';

export function renderSkillOutput(record, surface = 'file') {
  validateSkillOutput(record);
  if (!['file', 'issue', 'pr', 'comment'].includes(surface)) throw new Error('Unsupported surface');
  const r = record;
  const header = '# ' + safe(r.title) + '\n\n' + '**Status:** ' + safe(r.status) + ' | **Artifact:** ' + safe(r.artifactId) + ' | **Operation:** ' + safe(r.operationId) + '\n\n' + safe(r.summary) + '\n';
  const checks = r.validation.length ? '\n## Validation\n\n' + r.validation.map(x => '- ' + safe(x.check) + ': **' + x.status + '**' + (x.reason ? ' — ' + safe(x.reason) : '')).join('\n') + '\n' : '';
  const body = header + sections('Sources', r.sourceRefs) + sections('Scope', r.scope) + sections('Assumptions', r.assumptions) + sections('Decisions', r.decisions) + sections('Findings', r.findings) + sections('Evidence', r.evidence) + checks + sections('Risks', r.risks) + sections('Next actions', r.nextActions);
  return surface === 'comment' ? body.replace(/^# /, '### ').replace(/\n## /g, '\n#### ') : body;
}
