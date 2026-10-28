import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, readFileSync, existsSync, readdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const sync = path.join(root, '.agents', 'skills', 'platform', 'sync-bundle.mjs');
const manage = path.join(root, 'scripts', 'manage-adoption.mjs');

function runNode(script, args, cwd) {
  return spawnSync(process.execPath, [script, ...args], {
    cwd, encoding: 'utf8', timeout: 120000, maxBuffer: 8 * 1024 * 1024,
  });
}

test('managed install lifecycle verifies, backs up upgrades, and uninstalls conservatively', t => {
  const target = mkdtempSync(path.join(tmpdir(), 'quirk-lifecycle-'));
  t.after(() => rmSync(target, { recursive: true, force: true }));
  writeFileSync(path.join(target, 'README.md'), 'Consumer project\n');
  writeFileSync(path.join(target, 'CONTEXT.md'), 'Consumer context\n');

  const install = runNode(sync, [target, '--write'], root);
  assert.equal(install.status, 0, install.stderr || install.stdout);
  assert.ok(existsSync(path.join(target, '.agents', 'quirk-install.json')));

  const verify1 = runNode(manage, ['verify'], target);
  assert.equal(verify1.status, 0, verify1.stderr || verify1.stdout);
  assert.equal(JSON.parse(verify1.stdout).status, 'pass');

  writeFileSync(path.join(target, 'skills-lock.json'), '{"locally":"changed"}\n');
  const drift = runNode(manage, ['verify'], target);
  assert.equal(drift.status, 1);
  assert.ok(JSON.parse(drift.stdout).findings.some(item => item.path === 'skills-lock.json' && item.type === 'modified'));

  const preview = runNode(manage, ['upgrade'], target);
  assert.equal(preview.status, 0, preview.stderr || preview.stdout);
  assert.ok(JSON.parse(preview.stdout).backupFiles.includes('skills-lock.json'));

  const upgrade = runNode(manage, ['upgrade', '--write'], target);
  assert.equal(upgrade.status, 0, upgrade.stderr || upgrade.stdout);
  const upgradeReport = JSON.parse(upgrade.stdout);
  assert.ok(upgradeReport.backedUp >= 1);
  const backups = path.join(target, '.agents', 'quirk-backups');
  assert.ok(readdirSync(backups).length >= 1);

  const verify2 = runNode(manage, ['verify'], target);
  assert.equal(verify2.status, 0, verify2.stderr || verify2.stdout);

  const rollbackPreview = runNode(manage, ['rollback'], target);
  assert.equal(rollbackPreview.status, 0, rollbackPreview.stderr || rollbackPreview.stdout);
  assert.equal(JSON.parse(rollbackPreview.stdout).mode, 'dry-run');

  const rollback = runNode(manage, ['rollback', '--write'], target);
  assert.equal(rollback.status, 0, rollback.stderr || rollback.stdout);
  assert.equal(readFileSync(path.join(target, 'skills-lock.json'), 'utf8'), '{"locally":"changed"}\n');

  const rollbackDrift = runNode(manage, ['verify'], target);
  assert.equal(rollbackDrift.status, 1, 'rollback restores the exact pre-upgrade locally modified state');

  const blockedUninstall = runNode(manage, ['uninstall'], target);
  assert.equal(blockedUninstall.status, 1, 'locally modified managed files must block uninstall after rollback');

  const cleanAgain = runNode(manage, ['upgrade', '--write'], target);
  assert.equal(cleanAgain.status, 0, cleanAgain.stderr || cleanAgain.stdout);
  const verify3 = runNode(manage, ['verify'], target);
  assert.equal(verify3.status, 0, verify3.stderr || verify3.stdout);

  const uninstallPreview = runNode(manage, ['uninstall'], target);
  assert.equal(uninstallPreview.status, 0, uninstallPreview.stderr || uninstallPreview.stdout);
  assert.equal(JSON.parse(uninstallPreview.stdout).mode, 'dry-run');
  assert.ok(existsSync(path.join(target, '.agents', 'skills')));

  const uninstall = runNode(manage, ['uninstall', '--write'], target);
  assert.equal(uninstall.status, 0, uninstall.stderr || uninstall.stdout);
  assert.equal(readFileSync(path.join(target, 'README.md'), 'utf8'), 'Consumer project\n');
  assert.equal(readFileSync(path.join(target, 'CONTEXT.md'), 'utf8'), 'Consumer context\n');
  assert.ok(!existsSync(path.join(target, '.agents', 'quirk-install.json')));
  assert.ok(!existsSync(path.join(target, '.agents', 'skills')));
});


test('rollback restores the exact pre-upgrade bytes and preserves prior drift evidence', t => {
  const target = mkdtempSync(path.join(tmpdir(), 'quirk-rollback-'));
  t.after(() => rmSync(target, { recursive: true, force: true }));
  writeFileSync(path.join(target, 'README.md'), 'Consumer project\n');

  const install = runNode(sync, [target, '--write'], root);
  assert.equal(install.status, 0, install.stderr || install.stdout);

  const locallyModified = '{"locally":"preserve-me"}\n';
  writeFileSync(path.join(target, 'skills-lock.json'), locallyModified);

  const upgrade = runNode(manage, ['upgrade', '--write'], target);
  assert.equal(upgrade.status, 0, upgrade.stderr || upgrade.stdout);
  assert.notEqual(readFileSync(path.join(target, 'skills-lock.json'), 'utf8'), locallyModified);

  const preview = runNode(manage, ['rollback'], target);
  assert.equal(preview.status, 0, preview.stderr || preview.stdout);
  const plan = JSON.parse(preview.stdout);
  assert.equal(plan.mode, 'dry-run');
  assert.ok(plan.restoreFiles.includes('skills-lock.json'));

  const rollback = runNode(manage, ['rollback', '--write'], target);
  assert.equal(rollback.status, 0, rollback.stderr || rollback.stdout);
  assert.equal(readFileSync(path.join(target, 'skills-lock.json'), 'utf8'), locallyModified);
  assert.equal(readFileSync(path.join(target, 'README.md'), 'utf8'), 'Consumer project\n');

  const verify = runNode(manage, ['verify'], target);
  assert.equal(verify.status, 1, 'pre-upgrade local drift must remain visible after rollback');
  assert.ok(JSON.parse(verify.stdout).findings.some(item => item.path === 'skills-lock.json' && item.type === 'modified'));
});
