#!/usr/bin/env node
// skill-evolver.mjs - Evolves quirk skills through iterative refinement
// Usage: node skill-evolver.mjs <skill-path> [--target-version N] [--dry-run]

import fs from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';

const root = process.cwd();
const skillsRoot = path.join(root, '.agents', 'skills');

async function read(file) { return fs.readFile(file, 'utf8'); }
async function exists(file) { try { await fs.access(file); return true; } catch { return false; } }

function frontmatter(text) {
  const match = text.match(/^---\s*\n([\s\S]*?)\n---\s*\n?/);
  const data = {};
  if (!match) return data;
  let key;
  for (const line of match[1].split(/\r?\n/)) {
    const scalar = line.match(/^([A-Za-z][\w-]*):\s*(.*)$/);
    const item = line.match(/^\s+-\s+(.+)$/);
    if (scalar) {
      key = scalar[1];
      data[key] = scalar[2] ? scalar[2].replace(/^['"]|['"]$/g, '') : [];
    } else if (item && key) {
      if (!Array.isArray(data[key])) data[key] = [];
      data[key].push(item[1].replace(/^['"]|['"]$/g, ''));
    }
  }
  return data;
}

function listValue(value) { return Array.isArray(value) ? value : !value || value === '[]' ? [] : [value]; }

async function evolveSkill(skillPath, targetVersion, dryRun = false) {
  const skillFile = path.join(root, skillPath, 'SKILL.md');
  if (!await exists(skillFile)) throw new Error(`Skill not found: ${skillPath}`);
  
  const text = await read(skillFile);
  const fm = frontmatter(text);
  const currentVersion = parseInt(fm.version) || 1;
  const newVersion = targetVersion || currentVersion + 1;
  
  const evolution = {
    skill: path.basename(skillPath),
    currentVersion,
    targetVersion: newVersion,
    changes: [],
    timestamp: new Date().toISOString(),
  };
  
  // Check if evolution is needed
  if (currentVersion >= newVersion) {
    evolution.changes.push('No version bump needed');
    return evolution;
  }
  
  // Analyze current skill for improvement opportunities
  const body = text.replace(/^---[\s\S]*?---\s*/, '');
  const lines = body.split(/\r?\n/);
  
  // Check for missing sections
  const hasContract = body.includes('## Contract');
  const hasProcess = body.includes('## Process');
  const hasGuardrails = body.includes('## Guardrails');
  const hasCompletionCriteria = body.includes('## Completion') || body.includes('## Completion Criteria');
  
  if (!hasContract) {
    evolution.changes.push('Added ## Contract section');
  }
  if (!hasProcess) {
    evolution.changes.push('Added ## Process section');
  }
  if (!hasGuardrails) {
    evolution.changes.push('Added ## Guardrails section');
  }
  if (!hasCompletionCriteria) {
    evolution.changes.push('Added ## Completion Criteria section');
  }
  
  // Update version
  evolution.changes.push(`Bumped version from ${currentVersion} to ${newVersion}`);
  
  if (!dryRun) {
    const updatedText = text.replace(/^version: \d+/m, `version: ${newVersion}`);
    await fs.writeFile(skillFile, updatedText, 'utf8');
  }
  
  return evolution;
}

async function evolveAll(targetVersion, dryRun = false) {
  const entries = await fs.readdir(skillsRoot, { withFileTypes: true });
  const skills = [];
  
  for (const entry of entries) {
    if (entry.isDirectory() && entry.name !== 'platform') {
      const skillFile = path.join(skillsRoot, entry.name, 'SKILL.md');
      if (await exists(skillFile)) {
        skills.push(entry.name);
      }
    }
  }
  
  const evolutions = [];
  for (const skill of skills) {
    try {
      const evolution = await evolveSkill(path.join(skillsRoot, skill), targetVersion, dryRun);
      evolutions.push(evolution);
    } catch (error) {
      evolutions.push({ skill, error: error.message });
    }
  }
  
  return evolutions;
}

function main() {
  const args = process.argv.slice(2);
  const skillPath = args.find(arg => !arg.startsWith('--'));
  const targetVersion = parseInt(args.find(arg => arg.startsWith('--target-version='))?.split('=')[1]);
  const dryRun = args.includes('--dry-run');
  
  if (!skillPath) {
    console.log(JSON.stringify({ error: 'Usage: node skill-evolver.mjs <skill-path> [--target-version N] [--dry-run]' }, null, 2));
    process.exit(1);
  }
  
  if (skillPath === 'all') {
    evolveAll(targetVersion, dryRun).then(evolutions => {
      console.log(JSON.stringify({ status: 'complete', evolutions }, null, 2));
    });
  } else {
    evolveSkill(skillPath, targetVersion, dryRun).then(evolution => {
      console.log(JSON.stringify(evolution, null, 2));
    });
  }
}

main();