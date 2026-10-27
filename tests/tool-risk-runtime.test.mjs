import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const script = fileURLToPath(new URL('../.agents/skills/platform/hooks/tool-risk-guard.mjs', import.meta.url));
function decide(payload, cwd = root) {
  const process = spawnSync(globalThis.process.execPath, [script], {
    cwd, input: JSON.stringify(payload) + '\n', encoding: 'utf8', timeout: 5000,
  });
  assert.equal(process.status, 0, process.stderr);
  return JSON.parse(process.stdout).hookSpecificOutput.permissionDecision;
}

test('runtime policy permits read-only tools but asks for shell execution', () => {
  assert.equal(decide({ tool_name: 'Read' }), 'allow');
  assert.equal(decide({ tool_name: 'Bash' }), 'ask');
});
test('MCP wildcard policy requires approval instead of rejecting a known family', () => {
  assert.equal(decide({ tool_name: 'mcp__GitHub__fetch' }), 'ask');
});
test('missing tool and undeclared tools fail closed', () => {
  assert.equal(decide({}), 'deny');
  assert.equal(decide({ tool_name: 'UnknownTool' }), 'deny');
});
test('missing policy cannot silently grant permission', t => {
  const dir = mkdtempSync(path.join(tmpdir(), 'quirk-policy-'));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  assert.equal(decide({ tool_name: 'Read' }, dir), 'deny');
  assert.equal(decide({ tool_name: 'Bash' }, dir), 'deny');
});
