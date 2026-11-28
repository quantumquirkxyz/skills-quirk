import test from 'node:test';
import assert from 'node:assert/strict';
import {evaluateCoverage,evaluateReleaseCoverage} from '../scripts/check-skill-output-coverage.mjs';

const sample=statuses=>({total:statuses.length,skills:statuses.map((migrationStatus,i)=>({path:'skill-'+i,migrationStatus}))});
test('classification gate passes when every skill is assessed',()=>{
  const result=evaluateCoverage(sample(['missing-output-declaration','schema-referenced-needs-verification']));
  assert.equal(result.classified,2);
  assert.equal(result.passed,true);
  assert.equal(result.verified,0);
});
test('release gate fails until every skill is mapped and verified',()=>{
  const result=evaluateCoverage(sample(['mapped-and-verified','schema-referenced-needs-verification']),{requireMapped:true});
  assert.equal(result.passed,false);
  assert.deepEqual(result.unmapped,['skill-0','skill-1']);
});
test('release gate passes only on verified complete inventory',()=>{
  const result=evaluateCoverage(sample(['mapped-and-verified']),{requireMapped:true,verifiedPaths:['skill-0']});
  assert.equal(result.passed,true);
  assert.equal(result.verified,1);
});
test('rejects invalid inventory and unassessed skills',()=>{
  assert.throws(()=>evaluateCoverage({total:3,skills:[]}),/Invalid/);
  assert.equal(evaluateCoverage(sample(['not-assessed'])).passed,false);
});

test('self-declared mapped status cannot bypass evidence-backed release gate',()=>{
  const result=evaluateCoverage(sample(['mapped-and-verified']),{requireMapped:true});
  assert.equal(result.passed,false);
  assert.equal(result.verified,0);
});

test('release gate refuses empty catalogs and unknown verified paths',()=>{
  assert.throws(()=>evaluateCoverage(sample([])),/Empty canonical/);
  assert.throws(()=>evaluateCoverage(sample(['mapped-and-verified']),{verifiedPaths:['nonexistent']}),/Unknown verified/);
  assert.throws(()=>evaluateCoverage({total:2,skills:[{path:'duplicate',migrationStatus:'mapped-and-verified'},{path:'duplicate',migrationStatus:'mapped-and-verified'}]}),/Duplicate canonical/);
});

test('release evidence cannot narrow the canonical inventory to a tranche',()=>{
  const inventory=sample(Array.from({length:285},(_,i)=>i<254?'mapped-and-verified':'schema-referenced-needs-verification'));
  const result=evaluateReleaseCoverage(inventory,{
    requireMapped:true,
    verifiedPaths:Array.from({length:254},(_,i)=>`skill-${i}`),
  });
  assert.equal(result.total,285);
  assert.equal(result.verified,254);
  assert.equal(result.passed,false);
  assert.equal(result.remaining.length,31);
  assert.deepEqual(result.remaining,Array.from({length:31},(_,i)=>`skill-${i+254}`));
});
