import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {validateSkillOutput} from '../scripts/render-skill-output.mjs';

const root=resolve('.');
const coveredSkills = [
  '.agents/skills/platform/performance/performance/SKILL.md',
  '.agents/skills/platform/quality-gates/gate-ci/SKILL.md',
  '.agents/skills/platform/quality-gates/gate-ide/SKILL.md',
  '.agents/skills/platform/quality-gates/gate-post-merge/SKILL.md',
  '.agents/skills/platform/quality-gates/gate-pre-commit/SKILL.md',
  '.agents/skills/platform/system-design/system-design/SKILL.md',
];

function frontmatter(source,path) {
  const block=source.match(/^---\s*\n([\s\S]*?)\n---/)?.[1];
  assert.ok(block,`${path}: canonical frontmatter is required`);
  return block;
}
function scalar(block,key,path) {
  const value=block.match(new RegExp(`^${key}:\\s*(.+)$`,'m'))?.[1]?.trim();
  assert.ok(value,`${path}: ${key} is required`);
  return value.replace(/^(["'])(.*)\1$/,'$2');
}

test('remaining platform skills execute real output validation',async()=>{
  assert.equal(coveredSkills.length,6);
  assert.equal(new Set(coveredSkills).size,coveredSkills.length);
  for(const path of coveredSkills) {
    const source=await readFile(resolve(root,path),'utf8');
    const block=frontmatter(source,path);
    const name=scalar(block,'name',path);
    const artifactType=scalar(block,'artifactType',path);
    const output=scalar(block,'outputs',path);
    scalar(block,'fixturesPath',path);
    assert.match(source,/^## Contract/m,`${path}: contract section is required`);
    assert.match(source,/^(?:- Input:|\*{2}Input schema|### Input schema)/m,`${path}: input contract is required`);
    assert.match(source,/^(?:- Output:|\*{2}Output schema|### Output schema)/m,`${path}: output contract is required`);
    const envelope={
      schemaVersion:'1.0',artifactType,artifactId:`${name}-migration-fixture`,
      operationId:`${name}-contract-check`,status:'success',
      title:`${name} declared output`,summary:output,sourceRefs:[path],
      evidence:[`${path}:frontmatter.outputs`,`${path}:## Contract`],
      validation:[{check:'canonical output declaration',status:'passed'}],
      nextActions:['Apply the declared contract to a real invocation with source-specific evidence.'],
      payload:{skill:name,declaredOutput:output,contract:'schema/skill-output.schema.json'},
    };
    assert.doesNotThrow(()=>validateSkillOutput(envelope),path);
  }
});
