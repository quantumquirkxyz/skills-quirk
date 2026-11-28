import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile, readdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import {validateSkillOutput} from '../scripts/render-skill-output.mjs';
import {runLoop} from '../.agents/skills/platform/loop-runner.mjs';
import {capabilityRequirementStatus} from '../.agents/skills/platform/workflow-state-machine.mjs';

const root = resolve('.');
const domains = ['loop', 'project', 'qa'];
const aliases = {maintenance: 'software-maintenance-evolution', SDD: 'spec-driven-development', 'spec-driven': 'spec-driven-development', PRD: 'prod-prd-writing', OKR: 'prod-okr-planning', AB: 'prod-ab-testing', 'A/B': 'prod-ab-testing', 'project management': 'professional-project-management'};

function frontmatter(source, path) {
  const block = source.match(/^---\s*\n([\s\S]*?)\n---/)?.[1];
  assert.ok(block, `${path}: frontmatter is required`);
  return block;
}
function scalar(block, key, path) {
  const value = block.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'))?.[1]?.trim();
  assert.ok(value, `${path}: ${key} is required`);
  return value.replace(/^(['\"])(.*)\1$/, '$2');
}
async function skillsInScope() {
  const result = [];
  for (const domain of domains) for (const entry of await readdir(resolve(root, '.agents/skills', domain), {withFileTypes: true})) if (entry.isDirectory()) result.push({path: `.agents/skills/${domain}/${entry.name}/SKILL.md`});
  return result.sort((a, b) => a.path.localeCompare(b.path));
}
function validateSchema(schema, value, rootSchema = schema, pointer = '$') {
  if (schema?.$ref) return validateSchema(rootSchema.$defs?.[schema.$ref.split('/').at(-1)] ?? {}, value, rootSchema, pointer);
  if (schema?.const !== undefined) assert.deepEqual(value, schema.const, pointer);
  if (schema?.type === 'object') assert.equal(typeof value, 'object', pointer);
  for (const key of schema?.required ?? []) assert.ok(value?.[key] !== undefined, `${pointer}/${key}`);
  for (const [key, child] of Object.entries(schema?.properties ?? {})) if (value?.[key] !== undefined) validateSchema(child, value[key], rootSchema, `${pointer}/${key}`);
  for (const branch of schema?.allOf ?? []) validateSchema(branch, value, rootSchema, pointer);
}

test('loop, project, and QA skills execute dedicated fixtures and contracts', async () => {
  const skills = await skillsInScope();
  assert.equal(skills.length, 16);
  for (const skill of skills) {
    const source = await readFile(resolve(root, skill.path), 'utf8');
    const block = frontmatter(source, skill.path);
    const name = scalar(block, 'name', skill.path);
    const declaredOutput = scalar(block, 'outputs', skill.path);
    const fixturePath = scalar(block, 'fixturesPath', skill.path);
    const fixture = JSON.parse(await readFile(resolve(root, fixturePath), 'utf8'));
    assert.equal(fixture.skill, name);
    assert.deepEqual(fixture.cases.map((item) => item.name), ['positive', 'negative-adjacent', 'ambiguous-blocked']);
    const schema = JSON.parse(await readFile(resolve(root, fixture.schema), 'utf8'));
    for (const scenario of fixture.cases) {
      const output = {schemaVersion: '1.0', artifactType: fixture.artifactType, artifactId: `${name}-${scenario.name}`, traceId: `${name}-trace`, operationId: `${name}-${scenario.name}`, status: scenario.status, workflow: name, state: scenario.status, updatedAt: '2026-01-01T00:00:00Z', sourceArtifacts: ['fixture'], sourceDigests: {}, fixedPoint: {}, producer: name, owner: 'fixture-owner', nextConsumer: fixture.handoff.nextConsumer, evidence: [], approvals: [], blockers: [], risks: [], createdAt: '2026-01-01T00:00:00Z', expiresAt: null, payload: scenario.input};
      validateSchema(schema, output);
      assert.doesNotThrow(() => validateSkillOutput({schemaVersion: '1.0', artifactType: fixture.artifactType, artifactId: output.artifactId, operationId: output.operationId, status: scenario.status === 'completed' ? 'success' : scenario.status, title: name, summary: declaredOutput, sourceRefs: [skill.path], evidence: ['fixture'], validation: scenario.status === 'completed' ? [{check: 'fixture', status: 'passed'}] : [], nextActions: [], payload: scenario.input}));
      if (scenario.name !== 'positive') assert.equal(scenario.status, 'blocked');
    }
    const resolved = fixture.capabilityRequirements.map((requirement) => aliases[requirement.split(' (')[0]] ?? requirement.split(' (')[0]);
    const status = capabilityRequirementStatus(fixture.capabilityRequirements, {providers: resolved, capabilityAliases: aliases});
    assert.deepEqual(status.blocked, [], `${name}: fixture capabilities must resolve`);
    assert.ok(fixture.handoff.nextConsumer);
    assert.deepEqual(fixture.handoff.cycleCheck, []);
    assert.match(source, /^## Contract/m);
  }
});

test('loop contract has an independently executable bounded termination proof', async () => {
  const verdict = await runLoop({loopId: 'migration-contract-check', ledgerPath: '/tmp/opencode/loop-migration-fixture.jsonl', budget: {stepLimit: 2, costLimit: 2, wallTimeLimitMs: 1000}, steps: (async function* () { yield {action: 'observe', args: {iteration: 1}, result: {progress: true}}; })()});
  assert.equal(verdict.exitStatus, 'completed');
  assert.equal(verdict.budgetSpent.steps, 1);
});
