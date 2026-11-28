import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const root = new URL('..', import.meta.url);
const skillPath = new URL('.agents/skills/routing/automatic-refinement/SKILL.md', root);
const fixturePath = new URL('.agents/skills/platform/fixtures/behavioral/automatic-refinement.json', root);
const graphPath = new URL('.agents/skills/routing/automatic-refinement/references/agent-graph.md', root);
const artifactSchemaPath = new URL('.agents/skills/routing/automatic-refinement/references/refinement-artifact.schema.json', root);
const grillSchemaPath = new URL('.agents/skills/routing/grill-with-docs/references/grill-with-docs-artifact.schema.json', root);

test('automatic-refinement declares a dynamic capability graph and bounded contracts', async () => {
  const text = await readFile(skillPath, 'utf8');
  for (const token of ['no fixed role set', 'orchestrator capability', 'critic capability', 'verifier capability', 'graph/graph-skill-routing', 'loop/loop-engineering', 'maxIterations', 'maxSubagents', 'maxSkillInvocations', 'maxParallelSubagents', 'maxWallTimeMs', 'maxSources', 'refined-awaiting-review', 'blocked', 'no-progress', 'ping-pong', 'remote-effect-approval', 'RefinementArtifact']) assert.ok(text.includes(token), `missing ${token}`);
  assert.doesNotMatch(text, /mandatory six-role|grill-agent|research-agent|domain-agent|brainstorm-agent|critic-agent|verifier-agent/);
  assert.match(text, /Never claim an agent ran when it was unavailable/);
  assert.match(text, /pending-refinement-review/);
});

test('canonical graph and artifact contracts reject fixed-role and loose-schema drift', async () => {
  const graph = await readFile(graphPath, 'utf8');
  const artifactSchema = JSON.parse(await readFile(artifactSchemaPath, 'utf8'));
  const grillSchema = JSON.parse(await readFile(grillSchemaPath, 'utf8'));
  assert.match(graph, /not a fixed role roster/);
  assert.match(graph, /orchestrator.*critic.*verifier/s);
  assert.equal(artifactSchema.additionalProperties, false);
  for (const field of ['nextConsumer', 'skillsInvoked', 'routing', 'budgetSpent', 'loop', 'agentStatuses', 'limitations', 'handoffs']) assert.ok(artifactSchema.required.includes(field), `missing ${field}`);
  assert.ok(artifactSchema.properties.handoffs.items.required.includes('inputDigests'));
  assert.ok(!artifactSchema.properties.handoffs.items.required.includes('inputDigest'));
  assert.deepEqual(grillSchema.required.slice(0, 6), ['artifactId', 'artifactType', 'operationId', 'objective', 'context', 'documents']);
});

test('automatic-refinement fixture covers dynamic routing, loop mapping, and negative paths', async () => {
  const fixture = JSON.parse(await readFile(fixturePath, 'utf8'));
  assert.ok(fixture.fixtures.some((entry) => entry.id === 'dynamic-capability-graph'));
  assert.ok(fixture.fixtures.some((entry) => entry.id === 'loop-status-mapping'));
  assert.ok(fixture.fixtures.some((entry) => entry.id === 'fail-closed-availability'));
  assert.ok(fixture.fixtures.some((entry) => entry.id === 'negative-no-review'));
  assert.ok(fixture.fixtures.some((entry) => entry.id === 'stale-digest-blocks'));
  const digestFixture = fixture.fixtures.find((entry) => entry.id === 'digest-lineage-and-brief');
  assert.ok(digestFixture.expected.outputContains.includes('inputDigests'));
});
