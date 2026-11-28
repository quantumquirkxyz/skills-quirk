import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

// Fase 0 contract for scripts/platform/execution-manifest.mjs.
const root = resolve(import.meta.dirname, '..');
const runner = join(root, 'scripts', 'platform', 'execution-manifest.mjs');
const validStates = new Set(['PASS', 'FAIL', 'BLOCKED', 'NOT-RUN']);

async function runManifest(args) {
  const directory = await mkdtemp(join(tmpdir(), 'quirk-execution-manifest-contract-'));
  const artifact = join(directory, 'fixture.txt');
  const output = join(directory, 'manifest.json');
  await writeFile(artifact, 'fixture\n');
  const result = spawnSync(process.execPath, [runner, '--out', output, '--artifact', artifact, ...args], {
    cwd: root,
    encoding: 'utf8',
    env: { ...process.env, QUIRK_BASELINE_TEST_SECRET: 'fase-0-contract-secret-should-not-leak' },
  });
  const manifest = JSON.parse(await readFile(output, 'utf8'));
  return { manifest, result };
}

test('manifest contains mandatory run metadata and typed execution state', async () => {
  const { manifest } = await runManifest(['--', process.execPath, '--version']);
  for (const field of ['schema_version', 'captured_at', 'commit', 'versions', 'platform', 'execution', 'artifacts']) {
    assert.ok(Object.hasOwn(manifest, field), `missing mandatory manifest field: ${field}`);
  }
  assert.ok(validStates.has(manifest.execution.status));
  assert.equal(manifest.execution.status, 'PASS');
});

test('execution records replayable command, exit evidence, and artifact reference', async () => {
  const { manifest } = await runManifest(['--', process.execPath, '-e', 'process.exit(3)']);
  assert.deepEqual(manifest.execution.command, [process.execPath, '-e', 'process.exit(3)']);
  assert.equal(manifest.execution.status, 'FAIL');
  assert.equal(manifest.execution.exit_code, 3);
  assert.equal(manifest.artifacts.length, 1);
  assert.equal(manifest.artifacts[0].status, 'PRESENT');
  assert.match(manifest.artifacts[0].sha256, /^[a-f0-9]{64}$/);
});

test('secret values never appear in the serialized manifest', async () => {
  const { manifest } = await runManifest(['--', process.execPath, '--version']);
  assert.doesNotMatch(JSON.stringify(manifest), /fase-0-contract-secret-should-not-leak/);
});

test('NOT-RUN remains explicit and informational', async () => {
  const { manifest, result } = await runManifest(['--status', 'NOT-RUN', '--reason', 'not applicable']);
  assert.equal(manifest.execution.status, 'NOT-RUN');
  assert.equal(manifest.execution.exit_code, null);
  assert.equal(result.status, 0);
});

test('invalid usage uses a distinct exit code', () => {
  const result = spawnSync(process.execPath, [runner, '--status', 'invalid', '--out', '/tmp/manifest.json'], {
    cwd: root,
    encoding: 'utf8',
  });
  assert.equal(result.status, 2);
  assert.match(result.stderr, /Invalid status/);
});
