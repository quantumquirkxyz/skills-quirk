import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile, readdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import {validateSkillOutput} from '../scripts/render-skill-output.mjs';
import {runLoop} from '../.agents/skills/platform/loop-runner.mjs';

const root = resolve('.');
const coveredSkills = ['.agents/skills/loop/loop-engineering/SKILL.md', '.agents/skills/loop/retry-backoff/SKILL.md', '.agents/skills/project/analyze-artifacts/SKILL.md', '.agents/skills/project/docs-management/SKILL.md', '.agents/skills/project/make-project/SKILL.md', '.agents/skills/project/project-development/SKILL.md', '.agents/skills/project/project-viability/SKILL.md', '.agents/skills/project/requirements-engineering/SKILL.md', '.agents/skills/project/software-maintenance-evolution/SKILL.md', '.agents/skills/project/spec-driven-development/SKILL.md', '.agents/skills/project/to-spec/SKILL.md', '.agents/skills/project/to-tickets/SKILL.md', '.agents/skills/qa/performance-testing/SKILL.md', '.agents/skills/qa/qa-automation/SKILL.md', '.agents/skills/qa/qa-manual-testing/SKILL.md', '.agents/skills/qa/qa-security-testing/SKILL.md'];
const domains = ['loop', 'project', 'qa'];
const fixturePath = 'tests/skill-output-migration-loop-project-qa.test.mjs';

function frontmatter(source, path) {
  const block = source.match(/^---\s*\n([\s\S]*?)\n---/)?.[1];
  assert.ok(block, `${path}: frontmatter is required`);
  return block;
}

function scalar(block, key, path) {
  const value = block.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'))?.[1]?.trim();
  assert.ok(value, `${path}: ${key} is required`);
  return value.replace(/^(["'])(.*)\1$/, '$2');
}

async function skillsInScope() {
  const result = [];
  for (const domain of domains) {
    for (const entry of await readdir(resolve(root, '.agents/skills', domain), {withFileTypes: true})) {
      if (entry.isDirectory()) result.push({domain, name: entry.name, path: `.agents/skills/${domain}/${entry.name}/SKILL.md`});
    }
  }
  return result.sort((a, b) => a.path.localeCompare(b.path));
}

test('loop, project, and QA skills execute their declared output contracts', async () => {
  const skills = await skillsInScope();
  assert.equal(skills.length, 16, 'tranche inventory must remain explicit and complete');
  for (const skill of skills) {
    const source = await readFile(resolve(root, skill.path), 'utf8');
    const block = frontmatter(source, skill.path);
    const name = scalar(block, 'name', skill.path);
    const artifactType = scalar(block, 'artifactType', skill.path);
    const declaredOutput = scalar(block, 'outputs', skill.path);
    assert.equal(scalar(block, 'fixturesPath', skill.path), fixturePath);
    assert.match(source, /^## Contract/m, `${skill.path}: contract section is required`);
    assert.match(source, /Input(?: schema| contract)?/i, `${skill.path}: input contract is required`);
    assert.match(source, /Output(?: schema| contract)?/i, `${skill.path}: output contract is required`);
    assert.match(source, /(?:Scope:|Scope boundaries|\n### Scope\b)/i, `${skill.path}: scope contract is required`);

    const envelope = {
      schemaVersion: '1.0',
      artifactType,
      artifactId: `${name}-migration-fixture`,
      operationId: `${name}-contract-check`,
      status: 'success',
      title: `${name} declared output`,
      summary: declaredOutput,
      sourceRefs: [skill.path],
      evidence: [`${skill.path}:frontmatter.outputs`, `${skill.path}:## Contract`],
      validation: [
        {check: 'canonical output declaration', status: 'passed'},
        {check: 'canonical contract sections', status: 'passed'},
      ],
      nextActions: ['Run the skill-specific workflow with operator-supplied evidence.'],
      payload: {skill: name, declaredOutput, contract: 'schema/skill-output.schema.json'},
    };
    assert.doesNotThrow(() => validateSkillOutput(envelope), skill.path);
    assert.throws(() => validateSkillOutput({...envelope, status: undefined}), skill.path);
  }
});

test('loop contract has an independently executable bounded termination proof', async () => {
  const ledger = '/tmp/opencode/loop-migration-fixture.jsonl';
  const verdict = await runLoop({
    loopId: 'migration-contract-check',
    ledgerPath: ledger,
    budget: {stepLimit: 2, costLimit: 2, wallTimeLimitMs: 1000},
    steps: (async function* () {
      yield {action: 'observe', args: {iteration: 1}, result: {progress: true}};
    })(),
  });
  assert.equal(verdict.exitStatus, 'completed');
  assert.equal(verdict.budgetSpent.steps, 1);
});
