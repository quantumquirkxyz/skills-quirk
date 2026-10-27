import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, readlinkSync, realpathSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const script = fileURLToPath(new URL('../.agents/skills/platform/sync-bundle.mjs', import.meta.url));
const matrix = [
  { name: 'typescript-fullstack', marker: 'package.json', content: '{"name":"project"}\n' },
  { name: 'python-api', marker: 'pyproject.toml', content: '[project]\nname="project"\n' },
  { name: 'ml-research', marker: 'requirements.txt', content: 'numpy\n' },
  { name: 'iot-embedded', marker: 'platformio.ini', content: '[env:uno]\nplatform=atmelavr\n' },
  { name: 'solidity-contracts', marker: 'foundry.toml', content: '[profile.default]\n' },
];

for (const pilot of matrix) {
  test(`portable managed adoption preserves a ${pilot.name} project`, t => {
    const root = mkdtempSync(path.join(tmpdir(), 'quirk-pilot-'));
    t.after(() => rmSync(root, { recursive: true, force: true }));
    const source = path.join(root, 'source'), target = path.join(root, pilot.name);
    mkdirSync(path.join(source, '.agents', 'skills', 'routing', 'demo'), { recursive: true });
    mkdirSync(target, { recursive: true });
    writeFileSync(path.join(source, '.agents', 'skills', 'routing', 'demo', 'SKILL.md'), '# Demo\n');
    writeFileSync(path.join(source, 'skills-lock.json'), '{"skills":{}}\n');
    writeFileSync(path.join(target, pilot.marker), pilot.content);
    writeFileSync(path.join(target, 'README.md'), 'Project README\n');
    writeFileSync(path.join(target, 'CONTEXT.md'), 'Project context\n');
    const run = (...flags) => spawnSync(process.execPath, [script, target, ...flags], { cwd: source, encoding: 'utf8', timeout: 15000 });
    const preview = run();
    assert.equal(preview.status, 0, preview.stderr || preview.stdout);
    assert.equal(JSON.parse(preview.stdout).mode, 'dry-run');
    const installed = run('--write');
    assert.equal(installed.status, 0, installed.stderr || installed.stdout);
    const repeated = run('--write');
    assert.equal(repeated.status, 0, repeated.stderr || repeated.stdout);
    assert.equal(readFileSync(path.join(target, pilot.marker), 'utf8'), pilot.content);
    assert.equal(readFileSync(path.join(target, 'README.md'), 'utf8'), 'Project README\n');
    assert.equal(readFileSync(path.join(target, 'CONTEXT.md'), 'utf8'), 'Project context\n');
    const view = path.join(target, '.claude', 'skills', 'demo');
    assert.ok(!path.isAbsolute(readlinkSync(view)), 'compatibility symlink must be relative');
    assert.equal(realpathSync(view), path.join(target, '.agents', 'skills', 'routing', 'demo'));
  });
}
