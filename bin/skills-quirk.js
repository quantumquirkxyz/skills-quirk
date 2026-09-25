#!/usr/bin/env node
// skills-quirk.js - NPX CLI for Quirk Skills bundle
// Usage: skills-quirk <command> [options]

import fs from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';

const root = process.cwd();

function parseArgs(args) {
  const out = { command: args[0], args: args.slice(1), flags: {} };
  for (let i = 1; i < args.length; i++) {
    const arg = args[i];
    if (arg.startsWith('--')) {
      const key = arg.slice(2);
      const next = args[i + 1];
      if (next && !next.startsWith('--')) {
        out.flags[key] = next;
        i++;
      } else {
        out.flags[key] = true;
      }
    }
  }
  return out;
}

function resolveScript(command) {
  const scripts = {
    'list': '.agents/skills/platform/skill-lab.mjs list',
    'search': '.agents/skills/platform/skill-lab.mjs search',
    'validate': '.agents/skills/platform/validate-skills.mjs',
    'audit': '.agents/skills/platform/audit-semantics.mjs',
    'score': '.agents/skills/platform/quality-scorer.mjs',
    'security': '.agents/skills/platform/security-scanner.mjs',
    'graph': '.agents/skills/platform/dependency-graph.mjs',
    'test': '.agents/skills/platform/evaluate-fixtures.mjs',
    'mcp': '.agents/skills/platform/mcp-server/mcp-skills-server.mjs',
    'evolve': '.agents/skills/platform/skill-evolver.mjs',
    'audit-trail': '.agents/skills/platform/audit-trail.mjs',
    'metrics': '.agents/skills/platform/skill-lab.mjs metrics',
    'sync': 'scripts/sync-registry.mjs',
    'catalog': 'scripts/generate-site-data.mjs',
    'install': 'scripts/install-quirk-skills.sh',
  };
  return scripts[command] || null;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const command = args.command;

  if (!command || command === 'help' || command === '--help') {
    console.log(`
⚡ Quirk Skills CLI v1.0.0

Usage: skills-quirk <command> [options]

Commands:
  list                  List all skills in the bundle
  search <query>        Search skills by name/description/capability
  validate              Validate skills structure and lockfile
  audit                 Audit semantics and naming conventions
  score <skill>         Calculate quality score (0-100) for a skill
  security <skill>      Scan a skill for security risks
  graph                 Generate skill dependency graph
  test                  Run behavioral, regression, and security fixtures
  mcp                   Start MCP server for skills registry
  evolve <skill>        Evidence-gated skill evolution
  audit-trail           Query skill lifecycle audit trail
  metrics               Generate skill bundle metrics
  sync [--write]        Sync registry.yaml to marketplace.json and catalog
  catalog [--write]     Generate site/src/skills.json
  install               Install the bundle into a target repo

Examples:
  skills-quirk list
  skills-quirk search "react testing"
  skills-quirk score skill-creator
  skills-quirk security implement
  skills-quirk graph --format mermaid
  skills-quirk sync --write
  skills-quirk mcp --stdio
`);
    return;
  }

  const script = resolveScript(command);
  if (!script) {
    console.error(`Unknown command: ${command}`);
    console.error('Run `skills-quirk help` for available commands.');
    process.exit(1);
  }

  const scriptPath = path.join(root, script);
  const scriptArgs = args.args;

  if (script.endsWith('.sh')) {
    const proc = spawn('bash', [scriptPath, ...scriptArgs], { stdio: 'inherit' });
    proc.on('exit', (code) => process.exit(code || 0));
  } else if (script.endsWith('.mjs')) {
    const proc = spawn('node', [scriptPath, ...scriptArgs], { stdio: 'inherit' });
    proc.on('exit', (code) => process.exit(code || 0));
  }
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
