import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, existsSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const cli = path.join(root, 'bin', 'skills-quirk.js');

function run(target, args) {
  const result = spawnSync(process.execPath, [cli, ...args], {
    cwd: target, encoding: 'utf8', timeout: 120000, maxBuffer: 8 * 1024 * 1024,
  });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  return result;
}

for (const [name, args] of [
  ['install', ['install']],
  ['add quirk-skills', ['add', 'quirk-skills']],
]) {
  test(`${name} previews safely and requires --write`, t => {
    const target = mkdtempSync(path.join(tmpdir(), 'quirk-cli-legacy-'));
    t.after(() => rmSync(target, { recursive: true, force: true }));
    writeFileSync(path.join(target, 'skills-lock.json'), readFileSync(path.join(root, 'skills-lock.json')));

    const preview = run(target, args);
    const report = JSON.parse(preview.stdout);
    assert.equal(report.mode, 'dry-run');
    assert.equal(existsSync(path.join(target, '.agents', 'quirk-install.json')), false);

    const applied = run(target, [...args, '--write']);
    assert.equal(JSON.parse(applied.stdout).mode, 'write');
    assert.equal(existsSync(path.join(target, '.agents', 'quirk-install.json')), true);
    assert.match(readFileSync(path.join(target, '.agents', 'quirk-install.json'), 'utf8'), /schemaVersion/);
  });
}
