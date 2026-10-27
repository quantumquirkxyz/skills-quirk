import { test } from 'node:test';
import assert from 'node:assert/strict';
import { runLoop } from '../.agents/skills/platform/loop-runner.mjs';

const oneStep = () => (async function* () {
  yield { action: 'sample', args: {}, result: { ok: true } };
})();

test('invalid budgets fail before pulling a step', async () => {
  for (const budget of [{ repeatThreshold: 0 }, { repeatWindow: -2 }, { maxConsecutiveFormatErrors: NaN }, { stepLimit: -1 }, { costLimit: -1 }, { wallTimeLimitMs: 'invalid' }]) {
    await assert.rejects(runLoop({ steps: oneStep(), budget, ledgerPath: null }), RangeError);
  }
});

test('nonfinite and negative step costs are counted as malformed steps', async () => {
  const steps = (async function* () {
    yield { action: 'bill', args: {}, cost: -10, result: 'ok' };
    yield { action: 'bill', args: {}, cost: Infinity, result: 'ok' };
  })();
  const outcome = await runLoop({ steps, budget: { maxConsecutiveFormatErrors: 2 }, ledgerPath: null });
  assert.equal(outcome.exitStatus, 'format-errors');
  assert.equal(outcome.budgetSpent.steps, 2);
  assert.equal(outcome.budgetSpent.cost, 2);
});

test('zero step limit exits without consuming iterator', async () => {
  let pulls = 0;
  const steps = { next: async () => { pulls++; return { done: false, value: {} }; } };
  const result = await runLoop({ steps, budget: { stepLimit: 0 }, ledgerPath: null });
  assert.equal(result.exitStatus, 'limits-exceeded');
  assert.equal(pulls, 0);
});
