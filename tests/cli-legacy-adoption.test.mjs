import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cpSync, mkdtempSync, existsSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const cli = path.join(root, 'bin', 'skills-quirk.js');

function run(target, args, expectedStatus = 0) {
  const result = spawnSync(process.execPath, [cli, ...args], {
    cwd: target, encoding: 'utf8', timeout: 120000, maxBuffer: 8 * 1024 * 1024,
  });
  assert.equal(result.status, expectedStatus, result.stderr || result.stdout);
  return result;
}

for (const [name, args] of [
  ['install', ['install']],
  ['add quirk-skills', ['add', 'quirk-skills']],
]) {
  test(`${name} previews safely and validates explicit writes`, t => {
    const target = mkdtempSync(path.join(tmpdir(), 'quirk-cli-legacy-'));
    t.after(() => rmSync(target, { recursive: true, force: true }));
    writeFileSync(path.join(target, 'skills-lock.json'), readFileSync(path.join(root, 'skills-lock.json')));
    cpSync(path.join(root, 'CONTEXT.md'), path.join(target, 'CONTEXT.md'));
    cpSync(path.join(root, 'evals'), path.join(target, 'evals'), { recursive: true });

    const preview = run(target, args);
    const report = JSON.parse(preview.stdout);
    assert.equal(report.mode, 'dry-run');
    assert.equal(existsSync(path.join(target, '.agents', 'quirk-install.json')), false);

    run(target, [...args, '--write'], 1);
    assert.equal(existsSync(path.join(target, '.agents', 'quirk-install.json')), true);
    assert.match(readFileSync(path.join(target, '.agents', 'quirk-install.json'), 'utf8'), /schemaVersion/);
  });
}
