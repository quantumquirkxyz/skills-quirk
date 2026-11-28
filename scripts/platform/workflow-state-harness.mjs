import assert from 'node:assert/strict';

// Local adapter for behavioral fixtures. The existing runner only reports test
// exit status, so state-machine assertions live here instead of changing it.
export function normalizeScenario(input) {
  assert.ok(input && typeof input === 'object', 'scenario must be an object');
  const initial = input.initialState ?? input.initial ?? input.start;
  const transitions = input.transitions ?? input.steps ?? input.actions;
  const terminalStates = new Set(input.terminalStates ?? input.terminals ?? []);
  assert.equal(typeof initial, 'string', 'scenario initialState is required');
  assert.ok(Array.isArray(transitions), 'scenario transitions must be an array');
  return { initial, transitions, terminalStates };
}

function transitionOf(step, current) {
  assert.ok(step && typeof step === 'object', 'transition must be an object');
  const from = step.from ?? current;
  const to = step.to ?? step.next ?? step.state;
  const legal = step.legal ?? step.allowed ?? step.valid;
  assert.equal(typeof from, 'string', 'transition.from must be a string');
  assert.equal(typeof to, 'string', 'transition.to must be a string');
  assert.equal(typeof legal, 'boolean', 'transition legal/allowed flag is required');
  return {from, to, legal, action: step.action ?? step.event ?? null};
}

export function assertWorkflowScenario(input) {
  const scenario = normalizeScenario(input);
  let current = scenario.initial;
  const visited = [current];
  let terminal = scenario.terminalStates.has(current);

  for (const raw of scenario.transitions) {
    const transition = transitionOf(raw, current);
    assert.equal(transition.from, current, `transition starts at ${transition.from}, expected ${current}`);
    if (terminal) assert.fail(`terminal state ${current} must not have an action`);
    if (!transition.legal) {
      assert.equal(transition.to, current, 'illegal transitions must not change state');
      continue;
    }
    current = transition.to;
    visited.push(current);
    terminal = scenario.terminalStates.has(current);
  }

  if (input.expectedVisited ?? input.visited) assert.deepEqual(visited, input.expectedVisited ?? input.visited);
  if (input.expectedTerminal !== undefined) assert.equal(terminal, input.expectedTerminal);
  if (input.expectedFinalState !== undefined) assert.equal(current, input.expectedFinalState);
  return {visited, finalState: current, terminal};
}

export function assertWorkflowFixtures(fixtures) {
  assert.ok(Array.isArray(fixtures), 'fixtures must be an array');
  return fixtures.map(assertWorkflowScenario);
}
