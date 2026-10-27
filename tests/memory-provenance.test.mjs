import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { buildIndex, checkIndex } from '../.agents/skills/platform/memory-index.mjs';

test('provenance gate is opt-in and rejects missing source', t => {
  const root = mkdtempSync(path.join(tmpdir(), 'quirk-provenance-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  writeFileSync(path.join(root, 'note.md'), '# Memory\nUnsourced memory note.\n');
  buildIndex(root);
  assert.equal(checkIndex(root).ok, true);
  const strict = checkIndex(root, { requireProvenance: true, asOf: '2026-10-26' });
  assert.equal(strict.ok, false);
  assert.ok(strict.findings.some(item => item.type === 'missing-provenance'));
});

test('source and expiration are validated against deterministic as-of date', t => {
  const root = mkdtempSync(path.join(tmpdir(), 'quirk-provenance-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  writeFileSync(path.join(root, 'note.md'), 'A proven fact. [source: issue-42; added: 2026-10-01]\n[expires: 2026-10-25]\n');
  buildIndex(root);
  assert.equal(checkIndex(root, { requireProvenance: true, asOf: '2026-10-24' }).ok, true);
  const expired = checkIndex(root, { requireProvenance: true, asOf: '2026-10-26' });
  assert.ok(expired.findings.some(item => item.type === 'stale-memory'));
});

test('malformed date is not valid provenance', t => {
  const root = mkdtempSync(path.join(tmpdir(), 'quirk-provenance-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  writeFileSync(path.join(root, 'note.md'), 'Invalid date. [source: issue-42; added: 2026-02-31]\n');
  buildIndex(root);
  const report = checkIndex(root, { requireProvenance: true, asOf: '2026-10-26' });
  assert.ok(report.findings.some(item => item.type === 'missing-provenance'));
});
