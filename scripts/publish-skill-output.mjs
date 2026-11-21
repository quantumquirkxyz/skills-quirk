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
export async function publishSkillOutput(record, adapter, { approved = false, dryRun = true, coordinator = null } = {}) {
  validateSkillOutput(record);
  const target = record.publication?.target;
  const key = record.publication?.idempotencyKey;
  if (!target || !key) throw new Error('Publication requires target and idempotencyKey');
  if (!adapter || !['findByKey', 'create', 'update'].every(k => typeof adapter[k] === 'function')) throw new TypeError('Invalid publication adapter');
  const surface = target.startsWith('issue:') ? 'issue' : target.startsWith('pr:') ? 'pr' : 'comment';
  const body = renderSkillOutput(record, surface);
  if (dryRun) return {status:'preview',target,key,body};
  if (!approved) throw new Error('Explicit publication approval required');
  // The optional coordinator must serialize the entire read/modify/write
  // transaction across processes. Local locking alone is not distributed safety.
  if (coordinator !== null && typeof coordinator.withLock !== 'function') throw new TypeError('Invalid publication coordinator');
  const publish = () => withLocalLock(target + '\\0' + key, async () => {
  const existing = await adapter.findByKey(target, key);
  if (existing) {
    if (existing.body === body) return {status:'unchanged',id:existing.id,target,key};
    try {
      const updated = await adapter.update(target, existing.id, body, key);
      if (updated?.id) return {status:'updated',id:updated.id,target,key};
    } catch (error) {
      if (error?.status && error.status < 500 && error.status !== 408 && error.status !== 429) throw error;
    }
    // Do not repeat a possibly successful PATCH. Confirm the new body by
    // reading the owned idempotency marker again.
    try {
      const recovered = await adapter.findByKey(target, key);
      if (recovered?.id === existing.id && recovered.body === body) {
        return {status:'reconciled',id:existing.id,target,key};
      }
    } catch {
      // The caller must reconcile later; an ambiguous update is never success.
    }
    throw new Error('Publication update outcome unknown: reconcile before retry');
  }
  let created;
  let ambiguous = false;
  try {
    created = await adapter.create(target, body, key);
    if (created?.id) return {status:'created',id:created.id,target,key};
    ambiguous = true;
  } catch (error) {
    // A timeout or connection reset may occur after GitHub accepted the write.
    // Reconcile once, but never repeat a potentially successful mutation.
    if (error?.status && error.status < 500 && error.status !== 408 && error.status !== 429) throw error;
    ambiguous = true;
  }
  if (ambiguous) {
    try {
      const recovered = await adapter.findByKey(target, key);
      if (recovered?.id && recovered.body === body) {
        return {status:'reconciled',id:recovered.id,target,key};
      }
    } catch {
      // Preserve fail-closed semantics if the reconciliation read also fails.
    }
  }
  throw new Error('Publication outcome unknown: reconcile by idempotency key before retry');
  });
  return coordinator ? coordinator.withLock(target, key, publish) : publish();
}
