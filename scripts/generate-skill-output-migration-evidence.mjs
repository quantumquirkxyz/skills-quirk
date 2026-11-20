#!/usr/bin/env node
import {createHash} from 'node:crypto';
import {readFile, realpath, writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {spawn} from 'node:child_process';
import {inventorySkills} from './skill-output-inventory.mjs';
import {verifyMigrationEvidenceFiles} from './skill-output-migration-evidence.mjs';

const tranches = [
  ['tests/skill-output-migration-ai-backend.test.mjs', ['ai', 'backend']],
  ['tests/delivery-frontend-output-contracts.test.mjs', ['delivery', 'frontend']],
  ['tests/skill-output-migration-security-data-math-networking.test.mjs', ['sec', 'data', 'math', 'networking']],
  ['tests/skill-output-migration-foundation-integrations-iot-product-professional-ux.test.mjs',
    ['foundation', 'integrations', 'iot', 'product', 'professional', 'ux']],
  ['tests/skill-output-migration-devops-docs-engineering-finance-graph.test.mjs',
    ['devops', 'docs', 'engineering', 'finance', 'graph']],
  ['tests/skill-output-migration-auxiliary-cms-compilers-cs-db.test.mjs',
    ['auxiliary', 'cms', 'compilers', 'cs', 'db']],
  ['tests/skill-output-migration-accessibility-graphic-os-platform-xr.test.mjs',
    ['accessibility', 'graphic-design', 'os', 'platform', 'xr']],
  ['tests/skill-output-migration-routing-skill-dev.test.mjs', ['routing', 'skill-dev']],
  ['tests/skill-output-migration-physics.test.mjs', ['physics']],
  ['tests/skill-output-migration-quant.test.mjs', ['quant']],
  ['tests/skill-output-migration-research.test.mjs', ['research']],
  ['tests/skill-output-migration-web3.test.mjs', ['web3']],
  ['tests/skill-output-migration-loop-project-qa.test.mjs', ['loop', 'project', 'qa']],
];
const sha256 = value => createHash('sha256').update(value).digest('hex');

// A tranche is only trustworthy when the fixture itself declares its scope and
// exercises that scope. The generator must not turn a caller-supplied domain
// list into evidence by association alone.
export function fixtureExplicitlyCoversSkill(source, skillPath, domains) {
  const domain = skillPath.split('/')[2];
  if (!domains.includes(domain)) return false;
  const declaredDomains = source.match(/(?:const|let)\s+domains\s*=\s*\[([\s\S]*?)\]/)?.[1] ??
    source.match(/(?:const|let)\s+domain\s*=\s*['"`]([^'"`]+)['"`]/)?.[1] ?? '';
  const listedDomains = [...declaredDomains.matchAll(/['"`]([^'"`]+)['"`]/g)].map(match => match[1]);
  if (!listedDomains.includes(domain)) return false;
  return /readdir[\s\S]{0,160}domain/.test(source) &&
    /isDirectory/.test(source);
}

function executeFixture(root, fixture, timeoutMs) {
  return new Promise((settle, reject) => {
    const child = spawn(process.execPath, ['--test', resolve(root, fixture)], {
      cwd: root, stdio: 'ignore', shell: false, env: {...process.env, NODE_TEST_CONTEXT: undefined},
    });
    const timer = setTimeout(() => child.kill('SIGKILL'), timeoutMs);
    child.once('error', reject);
    child.once('close', (code, signal) => {
      clearTimeout(timer);
      if (code !== 0 || signal) reject(new Error(`${fixture} failed (exit=${code}, signal=${signal ?? 'none'})`));
      else settle();
    });
  });
}

export async function generateMigrationEvidence({root = '.', output = 'tests/skill-output-migration-evidence.json', timeoutMs = 30000} = {}) {
  const realRoot = await realpath(root);
  const inventory = await inventorySkills(resolve(root, '.agents/skills'), {base: root});
  const source = new Map();
  for (const [fixture, domains] of tranches) {
     await executeFixture(root, fixture, timeoutMs);
     const fixtureBytes = await readFile(resolve(root, fixture));
     const fixtureSource = fixtureBytes.toString('utf8');
     for (const skill of inventory.skills.filter(item =>
       fixtureExplicitlyCoversSkill(fixtureSource, item.path, domains))) {
       source.set(skill.path, {fixturePath: fixture, fixtureSha256: sha256(fixtureBytes)});
     }
  }
  const entries = [];
  for (const skill of inventory.skills) {
    const mapped = source.get(skill.path);
    if (!mapped) continue;
    const skillFile = resolve(root, skill.path);
    const fixtureFile = resolve(root, mapped.fixturePath);
    if (!(await realpath(skillFile)).startsWith(realRoot + '/') ||
        !(await realpath(fixtureFile)).startsWith(realRoot + '/')) {
      throw new Error(`Evidence path escapes repository: ${skill.path}`);
    }
    entries.push({
      path: skill.path,
      fixturePath: mapped.fixturePath,
      contract: 'schema/skill-output.schema.json',
      result: 'passed',
      skillSha256: sha256(await readFile(skillFile)),
      fixtureSha256: mapped.fixtureSha256,
    });
  }
  entries.sort((a, b) => a.path.localeCompare(b.path));
  const manifest = {
    schemaVersion: '1.0',
    generatedBy: 'scripts/generate-skill-output-migration-evidence.mjs',
    scope: {tranches: tranches.map(([fixture]) => fixture), verified: entries.length},
    entries,
  };
  const report = await verifyMigrationEvidenceFiles(inventory, manifest, {root});
  if (report.problems.length || report.missing.length !== inventory.total - entries.length) {
    throw new Error(`Generated evidence failed integrity validation: ${report.problems.join('; ')}`);
  }
  await writeFile(resolve(root, output), JSON.stringify(manifest, null, 2) + '\n');
  return {manifest, verified: report.verified, remaining: report.missing};
}

if (process.argv[1]?.endsWith('generate-skill-output-migration-evidence.mjs')) {
  try {
    const result = await generateMigrationEvidence({output: process.argv[2] ?? 'tests/skill-output-migration-evidence.json'});
    process.stdout.write(JSON.stringify({verified: result.verified.length, remaining: result.remaining.length, output: process.argv[2] ?? 'tests/skill-output-migration-evidence.json'}, null, 2) + '\n');
  } catch (error) {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
  }
}
