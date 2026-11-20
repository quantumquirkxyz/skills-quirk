import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,readdir} from 'node:fs/promises';
import {resolve} from 'node:path';

const root=resolve('.');
const domains=['foundation','integrations','iot','product','professional','ux'];

async function canonicalSkills() {
  const paths=[];
  for (const domain of domains) {
    const entries=await readdir(resolve(root,'.agents/skills',domain),{withFileTypes:true});
    for (const entry of entries) if (entry.isDirectory()) paths.push(`${domain}/${entry.name}`);
  }
  return paths.sort();
}

function frontmatter(text) {
  return text.match(/^---[\s\S]*?---/)?.[0] ?? '';
}

test('foundation, integrations, iot, product, professional, and ux skills expose executable output contracts',async()=>{
  const skills=await canonicalSkills();
  assert.equal(skills.length,33);
  for (const skill of skills) {
    const text=await readFile(resolve(root,'.agents/skills',skill,'SKILL.md'),'utf8');
    const fm=frontmatter(text);
    const body=text.slice(fm.length).toLowerCase();
    assert.match(fm,/^name:\s*\S+/m,`${skill} must identify its output contract`);
    assert.match(fm,/^outputs:\s*(?:$|["'])/m,`${skill} must declare outputs`);
    assert.match(fm,/^artifactType:\s*\S+/m,`${skill} must declare an artifact type`);
    assert.match(fm,/^stopConditions?:\s*(?:$|\S)/m,`${skill} must declare a stop condition`);
    assert.match(body,/^## contract\b/m,`${skill} must document its contract`);
    assert.match(body,/(?:^\s*-\s*(?:\*\*)?output(?::\*\*)?\s*:|^outputs:\s*$)/m,`${skill} must document its output`);
    assert.match(body,/\bscope\b/m,`${skill} must document its scope`);
    assert.match(body,/\brules?\b/m,`${skill} must document at least one contract rule`);
    assert.match(body,/^## provenance\b/m,`${skill} must document provenance`);
  }
});
