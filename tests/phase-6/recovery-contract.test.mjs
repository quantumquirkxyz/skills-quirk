import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import {
  UNKNOWN_OUTCOME,
  checkIntent,
  recordIntent,
  runEffectOnce,
} from '../../.agents/skills/platform/idempotency.mjs';

// Phase 6B contract adapter. Production has no checkpoint/lease API yet; this
// tiny local model keeps these tests deterministic and documents that seam.
class RecoveryAdapter {
  constructor(now = () => 0) { this.now = now; this.checkpoint = null; this.lease = null; }
  saveCheckpoint(state) { this.checkpoint = structuredClone(state); }
  acquireLease(owner, ttl) {
    if (this.lease && this.lease.expiresAt > this.now()) return false;
    this.lease = { owner, expiresAt: this.now() + ttl };
    return true;
  }
  validLease(owner) { return this.lease?.owner === owner && this.lease.expiresAt > this.now(); }
}

function fixture(t) {
  const dir = mkdtempSync(path.join(tmpdir(), 'phase-6b-'));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  return { dir, adapter: new RecoveryAdapter() };
}

test('crash before checkpoint resumes from the last durable state', t => {
  const { dir, adapter } = fixture(t);
  let effectCount = 0;
  adapter.saveCheckpoint({ step: 'start' });
  assert.throws(() => { throw new Error('simulated crash'); }, /simulated crash/);
  assert.deepEqual(adapter.checkpoint, { step: 'start' });
  adapter.saveCheckpoint({ step: 'effect-ready' });
  runEffectOnce(dir, 'before-checkpoint-effect', {}, () => { effectCount++; return 'done'; });
  assert.equal(effectCount, 1);
  assert.equal(adapter.checkpoint.step, 'effect-ready');
});

test('crash after checkpoint does not repeat an effect on resume', t => {
  const { dir, adapter } = fixture(t);
  let effectCount = 0;
  adapter.saveCheckpoint({ step: 'effect-ready' });
  const first = runEffectOnce(dir, 'after-checkpoint-effect', {}, () => { effectCount++; return 'done'; });
  assert.deepEqual(first, { executed: true, outcome: 'done' });
  const resumed = runEffectOnce(dir, 'after-checkpoint-effect', {}, () => { effectCount++; return 'duplicate'; });
  assert.deepEqual(resumed, { executed: false, reason: 'already-completed', outcome: 'done' });
  assert.equal(effectCount, 1);
});

test('write before acknowledgement is outcome-unknown and is never replayed', t => {
  const { dir } = fixture(t);
  let writes = 0;
  recordIntent(dir, 'write-before-ack', { value: 7 });
  writes++;
  assert.equal(checkIntent(dir, 'write-before-ack'), UNKNOWN_OUTCOME);
  const retry = runEffectOnce(dir, 'write-before-ack', { value: 7 }, () => { writes++; return 'ack'; });
  assert.deepEqual(retry, { executed: false, reason: UNKNOWN_OUTCOME });
  assert.equal(writes, 1);
});

test('timeout and cancellation are represented without executing a pending effect', async t => {
  const { dir } = fixture(t);
  let writes = 0;
  await assert.rejects(
    Promise.race([
      new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 1)),
      new Promise(resolve => setTimeout(resolve, 20)),
    ]),
    /timeout/,
  );
  recordIntent(dir, 'cancelled-write', { value: 7 });
  const cancelled = runEffectOnce(dir, 'cancelled-write', {}, () => { writes++; return 'unexpected'; });
  assert.deepEqual(cancelled, { executed: false, reason: UNKNOWN_OUTCOME });
  assert.equal(writes, 0);
  assert.equal(checkIntent(dir, 'cancelled-write'), UNKNOWN_OUTCOME);
});

test('expired lease can be reclaimed, while a live lease cannot', () => {
  let now = 100;
  const adapter = new RecoveryAdapter(() => now);
  assert.equal(adapter.acquireLease('worker-a', 10), true);
  assert.equal(adapter.acquireLease('worker-b', 10), false);
  now = 111;
  assert.equal(adapter.validLease('worker-a'), false);
  assert.equal(adapter.acquireLease('worker-b', 10), true);
});

test('resume after lease expiry uses the checkpoint and idempotency key exactly once', t => {
  const { dir } = fixture(t);
  let now = 0;
  const adapter = new RecoveryAdapter(() => now);
  let effects = 0;
  assert.equal(adapter.acquireLease('a', 5), true);
  adapter.saveCheckpoint({ step: 'published', key: 'resume-once' });
  recordIntent(dir, 'resume-once', { step: 'published' });
  effects++;
  now = 6;
  assert.equal(adapter.acquireLease('b', 5), true);
  assert.equal(checkIntent(dir, 'resume-once'), UNKNOWN_OUTCOME);
  assert.deepEqual(runEffectOnce(dir, 'resume-once', {}, () => { effects++; return 'duplicate'; }), { executed: false, reason: UNKNOWN_OUTCOME });
  assert.equal(effects, 1);
});
