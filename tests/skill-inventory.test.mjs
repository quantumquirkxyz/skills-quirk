import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, symlink, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const script = fileURLToPath(new URL('../scripts/skill-inventory.mjs', import.meta.url));

test('inventory is deterministic, classifies platform skills and ignores symlinks', async t => {
  const root = await mkdtemp(path.join(tmpdir(), 'quirk-inventory-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  for (const name of ['routing/ask-to', 'platform/internal']) {
    const dir = path.join(root, '.agents', 'skills', name);
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, 'SKILL.md'), '# test\n');
  }
  const link = path.join(root, '.agents', 'skills', 'alias');
  await symlink(path.join(root, '.agents', 'skills', 'routing'), link, 'dir');
  const run = () => spawnSync(process.execPath, [script, '--root', root], { encoding: 'utf8' });
  const first = run();
  const second = run();
  assert.equal(first.status, 0, first.stderr);
  assert.equal(second.status, 0, second.stderr);
  assert.equal(first.stdout, second.stdout);
  const report = JSON.parse(first.stdout);
  assert.deepEqual(report.counts, { total: 2, bundle: 1, platform: 1 });
  assert.equal(report.entries.length, 2);
  assert.ok(report.entries.every(entry => /^[0-9a-f]{64}$/.test(entry.sha256)));
});
