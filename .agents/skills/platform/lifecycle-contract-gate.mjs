#!/usr/bin/env node
// Validate the end-to-end engineering lifecycle handoff contract.
import fs from 'node:fs';
import path from 'node:path';

export const LIFECYCLE_STAGES = Object.freeze(['requirements', 'architecture', 'design', 'tickets', 'implement', 'verification', 'release', 'deployment', 'operations', 'maintenance']);
const DIGEST = /^[a-f0-9]{64}$/i;
const nonEmpty = (value) => typeof value === 'string' && value.trim().length > 0;
const list = (value) => Array.isArray(value) ? value : [];

export function validateLifecycleContract(contract) {
  const errors = [];
  const audit = [];
  if (!contract || typeof contract !== 'object') return report(['contract must be an object']);
  if (!nonEmpty(contract.schemaVersion)) errors.push('schemaVersion is required');
  if (!nonEmpty(contract.fixedPoint)) errors.push('fixedPoint is required');
  const execution = contract.execution;
  if (!execution || typeof execution !== 'object') audit.push('audit-incomplete: execution evidence is missing');
  else {
    if (!execution.journal) audit.push('audit-incomplete: journal evidence is missing');
    if (!execution.snapshot) audit.push('audit-incomplete: snapshot evidence is missing');
  }
  const stages = new Map(list(contract.stages).map((stage) => [stage?.id, stage]));
  for (const id of LIFECYCLE_STAGES) {
    const stage = stages.get(id);
    if (!stage) { errors.push(`required stage is missing: ${id}`); continue; }
    if (stage.notApplicable === true) {
      if (!nonEmpty(stage.approvalScope) && !nonEmpty(stage.approval?.scope)) errors.push(`notApplicable stage requires approval scope: ${id}`);
      continue;
    }
    for (const field of ['owner', 'nextConsumer', 'verifier']) if (!nonEmpty(stage[field])) errors.push(`${id}.${field} is required`);
    if (!nonEmpty(stage.schemaVersion)) errors.push(`${id}.schemaVersion is required`);
    if (!DIGEST.test(stage.sourceDigest ?? '')) errors.push(`${id}.sourceDigest must be a SHA-256 digest`);
  }
  const edges = list(contract.edges);
  for (let i = 0; i < LIFECYCLE_STAGES.length - 1; i++) {
    const from = LIFECYCLE_STAGES[i]; const to = LIFECYCLE_STAGES[i + 1];
    const edge = edges.find((candidate) => candidate?.from === from && candidate?.to === to);
    if (!edge) { errors.push(`required lifecycle edge is missing: ${from}->${to}`); continue; }
    for (const field of ['schemaVersion', 'sourceDigest', 'fixedPoint', 'owner', 'nextConsumer', 'verifier', 'approvalScope']) {
      if (field === 'sourceDigest' ? !DIGEST.test(edge[field] ?? '') : !nonEmpty(edge[field])) errors.push(`edge ${from}->${to}.${field} is required`);
    }
    const source = stages.get(from); const target = stages.get(to);
    if (source && edge.schemaVersion !== source.schemaVersion) errors.push(`edge ${from}->${to} schemaVersion is incompatible with source`);
    if (edge.fixedPoint !== contract.fixedPoint) errors.push(`edge ${from}->${to}.fixedPoint is incompatible with contract`);
    if (target && edge.nextConsumer !== target.id) errors.push(`edge ${from}->${to}.nextConsumer must be ${target.id}`);
    if (source && edge.sourceDigest !== source.sourceDigest) errors.push(`edge ${from}->${to}.sourceDigest does not match source stage`);
  }
  for (const id of ['release', 'deployment']) {
    const stage = stages.get(id);
    if (!stage || stage.notApplicable === true) continue;
    if (!nonEmpty(stage.verificationEvidence)) errors.push(`${id}.verificationEvidence is required`);
    if (!nonEmpty(stage.rollbackEvidence)) errors.push(`${id}.rollbackEvidence is required`);
  }
  const maintenance = stages.get('maintenance');
  if (maintenance && maintenance.notApplicable !== true && !nonEmpty(maintenance.correctiveRequirement) && !nonEmpty(maintenance.approvedRisk)) errors.push('maintenance must feed correctiveRequirement or approvedRisk');
  return report([...errors, ...audit], audit.length > 0 ? 'audit-incomplete' : errors.length ? 'fail' : 'pass');
}
function report(issues, status = issues.length ? 'fail' : 'pass') {
  return { status, pass: status === 'pass', issues, errors: issues.filter((issue) => !issue.startsWith('audit-incomplete:')), auditIncomplete: status === 'audit-incomplete' || issues.some((issue) => issue.startsWith('audit-incomplete:')) };
}
function main() {
  const fixture = process.argv[2] || path.join(process.cwd(), '.agents', 'skills', 'platform', 'fixtures', 'lifecycle-contract.json');
  try { const result = validateLifecycleContract(JSON.parse(fs.readFileSync(fixture, 'utf8'))); console.log(JSON.stringify({ ...result, fixture: path.relative(process.cwd(), fixture) }, null, 2)); if (!result.pass) process.exitCode = 1; }
  catch (error) { console.error(JSON.stringify({ status: 'fail', pass: false, errors: [`cannot read fixture: ${error.message}`] })); process.exitCode = 1; }
}
if (import.meta.url === `file://${process.argv[1]}`) main();
