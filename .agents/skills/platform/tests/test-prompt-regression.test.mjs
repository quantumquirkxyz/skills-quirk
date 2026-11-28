import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { comparePrompt, main, pathsFor } from '../scripts/test-prompt-regression.mjs';

async function fixture() {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'prompt-regression-'));
  const { prompt, golden } = pathsFor(root, 'demo', 'v2');
  await fs.mkdir(path.dirname(prompt), { recursive: true });
  await fs.mkdir(path.dirname(golden), { recursive: true });
  return { root, prompt, golden };
}

test('passes when v2 prompt equals golden, including CRLF normalization', async () => {
  const f = await fixture();
  await fs.writeFile(f.golden, 'alpha\nbeta\n');
  await fs.writeFile(f.prompt, 'alpha\r\nbeta\r\n');
  const result = await comparePrompt({ root: f.root, skill: 'demo' });
  assert.equal(result.status, 'pass');
  assert.equal(result.expectedSha256, result.actualSha256);
});

test('fails on duplicate, reordered, or changed prompt lines', async () => {
  const f = await fixture();
  await fs.writeFile(f.golden, 'alpha\nbeta\n');
  await fs.writeFile(f.prompt, 'beta\nbeta\n');
  const result = await comparePrompt({ root: f.root, skill: 'demo' });
  assert.equal(result.status, 'fail');
  assert.notEqual(result.expectedSha256, result.actualSha256);
});

test('does not treat a JSON execution trace as a prompt golden', async () => {
  const f = await fixture();
  await fs.writeFile(path.join(path.dirname(f.golden), 'demo-v2.json'), JSON.stringify({ prompt: 'alpha\n' }));
  const result = await comparePrompt({ root: f.root, skill: 'demo' });
  assert.equal(result.status, 'no-golden');
});

test('rejects path traversal and invalid versions', () => {
  assert.throws(() => pathsFor('/tmp', '../secret'), /Invalid skill name/);
  assert.throws(() => pathsFor('/tmp', 'demo', 'latest'), /Invalid version/);
});

test('CLI emits JSON and resolves repository paths independently of cwd', async () => {
  const result = await comparePrompt({ skill: 'api-design' });
  assert.equal(result.status, 'pass');
  const lines = [];
  const code = await main(['api-design', 'v2', '--json'], { log: (value) => lines.push(value), error: () => {} });
  assert.equal(code, 0);
  assert.equal(JSON.parse(lines[0]).status, 'pass');
});
