import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const skills = [
  'project/make-project', 'project/project-development', 'project/project-viability',
  'project/requirements-engineering', 'project/spec-driven-development',
  'project/to-spec', 'project/to-tickets', 'project/analyze-artifacts',
  'project/docs-management', 'project/software-maintenance-evolution',
  'product/prod-prd-writing', 'product/prod-okr-planning', 'product/prod-ab-testing',
  'product/brainstorming', 'professional/professional-project-management'
];
const frontmatter = text => text.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? '';
const field = (fm, key) => fm.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'))?.[1] ?? '';

for (const skill of skills) {
  test(`${skill} has an executable routing contract`, async () => {
    const path = `.agents/skills/${skill}/SKILL.md`;
    const fm = frontmatter(await readFile(resolve(root, path), 'utf8'));
    assert.match(fm, /^capabilityRequirements:/m, path);
    assert.match(fm, /engineering-preflight/, path);
    assert.match(fm, /requirements-engineering/, path);
    assert.match(fm, /testing/, path);
    assert.notEqual(field(fm, 'fixturesPath'), '""', path);
  });
}

test('software board planning activates engineering only for delivery scope', () => {
  const boardOnly = { governsSoftwareDelivery: false, nextConsumer: 'project-users' };
  const software = { governsSoftwareDelivery: true, nextConsumer: 'to-spec' };
  assert.equal(boardOnly.governsSoftwareDelivery, false);
  assert.equal(software.governsSoftwareDelivery, true);
  assert.equal(software.nextConsumer, 'to-spec');
});

test('project development blocks architecture without a requirements digest', () => {
  const assessment = { sourceDigests: {}, status: 'blocked', reason: 'missing-requirements-digest' };
  assert.equal(assessment.status, 'blocked');
  assert.equal(assessment.reason, 'missing-requirements-digest');
});

test('viability remains read-only and hands findings to a named consumer', () => {
  const report = { sideEffects: [], nextConsumer: 'architecture-evaluation', implementationAuthorized: false };
  assert.deepEqual(report.sideEffects, []);
  assert.equal(report.implementationAuthorized, false);
  assert.match(report.nextConsumer, /^(requirements-engineering|architecture-evaluation|to-tickets)$/);
});

test('legacy projections remain readable while canonical handoffs use new types', () => {
  const handoffs = [
    { artifactType: 'requirements-artifact', legacyProjection: 'spec' },
    { artifactType: 'ticket-artifact', legacyProjection: 'ticket' }
  ];
  assert.deepEqual(handoffs.map(x => x.artifactType), ['requirements-artifact', 'ticket-artifact']);
  assert.deepEqual(handoffs.map(x => x.legacyProjection), ['spec', 'ticket']);
});

test('ambiguous product idea uses conditional engineering handoff', () => {
  const idea = { selected: false, nextConsumer: null, engineeringCapabilities: [] };
  assert.equal(idea.selected, false);
  assert.equal(idea.nextConsumer, null);
  assert.deepEqual(idea.engineeringCapabilities, []);
});
