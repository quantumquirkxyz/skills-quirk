#!/usr/bin/env node
// Deterministic, read-only inventory of canonical skills.
// Usage: node scripts/skill-inventory.mjs [--root /path/to/repo] [--out /path/to/report.json]
import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';

const argv = process.argv.slice(2);
function flag(name) {
  const i = argv.indexOf(name);
  if (i === -1) return null;
  if (!argv[i + 1] || argv[i + 1].startsWith('--')) throw new Error(name + ' requires a value');
  return argv[i + 1];
}

async function scan(dir, root, results) {
  const children = await fs.readdir(dir, { withFileTypes: true });
  for (const child of children) {
    if (child.isSymbolicLink()) continue;
    const full = path.join(dir, child.name);
    if (child.isDirectory()) {
      await scan(full, root, results);
    } else if (child.isFile() && child.name === 'SKILL.md') {
      const relativePath = path.relative(root, full).split(path.sep).join('/');
      const content = await fs.readFile(full);
      results.push({
        path: relativePath,
        skill: path.basename(path.dirname(full)),
        domain: relativePath.split('/')[2],
        kind: relativePath.startsWith('.agents/skills/platform/') ? 'platform' : 'bundle',
        sha256: createHash('sha256').update(content).digest('hex'),
        bytes: content.length,
      });
    }
  }
}

try {
  const root = path.resolve(flag('--root') ?? process.cwd());
  const out = flag('--out');
  const skillsDir = path.join(root, '.agents', 'skills');
  const entries = [];
  await scan(skillsDir, root, entries);
  entries.sort((a, b) => a.path.localeCompare(b.path, 'en'));
  const report = {
    schema_version: 1,
    canonical_root: '.agents/skills',
    counts: {
      total: entries.length,
      bundle: entries.filter(entry => entry.kind === 'bundle').length,
      platform: entries.filter(entry => entry.kind === 'platform').length,
    },
    entries,
  };
  const output = JSON.stringify(report, null, 2) + '\n';
  if (out) {
    await fs.mkdir(path.dirname(path.resolve(out)), { recursive: true });
    await fs.writeFile(path.resolve(out), output);
  } else {
    process.stdout.write(output);
  }
} catch (error) {
  console.error('Skill inventory failed:', error.message);
  process.exitCode = 1;
}
