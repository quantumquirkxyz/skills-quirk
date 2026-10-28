import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, existsSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { buildIndex, checkIndex, retireStaleMemory } from '../.agents/skills/platform/memory-index.mjs';

test('retire is dry-run first and moves expired or revoked notes into .archive', t => {
  const dir = mkdtempSync(path.join(tmpdir(), 'quirk-memory-retire-'));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  writeFileSync(path.join(dir, 'fresh.md'), 'Fresh fact. [source: issue-1; added: 2026-10-01]\n[expires: 2026-12-01]\n');
  writeFileSync(path.join(dir, 'expired.md'), 'Old fact. [source: issue-2; added: 2026-01-01]\n[expires: 2026-10-01]\n');
  writeFileSync(path.join(dir, 'revoked.md'), 'Withdrawn fact. [source: issue-3; added: 2026-10-01]\n[revoked: 2026-10-20]\n');
  buildIndex(dir);

  const before = checkIndex(dir, { requireProvenance: true, asOf: '2026-10-28' });
  assert.ok(before.findings.some(x => x.type === 'stale-memory' && x.file === 'expired.md'));
  assert.ok(before.findings.some(x => x.type === 'revoked-memory' && x.file === 'revoked.md'));

  const preview = retireStaleMemory(dir, { asOf: '2026-10-28' });
  assert.equal(preview.mode, 'dry-run');
  assert.deepEqual(preview.retired.map(x => x.file).sort(), ['expired.md', 'revoked.md']);
  assert.ok(existsSync(path.join(dir, 'expired.md')));

  const applied = retireStaleMemory(dir, { asOf: '2026-10-28', write: true });
  assert.equal(applied.mode, 'write');
  assert.ok(!existsSync(path.join(dir, 'expired.md')));
  assert.ok(!existsSync(path.join(dir, 'revoked.md')));
  assert.ok(existsSync(path.join(dir, '.archive', 'expired.md')));
  assert.ok(existsSync(path.join(dir, '.archive', 'revoked.md')));
  assert.ok(existsSync(path.join(dir, 'fresh.md')));

  const after = checkIndex(dir, { requireProvenance: true, asOf: '2026-10-28' });
  assert.equal(after.ok, true);
  assert.ok(!readFileSync(path.join(dir, 'MEMORY.md'), 'utf8').includes('expired.md'));
});
