import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const skillsRoot = path.join(root, '.agents', 'skills');
const fixturesRoot = path.join(root, 'evals', 'behavioral');

function skills(dir, output = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.name === 'platform') continue;
    const folder = path.join(dir, entry.name);
    const contents = readdirSync(folder, { withFileTypes: true });
    if (contents.some(item => item.isFile() && item.name === 'SKILL.md')) output.push(folder);
    else skills(folder, output);
  }
  return output;
}

test('every high-risk skill has an independently versioned behavioral evaluation', () => {
  const corpus = readdirSync(fixturesRoot).filter(name => name.endsWith('.json')).map(name => JSON.parse(readFileSync(path.join(fixturesRoot, name), 'utf8')));
  const covered = new Map();
  for (const item of corpus) {
    const cases = covered.get(item.skill) || [];
    cases.push(item);
    covered.set(item.skill, cases);
  }
  const highRisk = skills(skillsRoot).filter(dir => {
    const front = readFileSync(path.join(dir, 'SKILL.md'), 'utf8').split('---')[1] || '';
    return /^risk:\s*["']?high\b/mi.test(front);
  });
  assert.ok(highRisk.length > 0, 'risk-based corpus gate should discover high-risk skills');
  for (const dir of highRisk) {
    const skill = path.relative(skillsRoot, dir).split(path.sep).join('/');
    const cases = covered.get(skill) || [];
    assert.ok(cases.length > 0, 'missing high-risk behavioral evaluation for ' + skill);
    assert.ok(cases.some(item => item.assertions?.some(a => a.type === 'deterministic' && (
      a.check?.kind === 'transcript_tool_not_called' || a.check?.kind === 'artifact_not_contains'
    ))), 'high-risk skill needs a negative safety control: ' + skill);
  }
});
