import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const skillsRoot = path.join(root, '.agents', 'skills');

function canonicalSkills(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.name === 'platform') continue;
    const full = path.join(dir, entry.name);
    if (fs.existsSync(path.join(full, 'SKILL.md'))) out.push({ name: entry.name, path: full });
    else canonicalSkills(full, out);
  }
  return out;
}

function aliasName(skill) {
  const domain = skill.path.split(path.sep).at(-2);
  const direct = path.join(skillsRoot, skill.name);
  return fs.existsSync(direct) && !fs.lstatSync(direct).isSymbolicLink() ? `${domain}-${skill.name}` : skill.name;
}

test('every canonical skill has a vendor-neutral flat discovery alias', () => {
  const canonical = canonicalSkills(skillsRoot);
  assert.equal(canonical.length, 272);
  assert.equal(new Set(canonical.map((skill) => skill.name)).size, canonical.length);
  for (const skill of canonical) {
    const alias = path.join(skillsRoot, aliasName(skill));
    assert.equal(fs.lstatSync(alias).isSymbolicLink(), true, `${skill.name} must have a flat alias`);
    assert.equal(fs.realpathSync(alias), fs.realpathSync(skill.path));
    assert.equal(fs.existsSync(path.join(alias, 'SKILL.md')), true);
  }
});

test('workflow skills are directly discoverable without a vendor adapter', () => {
  for (const name of ['implement', 'publish-open-pr', 'review-pr', 'review-fix-loop', 'ship-subissue']) {
    assert.equal(fs.existsSync(path.join(skillsRoot, name, 'SKILL.md')), true, `${name} must be discoverable`);
  }
});
