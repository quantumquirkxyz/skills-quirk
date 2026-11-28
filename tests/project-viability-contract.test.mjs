import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const skillPath = path.join(root, '.agents/skills/project/project-viability/SKILL.md');

function frontmatter(text) {
  const match = text.match(/^---\n([\s\S]*?)\n---/);
  assert.ok(match, 'skill must declare YAML frontmatter');
  return Object.fromEntries(match[1].split('\n').filter(Boolean).map(line => {
    const index = line.indexOf(':');
    return [line.slice(0, index), line.slice(index + 1).trim()];
  }));
}

test('project-viability declares approved, .reports-only writes', () => {
  const text = fs.readFileSync(skillPath, 'utf8');
  const metadata = frontmatter(text);

  assert.equal(metadata.sideEffects, '["write-files"]');
  assert.equal(metadata.writePaths, '[".reports/"]');
  assert.equal(metadata.approvalRequired, 'true');
  assert.equal(metadata.approvalFor, '["write-files"]');
  assert.match(text, /Writes are limited to `\.reports\/`/);
  assert.match(text, /Write the aggregated findings to `\.reports\//);
  assert.match(text, /Write the structured JSON artifact to `\.reports\//);
});
