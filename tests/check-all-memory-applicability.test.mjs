import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

test('check-all declares absent project memory NOT-APPLICABLE', () => {
  const source = fs.readFileSync('.agents/skills/platform/check-all.mjs', 'utf8');
  assert.match(source, /memorySkipReason\s*=\s*'no memory directory at \.agents\/memory/);
  assert.match(source, /memorySkipReason,[\s\S]*?'NOT-APPLICABLE'/);
});
