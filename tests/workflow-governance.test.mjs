import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const workflow = fs.readFileSync('.agents/skills/platform/workflows/standard-feature.yaml', 'utf8');
const workflowText = (name) => fs.readFileSync(`.agents/skills/platform/workflows/${name}.yaml`, 'utf8');

test('engineering preflight artifact contract is canonical and typed', () => {
  const schema = JSON.parse(fs.readFileSync('schemas/software-engineering/engineering-preflight-artifact.schema.json', 'utf8'));
  assert.equal(schema.title, 'EngineeringPreflightArtifact');
  assert.deepEqual(schema.properties.status.enum, ['approved', 'blocked', 'stale', 'not-applicable']);
  assert.deepEqual(schema.properties.exception.required, ['kind', 'rationale', 'approver', 'expiresAt', 'postVerification']);
  assert.deepEqual(schema.required.includes('exception'), true);
  assert.equal(schema.allOf.length, 2);
});

test('BUG routing enters bug-fix and every executable workflow starts with preflight', () => {
  assert.match(workflow, /BUG: bug-fix/);
  assert.doesNotMatch(workflow, /BUG:\s+(?!bug-fix\b)[A-Za-z0-9_-]+/);
  for (const name of ['bug-fix', 'repair', 'operations']) {
    const text = workflowText(name);
    assert.match(text, /entryPoint: engineering-preflight/);
    assert.match(text, /artifactType: EngineeringPreflightArtifact/);
    assert.match(text, /APPROVED: (diagnosing-bugs|plan-review-fixes|release-management)/);
    assert.match(text, /NOT_APPLICABLE_APPROVED:/);
    assert.match(text, /MISSING: escalate/);
  }
});

test('standard-feature cannot execute a BUG transition as a local implementation path', () => {
  assert.doesNotMatch(workflow, /BUG:\s*(?:diagnosing-bugs|tdd|publish-open-pr|review-pr|ship-subissue)/);
  assert.match(workflowText('bug-fix'), /^entryPoint: engineering-preflight$/m);
  assert.match(workflowText('bug-fix'), /APPROVED: diagnosing-bugs/);
  assert.match(workflowText('bug-fix'), /NOT_APPLICABLE_APPROVED: diagnosing-bugs/);
});

test('CLEAR_SPEC preserves the valid bypass after software preflight', () => {
  assert.match(workflow, /CLEAR_SPEC: engineering-preflight/);
  assert.match(workflow, /CLEAR_SPEC_APPROVED: to-spec/);
  assert.doesNotMatch(workflow, /CLEAR_SPEC: grill-with-docs/);
  assert.match(workflow, /APPROVED: grill-with-docs/);
});

test('standard feature route includes governed handoffs', () => {
  for (const state of ['engineering-preflight:', 'automatic-refinement:', 'architecture-design:', 'trunk-based-guard:', 'release-management:', 'deployment:', 'sre:']) {
    assert.match(workflow, new RegExp(`^  ${state.replace(':', '\\:')}`, 'm'));
  }
  assert.match(workflow, /SOFTWARE_CHANGE: engineering-preflight/);
  assert.match(workflow, /SHARP_ENOUGH: automatic-refinement/);
  assert.match(workflow, /REFINED: architecture-design/);
  assert.match(workflow, /NOT_APPLICABLE_APPROVED: to-spec/);
  assert.match(workflow, /OPENED: trunk-based-guard/);
  assert.match(workflow, /MERGED: release-management/);
  assert.match(workflow, /APPROVED: deployment/);
  assert.match(workflow, /DEPLOYED: observability/);
});

// ENGINEERING-PREFLIGHT-1: current approved preflight is mandatory.
test('mandatory preflight rejects bypass and stale or blocked states', () => {
  assert.match(workflow, /MISSING_PREFLIGHT: engineering-preflight/);
  assert.match(workflow, /STALE: escalate/);
  assert.match(workflow, /BLOCKED: escalate/);
  assert.match(workflow, /engineeringPreflight == "approved" \|\| engineeringPreflight == "not-applicable"/);
});

test('standard feature route fails closed on missing governance evidence', () => {
  assert.match(workflow, /SKIPPED: escalate/);
  assert.match(workflow, /MISSING: escalate/);
  assert.match(workflow, /PASSED: trunk == "passed"/);
  assert.match(workflow, /APPROVED: releaseApproval == "approved"/);
});

test('capability requirements remain contextual and structural cycles are absent', () => {
  const preflight = fs.readFileSync('.agents/skills/engineering/engineering-preflight/SKILL.md', 'utf8');
  const requirements = fs.readFileSync('.agents/skills/project/requirements-engineering/SKILL.md', 'utf8');
  const toSpec = fs.readFileSync('.agents/skills/project/to-spec/SKILL.md', 'utf8');
  assert.match(preflight, /dependencies: \[\]/);
  assert.match(preflight, /capabilityRequirements:/);
  assert.doesNotMatch(requirements, /dependencies:\s*\n\s*- to-spec/);
  assert.match(toSpec, /capabilityRequirements:/);
  assert.match(fs.readFileSync('schemas/software-engineering/capability-requirements.schema.json', 'utf8'), /uniqueItems/);
});

// ENGINEERING-PREFLIGHT-2: exceptions are approved, bounded, and post-verified.
test('exception contract is explicit and post-verified', () => {
  const skill = fs.readFileSync('.agents/skills/engineering/engineering-preflight/SKILL.md', 'utf8');
  assert.match(skill, /Documentation-only, research-only, and hotfix exceptions/i);
  assert.match(skill, /rationale, approver, expiration, and post-change verification/i);
  assert.match(skill, /not-applicable.*only for an explicitly approved exception/i);
});
