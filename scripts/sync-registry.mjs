#!/usr/bin/env node
// sync-bundle.mjs improved - generates registry projections from registry.yaml
// Usage: node scripts/sync-registry.mjs [--write]

import fs from 'node:fs/promises';
import path from 'node:path';

const repoRoot = process.cwd();
const registryPath = path.join(repoRoot, 'registry.yaml');
const claudePluginDir = path.join(repoRoot, '.claude-plugin');
const claudeSkillsDir = path.join(repoRoot, '.claude', 'skills');
const opencodeDir = path.join(repoRoot, '.opencode');
const docsDir = path.join(repoRoot, 'docs');
const agentsSkillsDir = path.join(repoRoot, '.agents', 'skills');

const write = process.argv.includes('--write');
const dryRun = !write;

function parseYaml(text) {
  const data = {};
  for (const line of text.split(/\r?\n/)) {
    const match = line.match(/^([A-Za-z][A-Za-z0-9_-]*):\s*(.*)$/);
    if (!match) continue;
    const key = match[1];
    let value = match[2].trim();
    if (value === '') value = null;
    else if (value === 'true') value = true;
    else if (value === 'false') value = false;
    else if (value.startsWith('[') && value.endsWith(']')) {
      value = value.slice(1, -1).split(',').map(v => v.trim().replace(/^["']|["']$/g, ''));
    }
    data[key] = value;
  }
  return data;
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
      const fmMatch = text.match(/^---\s*\n([\s\S]*?)\n---\s*\n/);
      const fm = fmMatch ? parseYaml(fmMatch[1]) : {};
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
        path: path.relative(repoRoot, child),
      });
    } else {
      await collectSkills(child, out);
    }
  }
  return out;
}

async function main() {
  console.log(`[sync-registry] Mode: ${dryRun ? 'DRY-RUN' : 'WRITE'}`);

  const registryText = await fs.readFile(registryPath, 'utf8');
  const registry = parseYaml(registryText);

  const skills = await collectSkills(agentsSkillsDir);
  console.log(`[sync-registry] Discovered ${skills.length} skills`);

  // Group by category
  const byCategory = {};
  for (const skill of skills) {
    const cat = skill.category;
    if (!byCategory[cat]) byCategory[cat] = [];
    byCategory[cat].push(skill);
  }

  // Generate Claude Code marketplace.json
  const marketplace = {
    name: registry.name,
    owner: {
      name: registry.author,
      url: registry.repository,
    },
    metadata: {
      description: registry.description,
      version: registry.bundleVersion || registry.version,
      license: registry.license,
      repository: registry.repository,
    },
    plugins: Object.entries(byCategory).map(([category, categorySkills]) => ({
      name: `quirk-${category}`,
      description: `Quirk ${category} skills`,
      version: registry.bundleVersion || registry.version,
      skillsDir: `.agents/skills/${category}`,
      skills: categorySkills.map(s => ({
        name: s.name,
        description: s.description,
        category: s.category,
        version: s.version,
        maturity: s.maturity,
        risk: s.risk,
        trustTier: s.trustTier,
        capabilities: s.capabilities,
        sideEffects: s.sideEffects,
        path: s.path,
      })),
    })),
    skillsDir: registry.skillsDir,
  };

  const marketplacePath = path.join(claudePluginDir, 'marketplace.json');
  if (write) {
    await fs.writeFile(marketplacePath, JSON.stringify(marketplace, null, 2) + '\n');
    console.log(`[sync-registry] Wrote ${marketplacePath}`);
  } else {
    console.log(`[sync-registry] Would write ${marketplacePath}`);
  }

  // Generate CATALOG.md
  const catalogLines = [
    '# Quirk Skills Catalog',
    '',
    `> Generated from ${registry.name} v${registry.bundleVersion || registry.version}`,
    `> ${skills.length} skills across ${Object.keys(byCategory).length} categories`,
    '',
    '## Skills by Category',
    '',
  ];

  for (const [category, categorySkills] of Object.entries(byCategory).sort((a, b) => a[0].localeCompare(b[0]))) {
    catalogLines.push(`### ${category}`);
    catalogLines.push('');
    catalogLines.push('| Skill | Version | Maturity | Risk | Trust Tier | Description |');
    catalogLines.push('|-------|---------|----------|------|------------|-------------|');
    for (const s of categorySkills.sort((a, b) => a.name.localeCompare(b.name))) {
      const desc = s.description.length > 80 ? s.description.slice(0, 77) + '...' : s.description;
      catalogLines.push(`| [${s.name}](${s.path}) | ${s.version} | ${s.maturity} | ${s.risk} | ${s.trustTier} | ${desc} |`);
    }
    catalogLines.push('');
  }

  const catalogPath = path.join(repoRoot, 'CATALOG.md');
  if (write) {
    await fs.writeFile(catalogPath, catalogLines.join('\n') + '\n');
    console.log(`[sync-registry] Wrote ${catalogPath}`);
  } else {
    console.log(`[sync-registry] Would write ${catalogPath}`);
  }

  // Regenerate .claude/skills/ symlinks if missing
  let symlinksCreated = 0;
  for (const skill of skills) {
    const linkPath = path.join(claudeSkillsDir, skill.name);
    if (!(await exists(linkPath))) {
      if (write) {
        await fs.symlink(
          path.relative(claudeSkillsDir, path.join(repoRoot, skill.path)),
          linkPath
        );
        console.log(`[sync-registry] Created symlink .claude/skills/${skill.name} -> ${skill.path}`);
      } else {
        console.log(`[sync-registry] Would create symlink .claude/skills/${skill.name} -> ${skill.path}`);
      }
      symlinksCreated++;
    }
  }
  console.log(`[sync-registry] Symlinks: ${symlinksCreated} would be created`);

  // Generate llms.txt
  const llmsLines = [
    '# Quirk Skills - Agent Discovery Entrypoint',
    '',
    `> ${skills.length} skills for AI coding agents. Source: ${registry.repository}`,
    '',
    '## Quick Install',
    '',
    `\`\`\`bash`,
    `npx skills-quirk add quirk-skills`,
    `\`\`\``,
    '',
    '## Skills Index',
    '',
  ];
  for (const skill of skills.sort((a, b) => a.name.localeCompare(b.name))) {
    llmsLines.push(`- [${skill.name}](./${skill.path}/SKILL.md) — ${skill.description}`);
  }
  llmsLines.push('');
  llmsLines.push('## Categories');
  llmsLines.push('');
  for (const cat of Object.keys(byCategory).sort((a, b) => a.localeCompare(b))) {
    llmsLines.push(`- ${cat}: ${byCategory[cat].length} skills`);
  }

  const llmsPath = path.join(repoRoot, 'llms.txt');
  if (write) {
    await fs.writeFile(llmsPath, llmsLines.join('\n') + '\n');
    console.log(`[sync-registry] Wrote ${llmsPath}`);
  } else {
    console.log(`[sync-registry] Would write ${llmsPath}`);
  }

  if (dryRun) {
    console.log('\n[sync-registry] Dry-run complete. Re-run with --write to apply changes.');
  }
}

main().catch(err => {
  console.error('[sync-registry] Error:', err);
  process.exit(1);
});
