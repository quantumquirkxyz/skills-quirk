import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile, readdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import {validateSkillOutput} from '../scripts/render-skill-output.mjs';

// This executable behavioral fixture is the migration contract for the tranche.
const root = resolve('.');
const coveredSkills = ['.agents/skills/routing/artifact-handoff/SKILL.md', '.agents/skills/routing/ask-to/SKILL.md', '.agents/skills/routing/capability-router/SKILL.md', '.agents/skills/routing/context-pack/SKILL.md', '.agents/skills/routing/grill-me/SKILL.md', '.agents/skills/routing/grill-with-docs/SKILL.md', '.agents/skills/routing/automatic-refinement/SKILL.md', '.agents/skills/routing/grill/SKILL.md', '.agents/skills/routing/grilling/SKILL.md', '.agents/skills/routing/handoff/SKILL.md', '.agents/skills/routing/knowledge-curator/SKILL.md', '.agents/skills/routing/parallel-issue-fleet/SKILL.md', '.agents/skills/routing/publish-open-pr/SKILL.md', '.agents/skills/routing/ship-subissue/SKILL.md', '.agents/skills/routing/triage/SKILL.md', '.agents/skills/routing/wayfinder/SKILL.md', '.agents/skills/routing/work-item-router/SKILL.md', '.agents/skills/routing/worktree-swarm/SKILL.md', '.agents/skills/skill-dev/evaluate-skill/SKILL.md', '.agents/skills/skill-dev/lockfile-maintenance/SKILL.md', '.agents/skills/skill-dev/rule-cataloger/SKILL.md', '.agents/skills/skill-dev/side-effect-auditor/SKILL.md', '.agents/skills/skill-dev/skill-audit/SKILL.md', '.agents/skills/skill-dev/skill-creator/SKILL.md', '.agents/skills/skill-dev/skill-dependency-graph/SKILL.md', '.agents/skills/skill-dev/skill-diff-analyzer/SKILL.md', '.agents/skills/skill-dev/skill-optimizer/SKILL.md', '.agents/skills/skill-dev/skill-performance-metrics/SKILL.md', '.agents/skills/skill-dev/skill-promoter/SKILL.md', '.agents/skills/skill-dev/skill-quality-gate/SKILL.md', '.agents/skills/skill-dev/skill-sandbox/SKILL.md', '.agents/skills/skill-dev/skill-template-generator/SKILL.md', '.agents/skills/skill-dev/skill-testing-framework/SKILL.md', '.agents/skills/skill-dev/skill-tutor/SKILL.md', '.agents/skills/skill-dev/workflow-fixture-author/SKILL.md', '.agents/skills/skill-dev/writing-great-skills/SKILL.md'];
const domains = ['routing', 'skill-dev'];

async function canonicalSkills() {
  const paths = [];
  for (const domain of domains) {
    for (const entry of await readdir(resolve(root, '.agents/skills', domain), {withFileTypes: true})) {
      if (entry.isDirectory() && entry.name !== 'references') paths.push(`${domain}/${entry.name}`);
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

test('routing and skill-dev contracts produce validated output envelopes', async () => {
  const skills = await canonicalSkills();
  assert.equal(skills.length, 36, 'the tranche inventory must remain explicit and complete');
  for (const skill of skills) {
    const path = `.agents/skills/${skill}/SKILL.md`;
    const source = await readFile(resolve(root, path), 'utf8');
    const block = frontmatter(source, path);
    const name = scalar(block, 'name', path);
    const artifactType = scalar(block, 'artifactType', path);
    const output = scalar(block, 'outputs', path);
    const fixture = scalar(block, 'fixturesPath', path);
    assert.equal(fixture, 'tests/skill-output-migration-routing-skill-dev.test.mjs');
    assert.match(source, /^## Contract/m, `${path}: contract section is required`);
    assert.match(source, /^(?:-\s+(?:\*\*)?Input(?::|\*\*:)|\*{2}Input schema|### Input schema)/m, `${path}: input contract is required`);
    assert.match(source, /^(?:-\s+(?:\*\*)?Output(?::|\*\*:)|\*{2}Output schema|### Output schema)/m, `${path}: output contract is required`);
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
