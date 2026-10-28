import { test } from 'node:test';
import assert from 'node:assert/strict';
import { compactContext } from '../.agents/skills/platform/context-compact.mjs';

test('must-retain constraints survive compaction before optional context', () => {
  const result = compactContext([
    { id: 'intent', text: 'do not modify README', mustRetain: true, provenance: 'user' },
    { id: 'recent', text: 'newest relevant note', priority: 9, freshness: '2026-10-28T12:00:00Z', provenance: 'issue-1' },
    { id: 'noise', text: 'x'.repeat(200), priority: 1, provenance: 'log' },
  ], { maxTokens: 30, now: Date.parse('2026-10-28T13:00:00Z') });
  assert.ok(result.selected.some(x => x.id === 'intent'));
  assert.ok(result.selected.some(x => x.id === 'recent'));
  assert.ok(result.dropped.some(x => x.id === 'noise' && x.reason === 'budget'));
});

test('revoked expired sensitive and unprovenanced optional context cannot influence selection', () => {
  const result = compactContext([
    { id: 'revoked', text: 'bad', priority: 99, revoked: true, provenance: 'x' },
    { id: 'expired', text: 'old', priority: 99, expiresAt: '2026-01-01T00:00:00Z', provenance: 'x' },
    { id: 'secret', text: 'secret', priority: 99, sensitive: true, provenance: 'vault' },
    { id: 'unsourced', text: 'claim', priority: 99 },
    { id: 'valid', text: 'verified', priority: 1, provenance: 'issue-2' },
  ], { maxTokens: 100, now: Date.parse('2026-10-28T00:00:00Z') });
  assert.deepEqual(result.selected.map(x => x.id), ['valid']);
  const reasons = Object.fromEntries(result.dropped.map(x => [x.id, x.reason]));
  assert.deepEqual(reasons, { expired: 'expired', revoked: 'revoked', secret: 'sensitive', unsourced: 'missing-provenance' });
});

test('selection is deterministic under identical inputs', () => {
  const items = [
    { id: 'b', text: 'bbbb', priority: 1, freshness: '2026-10-01', provenance: 'b' },
    { id: 'a', text: 'aaaa', priority: 1, freshness: '2026-10-01', provenance: 'a' },
  ];
  assert.deepEqual(compactContext(items, { maxTokens: 1 }), compactContext(items, { maxTokens: 1 }));
  assert.equal(compactContext(items, { maxTokens: 1 }).selected[0].id, 'a');
});

test('compaction fails rather than dropping mandatory constraints', () => {
  assert.throws(() => compactContext([
    { id: 'required', text: 'x'.repeat(100), mustRetain: true, provenance: 'user' },
  ], { maxTokens: 5 }), /must-retain context exceeds budget/);
});
