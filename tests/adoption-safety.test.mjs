import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, symlink, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const script = fileURLToPath(new URL('../.agents/skills/platform/sync-bundle.mjs', import.meta.url));

async function fixture(t) {
  const root = await mkdtemp(path.join(tmpdir(), 'quirk-adopt-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  const source = path.join(root, 'source');
  const target = path.join(root, 'target');
  await mkdir(path.join(source, '.agents', 'skills', 'domain', 'sample'), { recursive: true });
  await mkdir(target);
  await writeFile(path.join(source, '.agents', 'skills', 'domain', 'sample', 'SKILL.md'), '# Sample\n');
  await writeFile(path.join(source, 'CONTEXT.md'), 'source context\n');
  return { root, source, target };
}

function run(source, target, ...flags) {
  return spawnSync(process.execPath, [script, target, ...flags], { cwd: source, encoding: 'utf8' });
}

test('dry-run leaves target unchanged', async t => {
  const { source, target } = await fixture(t);
  const result = run(source, target);
  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.equal(JSON.parse(result.stdout).mode, 'dry-run');
  await assert.rejects(readFile(path.join(target, 'CONTEXT.md')));
});

test('existing content blocks overwrite even with write enabled', async t => {
  const { source, target } = await fixture(t);
  await writeFile(path.join(target, 'CONTEXT.md'), 'keep user data\n');
  const result = run(source, target, '--write');
  assert.equal(result.status, 1, result.stderr || result.stdout);
  assert.equal(JSON.parse(result.stdout).status, 'blocked');
  assert.equal(await readFile(path.join(target, 'CONTEXT.md'), 'utf8'), 'keep user data\n');
});

test('destination symlinks cannot escape project root', async t => {
  const { root, source, target } = await fixture(t);
  const external = path.join(root, 'external');
  await mkdir(external);
  await symlink(external, path.join(target, '.agents'));
  const result = run(source, target, '--write');
  assert.notEqual(result.status, 0);
  await assert.rejects(readFile(path.join(external, 'skills', 'domain', 'sample', 'SKILL.md')));
});

test('nested source or target paths are rejected', async t => {
  const { source } = await fixture(t);
  const nested = path.join(source, 'nested');
  const result = run(source, nested, '--write');
  assert.equal(result.status, 2);
});

test('repeat install keeps existing canonical compatibility symlink', async t => {
  const { source, target } = await fixture(t);
  const first = run(source, target, '--write');
  assert.equal(first.status, 0, first.stderr || first.stdout);
  const second = run(source, target, '--write');
  assert.equal(second.status, 0, second.stderr || second.stdout);
});
