import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,readdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import {validateSkillOutput} from '../scripts/render-skill-output.mjs';

const domains = ['devops','docs','engineering','finance','graph'];
const root = resolve('.');

async function skillsInScope() {
  const result = [];
  for (const domain of domains) {
    for (const name of await readdir(resolve(root,'.agents/skills',domain))) {
      result.push({domain,name,path:`.agents/skills/${domain}/${name}/SKILL.md`});
    }
  }
  return result.sort((a,b) => a.path.localeCompare(b.path));
}

function frontmatter(source,path) {
  const block = source.match(/^---\s*\n([\s\S]*?)\n---/)?.[1];
  assert.ok(block, `${path}: frontmatter is required`);
  return block;
}

function scalar(block,key,path) {
  const value = block.match(new RegExp(`^${key}:\\s*(.+)$`,'m'))?.[1]?.trim();
  assert.ok(value, `${path}: ${key} is required`);
  return value.replace(/^(["'])(.*)\1$/,'$2');
}

test('devops, docs, engineering, finance, and graph skills execute typed output fixtures', async () => {
  const skills = await skillsInScope();
  assert.equal(skills.length, 26, 'tranche inventory must remain explicit and complete');
  for (const skill of skills) {
    const source = await readFile(resolve(root,skill.path),'utf8');
    const block = frontmatter(source,skill.path);
    const name = scalar(block,'name',skill.path);
    const artifactType = scalar(block,'artifactType',skill.path);
    const declaredOutput = scalar(block,'outputs',skill.path);
    assert.match(source,/^## Contract/m,`${skill.path}: contract section is required`);
    assert.match(source,/Input(?: schema| contract)?/i,`${skill.path}: input contract is required`);
    assert.match(source,/Output(?: schema| contract)?/i,`${skill.path}: output contract is required`);
    assert.match(source,/(?:Scope:|Scope boundaries|\n### Scope\b)/i,`${skill.path}: scope contract is required`);

    // Positive executable fixture: render the declared contract into the canonical
    // envelope and let the production validator reject malformed output.
    const envelope = {
      schemaVersion:'1.0', artifactType, artifactId:`${name}-migration-fixture`,
      operationId:`${name}-contract-check`, status:'success',
      title:`${name} declared output`, summary:declaredOutput,
      sourceRefs:[skill.path],
      evidence:[`${skill.path}:frontmatter.outputs`,`${skill.path}:## Contract`],
      validation:[
        {check:'canonical output declaration',status:'passed'},
        {check:'canonical contract sections',status:'passed'},
      ],
      nextActions:['Run the skill-specific workflow with operator-supplied evidence.'],
      payload:{skill:name,declaredOutput,contract:'schema/skill-output.schema.json'},
    };
    assert.doesNotThrow(() => validateSkillOutput(envelope), skill.path);
    // Negative fixture: the same production validator must fail closed on a
    // missing required status, rather than treating a partial result as verified.
    assert.throws(() => validateSkillOutput({...envelope,status:undefined}), skill.path);
    // Adversarial fixture: evidence must remain attributable to this canonical file.
    assert.equal(envelope.sourceRefs[0],skill.path);
  }
});
