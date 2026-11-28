#!/usr/bin/env node
// generate-site-data.mjs - Generates site/src/skills.json from the skills bundle
// Usage: node generate-site-data.mjs [--write] [--check]

import fs from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const skillsRoot = path.join(root, '.agents', 'skills');
const outputPath = path.join(root, 'site', 'src', 'skills.json');
const write = process.argv.includes('--write');
const check = process.argv.includes('--check');

function foldBlock(style, lines) {
  if (style === '|') return lines.join('\n').trim();
  return lines.join('\n')
    .replace(/\n(?!\n)/g, ' ')
    .replace(/\n\n/g, '\n')
    .trim();
}

function parseFrontmatter(text) {
  if (!text.startsWith('---')) return {};
  const end = text.indexOf('\n---', 3);
  if (end === -1) return {};
  const out = {};
  let active = null;
  let block = null;
  const finishBlock = () => {
    if (!block) return;
    out[block.key] = foldBlock(block.style, block.lines);
    block = null;
  };
  for (const line of text.slice(4, end).split(/\r?\n/)) {
    if (block) {
      if (/^\s{2,}/.test(line) || line.trim() === '') {
        block.lines.push(line.replace(/^\s{2}/, ''));
        continue;
      }
      finishBlock();
    }
    const key = line.match(/^([A-Za-z][A-Za-z0-9-]*):\s*(.*)$/);
    if (key) {
      active = key[1];
      const value = key[2];
      if (/^[>|][+-]?$/.test(value)) {
        block = { key: active, style: value[0], lines: [] };
        continue;
      }
      out[active] = value === '' || value === '[]' ? [] : value.replace(/^["']|["']$/g, '');
      continue;
    }
    const item = line.match(/^\s+-\s+(.+)$/);
    if (item && active) {
      if (!Array.isArray(out[active])) out[active] = [];
      out[active].push(item[1].replace(/^["']|["']$/g, ''));
    }
  }
  finishBlock();
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

// Sort skills by name for deterministic output ordering
// Uses code-unit comparison (not locale-aware) for deterministic ordering
function sortSkills(skills) {
  return [...skills].sort((a, b) => {
    const na = a.name;
    const nb = b.name;
    for (let i = 0; i < Math.min(na.length, nb.length); i++) {
      if (na.charCodeAt(i) !== nb.charCodeAt(i)) {
        return na.charCodeAt(i) - nb.charCodeAt(i);
      }
    }
    return na.length - nb.length;
  });
}

async function main() {
  console.log('[generate-site-data] Collecting skills...');
  const skills = sortSkills(await collectSkills(skillsRoot));
  const categories = [...new Set(skills.map(s => s.category))].sort();

  const data = {
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
      capabilities: [...s.capabilities].sort(),
      sideEffects: s.sideEffects,
      path: s.path,
    })),
  };

  const json = JSON.stringify(data, null, 2) + '\n';

  if (check) {
    // Deterministic drift check: compare generated data against existing file
    // using a deep structural comparison of all fields
    try {
      const existingJson = await fs.readFile(outputPath, 'utf8');
      const existingData = JSON.parse(existingJson);

      const driftReasons = [];

      // Compare top-level fields
      if (existingData.totalSkills !== data.totalSkills) {
        driftReasons.push(`totalSkills mismatch (existing: ${existingData.totalSkills}, generated: ${data.totalSkills})`);
      }
      if (existingData.categories.join(',') !== data.categories.join(',')) {
        driftReasons.push('categories mismatch');
      }

      // Compare each skill with full field comparison
      // Handle case where skill counts differ
      const maxLen = Math.max(existingData.skills.length, data.skills.length);

      for (let i = 0; i < maxLen; i++) {
        const gen = data.skills[i];
        const existing = existingData.skills[i];

        if (!existing) {
          driftReasons.push(`skill "${gen.name}" missing from existing data at index ${i}`);
          continue;
        }

        if (gen.name !== existing.name) {
          driftReasons.push(`skill "${gen.name}" name mismatch (existing: "${existing.name}") at index ${i}`);
        }
        if (gen.category !== existing.category) {
          driftReasons.push(`skill "${gen.name}" category mismatch (existing: "${existing.category}") at index ${i}`);
        }
        if (gen.description !== existing.description) {
          driftReasons.push(`skill "${gen.name}" description mismatch at index ${i}`);
        }
        if (gen.version !== existing.version) {
          driftReasons.push(`skill "${gen.name}" version mismatch (existing: "${existing.version}") at index ${i}`);
        }
        if (gen.maturity !== existing.maturity) {
          driftReasons.push(`skill "${gen.name}" maturity mismatch (existing: "${existing.maturity}") at index ${i}`);
        }
        if (gen.risk !== existing.risk) {
          driftReasons.push(`skill "${gen.name}" risk mismatch (existing: "${existing.risk}") at index ${i}`);
        }
        if (gen.trustTier !== existing.trustTier) {
          driftReasons.push(`skill "${gen.name}" trustTier mismatch (existing: "${existing.trustTier}") at index ${i}`);
        }
        if (gen.sideEffects.length !== existing.sideEffects.length) {
          driftReasons.push(`skill "${gen.name}" sideEffects length mismatch (existing: ${existing.sideEffects.length}) at index ${i}`);
        } else {
          for (let j = 0; j < gen.sideEffects.length; j++) {
            if (gen.sideEffects[j] !== existing.sideEffects[j]) {
              driftReasons.push(`skill "${gen.name}" sideEffect[${j}] mismatch at index ${i}`);
              break;
            }
          }
        }
        // Compare capabilities as arrays in generated order for order-drift detection.
// Both generated and committed are sorted identically (same sort function),
// so this detects: (a) missing/extra capabilities, (b) capability order changes
// if the committed file was manually reordered outside the sort.
        // Compare capabilities in generated order (position-sensitive).
        // Both generated and committed are sorted identically, so this detects
        // missing/extra capabilities and any order drift from manual editing.
        for (let j = 0; j < Math.max(gen.capabilities.length, existing.capabilities.length); j++) {
          const genCap = gen.capabilities[j];
          const existingCap = existing.capabilities[j];
          if (genCap !== existingCap) {
            // Check if it's a length mismatch or order drift
            if (j >= gen.capabilities.length) {
              driftReasons.push(`skill "${gen.name}" capability missing at index ${j} (existing has "${existingCap}")`);
            } else if (j >= existing.capabilities.length) {
              driftReasons.push(`skill "${gen.name}" extra capability at index ${j}: "${genCap}"`);
            } else {
              driftReasons.push(`skill "${gen.name}" capability order drift at index ${j}: expected "${existingCap}", got "${genCap}"`);
            }
            break; // report first order drift found per skill
          }
        }
        if (gen.path !== existing.path) {
          driftReasons.push(`skill "${gen.name}" path mismatch (existing: "${existing.path}") at index ${i}`);
        }
      }

      // Check for extra skills in existing data
      if (existingData.skills.length > data.skills.length) {
        for (let i = data.skills.length; i < existingData.skills.length; i++) {
          driftReasons.push(`extra skill "${existingData.skills[i].name}" in existing data at index ${i} not in generated`);
        }
      }

      if (driftReasons.length > 0) {
        console.error('[generate-site-data] DRIFT DETECTED:');
        for (const reason of driftReasons) {
          console.error(`  - ${reason}`);
        }
        console.error('[generate-site-data] Run node generate-site-data.mjs --write to regenerate site/src/skills.json');
        process.exit(1);
      } else {
        console.log('[generate-site-data] Drift check passed: site/src/skills.json is up to date');
        process.exit(0);
      }
    } catch (e) {
      if (e.code === 'ENOENT') {
        console.error('[generate-site-data] DRIFT DETECTED: site/src/skills.json does not exist. Run node generate-site-data.mjs --write to generate it.');
        process.exit(1);
      }
      console.error('Error during drift check:', e);
      process.exit(1);
    }
  } else if (write) {
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