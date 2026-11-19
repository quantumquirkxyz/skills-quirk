import { validateSkillOutput, renderSkillOutput } from './render-skill-output.mjs';

// Adapter contract: findByKey(target, key), create(target, body, key),
// update(target, id, body). The caller owns GitHub credentials and approval.
const localLocks = new Map();
async function withLocalLock(key, fn) {
  const previous = localLocks.get(key) ?? Promise.resolve();
  let release;
  const current = new Promise(resolve => { release = resolve; });
  const tail = previous.then(() => current);
  localLocks.set(key, tail);
  await previous;
  try { return await fn(); }
  finally {
    release();
    if (localLocks.get(key) === tail) localLocks.delete(key);
  }
}
export async function publishSkillOutput(record, adapter, { approved = false, dryRun = true } = {}) {
  validateSkillOutput(record);
  const target = record.publication?.target;
  const key = record.publication?.idempotencyKey;
  if (!target || !key) throw new Error('Publication requires target and idempotencyKey');
  if (!adapter || !['findByKey', 'create', 'update'].every(k => typeof adapter[k] === 'function')) throw new TypeError('Invalid publication adapter');
  const surface = target.startsWith('issue:') ? 'issue' : target.startsWith('pr:') ? 'pr' : 'comment';
  const body = renderSkillOutput(record, surface);
  if (dryRun) return {status:'preview',target,key,body};
  if (!approved) throw new Error('Explicit publication approval required');
  // A read-before-write check is not atomic. The provider must also enforce
  // uniqueness/locking on (target,key) to guarantee concurrent idempotency.
  return withLocalLock(target + '\\0' + key, async () => {
  const existing = await adapter.findByKey(target, key);
  if (existing) {
    if (existing.body === body) return {status:'unchanged',id:existing.id,target,key};
    const updated = await adapter.update(target, existing.id, body, key);
    return {status:'updated',id:updated.id ?? existing.id,target,key};
  }
  const created = await adapter.create(target, body, key);
  if (!created || !created.id) throw new Error('Publication outcome unknown: reconcile by idempotency key before retry');
  return {status:'created',id:created.id,target,key};
  });
}
