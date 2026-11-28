import test from 'node:test';
import assert from 'node:assert/strict';
import {assertWorkflowScenario, assertWorkflowFixtures} from './workflow-state-harness.mjs';

test('Fase 5B validates visited states and legal transitions', () => {
  const result = assertWorkflowScenario({
    initialState: 'draft', terminalStates: ['published'],
    transitions: [{action: 'submit', to: 'review', legal: true}, {action: 'approve', to: 'published', legal: true}],
    expectedVisited: ['draft', 'review', 'published'], expectedFinalState: 'published', expectedTerminal: true,
  });
  assert.equal(result.terminal, true);
});

test('Fase 5B rejects illegal state changes and actions after terminal', () => {
  assertWorkflowScenario({
    initial: 'draft', terminals: ['published'],
    steps: [{event: 'submit', next: 'review', allowed: true}, {event: 'reject', next: 'review', allowed: false}],
    visited: ['draft', 'review'],
  });
  assert.throws(() => assertWorkflowScenario({initialState: 'published', terminalStates: ['published'], transitions: [{action: 'edit', to: 'draft', legal: true}]}), /terminal state/);
  assert.throws(() => assertWorkflowScenario({initialState: 'draft', transitions: [{action: 'bad', to: 'review', legal: false}]}), /illegal transitions must not change state/);
});

test('Fase 5B accepts fixture batches through the local adapter', () => {
  const results = assertWorkflowFixtures([
    {initialState: 'queued', terminalStates: ['done'], transitions: [{to: 'done', legal: true}], expectedVisited: ['queued', 'done']},
    {initialState: 'blocked', terminalStates: ['blocked'], transitions: [], expectedTerminal: true, expectedFinalState: 'blocked'},
  ]);
  assert.equal(results.length, 2);
});
