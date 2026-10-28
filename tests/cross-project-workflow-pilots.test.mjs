import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const machine = path.join(root, '.agents', 'skills', 'platform', 'workflow-state-machine.mjs');
const sourceWorkflows = path.join(root, '.agents', 'skills', 'platform', 'workflows');
const domains = [
  ['typescript-fullstack', 'package.json', '{"scripts":{"test":"node --test"}}\n'],
  ['python-api', 'pyproject.toml', '[project]\nname="pilot"\n'],
  ['ml-research', 'requirements.txt', 'numpy\n'],
  ['iot-embedded', 'platformio.ini', '[env:uno]\nplatform=atmelavr\n'],
  ['solidity-contracts', 'foundry.toml', '[profile.default]\n'],
];

function run(project, env, workflow, command, ...args) {
  const result = spawnSync(process.execPath, [machine, workflow, command, ...args, '--json'], {
    cwd: project, env: { ...process.env, ...env }, encoding: 'utf8', timeout: 10000,
  });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  return result.stdout.trim() ? JSON.parse(result.stdout) : null;
}

function prepareWorkflows(dir) {
  fs.mkdirSync(dir, { recursive: true });
  for (const name of ['standard-feature.yaml', 'bug-fix.yaml', 'repair.yaml']) {
    const text = fs.readFileSync(path.join(sourceWorkflows, name), 'utf8').replace('gateCI: "pending"', 'gateCI: "passed"');
    fs.writeFileSync(path.join(dir, name), text);
  }
}

for (const [domain, marker, markerText] of domains) {
  test(`${domain}: feature, review-repair, bug-fix and replay use the same portable graph`, t => {
    const sandbox = fs.mkdtempSync(path.join(os.tmpdir(), 'quirk-domain-pilot-'));
    t.after(() => fs.rmSync(sandbox, { recursive: true, force: true }));
    const project = path.join(sandbox, 'project');
    const workflows = path.join(sandbox, 'workflows');
    const state = path.join(sandbox, 'state');
    fs.mkdirSync(project);
    fs.writeFileSync(path.join(project, marker), markerText);
    fs.writeFileSync(path.join(project, 'CONTEXT.md'), `domain: ${domain}\nconstraint: preserve project-specific files\n`);
    prepareWorkflows(workflows);
    const env = {
      WORKFLOW_STATE_MACHINE_WORKFLOWS_DIR: workflows,
      WORKFLOW_STATE_MACHINE_STATE_DIR: state,
    };

    run(project, env, 'standard-feature', 'reset');
    for (const event of ['CLEAR_SPEC','PUBLISHED','APPROVED','NEXT_READY','VALIDATED','OPENED','FINDINGS','CLEAN','MERGED']) {
      run(project, env, 'standard-feature', 'transition', event);
    }
    const featureReplay = run(project, env, 'standard-feature', 'replay');
    assert.equal(featureReplay.ok, true);
    assert.equal(featureReplay.state.currentState, 'done');
    assert.equal(featureReplay.verification.matchesPersistedSnapshot, true);

    run(project, env, 'bug-fix', 'reset');
    for (const event of ['REPRODUCED','GREEN','OPENED','CLEAN','MERGED']) {
      run(project, env, 'bug-fix', 'transition', event);
    }
    const bugReplay = run(project, env, 'bug-fix', 'replay');
    assert.equal(bugReplay.ok, true);
    assert.equal(bugReplay.state.currentState, 'done');
    assert.equal(bugReplay.verification.matchesPersistedSnapshot, true);

    assert.equal(fs.readFileSync(path.join(project, marker), 'utf8'), markerText);
    assert.match(fs.readFileSync(path.join(project, 'CONTEXT.md'), 'utf8'), new RegExp(domain));
  });
}
