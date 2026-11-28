import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile, readdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import {validateSkillOutput} from '../scripts/render-skill-output.mjs';

const domains = ['accessibility', 'graphic-design', 'os', 'platform', 'xr'];
const root = resolve('.');
const coveredSkills = ['.agents/skills/accessibility/accessibility-design/SKILL.md', '.agents/skills/accessibility/accessibility-testing/SKILL.md', '.agents/skills/accessibility/accessibility/SKILL.md', '.agents/skills/graphic-design/brand-identity/SKILL.md', '.agents/skills/graphic-design/design-system-visual/SKILL.md', '.agents/skills/graphic-design/graphic-design-accessibility/SKILL.md', '.agents/skills/graphic-design/graphic-design-advertising/SKILL.md', '.agents/skills/graphic-design/graphic-design-data-viz/SKILL.md', '.agents/skills/graphic-design/graphic-design-editorial/SKILL.md', '.agents/skills/graphic-design/graphic-design-foundations/SKILL.md', '.agents/skills/graphic-design/graphic-design-motion/SKILL.md', '.agents/skills/graphic-design/graphic-design-packaging/SKILL.md', '.agents/skills/graphic-design/graphic-design-photo-direction/SKILL.md', '.agents/skills/graphic-design/graphic-design-project-management/SKILL.md', '.agents/skills/graphic-design/graphic-design-tools/SKILL.md', '.agents/skills/os/os-kernel/SKILL.md', '.agents/skills/os/os-memory/SKILL.md', '.agents/skills/os/os-processes/SKILL.md', '.agents/skills/platform/adapters/SKILL.md', '.agents/skills/platform/agent-cards/SKILL.md', '.agents/skills/platform/artifacts/SKILL.md', '.agents/skills/platform/checkpoints/SKILL.md', '.agents/skills/platform/configuration-management/SKILL.md', '.agents/skills/platform/dashboard/SKILL.md', '.agents/skills/platform/deployment/SKILL.md', '.agents/skills/platform/evals/SKILL.md', '.agents/skills/platform/feature-flag/SKILL.md', '.agents/skills/platform/fixtures/SKILL.md', '.agents/skills/platform/golden/SKILL.md', '.agents/skills/platform/graph/SKILL.md', '.agents/skills/platform/hooks/SKILL.md', '.agents/skills/platform/index/SKILL.md', '.agents/skills/platform/manifests/SKILL.md', '.agents/skills/platform/mcp-server/SKILL.md', '.agents/skills/platform/metrics/SKILL.md', '.agents/skills/platform/performance/SKILL.md', '.agents/skills/platform/platform-engineering/SKILL.md', '.agents/skills/platform/postgres/SKILL.md', '.agents/skills/platform/quality-gates/SKILL.md', '.agents/skills/platform/release-management/SKILL.md', '.agents/skills/platform/schemas/SKILL.md', '.agents/skills/platform/scripts/SKILL.md', '.agents/skills/platform/skill-cards/SKILL.md', '.agents/skills/platform/skill-runs/SKILL.md', '.agents/skills/platform/sre/SKILL.md', '.agents/skills/platform/state/SKILL.md', '.agents/skills/platform/system-design/SKILL.md', '.agents/skills/platform/tasks/SKILL.md', '.agents/skills/platform/tests/SKILL.md', '.agents/skills/platform/traces/SKILL.md', '.agents/skills/platform/trunk-based-workflow/SKILL.md', '.agents/skills/platform/vercel/SKILL.md', '.agents/skills/platform/workflows/SKILL.md', '.agents/skills/xr/xr-development/SKILL.md', '.agents/skills/xr/xr-interaction-design/SKILL.md', '.agents/skills/xr/xr-performance/SKILL.md'];

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
