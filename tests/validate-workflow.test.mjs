import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const WORKFLOW = fs.readFileSync(
  path.join(process.cwd(), '.github', 'workflows', 'validate.yml'),
  'utf8',
);

function pathsFor(event) {
  const block = WORKFLOW.match(new RegExp(`  ${event}:\\n([\\s\\S]*?)(?=^  \\w|\\z)`, 'm'))?.[1];
  assert.ok(block, `workflow must define ${event}`);
  return [...block.matchAll(/^\s+- "([^"]+)"$/gm)].map((match) => match[1]);
}

test('PR validation triggers for release metadata and package changes', () => {
  const pullRequestPaths = pathsFor('pull_request');

  assert.ok(pullRequestPaths.includes('package.json'));
  assert.ok(pullRequestPaths.includes('VERSION'));
});

test('workflow pipelines fail instead of hiding command errors', () => {
  for (const match of WORKFLOW.matchAll(/run: \|\n([\s\S]*?)(?=\n\s+- name:|\n\s*$)/g)) {
    if (match[1].includes('| tee ')) assert.match(match[1], /set -o pipefail/);
  }
});
