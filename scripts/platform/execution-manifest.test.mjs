import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { buildManifest, parseArgs } from './execution-manifest.mjs';

test('buildManifest records execution, environment, and artifact identity', () => {
  const cwd = fs.mkdtempSync(path.join(os.tmpdir(), 'execution-manifest-'));
  fs.writeFileSync(path.join(cwd, 'artifact.txt'), 'fixture\n');
  const manifest = buildManifest({ cwd, command: ['node', '--version'], exitCode: 0, durationMs: 12.4, artifacts: ['artifact.txt'] });
  assert.equal(manifest.schema_version, 1);
  assert.equal(manifest.execution.status, 'PASS');
  assert.equal(manifest.execution.duration_ms, 12);
  assert.equal(manifest.artifacts[0].status, 'PRESENT');
  assert.equal(manifest.artifacts[0].bytes, 8);
  assert.match(manifest.artifacts[0].sha256, /^[a-f0-9]{64}$/);
  assert.equal(manifest.execution.cwd, cwd);
});

test('parseArgs supports explicit NOT-RUN without executing a command', () => {
  assert.deepEqual(parseArgs(['--out', 'manifest.json', '--status', 'NOT-RUN', '--reason', 'not applicable']), {
    out: 'manifest.json', status: 'NOT-RUN', reason: 'not applicable', artifacts: [], command: [],
  });
});
