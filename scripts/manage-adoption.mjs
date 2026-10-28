#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const bundleRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const syncScript = path.join(bundleRoot, '.agents', 'skills', 'platform', 'sync-bundle.mjs');
const targetRoot = process.cwd();
const [command, ...argv] = process.argv.slice(2);
const write = argv.includes('--write');
const manifestPath = path.join(targetRoot, '.agents', 'quirk-install.json');

async function exists(p) { try { await fs.lstat(p); return true; } catch { return false; } }
async function hashFile(p) { return crypto.createHash('sha256').update(await fs.readFile(p)).digest('hex'); }
async function loadManifest() {
  if (!(await exists(manifestPath))) throw new Error('No managed quirk installation manifest found at .agents/quirk-install.json');
  const parsed = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
  if (parsed.schemaVersion !== 1 || !parsed.managedFiles || typeof parsed.managedFiles !== 'object') throw new Error('Unsupported or malformed managed installation manifest');
  return parsed;
}
function runSync(...args) {
  const result = spawnSync(process.execPath, [syncScript, targetRoot, ...args], {
    cwd: bundleRoot, encoding: 'utf8', timeout: 120000, maxBuffer: 8 * 1024 * 1024,
  });
  const text = (result.stdout || '').trim();
  let payload = null;
  try { payload = text ? JSON.parse(text) : null; } catch {}
  return { ...result, payload };
}
async function ensureInside(rel) {
  const absolute = path.resolve(targetRoot, rel);
  const relative = path.relative(targetRoot, absolute);
  if (relative.startsWith('..' + path.sep) || path.isAbsolute(relative)) throw new Error('Managed path escapes target: ' + rel);
  return absolute;
}
async function verify() {
  const manifest = await loadManifest();
  const findings = [];
  for (const [rel, expected] of Object.entries(manifest.managedFiles)) {
    const absolute = await ensureInside(rel);
    if (!(await exists(absolute))) { findings.push({ path: rel, type: 'missing' }); continue; }
    const stat = await fs.lstat(absolute);
    if (!stat.isFile()) { findings.push({ path: rel, type: 'unexpected-type' }); continue; }
    const actual = await hashFile(absolute);
    if (actual !== expected) findings.push({ path: rel, type: 'modified' });
  }
  for (const name of manifest.compatibilityLinks || []) {
    const link = path.join(targetRoot, '.claude', 'skills', name);
    if (!(await exists(link))) { findings.push({ path: '.claude/skills/' + name, type: 'missing-link' }); continue; }
    const stat = await fs.lstat(link);
    if (!stat.isSymbolicLink()) findings.push({ path: '.claude/skills/' + name, type: 'unexpected-link-type' });
  }
  console.log(JSON.stringify({ status: findings.length ? 'drift' : 'pass', bundleVersion: manifest.bundleVersion ?? null, findings }, null, 2));
  process.exitCode = findings.length ? 1 : 0;
}
async function pruneEmpty(dir, stop) {
  let current = dir;
  while (current.startsWith(stop) && current !== stop) {
    try {
      if ((await fs.readdir(current)).length) return;
      await fs.rmdir(current);
      current = path.dirname(current);
    } catch { return; }
  }
}
async function uninstall() {
  const manifest = await loadManifest();
  const modified = [];
  const removable = [];
  for (const [rel, expected] of Object.entries(manifest.managedFiles)) {
    const absolute = await ensureInside(rel);
    if (!(await exists(absolute))) continue;
    const stat = await fs.lstat(absolute);
    if (!stat.isFile() || await hashFile(absolute).catch(() => '') !== expected) modified.push(rel);
    else removable.push(rel);
  }
  const linkPlan = [];
  for (const name of manifest.compatibilityLinks || []) {
    const rel = '.claude/skills/' + name;
    const link = path.join(targetRoot, rel);
    if (!(await exists(link))) continue;
    const stat = await fs.lstat(link);
    if (!stat.isSymbolicLink()) modified.push(rel);
    else linkPlan.push(rel);
  }
  if (modified.length) {
    console.log(JSON.stringify({ status: 'blocked', mode: write ? 'write' : 'dry-run', modified, note: 'Modified or host-owned managed paths are never removed automatically.' }, null, 2));
    process.exitCode = 1; return;
  }
  if (!write) {
    console.log(JSON.stringify({ status: 'pass', mode: 'dry-run', removeFiles: removable, removeLinks: linkPlan, note: 'No files removed. Add --write to apply.' }, null, 2));
    return;
  }
  for (const rel of linkPlan) await fs.unlink(await ensureInside(rel));
  for (const rel of removable.sort((a,b)=>b.length-a.length)) {
    const absolute = await ensureInside(rel);
    await fs.unlink(absolute);
    await pruneEmpty(path.dirname(absolute), targetRoot);
  }
  await fs.rm(manifestPath, { force: true });
  await pruneEmpty(path.dirname(manifestPath), targetRoot);
  console.log(JSON.stringify({ status: 'pass', mode: 'write', removedFiles: removable.length, removedLinks: linkPlan.length }, null, 2));
}
async function copyBackup(source, destination) {
  const stat = await fs.lstat(source);
  await fs.mkdir(path.dirname(destination), { recursive: true });
  if (stat.isDirectory()) await fs.cp(source, destination, { recursive: true, force: false });
  else if (stat.isSymbolicLink()) await fs.writeFile(destination + '.symlink.txt', await fs.readlink(source));
  else await fs.copyFile(source, destination);
}
async function upgrade() {
  await loadManifest();
  const preview = runSync();
  if (preview.status === 0) {
    console.log(JSON.stringify({ status: 'pass', mode: write ? 'write' : 'dry-run', conflicts: [], note: write ? 'Already current; no changes required.' : 'Upgrade can be applied without backups.' }, null, 2));
    if (write) {
      const applied = runSync('--write');
      if (applied.status !== 0) throw new Error(applied.stderr || applied.stdout || 'sync failed');
    }
    return;
  }
  const conflicts = preview.payload?.conflicts;
  if (!Array.isArray(conflicts)) throw new Error(preview.stderr || preview.stdout || 'Unable to inspect upgrade conflicts');
  const linkConflicts = conflicts.filter(x => x.startsWith('.claude/skills/'));
  if (linkConflicts.length) {
    console.log(JSON.stringify({ status: 'blocked', mode: write ? 'write' : 'dry-run', conflicts: linkConflicts, note: 'Compatibility-view conflicts require manual resolution; upgrade will not replace host-owned entries.' }, null, 2));
    process.exitCode = 1; return;
  }
  const backupFiles = [];
  for (const rel of conflicts) {
    const absolute = await ensureInside(rel);
    if (await exists(absolute)) backupFiles.push(rel);
  }
  if (!write) {
    console.log(JSON.stringify({ status: 'pass', mode: 'dry-run', backupFiles, note: 'Add --write to back up changed managed files and upgrade.' }, null, 2));
    return;
  }
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupRoot = path.join(targetRoot, '.agents', 'quirk-backups', stamp);
  await fs.mkdir(backupRoot, { recursive: true });
  await fs.copyFile(manifestPath, path.join(backupRoot, '.quirk-install.previous.json'));
  for (const rel of backupFiles) await copyBackup(await ensureInside(rel), path.join(backupRoot, rel));
  const applied = runSync('--write', '--force');
  if (applied.status !== 0) throw new Error(applied.stderr || applied.stdout || 'upgrade sync failed');
  console.log(JSON.stringify({ status: 'pass', mode: 'write', backupRoot: path.relative(targetRoot, backupRoot).split(path.sep).join('/'), backedUp: backupFiles.length }, null, 2));
}


async function latestBackupRoot() {
  const root = path.join(targetRoot, '.agents', 'quirk-backups');
  if (!(await exists(root))) throw new Error('No managed upgrade backups found');
  const entries = (await fs.readdir(root, { withFileTypes: true }))
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name)
    .sort()
    .reverse();
  for (const name of entries) {
    const candidate = path.join(root, name);
    if (await exists(path.join(candidate, '.quirk-install.previous.json'))) return candidate;
  }
  throw new Error('No rollback-capable managed backup found');
}

async function rollback() {
  const current = await loadManifest();
  const backupRoot = await latestBackupRoot();
  const previousManifestPath = path.join(backupRoot, '.quirk-install.previous.json');
  const previous = JSON.parse(await fs.readFile(previousManifestPath, 'utf8'));
  if (previous.schemaVersion !== 1 || !previous.managedFiles || typeof previous.managedFiles !== 'object') {
    throw new Error('Rollback backup contains an invalid previous manifest');
  }

  const drift = [];
  for (const [rel, expected] of Object.entries(current.managedFiles)) {
    const absolute = await ensureInside(rel);
    if (!(await exists(absolute))) { drift.push({ path: rel, type: 'missing' }); continue; }
    const stat = await fs.lstat(absolute);
    if (!stat.isFile() || await hashFile(absolute).catch(() => '') !== expected) drift.push({ path: rel, type: 'modified' });
  }
  for (const name of current.compatibilityLinks || []) {
    const rel = '.claude/skills/' + name;
    const link = await ensureInside(rel);
    if (!(await exists(link)) || !(await fs.lstat(link)).isSymbolicLink()) drift.push({ path: rel, type: 'link-drift' });
  }
  if (drift.length) {
    console.log(JSON.stringify({
      status: 'blocked',
      mode: write ? 'write' : 'dry-run',
      backupRoot: path.relative(targetRoot, backupRoot).split(path.sep).join('/'),
      drift,
      note: 'Rollback refuses to overwrite changes made after the upgrade.',
    }, null, 2));
    process.exitCode = 1;
    return;
  }

  const previousFiles = new Set(Object.keys(previous.managedFiles));
  const newFiles = Object.keys(current.managedFiles).filter(rel => !previousFiles.has(rel));
  const previousLinks = new Set(previous.compatibilityLinks || []);
  const newLinks = (current.compatibilityLinks || []).filter(name => !previousLinks.has(name));
  const restoreFiles = [];
  for (const rel of Object.keys(previous.managedFiles)) {
    if (await exists(path.join(backupRoot, rel))) restoreFiles.push(rel);
  }

  if (!write) {
    console.log(JSON.stringify({
      status: 'pass',
      mode: 'dry-run',
      backupRoot: path.relative(targetRoot, backupRoot).split(path.sep).join('/'),
      restoreFiles,
      removeFiles: newFiles,
      removeLinks: newLinks,
      targetBundleVersion: previous.bundleVersion ?? null,
      note: 'No files changed. Add --write to apply rollback.',
    }, null, 2));
    return;
  }

  for (const name of newLinks) {
    const link = await ensureInside('.claude/skills/' + name);
    if (await exists(link) && (await fs.lstat(link)).isSymbolicLink()) await fs.unlink(link);
  }
  for (const rel of newFiles.sort((a,b)=>b.length-a.length)) {
    const absolute = await ensureInside(rel);
    if (await exists(absolute)) {
      await fs.unlink(absolute);
      await pruneEmpty(path.dirname(absolute), targetRoot);
    }
  }
  for (const rel of restoreFiles) {
    const source = path.join(backupRoot, rel);
    const destination = await ensureInside(rel);
    await fs.mkdir(path.dirname(destination), { recursive: true });
    await fs.copyFile(source, destination);
  }
  await fs.copyFile(previousManifestPath, manifestPath);

  console.log(JSON.stringify({
    status: 'pass',
    mode: 'write',
    backupRoot: path.relative(targetRoot, backupRoot).split(path.sep).join('/'),
    restoredFiles: restoreFiles.length,
    removedFiles: newFiles.length,
    removedLinks: newLinks.length,
    bundleVersion: previous.bundleVersion ?? null,
  }, null, 2));
}

try {
  if (command === 'verify') await verify();
  else if (command === 'uninstall') await uninstall();
  else if (command === 'upgrade') await upgrade();
  else if (command === 'rollback') await rollback();
  else throw new Error('Usage: manage-adoption.mjs <verify|upgrade|rollback|uninstall> [--write]');
} catch (error) {
  console.error(error.message);
  process.exitCode = 2;
}
