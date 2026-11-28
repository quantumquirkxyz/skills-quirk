import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { buildIssueMetadataPlan } from '../scripts/apply-issue-metadata.mjs';

const script = fileURLToPath(new URL('../scripts/apply-issue-metadata.mjs', import.meta.url));

const metadata = {
  assignees: ['quantumquirkxyz'],
  labels: ['ready-for-agent', 'spec'],
  milestone: 'v4',
  projects: ['Engineering Modernization'],
  fields: { work_type: 'Epic', phase: 'in-progress', priority: 'high', risk: 'high' },
  relationships: { parent: 6, subIssues: [8], blockedBy: [7], blocking: [9], related: [10] },
  development: { branch: { name: 'feat/issue-8', base: 'main' }, pullRequest: { number: 12 } },
};

test('metadata plan maps GitHub sidebar properties to native CLI mutations', () => {
  const plan = buildIssueMetadataPlan({ repo: 'quantumquirkxyz/skills-quirk', issue: 8, metadata });
  const issue = plan.commands.find(x => x.kind === 'issue-metadata').argv.join(' ');
  assert.match(issue, /--add-assignee quantumquirkxyz/);
  assert.match(issue, /--add-label ready-for-agent/);
  assert.match(issue, /--add-label spec/);
  assert.match(issue, /--milestone v4/);
  assert.match(issue, /--add-project Engineering Modernization/);
  assert.match(issue, /--parent 6/);
  assert.match(issue, /--add-sub-issue 8/);
  assert.match(issue, /--add-blocked-by 7/);
  assert.match(issue, /--add-blocking 9/);
  const branch = plan.commands.find(x => x.kind === 'development-branch').argv.join(' ');
  assert.match(branch, /gh issue develop 8/);
  assert.match(branch, /--base main/);
  assert.match(branch, /--name feat\/issue-8/);
});

test('unsupported generic relations and project fields become explicit handoffs, not fake mutations', () => {
  const plan = buildIssueMetadataPlan({ repo: 'quantumquirkxyz/skills-quirk', issue: 8, metadata });
  assert.ok(plan.handoffs.some(x => x.kind === 'related-issues'));
  assert.ok(plan.handoffs.some(x => x.kind === 'pull-request-link'));
  assert.ok(plan.handoffs.some(x => x.kind === 'project-fields'));
  assert.ok(plan.commands.every(x => !x.argv.join(' ').includes('related')));
});

test('CLI defaults to dry-run and never invokes GitHub without --write', t => {
  const dir = mkdtempSync(path.join(tmpdir(), 'quirk-metadata-'));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  const file = path.join(dir, 'metadata.json');
  writeFileSync(file, JSON.stringify(metadata));
  const result = spawnSync(process.execPath, [script, '--repo', 'quantumquirkxyz/skills-quirk', '--issue', '8', '--metadata', file], {
    encoding: 'utf8', timeout: 5000,
    env: { ...process.env, PATH: '' },
  });
  assert.equal(result.status, 0, result.stderr);
  const report = JSON.parse(result.stdout);
  assert.equal(report.mode, 'dry-run');
  assert.equal(report.status, 'pass');
  assert.ok(report.commands.length >= 2);
});

test('invalid issue metadata fails before any side effect can be planned', () => {
  assert.throws(() => buildIssueMetadataPlan({
    repo: 'quantumquirkxyz/skills-quirk',
    issue: 8,
    metadata: { relationships: { blockedBy: [0] } },
  }), /positive issue numbers/);
});
