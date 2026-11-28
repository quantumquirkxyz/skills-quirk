import test from 'node:test';
import assert from 'node:assert/strict';
import { capabilityRequirementStatus, computeLegalEvents, loadWorkflow } from '../workflow-state-machine.mjs';

const aliases = { SDD: 'spec-driven-development', PRD: 'prod-prd-writing' };

function localProvider(capability) {
  return { capability, result: { status: 'ready', artifactType: 'handoff' } };
}

test('alias resolves to capability, provider, handoff, and result', () => {
  const canonical = aliases.SDD;
  const capability = `${canonical} (required)`;
  const provider = localProvider(canonical);
  const requirements = capabilityRequirementStatus([capability], { capabilities: { providers: [canonical], handoffs: [] } });
  assert.deepEqual(requirements.blocked, []);
  const workflow = loadWorkflow('standard-feature');
  const legal = computeLegalEvents(workflow, { currentState: 'ask-to', history: [{ state: 'ask-to' }], context: { capabilities: { providers: [canonical] } } });
  assert.ok(legal.legalEvents.includes('SOFTWARE_CHANGE'));
  const handoff = { from: 'ask-to', to: canonical, provider: provider.capability, result: provider.result };
  assert.equal(handoff.provider, canonical);
  assert.equal(handoff.result.status, 'ready');
});
