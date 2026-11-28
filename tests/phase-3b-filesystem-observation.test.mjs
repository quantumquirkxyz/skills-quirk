import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

// Local Phase 3B contract adapter. Production integration can replace this seam
// without changing the fixture semantics or the evidence assertions below.
async function snapshotTree(root) {
  const entries = [];
  async function visit(relative = '') {
    const directory = path.join(root, relative);
    const names = (await fs.readdir(directory)).sort();
    for (const name of names) {
      const child = path.join(directory, name);
      const childRelative = path.join(relative, name);
      const stat = await fs.lstat(child);
      if (stat.isDirectory()) {
        await visit(childRelative);
      } else if (stat.isFile()) {
        const bytes = await fs.readFile(child);
        entries.push({
          path: childRelative,
          type: 'file',
          bytes: bytes.length,
          sha256: crypto.createHash('sha256').update(bytes).digest('hex'),
        });
      } else {
        entries.push({ path: childRelative, type: 'other' });
      }
    }
  }
  await visit();
  return { root: path.basename(root), entries };
}

function compareSnapshots(before, after, { maxEvidence = 100 } = {}) {
  const left = new Map(before.entries.map((entry) => [entry.path, entry]));
  const right = new Map(after.entries.map((entry) => [entry.path, entry]));
  const paths = [...new Set([...left.keys(), ...right.keys()])].sort();
  const changes = paths.flatMap((entryPath) => {
    const previous = left.get(entryPath);
    const current = right.get(entryPath);
    if (!previous) return [{ path: entryPath, kind: 'created', after: current }];
    if (!current) return [{ path: entryPath, kind: 'deleted', before: previous }];
    if (JSON.stringify(previous) !== JSON.stringify(current)) {
      return [{ path: entryPath, kind: 'modified', before: previous, after: current }];
    }
    return [];
  });
  return {
    changes: changes.slice(0, maxEvidence),
    evidence: {
      complete: changes.length <= maxEvidence,
      totalChanges: changes.length,
      omittedChanges: Math.max(0, changes.length - maxEvidence),
      truncated: changes.length > maxEvidence,
    },
  };
}

function compareDeclaredVsObserved(declared, comparison, { observationComplete = true } = {}) {
  if (!observationComplete) {
    return { status: 'outcome-unknown', reason: 'filesystem observation incomplete', declared, observed: comparison.changes };
  }
  const observed = new Set(comparison.changes.map((change) => change.path));
  const declaredPaths = new Set(declared.map((entry) => entry.path));
  const unexpected = comparison.changes.filter((change) => !declaredPaths.has(change.path));
  const missing = declared.filter((entry) => !observed.has(entry.path));
  return {
    status: unexpected.length === 0 && missing.length === 0 ? 'succeeded' : 'failed',
    declared,
    observed: comparison.changes,
    unexpected,
    missing,
    evidence: comparison.evidence,
  };
}

async function fixtureDirectory(t, prefix = 'quirk-phase-3b-') {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), prefix));
  t.after(() => fs.rm(directory, { recursive: true, force: true }));
  return directory;
}

test('Phase 3B captures an isolated pre/post filesystem snapshot and verifies declared effect', async (t) => {
  const root = await fixtureDirectory(t);
  await fs.writeFile(path.join(root, 'input.txt'), 'before\n');
  const before = await snapshotTree(root);

  await fs.writeFile(path.join(root, 'input.txt'), 'after\n');
  const after = await snapshotTree(root);
  const comparison = compareSnapshots(before, after);
  const result = compareDeclaredVsObserved([{ path: 'input.txt' }], comparison);

  assert.deepEqual(before.entries.map(({ path: entryPath }) => entryPath), ['input.txt']);
  assert.equal(comparison.changes[0].kind, 'modified');
  assert.equal(result.status, 'succeeded');
  assert.deepEqual(result.unexpected, []);
  assert.deepEqual(result.missing, []);
});

test('Phase 3B rejects an observed undeclared filesystem effect', async (t) => {
  const root = await fixtureDirectory(t);
  await fs.writeFile(path.join(root, 'input.txt'), 'before\n');
  const before = await snapshotTree(root);
  await fs.writeFile(path.join(root, 'unexpected.txt'), 'side effect\n');
  const comparison = compareSnapshots(before, await snapshotTree(root));
  const result = compareDeclaredVsObserved([], comparison);

  assert.equal(result.status, 'failed');
  assert.deepEqual(result.unexpected.map((change) => change.path), ['unexpected.txt']);
  assert.equal(result.evidence.complete, true);
});

test('Phase 3B marks capped change evidence as truncated, not complete', async (t) => {
  const root = await fixtureDirectory(t);
  const before = await snapshotTree(root);
  await Promise.all(['a.txt', 'b.txt', 'c.txt'].map((name) => fs.writeFile(path.join(root, name), name)));
  const comparison = compareSnapshots(before, await snapshotTree(root), { maxEvidence: 2 });

  assert.equal(comparison.changes.length, 2);
  assert.equal(comparison.evidence.truncated, true);
  assert.equal(comparison.evidence.complete, false);
  assert.equal(comparison.evidence.totalChanges, 3);
  assert.equal(comparison.evidence.omittedChanges, 1);
});

test('Phase 3B uses outcome-unknown when post-state observation is incomplete', async (t) => {
  const root = await fixtureDirectory(t);
  await fs.writeFile(path.join(root, 'input.txt'), 'before\n');
  const before = await snapshotTree(root);
  await fs.writeFile(path.join(root, 'input.txt'), 'possibly changed\n');
  const comparison = compareSnapshots(before, await snapshotTree(root));
  const result = compareDeclaredVsObserved([{ path: 'input.txt' }], comparison, { observationComplete: false });

  assert.equal(result.status, 'outcome-unknown');
  assert.equal(result.reason, 'filesystem observation incomplete');
  assert.equal(result.declared[0].path, 'input.txt');
});
