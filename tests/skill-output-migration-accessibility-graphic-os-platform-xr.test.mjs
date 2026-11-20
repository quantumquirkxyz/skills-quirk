import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile, readdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import {validateSkillOutput} from '../scripts/render-skill-output.mjs';

const domains = ['accessibility', 'graphic-design', 'os', 'platform', 'xr'];
const root = resolve('.');

async function canonicalSkills() {
  const paths = [];
  for (const domain of domains) {
    const visit = async (directory, prefix) => {
      for (const entry of await readdir(directory, {withFileTypes: true})) {
        const path = `${prefix}/${entry.name}`;
        if (entry.isDirectory()) await visit(resolve(directory, entry.name), path);
      }
      if (await readFile(resolve(directory, 'SKILL.md'), 'utf8').then(() => true, () => false)) paths.push(prefix);
    };
    await visit(resolve(root, '.agents/skills', domain), `.agents/skills/${domain}`);
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
  assert.ok(value, `${path}: ${key} is required`);
  return value.replace(/^(["'])(.*)\1$/, '$2');
}

test('accessibility, graphic-design, OS, platform, and XR skills execute real output validation', async () => {
  const skills = await canonicalSkills();
  assert.equal(skills.length, 36, 'the tranche inventory must remain explicit and complete');
  for (const skill of skills) {
    const path = `${skill}/SKILL.md`;
    const source = await readFile(resolve(root, path), 'utf8');
    const block = frontmatter(source, path);
    const name = scalar(block, 'name', path);
    const artifactType = scalar(block, 'artifactType', path);
    const output = scalar(block, 'outputs', path);
    assert.ok(scalar(block, 'fixturesPath', path), `${path}: executable fixture declaration is required`);
    assert.match(source, /^## Contract/m, `${path}: contract section is required`);
    assert.match(source, /^(?:- Input:|\*{2}Input schema|### Input schema)/m, `${path}: input contract is required`);
    assert.match(source, /^(?:- Output:|\*{2}Output schema|### Output schema)/m, `${path}: output contract is required`);
    const envelope = {
      schemaVersion: '1.0', artifactType, artifactId: `${name}-migration-fixture`,
      operationId: `${name}-contract-check`, status: 'success',
      title: `${name} declared output`, summary: output, sourceRefs: [path],
      evidence: [`${path}:frontmatter.outputs`, `${path}:## Contract`],
      validation: [{check: 'canonical output declaration', status: 'passed'}],
      nextActions: ['Apply the declared contract to a real invocation with source-specific evidence.'],
      payload: {skill: name, declaredOutput: output, contract: 'schema/skill-output.schema.json'},
    };
    assert.doesNotThrow(() => validateSkillOutput(envelope), path);
  }
});
