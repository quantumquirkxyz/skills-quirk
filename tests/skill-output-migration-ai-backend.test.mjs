import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,readdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import {validateFixture} from '../evals/run-behavioral.mjs';

const root=resolve('.');
const coveredSkills = ['.agents/skills/ai/agent-orchestration/SKILL.md', '.agents/skills/ai/ai-ml-pipeline/SKILL.md', '.agents/skills/ai/ai-model-evaluation/SKILL.md', '.agents/skills/ai/ai-prompt-engineering/SKILL.md', '.agents/skills/ai/ai-systems-engineering/SKILL.md', '.agents/skills/ai/ai-time-series-forecasting/SKILL.md', '.agents/skills/ai/llm-eval/SKILL.md', '.agents/skills/ai/llm-fine-tuning/SKILL.md', '.agents/skills/ai/llmops/SKILL.md', '.agents/skills/ai/mlops/SKILL.md', '.agents/skills/ai/multimodal-prompting/SKILL.md', '.agents/skills/ai/prompt-template-library/SKILL.md', '.agents/skills/ai/rag-pipeline/SKILL.md', '.agents/skills/ai/structured-output/SKILL.md', '.agents/skills/backend/api-gateway/SKILL.md', '.agents/skills/backend/backend-architecture/SKILL.md', '.agents/skills/backend/backend-caching/SKILL.md', '.agents/skills/backend/backend-queues/SKILL.md', '.agents/skills/backend/caching-advanced/SKILL.md', '.agents/skills/backend/distributed-tracing/SKILL.md', '.agents/skills/backend/event-driven-architecture/SKILL.md', '.agents/skills/backend/grpc-connect/SKILL.md', '.agents/skills/backend/microservices/SKILL.md', '.agents/skills/backend/rate-limiting/SKILL.md', '.agents/skills/backend/serverless/SKILL.md', '.agents/skills/backend/service-mesh/SKILL.md', '.agents/skills/backend/websockets/SKILL.md'];
const domains=['ai','backend'];

async function canonicalSkills() {
  const paths=[];
  for (const domain of domains) {
    const entries=await readdir(resolve(root,'.agents/skills',domain),{withFileTypes:true});
    for (const entry of entries) if (entry.isDirectory()) paths.push(`${domain}/${entry.name}`);
  }
  return paths.sort();
}

function fixturePath(skillText) {
  return skillText.match(/^fixturesPath:\s*["']?([^"'\r\n]+?)["']?\s*$/m)?.[1]?.trim() ?? null;
}

function evaluateStaticFixture(skillText,fixture) {
  const expected=fixture.expected;
  const body=skillText.replace(/^---[\s\S]*?---\s*/,'').toLowerCase();
  const frontmatter=skillText.match(/^---[\s\S]*?---/)?.[0] ?? '';
  for (const phrase of expected.outputContains ?? []) {
    assert.match(body,new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g,'\\$&').toLowerCase()),
      `fixture requires missing output phrase: ${phrase}`);
  }
  for (const phrase of expected.doesNotContain ?? []) {
    assert.doesNotMatch(body,new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g,'\\$&').toLowerCase()),
      `fixture forbids output phrase: ${phrase}`);
  }
  for (const phrase of expected.frontmatterContains ?? []) {
    assert.match(frontmatter,new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')),
      `fixture requires missing frontmatter phrase: ${phrase}`);
  }
}

test('AI and backend output migration has an executable fixture for every skill',async()=>{
  const skills=await canonicalSkills();
  assert.equal(skills.length,27);
  const outcomes=[];
  for (const skill of skills) {
    const skillFile=resolve(root,'.agents/skills',skill,'SKILL.md');
    const text=await readFile(skillFile,'utf8');
    const fixture=fixturePath(text);
    assert.ok(fixture,`${skill} must declare a behavioral fixture`);
    const fixtureFile=resolve(root,fixture);
    const data=JSON.parse(await readFile(fixtureFile,'utf8'));
    if (Array.isArray(data.fixtures)) {
      assert.ok(data.fixtures.length>0,`${skill} fixture must contain cases`);
      for (const caseFixture of data.fixtures) evaluateStaticFixture(text,caseFixture);
      outcomes.push({skill,cases:data.fixtures.length,mode:'static-behavioral'});
    } else {
      const errors=await validateFixture(data,fixtureFile,
        new Set(skills));
      assert.deepEqual(errors,[],`${skill} fixture is invalid: ${errors.join('; ')}`);
      assert.ok(data.assertions.some(assertion=>assertion.type==='deterministic'),
        `${skill} fixture needs deterministic evidence`);
      outcomes.push({skill,cases:data.assertions.length,mode:'transcript-behavioral'});
    }
  }
  assert.equal(outcomes.length,27);
});
