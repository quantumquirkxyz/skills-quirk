import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const root = new URL('..', import.meta.url);
const skillPath = new URL('.agents/skills/routing/automatic-refinement/SKILL.md', root);
const fixturePath = new URL('.agents/skills/platform/fixtures/behavioral/automatic-refinement.json', root);

test('automatic-refinement declares the mandatory graph, waves, budgets, and fail-closed statuses', async () => {
  const text = await readFile(skillPath, 'utf8');
  for (const token of ['grill-agent', 'research-agent', 'domain-agent', 'brainstorm-agent', 'critic-agent', 'verifier-agent', 'Preflight', 'Independent analysis', 'Synthesis', 'Adversarial critique', 'Correction', 'Independent verification', 'maxIterations', 'maxSubagents', 'maxSkillInvocations', 'maxParallelSubagents', 'maxWallTimeMs', 'maxSources', 'refined-awaiting-review', 'blocked', 'no-progress', 'ping-pong', 'remote-effect-approval', 'RefinementArtifact']) assert.ok(text.includes(token), `missing ${token}`);
  assert.match(text, /Never claim a subagent ran when it was unavailable/);
  assert.match(text, /pending-refinement-review/);
});

test('automatic-refinement fixture covers negative verification and approval cases', async () => {
  const fixture = JSON.parse(await readFile(fixturePath, 'utf8'));
  assert.equal(fixture.fixtures.length, 6);
  assert.ok(fixture.fixtures.some((entry) => entry.id === 'fail-closed-availability'));
  assert.ok(fixture.fixtures.some((entry) => entry.id === 'negative-no-review'));
});
