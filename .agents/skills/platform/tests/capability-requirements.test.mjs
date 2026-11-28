import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { capabilityRequirementStatus, computeLegalEvents, loadWorkflow } from '../workflow-state-machine.mjs';

test('required capability blocks while recommended capability warns', () => {
  const status = capabilityRequirementStatus([
    'provider-a (required)',
    'handoff-b (recommended)'
  ], { capabilities: { providers: [] , handoffs: [] } });
  assert.equal(status.blocked.length, 1);
  assert.equal(status.blocked[0].requirement, 'provider-a');
  assert.equal(status.warnings.length, 1);
});

test('documentation and research routes bypass software preflight explicitly', () => {
  const workflow = loadWorkflow('standard-feature');
  assert.equal(workflow.states['ask-to'].transitions.DOCUMENTATION_ONLY, 'documentation-only');
  assert.equal(workflow.states['ask-to'].transitions.RESEARCH_ONLY, 'research-only');
  assert.equal(loadWorkflow('documentation-only').entryPoint, 'documentation');
  assert.equal(loadWorkflow('research-only').entryPoint, 'research');
});

test('capability warnings are surfaced without blocking recommended requirements', () => {
  const workflow = loadWorkflow('documentation-only');
  const result = computeLegalEvents(workflow, { currentState: 'documentation', history: [{ state: 'documentation' }], context: {} });
  assert.deepEqual(result.legalEvents, ['PUBLISHED', 'BLOCKED']);
  assert.equal(result.capabilityWarnings[0].severity, 'recommended');
});

test('validator contains global cycle detection, not only self-reference', () => {
  const source = fs.readFileSync('.agents/skills/platform/validate-skills.mjs', 'utf8');
  assert.match(source, /findCycles\(requirementGraph\)/);
  assert.match(source, /capability\/dependency cycle detected/);
});

test('CLEAR_SPEC remains an explicit standard-feature route', () => {
  const source = fs.readFileSync('.agents/skills/platform/workflows/standard-feature.yaml', 'utf8');
  assert.match(source, /CLEAR_SPEC: engineering-preflight/);
  assert.match(source, /CLEAR_SPEC_APPROVED: to-spec/);
});
