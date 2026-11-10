#!/usr/bin/env node
// skills-quirk.js - Local CLI for the Quirk Skills bundle (run with: node bin/skills-quirk.js <command>)
// Usage: node bin/skills-quirk.js <command> [options]

import fs from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const bundleRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const consumerCwd = process.cwd();

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

async function readVersion() {
  try {
    const pkg = JSON.parse(await fs.readFile(path.join(bundleRoot, 'package.json'), 'utf8'));
    if (pkg.version) return pkg.version;
  } catch {}
  try { return (await fs.readFile(path.join(bundleRoot, 'VERSION'), 'utf8')).trim(); } catch {}
  return 'unknown';
}

function resolveCommand(command, commandArgs) {
  const commands = {
    'list': { script: '.agents/skills/platform/skill-lab.mjs', args: ['list'] },
    'search': { script: '.agents/skills/platform/skill-lab.mjs', args: ['search'] },
    'validate': { script: '.agents/skills/platform/validate-skills.mjs' },
    'audit': { script: '.agents/skills/platform/audit-semantics.mjs' },
    'score': { script: '.agents/skills/platform/quality-scorer.mjs' },
    'security': { script: '.agents/skills/platform/security-scanner.mjs' },
    'graph': { script: '.agents/skills/platform/dependency-graph.mjs' },
    'test': { script: '.agents/skills/platform/evaluate-fixtures.mjs' },
    'mcp': { script: '.agents/skills/platform/mcp-server/mcp-skills-server.mjs' },
    'evolve': { script: '.agents/skills/platform/skill-evolver.mjs' },
    'audit-trail': { script: '.agents/skills/platform/audit-trail.mjs' },
    'metrics': { script: '.agents/skills/platform/skill-lab.mjs', args: ['metrics'] },
    'sync': { script: 'scripts/sync-registry.mjs' },
    'catalog': { script: 'scripts/generate-site-data.mjs' },
    'install': { script: 'scripts/install-quirk-skills.sh', cwd: consumerCwd },
    // Safe repository adoption: inspect first, then opt in to --write.
    'adopt': { script: '.agents/skills/platform/sync-bundle.mjs', args: [consumerCwd] },
    'verify-install': { script: 'scripts/manage-adoption.mjs', args: ['verify'], cwd: consumerCwd },
    'upgrade': { script: 'scripts/manage-adoption.mjs', args: ['upgrade'], cwd: consumerCwd },
    'rollback': { script: 'scripts/manage-adoption.mjs', args: ['rollback'], cwd: consumerCwd },
    'uninstall': { script: 'scripts/manage-adoption.mjs', args: ['uninstall'], cwd: consumerCwd },
    'issue-meta': { script: 'scripts/apply-issue-metadata.mjs', cwd: consumerCwd },
  };
  if (command === 'add') {
    if (commandArgs[0] !== 'quirk-skills') return null;
    // npx-generated install alias; it sets up the bundle in the caller's current repo.
    return { script: 'scripts/setup-quirk-skills.sh', args: [consumerCwd, bundleRoot], cwd: consumerCwd, skipUserArgs: 1 };
  }
  return commands[command] || null;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const command = args.command;

  if (!command || command === 'help' || command === '--help') {
    const version = await readVersion();
    console.log(`
⚡ Quirk Skills CLI v${version}

Usage: node bin/skills-quirk.js <command> [options]

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
  install               Legacy greenfield installer (replaces managed paths)
  adopt [--write]        Safely preview or sync into the current project
  verify-install         Verify the managed installation manifest and drift
  upgrade [--write]      Preview or apply a backed-up managed upgrade
  rollback [--write]     Preview or restore the latest pre-upgrade state
  uninstall [--write]    Preview or conservatively remove unchanged managed files
  issue-meta             Preview/apply assignees, labels, milestone, project, relationships, and Development linkage
  add quirk-skills      Install/setup the bundle into the current repo
  version               Print CLI version

Examples:
  node bin/skills-quirk.js list
  node bin/skills-quirk.js search "react testing"
  node bin/skills-quirk.js score skill-creator
  node bin/skills-quirk.js security implement
  node bin/skills-quirk.js graph --format mermaid
  node bin/skills-quirk.js sync --write
  node bin/skills-quirk.js mcp --stdio
  node bin/skills-quirk.js adopt
  node bin/skills-quirk.js adopt --write
  node bin/skills-quirk.js verify-install
  node bin/skills-quirk.js upgrade
  node bin/skills-quirk.js upgrade --write
  node bin/skills-quirk.js rollback
  node bin/skills-quirk.js rollback --write
  node bin/skills-quirk.js uninstall
  node bin/skills-quirk.js uninstall --write
  node bin/skills-quirk.js issue-meta --repo owner/repo --issue 123 --metadata issue.json
  node bin/skills-quirk.js issue-meta --repo owner/repo --issue 123 --metadata issue.json --write
`);
    return;
  }

  if (command === 'version' || command === '--version') {
    console.log(await readVersion());
    return;
  }

  const resolved = resolveCommand(command, args.args);
  if (!resolved) {
    console.error(`Unknown command: ${command}`);
    console.error('Run `node bin/skills-quirk.js help` for available commands.');
    process.exit(1);
  }

  const scriptPath = path.join(bundleRoot, resolved.script);
  const scriptArgs = [...(resolved.args || []), ...args.args.slice(resolved.skipUserArgs || 0)];
  const cwd = resolved.cwd || bundleRoot;

  if (resolved.script.endsWith('.sh')) {
    const proc = spawn('bash', [scriptPath, ...scriptArgs], { cwd, stdio: 'inherit' });
    proc.on('exit', (code) => process.exit(code || 0));
  } else if (resolved.script.endsWith('.mjs')) {
    const proc = spawn('node', [scriptPath, ...scriptArgs], { cwd, stdio: 'inherit' });
    proc.on('exit', (code) => process.exit(code || 0));
  }
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
