import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile, readdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import {validateSkillOutput} from '../scripts/render-skill-output.mjs';

const domains = ['auxiliary', 'cms', 'compilers', 'cs', 'db'];
const root = resolve('.');
const coveredSkills = ['.agents/skills/auxiliary/execution-policy/SKILL.md', '.agents/skills/auxiliary/integration-playground/SKILL.md', '.agents/skills/auxiliary/interactive-tutorial-builder/SKILL.md', '.agents/skills/auxiliary/setup-quirk-skills/SKILL.md', '.agents/skills/cms/cms-access-control/SKILL.md', '.agents/skills/cms/cms-architecture/SKILL.md', '.agents/skills/cms/cms-content-strategy/SKILL.md', '.agents/skills/cms/localization/SKILL.md', '.agents/skills/compilers/compiler-design/SKILL.md', '.agents/skills/compilers/compiler-testing/SKILL.md', '.agents/skills/compilers/compilers/SKILL.md', '.agents/skills/cs/cs-algorithms/SKILL.md', '.agents/skills/cs/cs-complexity-analysis/SKILL.md', '.agents/skills/cs/cs-computability/SKILL.md', '.agents/skills/cs/cs-data-structures/SKILL.md', '.agents/skills/db/db-migrations/SKILL.md', '.agents/skills/db/db-nosql-modeling/SKILL.md', '.agents/skills/db/db-query-optimization/SKILL.md', '.agents/skills/db/db-relational-design/SKILL.md'];

async function canonicalSkills() {
  const paths = [];
  for (const domain of domains) {
    for (const entry of await readdir(resolve(root, '.agents/skills', domain), {withFileTypes: true})) {
      if (entry.isDirectory()) paths.push(`${domain}/${entry.name}`);
    }
  }
  return paths.sort();
}

function frontmatter(source, path) {
  const block = source.match(/^---\s*\n([\s\S]*?)\n---/)?.[1];
  assert.ok(block, `${path}: canonical frontmatter is required`);
  return block;
}

function scalar(block, key, path) {
  const value = block.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'))?.[1]?.trim();
  assert.ok(value, `${path}: ${key} is required by the canonical contract`);
  return value.replace(/^(["'])(.*)\1$/, '$2');
}

test('auxiliary, CMS, compiler, CS, and DB contracts produce validated output envelopes', async () => {
  const skills = await canonicalSkills();
  assert.equal(skills.length, 19, 'the tranche inventory must remain explicit and complete');
  for (const skill of skills) {
    const path = `.agents/skills/${skill}/SKILL.md`;
    const source = await readFile(resolve(root, path), 'utf8');
    const block = frontmatter(source, path);
    const name = scalar(block, 'name', path);
    const artifactType = scalar(block, 'artifactType', path);
    const output = scalar(block, 'outputs', path);
    const fixture = scalar(block, 'fixturesPath', path);
    assert.equal(fixture, 'tests/skill-output-migration-auxiliary-cms-compilers-cs-db.test.mjs');
    assert.match(source, /^## Contract/m, `${path}: contract section is required`);
    assert.match(source, /^(?:- Input:|\*{2}Input schema|### Input schema)/m, `${path}: input contract is required`);
    assert.match(source, /^(?:- Output:|\*{2}Output schema|### Output schema)/m, `${path}: output contract is required`);
    assert.match(source, /(?:^- Scope:|^### Scope|^stopCondition:)/m, `${path}: scope contract is required`);
    const envelope = {
      schemaVersion: '1.0', artifactType, artifactId: `${name}-migration-fixture`,
      operationId: `${name}-contract-check`, status: 'success',
      title: `${name} declared output`, summary: output, sourceRefs: [path],
      evidence: [`${path}:frontmatter.outputs`, `${path}:## Contract`],
      validation: [
        {check: 'canonical output declaration', status: 'passed'},
        {check: 'canonical contract sections', status: 'passed'},
      ],
      nextActions: ['Apply the declared contract to a real invocation with source-specific evidence.'],
      payload: {skill: name, declaredOutput: output, contract: 'schema/skill-output.schema.json'},
    };
    assert.doesNotThrow(() => validateSkillOutput(envelope), path);
  }
});
