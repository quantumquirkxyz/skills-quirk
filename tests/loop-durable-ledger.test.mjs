import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { runLoop } from '../.agents/skills/platform/loop-runner.mjs';

const steps = () => (async function* () {
  yield { action: 'read', args: {}, result: { ok: true } };
})();

test('strict ledger mode requires a journal destination', async () => {
  await assert.rejects(
    runLoop({ steps: steps(), ledgerPath: null, strictLedger: true }),
    /requires a ledgerPath/,
  );
});

test('strict ledger mode fails when journal cannot be persisted', async t => {
  const dir = mkdtempSync(path.join(tmpdir(), 'quirk-loop-durable-'));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  await assert.rejects(
    runLoop({ steps: steps(), ledgerPath: dir, strictLedger: true }),
    /EISDIR|illegal operation|directory/i,
  );
});
