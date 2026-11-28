import test from 'node:test';
import assert from 'node:assert/strict';
import {
  generateSkillClauseMatrix,
  validateSkillClauseMatrix,
  PHASE9A_STATUSES,
} from './phase9a-matrix.mjs';

const row = (status = 'covered', overrides = {}) => ({
  skill: 'skill-a', clause: 'clause-1', fixture: 'fixture-1', validator: 'validator-1',
  evidence: status === 'covered' ? ['evidence-1'] : [], status, ...overrides,
});

test('generates a matrix with traceability and counts', () => {
  const result = generateSkillClauseMatrix({ rows: [row()], matrixId: 'matrix-1', generatedAt: '2026-11-28' });
  assert.equal(result.schemaVersion, '9A');
  assert.equal(result.verdict, 'covered');
  assert.equal(result.counts.covered, 1);
  assert.deepEqual(result.rows[0], {
    skill: 'skill-a', clause: 'clause-1', fixture: 'fixture-1', validator: 'validator-1',
    evidence: ['evidence-1'], status: 'covered', critical: false,
  });
});

test('critical missing and manual clauses require justification and block', () => {
  const result = generateSkillClauseMatrix({ rows: [
    row('missing', { critical: true }),
    row('manual', { clause: 'clause-2', critical: true, justification: 'human review required' }),
  ]});
  assert.equal(result.verdict, 'blocked');
  assert.equal(result.rows[0].status, 'blocked');
  assert.equal(result.rows[0].critical, true);
  assert.equal(result.rows[1].status, 'manual');
  assert.equal(result.blocking.length, 2);
});

test('supports every declared status and validation reports non-covered outcomes', () => {
  const rows = PHASE9A_STATUSES.map((status, index) => row(status, {
    clause: `clause-${index}`,
    justification: status === 'manual' || status === 'missing' ? 'explicit exception' : undefined,
  }));
  const result = generateSkillClauseMatrix({ rows });
  assert.deepEqual(Object.keys(result.counts), PHASE9A_STATUSES);
  assert.equal(result.verdict, 'blocked');
  assert.equal(validateSkillClauseMatrix(result).valid, false);
});

test('rejects duplicate skill/clause pairs and covered rows without evidence', () => {
  assert.throws(() => generateSkillClauseMatrix({ rows: [row(), row()] }), /duplicate skill\/clause/);
  const result = generateSkillClauseMatrix({ rows: [row('covered', { evidence: [] })] });
  assert.equal(result.rows[0].status, 'blocked');
  assert.equal(result.verdict, 'blocked');
});
