import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawn, spawnSync } from 'node:child_process';
import { createServer } from 'node:net';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const serverFile = path.join(root, '.agents/skills/platform/mcp-server/mcp-skills-server.mjs');

async function ephemeralPort() {
  const server = createServer();
  await new Promise((resolve, reject) => server.once('error', reject).listen(0, '127.0.0.1', resolve));
  const port = server.address().port;
  await new Promise(resolve => server.close(resolve));
  return port;
}

test('remote HTTP bindings are rejected without explicit opt-in', () => {
  const result = spawnSync(process.execPath, [serverFile, '--host', '0.0.0.0'], {
    cwd: root, encoding: 'utf8', timeout: 5000, env: { ...process.env, QUIRK_MCP_ALLOW_REMOTE: '0' },
  });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Remote MCP binding requires/);
});

test('local MCP HTTP rejects oversized JSON-RPC bodies', async t => {
  const port = await ephemeralPort();
  const child = spawn(process.execPath, [serverFile, '--port', String(port)], {
    cwd: root, stdio: ['ignore', 'ignore', 'pipe'],
  });
  t.after(() => { child.kill('SIGTERM'); });
  let stderr = '';
  child.stderr.on('data', chunk => { stderr += chunk.toString(); });
  const base = 'http://127.0.0.1:' + port;
  let online = false;
  for (let i = 0; i < 60; i++) {
    if (child.exitCode !== null) break;
    try {
      const res = await fetch(base + '/health', { signal: AbortSignal.timeout(500) });
      if (res.ok) { online = true; break; }
    } catch {}
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  assert.ok(online, 'MCP server failed to start: ' + stderr);
  const response = await fetch(base + '/mcp', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', method: 'initialize', id: 1, padding: 'x'.repeat(1024 * 1024) }),
  });
  assert.equal(response.status, 413);
});
