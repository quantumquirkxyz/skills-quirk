#!/usr/bin/env node
// generate-site-data.mjs - Generates site/src/skills.json from the skills bundle
// Usage: node generate-site-data.mjs [--write]

import fs from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const skillsRoot = path.join(root, '.agents', 'skills');
const outputPath = path.join(root, 'site', 'src', 'skills.json');
const write = process.argv.includes('--write');

function parseFrontmatter(text) {
  if (!text.startsWith('---')) return {};
  const end = text.indexOf('\n---', 3);
  if (end === -1) return {};
  const out = {};
  let active = null;
  for (const line of text.slice(4, end).split(/\r?\n/)) {
    const key = line.match(/^([A-Za-z][A-Za-z0-9-]*):\s*(.*)$/);
    if (key) {
      active = key[1];
      out[active] = key[2] === '' || key[2] === '[]' ? [] : key[2].replace(/^["']|["']$/g, '');
      continue;
    }
    const item = line.match(/^\s+-\s+(.+)$/);
    if (item && active) {
      if (!Array.isArray(out[active])) out[active] = [];
      out[active].push(item[1].replace(/^["']|["']$/g, ''));
    }
  }
  return out;
}

async function exists(p) { try { await fs.access(p); return true; } catch { return false; } }

async function collectSkills(dir, out = []) {
  if (!(await exists(dir))) return out;
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.name === 'platform') continue;
    const child = path.join(dir, entry.name);
    const skillMd = path.join(child, 'SKILL.md');
    if (await exists(skillMd)) {
      const text = await fs.readFile(skillMd, 'utf8');
      const fm = parseFrontmatter(text);
      out.push({
        name: entry.name,
        category: fm.category || 'uncategorized',
        description: fm.description || '',
        capabilities: Array.isArray(fm.capabilities) ? fm.capabilities : [],
        maturity: fm.maturity || 'stable',
        version: fm.version || '1.0.0',
        risk: fm.risk || 'low',
        trustTier: fm.trustTier || '1',
        sideEffects: Array.isArray(fm.sideEffects) ? fm.sideEffects : [],
        dependencies: Array.isArray(fm.dependencies) ? fm.dependencies : [],
        path: path.relative(root, child),
      });
    } else {
      await collectSkills(child, out);
    }
  }
  return out;
}

async function main() {
  console.log('[generate-site-data] Collecting skills...');
  const skills = await collectSkills(skillsRoot);
  const categories = [...new Set(skills.map(s => s.category))].sort();

  const data = {
    generatedAt: new Date().toISOString(),
    totalSkills: skills.length,
    categories,
    skills: skills.map(s => ({
      name: s.name,
      category: s.category,
      description: s.description,
      version: s.version,
      maturity: s.maturity,
      risk: s.risk,
      trustTier: s.trustTier,
      capabilities: s.capabilities,
      sideEffects: s.sideEffects,
      path: s.path,
    })),
  };

  const json = JSON.stringify(data, null, 2) + '\n';

  if (write) {
    await fs.writeFile(outputPath, json, 'utf8');
    console.log(`[generate-site-data] Wrote ${outputPath} (${skills.length} skills)`);
  } else {
    console.log(`[generate-site-data] Would write ${outputPath}`);
    console.log(`[generate-site-data] ${skills.length} skills, ${categories.length} categories`);
  }
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
