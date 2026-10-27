import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';

const repoRoot = process.cwd();
const args = process.argv.slice(2);
const targetArg = args.find((arg) => !arg.startsWith('--'));
const write = args.includes('--write');
const force = args.includes('--force');

if (!targetArg) {
  console.error('Usage: node .agents/skills/platform/sync-bundle.mjs <target-repo> [--write] [--force]');
  process.exit(2);
}

const targetRoot = path.resolve(targetArg);
if (targetRoot === repoRoot || repoRoot.startsWith(targetRoot + path.sep) || targetRoot.startsWith(repoRoot + path.sep)) {
  console.error('Source and target must be separate, non-nested repositories.');
  process.exit(2);
}

// Never follow a pre-existing destination symlink (including parent directories).
async function ensureSafeDestination(destination) {
  const rel = path.relative(targetRoot, destination);
  if (rel === '..' || rel.startsWith('..' + path.sep) || path.isAbsolute(rel)) throw new Error('Target path escapes repository');
  let cursor = targetRoot;
  for (const segment of rel.split(path.sep).filter(Boolean)) {
    try {
      const stat = await fs.lstat(cursor);
      if (stat.isSymbolicLink()) throw new Error('Refusing to traverse target symlink: ' + cursor);
    } catch (error) { if (error.code !== 'ENOENT') throw error; }
    cursor = path.join(cursor, segment);
  }
  try { if ((await fs.lstat(cursor)).isSymbolicLink()) throw new Error('Refusing to replace target symlink: ' + cursor); }
  catch (error) { if (error.code !== 'ENOENT') throw error; }
}

const copyEntries = [
  '.agents/AGENTS.md',
  '.agents/skills',
  'docs/reference/agents',
  'docs/reference/adr/README.md',
  'docs/how-to',
  'docs/explanation',
  'hooks/hooks.json',
  'tooling/case-studies/README.md',
  'tooling/case-studies/template.md',
  'AUTHORSHIP.md',
  'CONTEXT.md',
  'README.md',
  'LICENSE',
  'VERSION',
  'CHANGELOG.md',
  'skills-lock.json',
  'skills.json',
  '.env.template',
];

async function exists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function hashFile(filePath) {
  return crypto.createHash('sha256').update(await fs.readFile(filePath)).digest('hex');
}

async function walk(filePath) {
  const stat = await fs.lstat(filePath);
  if (stat.isSymbolicLink()) return [];
  if (!stat.isDirectory()) return [filePath];
  const out = [];
  for (const entry of await fs.readdir(filePath)) {
    out.push(...await walk(path.join(filePath, entry)));
  }
  return out;
}

async function copyPath(source, target) {
  if (source === target) return;
  await ensureSafeDestination(target);
  const stat = await fs.lstat(source);
  if (stat.isSymbolicLink()) return;
  if (stat.isDirectory()) {
    await fs.mkdir(target, { recursive: true });
    for (const entry of await fs.readdir(source)) {
      await copyPath(path.join(source, entry), path.join(target, entry));
    }
    return;
  }
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.copyFile(source, target);
}

async function recreateClaudeLinks() {
  const claudeRoot = path.join(targetRoot, '.claude', 'skills');
  const skillsRoot = path.join(targetRoot, '.agents', 'skills');
  await ensureSafeDestination(claudeRoot);
  await fs.mkdir(claudeRoot, { recursive: true });
  async function linkSkill(skillDir) {
    const flatName = path.basename(skillDir);
    const flatPath = path.join(claudeRoot, flatName);
    const targetFor = path.relative(path.dirname(flatPath), skillDir);
    await fs.mkdir(path.dirname(flatPath), { recursive: true });
    let existing;
    try { existing = await fs.lstat(flatPath); } catch (error) { if (error.code !== 'ENOENT') throw error; }
    if (existing) {
      const stat = existing;
      if (!stat.isSymbolicLink()) {
        if (!force) throw new Error(`Refusing to replace non-symlink ${flatPath}`);
        await fs.rm(flatPath, { recursive: true, force: true });
      } else {
        const current = await fs.readlink(flatPath);
        if (current === targetFor) return;
        if (!force) throw new Error(`Refusing to replace existing symlink ${flatPath}`);
        await fs.unlink(flatPath);
      }
    }
    await fs.symlink(targetFor, flatPath);
  }
  async function walkSkills(dir) {
    for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
      if (!entry.isDirectory() || entry.name === 'platform') continue;
      const child = path.join(dir, entry.name);
      const skillMd = path.join(child, 'SKILL.md');
      if (await exists(skillMd)) await linkSkill(child);
      else await walkSkills(child);
    }
  }
  await walkSkills(skillsRoot);
}

const planned = [];
const conflicts = [];

for (const relative of copyEntries) {
  const source = path.join(repoRoot, relative);
  if (!(await exists(source))) continue;
  for (const sourceFile of await walk(source)) {
    const relFile = path.relative(repoRoot, sourceFile);
    const targetFile = path.join(targetRoot, relFile);
    await ensureSafeDestination(targetFile);
    if (await exists(targetFile)) {
      const same = await hashFile(sourceFile) === await hashFile(targetFile).catch(() => '');
      if (!same && !force) conflicts.push(relFile);
    }
    planned.push(relFile);
  }
}

if (conflicts.length) {
  console.log(JSON.stringify({
    status: 'blocked',
    write,
    target: targetRoot,
    conflicts,
    note: 'Use --force with --write only after reviewing target-local changes.',
  }, null, 2));
  process.exit(1);
}

if (write) {
  for (const relative of copyEntries) {
    const source = path.join(repoRoot, relative);
    const target = path.join(targetRoot, relative);
    if (await exists(source)) await copyPath(source, target);
  }
  await recreateClaudeLinks();
}

console.log(JSON.stringify({
  status: 'pass',
  mode: write ? 'write' : 'dry-run',
  target: targetRoot,
  files: planned.length,
  note: write ? 'Bundle synced.' : 'No files written. Add --write to apply.',
}, null, 2));
