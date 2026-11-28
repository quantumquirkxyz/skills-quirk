import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { runLoop } from '../.agents/skills/platform/loop-runner.mjs';

test('aborted loop stops before pulling work', async () => {
  const controller = new AbortController();
  controller.abort();
  let pulls = 0;
  const steps = { next: async () => { pulls++; return { done: false, value: { action: 'write', result: 'x' } }; } };
  const result = await runLoop({ steps, signal: controller.signal, ledgerPath: null });
  assert.equal(result.exitStatus, 'cancelled');
  assert.equal(pulls, 0);
});

test('abort during a pending step exits cancelled and writes a summary', async t => {
  const root = mkdtempSync(path.join(tmpdir(), 'quirk-cancel-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const ledger = path.join(root, 'loop.jsonl');
  const controller = new AbortController();
  let returned = false;
  const steps = {
    next: () => new Promise(resolve => setTimeout(() => resolve({ done: false, value: { action: 'slow', result: 'late' } }), 1000)),
    return: async () => { returned = true; return { done: true }; },
  };
  setTimeout(() => controller.abort(), 25);
  const result = await runLoop({ steps, signal: controller.signal, ledgerPath: ledger, strictLedger: true });
  assert.equal(result.exitStatus, 'cancelled');
  assert.equal(result.budgetSpent.steps, 0);
  assert.equal(returned, true);
  const records = readFileSync(ledger, 'utf8').trim().split('\n').map(JSON.parse);
  assert.equal(records.at(-1).type, 'summary');
  assert.equal(records.at(-1).exitStatus, 'cancelled');
});
