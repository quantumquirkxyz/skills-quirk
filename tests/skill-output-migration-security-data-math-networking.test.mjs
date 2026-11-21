import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile, access} from 'node:fs/promises';
import {resolve} from 'node:path';
import {validateSkillOutput} from '../scripts/render-skill-output.mjs';

const domains = ['sec', 'data', 'math', 'networking'];
const coveredSkills = ['.agents/skills/data/data-catalog/SKILL.md', '.agents/skills/data/data-contracts/SKILL.md', '.agents/skills/data/data-etl-pipeline/SKILL.md', '.agents/skills/data/data-lineage/SKILL.md', '.agents/skills/data/data-quality/SKILL.md', '.agents/skills/data/data-streaming/SKILL.md', '.agents/skills/data/data-versioning/SKILL.md', '.agents/skills/data/data-warehouse-modeling/SKILL.md', '.agents/skills/data/feature-store/SKILL.md', '.agents/skills/data/semantic-layer/SKILL.md', '.agents/skills/data/stream-processing/SKILL.md', '.agents/skills/math/math-computation-reproducible/SKILL.md', '.agents/skills/math/math-computational/SKILL.md', '.agents/skills/math/math-cryptography/SKILL.md', '.agents/skills/math/math-formal-proof/SKILL.md', '.agents/skills/math/math-grant-structure/SKILL.md', '.agents/skills/math/math-linear-algebra/SKILL.md', '.agents/skills/math/math-literature-track/SKILL.md', '.agents/skills/math/math-optimization/SKILL.md', '.agents/skills/math/math-paper-collaboration/SKILL.md', '.agents/skills/math/math-presentation-beamer/SKILL.md', '.agents/skills/math/math-probability-models/SKILL.md', '.agents/skills/math/math-pure-proofs/SKILL.md', '.agents/skills/math/math-teaching-problem-set/SKILL.md', '.agents/skills/networking/networking-protocols/SKILL.md', '.agents/skills/networking/networking-security/SKILL.md', '.agents/skills/networking/networking/SKILL.md', '.agents/skills/sec/cloud-security/SKILL.md', '.agents/skills/sec/compliance/SKILL.md', '.agents/skills/sec/container-security/SKILL.md', '.agents/skills/sec/incident-forensics/SKILL.md', '.agents/skills/sec/sec-cryptography-applied/SKILL.md', '.agents/skills/sec/sec-privacy-engineering/SKILL.md', '.agents/skills/sec/sec-security-audit/SKILL.md', '.agents/skills/sec/sec-threat-modeling/SKILL.md', '.agents/skills/sec/secret-management-security/SKILL.md', '.agents/skills/sec/supply-chain-security/SKILL.md', '.agents/skills/sec/zero-trust/SKILL.md'];
const skillsRoot = resolve('.agents/skills');

async function canonicalSkills() {
  const inventory = [];
  for (const domain of domains) {
    const {readdir} = await import('node:fs/promises');
    for (const name of await readdir(resolve(skillsRoot, domain))) {
      inventory.push({domain, name, path: `.agents/skills/${domain}/${name}/SKILL.md`});
    }
  }
  return inventory.sort((a, b) => a.path.localeCompare(b.path));
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

test('security, data, math, and networking contracts produce validated output envelopes', async () => {
  const skills = await canonicalSkills();
  assert.equal(skills.length, 38, 'the tranche inventory must remain explicit and complete');
  for (const skill of skills) {
    const source = await readFile(resolve(skill.path), 'utf8');
    const block = frontmatter(source, skill.path);
    const name = scalar(block, 'name', skill.path);
    const output = scalar(block, 'outputs', skill.path);
    const artifactType = scalar(block, 'artifactType', skill.path);
    assert.match(source, /^## Contract/m, `${skill.path}: contract section is required`);
    assert.match(source, /^- Input:/m, `${skill.path}: input contract is required`);
    assert.match(source, /^- Output:/m, `${skill.path}: output contract is required`);
    assert.match(source, /^- Scope:/m, `${skill.path}: scope contract is required`);
    assert.match(source, new RegExp(`^name: ["']?${name}["']?$`, 'm'));

    const envelope = {
      schemaVersion: '1.0',
      artifactType,
      artifactId: `${name}-migration-fixture`,
      operationId: `${name}-contract-check`,
      status: 'success',
      title: `${name} declared output`,
      summary: output,
      sourceRefs: [skill.path],
      evidence: [`${skill.path}:frontmatter.outputs`, `${skill.path}:## Contract`],
      validation: [
        {check: 'canonical output declaration', status: 'passed'},
        {check: 'canonical contract sections', status: 'passed'},
      ],
      nextActions: ['Apply the declared contract to a real invocation with source-specific evidence.'],
      payload: {skill: name, declaredOutput: output, contract: 'schema/skill-output.schema.json'},
    };
    assert.doesNotThrow(() => validateSkillOutput(envelope), skill.path);

    const fixture = block.match(/^fixturesPath:\s*(.+)$/m)?.[1]?.trim().replace(/^(["'])(.*)\1$/, '$2');
    if (fixture) {
      if (fixture === '') continue;
      await access(resolve(fixture));
      const behavioral = JSON.parse(await readFile(resolve(fixture), 'utf8'));
      const fixtureSkills = [
        behavioral.skill,
        ...(Array.isArray(behavioral.fixtures) ? behavioral.fixtures.map(item => item.skill) : []),
      ].filter(Boolean);
      assert.ok(
        fixtureSkills.includes(name) || fixtureSkills.includes(`${skill.domain}/${name}`),
        `${skill.path}: fixture skill identity drifted`,
      );
    }
  }
});
